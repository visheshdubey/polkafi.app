import BackgroundGradient from "@/features/marketing/components/BackgroundGradient";
import TransactionWrapper from "@/features/transaction/container/TransactionWrapper";

type Props = {};

const AppPage = (props: Props) => {
    return (
        <div className="relative min-h-screen">
            <BackgroundGradient />
            <div className="relative z-10">
                <TransactionWrapper />
            </div>
        </div>
    );
};

export default AppPage;
