import React from 'react';
import PropTypes from 'prop-types';

import Api from './api';
import ImagesLoaded from 'imagesloaded';

import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');

let Camera = null;

class Experiment6 extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isSubmitting: false,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  sendResults(){
    this.setState({isSubmitting: true});

    navigator.geolocation.getCurrentPosition((position) => {
      const results = {lat: position.coords.latitude, lon: position.coords.longitude};

      Api.call({eventType: "position_results", eventSubType: 'exp6', data: results}, Config.eventPath).then(() => {
        this.setState({isSubmitting: false});
        this.props.onExperimentComplete();
      });
    },
    (error) => {
      console.log(error);
      Api.call({eventType: "position_results", eventSubType: 'exp6', data: error.message}, Config.eventPath).then(() => {
        this.setState({isSubmitting: false});
      });
    });
  }

  render() {
    let isSubmitting = this.state.isSubmitting;

    return <div>
      <h4>Share your location with us!</h4>
      <p>You can help us study how mobile devices measure location.  Please press the following button to ask your device for your current location and share that data with us. We will use this data as ground truth in comparison to less exact ways of measuring location, such as your network address.  When you press the button your device will ask you to share your location with us, please press ALLOW.  Thanks for helping! </p>
      <button className="btn btn-primary btn-lg"
        aria-pressed={isSubmitting}
        onClick={!isSubmitting ? this.sendResults.bind(this) : null}>
        {isSubmitting ? 'Submitting...' : 'Measure Location'}
      </button>
    </div>;
  }
}

export default Experiment6;
