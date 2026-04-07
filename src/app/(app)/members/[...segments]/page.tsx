"use server"
import ResolvePaths from "@/components/ResolvePaths";

export default async function MemberPage({params}: { params: Promise<{ segments: string[] }> }) {

    const {segments} = await params;

    return (
        <ResolvePaths path={segments} />
    )
}