"use server"
import {FolderData, MemberData} from "../../../types/mindgardens";
import {createServerSupabaseClient} from "@/lib/supabase-server";

export async function fetchAllFolders(): Promise<FolderData[]>  {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("folder_name", { ascending: true })
    if (error) throw error
    return data ?? []
}

export async function fetchFolders(folderId: number): Promise<MemberData>  {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("folder_id", folderId)
        .maybeSingle()
    if (error) throw error
    return data ?? []
}

export async function fetchAllRootFolders(): Promise<FolderData[]>  {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("folder_name", { ascending: true })
        .is("parent",null)
    if (error) throw error
    return data ?? []
}

export async function fetchAllFoldersOrderedByParent(): Promise<FolderData[]>  {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("parent", { ascending: true })
    if (error) throw error
    return data ?? []
}