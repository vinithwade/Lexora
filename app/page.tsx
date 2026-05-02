import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { DeviceSync } from "@/components/landing/DeviceSync";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Testimonial } from "@/components/landing/Testimonial";
import { Pricing } from "@/components/landing/Pricing";
import { Blog } from "@/components/landing/Blog";
import { Community } from "@/components/landing/Community";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { MorningMock, EveningMock } from "@/components/landing/Visuals";

export default function Landing() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <TrustBar />
      <DeviceSync />

      <FeatureSection
        eyebrow="Daily Planning"
        title={<>Keep every day<br/>moving forward</>}
        body={<><strong className="text-zinc-900">Plan, lock in, and ship.</strong> A 90-second voice call with Lexora extracts your top 3-5 priorities and pins them to your dashboard for the rest of the day.</>}
        pills={["Voice-first", "AI extraction", "Live captions", "Streak guard"]}
        visual={<MorningMock />}
      />

      <FeatureSection
        reverse
        eyebrow="Daily Review"
        title={<>Close the loop,<br/>build the streak</>}
        body={<><strong className="text-zinc-900">Walk the day, score the wins.</strong> The evening AI walks every task, marks it honestly, and either ticks the streak or resets it. No spinning, no guilt, just clarity.</>}
        pills={["Per-task score", "AI summary", "Streak math", "Insights"]}
        visual={<EveningMock />}
      />

      <FeatureGrid />
      <Testimonial />
      <Pricing />
      <Blog />
      <Community />
      <CTASection />
      <Footer />
    </main>
  );
}
