"use client"
import {useRef, useState} from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link";
import {useQueryClient} from "@tanstack/react-query";
import Image from "next/image";
import background from "@/jpg/2803_SkVNQSBCUlkgMTQ5MC0xNQ.jpg";
import NamedField from "@/components/NamedField";
import NamedCheckbox from "@/components/NamedCheckbox";

export default function LoginPage() {
    const ref1 = useRef<HTMLInputElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()
    const supabase = createClient()
    const queryClient = useQueryClient()

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
        await  queryClient.invalidateQueries()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else router.push("/")
    }

    return (
        <main className="relative w-dvw h-dvh overflow-hidden bg-[#f4e4dc]">
            <Image
                src={background}
                alt="background"
                className="absolute h-full w-auto"
            />
            <div className="absolute top-1/2 -translate-y-1/2 -right-[225vh] h-[300vh] aspect-square rounded-full bg-bg-base"/>
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[min(100dvw,70dvh)] h-[60dvh] flex flex-col gap-4 justify-center">
                <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">
                    Welcome back
                </h1>

                <NamedField name={"Email"} className="mx-5">
                    <input
                        className="w-full focus-visible:outline-0 rounded-md px-2"
                        placeholder="AmazingPerson@cool.com"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        ref={ref1}
                        onKeyDown={e => handleEnter(e, ref2)}
                    />
                </NamedField>
                <NamedField name={"Password"} className="mx-5">
                    <input
                        className="w-full focus-visible:outline-0 rounded-md px-2"
                        placeholder="AmazingPassword123"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        ref={ref2}
                        onKeyDown={e => handleEnter(e, undefined, handleLogin)}
                    />
                </NamedField>

                <button className="mx-5 bg-accent rounded-xl py-2 px-4 font-semibold hover:bg-accent-hover transition-colors" onClick={handleLogin}>
                    log in
                </button>
                <div className="flex justify-between">
                    <Link href="/register" className="mx-5 text-sm text-text-secondary hover:text-text-primary transition-colors">
                        Don't have an account? Sign up
                    </Link>
                    {error && <p className="mx-5 text-red-400 text-sm">{error}</p>}
                </div>
            </div>
            <a href="https://de.vecteezy.com/gratis-vektor/landschaft" className="absolute bottom-0 right-0 z-20 text-text-muted text-xs">Landschaft Vektoren von Vecteezy</a>
        </main>
    )
}