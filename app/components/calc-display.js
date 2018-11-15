import Component from '@ember/component';

export default Component.extend({
  prescreen: '',
  screen: 0,
  mathSign: '',

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
    if(this.screen === ''){
      this.set('prescreen', '');
      this.set('mathSign', '');
    }
    else{
    this.set('screen', '');
  }
  },

  mathOperations(value){
    switch (value) {
      case '+':
      if (this.prescreen === ''){
        this.set('prescreen', this.get('screen'));
        this.set('screen', '');
      }
      else{
        this.set('prescreen',  this.get('prescreen') + this.get('screen'));
        this.set('screen', '');
      }
        break;

      case '-':
        if (this.prescreen === ''){
          this.set('prescreen', this.get('screen'));
          this.set('screen', '');
        }
        else{
          this.set('prescreen', this.get('prescreen') - this.get('screen'));
          this.set('screen', '');
        }
        break;

      case '*':
      if (this.prescreen === ''){
        this.set('prescreen', this.get('screen'));
        this.set('screen', '');
      }
      else{
        this.set('prescreen', this.get('prescreen') * this.get('screen'));
        this.set('screen', '');
      }
        break;

      case '/':
      if (this.prescreen === ''){
        this.set('prescreen', this.get('screen'));
        this.set('screen', '');
      }
      else{
        this.set('prescreen', this.get('prescreen') / this.get('screen'));
        this.set('screen', '');
      }
        break;

      default:
        console.log(`*AMAZING*`);
    }

    this.set('mathSign', value);
  },

  equalSign(value){
    switch (value) {
      case '+':
        this.set('prescreen',  this.get('prescreen') + this.get('screen'));
        this.set('screen', '');
        break;

      case '-':
        this.set('prescreen', this.get('prescreen') - this.get('screen'));
        this.set('screen', '');
        break;

      case '*':
        this.set('prescreen', this.get('prescreen') * this.get('screen'));
        this.set('screen', '');

        break;

      case '/':
        this.set('prescreen', this.get('prescreen') / this.get('screen'));
        this.set('screen', '');

        break;

      default:
        console.log(`*AMAZING*`);
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
            this.equalSign(this.mathSign);
            break;

          default:
            this.printNumbers(value);
            break;

        }
      }
    }
  });
