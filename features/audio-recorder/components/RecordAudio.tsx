"use client";

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
import { Mic } from "lucide-react";

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
                    <DrawerHeader>
                        <DrawerTitle>Record your Audio</DrawerTitle>
                        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <Recorder
                            maxDuration={30}
                            onComplete={handleComplete}
                            onRecChange={(state) => console.log(state)}
                            className="space-y-4"
                        >
                            <RecorderError />

                            <div className="flex flex-col items-center space-x-4">
                                <RecorderWaveform className="flex-1" barCount={60} />
                                <RecorderTrigger asChild>
                                    <Button size="lg" variant="default" className="rounded-full w-12 h-12 p-0">
                                        <Mic className="h-4 w-4" />
                                    </Button>
                                </RecorderTrigger>
                                {/* <RecorderReset asChild>
                                    <Button size="icon" variant="outline">
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </RecorderReset> */}

                                <RecorderTime className="text-center" />
                            </div>
                        </Recorder>
                    </div>
                    <DrawerFooter>
                        {" "}
                        {audioBlob ? (
                            <>
                                <Button>Submit</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </>
                        ) : null}{" "}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
