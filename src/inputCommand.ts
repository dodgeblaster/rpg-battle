
const areAllEnemiesGone = enemies => {
    const alive = enemies.filter(x => x.hp > 0)
    return alive.length === 0
}

const areAllTeammatesGone = party => {
    const alive = party.filter(x => x.hp > 0)
    return alive.length === 0
}

const checkIfBattleIsOver = (state, emit) => {
    const battleFinished = areAllEnemiesGone(state.enemies)
    const gameOver = areAllTeammatesGone(state.party)

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

export const partyMemberAction = (command, state, emit) => {
    // apply author basic level stats to action
    // apply author equipment stats to action
    // apply author status to action (elemntal, blind, haste, protect)


    // apply target basic level stats to action
    // apply target equipment stats to action
    // apply target status to action (elemntal, blind, haste, protect)



    // commit action




    // emit action results
    if (command.targetType === 'party') {
        emit.partyMemberStatHasChanged({
            member: command.targetId,
            hp: state.party[command.targetId]
        })
    }



    


    // check if battle is over
    const isBattleOver = checkIfBattleIsOver(state, emit)
    if (isBattleOver) {
        state = false
        return
    }

    // set timer


    
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
   

    // emit action results
    if (command.targetType === 'party') {
        emit.partyMemberStatHasChanged({
            member: command.targetId,
            hp: state.party[command.targetId]
        })
    }


    // check if battle is over
    const isBattleOver = checkIfBattleIsOver(state, emit)
    if (isBattleOver) {
        state = false
        return
    }

    // set timer



}