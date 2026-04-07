"use client"
import MemberCard from "@/components/MemberCard";
import {fetchAllMembersByFolder} from "@/lib/clientApi/clientMembersAPI";
import MembersFooter from "@/components/MembersFooter";
import FolderCard from "@/components/FolderCard";
import {fetchFolder} from "@/lib/clientApi/clientFoldersAPI";
import {FolderData, MemberData} from "../../types/mindgardens";
import React, {useState} from "react";
import AddMemberUI from "@/components/AddMemberUI";
import {ArrowLeftIcon} from "lucide-react";
import {useFolderMap} from "@/context/FolderMapContext";

export default function FolderPageContent({ folderId }: { folderId: number}) {
    const { folderMap } = useFolderMap()
    const folders: FolderData[] = [...(folderMap!.get(folderId)?.values() ?? [])]
    const { data: members } = fetchAllMembersByFolder(folderId);
    const { data: folder } = fetchFolder(folderId)
    const [showAddAlter, setShowAddAlter] = useState(false)
    const [showAddGroup, setShowAddGroup] = useState(false)
    if (!folder) {
        return null
    }
    return (
        <main>
            <div className="flex w-full p-4">
                <h1 className="text-4xl font-bold text-text-primary">
                    {folder.folder_name}
                    <input
                        className="w-0"
                        tabIndex={-1}
                    />
                </h1>
                <button onClick={() => setShowAddGroup(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on p-2 py-1.5 rounded-lg hover:bg-accent-hover transition-colors ml-auto">
                    Add group
                </button>
                <div className="p-2 text-bg-base" />
                <button onClick={() => setShowAddAlter(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on px-4 py-1.5 rounded-lg hover:bg-accent-hover transition-colors">
                    Add alter
                </button>
                <div className="p-2 text-bg-base" />
                <button
                    onClick={() => {history.back()}}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            history.back()
                        }
                    }}
                >
                    <ArrowLeftIcon
                        className="shrink-0 cursor-pointer"
                    />
                </button>
                {showAddAlter && <AddMemberUI onClose={() => setShowAddAlter(false)} />}
            </div>
            <div className="w-[calc(100dvw-2rem)] h-1 bg-bg-sunken visible mb-4 ml-4 rounded-lg">

            </div>
            <div
                tabIndex={-1}
                className="overflow-y-auto flex-1 h-[calc(100dvh-10rem)]"
            >
                {folders?.map((folder: FolderData) => (
                    <FolderCard key={folder.folder_id} folderId={folder.folder_id} />
                ))}
                {members?.map((member: MemberData) => (
                    <MemberCard key={member.member_id} memberId={member.member_id} folderId={folder.folder_id}/>
                ))}
            </div>
            <MembersFooter />
        </main>
    )
}