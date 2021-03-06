define('ember-bootstrap/components/base/bs-accordion/item/title', ['exports', 'ember-bootstrap/templates/components/bs-accordion/title'], function (exports, _title) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    layout: _title.default,
    ariaRole: 'tab',
    classNameBindings: ['collapsed:collapsed:expanded'],

    /**
     * @property collapsed
     * @type boolean
     * @public
     */
    collapsed: null,

    /**
     * @property disabled
     * @type boolean
     * @private
     */
    disabled: false,

    /**
     * @event onClick
     * @public
     */
    onClick() {},

    click(e) {
      e.preventDefault();
      if (!this.get('disabled')) {
        this.get('onClick')();
      }
    }

  });
});