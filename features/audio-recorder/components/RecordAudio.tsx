"use client";

import { Check, Mic } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactNode, useState } from "react";
import { Recorder, RecorderError, RecorderTime, RecorderTrigger, RecorderWaveform } from "@/components/primitives/ui/record-audio";

import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

export function AudioRecorderWidget({ children }: { children: ReactNode }) {
    const [audioBlob, setaudioBlob] = useState<Blob | null>();

    const handleComplete = async (blob: Blob | null) => {
        setaudioBlob(blob);
        console.log("Recording completed, blob size:", blob?.size);
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
                        <Recorder maxDuration={30} onComplete={handleComplete} onRecChange={(state) => console.log(state)} className="">
                            <RecorderError />

                            <div className="flex flex-col items-center">
                                <RecorderWaveform className="flex-1" barCount={60} />

                                <RecorderTime className="text-center font-medium" />
                                <div className="flex items-center gap-4 mt-8">
                                    {audioBlob ? (
                                        <DrawerClose asChild>
                                            <Button size="lg" variant="outline" className="rounded-full w-12 h-12 p-0">
                                                <Cross2Icon className="h-4 w-4" />
                                            </Button>
                                        </DrawerClose>
                                    ) : null}
                                    <RecorderTrigger asChild>
                                        <Button size="lg" variant="default" className="rounded-full w-12 h-12 p-0">
                                            <Mic className="h-4 w-4" />
                                        </Button>
                                    </RecorderTrigger>
                                    {audioBlob ? (
                                        <Button size="lg" variant="secondary" className="rounded-full w-12 h-12 p-0">
                                            <Check className="h-4 w-4" />
                                        </Button>
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
