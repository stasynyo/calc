import Component from '@ember/component';

export default Component.extend({
  screen: 0,

  printNumbers(value) {
    let tmp = this.get('screen');
    if (tmp === 0) {
      tmp = value;
      this.set('screen', tmp);
    }
    else {
      tmp += value;
      this.set('screen', tmp);
    }
  },

  deleteAllFromTheScreen(){
    this.set('screen', '');
  },

    actions: {
      display(value){
        switch (value) {
          case 'C':
            this.deleteAllFromTheScreen();
            break;

          default:
            this.printNumbers(value);
            break;

        }
      }
    }
  });
