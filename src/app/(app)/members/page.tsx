import MemberCard from "@/components/MemberCard";
import {fetchAllAlters} from "@/lib/supabaseFetches";
import MembersHeader from "@/components/MembersHeader"

export default async function MembersPage() {
    const toBeDisplayed = await fetchAllAlters();
    return (
        <main>
            <MembersHeader />
            <div className="w-[calc(100dvw-2rem)] h-1 bg-bg-sunken visible mb-4 ml-4 rounded-lg">

            </div>
            <div className="overflow-y-auto flex-1 h-[calc(100dvh-4rem)]">
                {toBeDisplayed.map((alter) => (
                    <MemberCard key={alter.alter_id} alterId={alter.alter_id} />
                ))}
            </div>
        </main>
    )
}