import React from 'react';
import ReactDOM from 'react-dom';

import Home from './home.jsx';
import ExperimentContainer from './experiment_container.jsx';
import Experiment1 from './experiment_1.jsx';
import Experiment2 from './experiment_2.jsx';
import Experiment3 from './experiment_3.jsx';
import Experiment4 from './experiment_4.jsx';
import Experiment5 from './experiment_5.jsx';
import Experiment6 from './experiment_6.jsx';
import Push from './push';
import Api from './api';
const Config = require('../../config.json');
import State from './state';

function parseQuery(qstr) {
  var query = {};
  var a = qstr.substring(qstr.indexOf("?") + 1).split('&');

  for (var i = 0; i < a.length; i++) {
    var b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  }
  return query;
}

class Root extends React.Component {
  state = {
    directLink: false,
    appViewable: false,
    path: null,
    initialState: null,
  };

  constructor(props) {
    super(props);
  }

  appViewable(){
    Api.call({eventType: "launch"}, Config.eventPath);
    this.setState({appViewable: true});

    if (window.mmAdData){
      Api.call(window.mmAdData, Config.impressionPath);
    }
  }

  mraidViewable(viewable){
    if (viewable) {
      mraid.removeEventListener('viewableChange', this.mraidViewable);
      this.appViewable();
    }
  }

  mraidIsReady(){
    mraid.removeEventListener('ready', this.mraidIsReady.bind(this));

    if (mraid.isViewable()) {
      this.mraidViewable(true);
    } else {
      mraid.addEventListener('viewableChange', this.mraidViewable.bind(this));
    }
  }

  startMraid(){
    if (mraid.getState() == 'loading') {
      mraid.addEventListener("ready", this.mraidIsReady.bind(this));
    }
    else {
      this.mraidIsReady();
    }
  }

  componentWillMount(){
    if ((typeof(mraid) != 'undefined')){
      this.startMraid();
    } else {
      this.appViewable();
    }

    console.log("PUSHAPP: check permission");
    PushNotification.hasPermission((data) => {
      if (data.isEnabled){
        console.log("PUSHAPP: has permission");
        Push.register().then(() => {
          console.log("PUSHAPP: Finished initial register");
        });
      } else {
        console.log("PUSHAPP: no permission");
      }
    });
  }

  componentDidMount(){
    // Is this an ad?
    if (window.mmAdData){
      this.setState({path:window.mmAdData.path, directLink: true});
    } else {
      console.log(location.search);
      // web link to an experiment
      const query = parseQuery(location.search);
      if (query.exp){
        this.setState({path:'/' + query.exp, directLink: true});
      }
    }

    // The branch initialization sets the initial path.  We don't know if it will complete before or after this component mounts, so if it isn't set yet, we provide a window function to set the path when it completes.
    // move branch here?
    if (typeof State.initialPath !== "undefined"){
      console.log("componentDidMount, initial path: " + State.initialPath);
      this.setState({path: State.initialPath});
      return;
    } else {
      console.log("componentDidMount, no initial path");
      State.setInitialPath = function(path) {console.log("componentDidMount, initial path func: " + State.initialPath); this.setState({path: path});}.bind(this);
    }
  }

  onNavigate(path){
    this.setState({path:path});
  }

  render() {
    if (!this.state.appViewable){
      return (<div>
        <div className="sk-fading-circle"/>
        <div className="sk-circle1 sk-circle"/>
        <div className="sk-circle2 sk-circle"/>
        <div className="sk-circle3 sk-circle"/>
        <div className="sk-circle4 sk-circle"/>
        <div className="sk-circle5 sk-circle"/>
        <div className="sk-circle6 sk-circle"/>
        <div className="sk-circle7 sk-circle"/>
        <div className="sk-circle8 sk-circle"/>
        <div className="sk-circle9 sk-circle"/>
        <div className="sk-circle10 sk-circle"/>
        <div className="sk-circle11 sk-circle"/>
        <div className="sk-circle12 sk-circle"/>
      </div>);
    }

    let component = null;

    switch(this.state.path) {
    case '/exp1':
      component = <ExperimentContainer directLink={this.state.directLink} experimentComponent={<Experiment1/>} experimentName='exp1' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    case '/exp2':
      component = <ExperimentContainer  directLink={this.state.directLink} experimentComponent={<Experiment2/>} experimentName='exp2' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    case '/exp3':
      component = <ExperimentContainer directLink={this.state.directLink} experimentComponent={<Experiment3/>} experimentName='exp3' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    case '/exp4':
      component = <ExperimentContainer directLink={this.state.directLink} experimentComponent={<Experiment4/>} experimentName='exp4' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    case '/exp5':
      component = <ExperimentContainer directLink={this.state.directLink} experimentComponent={<Experiment5/>} experimentName='exp5' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    case '/exp6':
      component = <ExperimentContainer directLink={this.state.directLink} experimentComponent={<Experiment6/>} experimentName='exp6' onNavigate={this.onNavigate.bind(this)}/>;
      break;
    default:
      component = <Home onNavigate={this.onNavigate.bind(this)}/>;
    }
    return (<div>{component}</div>);
  }
}

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('resume', this.onDeviceResume.bind(this), false);
  },

  onDeviceReady: function(){
    app.referrerInit();
    ReactDOM.render(<Root/>, document.getElementById('app'));
  },

  onDeviceResume: function(){
    app.referrerInit();
  },

  referrerInit: function() {
    State.referringLink = "unknown";

    if (window.mmAdData){
      console.log("Ad Referrer: " + window.mmAdData.order_id);
      State.referringLink = window.mmAdData.order_id;
      State.impression = window.mmAdData.impression;
    } else if (document.referrer){
      console.log("Web Referrer: " + document.referrer);
      State.referringLink = document.referrer;
    } else {
      const query = parseQuery(location.search);
      if (query['referrer']){
        console.log("Web Referrer Query: " + query['referrer']);
        State.referringLink = query['referrer'];
        State.impression = query['impression'];
        if (query['initial_state']){
          State.initialState = JSON.parse(query['initial_state']);
        }
      } else {
        // Branch initialization
        Branch.initSession(function(data) {
          console.log("Branch Referrer: " + data['~referring_link']);

          // State.referringLink = data['~referring_link'];
          State.referringLink = data['referrer'];
          State.impression = data['impression'];

          if (data.path){
            State.initialPath = data.path;
            if (data.initial_state){
              State.initialState = JSON.parse(data.initial_state);
            }
            if (typeof State.setInitialPath !== "undefined"){
              State.setInitialPath(data.path);
            }
          }
        }.bind(this)).then(function(res) {
          console.log('BRANCH Response: ' + JSON.stringify(res));
        }).catch(function(err) {
          console.log('BRANCH Error: ' + JSON.stringify(err));
        })
        ;
      }
    }
  }
};

app.initialize();
