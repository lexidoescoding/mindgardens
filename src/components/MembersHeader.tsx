"use client"
import { useState } from "react"
import AddMemberUI from "@/components/AddMemberUI"

export default function MembersHeader() {
    const [showAddAlter, setShowAddAlter] = useState(false)
    const [showAddGroup, setShowAddGroup] = useState(false)

    return (
        <div className="flex w-full p-4">
            <h1 className="text-4xl font-bold text-text-primary">Root</h1>
            <button onClick={() => setShowAddGroup(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on p-2 py-1.5 rounded-lg hover:bg-accent-hover transition-colors ml-auto">
                Add group
            </button>
            <div className="p-2 text-bg-base" />
            <button onClick={() => setShowAddAlter(true)} className="text-[12px] self-center font-medium bg-accent text-accent-on px-4 py-1.5 rounded-lg hover:bg-accent-hover transition-colors">
                Add alter
            </button>
            {showAddAlter && <AddMemberUI onClose={() => setShowAddAlter(false)} />}
        </div>
    )
}