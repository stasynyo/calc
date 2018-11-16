import Component from '@ember/component';

export default Component.extend({
  prescreen: '',
  screen: '0',
  mathSign: '',

  printNumbers(value) {
    let tmp = this.get('screen');
    if (tmp === '0' && value !== '.') {
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
    else {
      this.set('mathSign', value);
      this.set('prescreen', this.equalTo(value));
      this.set('screen', '0');
    }

  },

  equalTo(value){

    let result;

    switch (value) {
      case '+':
        return result =
          parseFloat(this.get('prescreen')) + parseFloat(this.get('screen'));
        break;

      case '-':
        return result =
          parseFloat(this.get('prescreen')) - parseFloat(this.get('screen'));
        break;

      case '*':
        return result =
          parseFloat(this.get('prescreen')) * parseFloat(this.get('screen'));
        break;

      case '/':
        return result =
          parseFloat(this.get('prescreen')) / parseFloat(this.get('screen'));
        break;

        default:
          return result = NaN;
          break;
    }
  },

    actions: {
      display(value){
        switch (value) {
          case 'C':
            this.deleteAllFromTheScreen();
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
            this.printNumbers(value);
            break;

        }
      }
    }
  });
