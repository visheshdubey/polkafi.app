import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

const TryNowForFree = (props: Props) => {
    return (
        <div
            className={cn(
                "flex z-10 mt-12 flex-col bg-white/[0.5] backdrop-blur-3xl  mx-auto max-w-screen-lg w-full rounded-[20px] md:p-12 p-8",
                props.className,
            )}
        >
            <h2 className="text-slate-800 w-fit font-black text-4xl">Try now for free</h2>
            <p className="text-slate-600 w-fit text-base mt-3">
                No credit card required. You get 20 free credits (Zaps) to get you started.
            </p>
            <Button className="text-white rounded-full mt-9 max-w-[240px] font-bold w-full h-11 bg-brand">
                <Link href="/signin">Try Now</Link>
            </Button>
        </div>
    );
};

export default TryNowForFree;
