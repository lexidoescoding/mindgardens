"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

const MAX_TAG_LENGTH = 20

export default function AddMemberUI({ onClose }: { onClose: () => void }) {
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [advanced, setAdvanced] = useState(false)
    const [name, setName] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [Note, setNote] = useState("")
    const [description, setDescription] = useState("")
    const [avatar, setAvatar] = useState("")
    const [isFronting, setIsFronting] = useState(false)
    const [notifOnFront, setNotifOnFront] = useState(false)
    const [color, setColor] = useState(0)
    const [privacy_buckets, setPrivacyBuckets] = useState([])
    const supabase = createClient()
    const router = useRouter()

    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && tagInput.trim()) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
            e.preventDefault()
        }
    }

    function handleTagInput(value: string) {
        if (value.length <= MAX_TAG_LENGTH) setTagInput(value)
    }

    function removeTag(index: number) {
        setTags(tags.filter((_, i) => i !== index))
    }

    async function handleSave() {
        if (!name) return
        const { error } = await supabase.from("alters").insert({
            alter_name: name,
            pronouns: pronouns,
            Note: Note,
            tags: tags,
            description: description,
            avatar_source: avatar,
            is_fronting: isFronting,
            notif_on_front: notifOnFront,
            color: color,
            privacy_buckets: privacy_buckets,
        })
        if (error) console.error(error)
        else{
            router.refresh()
            onClose()
        }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} className="flex items-center justify-center z-50" onClick={onClose}>
            <div className="rounded-xl p-6 w-80 flex flex-col gap-4 max-h-[80dvh]" style={{ backgroundColor: 'var(--color-bg-base)' }} onClick={e => e.stopPropagation()}>
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
                    placeholder="Note"
                    value={Note}
                    onChange={e => setNote(e.target.value)}
                />

                <button onClick={handleSave}
                        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-on)' }}
                        className="rounded-lg p-2 font-medium">
                    Save
                </button>

                <button onClick={() => setAdvanced(!advanced)}
                        className="text-text-secondary text-sm rounded-xl"
                        style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--color-bg-sunken)', cursor: 'pointer' }}>
                    {advanced ? "Hide advanced options" : "Advanced options"}
                </button>

                {advanced && (
                    <div className="flex flex-col gap-4 overflow-y-auto">
                        <input
                            className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                            placeholder="Pronouns"
                            value={pronouns}
                            onChange={e => setPronouns(e.target.value)}
                        />
                        <textarea
                            className="bg-bg-sunken rounded-lg p-2 text-text-primary resize-none"
                            placeholder="Description"
                            rows={3}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                        <div style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'var(--color-bg-sunken)' }}
                             className="bg-bg-sunken rounded-lg p-2 flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span key={i} style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-on)' }}
                                      className="rounded-md px-2 py-0.5 text-sm flex items-center gap-1">
                                    {tag}
                                    <button onClick={() => removeTag(i)}>×</button>
                                </span>
                            ))}
                            <input
                                className="bg-transparent outline-none text-text-primary flex-1 min-w-20"
                                placeholder={`Add tag... (max ${MAX_TAG_LENGTH} chars)`}
                                value={tagInput}
                                onChange={e => handleTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                            />
                        </div>
                        <input
                            className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                            placeholder="Avatar source (link)"
                            value={avatar}
                            onChange={e => setAvatar(e.target.value)}
                        />
                        <div>
                            <div className="flex items-center gap-2" onClick={() => setNotifOnFront(!notifOnFront)}>
                                <div style={{
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    borderRadius: '0.25rem',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--color-accent)',
                                    backgroundColor: notifOnFront ? 'var(--color-accent)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}>
                                    {notifOnFront && <span style={{ color: 'var(--color-accent-on)', fontSize: '0.75rem' }}>✓</span>}
                                </div>
                                <span className="text-text-secondary" style={{ cursor: 'pointer' }}>Notify on front changes?</span>
                            </div>
                            <div className="flex items-center gap-2" onClick={() => setIsFronting(!isFronting)}>
                                <div style={{
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    borderRadius: '0.25rem',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--color-accent)',
                                    backgroundColor: isFronting ? 'var(--color-accent)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}>
                                    {isFronting && <span style={{ color: 'var(--color-accent-on)', fontSize: '0.75rem' }}>✓</span>}
                                </div>
                                <span className="text-text-secondary" style={{ cursor: 'pointer' }}>Is fronting</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}