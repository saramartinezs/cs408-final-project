import { sortTasksByPriority } from '../js/main.js';
import { generateUniqueId } from '../js/main.js';

QUnit.module('sortTasksByPriority', function() {
    QUnit.test('sorts tasks by priority', function(assert) {
        const tasks = [
            { priority: "Low" },
            { priority: "High" },
            { priority: "Medium" }
        ];
        const sorted = sortTasksByPriority(tasks);
        assert.deepEqual(sorted.map(t => t.priority), ["High", "Medium", "Low"], "Tasks are sorted correctly by priority!");
    });
});

QUnit.module('generateUniqueId', function() {
    QUnit.test('ensures that it generates unique IDs', function(assert) {
        const existingIds = [1, 2, 3];
        var result = 1;
        result = generateUniqueId(existingIds, result);
        console.log(result);
        assert.equal(result, 4, 'Generates the next unique ID');
    });

    QUnit.test('handles gaps in IDs', function(assert) {
        const existingIds = [1, 2, 4];
        var result = 1;
        result = generateUniqueId(existingIds, result);
        assert.equal(result, 3, 'Generates the first available ID in the gap');
    });
});
