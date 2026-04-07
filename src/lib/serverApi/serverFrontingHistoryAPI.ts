"use server"

import {createClient} from "@/lib/supabase-browser";
import {QueryClient} from "@tanstack/react-query";
import {FrontHistoryEntryData, MemberData} from "../../../types/mindgardens";

export async function startFrontingEntry(memberId: number, isCustomFront: boolean = false, note: string = "") {
    const supabase = await createClient()
    const { error } = await supabase
        .from('front_history')
        .insert({
            fronter_id: memberId,
            is_custom: isCustomFront,
            note: note
        })
    if (error) throw error
}

export async function endFrontingEntry(memberId: number, isCustomFront: boolean = false) {
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
}

export async function updateFrontingEntry(memberId: number, startedAt: string, data: Partial<FrontHistoryEntryData>,
) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('front_history')
        .update(data)
        .eq('fronter_id', memberId)
        .eq('started_at', startedAt)
    if (error) throw error
}