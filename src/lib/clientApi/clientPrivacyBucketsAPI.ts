import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PrivacyBucketData } from "../../../types/mindgardens";
import { createClient } from "@/lib/supabase-browser";

export function fetchAllPrivacyBuckets() {
    const queryClient = useQueryClient();

    return useQuery<PrivacyBucketData[]>({
        queryKey: ['privacyBuckets'],
        staleTime: 1000 * 60 * 5,
        queryFn: async (): Promise<PrivacyBucketData[]> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("privacy_buckets")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;

            (data ?? []).forEach(bucket => {
                queryClient.setQueryData(['privacyBucket', bucket.bucket_id], bucket);
            });

            return data ?? [];
        }
    });
}

export function fetchPrivacyBucket(bucketId: number) {
    return useQuery<PrivacyBucketData | null>({
        queryKey: ['privacyBucket', bucketId],
        staleTime: 1000 * 60 * 5,
        queryFn: async (): Promise<PrivacyBucketData | null> => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("privacy_buckets")
                .select("*")
                .eq("bucket_id", bucketId)
                .maybeSingle();

            if (error) throw error;

            return data ?? null;
        }
    });
}