import { joinSpectatorGame } from "@/api/game";
import { SpectatorCard } from "@/components/eldritch/SpectatorCard";
import { useGameSocket } from "@/hooks/useGameSocket";
import { applyTheme } from "@/theme/applyTheme";
import { eldritchTheme } from "@/theme/eldritch";
import { useEffect } from "react";


export default function EldritchSpectator() {
    const { state, join } = useGameSocket()

    useEffect(() => {
        applyTheme(eldritchTheme)

        const joinGame = async () => {
            const { data } = await joinSpectatorGame('eldritch');

            const token = data.token;

            join(token);
        }

        joinGame()
    }, [])

    if (!state) return <div>Carregando espectador…</div>

    return (
        <div className="p-6 space-y-6">
            <h1 className="font-title text-xl font-bold">Partida</h1>

            <div className="flex flex-wrap gap-1">
                {state.players.filter((p: any) => p.name !== 'Reserva').map((player: any) => (
                    <SpectatorCard
                        key={player.token}
                        character={player.character}
                        playerName={player.name}
                    />
                ))}
            </div>
        </div>
    );
}
