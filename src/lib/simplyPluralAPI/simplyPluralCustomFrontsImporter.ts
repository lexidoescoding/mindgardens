import {SimplyPluralApiError} from "../../../types/mindgardens";
import {SimplyPluralCustomFrontData, SimplyPluralResponseWrapper} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralCustomFronts(apiToken: string, userId: string) {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/customFronts/${userId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralCustomFrontData>[]
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

export async function setCustomFronts(customFronts: SimplyPluralResponseWrapper<SimplyPluralCustomFrontData>[], userId: number, supabase: SupabaseClient, privacyBucketMap: Map<string,number>): Promise<Map<string, number>> {
    let customFrontIdMap = new Map<string, number>()
    await Promise.all(
        customFronts.map(async (front) => {
            const {data, error} = await supabase
                .from("custom_fronts")
                .upsert({
                    system_id: userId,
                    front_name: front.content.name,
                    note: "",
                    tags: [],
                    description: front.content.desc,
                    color: parseInt(front.content.color.replace('#', ''), 16),
                    icon_source: front.content.avatarUrl,
                    notif_on_front: !front.content.preventsFrontNotifs,
                    privacy_buckets: front.content.buckets.map(bucket => {
                        const privacyBucketId = privacyBucketMap.get(bucket)
                        if(!privacyBucketId) throw new SimplyPluralApiError(`No privacy bucket found for bucket with id ${bucket} in custom front with id ${front.id}`)
                        return privacyBucketId
                    }),
                }, {onConflict: "front_name, system_id"})
                .select("custom_front_id")
                .single()
            if (error) throw new SimplyPluralApiError(`Failed to insert custom front ${front.content.name} into database: ${error.message}`)
            customFrontIdMap.set(front.id, data.custom_front_id)
        })
    )
    return customFrontIdMap
}