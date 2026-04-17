import { EldritchCharacterCard } from "@/components/eldritch/EldritchCharacterCard";
import Match from "@/components/Match";
import { eldritchTheme } from "@/theme/eldritch";

export default function EldritchMatch() {
    return (
        <Match
            theme={eldritchTheme}
            CharacterCardComponent={EldritchCharacterCard} />
    );
}
