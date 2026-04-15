"use client"

import { ArrowLeftIcon, Moon, Sun, Bell, Palette, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useUserProfile } from "@/context/UserProfileContext"
import Link from "next/link"

export default function SettingsPage() {
    const userData = useUserProfile()
    const [darkMode, setDarkMode] = useState(true)
    const [notifications, setNotifications] = useState(true)

    return (
        <main className="h-dvh flex flex-col overflow-hidden">
            {/* Accent bar — static colour since there's no dynamic state here */}
            <div className="h-1 w-full shrink-0 bg-accent" />

            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-bg-surface border-b border-bg-hover">
                <button onClick={() => history.back()}>
                    <ArrowLeftIcon className="shrink-0 cursor-pointer" />
                </button>

                {/* Settings "avatar" — mirrors the member avatar */}
                <div className="flex rounded-full h-14 w-14 items-center justify-center bg-bg-sunken shrink-0">
                    <Settings className="w-7 h-7 text-text-secondary" />
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-bold text-text-primary leading-tight truncate">
                        Settings
                    </h1>
                    {userData?.display_name && (
                        <p className="text-[13px] text-text-secondary mt-0.5">
                            {userData.display_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

                <Section title="Appearance">
                    <SettingRow
                        icon={<Palette />}
                        label="Theme"
                        description="Light / Dark mode"
                        action={
                            <Toggle
                                enabled={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                                icons={<><Sun className="w-4 h-4" /><Moon className="w-4 h-4" /></>}
                            />
                        }
                    />
                </Section>

                <Section title="Notifications">
                    <SettingRow
                        icon={<Bell />}
                        label="Enable notifications"
                        description="Fronting updates, reminders"
                        action={
                            <Toggle
                                enabled={notifications}
                                onChange={() => setNotifications(!notifications)}
                            />
                        }
                    />
                </Section>

                <Section title="Simply Plural">
                    <Link href="/settings/simply-plural-import">
                        <SettingRow
                            icon={<User />}
                            label="Import"
                            description="Bring in your data from Simply Plural"
                        />
                    </Link>
                </Section>

                <Section title="Account">
                    <SettingRow
                        icon={<User />}
                        label="Profile"
                        description="Edit your info"
                        onClick={() => console.log("go to profile")}
                    />
                    <SettingRow
                        icon={<LogOut />}
                        label="Log out"
                        description="End your session"
                        onClick={() => console.log("logout")}
                        danger
                    />
                </Section>

            </div>
        </main>
    )
}

/* ---------- Components ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold px-1">
                {title}
            </p>
            <div className="bg-bg-sunken rounded-lg overflow-hidden">
                {children}
            </div>
        </div>
    )
}

function SettingRow({
                        icon, label, description, action, onClick, danger
                    }: {
    icon: React.ReactNode
    label: string
    description?: string
    action?: React.ReactNode
    onClick?: () => void
    danger?: boolean
}) {
    const Wrapper = onClick ? "button" : "div"

    return (
        <Wrapper
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                onClick ? "hover:bg-bg-hover cursor-pointer" : "cursor-default"
            }`}
        >
            <div className={`shrink-0 ${danger ? "text-red-400" : "text-text-secondary"}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[14px] font-medium ${danger ? "text-red-400" : "text-text-primary"}`}>
                    {label}
                </p>
                {description && (
                    <p className="text-[12px] text-text-secondary mt-0.5">{description}</p>
                )}
            </div>
            {action && (
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    {action}
                </div>
            )}
        </Wrapper>
    )
}

function Toggle({ enabled, onChange, icons }: {
    enabled: boolean
    onChange: () => void
    icons?: React.ReactNode
}) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onChange() }}
            className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${
                enabled ? "bg-accent" : "bg-bg-hover"
            }`}
        >
            <div className={`h-5 w-5 rounded-full bg-white transition-transform flex items-center justify-center ${
                enabled ? "translate-x-5" : "translate-x-0"
            }`}>
                {icons}
            </div>
        </button>
    )
}