import React from 'react';
import PropTypes from 'prop-types';

import Api from './api';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');

class Experiment2 extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isSubmitting: false,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  componentWillMount(){
    window.addEventListener("batterystatus", this.onBatteryStatus.bind(this), false);
  }

  onBatteryStatus(status) {
    this.setState({batteryLevel: status.level, isPlugged: status.isPlugged});
  }

  sendResults(){
    this.setState({isSubmitting: true});
    const syncResults = new MicroMobile.SyncResults(Config.apiHost, Config.syncResultPath);

    syncResults.addResults({batteryLevel: this.state.batteryLevel, isPlugged: this.state.isPlugged});

    syncResults.sync().then(()=>{
      this.setState({isSubmitting: false});
      this.props.onExperimentComplete();
    });
  }

  render() {
    let isSubmitting= this.state.isSubmitting;

    return <div>
      <h4>Help us collect information about mobile device batteries!</h4>
      <p> We are collecting information about how people use and charge the batteries in mobile devices.  Please press the submit button below to send us the following information about your device.</p>

      <p>Your battery is currently at: <b>{this.state.batteryLevel}% and  is {!this.state.isPlugged ? "not" : ""} plugged in.</b></p>

      <button className="btn btn-primary btn-lg"
        aria-pressed={isSubmitting}
        onClick={!isSubmitting ? this.sendResults.bind(this) : null}>
        {isSubmitting ? 'Submitting...' : 'Submit Measurement'}
      </button>
    </div>;
  }
}

export default Experiment2;
