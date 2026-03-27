"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function AddMemberUI({ onClose }: { onClose: () => void }) {
    const [advanced, setAdvanced] = useState(false)
    const [name, setName] = useState("")
    const [pronouns, setPronouns] = useState("")
    const supabase = createClient()

    async function handleSave() {
        if (!name) return
        const { error } = await supabase.from("alters").insert({
            alter_name: name,
            pronouns: pronouns,
            is_fronting: false,
            notif_on_front: false,
            color: 0,
        })
        if (error) console.error(error)
        else onClose()
    }

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} className="flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-accent rounded-xl p-6 w-80 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-bg-base)' }} onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-text-primary">Add alter</h2>
                <input
                    style={{ borderColor: 'var(--color-accent)', borderWidth: '2px', borderStyle: 'solid' }}
                    className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                    placeholder="Pronouns"
                    value={pronouns}
                    onChange={e => setPronouns(e.target.value)}
                />

                <button onClick={handleSave}
                        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-on)' }}
                        className="rounded-lg p-2 font-medium">
                    Save
                </button>

                <button onClick={() => setAdvanced(!advanced)}
                        className="text-text-secondary text-sm rounded-xl"
                        style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--color-bg-sunken)' }}>
                    {advanced ? "Hide advanced options" : "Advanced options"}
                </button>

                {advanced && (
                    <div className="flex flex-col gap-4">
                        test
                    </div>
                )}
            </div>
        </div>
    )
}