import React from 'react';
import PropTypes from 'prop-types';

import ExperimentHeader from './experiment_header.jsx';

const experiments = [
  {"path": "/exp1", "name": "Typing Accelerometer", "description": "Help us examine the relationship between typing and the effect on your device's accelerometer and gyrometer."},
  {"path": "/exp2", "name": "Battery Experiment", "description": "Help us study battery management in mobile devices!"},
  {"path": "/exp3", "name": "Bandwidth Experiment", "description": "Help us measure bandwidth from mobile devices!"},
  {"path": "/exp4", "name": "Blocked Images", "description": "Help us measure what images might be blocked by your network."},
  {"path": "/exp5", "name": "Environment Photos", "description": "Photos of your environment."},
  {"path": "/exp6", "name": "Device Location", "description": "Help us study device location."}
];

class Home extends React.Component {
  state = {
    redirectTo: null,
  };

  constructor(props) {
    super(props);
  }

  static propTypes = {
    onNavigate: PropTypes.func.isRequired,
  };

  clickedExperiment(e){
    this.props.onNavigate(e.path);
  }

  componentDidMount(){
  }

  render() {
    let expPanels = experiments.map((e,i) => {
      return (
        <div className="panel panel-default" key={i} onClick={this.clickedExperiment.bind(this,e)}>
          <div className="panel-heading">
            <h2 style={{fontSize: '16pt'}} className="panel-title">{e.name}</h2>
          </div>
          <div className="panel-body">
            <p style={{fontSize: '12pt'}}>{e.description}</p>
          </div>
        </div>
      );}
    );

    return (
      <div>
        <ExperimentHeader directLink={true} onNavigate={this.props.onNavigate}/>
        <br/>
        <div className="container">
          {expPanels}
        </div>
      </div>
    );
  }
}

export default Home;
