// Sky-blue gradient with soft cloud shapes built from CSS radial gradients.
// No external image — looks like a clear sky with a few wisps.
export function SkyBackground() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #B7D4F2 0%, #D9E7F5 40%, #F1F2F4 100%)",
        }}
      />
      {/* Soft cloud blobs */}
      <Cloud className="top-[14%] left-[6%] w-[280px] h-[120px] opacity-90" />
      <Cloud className="top-[8%] right-[10%] w-[340px] h-[140px] opacity-90" />
      <Cloud className="top-[28%] left-[20%] w-[180px] h-[80px] opacity-70" />
      <Cloud className="top-[40%] right-[18%] w-[220px] h-[90px] opacity-60" />
      {/* Bottom fade to body bg */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(180deg, transparent, #FAFAF9 80%)",
        }}
      />
    </div>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <div
      className={`absolute rounded-full blur-2xl ${className}`}
      style={{ background: "radial-gradient(closest-side, #FFFFFF, rgba(255,255,255,0))" }}
    />
  );
}
