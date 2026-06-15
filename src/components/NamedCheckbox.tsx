export default function NamedCheckbox({name, className = "", toggleValue, value}: { name: string, className?: string, toggleValue: () => void, value: boolean }) {
    return (
        <div
            className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
            onClick={() => toggleValue()}
        >
            <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-100 ease-in-out
                  ${value ? "bg-accent" : "bg-transparent"}
                  border-accent`}
            >
                {value && (
                    <span className="text-[0.75rem] text--accent-on)">
                        ✓
                    </span>
                )}
            </div>
            <span className="text-text-secondary">
                {name}
            </span>
        </div>
    )
}