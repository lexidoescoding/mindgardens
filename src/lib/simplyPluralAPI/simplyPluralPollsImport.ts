import {SimplyPluralApiError} from "../../../types/mindgardens";
import {SimplyPluralPollData, SimplyPluralResponseWrapper} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralPolls(apiToken: string, userId: string) {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/polls/${userId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralPollData>[]
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

export async function setPolls(polls: SimplyPluralResponseWrapper<SimplyPluralPollData>[], memberIdMap: Map<string, number>, userId: number, supabase: SupabaseClient) {
    await Promise.all(
        polls.map(async (poll) => {
            const endTime = new Date(poll.content.endTime).toISOString();
            const {data, error: error1} = await supabase
                .from("polls")
                .upsert({
                    system_id: userId,
                    name: poll.content.name,
                    description: poll.content.desc,
                    end_time: endTime,
                    allow_veto: poll.content.allowVeto ?? false,
                    allow_abstain: poll.content.allowAbstain ?? false,
                    custom: poll.content.custom
                }, {onConflict: "system_id, name"})
                .select("id")
                .single()
            if (error1) {
                throw new SimplyPluralApiError(`Failed to upsert poll with id ${poll.id}: ${error1.message}`)
            }
            if(!poll.content.votes) return
            await Promise.all(
                poll.content.votes.map(async (vote) => {
                    const memberId = memberIdMap.get(vote.id)
                    if(!memberId) throw new SimplyPluralApiError(`Failed to find member id for vote with member uid ${vote.id}`)
                    const {error: error2} = await supabase
                        .from("votes")
                        .upsert({
                            poll_id: data.id,
                            vote: vote.vote,
                            comment: vote.comment,
                            member_id: memberId
                        }, {onConflict: "poll_id, member_id"})
                    if(error2) throw new SimplyPluralApiError(`Failed to upsert vote for poll with id ${data} and member id ${memberId}: ${error2.message}`)
                })
            )

        })
    )
}