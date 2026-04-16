"use client"

import {fetchFolder} from "@/lib/clientApi/clientFoldersAPI";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { encode } from "punycode";

export default function FolderCard({ folderId }: { folderId: number }) {

    const { data, isLoading } = fetchFolder(folderId)

    if(isLoading || !data) {return null}

    function getTextColor(hexColor: string): string {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? "#2E2118" : "#EEEEEE";
    }

    function intToHexColor(colorInt: number): string {
        return `#${colorInt.toString(16).padStart(6, "0")}`;
    }

    const hexColor: string = intToHexColor(data.folder_color);
    const pathname = usePathname()

    return (
        <main className="rounded-2xl overflow-hidden border border-(--color-bg-hover) m-4 mt-0">
            <div className="flex">
                <Link className="w-full text-left bg-bg-surface hover:bg-bg-hover focus:bg-bg-hover focus:ring-ring focus:outline-none"
                      href={`${pathname}/${encodeURIComponent(data.folder_name)}`}
                >
                    <div className="p-4">
                        {/* Header row */}
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="flex rounded-full h-10 w-10 items-center justify-center"
                                style={{
                                    color: getTextColor(hexColor),
                                    backgroundColor: hexColor,
                                }}
                            >
                                {data.folder_name.slice(0, 2)}
                            </div>

                            <div>
                                <p className="text-[15px] font-medium leading-tight">
                                    {data.folder_name}
                                </p>
                            </div>
                        </div>

                        {/* Note */}
                        {data.note && (
                            <div className="bg-bg-sunken rounded-lg px-3 py-2.5 mb-3">
                                <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-bold">
                                    NOTE
                                </p>
                                <p className="text-[13px] text-content-primary leading-snug">
                                    {data.note}
                                </p>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </main>
    )
}