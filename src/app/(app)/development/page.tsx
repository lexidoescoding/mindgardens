"use client";

import {
    ArrowRight,
    Database,
    FolderTree,
    LayoutDashboard,
    Settings,
    Sparkles,
    Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useFolderMap } from "@/context/FolderMapContext";
import { useUserProfile } from "@/context/UserProfileContext";

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    let value = bytes;
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }

    const decimals = value >= 10 || unitIndex === 0 ? 0 : 1;
    return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export default function Home() {
    const userData = useUserProfile();
    const { folderMap, memberByName } = useFolderMap();

    const rootFolders = Array.from(folderMap?.get(null)?.values() ?? []);
    const allFolders = Array.from(folderMap?.values() ?? []).flatMap((group) =>
        Array.from(group.values()),
    );
    const members = Array.from(memberByName?.values() ?? []);
    const frontingMembers = members.filter((member) => member.is_fronting);

    return (
        <main className="flex h-[calc(100dvh-4rem)] flex-col gap-6 overflow-y-auto p-4 pb-8">
            <section className="rounded-3xl border border-bg-hover bg-bg-surface p-6 shadow-sm gap-2">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-bg-sunken px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                            <Sparkles className="h-3.5 w-3.5 text-accent" />
                            Home dashboard
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                                Welcome back, {userData.display_name}
                            </h1>
                            <p className="max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
                                Keep tabs on members, folders, and fronting activity from one
                                calm, focused home screen.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <ActionLink
                                href="/members"
                                icon={<Users className="h-4 w-4" />}
                                title="Open members"
                                description={`${members.length} profiles in your system`}
                            />
                            <ActionLink
                                href="/settings"
                                icon={<Settings className="h-4 w-4" />}
                                title="Go to settings"
                                description="Adjust your app preferences"
                            />
                            <ActionLink
                                href="/settings/simply-plural-import"
                                icon={<Database className="h-4 w-4" />}
                                title="Import data"
                                description="Bring in a Simply Plural export"
                            />
                        </div>
                    </div>

                    <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
                        <MetricCard
                            label="Members"
                            value={members.length.toString()}
                            detail={`${frontingMembers.length} fronting now`}
                            icon={<Users className="h-4 w-4" />}
                        />
                        <MetricCard
                            label="Folders"
                            value={allFolders.length.toString()}
                            detail={`${rootFolders.length} top-level spaces`}
                            icon={<FolderTree className="h-4 w-4" />}
                        />
                        <MetricCard
                            label="Storage"
                            value={formatBytes(userData.bytes_used)}
                            detail={
                                userData.is_system ? "System workspace" : "Personal workspace"
                            }
                            icon={<LayoutDashboard className="h-4 w-4" />}
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-3xl border border-bg-hover bg-bg-surface p-5">
                    <SectionHeader
                        title="Quick access"
                        description="Jump to the areas you are most likely to open next."
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <QuickLink
                            href="/members"
                            title="Browse members"
                            description="Open the member list and individual profiles."
                        />
                        <QuickLink
                            href="/settings/simply-plural-import"
                            title="Import from Simply Plural"
                            description="Start a fresh import or continue an existing one."
                        />
                        <QuickLink
                            href="/settings"
                            title="Adjust settings"
                            description="Tweak appearance and account options."
                        />
                        <QuickLink
                            href="/development"
                            title="Development sandbox"
                            description="Check the in-progress area of the app."
                        />
                    </div>
                </div>

                <div className="rounded-3xl border border-bg-hover bg-bg-surface p-5">
                    <SectionHeader
                        title="Workspace snapshot"
                        description="A few live signals from your current setup."
                    />

                    <div className="mt-4 space-y-3">
                        <InfoRow label="Display name" value={userData.display_name} />
                        <InfoRow
                            label="Workspace type"
                            value={userData.is_system ? "System profile" : "Personal profile"}
                        />
                        <InfoRow
                            label="Root folders"
                            value={rootFolders.length.toString()}
                        />
                        <InfoRow
                            label="Fronting members"
                            value={frontingMembers.length.toString()}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-bg-hover bg-bg-surface p-5">
                <SectionHeader
                    title="Root folders"
                    description="These are the top-level spaces currently available in your workspace."
                />

                {rootFolders.length > 0 ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {rootFolders.slice(0, 6).map((folder) => (
                            <div
                                key={folder.folder_id}
                                className="rounded-2xl border border-bg-hover bg-bg-base p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-text-primary">
                                            {folder.folder_name}
                                        </p>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            Folder ID {folder.folder_id}
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-text">
                    Root
                  </span>
                                </div>

                                {folder.note && (
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary">
                                        {folder.note}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No root folders yet"
                        description="Once you add folders, they will appear here as a quick overview."
                    />
                )}
            </section>

            <section className="rounded-3xl border border-bg-hover bg-bg-surface p-5">
                <SectionHeader
                    title="Members preview"
                    description="A compact look at the member profiles loaded into the workspace."
                />

                {members.length > 0 ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {members.slice(0, 6).map((member) => (
                            <div
                                key={member.member_id}
                                className="rounded-2xl border border-bg-hover bg-bg-base p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-text-primary">
                                            {member.member_name}
                                        </p>
                                        <p className="mt-1 text-xs text-text-secondary">
                                            {member.pronouns || "No pronouns set"}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            member.is_fronting
                                                ? "bg-accent-soft text-accent-text"
                                                : "bg-bg-sunken text-text-secondary"
                                        }`}
                                    >
                    {member.is_fronting ? "Fronting" : "Idle"}
                  </span>
                                </div>

                                {member.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {member.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-bg-sunken px-2.5 py-1 text-[11px] text-text-secondary"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No members loaded"
                        description="Add or import members to see them summarized here."
                    />
                )}
            </section>
        </main>
    );
}

function SectionHeader({
                           title,
                           description,
                       }: {
    title: string;
    description?: string;
}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {title}
                </p>
                {description && (
                    <p className="mt-1 text-sm text-text-secondary">{description}</p>
                )}
            </div>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        detail,
                        icon,
                    }: {
    label: string;
    value: string;
    detail: string;
    icon: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-bg-hover bg-bg-base p-4">
            <div className="flex items-center justify-between gap-3 text-text-secondary">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
                {icon}
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                {value}
            </p>
            <p className="mt-1 text-sm text-text-secondary">{detail}</p>
        </div>
    );
}

function ActionLink({
                        href,
                        icon,
                        title,
                        description,
                    }: {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="group inline-flex min-w-55 flex-1 items-center gap-3 rounded-2xl border border-bg-hover bg-bg-base px-4 py-3 hover:bg-bg-hover"
        >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
        {icon}
      </span>
            <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold text-text-primary">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-text-secondary">
          {description}
        </span>
      </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5" />
        </Link>
    );
}

function QuickLink({
                       href,
                       title,
                       description,
                   }: {
    href: string;
    title: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-bg-hover bg-bg-base p-4 hover:bg-bg-hover"
        >
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
                {description}
            </p>
        </Link>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-bg-base px-4 py-3">
            <span className="text-sm text-text-secondary">{label}</span>
            <span className="truncate text-sm font-medium text-text-primary">
        {value}
      </span>
        </div>
    );
}

function EmptyState({
                        title,
                        description,
                    }: {
    title: string;
    description: string;
}) {
    return (
        <div className="mt-4 rounded-2xl border border-dashed border-bg-hover bg-bg-base p-6 text-center">
            <p className="text-sm font-semibold text-text-primary">{title}</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
                {description}
            </p>
        </div>
    );
}
