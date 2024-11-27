import { AudioRecorderWidget } from "@/features/audio-recorder/components/RecordAudio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils/shadcn";

type Props = {
    className?: string;
};
const TransactionAudioRecorder = (props: Props) => {
    return (
        <div className={cn("flex-wrap lg:flex-nowrap items-center z-10 w-full gap-2.5 flex", props.className)}>
            <div className="relative bg-white w-full items-center flex rounded-full border-[#7D42FB] border-2">
                <Input
                    placeholder="Spent 12000 dollars on cat food"
                    className="w-full h-12 text-lg pl-6 border-0 ring-0 focus-visible:ring-0 _placeholder:italic"
                    type="text"
                />
                <AudioRecorderWidget>
                    <Button
                        size={"icon"}
                        className="absolute right-2 rounded-full hover:bg-neutral-100  shrink-0 bg-white border-[#7D42FB]/10 border text-[#7D42FB]"
                    >
                        <Mic />
                    </Button>
                </AudioRecorderWidget>
            </div>
            <Button className="max-w-[240px] w-full h-[52px] rounded-full text-lg font-medium">Analyze</Button>
        </div>
    );
};

export default TransactionAudioRecorder;
