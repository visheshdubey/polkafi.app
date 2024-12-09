import BrandLogo from "@/features/brand/components/BrandLogo";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

const Footer = (props: Props) => {
    return (
        <div
            className={cn(
                "flex z-10 rounded-br-none rounded-bl-none  bg-primary backdrop-blur-3xl justify-between items-center  mx-auto max-w-screen-lg w-full rounded-tl-[20px] rounded-tr-[20px] md:p-12 p-8",
                props.className,
            )}
        >
            <BrandLogo className="text-white text-xl" />
            <Link href="mailto:visheshdubey.work@gmail.com" className="text-neutral-300 text-sm">
                Contact
            </Link>
        </div>
    );
};

export default Footer;
