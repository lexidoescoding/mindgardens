"use client"
import {useRef, useState} from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function LoginPage() {
    const ref1 = useRef<HTMLInputElement>(null);
    const ref2 = useRef<HTMLInputElement>(null);
    const ref3 = useRef<HTMLInputElement>(null);
    const [DisplayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSystem, setIsSystem] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>, nextRef?: React.RefObject<HTMLInputElement | null>, onSubmit?: () => void) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextRef) {
                nextRef.current?.focus();
            } else if (onSubmit) {
                onSubmit();
            }
        }
    };

    async function handleSignup() {
        const { error } = await supabase.auth.signUp({ email, password, options: {
            data:{
                displayName: DisplayName,
            }
            } })
        if (error) setError(error.message)
        else {
            const { data: { user } } = await supabase.auth.getUser()
            const userId = user?.id
            const { error } = await supabase.from("user_profile").insert({
                uuid: userId,
                username: DisplayName,
                is_system: true
            })
            if (error) setError(error.message)
            else router.push("/")
        }
    }

    return (
        <main className="flex flex-col items-center justify-center h-dvh gap-4 rounded-xl">
            <Link href="development" className="text-sm text-accent-on bg-red-700 p-0.5 rounded-xl">IN ACTIVE DEVELOPMENT</Link>
            <div className="flex flex-col gap-3 w-80 bg-bg-surface p-6 rounded-2xl">
                <h1 className="font-bold text-lg">welcome to mindgardens</h1>
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    value={DisplayName}
                    placeholder="Display Name"
                    onChange={(e) => setDisplayName(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, ref2)}
                    ref={ref1}
                />
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, ref3)}
                    ref={ref2}
                />
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, undefined, handleSignup)}
                    ref={ref3}
                />
                <button className="flex items-center gap-2" onClick={() => setIsSystem(!isSystem)}>
                    <div style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '0.25rem',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-accent)',
                        backgroundColor: isSystem ? 'var(--color-accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                    }}>
                        {isSystem && <span style={{ color: 'var(--color-accent-on)', fontSize: '0.75rem' }}>✓</span>}
                    </div>
                    <span className="text-text-secondary" style={{ cursor: 'pointer' }}>Are you a system?</span>
                </button>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    className="bg-accent text-accent-on rounded-lg py-2 text-sm font-medium hover:bg-accent-hover transition-colors"
                    onClick={handleSignup}
                >
                    create account
                </button>
                <Link
                    href="/login"
                    className="bg-bg-sunken text-sm rounded-lg py-2 hover:bg-bg-hover transition-colors flex justify-center"
                >
                    log in
                </Link>
            </div>
        </main>
    )
}