import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const BrandLogo = (props: Props) => {
  return (
    <span
      className={cn("text-[#4A3AFF] text-base font-semibold", props.className)}
    >
      Polka fi.
    </span>
  );
};

export default BrandLogo;
