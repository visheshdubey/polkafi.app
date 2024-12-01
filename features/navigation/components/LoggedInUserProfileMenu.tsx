"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const ProfileMenu = (props: Props) => {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-7">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>PF</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/settings")}>My Account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>Request credits</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
