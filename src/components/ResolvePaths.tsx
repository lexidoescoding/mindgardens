"use client"

import {useMemo} from "react"
import {useFolderMap} from "@/context/FolderMapContext"
import {fetchMemberByNameAndFolder} from "@/lib/clientApi/clientMembersAPI"
import {FolderData} from "../../types/mindgardens"
import FolderPageContent from "@/components/FolderPageContent"
import MemberPageContent from "@/components/MemberPageContent"
import {notFound} from "next/navigation";

export default function ResolvePaths({ path }: { path: string[] }) {
    const { folderMap, memberByName } = useFolderMap()

    type FolderResolution =
        | { type: "folder"; folderId: number | null }
        | { type: "member"; name: string; parentFolderId: number | null }

    const folderResolution: FolderResolution | null = useMemo((): FolderResolution | null => {
        if (!folderMap) return null
        if (path.length === 0) return { type: "folder" as const, folderId: null }

        let currentParent: number | null = null
        let resolvedFolder: FolderData | null = null

        for (let i = 0; i < path.length; i++) {
            const segment = path[i]
            const nextFolder: FolderData | undefined = folderMap.get(currentParent)?.get(segment)

            if (nextFolder) {
                resolvedFolder = nextFolder
                currentParent = nextFolder.folder_id
                continue
            }

            if (i !== path.length - 1) return null

            // last segment didn't match a folder — might be a member
            return { type: "member" as const, name: segment, parentFolderId: currentParent }
        }

        return { type: "folder" as const, folderId: resolvedFolder!.folder_id }
    }, [folderMap, path])

    const memberQuery = fetchMemberByNameAndFolder(
        folderResolution?.type === "member" ? folderResolution.name : "",
        folderResolution?.type === "member" ? folderResolution.parentFolderId : null,
        folderResolution?.type === "member",
        folderResolution?.type === "member" ? memberByName?.get(folderResolution.name) : undefined
    )

    if (folderResolution == null) {
        return null
    }

    if (folderResolution.type === "folder") {
        return <FolderPageContent folderId={folderResolution.folderId!} />
    }

    if (memberQuery.isLoading) return null // or a spinner
    if (!memberQuery.data) return notFound() // 404

    return <MemberPageContent memberId={memberQuery.data.member_id} />
}