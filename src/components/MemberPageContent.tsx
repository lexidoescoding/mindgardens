"use client"
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchMember, updateMemberName} from "@/lib/queries";
import {MemberData} from "../../types/mindgardens";
import {ArrowLeftIcon} from "lucide-react";
import React from "react";
import {createClient} from "@/lib/supabase-browser";

export default function MemberPageContent({ memberId }: { memberId: number }) {
    const queryClient = useQueryClient();
    const { data: member, isLoading } = fetchMember(memberId)

    if (isLoading || !member) return null

    async function handleSave(name: string) {
        await updateMemberName(memberId, name, queryClient);
    }

    return (
        <main>
            <div className=" flex w-full p-4 items-center">
                <h1 className="text-4xl font-bold text-text-primary flex-1 min-w-0">
                    <input
                        className="w-[calc(100dvw-4rem)]"
                        defaultValue={member.member_name}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.currentTarget.blur()
                                handleSave(e.currentTarget.value)
                            }
                        }}
                        onBlur={(e) => handleSave(e.currentTarget.value)}

                    />
                </h1>
                <button
                    onClick={() => {history.back()}}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            history.back()
                        }
                    }}
                >
                    <ArrowLeftIcon
                        className="shrink-0 cursor-pointer"
                    />
                </button>
            </div>
            {member.is_fronting && <div className="w-[calc(100dvw-2rem)] h-1 bg-accent visible mb-4 ml-4 rounded-lg" />}
            {!member.is_fronting && <div className="w-[calc(100dvw-2rem)] h-1 bg-bg-sunken visible mb-4 ml-4 rounded-lg" />}
        </main>
    )
}