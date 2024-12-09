import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

const FeatureHighlights = (props: Props) => {
    return (
        <div
            className={cn(
                "flex z-10 flex-col lg:flex-row  mx-auto max-w-screen-lg w-full rounded-[20px] bg-white/[0.5] backdrop-blur-3xl gap-10 py-12 px-4 md:py-12 md:px-12",
                props.className,
            )}
        >
            <div className="flex flex-col gap-4">
                <h2 className="text-brand w-fit font-semibold text-center text-sm">FINANCE ASSISTANT</h2>
                <div className="flex flex-col gap-6 md:gap-8">
                    <h3 className="text-slate-800 w-fit font-semibold text-xl md:text-2xl/[150%]   ">
                        Log your daily transactions with ease, and keep track of your money.
                    </h3>

                    <div className="flex flex-col gap-5">
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-brand" />
                            <p className="text-slate-600 w-fit text-base/[24px]">
                                Transform your voice into organized finances - Simply speak your transactions and let AI handle the
                                bookkeeping details.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-brand" />
                            <p className="text-slate-600 w-fit text-base/[24px]">
                                Smart categorization that learns from you - Our AI automatically categorizes expenses while adapting to your
                                custom preferences.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-brand" />
                            <p className="text-slate-600 w-fit text-base/[24px]">
                                Track spending across multiple currencies with real-time insights and beautiful visualizations of your
                                financial journey.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-brand" />
                            <p className="text-slate-600 w-fit text-base/[24px]">
                                Save hours on data entry - Convert text receipts and voice notes into structured transactions instantly.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Check className="w-6 h-6 text-brand" />
                            <p className="text-slate-600 w-fit text-base/[24px]">
                                Secure, intelligent bookkeeping for modern professionals - Manage your finances with confidence using
                                advanced AI assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Image
                src={"/assets/illustrations/feature-highlight.png"}
                alt="feature-highlight"
                width={391}
                height={391}
                className="border shrink-0 border-brand/[0.07] h-fit rounded-[20px] overflow-hidden object-cover"
            />
        </div>
    );
};

export default FeatureHighlights;
