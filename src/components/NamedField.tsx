import {ReactNode} from "react";

export default function NamedField({ name, children, className = "" }: { name: string, children: ReactNode, className?: string }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <p className="text-xs text-text-muted uppercase font-bold">{name}</p>
            <div className="flex bg-bg-sunken rounded-xl p-1 items-center focus-within:ring-2 focus-within:ring-accent transition-colors">
                <div className="m-1 w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}