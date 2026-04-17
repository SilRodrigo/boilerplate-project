import type { ICharacter, FieldType } from "..";
import { getItemById } from "@/utils/getItems";

export interface IEldritchCharacter extends ICharacter {
  name: string;
  image: string;
  quote: string;
  bio: string;
  job: string;
  action: string;
  passive: string;
  initialSpace: string;
}

function createSkills(
  health: number,
  sanity: number,
  lore: number,
  influence: number,
  observation: number,
  strength: number,
  willpower: number
): FieldType[] {
  return [
    { key: "health", label: "Vida", type: "number", value: health },
    { key: "sanity", label: "Sanidade", type: "number", value: sanity },
    { key: "lore", label: "Conhecimento", type: "number", value: lore },
    { key: "influence", label: "Influência", type: "number", value: influence },
    { key: "observation", label: "Observação", type: "number", value: observation },
    { key: "strength", label: "Força", type: "number", value: strength },
    { key: "willpower", label: "Determinação", type: "number", value: willpower },
  ]
}

function createCollectionField(...ids: string[]): FieldType {
  return {
    key: "items",
    label: "Itens/Equipamentos/Feitiços",
    type: "collection",
    value: ids.map(id => getItemById('eldritch', id))
  }
}

export const characters: IEldritchCharacter[] = [
  {
    id: "norman_withers",
    name: "Norman Withers",
    image: "/characters/eldritch/Norman_Withers.webp",
    quote: "Deixe que me chamem de biruta! Algo está acontecendo com as estrelas, e não é apenas minha imaginação!",
    bio: "A comunidade cientifica ridicularizou Normam por dizer que seis estrelas desapareceram do céu. Após esgotar todas as explicações astronômicas plausíveis procurando por uma resposta, ele assumiu um cargo na Universidade de Miskatonic e começou a explorar possibilidades mais improváveis na seção restrita da biblioteca. Enquanto lia um antigo texto com profecias obscuras, Norman descobriu uma descrição exata do fenômeno que havia observado. Se o tomo estiver correto, uma incursão terrível ao nosso mundo é iminente.",
    job: "O Astrônomo",
    action: "Gaste 2 Pistas para descartar 1 Monstro num espaço com um Portal.",
    passive: "Uma vez por turno, você pode gastar 1 de Sanidade em vez de 1 Pista",
    initialSpace: "Arkham, Estados Unidos",
    fields: [
      ...createSkills(5, 7, 3, 1, 3, 2, 4),
      createCollectionField('feed_the_mind')
    ]
  },
  {
    id: "lily_chen",
    name: "Lily Chen",
    image: "/characters/eldritch/Lily_Chen.webp",
    quote: "Eu estive me preparando para confrontar esse mal durante minha vida inteira. Meu foco tem de ser absoluto.",
    bio: "Lily raramente fala, mas, quando o faz, suas palavras são sábias e comedidas. Após uma vida inteira de treinamento disciplinado, cada gesto é gracioso, sem sinal de hesitação. Quando ela era criança, uma seita obscura de monges acreditava que ela havia nascido com um objetivo especial: confrontar um mal terrível. Agora os monges acreditam que esse mal está chegando e trouxeram Lily a Xangai para ela começar a cumprir seu destino.",
    job: "A Artista Marcial",
    action: "Gaste quanto de Vida quiser para recuperar essa mesma quantidade de Sanidade, ou vice-versa.",
    passive: "Quando aprimorar uma proficiência, você pode imediatamente aprimorar essa mesma proficiência de novo.",
    initialSpace: "Xangai, China",
    fields: [
      ...createSkills(6, 6, 2, 2, 2, 4, 3),
      createCollectionField(
        'protective_amulet',
        'lucky_rabbits_foot'
      )
    ]
  },
  {
    id: "jacqueline_fine",
    name: "Jacqueline Fine",
    image: "/characters/eldritch/Jacqueline_Fine.webp",
    quote: "As visões são um aviso. O futuro pode ser reescrito.",
    bio: "No início, os sonhos de Jacqueline com fogo e destruição pareciam uma maldição. Monstros corriam sem oposição pelas ruas da cidade, e uma escuridão ainda maior se manifestava no horizonte. Contudo, recentemente ela descobriu como controlar suas visões e observar os eventos em seus mínimos detalhes. Ontem, ela viajou de Boston para Minneapolis com o intuito de explorar um armazém abandonado que viu em seus sonhos. Chegando lá, ela encontrou evidências de um culto maligno que realizou rituais inenarráveis naquele local. Jacqueline espera usar o que aprendeu para evitar o terrível futuro que assombra seus sonhos.",
    job: "A Vidente",
    action: "Você pode trocar quantas Pistas quiser com um investigador em qualquer espaço.",
    passive: "Uma vez por turno, quando outro investigador receber uma Condição não Comum, você pode olhar o verso da carta e receber 1 Pista.",
    initialSpace: "Região Central dos Estados Unidos (Espaço 5)",
    fields: [
      ...createSkills(4, 8, 4, 2, 3, 1, 3),
      createCollectionField(
        'flesh_ward',
        'clues'
      )
    ]
  },
  {
    id: "silas_marsh",
    name: "Silas Marsh",
    image: "/characters/eldritch/Silas_Marsh.webp",
    quote: "Deixem seus medos no cais, amigos. Eu não vou carregar este peso. O vento está soprando! Içar velas!",
    bio: "Até mesmo em sua infância, em Innsmouth, Silas já tinha uma ligação com o mar. Ele é uma pessoa habilidosa e racional em terra, mas no mar ele possui força e perspicácia singulares, Isso lhe deu renome em todos os portos do mundo, principalmente em Sydney, onde desembarcou na noite passada. Mas hoje o cheiro do ar salobre traz ao mesmo tempo alegria e pavor. Há algo em seu passado, algo em Innsmouth, que ele sabe que um dia voltará para assombrá-lo.",
    job: "O Marinheiro",
    action: "Mova-se 1 espaço em uma rota Naval: em seguida, realize uma ação extra.",
    passive: "Se estiver num espaço Marítimo, os investigadores no seu espaço rolam 1 dado extra ao resolver testes.",
    initialSpace: "Sydney, Austrália",
    fields: [
      ...createSkills(8, 4, 1, 3, 3, 3, 3),
      createCollectionField('fishing_net')
    ]
  },
  {
    id: "diana_stanley",
    name: "Diana Stanley",
    image: "/characters/eldritch/Diana_Stanley.webp",
    quote: "A Loja não é tão inocente quanto finge ser. Eu aprendi que nada é o que parece, nem mesmo eu.",
    bio: "Quando Diana foi iniciada na Ordem do Crepúsculo Prateado, ela acreditava que não fosse nada além de uma organização comunitária. Porém, conforme foi descobrindo mais sobre sua verdadeira natureza, ela ficou convencida de que um mal crescente ameaça o mundo e que o Crepúsculo Prateado terá um papel importante nessa ameaça. Ela acredita que a melhor chance que tem de evitar isso é usar sua posição para sabotar a organização. Carl Sanford, o lider da Ordem, reconheceu as habilidades dela e a enviou recentemente para o Panamá para receber treinamento.",
    job: "A Cultista Arrependida",
    action: "Se houver um Monstro Cultista no seu espaço, descarte todos os Monstros no seu espaço ou mova o Monstro Cultista para qualquer outro espaço.",
    passive: "Reduza para 1 o horror dos Monstros que encontra.",
    initialSpace: "América Central (Espaço 7)",
    fields: [
      ...createSkills(7, 5, 4, 2, 3, 3, 1),
      createCollectionField(
        'arcane_manuscripts',
        'wither'
      )
    ]
  },
  {
    id: "leo_anderson",
    name: "Leo Anderson",
    image: "/characters/eldritch/Leo_Anderson.webp",
    quote: "Continue andando. Você pode morrer quando for a hora.",
    bio: "Leo Anderson passou a vida inteira indo para os cantos mais mortais e obscuros da Terra. Em sua trajetória, ele perdeu bons amigos. A febre leva alguns; outros são mortos por animais selvagens. Após uma recente aventura desastrosa em lucatá, Leo mal conseguiu retornar a Buenos Aires. Ele já cansou de enterrar pessoas que confiaram nele. Mas o trabalho não terminou. O mundo está em perigo, e chorar com um copo de uísque não vai ajudar. Ele conseguiu alguns mercenários para ajudar e, de manhá, vai retornar à selva.",
    job: "O Chefe de Expedição",
    action: "Teste Influência. Se passar, receba da reserva ou da pilha de descartes 1 Recurso do tipo Aliado de sua escolha.",
    passive: "Se estiver num espaço Selvagem, os investigadores no seu espaço rolam 1 dado extra ao resolver testes.",
    initialSpace: "Buenos Aires, Argentina",
    fields: [
      ...createSkills(6, 6, 2, 2, 3, 3, 3),
      createCollectionField('hired_muscle')
    ]
  },
  {
    id: "trish_scarborough",
    name: "Trish Scarborough",
    image: "/characters/eldritch/Trish_Scarborough.webp",
    quote: "Nós mentimos o tempo todo. Mas a verdade sempre está lá. Só é preciso saber decifrar as pessoas.",
    bio: "Todos esperavam que Trish realizasse grandes feitos quando era criança. Na escola, era excepcional em educação fisica e ciências, mas ela surpreendeu a todos após a graduação ao aceitar um cargo simplório numa empresa de códigos comerciais. O que poucos sabem é que essa empresa em particular serve de fachada para o serviço de decifração da Agência, a Câmara Negra. Agora ela está em Krasnoyarsk para se encontrar com outro agente que possui informações importantes sobre uma ameaça iminente de outro mundo.",
    job: "A Espiã",
    action: "Se você não possuir nenhuma Pista, receba 1 Pista.",
    passive: "Se um investigador no seu espaço gastar 1 Pista para rerrolar um dado, ele pode rerrolar até 2 dados.",
    initialSpace: "Rússia Central (Espaço 16)",
    fields: [
      ...createSkills(7, 5, 1, 3, 4, 3, 2),
      createCollectionField('45_automatic')
    ]
  },
  {
    id: "mark_harrigan",
    name: "Mark Harrigan",
    image: "/characters/eldritch/Mark_Harrigan.webp",
    quote: "Eu vou sair por aquela porta e vou levar este livro. Se alguém quiser me impedir, sinta-se à vontade para tentar.",
    bio: "Durante a guerra, Mark testemunhou horrores que não conseguia explicar e escreveu sobre o que viu em cartas para sua amada esposa, Sophie. Quando voltou para casa, Mark descobriu que Sophie não era mais humana. Uma das criaturas que Mark tinha visto no exterior havia possuido seu corpo, matando-a no processo. Depois disso, a sede de vingança fez com que Mark fosse a Helsinki, onde algumas dessas criaturas haviam se apresentado como soldados alemães durante a Grande Guerra.",
    job: "O Soldado",
    action: "Você e 1 Monstro em seu espaço perdem 1 de Vida cada.",
    passive: "Você não pode ficar Atrasado ou receber uma Condição de Aprisionado a menos que opte por isso.",
    initialSpace: "Norte da Europa (Espaço 14)",
    fields: [
      ...createSkills(8, 4, 1, 2, 2, 4, 4),
      createCollectionField(
        '38_revolver',
        'kerosene'
      )
    ]
  },
  {
    id: "akachi_onyele",
    name: "Akachi Onyele",
    image: "/characters/eldritch/Akachi_Onyele.webp",
    quote: "Eu vou viajar para terras distantes. Não tenho medo.",
    bio: "Quando criança, na Nigéria, Akachi se mantinha afastada das outras crianças, preferindo a companhia de amigos imaginários. Seus pais temiam que ela fosse louca, mas o díbia da aldeia acreditava que ela havia sido escolhida pelos deuses. O sábio ancião ensinou-a a viajar entre os mundos e guiar espíritos. Agora ela se tornou uma líder sábia, viajando pela Africa e ensinando outros a se protegerem. Recentemente, chegou à Cidade do Cabo e, de lá, pretende rastrear as forças malignas que ameaçam a humanidade.",
    job: "A Xamã",
    action: "Olhe os 2 primeiros Portais da pilha de Portais. Coloque 1 Portal no topo e o outro embaixo da pilha de Portais.",
    passive: "Quando fechar um Portal durante um Encontro em Outro Mundo, você pode se mover para qualquer espaço que contenha uma Pista ou um Portal.",
    initialSpace: "África do sul (Espaço 15)",
    fields: [
      ...createSkills(5, 7, 3, 2, 2, 2, 4),
      createCollectionField(
        'mists_of_releh',
        'clues'
      )
    ]
  },
  {
    id: "jim_culver",
    name: "Jim Culver",
    image: "/characters/eldritch/Jim_Culver.webp",
    quote: "Não eles nao ficam quietos. Os mortos ficam fora de controle quando eu toco meu trompete.",
    bio: "A música do velho Jim Culver oferece conforto à alma, não importando se ela pertence ao mundo dos vivos ou dos mortos. As pessoas nos túmulos adoram conversar com Jim. Isso o perturbava, mas agora ele fica feliz com a companhia. Nos últimos dias, algumas almas que partiram em San Antonio foram atormentadas por algo. Elas estavam completamente apavoradas. E qualquer coisa que assuste os mortos merece a atenção total do velho Jim.",
    job: "O Músico",
    action: "Cada investigador em seu espaço recupera 1 de Sanidade.",
    passive: "Investigadores em seu espaço rolam 1 dado extra ao resolver testes durante Encontros de Combate.",
    initialSpace: "Sul dos Estados Unidos (Espaço 6)",
    fields: [
      ...createSkills(7, 5, 3, 3, 2, 2, 3),
      createCollectionField(
        'shriveling',
        'clues'
      )
    ]
  },
  {
    id: "lola_hayes",
    name: "Lola Hayes",
    image: "/characters/eldritch/Lola_Hayes.webp",
    quote: "Eu já desempenhei tantos papéis. A loucura é algo esperado.",
    bio: "Em todo o globo, Lola desempenhou papéis dramáticos em teatros lotados, Contudo, após ter sido chamada para um papel na peça controversa O Rei de Amarelo, Lola precisou 'dar um tempo' para se recuperar da 'exaustão'. Agora que saiu do hospício, ela está pronta para o retorno triunfante.Mas, desta vez, ela desempenhará um papel diferente na luta contra os horrores que ameaçam o mundo. Ela começou viajando a Tóquio para tentar encontrar o único outro ator sobrevivente da peça anterior.",
    job: "A Atriz",
    action: "Gaste quantas fichas de Aprimoramento quiser; em seguida, aprimore 1 proficiência de sua escolha para cada ficha gasta (uma ficha '+2' vale como 2 fichas)",
    passive: "Uma vez por turno, um investigador em seu espaço pode rolar 1 dado extra ao resolver um teste.",
    initialSpace: "Tóquio, Japão",
    fields: [
      ...createSkills(5, 7, 2, 4, 2, 2, 3),
      createCollectionField(
        '18_derringer',
        'lola_improvement'
      )
    ]
  },
  {
    id: "charlie_kane",
    name: "Charlie Kane",
    image: "/characters/eldritch/Charlie_Kane.webp",
    quote: "É possível dar um jeito. É só uma questão de negociar.",
    bio: "Quando a imprensa pergunta se Charlie está pensando em se candidatar a um cargo no governo, ele sorri e diz que está se concentrando em questões importantes. A verdade é que ele adoraria lançar sua campanha, mas agora a questão mais importante é evitar o fim do mundo sem causar pânico. Para isso, ele esteve angariando favores em todo o país. Nos últimos dias, Charlie esteve em São Francisco para visitar o Castelo Hearst. Com a ajuda de seus amigos e sua situação financeira, Charlie acredita poder resolver o problema sem sacrificar nenhum voto.",
    job: "O Político",
    action: "Outro investigador de sua escolha pode imediatamente realizar 1 ação extra.",
    passive: "Quando realizar uma ação de Adquirir Recursos, você pode permitir que outros investigadores recebam cartas que você comprar.",
    initialSpace: "São Francisco, Estados Unidos",
    fields: [
      ...createSkills(4, 8, 2, 4, 3, 2, 2),
      createCollectionField('personal_assistant')
    ]
  },
];
