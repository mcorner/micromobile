export default class AppConfig {
  static root(){
    if (window.mmAdData){
      return 'https://e.adtrtwo.com/';
    } else {
      return '';
    }
  }
}
