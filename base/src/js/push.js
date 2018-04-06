import Api from './api';
const Config = require('../../config.json');

const initParams = {
  android: {
    forceShow: true,
  },
  browser: {
  },
  ios: {
    alert: "true",
    badge: "true",
    sound: "true"
  },
  windows: {}
};

var pushToken = null;

export default class Push {

  static sendPushReg(path){
    let postBody = {};
    postBody.pushToken = pushToken;
    postBody.path = path;

    return Api.call(postBody, Config.pushRegPath);
  }

  static register(){
    return new Promise((resolve,reject) => {
      if (pushToken){
        console.log("PUSHAPP: Already have token");
        resolve();
      } else{
        console.log("PUSHAPP: No token initialize push");
        var push = PushNotification.init(initParams);

        push.on('registration', function(data) {
          console.log("PUSHAPP registration: " + data.registrationId);
          pushToken = data.registrationId;
          resolve();
        });

        push.on('notification', function(data) {
          console.log("PUSHAPP notification: " + JSON.stringify(data));
          push.finish();

          if (data.additionalData && data.additionalData.path){
            const newPath = "index.html#/" + data.additionalData.path;
            console.log("PUSHAPP setting path: " + newPath);
            window.location = newPath;
            window.location.reload();  // in case the app was left on that page
          }
        });

        push.on('error', function(e) {
          console.log("PUSHAPP error: ", e);
          reject();
        });
      }
    });
  }

  static subscribe(path){
    return this.sendPushReg(path);
  }
}
