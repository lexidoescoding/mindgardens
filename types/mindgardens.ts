export type MemberData = {
    member_id: number;
    system_id: number;
    member_name: string;
    pronouns: string;
    note: string;
    tags: string[];
    description: string;
    avatar_source: string;
    is_fronting: boolean;
    notif_on_front: boolean;
    color: number;
    privacy_buckets: number[];
}

export type FrontHistoryEntryData = {
    started_at: string;
    ended_at: string;
    note: string;
    is_custom: boolean;
    fronter_id: number;
}