import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
type Props = {
    className?: string;
};

const Hero = (props: Props) => {
    return (
        <section
            className={cn(
                "flex justify-center min-h-[calc(100vh_-_64px)] sm:min-h-[calc(100vh_-_64px_-_40vh)] gap-6 sm:gap-10 flex-col items-center mt-2 z-10",
                props.className,
            )}
        >
            <div className="bg-brand/[0.04] hidden sm:flex z-10 backdrop-blur-md items-center w-full sm:w-fit px-14 py-2 text-xs sm:text-sm font-medium text-[#080066] rounded-full border border-brand/[0.07]">
                🎉 10 complimentary credits in your account, to get you started!
            </div>
            <div className="px-4 w-full flex sm:hidden">
                <div className="bg-brand/[0.04] z-10 backdrop-blur-md flex items-center w-full px-10 sm:px-14 py-1 sm:py-2 text-sm font-medium text-[#080066] rounded-full border border-brand/[0.07]">
                    🎉 10 complimentary credits
                </div>
            </div>
            <div className="flex z-10 flex-col px-4 lg:px-0 items-center gap-5">
                <h1 className="text-slate-800 w-fit font-extrabold  text-start sm:text-center max-w-screen-lg text-3xl/[130%] sm:text-[48px]/[120%]">
                    Write down your daily transactions to keep track of your money.
                </h1>
                <h2 className="text-slate-600 w-fit text-start sm:text-center max-w-screen-md text-lg/[30px]">
                    Stay on top of your finances by logging your daily transactions with ease.
                </h2>
            </div>
            <div className="w-full flex justify-start sm:justify-center px-4 sm:px-0">
                <Button className="text-white rounded-full max-w-[180px] sm:max-w-[240px] font-bold w-full h-9 sm:h-11 bg-brand">
                    <Link href="/signin">Try Now</Link>
                </Button>
            </div>

            <div className="flex flex-wrap z-10 gap-6 sm:gap-12 *:rounded-full justify-start px-4 sm:px-0 sm:justify-center max-w-screen-md items-center w-full">
                {" "}
                <Button size={"sm"} variant={"outline"} className="bg-transparent shadow-none">
                    Transactions
                    <ArrowUpRight />
                </Button>
                <Button size={"sm"} variant={"outline"} className=" bg-transparent shadow-none">
                    Categories
                    <ArrowUpRight />
                </Button>
                <Button size={"sm"} variant={"outline"} className="bg-transparent shadow-none">
                    Analytics
                    <ArrowUpRight />
                </Button>
            </div>
        </section>
    );
};

export default Hero;
