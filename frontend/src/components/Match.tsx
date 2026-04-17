import type { ICharacter } from "@/data/characters";
import { useGameSocket, type IPlayer } from "@/hooks/useGameSocket";
import { applyTheme } from "@/theme/applyTheme";
import type { GameTheme } from "@/theme/types";
import { getPlayerData } from "@/utils/getPlayerData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Match({
    theme,
    CharacterCardComponent,
    getCharacterList,
}: {
    theme: GameTheme;
    CharacterCardComponent: React.ComponentType<{
        character: ICharacter;
        playerName: string;
        characterList?: ICharacter[];
    }>;
    getCharacterList: () => Promise<ICharacter[]>;
}) {
    const navigate = useNavigate();
    const { state } = useGameSocket();
    const [token, setToken] = useState<string>('');
    const [characterList, setCharacterList] = useState<ICharacter[] | undefined>(undefined);

    useEffect(() => {
        applyTheme(theme);
        const playerData = getPlayerData();

        if (!playerData) {
            navigate('/', { replace: true });
        }

        const { token } = playerData;
        setToken(token);

        const updateCharacterList = async () => {
            setCharacterList(await getCharacterList());
        }

        updateCharacterList();
    }, []);

    useEffect(() => {
        if (!state) return;

        if (!state.players.find((p: IPlayer) => p.token === token)) {
            navigate('/', { replace: true });

            localStorage.removeItem('playerData');
        }
    }, [state]);

    if (!state || !token) {
        return <div>Carregando...</div>
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="font-title text-xl font-bold">Partida</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {state.players.map((player: IPlayer) => (
                    <CharacterCardComponent
                        key={player.token}
                        character={player.character}
                        playerName={player.name}
                        characterList={characterList}
                    />
                ))}
            </div>
        </div>
    );
}
