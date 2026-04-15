import {useQuery, useQueryClient} from "@tanstack/react-query";
import {createClient} from "@/lib/supabase-browser";
import {UserData} from "../../../types/mindgardens";

export function fetchUserProfile() {
    const queryClient = useQueryClient()
    return useQuery<UserData>({
        queryKey: ['myUserId'],
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const supabase = createClient()
            const {data: {user}} = await supabase.auth.getUser()
            const uuid = user?.id
            const { data, error } = await supabase
                .from("user_profile")
                .select("*")
                .eq("uuid", uuid)
                .maybeSingle()
            if (error) throw error
            return data
        }
    })
}