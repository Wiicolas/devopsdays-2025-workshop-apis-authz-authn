"use client";

import React from "react";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { Beer } from "lucide-react";
import Link from "next/link";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function MenuDock() {
    return (
        <div className="relative">
            <Dock direction="middle">
                <DockIcon>
                    <Link href={"/"} >
                        <Beer />
                    </Link>
                </DockIcon>
            </Dock>
        </div>
    );
}
