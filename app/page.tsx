import BackgroundGradient from "@/features/marketing/components/BackgroundGradient";
import Hero from "@/features/marketing/components/Hero";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="max-w-screen-xl mx-auto">
        <Hero />
      </div>
      <BackgroundGradient />
    </div>
  );
}
