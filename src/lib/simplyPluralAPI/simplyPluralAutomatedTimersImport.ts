import {SimplyPluralAutomatedTimerData, SimplyPluralResponseWrapper} from "../../../types/simplyPlural";
import {AutomatedTimerData, SimplyPluralApiError} from "../../../types/mindgardens";
import {SupabaseClient} from "@supabase/supabase-js";

export async function getSimplyPluralAutomatedTimers(userId: string, apiToken: string): Promise<SimplyPluralResponseWrapper<SimplyPluralAutomatedTimerData>[]> {
    let response: Response

    try {
        response = await fetch(`https://api.apparyllis.com/v1/timers/automated/${userId}`,
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

    let data: SimplyPluralResponseWrapper<SimplyPluralAutomatedTimerData>[]
    try {
        data = await response.json()
    } catch {
        throw new SimplyPluralApiError("Simply Plural response was not valid JSON")
    }

    data.forEach(bucket => {
        if(!bucket.content) {
            throw new SimplyPluralApiError("Simply Plural response missing expected 'content' field in one of the Automated Timers")
        }
    })
    return data
}

export async function setAutomatedTimers(automatedTimers: SimplyPluralResponseWrapper<SimplyPluralAutomatedTimerData>[], userId: number, supabase: SupabaseClient): Promise<void> {
    let toBeSent: AutomatedTimerData[] = []
    for (const timer of automatedTimers) {
        toBeSent.push({
            user_id: userId,
            name: timer.content.name,
            message: timer.content.message,
            trigger: timer.content.type,
            timer_delay: timer.content.delayInHours,
            muted: false
        })
    }
    const {error} = await supabase
        .from("automated_timers")
        .upsert(toBeSent, {onConflict: "user_id, name"})
    if (error) throw new SimplyPluralApiError(`Error inserting automated timers: ${error.message}`)
}