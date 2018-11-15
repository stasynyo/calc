import Component from '@ember/component';

export default Component.extend({
  calcDisplay: '',
  actions: {
   pressKey(value){
     this.get('pressNum')(value);
     return console.log(`${value} key pressed`);
    }
  }
});
