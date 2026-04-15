"use client"
import {fetchUserProfile} from "@/lib/clientApi/clientUserProfileAPI";
import {createContext, useContext} from "react";
import {UserData} from "../../types/mindgardens";

const UserProfileContext = createContext<UserData | null>(null)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const {data: userData} = fetchUserProfile()
    if(!userData) return null
    return (
        <UserProfileContext.Provider value={userData}>
            {children}
        </UserProfileContext.Provider>
    )
}

export function useUserProfile() {
    const context = useContext(UserProfileContext)
    if (!context) throw  new Error(`useUserProfile must be used within the context`)
    return context
}