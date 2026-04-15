import {
    SimplyPluralBoardMessageData, SimplyPluralFrontHistoryData,
    SimplyPluralMemberData,
    SimplyPluralResponseWrapper
} from "../../../types/simplyPlural";
import {FrontHistoryEntryData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralFrontingHistory (apiToken: string, memberList: SimplyPluralResponseWrapper<SimplyPluralMemberData>[]) {
    const results = await Promise.allSettled(
        memberList.map(async (member) => {
            let response: Response
            try {
                response = await fetch(`https://api.apparyllis.com/v1/frontHistory/member/${member.id}`, {
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

            let data: SimplyPluralResponseWrapper<SimplyPluralFrontHistoryData>[]
            try {
                data = await response.json()
            } catch {
                throw new SimplyPluralApiError(`Invalid JSON for channel ${member.id}`)
            }

            return { channelId: member.id, messages: data.filter(b => !!b.content) }
        })
    )

    const allMessages = new Map<string, SimplyPluralResponseWrapper<SimplyPluralFrontHistoryData>[]>()
    for (const result of results) {
        if (result.status === "fulfilled" && result.value.messages.length > 0) {
            allMessages.set(result.value.channelId, result.value.messages)
        } else if (result.status === "rejected") {
            console.warn("Failed to fetch messages for channel:", result.reason)
        }
    }

    return allMessages
}

export async function setFrontingHistory(
    frontingHistory: Map<string, SimplyPluralResponseWrapper<SimplyPluralFrontHistoryData>[]>,
    userId: number,
    memberIdMap: Map<string, number>,
    customFrontIdMap: Map<string, number>,
    supabase: SupabaseClient
) {
    await Promise.all(
        Array.from(frontingHistory.values()).flatMap((memberFrontingEntries) =>
            memberFrontingEntries.map(async (frontHistoryEntry) => {
                const startedAt = new Date(frontHistoryEntry.content.startTime).toISOString()
                const endedAt = frontHistoryEntry.content.endTime ? new Date(frontHistoryEntry.content.endTime).toISOString() : null
                const fronterId = frontHistoryEntry.content.custom
                    ? customFrontIdMap.get(frontHistoryEntry.content.member)
                    : memberIdMap.get(frontHistoryEntry.content.member)

                if (!fronterId) throw new SimplyPluralApiError(
                    `Could not find fronter ID for member ${frontHistoryEntry.content.member} in front history entry with start time ${startedAt}`
                )

                const { error } = await supabase
                    .from("front_history")
                    .upsert({
                        started_at: startedAt,
                        ended_at: endedAt,
                        note: frontHistoryEntry.content.customStatus,
                        is_custom: frontHistoryEntry.content.custom,
                        fronter_id: fronterId
                    })

                if (error) throw new SimplyPluralApiError(
                    `Failed to insert front history entry for member ${frontHistoryEntry.content.member} with start time ${startedAt}: ${error.message}`
                )

                if (frontHistoryEntry.content.live) {
                    if (frontHistoryEntry.content.custom) {
                        const { error } = await supabase
                            .from("custom_fronts")
                            .update({ is_fronting: true })
                            .eq("custom_front_id", fronterId)
                        if (error) throw new SimplyPluralApiError(
                            `Failed to set custom front ${frontHistoryEntry.content.member} as fronting: ${error.message}`
                        )
                    } else {
                        const { error } = await supabase
                            .from("members")
                            .update({ is_fronting: true })
                            .eq("member_id", fronterId)
                        if (error) throw new SimplyPluralApiError(
                            `Failed to set member ${frontHistoryEntry.content.member} as fronting: ${error.message}`
                        )
                    }
                }
            })
        )
    )
}