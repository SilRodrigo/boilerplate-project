import { getCharacter } from "@/api/characters";
import { MansionsOfMadnessCharacterCard } from "@/components/mansions-of-madness/MansionsOfMadnessCharacterCard";
import Match from "@/components/Match";
import { catalog, type GameId } from "@/data/catalog";
import { mansionsOfMadnessTheme } from "@/theme/mansions-of-madness";

export default function MansionsOfMadnessMatch() {
    return (
        <Match
            theme={mansionsOfMadnessTheme}
            CharacterCardComponent={MansionsOfMadnessCharacterCard}
            getCharacterList={() => getCharacter(catalog.mansions_of_madness as GameId)}
        />
    );
}
