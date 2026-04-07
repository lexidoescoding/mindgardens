"use client"

import {fetchMember} from "@/lib/clientApi/clientMembersAPI"
import {startFrontingEntry, endFrontingEntry} from "@/lib/clientApi/clientFrontingHistoryAPI"
import {QueryClient, useQueryClient} from "@tanstack/react-query"
import {useState} from "react"
import {Play, Pause, ArrowLeftIcon} from "lucide-react"
import {MemberData} from "../../types/mindgardens";

function intToHexColor(colorInt: number): string {
    return `#${colorInt.toString(16).padStart(6, "0")}`
}

function getTextColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16)
    const g = parseInt(hexColor.slice(3, 5), 16)
    const b = parseInt(hexColor.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? "#2E2118" : "#EEEEEE"
}

async function switchFront(data: MemberData, queryClient: QueryClient): Promise<void> {
    try {
        if (data.is_fronting) {
            await endFrontingEntry(data.member_id, queryClient, false)
        } else {
            await startFrontingEntry(data.member_id, queryClient, false)
        }
    } catch (e) {
        console.error("switchFront error:", e)
    }
}

export default function MemberPageContent({ memberId }: { memberId: number }) {
    const queryClient = useQueryClient()
    const { data, isLoading } = fetchMember(memberId)
    const [isFronting, setFronting] = useState(data?.is_fronting ?? false)

    if (isLoading || !data) return null

    const hexColor = intToHexColor(data.color)
    const textColor = getTextColor(hexColor)

    return (
        <main className="h-dvh flex flex-col overflow-hidden">
            {/* Fronting indicator bar */}
            <div className={`h-1 w-full shrink-0 ${isFronting ? "bg-accent" : "bg-bg-sunken"}`} />

            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-bg-surface border-b border-bg-hover">
                <button onClick={() => history.back()}>
                    <ArrowLeftIcon className="shrink-0 cursor-pointer" />
                </button>

                <div
                    className="flex rounded-full h-14 w-14 items-center justify-center text-lg font-semibold shrink-0"
                    style={{ backgroundColor: hexColor, color: textColor }}
                >
                    {data.member_name.slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-text-primary leading-tight truncate">
                        {data.member_name}
                    </h1>
                    <p className="text-[13px] text-text-secondary mt-0.5">
                        {data.pronouns}
                    </p>
                </div>

                <button
                    className="flex flex-col items-center justify-evenly gap-2 bg-bg-sunken rounded-xl p-3 hover:bg-bg-hover transition-colors"
                    onClick={() => {
                        switchFront(data, queryClient)
                        setFronting(!isFronting)
                    }}
                >
                    <Play className={isFronting ? "text-text-muted opacity-40" : "text-accent"} />
                    <Pause className={isFronting ? "text-accent" : "text-text-muted opacity-40"} />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3">

                {/* Tags */}
                {data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
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
                    <div className="bg-bg-sunken rounded-lg px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-bold">
                            NOTE
                        </p>
                        <p className="text-[13px] text-text-primary leading-snug">
                            {data.note}
                        </p>
                    </div>
                )}

                {/* Description */}
                {data.description && (
                    <div className="bg-bg-sunken rounded-lg px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-bold">
                            DESCRIPTION
                        </p>
                        <p className="text-[13px] text-text-primary leading-snug whitespace-pre-wrap">
                            {data.description}
                        </p>
                    </div>
                )}

            </div>
        </main>
    )
}