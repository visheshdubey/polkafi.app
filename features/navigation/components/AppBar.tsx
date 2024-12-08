import { Button, buttonVariants } from "@/components/ui/button";

import BrandLogo from "@/features/brand/components/BrandLogo";
import Link from "next/link";
import LoggedInUserProfileMenu from "./LoggedInUserProfileMenu";
import ZapCounter from "./ZapCounter";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";

type Props = {};

const AppBar = async (props: Props) => {
    const session = await getServerSession();

    return (
        <nav className="bg-white/20 border border-brand/10 backdrop-blur-md h-14 flex items-center px-4 lg:px-6 lg:rounded-full">
            <BrandLogo />
            <div className="flex ml-auto items-center gap-4">
                {session && <ZapCounter />}
                <Button size={"sm"} variant={"outline"} className="bg-transparent hidden lg:block rounded-full shadow-none px-2.5 py-0.5">
                    Feedbacks
                </Button>
                {session ? (
                    <LoggedInUserProfileMenu />
                ) : (
                    <Link
                        href="/signin"
                        className={cn(
                            buttonVariants({
                                variant: "outline",
                                size: "sm",
                            }),
                            "bg-transparent rounded-full border-brand text-brand shadow-none px-2.5 py-0.5",
                        )}
                    >
                        Sign in
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default AppBar;
