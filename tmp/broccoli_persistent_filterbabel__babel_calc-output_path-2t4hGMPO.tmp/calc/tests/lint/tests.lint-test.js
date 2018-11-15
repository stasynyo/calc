define('calc/tests/lint/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('integration/components/calc-display-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/calc-display-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/calc-heart-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/calc-heart-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/calc-keybord-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/calc-keybord-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });
});