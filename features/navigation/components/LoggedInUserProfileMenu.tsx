import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {};

const ProfileMenu = (props: Props) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="size-7">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>PF</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>My Account</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Update Categories</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Request credits</DropdownMenuItem>
                <DropdownMenuItem>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProfileMenu;
