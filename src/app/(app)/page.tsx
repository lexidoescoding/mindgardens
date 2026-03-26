import Link from "next/link";
export default function Home() {
    return (
        <main>
            <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[calc(100dvh-4rem)] p-4 auto-rows-fr">
                <a className="bg-bg-sunken hover:bg-bg-hover col-span-2 row-span-2 rounded-xl flex items-center justify-center">
                    fronting
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover rounded-xl flex items-center justify-center">
                    friends
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover row-span-2 rounded-xl flex text-center items-center justify-center">
                    fronting history
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover rounded-xl flex items-center justify-center">
                    polls
                </a>
                <Link href="/members" className="bg-bg-sunken hover:bg-bg-hover col-span-2 rounded-xl flex items-center justify-center">
                    members
                </Link>
                <a className="bg-bg-sunken hover:bg-bg-hover rounded-xl flex text-center items-center justify-center">
                    privacy buckets
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover row-span-2 rounded-xl flex items-center justify-center">
                    innerworld
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover col-span-2 rounded-xl flex items-center justify-center">
                    messages
                </a>
                <a className="bg-bg-sunken hover:bg-bg-hover rounded-xl flex items-center justify-center">
                    journal
                </a>
            </div>
        </main>
    )
}