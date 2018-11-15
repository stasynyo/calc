QUnit.module('ESLint | app');

QUnit.test('app.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'app.js should pass ESLint\n\n');
});

QUnit.test('components/calc-display.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'components/calc-display.js should pass ESLint\n\n');
});

QUnit.test('components/calc-keybord.js', function(assert) {
  assert.expect(1);
  assert.ok(false, 'components/calc-keybord.js should pass ESLint\n\n7:14 - Unexpected console statement. (no-console)');
});

QUnit.test('resolver.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'resolver.js should pass ESLint\n\n');
});

QUnit.test('router.js', function(assert) {
  assert.expect(1);
  assert.ok(true, 'router.js should pass ESLint\n\n');
});

