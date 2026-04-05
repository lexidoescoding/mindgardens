import { createServerSupabaseClient } from "@/lib/supabase-server"
import { createClient} from "@/lib/supabase-browser";

export async function fetchAllMembers() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("member_id", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function fetchMember(memberId: number) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("member_id", memberId)
        .maybeSingle()
    if (error) throw error
    return data
}

export async function updateMemberName(memberId: number, name: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('members')
        .update({ member_name: name })
        .eq('member_id', memberId)
    if (error) throw error
}