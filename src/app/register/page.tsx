"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function LoginPage() {
    const [DisplayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()

    async function handleSignup() {
        const { error } = await supabase.auth.signUp({ email, password, options: {
            data:{
                displayName: DisplayName,
            }
            } })
        if (error) setError(error.message)
        else router.push("/")
    }

    return (
        <main className="flex flex-col items-center justify-center h-dvh gap-4 rounded-xl">
            <div className="flex flex-col gap-3 w-80 bg-bg-surface p-6 rounded-2xl">
                <h1 className="font-bold text-lg">welcome to WAI</h1>
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    value={DisplayName}
                    placeholder="Display Name"
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="bg-bg-sunken rounded-lg px-3 py-2 text-sm outline-none"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
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