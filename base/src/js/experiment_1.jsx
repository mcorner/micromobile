import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

import Api from './api';
import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');
import AppConfig from './app_config';

const SENSOR_BUFFER_SIZE = 1000;

const getKeyCode = function (str) {
  return str.charCodeAt(str.length - 1);
};

var options = [
  { value: 'commuting', label: 'Commuting' },
  { value: 'working', label: 'Working' },
  { value: 'studying', label: 'Studying' },
  { value: 'hanging_out', label: 'Hanging Out' },
  { value: 'watching_tv', label: 'Watching TV' },
  { value: 'other', label: 'Other' },
];

class Experiment1 extends React.Component {
  state = {
    onExperimentComplete: PropTypes.func.isRequired,
    syncResults: new MicroMobile.SyncResults(Config.apiHost, Config.syncResultPath),
    acc: new MicroMobile.BufferedSensor(navigator.accelerometer.watchAcceleration, SENSOR_BUFFER_SIZE, {frequency: 10}),
    gyro: new MicroMobile.BufferedSensor(navigator.gyroscope.watch, SENSOR_BUFFER_SIZE, {frequency: 10}),
    isSubmitting: false,
    resultsLeft: 0,
    keysPressed: 0,
    selectValue: null,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  checkDone(){
    return (this.state.selectValue && (this.state.keysPressed > 7));
  }

  sendResults(){
    console.log("send");
    this.setState({isSubmitting: true});
    this.state.syncResults.sync().then(()=>{
      this.props.onExperimentComplete();
    });
  }

  componentWillMount(){
    this.currentEvents = [];
  }

  handleKeyDown(event){
    console.log("keydown");
    const currentEvent = new MicroMobile.SensorEvent(
      {},
      [
        {
          sensor: this.state.acc,
          name: "accelerometer",
          type: MicroMobile.SENSOR_TYPES.SENSOR_CONTINUOUS,
          buffer: 10
        },
        {
          sensor: this.state.gyro,
          name: "gyro",
          type: MicroMobile.SENSOR_TYPES.SENSOR_CONTINUOUS,
          buffer: 10
        }
      ]
    );
    currentEvent.start();
    this.currentEvents.push(currentEvent);
  }

  syncedResults(numLeft){
    console.log("callback syncedResults: " + numLeft);
    this.setState({resultsLeft: numLeft});
  }

  handleKeyUp(event){
    const currentEvent = this.currentEvents[0];
    let kCd = event.keyCode || event.which;
    if (kCd == 0 || kCd == 229) { //for android chrome keycode fix
      kCd = String.fromCharCode(getKeyCode(event.target.value));
    }
    currentEvent.eventData.key = kCd;
    currentEvent.eventData.text = event.target.value;
    this.currentEvents.shift();
    console.log("Key up " + kCd);
    currentEvent.end().then(() => {
      console.log("End " + kCd);
      this.state.syncResults.addResults(currentEvent.eventData);
      this.setState({resultsLeft: this.state.syncResults.count(), keysPressed: (1 + this.state.keysPressed)});
      console.log("count syncedResults: " + this.state.syncResults.count());

      this.state.syncResults.sync(this.syncedResults.bind(this));
    });
  }

  onSelectChanged(element) {
    this.setState({selectValue: element});
  }

  render() {
    let preventSubmit = (this.state.isSubmitting || !this.checkDone());
    let submitButtonText = null;
    if (this.state.isSubmitting){
      submitButtonText = 'Submitting...';
    } else if (!this.checkDone()){
      submitButtonText = 'Task Not Finished';
    } else {
      submitButtonText = 'Submit';
    }

    return <div>
      <form>
        <div className="form-group">
          <label htmlFor="activityType">Which of these best describes your current activity?</label>
          <Select
            name="activityType"
            value={this.state.selectValue}
            options={options}
            searchable={false}
            onChange={this.onSelectChanged.bind(this)}
            />
        </div>
        <div className="form-group">
          <label htmlFor="texttest1">Type the phrase <b>the quick brown fox</b> in this box:</label>
          <input type="text" className="form-control" id="texttest1" placeholder="Type here.." autoComplete="off" onKeyUp={this.handleKeyUp.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
        </div>
      </form>

      <button className="btn btn-primary btn-lg"
        aria-pressed={preventSubmit}
        onClick={!preventSubmit ? this.sendResults.bind(this) : null}>
        {submitButtonText}
        {(this.state.resultsLeft > 0) ? "(" + this.state.resultsLeft + " left to sync)": ""}
      </button>
    </div>;
  }
}

export default Experiment1;
