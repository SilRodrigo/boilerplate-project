import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ICharacter } from "@/data/characters";
import { CharacterCard } from "@/components/eldritch/CharacterCard";
import { getCharacter } from "@/api/characters";
import { joinGame } from "@/api/game";

export function CharacterSelectPage() {
    const navigate = useNavigate();
    const [characters, setCharacters] = useState<ICharacter[] | null>(null);

    useEffect(() => {
        const updateCharacters = async () => {
            const characters = await getCharacter('eldritch');

            setCharacters(characters);
        }

        updateCharacters();
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem('playerData');

        if (stored) {
            console.log('Player data found, redirecting to game...');
            navigate('/mock-game', { replace: true });
        }
    }, [navigate]);

    const [selected, setSelected] = useState<string | null>(null);
    const [playerName, setPlayerName] = useState("");

    const characterClassName = 'hover:scale-101 cursor-pointer transition duration-200'

    const confirm = async () => {
        console.log(selected)

        if (!selected) return;

        try {
            const { data } = await joinGame('eldritch', playerName, selected);
            localStorage.setItem('playerData', JSON.stringify({ token: data.token }));

            navigate('/mock-game');
        } catch (error) {
            console.error(error);
        }

    }

    if (!characters) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Carregando personagens...</p>
            </div>
        );
    }

    return (
        <div className="xl:max-w-4/5 mx-auto p-4 space-y-6 my-8 relative">
            <h1 className="text-2xl font-bold font-title">Selecione seu personagem</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {characters.map(character => (
                    <div key={character.id} className={selected === character.id ? `${characterClassName} border-4 border-[var(--primary)] rounded-xl` : characterClassName}
                        onClick={() => setSelected(character.id)}>
                        <CharacterCard
                            character={character}
                        />
                    </div>
                ))}
            </div>

            {selected &&
                (<div className="flex flex-wrap gap-2 items-end">
                    <div className="space-y-2 grow">
                        <label className="block text-sm font-medium">
                            Seu nome
                        </label>

                        <input
                            type="text"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                            placeholder="Digite seu nome"
                            className="w-full p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
                        />
                    </div>
                    <div className="w-full md:w-3/12">
                        <button className="bg-[var(--primary)] p-2 rounded-xl cursor-pointer hover:opacity-85 transition duration-200 w-full"
                            disabled={!selected}
                            onClick={() => confirm()}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>)
            }
        </div>
    );
}
