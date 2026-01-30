import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type ICharacter, characterCatalog } from "@/data/characters";
import { CharacterCard } from "@/components/eldritch/CharacterCard";

export function CharacterSelectPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('playerData');

        if (stored) {
            console.log('Player data found, redirecting to game...');
            navigate('/mock-game', { replace: true });
        }
    }, [navigate]);

    const [selected, setSelected] = useState<ICharacter | null>(null);
    const [playerName, setPlayerName] = useState("");

    const gameId = 'eldritch';
    const characters = characterCatalog[gameId];

    const characterClassName = 'hover:scale-101 cursor-pointer transition duration-200'

    const confirm = () => {
        if (!selected) return;

        localStorage.setItem('playerData', JSON.stringify({
            character: selected,
            name: playerName,
            token: crypto.randomUUID(),
            role: 'player'
        }));

        alert(`Personagem ${selected.name} selecionado com sucesso!`);

        navigate('/mock-game');
    }

    return (
        <div className="xl:max-w-4/5 mx-auto p-4 space-y-6 my-8 relative">
            <h1 className="text-2xl font-bold font-title">Selecione seu personagem</h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {characters.map(character => (
                    <div key={character.id} className={selected?.id === character.id ? `${characterClassName} border-4 border-[var(--primary)] rounded-xl` : characterClassName}
                        onClick={() => setSelected(character)}>
                        <CharacterCard
                            gameId={gameId}
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
