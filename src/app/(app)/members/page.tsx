"use client"
import MemberCard from "@/components/MemberCard";
import {fetchAllMembers} from "@/lib/clientApi/clientMembersAPI";
import FolderCard from "@/components/FolderCard";
import {FolderData, MemberData} from "../../../../types/mindgardens";
import React, {useState} from "react";
import AddMemberUI from "@/components/AddMemberUI";
import {ArrowLeftIcon} from "lucide-react";
import {useFolderMap} from "@/context/FolderMapContext";
import AddFolderUI from "@/components/AddFolderUI";
import {useQueryClient} from "@tanstack/react-query";

export default function MembersPage() {
    const { folderMap } = useFolderMap()
    const folders: FolderData[] = [...(folderMap?.get(null)?.values() ?? [])]
    const { data: members } = fetchAllMembers()
    const [showAddMember, setShowAddMember] = useState(false)
    const [showAddFolder, setShowAddFolder] = useState(false)

    const queryClient = useQueryClient()
    console.log(queryClient.getQueryData(['members']))

    return (
        <main>
            <div className="flex w-full p-4">
                <h1 className="text-4xl font-bold text-text-primary">
                    Root
                    <input
                        className="w-0"
                        tabIndex={-1}
                    />
                </h1>
                <button onClick={() => setShowAddFolder(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on p-2 py-1.5 rounded-lg hover:bg-accent-hover transition-colors ml-auto">
                    Add folder
                </button>
                <div className="p-2 text-bg-base" />
                <button onClick={() => setShowAddMember(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on px-4 py-1.5 rounded-lg hover:bg-accent-hover transition-colors">
                    Add member
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
                {showAddMember && <AddMemberUI onClose={() => setShowAddMember(false)} />}
                {showAddFolder && <AddFolderUI onClose={() => setShowAddFolder(false)} />}
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
                <div/>
                {members?.map((member: MemberData) => (
                    <MemberCard key={member.member_id} memberId={member.member_id} folderId={null}/>
                ))}
            </div>
        </main>
    )
}