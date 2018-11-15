define('calc/components/calc-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    calcDisplay: '',
    actions: {
      pressKey(value) {
        return console.log(`${value} key pressed`);
      }
    }
  });
});