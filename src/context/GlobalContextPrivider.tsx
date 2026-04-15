"use client"
import QueryProvider from "@/components/QueryProvider";
import {UserProfileProvider} from "@/context/UserProfileContext";
import {FolderMapProvider} from "@/context/FolderMapContext";

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <UserProfileProvider>
                <FolderMapProvider>
                    {children}
                </FolderMapProvider>
            </UserProfileProvider>
        </QueryProvider>
    )
}