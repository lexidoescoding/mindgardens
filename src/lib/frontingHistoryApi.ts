import {createClient} from "@/lib/supabase-browser";
import {FrontHistoryEntryData, MemberData} from "../../types/mindgardens";
import {QueryClient, useQueryClient} from "@tanstack/react-query";

export async function postFrontingEntry(memberId: number, queryClient: QueryClient, isCustomFront: boolean = false, note: string = "") {
    const supabase = await createClient()
    const { error } = await supabase
        .from('front_history')
        .insert({
            fronter_id: memberId,
            is_custom: isCustomFront,
            note: note
        })
    if (error) throw error

    queryClient.setQueryData(['member', memberId], (old: MemberData) => ({
        ...old,
        is_fronting: true
    }))
    queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
        old?.map(member => member.member_id === memberId ? { ...member, is_fronting: true } : member)
    )
}

export async function endFrontingEntry(memberId: number, queryClient: QueryClient, isCustomFront: boolean = false) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('front_history')
        .update({
            ended_at: new Date().toISOString()
        })
        .eq('fronter_id', memberId)
        .eq('is_custom', isCustomFront)
        .is('ended_at', null)
    if (error) throw error

    queryClient.setQueryData(['member', memberId], (old: MemberData) => ({
        ...old,
        is_fronting: false
    }))
    queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
        old?.map(member => member.member_id === memberId ? { ...member, is_fronting: false } : member)
    )
}

export async function updateFrontingEntry(
    memberId: number,
    startedAt: string,
    data: Partial<FrontHistoryEntryData>,
    queryClient: QueryClient
) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('front_history')
        .update(data)
        .eq('fronter_id', memberId)
        .eq('started_at', startedAt)
    if (error) throw error

    queryClient.setQueryData(['member', memberId], (old: MemberData) => ({
        ...old,
        ...data
    }))

    queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
        old?.map(member => member.member_id === memberId ? { ...member, ...data } : member)
    )
}