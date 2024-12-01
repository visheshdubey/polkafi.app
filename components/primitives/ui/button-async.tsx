import { Button, ButtonProps } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

export interface ButtonAsyncProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
    spinnerClassName?: string;
}

const ButtonAsync = forwardRef<HTMLButtonElement, ButtonAsyncProps>(
    ({ children, isLoading, loadingText, disabled, spinnerClassName = "mr-2 h-4 w-4", ...props }, ref) => {
        return (
            <Button ref={ref} disabled={isLoading || disabled} {...props}>
                {isLoading && <Loader2 className={`animate-spin ${spinnerClassName}`} aria-hidden="true" />}
                {isLoading ? loadingText || children : children}
            </Button>
        );
    },
);

ButtonAsync.displayName = "ButtonAsync";

export { ButtonAsync };
