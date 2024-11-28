import { cn } from "@/lib/utils/shadcn";

type Props = {
    className?: string;
};

const BrandLogo = (props: Props) => {
    return <span className={cn("text-brand text-base tracking-tighter font-semibold", props.className)}>Polka fi.</span>;
};

export default BrandLogo;
