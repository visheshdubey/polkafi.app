import SignInForm from "@/features/auth/components/SignInForm";
import { getProviders } from "next-auth/react";

type Props = {};

const SigninPage = async (props: Props) => {
  const providers = await getProviders();

  return (
    <main className="h-[calc(100vh_-_64px_-_10vh)]">
      <SignInForm providers={providers} />
    </main>
  );
};

export default SigninPage;
