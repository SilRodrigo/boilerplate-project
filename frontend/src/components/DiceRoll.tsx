import { useEffect, useRef } from "react";

type DiceProps = {
    value: number | null;
};

export function DiceRoll({ value }: DiceProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const diceRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (value == null) return;

        const dice = diceRef.current!;
        const span = spanRef.current!;

        dice.classList.add("rolling");

        intervalRef.current = window.setInterval(() => {
            span.textContent = String(Math.floor(Math.random() * 6) + 1);
        }, 60);

        const timeout = window.setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            span.textContent = String(value);
            dice.classList.remove("rolling");
        }, 1200);

        return () => {
            clearTimeout(timeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [value]);
    return (
        <div ref={diceRef} className="dice dice-background">
            <span ref={spanRef}>?</span>
        </div>
    );
}
