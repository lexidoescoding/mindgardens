import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function fetchAllAlters() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("alters")
        .select("*")
    if (error) throw error
    return data ?? []
}

export async function fetchAlter(id: number) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("alters")
        .select("*")
        .eq("alter_id", id)
        .single()
    if (error) throw error
    return data
}