"use client";

import { Loader2, Zap } from "lucide-react";

import { useFetchProfileDetails } from "@/features/settings/hooks/useFetchProfileDetails";

export default function ZapCounter() {
    const { data: profileDetails, isLoading: isLoadingProfileDetails } = useFetchProfileDetails();

    return (
        <span className="px-2 h-[18px] py-0.5 w-[50px] flex items-center justify-center gap-1 rounded-full bg-brand/10 font-semibold text-brand">
            {isLoadingProfileDetails ? <Loader2 className="size-2 lg:size-3 animate-spin" /> : <Zap className="size-3.5 lg:size-4" />}
            <span className="h-fit text-xs leading-none">{profileDetails?.credits || 0}</span>
        </span>
    );
}
