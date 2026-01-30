import { CharacterCard } from "@/components/eldritch/CharacterCard";
import { Catalog, type GameId } from "@/data/catalog";
import { useGameSocket } from "@/hooks/useGameSocket";
import { applyTheme } from "@/theme/applyTheme";
import { eldritchTheme } from "@/theme/eldritch";
import { useEffect, useRef, useState } from "react";

export default function MockGame() {
    const { state, join } = useGameSocket();

    // ----------
    const prevStateRef = useRef<any>(null)
    const [playerDeltas, setPlayerDeltas] = useState<Record<string, number>>({})

    useEffect(() => {
        applyTheme(eldritchTheme);
        const stored = localStorage.getItem('playerData');
        if (stored) {
            join(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (!state) return

        if (!prevStateRef.current) {
            prevStateRef.current = state
            return
        }

        const deltas: Record<string, number> = {}

        state.players.filter(p => p.status === "online").forEach((player: any) => {
            const prevPlayer = prevStateRef.current.players.find(
                (p: any) => p.token === player.token
            )

            if (!prevPlayer) {
                localStorage.removeItem('playerData')

                return;
            }

            let relevantDelta = 0

            player.character.fields.forEach((field: any) => {
                if (field.type !== "number") return
                if (field.key !== "health" && field.key !== "sanity") return

                const prevField = prevPlayer.character.fields.find(
                    (f: any) => f.key === field.key
                )

                if (!prevField) return

                const delta = field.value - prevField.value

                if (delta !== 0) {
                    relevantDelta += delta
                    triggerEvent(field.key, delta)
                }
            })

            if (relevantDelta !== 0) {
                deltas[player.token] = relevantDelta
            }
        })

        setPlayerDeltas(deltas)
        prevStateRef.current = state
    }, [state])

    function triggerEvent(
        fieldKey: "health" | "sanity",
        delta: number
    ) {
        if (fieldKey === "health") {
            if (delta < 0) playSound("health_loss")
            else playSound("health_gain")
        }

        if (fieldKey === "sanity") {
            if (delta < 0) playSound("sanity_loss")
            else playSound("sanity_gain")
        }
    }

    function playSound(name: string) {
        const audio = new Audio(`/sounds/eldritch/${name}.mp3`)
        audio.volume = 0.4
        audio.play()
    }

    // ----------

    if (!state) {
        return <div>Carregando...</div>
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="font-title text-xl font-bold">Partida</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {state.players.map((player: any) => (
                    <CharacterCard
                        key={player.token}
                        character={player.character}
                        gameId={Catalog.eldritch as GameId}
                        delta={playerDeltas[player.token]}
                        playerName={player.name}
                    />
                ))}
            </div>
        </div>
    );
}
