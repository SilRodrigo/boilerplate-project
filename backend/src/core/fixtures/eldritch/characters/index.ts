import { ICharacter } from "../../../entities/character";
import { FieldType, ScalarType } from "../../../entities/field";
import { items } from "../items";

function createField(key: string, label: string, type: ScalarType, value: number | string | boolean): FieldType {
  return {
    key,
    label,
    type,
    value
  }
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
    createField("health", "Vida", "number", health),
    createField("sanity", "Sanidade", "number", sanity),
    createField("lore", "Conhecimento", "number", lore),
    createField("influence", "Influência", "number", influence),
    createField("observation", "Observação", "number", observation),
    createField("strength", "Força", "number", strength),
    createField("willpower", "Determinação", "number", willpower),
  ]
}

function createCollectionField(...ids: string[]): FieldType {
  return {
    key: "items",
    label: "Itens/Equipamentos/Feitiços",
    type: "collection",
    value: ids.map(id => getItemById(id))
  }

  function getItemById(id: string): any {
    return items.find(item => item.id === id);
  }
}

function createDetailFields(name: string, job: string, quote: string, bio: string, action: string, passive: string, initialSpace: string): FieldType[] {
  return [
    createField("name", "Nome", "string", name),
    createField("job", "Profissão", "string", job),
    createField("quote", "Citação", "string", quote),
    createField("bio", "Biografia", "string", bio),
    createField("action", "Ação", "string", action),
    createField("passive", "Passiva", "string", passive),
    createField("initialSpace", "Espaco Inicial", "string", initialSpace),
  ]
}

export const characters: ICharacter[] = [
  {
    id: "norman_withers",
    fields: [
      ...createDetailFields(
        'Norman Withers',
        'O Astrônomo',
        'Eu estive me preparando para confrontar esse mal durante minha vida inteira. Meu foco tem de ser absoluto.',
        'A comunidade cientifica ridicularizou Normam por dizer que seis estrelas desapareceram do céu. Após esgotar todas as explicações astronômicas plausíveis procurando por uma resposta, ele assumiu um cargo na Universidade de Miskatonic e começou a explorar possibilidades mais improváveis na seção restrita da biblioteca. Enquanto lia um antigo texto com profecias obscuras, Norman descobriu uma descrição exata do fenômeno que havia observado. Se o tomo estiver correto, uma incursão terrível ao nosso mundo é iminente.',
        'Gaste 2 Pistas para descartar 1 Monstro num espaço com um Portal.',
        'Uma vez por turno, vocé pode gastar 1 de Sanidade em vez de 1 Pista',
        'Arkham, Estados Unidos'
      ),
      ...createSkills(5, 7, 3, 1, 3, 2, 4),
      createCollectionField('feed_the_mind'),
    ]
  },
  {
    id: "lily_chen",
    fields: [
      ...createDetailFields(
        'Lily Chen',
        'A Artista Marcial',
        'Eu estive me preparando para confrontar esse mal durante minha vida inteira. Meu foco tem de ser absoluto.',
        'Lily raramente fala, mas, quando o faz, suas palavras são sábias e comedidas. Após uma vida inteira de treinamento disciplinado, cada gesto é gracioso, sem sinal de hesitação. Quando ela era criança, uma seita obscura de monges acreditava que ela havia nascido com um objetivo especial: confrontar um mal terrível. Agora os monges acreditam que esse mal está chegando e trouxeram Lily a Xangai para ela começar a cumprir seu destino.',
        'Gaste quanto de Vida quiser para recuperar essa mesma quantidade de Sanidade, ou vice-versa.',
        'Quando aprimorar uma proficiência, vocé pode imediatamente aprimorar essa mesma proficiência de novo.',
        'Xangai, China'
      ),
      ...createSkills(6, 6, 2, 2, 2, 4, 3),
      createCollectionField(
        'protective_amulet',
        'lucky_rabbits_foot'
      )
    ]
  },
  {
    id: "jacqueline_fine",
    fields: [
      ...createDetailFields(
        'Jacqueline Fine',
        'A Vidente',
        'Eu estive me preparando para confrontar esse mal durante minha vida inteira. Meu foco tem de ser absoluto.',
        'No início, os sonhos de Jacqueline com fogo e destruição pareciam uma maldição. Monstros corriam sem oposição pelas ruas da cidade, e uma escuridão ainda maior se manifestava no horizonte. Contudo, recentemente ela descobriu como controlar suas visões e observar os eventos em seus mínimos detalhes. Ontem, ela viajou de Boston para Minneapolis com o intuito de explorar um armazém abandonado que viu em seus sonhos. Chegando lá, ela encontrou evidências de um culto maligno que realizou rituais inenarráveis naquele local. Jacqueline espera usar o que aprendeu para evitar o terrível futuro que assombra seus sonhos.',
        'Voce pode trocar quantas pistas quiser com um investigador em qualquer espaço.',
        'Uma vez por turno, quando outro investigador receber uma Condição não Comum, você pode olhar o verso da carta e receber 1 Pista.',
        'Região Central dos Estados Unidos (Espaço 5)'
      ),
      ...createSkills(4, 8, 4, 2, 3, 1, 3),
      createCollectionField(
        'flesh_ward',
        'clues'
      )
    ]
  },
  {
    id: "silas_marsh",
    fields: [
      ...createDetailFields(
        'Silas Marsh',
        'O Marinheiro',
        'Deixem seus medos no cais, amigos. Eu não vou carregar este peso. O vento está soprando! Içar velas!',
        'Até mesmo em sua infância, em Innsmouth, Silas já tinha uma ligação com o mar. Ele é uma pessoa habilidosa e racional em terra, mas no mar ele possui força e perspicácia singulares, Isso lhe deu renome em todos os portos do mundo, principalmente em Sydney, onde desembarcou na noite passada. Mas hoje o cheiro do ar salobre traz ao mesmo tempo alegria e pavor. Há algo em seu passado, algo em Innsmouth, que ele sabe que um dia voltará para assombrá-lo.',
        'Mova-se 1 espaço em uma rota Naval: em seguida, realize uma ação extra.',
        'Se estiver num espaço Marítimo, os investigadores no seu espaço rolam 1 dado extra ao resolver testes.',
        'Sydney, Austrália'
      ),
      ...createSkills(8, 4, 1, 3, 3, 3, 3),
      createCollectionField('fishing_net')
    ]
  },
  {
    id: "diana_stanley",
    fields: [
      ...createDetailFields(
        'Diana Stanley',
        'A Cultista Arrependida',
        'A Loja não é tão inocente quanto finge ser. Eu aprendi que nada é o que parece, nem mesmo eu.',
        'Quando Diana foi iniciada na Ordem do Crepúsculo Prateado, ela acreditava que não fosse nada além de uma organização comunitária. Porém, conforme foi descobrindo mais sobre sua verdadeira natureza, ela ficou convencida de que um mal crescente ameaça o mundo e que o Crepúsculo Prateado terá um papel importante nessa ameaça. Ela acredita que a melhor chance que tem de evitar isso é usar sua posição para sabotar a organização. Carl Sanford, o lider da Ordem, reconheceu as habilidades dela e a enviou recentemente para o Panamá para receber treinamento.',
        'Se houver um Monstro Cultista no seu espaço, descarte todos os Monstros no seu espaço ou mova o Monstro Cultista para qualquer outro espaço.',
        'Reduza para 1 o horror dos Monstros que encontra.',
        'América Central (Espaço 7)'
      ),
      ...createSkills(7, 5, 4, 2, 3, 3, 1),
      createCollectionField(
        'arcane_manuscripts',
        'wither'
      )
    ]
  },
  {
    id: "leo_anderson",
    fields: [
      ...createDetailFields(
        'Leo Anderson',
        'O Chefe de Expedição',
        'Continue andando. Você pode morrer quando for a hora.',
        'Leo Anderson passou a vida inteira indo para os cantos mais mortais e obscuros da Terra. Em sua trajetória, ele perdeu bons amigos. A febre leva alguns; outros são mortos por animais selvagens. Após uma recente aventura desastrosa em lucatá, Leo mal conseguiu retornar a Buenos Aires. Ele já cansou de enterrar pessoas que confiaram nele. Mas o trabalho não terminou. O mundo está em perigo, e chorar com um copo de uísque não vai ajudar. Ele conseguiu alguns mercenários para ajudar e, de manhá, vai retornar à selva.',
        'Teste Influência. Se passar, receba da reserva ou da pilha de descartes 1 Recurso do tipo Aliado de sua escolha.',
        'Se estiver num espaço Selvagem, os investigadores no seu espaço rolam 1 dado extra ao resolver testes.',
        'Buenos Aires, Argentina'
      ),
      ...createSkills(6, 6, 2, 2, 3, 3, 3),
      createCollectionField('hired_muscle')
    ]
  },
  {
    id: "trish_scarborough",
    fields: [
      ...createDetailFields(
        'Trish Scarborough',
        'A Espiã',
        'Nós mentimos o tempo todo. Mas a verdade sempre está là. Só é preciso saber decifrar as pessoas.',
        'Todos esperavam que Trish realizasse grandes feitos quando era criança. Na escola, era excepcional em educação fisica e ciências, mas ela surpreendeu a todos após a graduação ao aceitar um cargo simplório numa empresa de códigos comerciais. O que poucos sabem é que essa empresa em particular serve de fachada para o serviço de decifração da Agência, a Câmara Negra. Agora ela está em Krasnoyarsk para se encontrar com outro agente que possui informações importantes sobre uma ameaça iminente de outro mundo.',
        'Se você não possuir nenhuma Pista, receba 1 Pista.',
        'Se um investigador no seu espaço gastar 1 Pista para rerrolar um dado, ele pode rerrolar até 2 dados.',
        'Rússia Central (Espaço 16)'
      ),
      ...createSkills(7, 5, 1, 3, 4, 3, 2),
      createCollectionField('45_automatic')
    ]
  },
  {
    id: "mark_harrigan",
    fields: [
      ...createDetailFields(
        'Mark Harrigan',
        'O Soldado',
        'Eu vou sair por aquela porta e vou levar este livro. Se alguém quiser me impedir, sinta-se à vontade para tentar.',
        'Durante a guerra, Mark testemunhou horrores que não conseguia explicar e escreveu sobre o que viu em cartas para sua amada esposa, Sophie. Quando voltou para casa, Mark descobriu que Sophie não era mais humana. Uma das criaturas que Mark tinha visto no exterior havia possuido seu corpo, matando-a no processo. Depois disso, a sede de vingança fez com que Mark fosse a Helsinki, onde algumas dessas criaturas haviam se apresentado como soldados alemães durante a Grande Guerra.',
        'Você e 1 Monstro em seu espaço perdem 1 de Vida cada.',
        'Você não pode ficar Atrasado ou receber uma Condição de Aprisionado a menos que opte por isso.',
        'Norte da Europa (Espaço 14)'
      ),
      ...createSkills(8, 4, 1, 2, 2, 4, 4),
      createCollectionField(
        '38_revolver',
        'kerosene'
      )
    ]
  },
  {
    id: "akachi_onyele",
    fields: [
      ...createDetailFields(
        'Akachi Onyele',
        'A Xamã',
        'Eu vou viajar para terras distantes. Não tenho medo.',
        'Quando criança, na Nigéria, Akachi se mantinha afastada das outras crianças, preferindo a companhia de amigos imaginários. Seus pais temiam que ela fosse louca, mas o díbia da aldeia acreditava que ela havia sido escolhida pelos deuses. O sábio ancião ensinou-a a viajar entre os mundos e guiar espíritos. Agora ela se tornou uma líder sábia, viajando pela Africa e ensinando outros a se protegerem. Recentemente, chegou à Cidade do Cabo e, de lá, pretende rastrear as forças malignas que ameaçam a humanidade.',
        'Olhe os 2 primeiros Portais da pilha de Portais. Coloque 1 Portal no topo e o outro embaixo da pilha de Portais.',
        'Quando fechar um Portal durante um Encontro em Outro Mundo, você pode se mover para qualquer espaço que contenha uma Pista ou um Portal.',
        'África do sul (Espaço 15)'
      ),
      ...createSkills(5, 7, 3, 2, 2, 2, 4),
      createCollectionField(
        'mists_of_releh',
        'clues'
      )
    ]
  },
  {
    id: "jim_culver",
    fields: [
      ...createDetailFields(
        'Jim Culver',
        'O Músico',
        'Não eles nao ficam quietos. Os mortos ficam fora de controle quando eu toco meu trompete.',
        'A música do velho Jim Culver oferece conforto à alma, não importando se ela pertence ao mundo dos vivos ou dos mortos. As pessoas nos túmulos adoram conversar com Jim. Isso o perturbava, mas agora ele fica feliz com a companhia. Nos últimos dias, algumas almas que partiram em San Antonio foram atormentadas por algo. Elas estavam completamente apavoradas. E qualquer coisa que assuste os mortos merece a atenção total do velho Jim.',
        'Cada investigador em seu espaço recupera 1 de Sanidade.',
        'Investigadores em seu espaço rolam 1 dado extra ao resolver testes durante Encontros de Combate.',
        'Sul dos Estados Unidos (Espaço 6)'
      ),
      ...createSkills(7, 5, 3, 3, 2, 2, 3),
      createCollectionField(
        'shriveling',
        'clues'
      )
    ]
  },
  {
    id: "lola_hayes",
    fields: [
      ...createDetailFields(
        'Lola Hayes',
        'A Atriz',
        'Eu já desempenhei tantos papéis. A loucura é algo esperado.',
        'Em todo o globo, Lola desempenhou papéis dramáticos em teatros lotados, Contudo, após ter sido chamada para um papel na peça controversa O Rei de Amarelo, Lola precisou "dar um tempo" para se recuperar da "exaustão". Agora que saiu do hospício, ela está pronta para o retorno triunfante.Mas, desta vez, ela desempenhará um papel diferente na luta contra os horrores que ameaçam o mundo. Ela começou viajando a Tóquio para tentar encontrar o único outro ator sobrevivente da peça anterior.',
        'Gaste quantas fichas de Aprimoramento quiser; em seguida, aprimore 1 proficiência de sua escolha para cada ficha gasta (uma ficha "+2" vale como 2 fichas)',
        'Uma vez por turno, um investigador em seu espaço pode rolar 1 dado extra ao resolver um teste.',
        'Tóquio, Japão'
      ),
      ...createSkills(5, 7, 2, 4, 2, 2, 3),
      createCollectionField(
        '18_derringer',
        'lola_improvement'
      )
    ]
  },
  {
    id: "charlie_kane",
    fields: [
      ...createDetailFields(
        'Charlie Kane',
        'O Político',
        'É possível dar um jeito. É só uma questão de negociar.',
        'Quando a imprensa pergunta se Charlie está pensando em se candidatar a um cargo no governo, ele sorri e diz que está se concentrando em questões importantes. A verdade é que ele adoraria lançar sua campanha, mas agora a questão mais importante é evitar o fim do mundo sem causar pânico. Para isso, ele esteve angariando favores em todo o país. Nos últimos dias, Charlie esteve em São Francisco para visitar o Castelo Hearst. Com a ajuda de seus amigos e sua situação financeira, Charlie acredita poder resolver o problema sem sacrificar nenhum voto.',
        'Outro investigador de sua escolha pode imediatamente realizar 1 ação extra.',
        'Quando realizar uma ação de Adquirir Recursos, vocé pode permitir que outros investigadores recebam cartas que vocé comprar.',
        'São Francisco, Estados Unidos'
      ),
      ...createSkills(4, 8, 2, 4, 3, 2, 2),
      createCollectionField('personal_assistant')
    ]
  },
];
