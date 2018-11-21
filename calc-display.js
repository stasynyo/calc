import Component from '@ember/component';

export default Component.extend({
  prescreen: '',
  screen: '0',
  mathSign: '',

  printNumbersToScreen(value) {
    let tmp = this.get('screen');
    if (
      tmp === '0' && value !== '.'
      || tmp === Infinity  && value !== '.'
      || isNaN(tmp)  && value !== '.'
      || tmp === 0  && value !== '.'
    ) {
        tmp = value;
        this.set('screen', tmp);
    }
    else {
      tmp += value;
      this.set('screen', tmp);
    }
  },

  deleteAllFromTheScreen(){
    if(this.screen === '0'){
      this.set('prescreen', '');
      this.set('mathSign', '');

    }
    else{
    this.set('screen', '0');
  }
  },

  mathOperations(value){

    if (this.prescreen === ''){
      this.set('prescreen', this.get('screen'));
      this.set('screen', '0');
      this.set('mathSign', value);
    }
    else if (this.screen === '0'){
      this.set('mathSign', value);
    }
    else {
      this.set('prescreen', this.equalTo(this.mathSign));
      this.set('mathSign', value);
      this.set('screen', '0');
    }

  },

  equalTo(value){

    let result;

    switch (value) {
      case '+':
        result =
          parseFloat(this.get('prescreen')) + parseFloat(this.get('screen'));
        break;

      case '-':
        result =
          parseFloat(this.get('prescreen')) - parseFloat(this.get('screen'));
        break;

      case '*':
        result =
          parseFloat(this.get('prescreen')) * parseFloat(this.get('screen'));
        break;

      case '/':
        result =
          parseFloat(this.get('prescreen')) / parseFloat(this.get('screen'));
        break;

        default:
          result = NaN;
          break;
    }
    return +result.toFixed(10);
  },

  blockTheDot(value){
    if (this.get('screen').indexOf('.') > 0){
      console.log(`Don't touch the dot`);
    }
    else {
      this.printNumbersToScreen(value);
    }
  },

    actions: {
      display(value){
        switch (value) {
          case 'C':
          case 'AC':
            this.deleteAllFromTheScreen();
            break;

          case '.':
            this.blockTheDot(value);
            break;

          case '+':
          case '-':
          case '*':
          case '/':
            this.mathOperations(value);
            break;

          case '=':
            this.set('screen', this.equalTo(this.mathSign));
            this.set('prescreen', '');
            this.set('mathSign', '');
            break;

          default:
            this.printNumbersToScreen(value);
            break;

        }
      }
    }
  });
