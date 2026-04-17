import { createField } from "../..";
import { ICharacter } from "../../../core/entities/character";
import { FieldType } from "../../../core/entities/field";
import { items } from "../items";

function createSkills(
  health: number,
  sanity: number,
  strength: number,
  agility: number,
  observation: number,
  lore: number,
  influence: number,
  willpower: number
): FieldType[] {
  return [
    createField("health", "Vida", "number", health),
    createField("sanity", "Sanidade", "number", sanity),
    createField("strength", "Força", "number", strength),
    createField("agility", "Agilidade", "number", agility),
    createField("observation", "Observação", "number", observation),
    createField("lore", "Conhecimento", "number", lore),
    createField("influence", "Influência", "number", influence),
    createField("willpower", "Determinação", "number", willpower),
  ]
}

function createNotationField(): FieldType {
  return {
    key: "notations",
    label: "Anotações",
    type: "string",
    value: ''
  }
}

function createDetailFields(name: string, job: string, bio: string, ability: string): FieldType[] {
  return [
    createField("name", "Nome", "string", name),
    createField("job", "Profissão", "string", job),
    createField("bio", "Biografia", "string", bio),
    createField("ability", "Habilidade", "string", ability),
  ]
}

export const characters: ICharacter[] = [
  {
    id: "agatha_crane",
    fields: [
      ...createDetailFields(
        'Agatha Crane',
        'A Parapsicóloga',
        '',
        'Após você resolver um teste de horror, receba 1 Pista'
      ),
      ...createSkills(5, 9, 2, 3, 4, 5, 3, 4),
      createNotationField(),
    ]
  },
  {
    id: "rita_young",
    fields: [
      ...createDetailFields(
        'Rita Young',
        'A Atleta',
        '',
        'Você tem a opção de se mover 1 espaço extra como parte de uma ação de mover'
      ),
      ...createSkills(9, 5, 5, 4, 3, 3, 2, 4),
      createNotationField(),
    ]
  },
  {
    id: "minh_thi_phan",
    fields: [
      ...createDetailFields(
        'Minh Thi Phan',
        'A Secretária',
        '',
        'Uma vez por rodada, você ou outro investigador ao seu alcance têm a opção de rerrolar 1 dado ao resolver um teste'
      ),
      ...createSkills(7, 7, 3, 4, 4, 3, 4, 3),
      createNotationField(),
    ]
  },
  {
    id: "preston_fairmont",
    fields: [
      ...createDetailFields(
        'Preston Fairmont',
        'O Milionário',
        '',
        'Uma vez por rodada, ao receber um Item, você tem a opção de virar para baixo 1 Horror ou descartar 1 Horror que esteja voltado para baixo'
      ),
      ...createSkills(8, 6, 4, 4, 3, 2, 5, 3),
      createNotationField(),
    ]
  },
  {
    id: "carson_sinclair",
    fields: [
      ...createDetailFields(
        'Carson Sinclair',
        'O Mordomo',
        '',
        'Ação: Outro investigador ao seu alcance tem a opção de realizar 1 ação. Ative esta habilidade apenas uma vez por rodada'
      ),
      ...createSkills(8, 6, 3, 2, 5, 4, 4, 3),
      createNotationField(),
    ]
  },
  {
    id: "wendy_adams",
    fields: [
      ...createDetailFields(
        'Wendy Adams',
        'A Órfã',
        '',
        'Você não pode ficar Atordoada ou Presa'
      ),
      ...createSkills(6, 8, 3, 5, 4, 3, 3, 3),
      createNotationField(),
    ]
  },
  {
    id: "william_yorick",
    fields: [
      ...createDetailFields(
        'William Yorick',
        'O Coveiro',
        '',
        'Sempre que um monstro for derrotado, receba 1 Pista'
      ),
      ...createSkills(7, 7, 4, 3, 4, 3, 3, 4),
      createNotationField(),
    ]
  },
  {
    id: "padre_mateo",
    fields: [
      ...createDetailFields(
        'Padre Mateo',
        'O Padre',
        '',
        'Ação: Outro investigador ao seu alcance fica Compenetrado. Ative esta habilidade apenas uma vez por rodada'
      ),
      ...createSkills(6, 8, 3, 3, 2, 4, 4, 5),
      createNotationField(),
    ]
  },
];
