"use client";

import { Check, Mic } from "lucide-react";
import { Cross2Icon, StopIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ReactNode, useState } from "react";
import {
    Recorder,
    RecorderDiscard,
    RecorderError,
    RecorderTime,
    RecorderTrigger,
    RecorderWaveform,
    RecordingState,
} from "@/components/primitives/ui/record-audio";

import { Button } from "@/components/ui/button";
import { ButtonAsync } from "@/components/primitives/ui/button-async";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { useTextToJson } from "../hooks/useTextToJson";

interface AudioRecorderWidgetProps {
    children: ReactNode;
}

interface TranscribedText {
    text: string;
}

const RecorderControls = ({
    recordingState,
    isPending,
    isConvertingTextToJson,
    onDiscard,
    onApproveTranscription,
}: {
    recordingState: RecordingState;
    isPending: boolean;
    isConvertingTextToJson: boolean;
    onDiscard: () => void;
    onApproveTranscription: () => void;
}) => (
    <div className="flex items-center gap-4 mt-8">
        {(recordingState === "completed" || recordingState === "stopped") && (
            <RecorderDiscard asChild>
                <Button size="lg" onClick={onDiscard} variant="outline" className="rounded-full w-12 h-12 p-0">
                    <Cross2Icon className="h-4 w-4" />
                </Button>
            </RecorderDiscard>
        )}
        <RecorderTrigger asChild>
            <ButtonAsync
                variant={recordingState === "recording" ? "outline" : "default"}
                size="lg"
                className="rounded-full w-12 h-12 p-0 relative"
                spinnerClassName="absolute inset-0 w-full h-full mx-auto my-auto"
                isLoading={isPending}
            >
                {!isPending && (
                    <>
                        {recordingState !== "recording" && <Mic className="h-4 w-4" />}
                        {recordingState === "recording" && <StopIcon className="h-4 w-4" />}
                    </>
                )}
            </ButtonAsync>
        </RecorderTrigger>
        {(recordingState === "completed" || recordingState === "stopped") && (
            <ButtonAsync
                onClick={onApproveTranscription}
                isLoading={isConvertingTextToJson}
                size="lg"
                variant="secondary"
                className="rounded-full w-12 h-12 p-0 relative"
                spinnerClassName="absolute inset-0 w-full h-full mx-auto my-auto"
            >
                {!isConvertingTextToJson && <Check className="h-4 w-4" />}
            </ButtonAsync>
        )}
    </div>
);

const TranscriptionDisplay = ({ transcribedText }: { transcribedText: TranscribedText | null }) => (
    <>
        {transcribedText ? (
            <span className="text-center h-[50px] text-sm text-neutral-500 font-medium">{transcribedText.text}</span>
        ) : (
            <RecorderWaveform className="flex-1" barCount={60} />
        )}
    </>
);

export function AudioRecorderWidget({ children }: AudioRecorderWidgetProps) {
    const [audioBlob, setAudioBlob] = useState<Blob | null>();
    const [transcribedText, setTranscribedText] = useState<TranscribedText | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>("idle");

    // API hooks
    const { mutate: transcribeAudio, isPending } = useSpeechToText({
        onSuccess(text) {
            setTranscribedText(text);
            console.log(text);
        },
    });

    const { mutate: convertTextToJson, isPending: isConvertingTextToJson } = useTextToJson({
        onSuccess(data) {
            console.log(data);
        },
    });

    // Event handlers
    const handleComplete = async (blob: Blob | null) => {
        setAudioBlob(blob);

        if (blob) {
            transcribeAudio(blob);
        }
        console.log("Recording completed, blob size:", blob?.size);
    };

    const handleApproveTranscription = async () => {
        if (transcribedText) {
            convertTextToJson(transcribedText);
        }
    };

    const handleDiscard = () => {
        setTranscribedText(null);
        setRecordingState("idle");
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="justify-center mt-2">
                        <DrawerTitle className="text-center">Record your Audio</DrawerTitle>
                        <DrawerDescription className="text-center">"Spent 12000 USD on cat food".</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <Recorder
                            recordingState={recordingState}
                            onStateChange={setRecordingState}
                            maxDuration={5}
                            onComplete={handleComplete}
                            onRecChange={(state) => console.log(state)}
                        >
                            <RecorderError />
                            <div className="flex flex-col items-center">
                                <TranscriptionDisplay transcribedText={transcribedText} />
                                <RecorderTime className="text-center font-medium" />
                                <RecorderControls
                                    recordingState={recordingState}
                                    isPending={isPending}
                                    isConvertingTextToJson={isConvertingTextToJson}
                                    onDiscard={handleDiscard}
                                    onApproveTranscription={handleApproveTranscription}
                                />
                            </div>
                        </Recorder>
                    </div>
                    <DrawerFooter />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
