import { DynamicBreadcrumb } from "@/features/transaction/components/DynamicBreadcrumb";
import PageTitle from "@/features/transaction/components/PageTitle";

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
        </div>
    );
};

export default SettingPageWrapper;
