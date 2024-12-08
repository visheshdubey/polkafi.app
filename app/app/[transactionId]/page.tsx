import BackgroundGradient from "@/features/marketing/components/BackgroundGradient";
import UpdateTransactionWrapper from "@/features/transaction/container/UpdateTransactionWrapper";

const UpdateTransaction = ({ params }: { params: { transactionId: string } }) => {
    return (
        <div className="relative min-h-screen">
            <BackgroundGradient />
            <div className="relative z-10">
                <UpdateTransactionWrapper transactionId={params.transactionId} />
            </div>
        </div>
    );
};

export default UpdateTransaction;
