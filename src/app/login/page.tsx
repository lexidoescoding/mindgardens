"use client"
import {useRef, useState} from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function LoginPage() {
    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else router.push("/")
    }

    return (
        <main className="flex flex-col items-center justify-center h-dvh gap-4">
            <Link href="development" className="text-sm text-accent-on bg-red-700 p-0.5 rounded-xl">IN ACTIVE DEVELOPMENT</Link>
            <div className="flex flex-col gap-3 w-80 bg-bg-surface p-6 rounded-2xl">
                <h1 className="font-bold text-lg">welcome back</h1>
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    ref={ref1}
                    onKeyDown={(e) => handleEnter(e, ref2)}
                />
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    ref={ref2} onKeyDown={(e) => handleEnter(e, undefined, handleLogin)}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                    className="bg-accent text-accent-on rounded-lg py-2 text-sm font-medium hover:bg-accent-hover transition-colors"
                    onClick={handleLogin}
                >
                    log in
                </button>
                <Link
                    href="/register"
                    className="bg-bg-sunken text-sm rounded-lg py-2 hover:bg-bg-hover transition-colors flex justify-center"
                >
                    create account
                </Link>
            </div>
        </main>
    )
}