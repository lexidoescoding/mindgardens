"use client"
import {createClient} from "@/lib/supabase-browser";
import {MemberData} from "../../../types/mindgardens";
import {QueryClient, useQuery, useQueryClient} from "@tanstack/react-query";
import {useFolderMap} from "@/context/FolderMapContext";

export function fetchAllMembers() {
    const queryClient = useQueryClient();
    return useQuery<MemberData[]>({
        queryKey: ['members'],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .order("member_id", { ascending: true })
            if (error) throw error

            // populate individual caches for free
            data?.forEach(member => {
                queryClient.setQueryData(['member', member.member_id], member)
            })

            return data ?? []
        }
    })

}

export function fetchMember(memberId: number) {
    const queryClient = useQueryClient()
    return useQuery<MemberData | null>({
        queryKey: ['member', memberId],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq("member_id", memberId)
                .maybeSingle()
            if (error) throw error

            queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
                old?.map(m => m.member_id === memberId ? data ?? m : m)
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

    queryClient.setQueryData(['member', memberId], (old: MemberData | undefined) =>
        old ? { ...old, member_name: name } : old
    )

    queryClient.setQueryData(['members'], (old: MemberData[] | undefined) =>
        old?.map(member =>
            member.member_id === memberId
                ? { ...member, member_name: name }
                : member
        )
    )
}

export function fetchAllMembersByFolder(folderId: number | null) {
    return useQuery<MemberData[]>({
        queryKey: ['member', { folderId }],
        staleTime: 1000 * 60 * 5,
        queryFn: async (): Promise<MemberData[]> => {
            if (!folderId) return []

            const supabase = createClient()
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
    })
}

export function fetchMemberByNameAndFolder(memberName: string,folderId: number | null, enabled: boolean = true, cachedMember?: MemberData) {
    return useQuery<MemberData | null>({
        queryKey: ['member', { memberName, folderId }],
        staleTime: 1000 * 60 * 5,
        initialData: cachedMember,
        queryFn: async (): Promise<MemberData | null> => {
            const supabase = createClient()

            if (folderId === null) {
                // root — just fetch by name, no folder check
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
                .maybeSingle() as { data: { member: MemberData } | null, error: any }
            if (error) throw error
            return data?.member ?? null
        },
        enabled
    })
}