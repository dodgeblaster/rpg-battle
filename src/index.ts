import { startEveryonesATB } from './utils'
import {partyMemberAction, enemyAction} from './inputCommand'

type StartBattleInput = {
    enemies: any,
    party: any,
    speed: number,
    eventEmitter: any
}

let state: any = false
const initializeState = x => state = x

export default (input:StartBattleInput) => {

    const emit = {
        battleFinished          : x => input.eventEmitter('battle-finished', x),
        partyMemberHasTurn      : x => input.eventEmitter('party-member-has-turn', x),
        enemyHasTurn            : x => input.eventEmitter('enemy-has-turn', x),
        partyMemberStatHasChanged : x => input.eventEmitter('party-member-stat-has-changed', x),
        enemyStatHasChanged     : x => input.eventEmitter('enemy-stat-has-changed', x),
        gameOver                : x => input.eventEmitter('game-over')
    }

    initializeState({
        party: input.party, 
        enemies: input.enemies
    })

    startEveryonesATB(
        Object.keys(input.party).map(k => input.party[k]), 
        Object.keys(input.enemies).map(k => input.enemies[k]), 
        emit, 
        input.speed
    )

    return {
        inputCommand: x => {
            partyMemberAction(x, state, emit)
        },

        inputEnemyCommand: x => {
            enemyAction(x, state, emit)
        }
    }
}

