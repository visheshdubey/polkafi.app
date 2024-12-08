"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";

import { get } from "lodash";
import { useRouter } from "next/navigation";

type Props = {};

const ProfileMenu = (props: Props) => {
    const router = useRouter();
    const { data: session } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-7">
                    <AvatarImage src={get(session, "user.image")} />
                    <AvatarFallback>{get(session, "user.name", "Polka Fi")?.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/settings")}>My Account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>Request credits</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Feedbacks</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
