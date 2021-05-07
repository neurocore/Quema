const assert = require('assert');
const User = require('../src/user');
const State = require('../src/state');
const Actions = require('../src/action');

describe('Action', function()
{
    describe('Clear', function()
    {
        it('should return state with empty queues', function()
        {
            const state = new State();
            const action = new Actions.ActionClear();
            action.redo(state);

            assert.equal(state.party.length, 0);
            assert.equal(state.queue.length, 0);
        });
    });

    describe('SetN', function()
    {
        it('should implement narrowing transformation', function()
        {
            const state = new State();
            state.party = ['A', 'B', 'C', 'D', 'E'];
            state.queue = ['X', 'Y'];
            state.N = state.party.length;
            const action = new Actions.ActionSetN(3);
            action.redo(state);

            assert.deepEqual(state.party, ['A', 'B', 'C']);
            assert.deepEqual(state.queue, ['D', 'E', 'X', 'Y']);
        });

        it('should do correct narrowing', function()
        {
            const state = new State();
            state.party = ['A', 'B', 'C'];
            state.queue = ['X', 'Y'];
            state.N = 5;
            const action = new Actions.ActionSetN(3);
            action.redo(state);

            assert.deepEqual(state.party, ['A', 'B', 'C']);
            assert.deepEqual(state.queue, ['X', 'Y']);
        });

        it('shouldn\'t change arrays for expansion', function()
        {
            const state = new State();
            state.party = ['A', 'B', 'C', 'D', 'E'];
            state.queue = ['X', 'Y'];
            state.N = state.party.length;
            const action = new Actions.ActionSetN(7);
            action.redo(state);

            assert.deepEqual(state.party, ['A', 'B', 'C', 'D', 'E']);
            assert.deepEqual(state.queue, ['X', 'Y']);
        });
    });

    describe('Join', function()
    {
        it('should add username only to queue', function()
        {
            const state = new State();
            state.users.set('X', new User());
            state.party = [];
            state.queue = ['A', 'B', 'C'];
            const action = new Actions.ActionJoin('X');
            action.redo(state);

            assert.equal(state.party.length, 0);
            assert.deepEqual(state.queue, ['A', 'B', 'C', 'X']);
        });

        it('shouldn\'t add banned & non-existent user', function()
        {
            const state = new State();
            state.users.set('X', new User(Date.now() + 60 * 1000));
            state.party = [];
            state.queue = ['A', 'B', 'C'];
            (new Actions.ActionJoin('X')).redo(state);
            (new Actions.ActionJoin('Y')).redo(state);

            assert.deepEqual(state.queue, ['A', 'B', 'C']);
        });
    });

    describe('Left', function()
    {
        it('should remove user from all queues', function()
        {
            const state = new State();
            state.party = ['X', 'Y'];
            state.queue = ['A', 'B', 'X', 'C'];
            const action = new Actions.ActionLeft('X');
            action.redo(state);

            assert.deepEqual(state.party, ['Y']);
            assert.deepEqual(state.queue, ['A', 'B', 'C']);
        });
    });

    describe('Play', function()
    {
        it('should add users from queue to selected', function()
        {
            const state = new State();
            state.mode = Mode.Selecting;
            state.queue = ['X', 'Y'];
            state.selected = ['A', 'B'];
            (new Actions.ActionPlay('X')).redo(state);
            (new Actions.ActionPlay('Z')).redo(state);

            assert.equal(state.party.length, 0);
            assert.deepEqual(state.selected, ['A', 'B', 'X']);
            assert.deepEqual(state.queue, ['X', 'Y']);
        });

        it('shouldn\'t add any user when mode is not "Selecting"', function()
        {
            const state = new State();
            state.mode = Mode.Waiting;
            state.queue = ['X', 'Y'];
            state.selected = ['A', 'B'];
            (new Actions.ActionPlay('X')).redo(state);
            (new Actions.ActionPlay('Z')).redo(state);

            assert.equal(state.party.length, 0);
            assert.deepEqual(state.selected, ['A', 'B']);
            assert.deepEqual(state.queue, ['X', 'Y']);
        });
    });

    describe('Start', function()
    {
        this.timeout(1500);
        const state = new State();

        before(function()
        {
            state.party    = ['X', 'Y', 'Z', 'Kappa', 'Lambda'];
            state.queue    = ['A', 'B', 'C', 'D', 'E'];
            state.selected = ['A', 'B', 'E'];
            const action = new Actions.ActionStart('capybara42', 1);
            action.redo(state);
        });

        it('shouldn\'t change anything except mode', function()
        {
            assert.equal(state.mode, Mode.Selecting);
            assert.deepEqual(state.queue,    ['A', 'B', 'C', 'D', 'E']);
            assert.deepEqual(state.selected, ['A', 'B', 'E']);
        });

        it('should copy selected users to party', function(done)
        {
            setTimeout(function()
            {
                assert.deepEqual(state.party, ['A', 'B', 'E']);
                done();

            }, 1100);
        });

        it('should drop selected and change mode', function(done)
        {
            setTimeout(function()
            {
                assert.equal(state.mode, Mode.Waiting);
                assert.equal(state.selected.length, 0);
                done();

            }, 0);
        });

        it('should remove users that are in party from queue', function(done)
        {
            setTimeout(function()
            {
                assert.deepEqual(state.queue, ['C', 'D']);
                done();

            }, 0);
        });
    });
});
