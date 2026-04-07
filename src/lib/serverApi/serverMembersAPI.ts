import {createServerSupabaseClient} from "@/lib/supabase-server";
import {MemberData} from "../../../types/mindgardens";

export async function fetchAllMembers(): Promise<MemberData[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("member_id", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function fetchMember(memberId: number): Promise<MemberData | null> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("member_id", memberId)
        .maybeSingle()
    if (error) throw error
    return data
}

export async function updateMemberName(memberId: number, name: string): Promise<void> {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
        .from('members')
        .update({ member_name: name })
        .eq('member_id', memberId)
    if (error) throw error
}

export async function fetchAllMembersByFolder(folderId: number): Promise<MemberData[]> {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("folder_junction_table")
        .select(`member:members (*)`)
        .eq("folder_id", folderId) as {
        data: { member: MemberData }[] | null
        error: any
    }
    if (error) throw error
    return data?.map(row => row.member) ?? []
}

export async function fetchMemberByNameAndFolder(memberName: string, folderId: number | null): Promise<MemberData | null> {
    const supabase = await createServerSupabaseClient()
    if (folderId === null) {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("member_name", memberName)
            .maybeSingle()
        if (error) throw error
        return data
    }

    const { data, error } = await supabase
        .from("folder_junction_table")
        .select(`member:members (*)`)
        .eq("folder_id", folderId)
        .eq("members.member_name", memberName)
        .maybeSingle() as {
        data: { member: MemberData } | null
        error: any
    }
    if (error) throw error
    return data?.member ?? null
}