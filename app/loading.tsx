import { Loader2 } from "lucide-react";

type Props = {};

const loading = (props: Props) => {
    return (
        <div className="h-screen w-screen bg-white/20 backdrop-blur-md flex items-center justify-center fixed top-0 left-0 z-50">
            <Loader2 className="size-16 text-brand animate-spin" />
        </div>
    );
};

export default loading;
