import https from 'https';
import uuid from 'uuid';
const Config = require('../../config.json');
import State from './state';

export default class Api {

  static getWebId(){
    // localStorage is synchronous
    var storage = window.localStorage;
    var value = storage.getItem("webId");
    if (value){
      return value;
    } else{
      storage.setItem("webId", uuid.v4());
      return storage.getItem("webId");
    }
  }

  static _call(postBody, adInfo, path){
    console.log("_call");

    return new Promise((resolve,reject) => {
      postBody.idfa = adInfo.adId || adInfo.idfa;
      postBody.idfv = adInfo.idfv;
      if (!adInfo.idfa && !adInfo.idfv) {
        postBody.webId = Api.getWebId();
      }
      postBody.limitAd = adInfo.limitAd;
      postBody.userAgent = navigator.userAgent;
      postBody.referrer = State.referringLink;

      if (window.mmAdData){
        postBody.platform = "advertisement";
        postBody.impression = window.mmAdData.impression;
      } else {
        postBody.platform = device.platform;
        postBody.impression = State.impression;
      }

      postBody = JSON.stringify(postBody);

      console.log(postBody);

      const options = {
        hostname: Config.apiHost,
        port: 443,
        path: path,
        method: 'POST',
        headers : {
          'Content-Type': 'application/json',
          'Content-Length': postBody.length
        }
      };

      const req = https.request(options, (res) => {
        console.log('_call statusCode: ' + res.statusCode);

        res.on('data', (d) => {
          resolve();
        });
      });

      req.on('error', (e) => {
        console.error("_call error: " + e);
        resolve();
      });

      req.write(postBody);

      req.end();
    });
  }

  static getAdInfo(){
    if ((window.mmAdData) && (window.mmAdData.device_identifier)){
      return new Promise((resolve) => {resolve({idfa: window.mmAdData.device_identifier});});
    } else if (device.platform == "browser"){
      return new Promise((resolve) => {resolve({});});
    }

    return new Promise((resolve,reject)=>{
      window.androidIDFA.getAdInfo(resolve,reject);
    });
  }

  static call(body, path) {
    return this.getAdInfo().then((adInfo) => {
      return Api._call(body, adInfo, path);
    }).catch((error) => {
      console.log("call error: "+ error);
    });
  }
}
