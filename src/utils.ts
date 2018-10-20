export const startEveryonesATB = (party, enemies, emit, speed) => {
    party.forEach(x => {
        if (speed === 'instant') {
            emit.partyMemberHasTurn(x.id)
            return
        } else {
            setTimeout(() => {
                emit.partyMemberHasTurn(x.id)
            }, (100 - x.speed) * speed)
        }
    })

    enemies.forEach(x => {
        if (speed === 'instant') {
            emit.enemyHasTurn(x.id)
            return
        } else {
            setTimeout(() => {
                emit.enemyHasTurn(x.id)
            }, (100 - x.speed) * speed)
        }
    })
}

export const startATB = (member, emit, speed) => {
    const action = member.type === 'party'
        ? () => emit.partyMemberHasTurn(member.id)
        : () => emit.enemyHasTurn(member.id)

    if (speed === 'instant') {
        action()
        return
    } else {
        setTimeout(() => {
            action()
        }, (100 - member.speed) * speed)
    }
}


