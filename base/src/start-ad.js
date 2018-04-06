var jsFileLocation = document.querySelectorAll('script[src*=start-ad]')[0].src;  // the js file path
jsFileLocation = jsFileLocation.replace('start-ad.js', '');   // the js folder path
var insSelector = '[data-track-id="bf480eb1c1592e7a31e4b22e21a48974"]';

function replace(newIns, type){
  var scripts = newIns.getElementsByTagName(type);

  for (var i = 0; i < scripts.length; i++) {
    var s = document.createElement(type);
    var a = scripts[i].attributes;
    for (var j = 0; j < a.length; j++) {
      if (a[j].nodeName == "src" || a[j].nodeName == "href"){
        s[a[j].nodeName] = jsFileLocation + a[j].value;
      } else {
        s[a[j].nodeName] = a[j].value;
      }
    }

    if (scripts[i].innerHTML) {
      s.text = scripts[i].innerHTML;
    }

    scripts[i].parentNode.replaceChild(s, scripts[i]);
  }
}
function extract(i){
  var regex = new RegExp("^data-track-(.*)$"),m;
  var data = {};

  for (var j = 0; j < i.attributes.length; j++) {
    m = i.attributes[j].name.match(regex);
    if (m) {
      data[m[1]] = i.attributes[j].value;
    }
  }
  window.mmAdData = data;
}

function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
      if (xmlhttp.status == 200) {
        var ins = document.querySelectorAll(insSelector)[0];
        extract(ins);
        var newIns = document.createElement('DIV');
        newIns.innerHTML = xmlhttp.responseText;
        replace(newIns, 'SCRIPT');
        replace(newIns, 'LINK');
        ins.parentNode.replaceChild(newIns, ins);
      }
      else {
        console.error('There was an error: ' + xmlhttp.status + ' loading page');
      }
    }
  };

  var url = jsFileLocation + 'index.html';

  xmlhttp.open("GET", url);
  xmlhttp.send();
}

function mraidIsReady(){
  mraid.useCustomClose(true);
}

function mraidSetup(){
  if ((typeof(mraid) != 'undefined') && (mraid.getState() == 'loading')) {
    mraid.addEventListener("ready", mraidIsReady);
  }
  else if (typeof(mraid) != 'undefined'){
    mraidIsReady();
  }
}

mraidSetup();
loadXMLDoc();
