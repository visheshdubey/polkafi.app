import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
    children?: ReactNode;
    className?: string;
};

const MagicalGradientCard = (props: Props) => {
    return <div className={cn("p-3 lg:p-6 rounded-xl glass-card-gradient", props.className)}>{props.children}</div>;
};

export default MagicalGradientCard;
