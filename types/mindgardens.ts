import * as test from "node:test";

export type UserData = {
    user_id: number
    created_at: string
    display_name: string
    uuid: string
    is_system: boolean
    description: string
    pfp_link: string
    bytes_used: number
    color: number
    last_login: string
    custom_messages: boolean
}

export type MemberData = {
    member_id: number
    system_id: number
    member_name: string
    pronouns: string
    note: string
    tags: string[]
    description: string
    avatar_source: string
    is_fronting: boolean
    notif_on_front: boolean
    color: number
    privacy_buckets: number[]
}

export type FrontHistoryEntryData = {
    started_at: string
    ended_at: string
    note: string
    is_custom: boolean
    fronter_id: number
}

export type FolderData = {
    folder_id: number
    system_id: number
    folder_name: string
    icon_source: string
    parent: number | null
    folder_color: number
    privacy_buckets: number[]
    note: string
}

export type PrivacyBucketData = {
    bucket_id: number
    user_id: number
    name: string
    icon: string
    description: string
    color: number
}

export type CustomFieldTemplateData = {
    template_id: number
    system_id: number
    field_name: string
    order: number
    privacy_buckets: number[]
    type: number
}

export type CustomFieldData = {
    template_id: number
    member_id: number
    content: string
}

export type AutomatedTimerData = {
    user_id: number
    name: string
    message: string
    trigger: number
    timer_delay: number
    muted: boolean
}

export type BoardMessageData = {
    id: number
    sent_from: number
    sent_to: number
    sent_at: string
    read: boolean
    title: string
    message: string
    external: boolean
    sent_by_member: boolean
}

export type ChatCategoryData = {
    id: number
    name: string
    user_id: number
    description: string
}

export type ChatChannelData = {
    category_id: number
    name: string
    chat_id: number
}

export type ChatMessageData = {
    channel_id: number
    send_at: string
    send_from: number
    message: string
}

export type CustomFrontData = {
    custom_front_id: number
    system_id: number
    front_name: string
    note: string
    tags: string[]
    description: string
    color: number
    icon_source: string
    notif_on_front: boolean
    privacy_buckets: number[]
    is_fronting: boolean
}

export type NoteData = {
    note_id: number
    member_id: number
    title: string
    body: string
    color: number
    date: string
}

export type PollData = {
    id: number
    system_id: number
    name: string
    description: string
    end_time: string
    allow_veto: boolean
    allow_abstain: boolean
    custom: boolean
}

export type VoteData = {
    vote_id: number
    poll_id: number
    vote: string
    comment: string
    member_id: number
}

export class SimplyPluralApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number
    ) {
        super(message)
        this.name = "SimplyPluralApiError"
    }
}