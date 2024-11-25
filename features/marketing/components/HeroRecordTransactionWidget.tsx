import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const HeroRecordTransactionWidget = (props: Props) => {
  return (
    <div
      className={cn(
        "flex-col items-center z-10 max-w-screen-sm w-full gap-7 flex",
        props.className
      )}
    >
      <div className="relative bg-white max-w-screen-sm grow w-full  items-center flex rounded-full border-[#7D42FB] border-2">
        <Input
          placeholder="Enter your Daily transactions"
          className="w-full h-14 text-lg pl-4 border-0 ring-0 focus-visible:ring-0"
          type="text"
        />

        <Button
          size={"icon"}
          className="absolute right-4 rounded-full hover:bg-neutral-100  shrink-0 bg-white border-[#7D42FB]/10 border text-[#7D42FB]"
        >
          <Mic />
        </Button>
      </div>
      <Button className="max-w-[240px] w-full h-14 rounded-full text-lg font-medium">
        Submit
      </Button>
    </div>
  );
};

export default HeroRecordTransactionWidget;
