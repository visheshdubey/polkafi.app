"use client";

import { ClientSafeProvider, signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import ProviderIcon from "@/features/auth/components/ProviderIcon";

type OAuthProviderButtonProps = {
    provider: ClientSafeProvider;
    className?: string;
};

const OAuthProviderButton = ({ provider, className = "" }: OAuthProviderButtonProps) => {
    return (
        <div className="mb-2  w-full">
            <Button
                onClick={() => signIn(provider.id)}
                className={`gap-2 h-11 shadow-none border-0 rounded-full w-full ${className}`}
                variant="outline"
            >
                <ProviderIcon provider={provider.id} />
                <span>Sign in with {provider.name}</span>
            </Button>
        </div>
    );
};

export default OAuthProviderButton;
