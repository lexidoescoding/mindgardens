import {deleteMember, fetchMember} from "@/lib/clientApi/clientMembersAPI";
import {useEffect, useRef, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";

export default function MemberSettings({memberId, onClose}: {memberId: number, onClose: () => void}) {

    const queryClient = useQueryClient();

    const DELAY = 3; // seconds

    const [holding, setHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startHold = () => {
        setHolding(true);
        const start = Date.now();
        const duration = 3000;

        timerRef.current = setInterval(() => {
            const pct = Math.min((Date.now() - start) / duration * 100, 100);
            setProgress(pct);
            if (pct >= 100) {
                clearInterval(timerRef.current!);
                deleteMember(memberId, queryClient)
                history.back()
            }
        }, 16); // ~60fps
    };

    const cancelHold = () => {
        clearInterval(timerRef.current!);
        setHolding(false);
        setProgress(0);
    };

    const {data: member} = fetchMember(memberId)
    return (
        <main
            className="flex items-center justify-center z-50 fixed inset-0 bg-[rgba(0,0,0,0.5)]"
            onClick={() => {
                onClose()
            }}
        >
                <div
                    className="rounded-xl p-6 w-100 flex flex-col gap-4 max-h-[80dvh] bg-bg-base"
                    onClick={e => e.stopPropagation()}
                >
                    <div
                        className="flex justify-center"
                    >
                        <h2 className="text-xl font-bold text-text-primary">Settings for {member?.member_name}</h2>
                    </div>
                    <div
                        className="flex flex-col gap-4 overflow-y-auto"
                    >
                        <div className="grid grid-cols-[auto_1fr] items-center">
                            <p className="text-sm font-bold text-primary m-2">
                                Name:
                            </p>
                            <input
                                className="w-full"
                                defaultValue={member?.member_name}
                            />
                            <p className="text-sm font-bold text-primary m-2">
                                Pronous:
                            </p>
                            <input
                                className=""
                                defaultValue={member?.pronouns}
                            />
                        </div>
                    </div>
                    <button
                        onMouseDown={startHold}
                        onMouseUp={cancelHold}
                        onMouseLeave={cancelHold}
                        onTouchStart={startHold}
                        onTouchEnd={cancelHold}
                        className="relative overflow-hidden select-none rounded-md border-2 border-accent px-4 py-2 text-sm "
                    >
                        <span
                            className="absolute inset-y-0 left-0 bg-red-600"
                            style={{ width: `${progress}%`, transition: progress === 0 ? "none" : "width 16ms linear" }}
                        />
                            <span className="relative text-text-primary">
                                {progress > 0 ? "Release to cancel" : "Hold to delete"}
                            </span>
                        </button>
                </div>
        </main>
    )
}