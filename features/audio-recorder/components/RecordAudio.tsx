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

export function AudioRecorderWidget({ children }: { children: ReactNode }) {
    const [audioBlob, setaudioBlob] = useState<Blob | null>();
    const [transcribedText, setTranscribedText] = useState<{ text: string } | null>(null);
    const [recordingState, setRecordingState] = useState<RecordingState>("idle");
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

    const handleComplete = async (blob: Blob | null) => {
        setaudioBlob(blob);

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
                                {transcribedText ? (
                                    <span className="text-center h-[50px] text-sm text-neutral-500 font-medium">
                                        {transcribedText.text}
                                    </span>
                                ) : (
                                    <RecorderWaveform className="flex-1" barCount={60} />
                                )}
                                <RecorderTime className="text-center font-medium" />
                                <div className="flex items-center gap-4 mt-8">
                                    {recordingState === "completed" || recordingState === "stopped" ? (
                                        <RecorderDiscard asChild>
                                            <Button
                                                size="lg"
                                                onClick={handleDiscard}
                                                variant="outline"
                                                className="rounded-full w-12 h-12 p-0"
                                            >
                                                <Cross2Icon className="h-4 w-4" />
                                            </Button>
                                        </RecorderDiscard>
                                    ) : null}
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
                                    {recordingState === "completed" || recordingState === "stopped" ? (
                                        <ButtonAsync
                                            onClick={handleApproveTranscription}
                                            isLoading={isConvertingTextToJson}
                                            size="lg"
                                            variant="secondary"
                                            className="rounded-full w-12 h-12 p-0 relative"
                                            spinnerClassName="absolute inset-0 w-full h-full mx-auto my-auto"
                                        >
                                            {!isConvertingTextToJson && <Check className="h-4 w-4" />}
                                        </ButtonAsync>
                                    ) : null}
                                </div>

                                {/* <RecorderReset asChild>
                                    <Button size="icon" variant="outline">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </RecorderReset> */}
                            </div>
                        </Recorder>
                    </div>
                    <DrawerFooter></DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
