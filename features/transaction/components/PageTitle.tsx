import { ReactNode } from "react";

type Props = {
    children?: ReactNode;
};

const PageTitle = ({ children }: Props) => {
    return <h1 className="text-2xl font-semibold">{children}</h1>;
};

export default PageTitle;
