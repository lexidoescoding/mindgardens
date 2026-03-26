import Image from "next/image";
import Link from "next/link";
export default function Navbar() {
    return (
        <nav className="bg-bg-surface p-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg ">Home</Link>
            <div className="flex gap-4">
                <Link href="/about">About</Link>
                <Link href="/about">Settings</Link>
            </div>
        </nav>
    )
}