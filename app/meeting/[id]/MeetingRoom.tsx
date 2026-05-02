"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

type Caption = { who: "user" | "ai"; text: string };

export default function MeetingRoom({
  meetingId, type, userName,
}: { meetingId: string; type: "morning" | "evening"; userName: string }) {
  const router = useRouter();
  const toast = useToast();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const aiPartialRef = useRef<Record<string, string>>({});
  const startedAtRef = useRef<number | null>(null);

  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "ending" | "ended" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [orbLevel, setOrbLevel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);

  // Tick elapsed timer
  useEffect(() => {
    if (status !== "live") return;
    if (startedAtRef.current === null) startedAtRef.current = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - (startedAtRef.current ?? Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("connecting");

        const sessionRes = await fetch("/api/realtime/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meeting_id: meetingId }),
        });
        if (!sessionRes.ok) throw new Error("Failed to start session: " + await sessionRes.text());
        const session = await sessionRes.json();
        const ephemeralKey: string = session?.client_secret?.value;
        if (!ephemeralKey) throw new Error("No ephemeral key returned by OpenAI");
        if (cancelled) return;

        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: { width: 640, height: 480 },
        });
        localStreamRef.current = localStream;
        if (userVideoRef.current) userVideoRef.current.srcObject = localStream;

        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const remoteStream = new MediaStream();
        pc.ontrack = (e) => {
          remoteStream.addTrack(e.track);
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStream;
          setupAudioAnalysis(remoteStream);
        };

        for (const track of localStream.getAudioTracks()) {
          pc.addTrack(track, localStream);
        }

        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;
        dc.addEventListener("message", onModelEvent);
        dc.addEventListener("open", () => {
          send({
            type: "response.create",
            response: {
              modalities: ["audio", "text"],
              instructions:
                type === "morning"
                  ? "Greet the user briefly by name and ask their #1 priority for today."
                  : "Greet the user briefly by name and start the evening review.",
            },
          });
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const baseURL = "https://api.openai.com/v1/realtime";
        const sdpResp = await fetch(`${baseURL}?model=gpt-realtime`, {
          method: "POST",
          body: offer.sdp,
          headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
        });
        if (!sdpResp.ok) throw new Error("SDP exchange failed: " + await sdpResp.text());
        const answerSdp = await sdpResp.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

        if (!cancelled) setStatus("live");
      } catch (e: any) {
        console.error(e);
        if (!cancelled) {
          setErrorMsg(e?.message || "Connection failed");
          setStatus("error");
          toast.error("Couldn't start meeting", e?.message || "Unknown error");
        }
      }
    })();
    return () => { cancelled = true; cleanup(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  function send(obj: any) {
    const dc = dcRef.current;
    if (dc && dc.readyState === "open") dc.send(JSON.stringify(obj));
  }

  async function onModelEvent(ev: MessageEvent) {
    let msg: any;
    try { msg = JSON.parse(ev.data); } catch { return; }
    switch (msg.type) {
      case "input_audio_buffer.speech_started": setAiSpeaking(false); break;
      case "response.audio_transcript.delta": {
        const id = msg.item_id;
        aiPartialRef.current[id] = (aiPartialRef.current[id] || "") + (msg.delta || "");
        setAiSpeaking(true);
        break;
      }
      case "response.audio_transcript.done": {
        const id = msg.item_id;
        const text = (aiPartialRef.current[id] || msg.transcript || "").trim();
        delete aiPartialRef.current[id];
        if (text) { pushCaption("ai", text); persistMessage("assistant", text); }
        break;
      }
      case "conversation.item.input_audio_transcription.completed": {
        const text = (msg.transcript || "").trim();
        if (text) { pushCaption("user", text); persistMessage("user", text); }
        break;
      }
      case "response.output_item.done": {
        const item = msg.item;
        if (item?.type === "function_call") await handleToolCall(item);
        break;
      }
      case "response.done": setAiSpeaking(false); break;
      case "error": console.error("Realtime error", msg); break;
    }
  }

  async function handleToolCall(item: any) {
    const name = item.name;
    const callId = item.call_id;
    let args: any = {};
    try { args = JSON.parse(item.arguments || "{}"); } catch {}

    let resultText = "ok";
    try {
      const r = await fetch("/api/meeting/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meetingId, name, args }),
      });
      const j = await r.json();
      resultText = j.result || (j.error ? `error: ${j.error}` : "ok");
      if (name === "create_tasks" && !j.error) {
        toast.success("Tasks saved", `${args?.tasks?.length || 0} tasks for today`);
      } else if (name === "finish_meeting" && !j.error) {
        toast.success("Day reviewed", j.completion_pct != null ? `${j.completion_pct}% complete` : "");
      }
    } catch (e: any) {
      resultText = `error: ${e?.message || "tool failed"}`;
    }

    send({
      type: "conversation.item.create",
      item: { type: "function_call_output", call_id: callId, output: JSON.stringify({ result: resultText }) },
    });
    send({ type: "response.create" });

    setTimeout(() => endMeeting(), 6000);
  }

  function pushCaption(who: "user" | "ai", text: string) {
    setCaptions(prev => {
      const next = [...prev, { who, text }];
      return next.length > 30 ? next.slice(-30) : next;
    });
  }

  async function persistMessage(role: "user" | "assistant", content: string) {
    try {
      await fetch("/api/meeting/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meetingId, role, content }),
      });
    } catch {}
  }

  function setupAudioAnalysis(stream: MediaStream) {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        setOrbLevel(Math.min(1, rms * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { console.warn("audio analysis unavailable", e); }
  }

  async function endMeeting() {
    if (status === "ending" || status === "ended") return;
    setStatus("ending");
    try {
      await fetch("/api/meeting/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meetingId, status: "completed" }),
      });
    } catch {}
    cleanup();
    setStatus("ended");
    router.replace("/dashboard");
    router.refresh();
  }

  function cleanup() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.getSenders().forEach(s => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
  }

  function toggleMute() {
    const t = localStreamRef.current?.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled; setMuted(!t.enabled);
  }
  function toggleCam() {
    const t = localStreamRef.current?.getVideoTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled; setCamOff(!t.enabled);
  }

  const orbScale = 1 + orbLevel * 0.25;
  const orbGlow = 0.4 + orbLevel * 0.6;

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      {/* Top bar — light */}
      <header className="px-4 sm:px-6 py-3 border-b border-border bg-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-time to-timeDim grid place-items-center shadow-glow">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-fg">Lexora</div>
            <div className="text-xs text-fgSubtle capitalize">{type} meet</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "live" && (
            <>
              <Badge tone="success" dot>Live</Badge>
              <span className="text-xs text-fgMuted tabular-nums">{fmtElapsed(elapsed)}</span>
            </>
          )}
          {status === "connecting" && <Badge tone="info" dot>Connecting</Badge>}
          {status === "ending" && <Badge tone="neutral">Ending</Badge>}
          {status === "error" && <Badge tone="danger" dot>Error</Badge>}
        </div>
      </header>

      {/* Stage — kept dark for video readability (Google Meet / Zoom convention) */}
      <div className="flex-1 grid lg:grid-cols-2 gap-3 p-3 sm:p-4 min-h-0 bg-stage">
        {/* AI tile */}
        <Tile label="Lexora" sub={aiSpeaking ? "Speaking…" : "Listening"}>
          <div className="absolute inset-0 grid place-items-center">
            <div
              className={`h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-gradient-to-br from-time to-timeDim ${aiSpeaking ? "animate-orb-speak" : "animate-orb-idle"}`}
              style={{
                transform: `scale(${orbScale})`,
                boxShadow: `0 0 ${60 + orbLevel * 80}px ${10 + orbLevel * 40}px rgb(var(--time-accent) / ${orbGlow})`,
                transition: "transform 80ms ease-out, box-shadow 80ms ease-out",
              }}
            />
          </div>
        </Tile>

        {/* User tile */}
        <Tile label={userName} sub={muted ? "Muted" : ""}>
          <video
            ref={userVideoRef}
            autoPlay playsInline muted
            className={cn("w-full h-full object-cover", camOff && "opacity-0")}
          />
          {camOff && (
            <div className="absolute inset-0 grid place-items-center">
              <Avatar name={userName} size={120} />
            </div>
          )}
        </Tile>
      </div>

      {/* Captions panel — light, sits between dark stage and light controls */}
      {showCaptions && captions.length > 0 && (
        <div className="px-4 sm:px-6 py-2 max-h-32 overflow-y-auto border-t border-border bg-panel">
          {captions.slice(-4).map((c, i) => (
            <div key={i} className="text-sm py-1.5 leading-relaxed flex gap-2">
              <span className={cn(
                "font-medium flex-shrink-0",
                c.who === "ai" ? "text-time" : "text-fgMuted"
              )}>
                {c.who === "ai" ? "Lexora" : userName}:
              </span>
              <span className={c.who === "ai" ? "text-fg" : "text-fgMuted"}>{c.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls bar — light */}
      <div className="border-t border-border bg-panel px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <ControlButton onClick={toggleMute} active={!muted} icon={muted ? <MicOff size={18} /> : <Mic size={18} />} label={muted ? "Unmute" : "Mute"} danger={muted} />
          <ControlButton onClick={toggleCam} active={!camOff} icon={camOff ? <VideoOff size={18} /> : <Video size={18} />} label={camOff ? "Start video" : "Stop video"} danger={camOff} />
          <ControlButton onClick={() => setShowCaptions(s => !s)} active={showCaptions} icon={<MessageSquare size={18} />} label="Captions" />
          <button
            onClick={endMeeting}
            className="ml-2 inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-danger hover:bg-red-600 text-white font-medium transition-colors"
          >
            <PhoneOff size={18} />
            <span className="hidden sm:inline">End meeting</span>
          </button>
        </div>
        <div className="flex-1" />
      </div>

      <audio ref={remoteAudioRef} autoPlay />

      {status === "error" && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur grid place-items-center px-6 animate-fade-in">
          <div className="rounded-xl bg-panel border border-border p-6 max-w-md text-center shadow-cardHover">
            <div className="h-12 w-12 rounded-full bg-red-50 border border-red-200 grid place-items-center mx-auto mb-4">
              <PhoneOff size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-fg">Couldn't connect</h2>
            <p className="text-sm text-fgMuted mb-5">{errorMsg}</p>
            <Button onClick={() => router.replace("/dashboard")}>Back to dashboard</Button>
          </div>
        </div>
      )}
    </main>
  );
}

function Tile({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl bg-stagePanel border border-stageBorder overflow-hidden min-h-[280px]">
      {children}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-xs text-white">{label}</div>
        {sub && <div className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-xs text-zinc-300">{sub}</div>}
      </div>
    </div>
  );
}

function ControlButton({
  onClick, active, icon, label, danger,
}: { onClick: () => void; active: boolean; icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-12 w-12 rounded-xl grid place-items-center transition-colors border",
        danger ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              : active ? "bg-panel text-fg border-border hover:bg-panel2"
                       : "bg-panel text-fgMuted border-border hover:bg-panel2"
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function fmtElapsed(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
