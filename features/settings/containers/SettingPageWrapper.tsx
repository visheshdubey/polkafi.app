"use client";

import { Button } from "@/components/ui/button";
import { CreateCategoryForm } from "@/features/category/components/CreateCategoryForm";
import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import MagicalGradientCard from "@/features/transaction/components/MagicalGradientCard";
import PageTitle from "@/features/transaction/components/PageTitle";
import { PlusIcon } from "lucide-react";
import { ProfileSection } from "../components/ProfileSection";
import { ViewAndUpdateCategories } from "../components/ViewAndUpdateCategories";

type Props = {};

const SettingPageWrapper = (props: Props) => {
    const breadcrumbItems = [
        { name: "App", path: "/" },
        { name: "Settings", path: "/settings" },
    ];

    return (
        <div className="max-w-screen-xl flex flex-col gap-3 lg:gap-6 px-3 lg:px-6 mx-auto w-full min-h-screen">
            <div className="mt-3 lg:mt-12">
                <DynamicBreadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-wrap items-baseline w-full gap-2">
                <PageTitle>Settings</PageTitle>
            </div>

            <MagicalGradientCard className="flex flex-col mt-3">
                <span className="text-purple-800/70 font-medium text-sm">Profile</span>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    <ProfileSection />
                </div>
            </MagicalGradientCard>
            <MagicalGradientCard className="flex flex-col mt-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-purple-800/70 font-medium text-sm">Categories</h2>
                    <CreateCategoryForm>
                        <Button variant="link" size="sm">
                            <PlusIcon className="h-4 w-4 mr-0.5" />
                            Add Category
                        </Button>
                    </CreateCategoryForm>
                </div>

                <div className="w-full shadow-sm min-h-12 bg-white mt-4 lg:p-6 p-4 rounded-xl">
                    <ViewAndUpdateCategories />
                </div>
            </MagicalGradientCard>
        </div>
    );
};

export default SettingPageWrapper;
