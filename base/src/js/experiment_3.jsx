import React from 'react';
import PropTypes from 'prop-types';

import Api from './api';
import ImagesLoaded from 'imagesloaded';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');

const bwFile = 'https://c.adtrtwo.com/4194587.png';
const bwFileSize = 4194587;
let startBwTime = null;

const imgStyle = {
  height: '0px',
  width: '0px',
};

class Experiment3 extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isSubmitting: false,
    isMeasuring: false,
    bandwidth: null,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  sendResults(){
    this.setState({isSubmitting: true});
    const syncResults = new MicroMobile.SyncResults(Config.apiHost, Config.syncResultPath);

    syncResults.addResults({bandwidth: this.state.bandwidth});

    syncResults.sync().then(()=>{
      this.props.onExperimentComplete();
    });
  }

  measureImage(){
    const p = new Promise((resolve, reject) =>{
      const imgLoad = ImagesLoaded(document.querySelector('#bwImageDiv'));
      imgLoad.on( 'done', () => {
        var loadTime = new Date().getTime() - startBwTime;
        this.setState({bandwidth: bwFileSize / loadTime * 1000 / 1024.0, isMeasuring: false});
        resolve();
      });
      imgLoad.on( 'fail', () => {
        this.setState({isMeasuring: false});
        reject();
      });
    });

    p.then(() => {console.log("BW test done");}, () => {console.log("At least one bw failed.");});
  }

  measureBw(){
    startBwTime = new Date().getTime();
    this.setState({isMeasuring: true}, this.measureImage);
  }

  render() {
    let isSubmitting = this.state.isSubmitting;

    let image = null;
    if (this.state.isMeasuring) {
      image = <img id='bw_26dac5a978_img' src={bwFile} style={imgStyle}>
      </img>;
    }

    let button = null;
    if (!this.state.bandwidth){
      button = <button className="btn btn-primary btn-lg"
        aria-pressed={this.state.isMeasuring}
        onClick={!this.state.isMeasuring ? this.measureBw.bind(this) : null}>
        {this.state.isMeasuring ? 'Measuring...' : 'Measure'}
      </button>;
    } else {
      button = <button className="btn btn-primary btn-lg"
        aria-pressed={isSubmitting}
        onClick={!isSubmitting ? this.sendResults.bind(this) : null}>
        {isSubmitting ? 'Submitting...' : 'Submit Measurement'}
      </button>;
    }

    return  <div>
      <h4>Help us collect information about mobile device bandwidth!</h4>
      <p> We are collecting information about the bandwidth your device gets.</p>

      <div id='bwImageDiv'>
        {image}
      </div>
      {this.state.bandwidth ? <p>Your bandwidth is: <b>{this.state.bandwidth.toFixed(2)}</b> kbps.</p> : <h4> Press measure!</h4>}
      {button}
    </div>;
  }
}

export default Experiment3;
