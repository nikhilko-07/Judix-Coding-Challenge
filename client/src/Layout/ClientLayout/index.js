import React from "react";
import Sidebar  from "@/Components/Sidebar";
import LeftBar from "@/Components/leftBar";
import {usePathname} from "next/navigation";
export default function  ClientLayout({children}) {
    const route = usePathname();
    return(
        <div style={{ display: "flex", width: "100vw" }}>
            <Sidebar style={{ flex: 1 }} />   {/* Sidebar takes 1 fraction of space */}
            <div style={{ flex: 2}}>{children}</div> {/* Main section takes 2 fractions */}

            {route === "/feed" && <LeftBar style={{ flex: 1 }} />}
        </div>
    )
}
