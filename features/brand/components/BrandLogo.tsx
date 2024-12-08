import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/shadcn";

type Props = {
    className?: string;
    logoWidth?: number;
    logoHeight?: number;
};

const BrandLogo = (props: Props) => {
    return (
        <Link href="/" className={cn("text-brand text-base flex items-center gap-1.5 tracking-tighter font-semibold", props.className)}>
            <Image src="/assets/polka-fi-logo.png" alt="Polka fi" width={props.logoWidth || 14} height={props.logoHeight || 14} />
            Polka fi.
        </Link>
    );
};

export default BrandLogo;
