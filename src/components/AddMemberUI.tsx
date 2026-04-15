"use client"
import {useRef, useState} from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import SetPrivacyBuckets from "@/components/SetPrivacyBuckets";
import {fetchAllPrivacyBuckets} from "@/lib/clientApi/clientPrivacyBucketsAPI";
import {useQueryClient} from "@tanstack/react-query";
import {fetchAllMembers} from "@/lib/clientApi/clientMembersAPI";

const MAX_TAG_LENGTH = 20

export default function AddMemberUI({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient();
    fetchAllPrivacyBuckets()

    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [advanced, setAdvanced] = useState(false)
    const [name, setName] = useState("")
    const [pronouns, setPronouns] = useState("")
    const [note, setNote] = useState("")
    const [description, setDescription] = useState("")
    const [avatar, setAvatar] = useState("")
    const [isFronting, setIsFronting] = useState(false)
    const [notifOnFront, setNotifOnFront] = useState(false)
    const [color, setColor] = useState(0)
    const [privacyBuckets, setPrivacyBuckets] = useState<number[]>([])
    const [showPrivacyBuckets, setShowPrivacyBuckets] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const ref = useRef<HTMLInputElement>(null)

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
        console.log(notifOnFront)
        const { error } = await supabase.from("members").insert({
            member_name: name,
            pronouns: pronouns,
            note: note,
            tags: tags,
            description: description,
            avatar_source: avatar,
            is_fronting: isFronting,
            notif_on_front: notifOnFront,
            color: color,
            privacy_buckets: privacyBuckets,
        })
        if (error) console.error(error)
        else{
            queryClient.invalidateQueries({ queryKey: ['members'] })
            onClose()
        }
    }

    return (
        <div className="flex items-center justify-center z-50 fixed inset-0 bg-[rgba(0,0,0,0.5)]" onClick={onClose}>
            <div
                className="rounded-xl p-6 w-80 flex flex-col gap-4 max-h-[80dvh]"
                style={{ backgroundColor: 'var(--color-bg-base)' }}
                onClick={e => e.stopPropagation()}
            >
                {showPrivacyBuckets ?
                    <SetPrivacyBuckets setPrivacyBuckets={setPrivacyBuckets} privacyBuckets={privacyBuckets} onClose={() => setShowPrivacyBuckets(false)}/>
                        :
                    <>
                        <h2 className="text-xl font-bold text-text-primary">Add member</h2>
                        <input
                            autoFocus
                            style={{ borderColor: 'var(--color-accent)', borderWidth: '2px', borderStyle: 'solid' }}
                            className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" ? (e.preventDefault(), ref.current?.focus()) : null
                            }
                        />
                        <input
                            className="bg-bg-sunken rounded-lg p-2 text-text-primary"
                            placeholder="Note"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            ref={ref}
                            onKeyDown={(e) =>
                                e.key === "Enter" ? (e.preventDefault(), handleSave()) : null
                            }
                        />

                        <button onClick={handleSave}
                                className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover"
                        >
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
                                    className="bg-bg-sunken rounded-lg p-2 text-text-primary resize-none min-h-25"
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
                                <button
                                    onClick={() => {
                                        setShowPrivacyBuckets(true)
                                    }}
                                    className="rounded-lg p-2 font-medium bg-accent text-accent-on hover:bg-accent-hover"
                                >
                                    privacy buckets
                                </button>
                            </div>
                        )}
                    </>
                }
            </div>
        </div>
    )
}