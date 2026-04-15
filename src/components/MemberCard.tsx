// MemberCard.tsx
"use client"

import Link from "next/link";
import {fetchMember} from "@/lib/clientApi/clientMembersAPI";
import {Play} from "lucide-react"
import {Pause} from "lucide-react"
import {startFrontingEntry, endFrontingEntry} from "@/lib/clientApi/clientFrontingHistoryAPI";
import {MemberData} from "../../types/mindgardens";
import {QueryClient, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {usePathname} from "next/navigation";

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

async function switchFront(data: MemberData, queryClient: QueryClient): Promise<void> {
    try {
        switch (data.is_fronting) {
            case true:
                await endFrontingEntry(data.member_id, queryClient, false)
                break;
            case false:
                await startFrontingEntry(data.member_id, queryClient, false)
                break;
        }
    } catch (e) {
        console.error("switchFront error:", e)
    }
}

export default function MemberCard({ memberId, folderId }: { memberId: number, folderId: number | null }) {

    const queryClient = useQueryClient();
    const { data, isLoading } = fetchMember(memberId)
    const [isFronting, setFronting] = useState(data?.is_fronting ?? false)

    if (isLoading || !data) return null
    const hexColor: string = intToHexColor(data.color);
    const pathname = usePathname()
    return (
        <main className="rounded-2xl overflow-hidden border border-(--color-bg-hover) m-4 mt-0">
            <div className="flex">
                <Link className="w-full text-left bg-bg-surface hover:bg-bg-hover focus:bg-bg-hover focus:ring-ring focus:outline-none"
                      href={`${pathname}/${encodeURIComponent(data.member_name)}`}
                      onClick={() => {
                          queryClient.setQueryData(['member', { memberName: data.member_name, folderId }], data)
                      }}
                >
                    {/* Top bar — fronting indicator */}
                    {!isFronting && <div className="h-1 w-full bg-bg-surface" />}
                    {isFronting && <div className="h-1 w-full bg-accent" />}
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
                                {data.member_name.slice(0, 2)}
                            </div>

                            <div>
                                <p className="text-[15px] font-medium leading-tight">
                                    {data.member_name}
                                </p>
                                <p className="text-[12px] text-text-secondary mt-0.5">
                                    {data.pronouns}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        {data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {data.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[11px] bg-accent-soft text-accent-text px-2.5 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

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
                <button
                    className="bg-bg-sunken w-12 flex flex-col items-center justify-evenly hover:bg-bg-hover focus-visible:bg-bg-hover focus:outline-none"
                    onClick={() => {
                        switchFront(data, queryClient);
                        setFronting(!isFronting);
                    }}
                >
                    <Play className={isFronting ? "text-text-muted opacity-40" : "text-accent"} />
                    <div className="w-full h-1 cursor-pointer"/>
                    <Pause className={isFronting ? "text-accent" : "text-text-muted opacity-40"} />
                </button>
            </div>
        </main>
    );
}