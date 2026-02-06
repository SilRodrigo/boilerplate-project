import { tokenService } from "../../../../runtime/service/token"
import { gameManager } from "../../../../runtime/state/gameManager"
import { IPlayer } from "../../../entities/player"

export const setup = () => {
    const gameId = 'eldritch'

    const reserve: IPlayer = {
        token: tokenService.createToken(gameId, 'reserve'),
        name: 'Reserva',
        character: {
            id: 'reserve', fields: [
                { key: 'name', label: 'Reserva', type: 'string', value: 'Reserve' },
                { key: 'items', label: 'Itens', type: 'collection', value: [] },
            ]
        }
    }

    gameManager.addPlayer(gameId, reserve)
}