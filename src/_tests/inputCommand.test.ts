import { areAllMembersGone, checkIfBattleIsOver, commitAction, emitActionResults, partyMemberAction } from '../inputCommand'

describe('inputCommandFile', () => {
    test('areAllEnemiesGone helper function works', () => {
        const x = areAllMembersGone({
            'one': { hp: 0 },
            'two': { hp: 13 }
        })
        expect(x).toBe(false)

        const y = areAllMembersGone({
            'one': { hp: 0 },
            'two': { hp: 0 }
        })
        expect(y).toBe(true)
    })

    test('checkIfBattleIsOver helper function is false when everyone has hp', () => {
        const fakeEmitter = {
            battleFinished: jest.fn(),
            gameOver: jest.fn()
        }

        const x = checkIfBattleIsOver({
            party: [{ hp: 0 }, { hp: 5 }],
            enemies: [{ hp: 0 }, { hp: 5 }]
        }, fakeEmitter)

        expect(fakeEmitter.battleFinished.mock.calls.length).toBe(0)
        expect(fakeEmitter.gameOver.mock.calls.length).toBe(0)
        expect(x).toBe(false)
    })

    test('checkIfBattleIsOver helper function emits gameOver properly', () => {
        const fakeEmitter = {
            battleFinished: jest.fn(),
            gameOver: jest.fn()
        }

        const x = checkIfBattleIsOver({
            party: [{ hp: 0 }, { hp: 0 }],
            enemies: [{ hp: 0 }, { hp: 5 }]
        }, fakeEmitter)

        expect(fakeEmitter.battleFinished.mock.calls.length).toBe(0)
        expect(fakeEmitter.gameOver.mock.calls.length).toBe(1)
        expect(x).toBe(true)
    })

    test('checkIfBattleIsOver helper function emits battleFinished properly', () => {
        const fakeEmitter = {
            battleFinished: jest.fn(),
            gameOver: jest.fn()
        }

        const x = checkIfBattleIsOver({
            party: [{ hp: 0 }, { hp: 5 }],
            enemies: [{ hp: 0 }, { hp: 0 }]
        }, fakeEmitter)

        expect(fakeEmitter.battleFinished.mock.calls.length).toBe(1)
        expect(fakeEmitter.gameOver.mock.calls.length).toBe(0)
        expect(x).toBe(true)
    })

    test('commitAction can properly attack enemy and update state', () => {
        const command = {
            type: 'attack',
            targetType: 'enemy',
            targetId: '500',
            value: 5
        }

        let state = {
            enemies: {
                '500': {
                    hp: 50
                }
            }
        }

        commitAction(command, state)
        expect(state.enemies['500'].hp).toBe(45)
    })

    test('commitAction can properly attack partymember and update state', () => {
        const command = {
            type: 'attack',
            targetType: 'party',
            targetId: '500',
            value: 5
        }

        let state = {
            party: {
                '500': {
                    hp: 50
                }
            }
        }

        commitAction(command, state)
        expect(state.party['500'].hp).toBe(45)
    })

    test('commitAction can properly heal partymember and update state', () => {
        const command = {
            type: 'heal',
            targetType: 'party',
            targetId: '500',
            value: 5
        }

        let state = {
            party: {
                '500': {
                    hp: 50
                }
            }
        }

        commitAction(command, state)
        expect(state.party['500'].hp).toBe(55)
    })

    test('commitAction can properly heal partymember and does not go over max hp', () => {
        const command = {
            type: 'heal',
            targetType: 'party',
            targetId: '500',
            value: 5
        }

        let state = {
            party: {
                '500': {
                    hp: 50,
                    maxHp: 52
                }
            }
        }

        commitAction(command, state)
        expect(state.party['500'].hp).toBe(52)
    })

    test('emitActionResults emits hp for party member', () => {
        const command = {
            targetType: 'party',
            targetId: '500',
        }

        let state = {
            party: {
                '500': {
                    id: '500',
                    hp: 50
                }
            }
        }

        const fakeEmitter = {
            partyMemberStatHasChanged: jest.fn(),
            enemyStatHasChanged: jest.fn()
        }

        emitActionResults(command, state, fakeEmitter)

        expect(fakeEmitter.partyMemberStatHasChanged.mock.calls[0][0]).toEqual({
            id: '500',
            hp: 50
        })
    })

    test('emitActionResults emits hp for enemy', () => {
        const command = {
            targetType: 'enemy',
            targetId: '500',
        }

        let state = {
            enemies: {
                '500': {
                    id: '500',
                    hp: 50
                }
            }
        }

        const fakeEmitter = {
            partyMemberStatHasChanged: jest.fn(),
            enemyStatHasChanged: jest.fn()
        }

        emitActionResults(command, state, fakeEmitter)

        expect(fakeEmitter.enemyStatHasChanged.mock.calls[0][0]).toEqual({
            id: '500',
            hp: 50
        })
    })

    // test('emitActionResults emits hp for enemy', () => {
    //     const command = {
    //         targetType: 'enemy',
    //         targetId: '500',
    //         authorId: '501',
    //         value: 5
    //     }

    //     let state = {
    //         party: {
    //             '501': {
    //                 id: '500',
    //                 hp: 50
    //             }
    //         },
    //         enemies: {
    //             '500': {
    //                 id: '500',
    //                 hp: 50
    //             }
    //         }
    //     }

    //     const fakeEmitter = {
    //         battleFinished: jest.fn(),
    //         partyMemberHasTurn: jest.fn(),
    //         enemyHasTurn: jest.fn(),
    //         partyMemberStatHasChanged: jest.fn(),
    //         enemyStatHasChanged: jest.fn(),
    //         gameOver: jest.fn()
    //     }

    //     partyMemberAction(command, state, fakeEmitter)

    //     expect(fakeEmitter.enemyStatHasChanged.mock.calls[0][0]).toEqual({
    //         id: '500',
    //         hp: 50
    //     })
    // })
})