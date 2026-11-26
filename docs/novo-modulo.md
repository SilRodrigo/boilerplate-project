# Criando um módulo do zero

Passo a passo para criar uma funcionalidade completa, do banco até a tela, sem editar nenhum arquivo do boilerplate. O exemplo cria **Tarefas** (`task`). Troque o nome pelo seu.

Tudo o que aparece aqui é carregado por convenção. Por isso um projeto derivado consegue puxar as atualizações do boilerplate (`git merge upstream/master`) sem conflito.

## Checklist

| # | Arquivo novo | Para quê |
| --- | --- | --- |
| 1 | `backend/prisma/schema/task.prisma` | Tabela |
| 2 | `backend/src/core/dtos/task.ts` | Tipos de entrada, filtro e ordenação |
| 3 | `backend/src/core/entities/task.ts` | O que a API devolve |
| 4 | `backend/src/core/repositories/contracts/ITaskRepository.ts` | O que o repositório oferece (sem Prisma) |
| 5 | `backend/src/core/repositories/implementations/prisma/TaskRepository.ts` | Acesso ao banco com Prisma |
| 6 | `backend/src/core/modules/task/<ação>/useCase.ts` e `controller.ts` | Regra de negócio e HTTP |
| 7 | `backend/src/core/routes/task.routes.ts` | URLs |
| 8 | `frontend/src/pages/tasks/Index.tsx` | Tela |
| 9 | Uma entrada em `frontend/src/config/pages.tsx` | Rota e menu |

Depois do passo 1, rode `npm run prisma:db-push --workspace backend` para criar a tabela e atualizar o client do Prisma.

---

## 1. Modelo do Prisma

O Prisma junta todos os `.prisma` de `backend/prisma/schema/`. Crie um arquivo por domínio:

```prisma
// backend/prisma/schema/task.prisma
model Task {
  id String @id @default(uuid())
  title String @db.VarChar(150)
  done Boolean @default(false)
  userId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

Aqui o `userId` é só uma coluna, sem `@relation`. Uma relação de verdade com `User` obrigaria a adicionar `tasks Task[]` no `model User`, que fica em `user.prisma`, um arquivo do boilerplate. Só faça isso se precisar da integridade no banco (ex.: apagar as tarefas junto com o usuário). Nesse caso, a mudança em `user.prisma` deve ser mínima.

## 2. DTOs

```ts
// backend/src/core/dtos/task.ts
import { Prisma } from "@prisma/client";
import { ListFilter, ListOrder } from "../../types/ListQuery";

export interface ICreateTaskDto extends Pick<Prisma.TaskUncheckedCreateInput, 'title' | 'userId'> { }
export interface IRequestTaskDto extends Prisma.TaskGetPayload<{}> { }
export interface IUpdateTaskDto { title?: string; done?: boolean; }
export interface IIncludeTaskDto { }

// Só esses campos podem ser usados em ?filter= e ?order= (o resto é descartado)
export const TASK_FILTER_FIELDS = ['title', 'done', 'createdAt'] as const;
export const TASK_ORDER_FIELDS = ['title', 'createdAt'] as const;

export type TaskFilterField = typeof TASK_FILTER_FIELDS[number];
export type IFilterTaskDto = ListFilter<TaskFilterField>;
export type IOrderTaskDto = ListOrder<TaskFilterField>;
```

- **Filtro e ordenação** usam os tipos neutros de `types/ListQuery.ts`, e não os do Prisma. Eles definem o contrato da API (`?filter=` e `?order=`), que não pode depender do banco.
- **Criação, atualização e registro bruto** (`ICreate…`, `IUpdate…`, `IRequest…`) podem derivar do Prisma, porque assim acompanham o schema sozinhos. Se um dia entrar outra fonte de dados, reescreva essas interfaces à mão; o resto do código não muda.
- Importe direto de `dtos/task`, sem adicionar nada em `dtos/index.ts`. Esse arquivo é do boilerplate.

## 3. Entidade

A entidade é o formato que sai da API. Nunca coloque nela dados sensíveis (ex.: senha).

```ts
// backend/src/core/entities/task.ts
import { IRequestTaskDto } from "../dtos/task";

export interface ITask {
    id: string;
    title: string;
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const taskFactory = (dto: IRequestTaskDto): ITask => ({
    id: dto.id,
    title: dto.title,
    done: dto.done,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
});
```

## 4. Contrato do repositório

Os casos de uso dependem só desta interface, nunca da classe do Prisma.

```ts
// backend/src/core/repositories/contracts/ITaskRepository.ts
import { ITask } from "../../entities/task";
import { ICreateTaskDto, IUpdateTaskDto, TaskFilterField } from "../../dtos/task";
import { IBaseRepository } from "./IBaseRepository";

export interface ITaskRepository extends IBaseRepository<ITask, ICreateTaskDto, IUpdateTaskDto, TaskFilterField> { }
```

O `IBaseRepository` já declara `create`, `update`, `delete`, `findById` e `findByFilter` (paginado, com filtro e ordenação neutros). Métodos específicos (ex.: `findByUserId`) entram na interface e na implementação.

## 5. Implementação com Prisma

O nome do arquivo define o nome no container: `prisma/TaskRepository.ts` → `taskRepository`. O nome não diz qual é a fonte de dados, então trocar a implementação não muda quem usa.

```ts
// backend/src/core/repositories/implementations/prisma/TaskRepository.ts
import { ITask, taskFactory } from "../../../entities/task";
import { ICreateTaskDto, IIncludeTaskDto, IRequestTaskDto, IUpdateTaskDto, TaskFilterField } from "../../../dtos/task";
import { ITaskRepository } from "../../contracts/ITaskRepository";
import { PrismaBaseRepository } from "./abstract/BaseRepository";

const INDEX_KEY = 'task' as const;

export default class PrismaTaskRepository extends PrismaBaseRepository<
    typeof INDEX_KEY, IIncludeTaskDto, ITask, ICreateTaskDto, IRequestTaskDto, IUpdateTaskDto, TaskFilterField>
    implements ITaskRepository {

    constructor() {
        super(INDEX_KEY, taskFactory, {})
    }
}
```

O `PrismaBaseRepository`:
- traduz o filtro e a ordenação neutros para o `where` e o `orderBy` do Prisma (`abstract/listQueryToPrisma.ts`);
- transforma violação de chave única (`P2002`) em `DuplicateError` (de `helpers`), que o caso de uso trata sem saber qual é o banco;
- tem extras específicos do Prisma (`include`, `$transaction`, `findByUnique`), que só devem ser usados dentro de `implementations/prisma`.

## 6. Caso de uso e controller

A pasta define o nome no container: `modules/task/create/useCase.ts` → `taskCreateUseCase`, e `controller.ts` → `taskCreateController`. O controller recebe o caso de uso pelo nome.

```ts
// backend/src/core/modules/task/create/useCase.ts
import { ITask } from "../../../entities/task";
import { IUseCase, withUseCaseResponse } from "../../../../types/UseCase";
import { HttpError } from "../../../../helpers/httpError";
import { ITaskRepository } from "../../../repositories/contracts/ITaskRepository";

interface IFactoryParams {
    taskRepository: ITaskRepository;
}

export interface ITaskCreateUseCase extends IUseCase<{ title: string; userId: string }, ITask> { }

export default function taskCreateUseCaseFactory({ taskRepository }: IFactoryParams): ITaskCreateUseCase {
    return {
        execute: async ({ title, userId }) => {
            if (!title.trim()) throw new HttpError("Title is required.", 400);

            const task = await taskRepository.create({ title: title.trim(), userId });

            return withUseCaseResponse(task, "Task created successfully.");
        }
    };
}
```

```ts
// backend/src/core/modules/task/create/controller.ts
import { Response } from 'express';
import { errorResponse, successResponse } from '../../../../helpers/response';
import { IAuthController } from '../../../../types/Controller';
import { ITask } from '../../../entities/task';
import { ITaskCreateUseCase } from './useCase';

interface IFactoryParams {
    taskCreateUseCase: ITaskCreateUseCase;
}

export interface ITaskCreateController extends IAuthController<ITask> { }

export default function taskCreateControllerFactory({ taskCreateUseCase }: IFactoryParams): ITaskCreateController {
    return {
        handle: async (request, response: Response): Promise<Response> => {
            const { title } = request.body ?? {};

            if (typeof title !== 'string') {
                return errorResponse(response, new Error("Title is required."), 400);
            }

            try {
                const { data, message } = await taskCreateUseCase.execute({ title, userId: request.user!.id });

                return successResponse(response, data, message, 201);
            } catch (err: any) {
                return errorResponse(response, err);
            }
        }
    };
}
```

- Valide o formato da entrada no controller (tipos, campos obrigatórios) e a regra de negócio no caso de uso.
- O caso de uso recebe a **interface** (`ITaskRepository`) e nunca importa nada de `@prisma/client` nem de `implementations/prisma`. O `architecture.spec.ts` falha se isso acontecer.
- Use `IAuthController` quando a rota tiver `authMiddleware`. Ele dá acesso a `request.user`.
- `throw new HttpError(mensagem, status)` no caso de uso vira a resposta HTTP com esse status.
- Para listagens, copie `modules/example/list`. O `parseListParams` com `TASK_FILTER_FIELDS` / `TASK_ORDER_FIELDS` cuida da paginação e de filtros seguros.

## 7. Rotas

Todo `<nome>.routes.ts` com `export default` é montado em `/api/v1/<nome>`. Não precisa registrar em lugar nenhum.

```ts
// backend/src/core/routes/task.routes.ts
import { makeInvoker } from "awilix-express";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import taskCreateControllerFactory from "../modules/task/create/controller";

const taskRoutes = Router();

const taskCreateController = makeInvoker(taskCreateControllerFactory);

taskRoutes.post('/', authMiddleware, taskCreateController('handle'));

export default taskRoutes;
```

Para montar em outro caminho, exporte `basePath` no mesmo arquivo: `export const basePath = '/admin/tasks';`.

Para restringir a admin, adicione `adminMiddleware` depois do `authMiddleware`.

## 8 e 9. Página no front

Monte a tela com `useList`, `ListHeader`, `ListTable` e `BaseForm`. O exemplo completo de CRUD está no [README do front](../frontend/README.md#criando-uma-página-de-crud).

Depois registre a página em `frontend/src/config/pages.tsx`. Ela vira rota privada, item do menu e card na Home:

```tsx
import { ListTodo } from 'lucide-react'
import type { AppPage } from './pageTypes'
import TasksPage from '../pages/tasks/Index'

export const pages: AppPage[] = [
  { path: '/tasks', element: <TasksPage />, title: 'Tarefas', description: 'Suas tarefas', icon: ListTodo },
]
```

| Campo | Efeito |
| --- | --- |
| `adminOnly: true` | Some do menu para quem não é admin. Quem abrir a URL volta para a Home. A API também precisa do `adminMiddleware`, porque o front sozinho não protege nada. |
| `hideFromMenu: true` | Cria a rota sem item no menu (ex.: página de detalhe `/tasks/:id`). |

## 10. Teste

Os testes ficam ao lado do caso de uso (`useCase.spec.ts`) e rodam com `npm run test:dev --workspace backend`. Passe um repositório falso para a factory, sem banco. Veja `modules/user/register/useCase.spec.ts`:

```ts
const taskRepository = { create: jest.fn().mockResolvedValue({ id: "t1", title: "x", done: false }) };
const useCase = taskCreateUseCaseFactory({ taskRepository: taskRepository as any });
```

Se o caso de uso importa algo de `core/config`, faça `jest.mock` desse módulo. O `jest.mock` sobe para antes das variáveis do arquivo, então um valor que muda entre testes precisa ser lido por um getter.

---

## Trocando a fonte de dados

Para usar outra fonte (outro banco, uma API externa, memória nos testes):

1. Crie `backend/src/core/repositories/implementations/<fonte>/TaskRepository.ts` com uma classe que `implements ITaskRepository`.
2. Traduza `ListFilter` / `ListOrder` para a consulta da nova fonte, como faz `listQueryToPrisma.ts`.
3. Lance `DuplicateError` quando a fonte recusar um valor repetido.
4. Aponte o glob de repositórios em `container.ts` para a nova pasta (é a única linha que muda).

Os casos de uso, controllers, rotas e o contrato da API continuam iguais.

## Arquivos do boilerplate (não edite num projeto derivado)

Mudanças nesses arquivos devem ser feitas no boilerplate e puxadas para o projeto. Assim todos os projetos ganham a melhoria e o merge não conflita.

| Arquivo | Conteúdo |
| --- | --- |
| `backend/prisma/schema/schema.prisma` | Só o generator e o datasource |
| `backend/prisma/schema/user.prisma` | Usuário e papéis (ADMIN/USER) |
| `backend/src/container.ts` | Registro automático de repositórios e módulos |
| `backend/src/core/routes/index.ts` | Montagem automática das rotas |
| `backend/src/core/modules/user/*` e `user.routes.ts` | Login, cadastro, `me` e lista de usuários |
| `backend/src/core/dtos/index.ts`, `entities/index.ts`, `repositories/index.ts` | Exportações dos módulos do boilerplate |
| `backend/src/types/ListQuery.ts`, `repositories/contracts/IBaseRepository.ts` | Filtro, ordenação e contrato base, sem Prisma |
| `backend/src/core/repositories/implementations/prisma/abstract/*` | Base dos repositórios Prisma e tradução do filtro |
| `backend/src/core/architecture.spec.ts` | Teste que falha se `modules/` ou `middlewares/` importarem o Prisma |
| `frontend/src/config/basePages.tsx` | Home, Usuários e Logout |
| `frontend/src/App.tsx`, `hooks/useMenuItems.ts` | Rotas e menu montados a partir das listas de páginas |

O módulo `example` (`example.prisma`, `modules/example`, `example.routes.ts` e o DTO, a entidade e o repositório dele) é só referência e pode ser apagado.

## Cadastro de usuários

- `POST /api/v1/user/register` vem **desligado**. Painéis de administração normalmente não querem cadastro aberto. Para ligar, use `REGISTRATION_ENABLED=true` no `backend/.env`.
- O cadastro sempre cria `USER`. Admin só vem do seed (`npm run prisma:seed --workspace backend`).
- Toda tentativa conta no limite por IP (`REGISTER_RATE_LIMIT_MAX` por hora), com sucesso ou não, para frear criação de contas em massa.
- A senha tem mínimo `PASSWORD_MIN_LENGTH` e máximo de 72 bytes, porque o bcrypt ignora o que passa disso.
- E-mail repetido responde `409`.
