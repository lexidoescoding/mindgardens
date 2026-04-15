import {FolderData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SimplyPluralGroupData, SimplyPluralResponseWrapper} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralGroups(apiToken: string, simplyPluralUserId: string) {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/groups/${simplyPluralUserId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralGroupData>[]
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

export async function setGroups(simplyPluralGroups: SimplyPluralResponseWrapper<SimplyPluralGroupData>[], userId: number, privacyBucketMap: Map<string,number>, supabase: SupabaseClient, memberIdMap: Map<string, number>) {
    const folderIdMap = new Map<string, number>()
    await supabase
        .from("folders")
        .delete()
        .eq("system_id", userId)

    await Promise.all(simplyPluralGroups.map(async (group) => {
        let privacyBuckets: number[] = []
        for (const bucket of group.content.buckets) {
            const bucketId = privacyBucketMap.get(bucket)
            if (!bucketId) continue
            privacyBuckets.push(bucketId)
        }
        const {data, error} = await supabase
            .from("folders")
            .insert({
                system_id: userId,
                folder_name: group.content.name,
                icon_source: group.content.emoji,
                parent: null,
                folder_color: parseInt(group.content.color.replace('#', ''), 16),
                privacy_buckets: privacyBuckets,
                note: group.content.desc
            })
            .select("folder_id")
            .single()
        if(error) throw new SimplyPluralApiError(`Error inserting folder for Simply Plural group ${group.content.name}: ${error.message}`)
        folderIdMap.set(group.id, data.folder_id)
    }))
    await Promise.all(simplyPluralGroups.filter(folder => folder.content.parent).map(async (folder) => {
        const {error} = await supabase
           .from("folders")
           .update({parent: folderIdMap.get(folder.content.parent)})
           .eq("folder_id", folderIdMap.get(folder.id))
        if(error) throw new SimplyPluralApiError(`Error updating folder parent for Simply Plural group ${folder.content.name}: ${error.message}`)
    }))
    let toBeSent: {member_id: number, folder_id: number}[] = []
    for (const group of simplyPluralGroups) {
        const folderId = folderIdMap.get(group.id)
        group.content.members.forEach(member => {
            const memberId = memberIdMap.get(member)
            if(!memberId) throw new SimplyPluralApiError(`Error finding member ID for Simply Plural group member with ID ${member}`)
            toBeSent.push({
                member_id: memberId,
                folder_id: folderIdMap.get(group.id)!
            })
        })
    }
    const { error } = await supabase
        .from("folder_junction_table")
        .upsert(toBeSent, {onConflict: "folder_id, member_id"})
    if(error) throw new SimplyPluralApiError(`Error inserting folder junction table entries for Simply Plural groups: ${error.message}`)
}