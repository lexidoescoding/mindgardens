// MemberCard.tsx
import { fetchAlter } from "@/lib/supabaseFetches";

type Props = {
    alterId: number;
};

type AlterData = {
    alter_id: number;
    system_id: number;
    alter_name: string;
    pronouns: string;
    Note: string;
    tags: string[];
    description: string;
    avatar_source: string;
    is_fronting: boolean;
    notif_on_front: boolean;
    color: number;
    privacy_buckets: number[];
};

function getTextColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#2E2118" : "#EEEEEE";
}

function intToHexColor(colorInt: number): string {
    return `#${colorInt.toString(16).padStart(6, "0")}`;
}

export default async function MemberCard({ alterId }: Props) {
    const data: AlterData = await fetchAlter(alterId);
    const hexColor = intToHexColor(data.color);

    return (
        <main className="rounded-2xl overflow-hidden border border-(--color-bg-hover) m-4">
            {/* Top bar — fronting indicator */}
            {data.is_fronting && <div className="h-1 w-full bg-accent" />}

            <div className="bg-bg-surface p-4">
                {/* Header row */}
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="flex rounded-full h-10 w-10 items-center justify-center"
                        style={{
                            color: getTextColor(hexColor),
                            backgroundColor: hexColor,
                        }}
                    >
                        {data.alter_name.slice(0, 2)}
                    </div>

                    <div>
                        <p className="text-[15px] font-medium text-content-primary leading-tight">
                            {data.alter_name}
                        </p>
                        <p className="text-[12px] text-text-secondary mt-0.5">
                            {data.pronouns}
                        </p>
                    </div>

                    <button className="text-[12px] font-medium bg-accent text-accent-on px-4 py-1.5 rounded-lg hover:bg-accent-hover transition-colors ml-auto">
                        {data.is_fronting ? "Stop front" : "Log front"}
                    </button>
                </div>

                {/* Tags */}
                {data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {data.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-[11px] bg-accent-soft text-accent-text px-2.5 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Note */}
                {data.Note && (
                    <div className="bg-bg-sunken rounded-lg px-3 py-2.5 mb-3">
                        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-bold">
                            NOTE
                        </p>
                        <p className="text-[13px] text-content-primary leading-snug">
                            {data.Note}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}