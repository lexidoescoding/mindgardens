import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function fetchAllMembers() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
    if (error) throw error
    return data ?? []
}

export async function fetchMember(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single()
    if (error) throw error
    return data
}