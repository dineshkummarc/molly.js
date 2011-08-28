describe 'molly', () ->

    app

    beforeEach () ->
        app = molly()

    it 'should define a global function', () ->
        expect(typeof molly).toBe 'function'
