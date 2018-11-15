QUnit.module('TemplateLint');

QUnit.test('calc/templates/application.hbs', function(assert) {
  assert.expect(1);
  assert.ok(false, 'calc/templates/application.hbs should pass TemplateLint.\n\ncalc/templates/application.hbs\n  13:4  error  Incorrect indentation for `<div>` beginning at L13:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  35:4  error  Incorrect indentation for `<div>` beginning at L35:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  57:4  error  Incorrect indentation for `<div>` beginning at L57:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  79:4  error  Incorrect indentation for `<div>` beginning at L79:C4. Expected `<div>` to be at an indentation of 2 but was found at 4.  block-indentation\n  12:10  error  Incorrect indentation for `div` beginning at L3:C2. Expected `</div>` ending at L12:C10 to be at an indentation of 2 but was found at 4.  block-indentation\n  4:6  error  Incorrect indentation for `<div>` beginning at L4:C6. Expected `<div>` to be at an indentation of 4 but was found at 6.  block-indentation\n  7:6  error  Incorrect indentation for `<div>` beginning at L7:C6. Expected `<div>` to be at an indentation of 4 but was found at 6.  block-indentation\n  9:20  error  you must use double quotes in templates  quotes\n  16:20  error  you must use double quotes in templates  quotes\n  21:20  error  you must use double quotes in templates  quotes\n  26:20  error  you must use double quotes in templates  quotes\n  31:20  error  you must use double quotes in templates  quotes\n  38:20  error  you must use double quotes in templates  quotes\n  43:20  error  you must use double quotes in templates  quotes\n  48:20  error  you must use double quotes in templates  quotes\n  53:20  error  you must use double quotes in templates  quotes\n  60:20  error  you must use double quotes in templates  quotes\n  65:20  error  you must use double quotes in templates  quotes\n  70:20  error  you must use double quotes in templates  quotes\n  75:20  error  you must use double quotes in templates  quotes\n  82:20  error  you must use double quotes in templates  quotes\n  87:20  error  you must use double quotes in templates  quotes\n  92:20  error  you must use double quotes in templates  quotes\n  97:20  error  you must use double quotes in templates  quotes\n');
});

QUnit.test('calc/templates/components/calc-button.hbs', function(assert) {
  assert.expect(1);
  assert.ok(true, 'calc/templates/components/calc-button.hbs should pass TemplateLint.\n\n');
});

QUnit.test('calc/templates/components/calc-display.hbs', function(assert) {
  assert.expect(1);
  assert.ok(true, 'calc/templates/components/calc-display.hbs should pass TemplateLint.\n\n');
});

