import {SimplyPluralApiError} from "../../../types/mindgardens";
import {
    SimplyPluralNoteData,
    SimplyPluralMemberData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralNotes(apiToken: string, memberList: SimplyPluralResponseWrapper<SimplyPluralMemberData>[], userId: string) {
    const results = await Promise.allSettled(
        memberList.map(async (member) => {
            let response: Response
            try {
                response = await fetch(`https://api.apparyllis.com/v1/notes/${userId}/${member.id}`, {
                    headers: { Authorization: apiToken }
                })
            } catch (e) {
                throw new SimplyPluralApiError(`Network request failed: ${e instanceof Error ? e.message : "unknown error"}`)
            }

            if (!response.ok) {
                throw new SimplyPluralApiError(
                    `Simply Plural returned ${response.status} ${response.statusText} for channel ${member.id}`,
                    response.status
                )
            }

            let data: SimplyPluralResponseWrapper<SimplyPluralNoteData>[]
            try {
                data = await response.json()
            } catch {
                throw new SimplyPluralApiError(`Invalid JSON for channel ${member.id}`)
            }

            return { channelId: member.id, messages: data.filter(b => !!b.content) }
        })
    )

    const allMessages = new Map<string, SimplyPluralResponseWrapper<SimplyPluralNoteData>[]>()
    for (const result of results) {
        if (result.status === "fulfilled" && result.value.messages.length > 0) {
            allMessages.set(result.value.channelId, result.value.messages)
        } else if (result.status === "rejected") {
            console.warn("Failed to fetch messages for channel:", result.reason)
        }
    }

    return allMessages
}

export async function setNotes(
    notes: Map<string, SimplyPluralResponseWrapper<SimplyPluralNoteData>[]>,
    userId: number,
    memberIdMap: Map<string, number>,
    supabase: SupabaseClient
) {
    await Promise.all(
        Array.from(notes.values()).flatMap((memberNotes) =>{
            return  memberNotes.map(async (noteEntry) => {
                const memberId = memberIdMap.get(noteEntry.content.member)
                if(!memberId) throw new SimplyPluralApiError(`No member found for note with note id ${noteEntry.id}`)
                const date = new Date(noteEntry.content.date).toISOString()
                const { error } = await supabase
                    .from("notes")
                    .upsert({
                        member_id: memberId,
                        title: noteEntry.content.title,
                        body: noteEntry.content.note,
                        color: parseInt(noteEntry.content.color.replace('#', ''), 16),
                        date: date
                    }, { onConflict: "member_id,title" })
                if(error) throw new SimplyPluralApiError(`Failed to import note with id ${noteEntry.id}: ${error.message}`)
            })
        })
    )
}