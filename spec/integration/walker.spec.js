'use strict';

const
    { walk, walkAsync } = require('../../src/walker.js');

describe('walker', () => {

    const dir = 'spec';
    const expectedResult = [
        ['spec', ['helpers', 'integration', 'support'], [ '.eslintrc']],
        ['spec/helpers', [], ['matchers.js', 'promises.js', 'reporter.js']],
        ['spec/integration', [], ['walker.spec.js']],
        ['spec/support', [], ['jasmine.all.json', 'jasmine.integration.json', 'jasmine.json']]
    ];

    describe('walk()', () => {
        it('should give the expected result when iterated', () => {
            expect([...walk(dir)]).toEqual(expectedResult);
        });
    });

    describe('walkAsync()', () => {
        it('should give the expected result when iterated', async () => {
            const result = [];
            for (const promise of walkAsync(dir)) {
                result.push(await promise);
            }
            expect(result).toEqual(expectedResult);
        });
    });

});
