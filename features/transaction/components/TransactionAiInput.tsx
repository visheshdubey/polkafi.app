import { useEffect, useState } from "react";

import { AudioRecorderWidget } from "@/features/audio-recorder/components/RecordAudio";
import { Button } from "@/components/ui/button";
import { ButtonAsync } from "@/components/primitives/ui/button-async";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils/shadcn";
import { useStore } from "@/store/store";
import { useTextToJson } from "@/features/audio-recorder/hooks/useTextToJson";

type Props = {
    className?: string;
};
const TransactionAiInput = (props: Props) => {
    const { updateTranscribedText, transcribedText, parsedJson, updateParsedJson } = useStore((state) => state.recorder);
    const [inputValue, setInputValue] = useState(transcribedText.text);

    const { mutate: convertTextToJson, isPending: isConvertingTextToJson } = useTextToJson({
        onSuccess(data) {
            updateParsedJson(data);
        },
    });

    useEffect(() => {
        setInputValue(transcribedText.text);
    }, [transcribedText.text]);

    return (
        <div className={cn("flex-wrap lg:flex-nowrap items-center z-10 w-full gap-2.5 flex", props.className)}>
            <div className="relative bg-white w-full items-center flex rounded-full border-[#7D42FB] border lg:border-2">
                <Input
                    placeholder="Spent 12000 dollars on cat food"
                    className="w-full h-9 text-sm lg:h-12 lg:text-base pl-6 border-0 ring-0 focus-visible:ring-0 _placeholder:italic"
                    type="text"
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                />
                <AudioRecorderWidget>
                    <Button
                        size={"icon"}
                        className="absolute size-6 lg:size-9 aspect-square right-2 rounded-full hover:bg-neutral-100 shrink-0 bg-white border-[#7D42FB]/10 border text-[#7D42FB]"
                    >
                        <Mic className="size-4 lg:size-auto" />
                    </Button>
                </AudioRecorderWidget>
            </div>
            <ButtonAsync
                onClick={() => convertTextToJson({ text: inputValue })}
                disabled={isConvertingTextToJson}
                className="lg:max-w-[240px] w-full h-10 lg:h-[52px] rounded-full text-sm lg:text-lg tracking-tight font-medium"
            >
                Analyze
            </ButtonAsync>
        </div>
    );
};

export default TransactionAiInput;
