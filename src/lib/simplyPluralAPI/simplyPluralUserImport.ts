"use server"
import {SimplyPluralResponseWrapper, SimplyPluralUserData} from "../../../types/simplyPlural";
import {SupabaseClient} from "@supabase/supabase-js";
import {createServerSupabaseClient} from "@/lib/supabase-server";
import {SimplyPluralApiError} from "../../../types/mindgardens";

function hexColorToInt(hexColor: string): number {
    hexColor = hexColor.replace('#', '');
    return parseInt(hexColor, 16);
}

export async function getSimplyPluralUser(apiToken: string): Promise<SimplyPluralResponseWrapper<SimplyPluralUserData>> {
    let response: Response

    try {
        response = await fetch("https://api.apparyllis.com/v1/me", {
            headers: { Authorization: apiToken }
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

    let data: SimplyPluralResponseWrapper<SimplyPluralUserData>
    try {
        data = await response.json()
    } catch {
        throw new SimplyPluralApiError("Simply Plural response was not valid JSON")
    }

    if (!data.content) {
        throw new SimplyPluralApiError("Simply Plural response missing expected 'content' field")
    }
    return data
}

export async function setUserProfile(userData: SimplyPluralUserData, supabaseClient: SupabaseClient<any, "public", "public", any, any>, userId: number): Promise<void> {
    const { error } = await supabaseClient
        .from('user_profile')
        .update({
            display_name: userData.username,
            is_system: userData.isAsystem,
            description: userData.desc,
            color: hexColorToInt(userData.color),
            pfp_link: userData.avatarUrl
        })
        .eq('user_id', userId)
    if (error) throw new SimplyPluralApiError(`Failed to update Mindgardens user profile: ${error.message}`)
}
