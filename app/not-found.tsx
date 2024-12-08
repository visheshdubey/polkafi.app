import { ArrowUpRight } from "lucide-react";
import BackgroundGradient from "@/features/marketing/components/BackgroundGradient";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <div className="max-w-screen-xl relative flex flex-col items-center justify-center gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-[calc(100vh-64px)]">
            <h2 className="text-2xl font-bold">Not Found</h2>
            <p className="text-muted-foreground text-sm text-center">Could not find requested resource</p>
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "flex items-center gap-1 z-10 mt-4 bg-white/20 backdrop-blur-md rounded-full shadow-none",
                )}
            >
                Return Home
                <ArrowUpRight />
            </Link>
            <BackgroundGradient />
        </div>
    );
}
