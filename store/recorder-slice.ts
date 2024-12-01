import { ImmerStateCreator } from "./types";

type RecorderState = {
    transcribedText: { text: string };
    parsedJson: Record<string, any> | null;
};

type RecorderActions = {
    updateTranscribedText: (text: { text: string }) => void;
    updateParsedJson: (json: Record<string, any>) => void;
};

type RecorderSlice = { recorder: RecorderState & RecorderActions };

const initialState: RecorderState = {
    transcribedText: { text: '' },
    parsedJson: null,
};

export const createRecorderSlice: ImmerStateCreator<RecorderSlice> = (set) => ({
    recorder: {
        ...initialState,
        updateTranscribedText: (text) =>
            set(({ recorder }: RecorderSlice) => {
                recorder.transcribedText = text;
            }),
        updateParsedJson: (json) =>
            set(({ recorder }: RecorderSlice) => {
                recorder.parsedJson = json;
            }),
    },
});
