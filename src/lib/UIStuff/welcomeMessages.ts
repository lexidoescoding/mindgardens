import {UserData} from "../../../types/mindgardens"

export function getWelcomeMessage(userData: UserData) {
    if(!userData.custom_messages){
        return ["Welcome", ""]
    }
    if(isOverAWeekAgo(userData.last_login)) {
        return "Welcome back"
    }
    const currentHour = new Date().getHours()
    const generalMessages = [
        ["Hi there", ""],
        ["Welcome", ""],
        ["Hey there", ""],
    ]
    const morningMessages = [
        ["Good morning", ""],
    ]
    const eveningMessages = [
        ["Late night activities", "?"],
    ]
    const midDayMessages = [
        ["Good noon", ""]
    ]
    let messages: string[][] = []
    if(Math.random() <= 0.5) {
        messages = generalMessages
    } else if (currentHour >= 5 && currentHour < 10) {
        messages = morningMessages
    } else if (currentHour >= 12 && currentHour < 17) {
        messages = midDayMessages
    } else {
        messages = eveningMessages
    }
    return messages[Math.floor(Math.random() * messages.length)]
}

function isOverAWeekAgo(isoString: string): boolean {
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
    return Date.now() - new Date(isoString).getTime() > ONE_WEEK_MS
}