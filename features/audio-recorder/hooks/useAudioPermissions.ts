import { useEffect, useState } from "react";

export const useAudioPermission = () => {
    const [hasPermission, setHasPermission] = useState(false);

    const checkAndAskForAudioPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop()); // Stop the stream to avoid leaving the mic open
            setHasPermission(true);
        } catch (error) {
            setHasPermission(false);
        }
    };

    useEffect(() => {
        checkAndAskForAudioPermission();
    }, []);

    return { hasPermission, checkAndAskForAudioPermission };
};
