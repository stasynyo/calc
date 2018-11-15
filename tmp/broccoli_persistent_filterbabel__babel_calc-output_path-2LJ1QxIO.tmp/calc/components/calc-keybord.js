define('calc/components/calc-keybord', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    pressedKey: '',
    actions: {
      pressNumKeys(value) {
        this.set('pressedKey', value);
        //return console.log(`${value} key pressed`);
      }
    }
  });
});