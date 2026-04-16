"use client"
import QueryProvider from "@/components/QueryProvider";
import {UserProfileProvider} from "@/context/UserProfileContext";
import {FolderMapProvider} from "@/context/FolderMapContext";

export default function GlobalContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <FolderMapProvider>
                {children}
            </FolderMapProvider>
        </QueryProvider>
    )
}