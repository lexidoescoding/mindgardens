import {
    SimplyPluralBoardMessageData,
    SimplyPluralChannelData, SimplyPluralMemberData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {BoardMessageData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralBoardMessages(
    apiToken: string,
    memberList: SimplyPluralResponseWrapper<SimplyPluralMemberData>[]
): Promise<Map<string, SimplyPluralResponseWrapper<SimplyPluralBoardMessageData>[]>> {
    const results = await Promise.allSettled(
        memberList.map(async (member) => {
            let response: Response
            try {
                response = await fetch(`https://api.apparyllis.com/v1/board/member/${member.id}`, {
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

            let data: SimplyPluralResponseWrapper<SimplyPluralBoardMessageData>[]
            try {
                data = await response.json()
            } catch {
                throw new SimplyPluralApiError(`Invalid JSON for channel ${member.id}`)
            }

            return { channelId: member.id, messages: data.filter(b => !!b.content) }
        })
    )

    const allMessages = new Map<string, SimplyPluralResponseWrapper<SimplyPluralBoardMessageData>[]>()
    for (const result of results) {
        if (result.status === "fulfilled" && result.value.messages.length > 0) {
            allMessages.set(result.value.channelId, result.value.messages)
        } else if (result.status === "rejected") {
            console.warn("Failed to fetch messages for channel:", result.reason)
        }
    }

    return allMessages
}

export async function setBoardMessages(boardMessages: Map<string, SimplyPluralResponseWrapper<SimplyPluralBoardMessageData>[]>, userId: number, memberIdMap: Map<string, number>, supabase: SupabaseClient): Promise<void> {

    const { error } = await supabase
        .from("board_message")
        .delete()
        .neq("id", 0)
    if(error) throw new SimplyPluralApiError(`Failed to clear existing board messages: ${error.message}`)

    for (const messages of boardMessages.values()) {
        let toBeSent: Omit<BoardMessageData, "id">[] = []
        for (const message of messages) {
            const sentFrom = memberIdMap.get(message.content.writtenBy)
            if(!sentFrom) continue
            const sentTo = memberIdMap.get(message.content.writtenFor)
            if (!sentTo) continue
            const sentAt = new Date(message.content.writtenAt).toISOString()
            toBeSent.push({
                sent_from: sentFrom,
                sent_to: sentTo,
                sent_at: sentAt,
                read: message.content.read,
                title: message.content.title,
                message: message.content.message,
                external: false,
                sent_by_member: true
            })
            const { error } = await supabase
                .from("board_message")
                .insert(toBeSent)
            if(error) throw new SimplyPluralApiError(`Failed to insert board message: ${error.message}`)
        }
    }
}