import {startATB, startEveryonesATB} from '../utils'

describe('utils', () => {
    test('startATB emits events with correct id', () => {
        const fakeEmitter = {
            partyMemberHasTurn: jest.fn(),
            enemyHasTurn: jest.fn()
        }

        startATB({type: 'party', id: 1}, fakeEmitter, 'instant')
        startATB({ type: 'party', id: 2 }, fakeEmitter, 'instant')
        startATB({ type: 'enemy', id: 3 }, fakeEmitter, 'instant')

        expect(fakeEmitter.partyMemberHasTurn.mock.calls.length).toBe(2)
        expect(fakeEmitter.enemyHasTurn.mock.calls.length).toBe(1)
        expect(fakeEmitter.partyMemberHasTurn.mock.calls[0][0]).toBe(1)
        expect(fakeEmitter.partyMemberHasTurn.mock.calls[1][0]).toBe(2)
        expect(fakeEmitter.enemyHasTurn.mock.calls[0][0]).toBe(3)
    })


    test('startEveryonesATB emits events with correct id', () => {
        const fakeEmitter = {
            partyMemberHasTurn: jest.fn(),
            enemyHasTurn: jest.fn()
        }

        const party = [
            {type: 'party', id: 1},
            { type: 'party', id: 2 },
            { type: 'party', id: 3 }
        ]

        const enemies = [
            { type: 'enemy', id: 1 },
            { type: 'enemy', id: 2 },
            { type: 'enemy', id: 3 },
            { type: 'enemy', id: 4 }
        ]
        
        startEveryonesATB(party, enemies, fakeEmitter, 'instant')
        expect(fakeEmitter.partyMemberHasTurn.mock.calls.length).toBe(3)
        expect(fakeEmitter.enemyHasTurn.mock.calls.length).toBe(4)
        expect(fakeEmitter.partyMemberHasTurn.mock.calls[0][0]).toBe(1)      
        expect(fakeEmitter.enemyHasTurn.mock.calls[0][0]).toBe(1)
    })
})
