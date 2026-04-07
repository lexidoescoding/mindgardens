"use client"

import {createContext, useContext, useMemo} from "react"
import {FolderData, MemberData} from "../../types/mindgardens"
import {fetchAllFolders} from "@/lib/clientApi/clientFoldersAPI"
import {fetchAllMembers} from "@/lib/clientApi/clientMembersAPI"

type FolderMap = Map<number | null, Map<string, FolderData>>
type MemberByName = Map<string, MemberData>

const FolderMapContext = createContext<{
    folderMap: FolderMap | null
    memberByName: MemberByName | null
} | null>(null)

export function FolderMapProvider({ children }: { children: React.ReactNode }) {
    const { data: allFolders } = fetchAllFolders()
    const { data: allMembers } = fetchAllMembers()

    const folderMap = useMemo(() => {
        if (!allFolders) return null
        const map = new Map<number | null, Map<string, FolderData>>()
        for (const folder of allFolders) {
            const parent = folder.parent ?? null
            if (!map.has(parent)) map.set(parent, new Map())
            map.get(parent)!.set(folder.folder_name, folder)
        }
        return map
    }, [allFolders])

    const memberByName = useMemo(() => {
        if (!allMembers) return null
        return new Map(allMembers.map(m => [m.member_name, m]))
    }, [allMembers])

    return (
        <FolderMapContext.Provider value={{ folderMap, memberByName }}>
            {children}
        </FolderMapContext.Provider>
    )
}

export function useFolderMap() {
    const ctx = useContext(FolderMapContext)
    if (!ctx) throw new Error("useFolderMap must be used within FolderMapProvider")
    return ctx
}