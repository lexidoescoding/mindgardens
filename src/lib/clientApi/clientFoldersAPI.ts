"use client"
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {FolderData, MemberData} from "../../../types/mindgardens";
import {createClient} from "@/lib/supabase-browser";

export function fetchAllFolders(): UseQueryResult<FolderData[]> {
    const queryClient = useQueryClient();
    return useQuery<FolderData[]>({
        queryKey: ['folders', 'all'],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("folders")
                .select("*")
                .order("folder_name", { ascending: true })
            if (error) throw error

            data?.forEach(folder => {
                queryClient.setQueryData(['folder', folder.folder_id], folder)
            })

            return data ?? []
        }
    })
}

export function fetchFolder(folderId: number) {
    const queryClient = useQueryClient()
    return useQuery<FolderData>({
        queryKey: ['folder', folderId],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("folders")
                .select("*")
                .eq("folder_id", folderId)
                .maybeSingle()
            if (error) throw error

            // update the member in the list cache
            queryClient.setQueryData(['folders'], (old: FolderData[] | undefined) =>
                old?.map(folder => folder.folder_id === folderId ? data : folder)
            )

            return data
        }
    })
}

export function fetchAllRootFolders() {
    const queryClient = useQueryClient();
    return useQuery<FolderData[]>({
        queryKey: ['folders', 'root'],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("folders")
                .select("*")
                .is("parent", null)
                .order("folder_name", { ascending: true })
            if (error) throw error

            data?.forEach(folder => {
                queryClient.setQueryData(['folder', folder.folder_id], folder)
            })

            return data ?? []
        }
    })
}

export function fetchAllChildFolders(folderId: number | null) {
    const queryClient = useQueryClient();
    return useQuery<FolderData[]>({
        queryKey: ['folders', 'children', folderId],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("folders")
                .select("*")
                .eq("parent", folderId)
                .order("folder_name", { ascending: true })
            if (error) throw error

            data?.forEach(folder => {
                queryClient.setQueryData(['folder', folder.folder_id], folder)
            })

            return data ?? []
        }
    })
}

export function fetchAllFoldersOrderedByParent() {
    const queryClient = useQueryClient();
    return useQuery<FolderData[]>({
        queryKey: ['folders', 'ordered'],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("folders")
                .select("*")
                .order("parent", { ascending: true, nullsFirst: true})
            if (error) throw error

            data?.forEach(folder => {
                queryClient.setQueryData(['folder', folder.folder_id], folder)
            })

            return data ?? []
        }
    })
}