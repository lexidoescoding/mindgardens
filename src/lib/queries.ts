"use client"
import {createClient} from "@/lib/supabase-browser";
import {MemberData} from "../../types/mindgardens";
import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";

export async function fetchAllMembers() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("member_id", { ascending: true })
    if (error) throw error

    return data ?? []
}

export function fetchMember(memberId: number) {
    const queryClient = useQueryClient()
    return useQuery<MemberData>({
        queryKey: ['member', memberId],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq("member_id", memberId)
                .maybeSingle()
            if (error) throw error

            // update the member in the list cache
            queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
                old?.map(m => m.member_id === memberId ? data : m)
            )

            return data
        }
    })
}

export async function updateMemberName(memberId: number, name: string, queryClient: QueryClient) {
    const supabase = createClient()
    const { error } = await supabase
        .from('members')
        .update({ member_name: name })
        .eq('member_id', memberId)
    if (error) throw error

    // patch the specific member
    queryClient.setQueryData(['member', memberId], (old: MemberData) => ({
        ...old,
        member_name: name
    }))

    // also update it in the members list
    queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
        old?.map(member => member.member_id === memberId ? { ...member, member_name: name } : member)
    )
}
