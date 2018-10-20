import { startATB } from './utils'

export const areAllMembersGone = enemies => {

    const alive = Object.keys(enemies).filter(k => enemies[k].hp > 0)
    return alive.length === 0
}

export const checkIfBattleIsOver = (state, emit) => {
    const battleFinished = areAllMembersGone(state.enemies)
    const gameOver = areAllMembersGone(state.party)

    if (battleFinished) {
        emit.battleFinished(state)
        return true
    }

    if (gameOver) {
        emit.gameOver()
        return true
    }

    return false
}

export const commitAction = (command, state) => {
    const isAttackOnEnemy = command.type === 'attack' && command.targetType === 'enemy'
    const isAttackOnParty = command.type === 'attack' && command.targetType === 'party'
    const isHealOnParty = command.type === 'heal' && command.targetType === 'party'

    if (isAttackOnEnemy) {
        state.enemies[command.targetId].hp = state.enemies[command.targetId].hp - command.value
    }

    if (isAttackOnParty) {
        state.party[command.targetId].hp = state.party[command.targetId].hp - command.value
    }

    if (isHealOnParty) {
        state.party[command.targetId].hp = state.party[command.targetId].hp + command.value
        if (state.party[command.targetId].hp > state.party[command.targetId].maxHp) {
            state.party[command.targetId].hp = state.party[command.targetId].maxHp
        }
    }
}

export const emitActionResults = (command, state, emit) => {
    if (command.targetType === 'party') {
        emit.partyMemberStatHasChanged({
            id: command.targetId,
            hp: state.party[command.targetId].hp
        })
    } else {
        emit.enemyStatHasChanged({
            id: command.targetId,
            hp: state.enemies[command.targetId].hp
        })
    }
}

export const partyMemberAction = (command, state, emit) => {
    // apply author basic level stats to action
    // apply author equipment stats to action
    // apply author status to action (elemntal, blind, haste, protect)


    // apply target basic level stats to action
    // apply target equipment stats to action
    // apply target status to action (elemntal, blind, haste, protect)

    // commit action
    commitAction(command, state)

    // emit action results
    emitActionResults(command, state, emit)
  
    // check if battle is over
    const isBattleOver = checkIfBattleIsOver(state, emit)
    if (isBattleOver) {
        state = false
        return
    }

    // set timer
    startATB({
        type: 'party',
        id: command.authorId
    }, emit, 'instant')
}



const selectRandomEnemyAction = (id, state) => {
    return state.enemies[id].actions[0]
}

export const enemyAction = (command, state, emit) => {
    const action = command.action === 'random'
        ? selectRandomEnemyAction(command.authorId, state)
        : command.action

    // apply author basic level stats to action
    // apply author equipment stats to action
    // apply author status to action (elemntal, blind, haste, protect)


    // apply target basic level stats to action
    // apply target equipment stats to action
    // apply target status to action (elemntal, blind, haste, protect)

    // commit actions
    commitAction(command, state)
   
    // emit action results
    emitActionResults(command, state, emit)

    // check if battle is over
    const isBattleOver = checkIfBattleIsOver(state, emit)
    if (isBattleOver) {
        state = false
        return
    }

    // set timer
    startATB({
        type: 'enemy',
        id: command.authorId
    }, emit, 'instant')
}

export default {
    partyMemberAction,
    enemyAction
}