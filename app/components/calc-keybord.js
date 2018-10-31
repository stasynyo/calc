import Component from '@ember/component';

export default Component.extend({
  keyNum: '',
  actions: {
    pressNumKeys(value){
      return console.log(`${value} key pressed`);
      }
    }
  });
