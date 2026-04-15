export type SimplyPluralResponseWrapper<T> = {
    exists: boolean
    id: string
    content: T
}

export type SimplyPluralAutomatedTimerData = {
    name: string
    message: string
    action: number
    delayInHours: number
    type: number
    uid: string
    lastOperationTime: number
}

export type SimplyPluralUserData = {
    uid: string
    isAsystem: boolean
    lastOperationTime: number
    username: string
    avatarUrl: string
    color: string
    desc: string
    supportDescMarkdown: boolean
    fields: Record<string, {
        name: string
        order: number
        private: boolean
        type: number
        preventTrusted: boolean
    }>;
    avatarUuid: string
}

export type SimplyPluralCustomFieldData = {
    name: string
    order: string
    type: 0 | 1 | 2
    supportMarkdown: boolean
    uid: string
    lastOperationTime: number
    buckets: string[]
}

export type SimplyPluralPrivacyBucketData = {
    name: string
    desc: string
    color: string
    icon: string
    rank: string
    uid: string
    lastOperationTime: number
}

export type SimplyPluralMemberData = {
    name: string
    desc: string
    pronouns: string
    pkId: string
    avatarUrl: string
    private: boolean
    preventTrusted: boolean
    preventsFrontNotifs: boolean
    supportDescMarkdown: boolean
    archived: boolean
    receiveMessageBoardNotifs: boolean
    archivedReason: string
    color: string
    uid: string
    lastOperationTime: number
    buckets: string[]
    info?: Record<string, string>
    avatarUuid: string
    frame?: {
        bgShape?: string
        bgClip?: string
        bgStartColor?: string
        bgEndColor?: string
    }

}

export type SimplyPluralBoardMessageData = {
    title: string
    message: string
    writtenBy: string
    writtenFor: string
    writtenAt: number
    read: boolean
    supportMarkdown: boolean
    uid: string
    lastOperationTime: number
}

export type SimplyPluralChatCategoryData = {
    name: string
    desc: string
    channels: string[]
    uid: string
    lastOperationTime: number
}

export type SimplyPluralChannelData = {
    name: string
    desc: string
    uid: string
    lastOperationTime: number
}

export type SimplyPluralChatMessageData = {
    message: string
    channel: string
    writer: string
    writtenAt: number
    replyTo?: string
    uid: string
    lastOperationTime: number
}

export type SimplyPluralCustomFrontData = {
    name: string
    desc: string
    avatarUrl: string
    preventTrusted: boolean
    private: boolean
    supportDescMarkdown: boolean
    preventsFrontNotifs: boolean
    color: string
    uid: string
    lastOperationTime: number
    buckets: string[]
    avatarUuid: string
    frame?: {
        bgShape?: string
        bgClip?: string
        bgStartColor?: string
        bgEndColor?: string
    }
}

export type SimplyPluralGroupData = {
    parent: string
    name: string
    color: string
    desc: string
    emoji: string
    supportDescMarkdown: boolean
    members: string[]
    uid: string
    lastOperationTime: number
    buckets: string[]
}

export type SimplyPluralNoteData = {
    title: string
    note: string
    color: string
    member: string
    date: number
    supportMarkdown: boolean
    uid: string
    lastOperationTime: number
}

export type SimplyPluralPollData = {
    name: string
    desc: string
    custom: boolean
    endTime: number
    uid: string
    lastOperationTime: number
    allowAbstain?: boolean
    allowVeto?: boolean
    options?: Array<{ name: string; color: string }>
    supportDescMarkdown: boolean
    votes?: Array<{ id: string; vote: string; comment: string }>
}

export type SimplyPluralFrontHistoryData = {
    custom: boolean
    startTime: number
    endTime: number
    member: string
    live: boolean
    customStatus: string
    uid: string
    lastOperationTime: number
}