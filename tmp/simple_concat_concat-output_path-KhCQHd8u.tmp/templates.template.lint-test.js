QUnit.module('TemplateLint');

QUnit.test('calc/templates/application.hbs', function(assert) {
  assert.expect(1);
  assert.ok(true, 'calc/templates/application.hbs should pass TemplateLint.\n\n');
});

QUnit.test('calc/templates/components/calc-display.hbs', function(assert) {
  assert.expect(1);
  assert.ok(true, 'calc/templates/components/calc-display.hbs should pass TemplateLint.\n\n');
});

QUnit.test('calc/templates/components/calc-keybord.hbs', function(assert) {
  assert.expect(1);
  assert.ok(false, 'calc/templates/components/calc-keybord.hbs should pass TemplateLint.\n\ncalc/templates/components/calc-keybord.hbs\n  13:59  error  you must use double quotes in templates  quotes\n  18:59  error  you must use double quotes in templates  quotes\n  23:59  error  you must use double quotes in templates  quotes\n  35:59  error  you must use double quotes in templates  quotes\n  40:59  error  you must use double quotes in templates  quotes\n  45:59  error  you must use double quotes in templates  quotes\n  57:59  error  you must use double quotes in templates  quotes\n  62:59  error  you must use double quotes in templates  quotes\n  67:59  error  you must use double quotes in templates  quotes\n  79:59  error  you must use double quotes in templates  quotes\n');
});

