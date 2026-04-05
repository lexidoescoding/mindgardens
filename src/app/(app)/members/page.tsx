"use client"
import MemberCard from "@/components/MemberCard";
import {fetchAllMembers} from "@/lib/queries";
import MembersHeader from "@/components/MembersHeader"
import MembersFooter from "@/components/MembersFooter";
import {MemberData} from "../../../../types/mindgardens";
import {useQuery, useQueryClient} from "@tanstack/react-query";

export default function MembersPage() {
    const queryClient = useQueryClient();

    const { data: members } = useQuery<MemberData[]>({
        queryKey: ['members'],
        queryFn: async () => {
            const data = await fetchAllMembers()
            // populate individual caches for free
            data.forEach(member => {
                queryClient.setQueryData(['member', member.member_id], member)
            })
            return data
        }
    })

    return (
        <main>
            <MembersHeader />
            <div className="w-[calc(100dvw-2rem)] h-1 bg-bg-sunken visible mb-4 ml-4 rounded-lg">

            </div>
            <div
                tabIndex={-1}
                className="overflow-y-auto flex-1 h-[calc(100dvh-10rem)]"
            >
                {members?.map((member) => (
                    <MemberCard key={member.member_id} memberId={member.member_id} />
                ))}
            </div>
            <MembersFooter />
        </main>
    )
}