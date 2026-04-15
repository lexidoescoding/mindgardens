import {
    SimplyPluralChannelData,
    SimplyPluralChatMessageData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {ChatMessageData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralChatMessages(
    apiToken: string,
    chatChannels: SimplyPluralResponseWrapper<SimplyPluralChannelData>[]
): Promise<Map<string, SimplyPluralResponseWrapper<SimplyPluralChatMessageData>[]>> {
    const results = await Promise.allSettled(
        chatChannels.map(async (channel) => {
            let response: Response
            try {
                response = await fetch(`https://api.apparyllis.com/v1/chat/messages/${channel.id}?limit=100`, {
                    headers: { Authorization: apiToken }
                })
            } catch (e) {
                throw new SimplyPluralApiError(`Network request failed: ${e instanceof Error ? e.message : "unknown error"}`)
            }

            if (!response.ok) {
                throw new SimplyPluralApiError(
                    `Simply Plural returned ${response.status} ${response.statusText} for channel ${channel.id}`,
                    response.status
                )
            }

            let data: SimplyPluralResponseWrapper<SimplyPluralChatMessageData>[]
            try {
                data = await response.json()
            } catch {
                throw new SimplyPluralApiError(`Invalid JSON for channel ${channel.id}`)
            }

            return { channelId: channel.id, messages: data.filter(b => !!b.content) }
        })
    )

    const allMessages = new Map<string, SimplyPluralResponseWrapper<SimplyPluralChatMessageData>[]>()
    for (const result of results) {
        if (result.status === "fulfilled" && result.value.messages.length > 0) {
            allMessages.set(result.value.channelId, result.value.messages)
        } else if (result.status === "rejected") {
            console.warn("Failed to fetch messages for channel:", result.reason)
        }
    }

    return allMessages
}

export async function setChatMessages(
    chatMessagesMap: Map<string, SimplyPluralResponseWrapper<SimplyPluralChatMessageData>[]>,
    channelIdMap: Map<string, number>,
    userIdMap: Map<string, number>,
    supabase: SupabaseClient
): Promise<void> {
    let toBeSent: ChatMessageData[] = []
    for (const [key, messages] of chatMessagesMap.entries()) {
        for (const message of messages) {
            const channelId = channelIdMap.get(key)
            if(!channelId) throw new SimplyPluralApiError(`Channel ID ${message.id} not found in channelIdMap`)
            const sendAt = new Date(message.content.writtenAt).toISOString()
            const messageText = message.content.message
            const senderId = userIdMap.get(message.content.writer)
            if(!senderId) throw new SimplyPluralApiError(`Sender ID ${message.content.writer} not found in userIdMap`)
            toBeSent.push({
                channel_id: channelId,
                send_at: sendAt,
                send_from: senderId,
                message: messageText
            })
        }
    }
    const { error } = await supabase
        .from("chat_message")
        .upsert(toBeSent, {onConflict: "send_at, channel_id"})
    if(error) throw new SimplyPluralApiError(`Failed to insert chat messages into database: ${error.message}`)
}