import {SimplyPluralApiError} from "../../../types/mindgardens";
import {
    SimplyPluralChatCategoryData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";

export async function getSimplyPluralChatCategories(apiToken: string) {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/chat/categories`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralChatCategoryData>[]
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

export async function setChatCategories(chatCategories: SimplyPluralResponseWrapper<SimplyPluralChatCategoryData>[], userId: number, supabase: any): Promise<Map<string, number>> {
    const chatChannelToCategoryMap = new Map<string, number>()
    const promise = Promise.all(
        chatCategories.map(async chatCategory => {
            const { data, error } = await supabase
                .from("chat_categories")
                .upsert({
                    name: chatCategory.content.name,
                    user_id: userId,
                    description: chatCategory.content.desc
                }, {onConflict: "user_id, name"})
                .select("id")
                .single()
            if(error) throw new SimplyPluralApiError(`Failed to insert chat category ${chatCategory.content.name} into database: ${error.message}`)
            for(const channel of chatCategory.content.channels) {
                chatChannelToCategoryMap.set(channel, data.id)
            }
        })
    )
    await promise
    return chatChannelToCategoryMap
}