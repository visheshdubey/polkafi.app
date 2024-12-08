import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
    return (
        <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-10" />
        </div>
    );
}
