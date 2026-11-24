import Hero from "@/components/home/Hero";
import UspStrip from "@/components/home/UspStrip";
import WorkshopsSlider from "@/components/home/WorkshopsSlider";
import StudioSection from "@/components/home/StudioSection";
import Journal from "@/components/home/Journal";

export default function Home() {
  return (
    <>
      <Hero />
      <UspStrip />
      <WorkshopsSlider />
      <StudioSection />
      {/* Reviews stay hidden until there are real ones (components/home/Reviews.tsx). */}
      <Journal />
    </>
  );
}
