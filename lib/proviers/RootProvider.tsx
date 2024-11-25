"use client";

import { ReactNode } from "react";
// import ReactQueryProvider from "./ReactQueryProvider";
import { SessionProvider } from "next-auth/react";

type Props = {
    children: ReactNode;
};

const RootProvider = (props: Props) => {
    return (
        <SessionProvider>
            {/* <ReactQueryProvider> */}
            {props.children}
            {/* </ReactQueryProvider> */}
        </SessionProvider>
    );
};

export default RootProvider;
