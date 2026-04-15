import {SimplyPluralApiError} from "../../../types/mindgardens";
import {
    SimplyPluralChannelData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralChatChannels(apiToken: string) {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/chat/channels `,
            {
                headers: {
                    Authorization: apiToken,
                },
            }
        )
    } catch (e) {
        throw new SimplyPluralApiError(`Network request failed: ${e instanceof Error ? e.message : "unknown error"}`)
    }

    if (!response.ok) {
        throw new SimplyPluralApiError(
            `Simply Plural returned ${response.status} ${response.statusText}`,
            response.status
        )
    }

    let data: SimplyPluralResponseWrapper<SimplyPluralChannelData>[]
    try {
        data = await response.json()
    } catch {
        throw new SimplyPluralApiError("Simply Plural response was not valid JSON")
    }

    data.forEach(bucket => {
        if(!bucket.content) {
            throw new SimplyPluralApiError("Simply Plural response missing expected 'content' field in one of the members")
        }
    })
    return data
}

export async function setChatChannels(chatChannels: SimplyPluralResponseWrapper<SimplyPluralChannelData>[], supabase: SupabaseClient, channelCategoryMap: Map<string, number>): Promise<Map<string, number>> {
    const channelIdMap = new Map<string, number>()
    console.log("Setting chat channels with category map:", channelCategoryMap)
    await Promise.all(
        chatChannels.map(async chatChannel => {
            const categoryId = channelCategoryMap.get(chatChannel.id)
            console.log("Setting chat channels with category map:", categoryId)
            if(!categoryId) throw new SimplyPluralApiError(`Chat channel ${chatChannel.content.name} has category id ${chatChannel.id} which was not found in category map`)
            const {data, error} = await supabase
                .from("chat_channels")
                .upsert({
                    name: chatChannel.content.name,
                    category_id: channelCategoryMap.get(chatChannel.id) ?? null,
                }, {onConflict: "category_id, name"})
                .select("chat_id")
                .single()
            if(error) throw new SimplyPluralApiError(`Failed to insert chat channel ${chatChannel.content.name} into database: ${error.message}`)
            channelIdMap.set(chatChannel.id, data.chat_id)
        }))
    return channelIdMap
}