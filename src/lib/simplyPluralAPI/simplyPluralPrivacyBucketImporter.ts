"use server"
import {
    SimplyPluralResponseWrapper,
    SimplyPluralPrivacyBucketData,
    SimplyPluralUserData
} from "../../../types/simplyPlural";
import {PrivacyBucketData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";
import {createServerSupabaseClient} from "@/lib/supabase-server";

function hexColorToInt(hexColor: string): number {
    hexColor = hexColor.replace('#', '');
    return parseInt(hexColor, 16);
}

export async function getSimplyPluralPrivacyBuckets(apiToken: string): Promise<SimplyPluralResponseWrapper<SimplyPluralPrivacyBucketData>[]> {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/privacyBuckets/`, {
            headers: {
                Authorization: apiToken
            }
        })
    } catch (e) {
        throw new SimplyPluralApiError(`Network request failed: ${e instanceof Error ? e.message : "unknown error"}`)
    }

    if (!response.ok) {
        throw new SimplyPluralApiError(
            `Simply Plural returned ${response.status} ${response.statusText}`,
            response.status
        )
    }

    let data: SimplyPluralResponseWrapper<SimplyPluralPrivacyBucketData>[]
    try {
        data = await response.json()
    } catch {
        throw new SimplyPluralApiError("Simply Plural response was not valid JSON")
    }

    data.forEach(bucket => {
        if(!bucket.content) {
            throw new SimplyPluralApiError("Simply Plural response missing expected 'content' field in one of the buckets")
        }
    })
    return data
}

export async function setPrivacyBuckets(privacyBuckets: SimplyPluralResponseWrapper<SimplyPluralPrivacyBucketData>[], supabaseClient: SupabaseClient<any, "public", "public", any, any>, userId: number): Promise<Map<string, number>> {
    const results = await Promise.all(
        privacyBuckets.map(async (bucket) => {
            const { data, error } = await supabaseClient
                .from('privacy_buckets')
                .upsert({
                    user_id: userId,
                    name: bucket.content.name,
                    icon: bucket.content.icon,
                    description: bucket.content.desc,
                    color: parseInt(bucket.content.color.replace('#', ''), 16)
                }, {onConflict: "name, user_id"})
                .select("bucket_id")
                .single()
            if (error) throw error
            return { spId: bucket.id, bucketId: data.bucket_id }
        })
    )

    const idMap = new Map<string, number>()
    results.forEach(({ spId, bucketId }) => idMap.set(spId, bucketId))
    return idMap
}