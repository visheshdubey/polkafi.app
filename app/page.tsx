import BackgroundGradient from "@/features/marketing/components/BackgroundGradient";
import FeatureHighlights from "@/features/marketing/components/FeatureHighlights";
import Footer from "@/features/marketing/components/Footer";
import Hero from "@/features/marketing/components/Hero";
import TryNowForFree from "@/features/marketing/components/TryNowForFree";
export default function Home() {
    return (
        <div className="relative min-h-screen">
            <div className="max-w-screen-xl mx-auto relative z-10">
                <Hero />
                <FeatureHighlights className="my-24" />
                <TryNowForFree className="my-24" />
                <Footer className="mt-24" />
            </div>
            <BackgroundGradient />
        </div>
    );
}
