import BrandLogo from "@/features/brand/components/BrandLogo";
import { Button } from "@/components/ui/button";
import LoggedInUserProfileMenu from "./LoggedInUserProfileMenu";
import { Zap } from "lucide-react";

type Props = {};

const AppBar = (props: Props) => {
    return (
        <nav className="bg-white/20 border border-brand/10 backdrop-blur-md h-14 flex items-center px-4 lg:px-6 lg:rounded-full">
            <BrandLogo />
            <div className="flex ml-auto items-center gap-4">
                <span className="px-2 py-0.5 flex items-center gap-1 rounded-full bg-brand/10 font-semibold text-brand text-xs">
                    <Zap className="size-4" />
                    20
                </span>
                <Button size={"sm"} variant={"outline"} className=" bg-transparent shadow-none px-1.5 py-0.5">
                    Feedbacks
                </Button>
                <LoggedInUserProfileMenu />
            </div>
        </nav>
    );
};

export default AppBar;
