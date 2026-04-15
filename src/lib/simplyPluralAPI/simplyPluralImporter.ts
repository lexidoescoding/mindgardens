"use server"
import {getSimplyPluralUser, setUserProfile} from "@/lib/simplyPluralAPI/simplyPluralUserImport";
import {
    getSimplyPluralPrivacyBuckets,
    setPrivacyBuckets
} from "@/lib/simplyPluralAPI/simplyPluralPrivacyBucketImporter";
import {
    getSimplyPluralAutomatedTimers,
    setAutomatedTimers
} from "@/lib/simplyPluralAPI/simplyPluralAutomatedTimersImport";
import {getSimplyPluralCustomFields, setCustomFields} from "@/lib/simplyPluralAPI/simplyPluralCustomFieldsImport";
import {getSimplyPluralMembers, setMembers} from "@/lib/simplyPluralAPI/simplyPluralMemberImport";
import {getSimplyPluralBoardMessages, setBoardMessages} from "@/lib/simplyPluralAPI/simplyPluralBoardMessagesImport";
import {getSimplyPluralChatCategories, setChatCategories} from "@/lib/simplyPluralAPI/simplyPluralChatCategoriesImport";
import {getSimplyPluralChatChannels, setChatChannels} from "@/lib/simplyPluralAPI/simplyPluralChatChannelImport";
import {getSimplyPluralChatMessages, setChatMessages} from "@/lib/simplyPluralAPI/simplyPluralChatMessagesImport";
import {getSimplyPluralCustomFronts, setCustomFronts} from "@/lib/simplyPluralAPI/simplyPluralCustomFrontsImporter";
import {
    getSimplyPluralFrontingHistory,
    setFrontingHistory
} from "@/lib/simplyPluralAPI/simplyPluralFrontHistoryImporting";
import {getSimplyPluralGroups, setGroups} from "@/lib/simplyPluralAPI/simplyPluralGroupImport";
import {getSimplyPluralNotes, setNotes} from "@/lib/simplyPluralAPI/simplyPluralNotesImport";
import {getSimplyPluralPolls, setPolls} from "@/lib/simplyPluralAPI/simplyPluralPollsImport";
import {createServerSupabaseClient} from "@/lib/supabase-server";

export async function importFromSimplyPlural(apiToken: string, userId: number) {
    const simplyPluralUserData = await getSimplyPluralUser(apiToken)
    const simplyPluralUserId = simplyPluralUserData.id
    console.log(simplyPluralUserData)

    const simplyPluralMembers =  await getSimplyPluralMembers(simplyPluralUserId, apiToken)
    console.log(simplyPluralMembers)

    const simplyPluralAutomatedTimers = await getSimplyPluralAutomatedTimers(simplyPluralUserId, apiToken)
    console.log(simplyPluralAutomatedTimers)

    const simplyPluralBoardMessages = await getSimplyPluralBoardMessages(apiToken, simplyPluralMembers)
    console.log(simplyPluralBoardMessages)

    const simplyPluralChatCategories = await getSimplyPluralChatCategories(apiToken)
    console.log(simplyPluralChatCategories)

    const simplyPluralChatChannels = await getSimplyPluralChatChannels(apiToken)
    console.log(simplyPluralChatChannels)

    const simplyPluralChatMessages = await getSimplyPluralChatMessages(apiToken, simplyPluralChatChannels)
    console.log(simplyPluralChatMessages)

    const simplyPluralCustomFronts = await getSimplyPluralCustomFronts(apiToken, simplyPluralUserId)
    console.log(simplyPluralCustomFronts)

    const simplyPluralFrontingHistory = await getSimplyPluralFrontingHistory(apiToken, simplyPluralMembers)
    console.log(simplyPluralFrontingHistory)

    const simplyPluralGroups = await getSimplyPluralGroups(apiToken, simplyPluralUserId)
    console.log(simplyPluralGroups)

    const simplyPluralNotes = await getSimplyPluralNotes(apiToken, simplyPluralMembers, simplyPluralUserId)
    console.log(simplyPluralNotes)

    const simplyPluralPolls = await getSimplyPluralPolls(apiToken, simplyPluralUserId)
    console.log(simplyPluralPolls)

    const simplyPluralPrivacyBuckets = await getSimplyPluralPrivacyBuckets(apiToken)
    console.log(simplyPluralPrivacyBuckets)

    const simplyPluralCustomFields = await getSimplyPluralCustomFields(apiToken, simplyPluralUserId)
    console.log(simplyPluralCustomFields)

    const supabase = await createServerSupabaseClient()

    setUserProfile(simplyPluralUserData.content, supabase, userId)

    const privacyBucketIdMap = await setPrivacyBuckets(simplyPluralPrivacyBuckets, supabase, userId)

    const customFieldIdMap = await setCustomFields(simplyPluralCustomFields, privacyBucketIdMap, userId, supabase)

    const memberIdMap = await setMembers(simplyPluralMembers, privacyBucketIdMap, userId, supabase, customFieldIdMap)

    const promise =  Promise.all([
        setGroups(simplyPluralGroups, userId, privacyBucketIdMap, supabase, memberIdMap),
        setAutomatedTimers(simplyPluralAutomatedTimers, userId, supabase),
        setBoardMessages(simplyPluralBoardMessages, userId, memberIdMap, supabase),
    ])

    const chatToCategoryMap = await setChatCategories(simplyPluralChatCategories, userId, supabase)

    const channelIdMap = await setChatChannels(simplyPluralChatChannels, supabase, chatToCategoryMap)

    await setChatMessages(simplyPluralChatMessages, channelIdMap, memberIdMap, supabase)

    const customFrontIdMap = await setCustomFronts(simplyPluralCustomFronts, userId, supabase, privacyBucketIdMap)

    await setFrontingHistory(simplyPluralFrontingHistory, userId, memberIdMap, customFrontIdMap, supabase)

    await setNotes(simplyPluralNotes, userId, memberIdMap, supabase)

    await setPolls(simplyPluralPolls, memberIdMap, userId, supabase)

    await promise
}