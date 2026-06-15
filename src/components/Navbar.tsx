import Link from "next/link";
import {ReactNode} from "react";
import {Sparkles} from "lucide-react"
export default function Navbar({ children }: { children: ReactNode }) {
    return (
        <main>
            <nav className="bg-bg-surface p-4 flex items-center justify-between">
                <Link href="/" className="font-bold text-lg ">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-[17px] font-semibold uppercase tracking-[0.2em]">
                        <Sparkles className="h-4.25 w-4.25 text-accent" />
                        Mind Gardens
                    </div>
                </Link>
                <Link href="development" className="text-sm text-accent-on bg-red-700 p-0.5 rounded-xl">IN ACTIVE DEVELOPMENT</Link>
                <div className="flex gap-4">
                    <Link href="/about">About</Link>
                    <Link href="/settings">Settings</Link>
                </div>
            </nav>
            {children}
        </main>
    )
}