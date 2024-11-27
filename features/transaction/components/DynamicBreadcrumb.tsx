import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import React from "react";

interface BreadcrumbProps {
    items: { name: string; path: string }[]; // Array of breadcrumb items with name and path
}

export function DynamicBreadcrumb({ items }: BreadcrumbProps) {
    return (
        <Breadcrumb className=" ">
            <BreadcrumbList>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
