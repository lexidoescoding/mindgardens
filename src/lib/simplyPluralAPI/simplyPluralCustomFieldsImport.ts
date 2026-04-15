import {
    SimplyPluralCustomFieldData, SimplyPluralMemberData,
    SimplyPluralPrivacyBucketData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {CustomFieldData, CustomFieldTemplateData, PrivacyBucketData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralCustomFields(apiToken: string, userId: string): Promise<SimplyPluralResponseWrapper<SimplyPluralCustomFieldData>[]> {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/customFields/${userId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralCustomFieldData>[]
    try {
        data = await response.json()
    } catch {
        throw new SimplyPluralApiError("Simply Plural response was not valid JSON")
    }

    data.forEach(bucket => {
        if(!bucket.content) {
            throw new SimplyPluralApiError("Simply Plural response missing expected 'content' field in one of the fields")
        }
    })
    return data
}

export async function setCustomFields(customFields: SimplyPluralResponseWrapper<SimplyPluralCustomFieldData>[], privacyBucketMap: Map<string, number>, userId: number, supabaseClient: SupabaseClient): Promise<Map<string, number>> {
    const results = await Promise.all(
        customFields.map(async (field) => {
            const { data, error } = await supabaseClient
                .from('custom_field_templates')
                .upsert({
                    system_id: userId,
                    field_name: field.content.name,
                    order: 0,
                    type: field.content.type,
                    privacy_buckets: field.content.buckets.map(bucket => {
                        return privacyBucketMap.get(bucket) ?? -1
                    })
                }, {onConflict: "field_name, system_id"})
                .select("template_id")
                .single()
            if (error) throw error
            return { spId: field.id, memberId: data.template_id }
        })
    )

    const idMap = new Map<string, number>()
    results.forEach(({ spId, memberId }) => idMap.set(spId, memberId))

    return idMap
}
