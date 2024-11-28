import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroRecordTransactionWidget from "@/features/marketing/components/HeroRecordTransactionWidget";

type Props = {};

const Hero = (props: Props) => {
    return (
        <section className="flex justify-center min-h-[calc(100vh_-_64px_-_20vh)] gap-10 flex-col items-center mt-2">
            <div className="bg-brand/[0.04] z-10 backdrop-blur-md flex items-center w-fit px-14 py-2 text-sm font-medium text-[#080066] rounded-full border border-brand/[0.07]">
                🎉 10 complimentary credits in your account, to get you started!
            </div>
            <div className="flex z-10 flex-col items-center gap-5">
                <h1 className="text-slate-800 w-fit font-extrabold text-center max-w-screen-lg text-[48px]/[120%]">
                    Write down your daily transactions to keep track of your money.
                </h1>
                <h2 className="text-slate-600 w-fit text-center max-w-screen-md text-lg/[30px]">
                    Stay on top of your finances by logging your daily transactions with ease.
                </h2>
            </div>
            <HeroRecordTransactionWidget />

            <div className="flex  z-10 gap-12 *:rounded-full justify-center max-w-screen-md items-center w-full">
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
