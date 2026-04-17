import { getCharacter } from "@/api/characters";
import { MansionsOfMadnessCharacterCard } from "@/components/mansions-of-madness/MansionsOfMadnessCharacterCard";
import Match from "@/components/Match";
import { CATALOG, type GameId } from "@/data/catalog";
import { mansionsOfMadnessTheme } from "@/theme/mansions-of-madness";

export default function MansionsOfMadnessMatch() {
    return (
        <Match
            theme={mansionsOfMadnessTheme}
            CharacterCardComponent={MansionsOfMadnessCharacterCard}
            getCharacterList={() => getCharacter(CATALOG.MANSIONS_OF_MADNESS as GameId)}
        />
    );
}
