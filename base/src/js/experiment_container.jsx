import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

import InformedConsent from './informed_consent.jsx';
import ExperimentHeader from './experiment_header.jsx';
import PushSignup from './push_signup.jsx';
import Survey from './survey.jsx';
import Thanks from './thanks.jsx';
import AppEngage from './app_engage.jsx';
import Api from './api';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');
import AppConfig from './app_config';
import State from './state';

const StateEnum = {
  SHOW_AD: 0,
  CONSENT: 1,
  EXPERIMENT: 2,
  //  PUSH: 3,
  SURVEY: 4,
  THANKS: 5,
};

const DEFAULT_AD_DESTINATIONS = ['AD', 'WEB', 'APP'];
const OVERRIDE_AD_DESTINATIONS = {
  exp5: ['WEB', 'APP'],
  exp6: ['WEB', 'APP'],
};

const BATTERY_LOCATION_ORDER='270073';
//const BATTERY_LOCATION_ORDER='2';
const ORDER_OVERRIDE_AD_DESTINATIONS = {
  [BATTERY_LOCATION_ORDER]: ['AD'],
};

const BRANCH_LINKS = {
  exp1: 'https://micromobile.app.link/2S5UW6VAlH',
  exp2: 'https://micromobile.app.link/OlMu7SYAlH',
  exp3: 'https://micromobile.app.link/UEb0aMUKlH',
  exp4: 'https://micromobile.app.link/ZxPrN1VKlH',
  exp5: 'https://micromobile.app.link/L2b1g1WKlH',
  exp6: 'https://micromobile.app.link/XlBDmlcO7H',
};

const OVERRIDE_AD_IMAGE = {
  '269255': 'ad_retarget.png',
  '2': 'ad_retarget.png',
};

class ExperimentContainer extends React.Component {

  static propTypes = {
    directLink: PropTypes.bool.isRequired,
    experimentComponent: PropTypes.object.isRequired,
    experimentName: PropTypes.string.isRequired,
    onNavigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const initialState = {
      step: StateEnum.CONSENT,
      destination: null,
      adImage: (window.mmAdData && OVERRIDE_AD_IMAGE[window.mmAdData.order_id]) ?  OVERRIDE_AD_IMAGE[window.mmAdData.order_id] : 'ad2.png',
    };

    if (window.mmAdData){
      Api.call({eventType: "show_ad", eventSubType: this.props.experimentName}, Config.eventPath);
      initialState.step = StateEnum.SHOW_AD;
    } else if (State.initialState) {
      if (State.initialState.step){
        initialState.step = State.initialState.step;
        State.initialState.step = null; // consume the initial state so that no one else uses it
      }
    }
    this.state = initialState;
  }

  componentDidMount(){
    let destinations = null;

    if ((window.mmAdData) && (ORDER_OVERRIDE_AD_DESTINATIONS[window.mmAdData.order_id])){
      destinations = ORDER_OVERRIDE_AD_DESTINATIONS[window.mmAdData.order_id];
    } else if (OVERRIDE_AD_DESTINATIONS[this.props.experimentName]){
      destinations = OVERRIDE_AD_DESTINATIONS[this.props.experimentName];
    } else {
      destinations = DEFAULT_AD_DESTINATIONS;
    }
    console.log("DESTINATIONS: " + destinations);

    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    console.log("DESTINATION: " + destination);
    this.setState({destination: destination});
  }

  // This is a hack to route the battery ->location order.  FIX THIS
  batteryOrder(){
    if ((window.mmAdData) && (window.mmAdData.order_id == BATTERY_LOCATION_ORDER)){
      return true;
    } else {
      return false;
    }
  }

  onConsentChanged(){
    this.setState({ step: StateEnum.EXPERIMENT });
  }

  onExperimentComplete(){
    Api.call({eventType: "experiment_complete", eventSubType: this.props.experimentName}, Config.eventPath);

    // Experiment: after battery experiment, send to location experiment

    if (this.batteryOrder()){
      this.openUrl(this.makeMopubUrl('exp6', JSON.stringify({ step: StateEnum.EXPERIMENT })));
    } else {
      this.setState({step: StateEnum.SURVEY });
    }
  }

  onFinishSurvey(){
    Api.call({eventType: "survey_finished", eventSubType: this.props.experimentName}, Config.eventPath);

    this.setState({ step: StateEnum.THANKS });
  }

  onPushAgree(){
    Api.call({eventType: "push_agree", eventSubType: this.props.experimentName}, Config.eventPath);

    this.setState({ step: StateEnum.THANKS });
  }

  adFinished(){
    Api.call({eventType: "experiment_start", eventSubType: this.props.experimentName}, Config.eventPath);
    this.setState({ step: StateEnum.CONSENT });
  }

  makeAppUrl(){
    return BRANCH_LINKS[this.props.experimentName] + '?referrer=' + encodeURIComponent(State.referringLink) + '&impression=' + encodeURIComponent(State.impression);
  }

  makeMopubUrl(experimentName, initialState){
    let webDestinationUrl = 'https://e.adtrtwo.com/' + '?referrer=' + State.referringLink + '&impression=' + window.mmAdData.impression + '&exp=' + experimentName;

    if (initialState){
      webDestinationUrl = webDestinationUrl + '&initial_state=' + encodeURIComponent(initialState);
    }

    return 'mopubnativebrowser://navigate?url=' + encodeURIComponent(webDestinationUrl);
  }

  openUrl(url){
    console.log("Open URL: " + url);
    if (typeof(mraid) != 'undefined') {// && (window.mmAdData.exchange == 'mopub')){
      mraid.open(url);
    } else {
      window.location.href = url;
    }
  }

  adClicked(e){
    e.preventDefault();
    const mopubWebDestinationUrl = this.makeMopubUrl(this.props.experimentName, null);
    const appUrl = this.makeAppUrl();

    const destination = this.state.destination;
    Api.call({eventType: "ad_click", eventSubType: this.props.experimentName, data: {destination: destination}}, Config.eventPath).then(() => {
      // pick one of three destinations at random
      if (destination == 'AD'){
        this.adFinished();
      } else if (destination == 'WEB'){
        this.openUrl(mopubWebDestinationUrl);
      } else if (destination == 'APP'){
        this.openUrl(appUrl);
      }
    });
  }

  engageClicked(){
    const appUrl = this.makeAppUrl();

    Api.call({eventType: "engage_click", eventSubType: this.props.experimentName, data: {destination: 'APP'}}, Config.eventPath).then(() => {
      this.openUrl(appUrl);
    });
  }

  render() {
    const header = <ExperimentHeader directLink={this.props.directLink} onNavigate={this.props.onNavigate}/>;
    let contents = null;

    if (this.state.step == StateEnum.SHOW_AD){
      contents = <img className="img-responsive" style={{width: '100%', paddingTop:'75px'}} onClick={this.adClicked.bind(this)} src={AppConfig.root()+"img/"+this.state.adImage}/>;
    } else if (this.state.step == StateEnum.CONSENT){
      contents = <InformedConsent experimentName={this.props.experimentName} consentChanged={this.onConsentChanged.bind(this)} />;
    } else if (this.state.step == StateEnum.EXPERIMENT){
      contents = <div>
        {React.cloneElement(this.props.experimentComponent, { onExperimentComplete: this.onExperimentComplete.bind(this) })}
      </div>;
    } else if (this.state.step == StateEnum.SURVEY) {
      contents = <Survey onComplete={this.onFinishSurvey.bind(this)} experimentName={this.props.experimentName} />;
    } else if (this.state.step == StateEnum.PUSH) {
      contents = <PushSignup agreeChanged={this.onPushAgree.bind(this)} path={this.props.experimentName} />;
    } else if ((this.state.step == StateEnum.THANKS) && (device.platform != "browser")){  // browser is both ad and browser
      // In app just say thanks
      contents = <Thanks onClick={this.thanksClicked.bind(this)}/>;
    } else if (this.state.step == StateEnum.THANKS){
      contents = <AppEngage engageClicked={this.engageClicked.bind(this)}/>;
    }

    return (
      <div>
        {header}
        <div className="container">
          {contents}
        </div>
        <p className="text-muted">v1.0.6</p>
      </div>
    );
  }
}

export default ExperimentContainer;
