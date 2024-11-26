// "use client";

// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Card, CardContent } from "@/components/ui/card";
// import { Mic, Pause, Play, Square } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Button } from "@/components/ui/button";
// import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
// import WaveSurfer from "wavesurfer.js";

// interface AudioRecorderProps {
//   maxDuration?: number;
//   onRecordingComplete?: (audioBlob: Blob) => void;
//   waveformColor?: string;
//   progressColor?: string;
// }

// interface AudioDevice {
//   deviceId: string;
//   label: string;
// }

// const AudioRecorder: React.FC<AudioRecorderProps> = ({
//   maxDuration = 20,
//   onRecordingComplete,
//   waveformColor = "#4A3AFF",
//   progressColor = "#080066",
// }) => {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [isPaused, setIsPaused] = useState<boolean>(false);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [recordingTime, setRecordingTime] = useState<string>("00:00");
//   const [error, setError] = useState<string>("");
//   const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
//   const [selectedDevice, setSelectedDevice] = useState<string>("");
//   const [recordings, setRecordings] = useState<{ url: string; blob: Blob }[]>(
//     []
//   );

//   const waveformRef = useRef<HTMLDivElement>(null);
//   const recordingsRef = useRef<HTMLDivElement>(null);
//   const wavesurferRef = useRef<WaveSurfer | null>(null);
//   const recordRef = useRef<any>(null);

//   const initializeWaveSurfer = () => {
//     if (!waveformRef.current) return;

//     // Cleanup previous instance
//     if (wavesurferRef.current) {
//       wavesurferRef.current.destroy();
//     }

//     // Create new instance
//     wavesurferRef.current = WaveSurfer.create({
//       container: waveformRef.current,
//       waveColor: waveformColor,
//       progressColor: progressColor,
//       height: 100,
//       cursorColor: "transparent",
//       normalize: true,
//       autoScroll: true,
//     });

//     // Initialize recorder plugin
//     recordRef.current = wavesurferRef.current.registerPlugin(
//       RecordPlugin.create({
//         renderRecordedAudio: false,
//         scrollingWaveform: false,
//         continuousWaveform: true,
//         continuousWaveformDuration: 30,
//       })
//     );

//     // Record progress event
//     recordRef.current.on("record-progress", (time: number) => {
//       const minutes = Math.floor((time % 3600000) / 60000);
//       const seconds = Math.floor((time % 60000) / 1000);
//       const formattedTime = [minutes, seconds]
//         .map((v) => (v < 10 ? "0" + v : v))
//         .join(":");
//       setRecordingTime(formattedTime);
//     });

//     // Recording end event
//     recordRef.current.on("record-end", (blob: Blob) => {
//       const recordedUrl = URL.createObjectURL(blob);
//       setRecordings((prev) => [...prev, { url: recordedUrl, blob }]);

//       if (onRecordingComplete) {
//         onRecordingComplete(blob);
//       }
//     });
//   };

//   // Initialize audio devices
//   useEffect(() => {
//     const getAudioDevices = async () => {
//       try {
//         const devices = await RecordPlugin.getAvailableAudioDevices();
//         setAudioDevices(
//           devices.map((device) => ({
//             deviceId: device.deviceId,
//             label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
//           }))
//         );
//         if (devices.length > 0) {
//           setSelectedDevice(devices[0].deviceId);
//         }
//       } catch (err) {
//         console.error("Error getting audio devices:", err);
//         setError("Error accessing microphone devices");
//       }
//     };

//     getAudioDevices();
//   }, []);

//   // Initialize WaveSurfer
//   useEffect(() => {
//     initializeWaveSurfer();
//     return () => {
//       if (wavesurferRef.current) {
//         wavesurferRef.current.destroy();
//       }
//     };
//   }, [waveformColor, progressColor]);

//   const startRecording = async () => {
//     try {
//       if (!recordRef.current) return;

//       setError("");
//       setRecordingTime("00:00");

//       await recordRef.current.startRecording({ deviceId: selectedDevice });
//       setIsRecording(true);
//       setIsPaused(false);
//     } catch (err) {
//       console.error("Error starting recording:", err);
//       setError("Please allow microphone access to record audio.");
//     }
//   };

//   const stopRecording = async () => {
//     if (!recordRef.current || !isRecording) return;

//     try {
//       await recordRef.current.stopRecording();
//       setIsRecording(false);
//       setIsPaused(false);
//       setRecordingTime("00:00");
//     } catch (err) {
//       console.error("Error stopping recording:", err);
//       setError("Error stopping recording");
//     }
//   };

//   const togglePause = async () => {
//     if (!recordRef.current || !isRecording) return;

//     try {
//       if (isPaused) {
//         await recordRef.current.resumeRecording();
//         setIsPaused(false);
//       } else {
//         await recordRef.current.pauseRecording();
//         setIsPaused(true);
//       }
//     } catch (err) {
//       console.error("Error toggling pause:", err);
//       setError("Error pausing/resuming recording");
//     }
//   };

//   return (
//     <Card className="w-full max-w-md mx-auto p-0 shadow-none border-0">
//       <CardContent className="p-6">
//         {error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <div className="mb-4">
//           <Select
//             value={selectedDevice}
//             onValueChange={setSelectedDevice}
//             disabled={isRecording}
//           >
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select microphone" />
//             </SelectTrigger>
//             <SelectContent>
//               {audioDevices.map((device) => (
//                 <SelectItem key={device.deviceId} value={device.deviceId}>
//                   {device.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         <div
//           ref={waveformRef}
//           className="w-full h-24 mb-4 rounded-lg overflow-hidden bg-gray-50"
//         />

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {!isRecording ? (
//               <Button
//                 onClick={startRecording}
//                 disabled={isRecording || !selectedDevice}
//                 size={"icon"}
//                 variant={"default"}
//                 className="rounded-full"
//               >
//                 <Mic className="h-4 w-4" />
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   onClick={stopRecording}
//                   variant="destructive"
//                   size={"icon"}
//                   className="rounded-full"
//                 >
//                   <Square className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   onClick={togglePause}
//                   variant="outline"
//                   size={"icon"}
//                   className="rounded-full"
//                 >
//                   <Pause className="h-4 w-4" />
//                 </Button>
//               </>
//             )}
//           </div>

//           <div className="text-sm font-medium">
//             <span className={isRecording ? "text-red-500" : ""}>
//               {recordingTime}
//             </span>
//           </div>
//         </div>

//         {recordings.length > 0 && (
//           <div className="mt-6 space-y-4" ref={recordingsRef}>
//             <h3 className="font-medium">Recordings</h3>
//             {recordings.map((recording, index) => (
//               <div key={index} className="flex items-center gap-4">
//                 <audio src={recording.url} controls className="w-full" />
//                 <a
//                   href={recording.url}
//                   download={`recording-${index + 1}.webm`}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   Download
//                 </a>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AudioRecorder;

"use client";

import "@/features/audio-recorder/components/wave-surffer-styles.css";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import WaveSurfer from "wavesurfer.js";

interface AudioRecorderProps {
  maxDuration?: number;
  onRecordingComplete?: (audioBlob: Blob) => void;
  waveformColor?: string;
  progressColor?: string;
}

interface AudioDevice {
  deviceId: string;
  label: string;
}

interface Recording {
  id: string;
  url: string;
  blob: Blob;
  wavesurfer: WaveSurfer | null;
  isPlaying: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  maxDuration = 20,
  onRecordingComplete,
  waveformColor = "#4A3AFF",
  progressColor = "#080066",
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<string>("00:00");
  const [error, setError] = useState<string>("");
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);
  const recordingsContainerRef = useRef<HTMLDivElement>(null);

  const initializeWaveSurfer = () => {
    if (!waveformRef.current) return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: waveformColor,
      progressColor: progressColor,
      height: 100,
      cursorColor: "transparent",
      normalize: true,
      autoScroll: true,
    });

    recordRef.current = wavesurferRef.current.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: false,
        continuousWaveform: true,
        continuousWaveformDuration: 30,
      })
    );

    recordRef.current.on("record-progress", (time: number) => {
      const minutes = Math.floor((time % 3600000) / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      const formattedTime = [minutes, seconds]
        .map((v) => (v < 10 ? "0" + v : v))
        .join(":");
      setRecordingTime(formattedTime);
    });

    recordRef.current.on("record-end", (blob: Blob) => {
      const recordedUrl = URL.createObjectURL(blob);
      const recordingId = `recording-${Date.now()}`;

      // Create container for the recording's waveform
      const container = document.createElement("div");
      container.id = recordingId;
      recordingsContainerRef.current?.appendChild(container);

      // Create new WaveSurfer instance for the recording
      const recordingWavesurfer = WaveSurfer.create({
        container: `#${recordingId}`,
        waveColor: waveformColor,
        progressColor: progressColor,
        height: 80,
        cursorColor: "transparent",
        normalize: true,
        minPxPerSec: 100,
      });

      // Load the recorded audio
      recordingWavesurfer.loadBlob(blob);

      setRecordings((prev) => [
        ...prev,
        {
          id: recordingId,
          url: recordedUrl,
          blob,
          wavesurfer: recordingWavesurfer,
          isPlaying: false,
        },
      ]);

      if (onRecordingComplete) {
        onRecordingComplete(blob);
      }
    });
  };

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        const devices = await RecordPlugin.getAvailableAudioDevices();
        setAudioDevices(
          devices.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
          }))
        );
        if (devices.length > 0) {
          setSelectedDevice(devices[0].deviceId);
        }
      } catch (err) {
        console.error("Error getting audio devices:", err);
        setError("Error accessing microphone devices");
      }
    };

    getAudioDevices();
  }, []);

  useEffect(() => {
    initializeWaveSurfer();
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      // Cleanup all recording wavesurfers
      recordings.forEach((recording) => {
        if (recording.wavesurfer) {
          recording.wavesurfer.destroy();
        }
      });
    };
  }, [waveformColor, progressColor]);

  const startRecording = async () => {
    try {
      if (!recordRef.current) return;

      setError("");
      setRecordingTime("00:00");

      await recordRef.current.startRecording({ deviceId: selectedDevice });
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Please allow microphone access to record audio.");
    }
  };

  const stopRecording = async () => {
    if (!recordRef.current || !isRecording) return;

    try {
      await recordRef.current.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime("00:00");
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Error stopping recording");
    }
  };

  const togglePause = async () => {
    if (!recordRef.current || !isRecording) return;

    try {
      if (isPaused) {
        await recordRef.current.resumeRecording();
        setIsPaused(false);
      } else {
        await recordRef.current.pauseRecording();
        setIsPaused(true);
      }
    } catch (err) {
      console.error("Error toggling pause:", err);
      setError("Error pausing/resuming recording");
    }
  };

  const togglePlayback = async (recordingId: string) => {
    setRecordings((prev) =>
      prev.map((recording) => {
        if (recording.id === recordingId) {
          if (recording.wavesurfer) {
            if (recording.isPlaying) {
              recording.wavesurfer.pause();
            } else {
              recording.wavesurfer.play();
            }
          }
          return { ...recording, isPlaying: !recording.isPlaying };
        }
        // Pause other recordings
        if (recording.wavesurfer && recording.isPlaying) {
          recording.wavesurfer.pause();
        }
        return { ...recording, isPlaying: false };
      })
    );
  };

  const deleteRecording = (recordingId: string) => {
    setRecordings((prev) => {
      const newRecordings = prev.filter((recording) => {
        if (recording.id === recordingId) {
          if (recording.wavesurfer) {
            recording.wavesurfer.destroy();
          }
          URL.revokeObjectURL(recording.url);
          return false;
        }
        return true;
      });
      return newRecordings;
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto p-0 shadow-none border-0">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          ref={waveformRef}
          className="w-full border h-24 mb-4 rounded-lg overflow-y-auto scrollbar-none bg-gray-50"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isRecording || !selectedDevice}
                size={"icon"}
                variant={"default"}
                className="rounded-full"
              >
                <Mic className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size={"icon"}
                  className="rounded-full"
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  onClick={togglePause}
                  variant="outline"
                  size={"icon"}
                  className="rounded-full"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="text-sm font-medium">
            <span className={isRecording ? "text-red-500" : ""}>
              {recordingTime}
            </span>
          </div>
        </div>

        <div
          ref={recordingsContainerRef}
          className="mt-6 border border-red-500 space-y-4 "
        >
          {recordings.length > 0 && <h3 className="font-medium">Recordings</h3>}
          {recordings.map((recording) => (
            <div key={recording.id} className="space-y-2">
              <div
                id={recording.id}
                className="w-full rounded-lg overflow-hidden  bg-gray-50"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => togglePlayback(recording.id)}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8"
                  >
                    {recording.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => deleteRecording(recording.id)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <a
                    href={recording.url}
                    download={`recording-${recording.id}.webm`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioRecorder;
