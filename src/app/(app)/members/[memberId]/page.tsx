import {notFound} from "next/navigation";
import MemberPageContent from "@/components/MemberPageContent";
import {fetchMember} from "@/lib/MembersAPI";
import {MemberData} from "../../../../../types/mindgardens";

export default async function MemberPage({params}: { params: Promise<{ memberId: string }> }) {
    const {memberId} = await params;
    const member: MemberData = await fetchMember(parseInt(memberId));
    if (!member) notFound()

    return <MemberPageContent memberId={parseInt(memberId)} />
}