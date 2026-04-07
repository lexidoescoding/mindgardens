import {useQuery} from "@tanstack/react-query";
import {MemberData, PrivacyBucketData} from "../../../types/mindgardens";
import {createClient} from "@/lib/supabase-browser";

export function fetchALlPrivacyBuckets() {
    return useQuery<PrivacyBucketData[]>({
        queryKey: ['privacyBuckets'],
        staleTime: 1000 * 60 * 5,
        queryFn: async (): Promise<MemberData[]> => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("privacy_buckets")
                .select("*")
                .order("name", { ascending: true })
            if (error) throw error
            return data ?? []
        }
    })
}

export function fetchPrivacyBucket(bucketId: number) {
    return useQuery<PrivacyBucketData | null>({
        queryKey: ['privacyBuckets'],
        staleTime: 1000 * 60 * 5,
        queryFn: async (): Promise<MemberData[]> => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from("privacy_buckets")
                .select("*")
                .eq("bucket_id", bucketId)
            if (error) throw error
            return data ?? []
        }
    })
}