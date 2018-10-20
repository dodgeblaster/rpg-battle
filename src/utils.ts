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

export const startEveryonesATB = (party, enemies, emit, speed) => {
    party.forEach(x => startATB(x, emit, speed))
    enemies.forEach(x => startATB(x, emit, speed))
}