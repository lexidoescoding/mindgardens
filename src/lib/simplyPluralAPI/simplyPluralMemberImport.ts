import {
    SimplyPluralCustomFieldData,
    SimplyPluralMemberData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {CustomFieldData, MemberData, PrivacyBucketData, SimplyPluralApiError, UserData} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralMembers(userId: string, apiToken: string): Promise<SimplyPluralResponseWrapper<SimplyPluralMemberData>[]> {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/members/${userId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralMemberData>[]
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

export async function setMembers(simplyPluralMembers: SimplyPluralResponseWrapper<SimplyPluralMemberData>[], privacyBucketMap: Map<string, number>, userId: number, supabaseClient: SupabaseClient, customFieldIdMap: Map<string, number>): Promise<Map<string, number>> {
    const results = await Promise.all(
        simplyPluralMembers.map(async (member) => {
            const { data, error } = await supabaseClient
                .from('members')
                .upsert({
                    system_id: userId,
                    member_name: member.content.name,
                    pronouns: member.content.pronouns,
                    note: "",
                    tags: [],
                    description: member.content.desc,
                    avatar_source: member.content.avatarUrl,
                    is_fronting: false,
                    notif_on_front: !member.content.preventsFrontNotifs,
                    color: parseInt(member.content.color.replace('#', ''), 16),
                    privacy_buckets: member.content.buckets.map(b => privacyBucketMap.get(b) ?? -1)
                }, { onConflict: "system_id,member_name"})
                .select("member_id")
                .single()
            if (error) throw error
            return { spId: member.id, memberId: data.member_id }
        })
    )

    const idMap = new Map<string, number>()
    results.forEach(({ spId, memberId }) => idMap.set(spId, memberId))

    await Promise.all(
        simplyPluralMembers.map(async (member) => {
            const toBeSent: CustomFieldData[] = []
            if(!member.content.info) return
            for(const [field, content] of Object.entries(member.content.info)) {
                if(!content) continue
                const templateId = customFieldIdMap.get(field)
                if(!templateId) continue
                toBeSent.push({
                    template_id: templateId,
                    member_id: idMap.get(member.id) ?? -1,
                    content: content
                })
            }
            console.log(toBeSent)
            const {data, error} = await supabaseClient
                .from("custom_fields")
                .upsert(toBeSent, {onConflict: "template_id,member_id"})
            if (error) throw new SimplyPluralApiError(`Failed to upsert custom field for member ${member.content.name}: ${error.message}`)
        })
    )

    return idMap
}