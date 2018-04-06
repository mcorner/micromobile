import React from 'react';
import PropTypes from 'prop-types';
import Api from './api';
const Config = require('../../config.json');

const pStyle = {
  fontSize: '2.4vh',
  lineHeight: '100%',
};

const hStyle = {
  fontSize: '5.0vh',
};

export default class InformedConsent extends React.Component {
  static propTypes = {
    consentChanged: PropTypes.func.isRequired,
    experimentName: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
  }

  onPressConsent(){
    Api.call({eventType: "consent_clicked", eventSubType: this.props.experimentName}, Config.eventPath);

    this.props.consentChanged(true);
  }

  render() {
    return (
      <div>
        <div onClick={this.onPressConsent.bind(this)}>
          <h4 className="text-center" style={hStyle}>Be a Citizen Scientist!</h4>

          <p style={pStyle}>The UMass School of Information and Computer Science is conducting research in mobile technology using the sensors found in your device.  Help us out, it will take less than a minute to complete. <b>Benefits:</b> The results of this research will be used to create new, more efficient ways to collect data.  We will be able to design better systems to collect sensor information from a highly diverse set of people. <b>Risks:</b> We do not believe you will incur any serious risks by participating.  <b>Data collected: </b> We will gather information available on you device such as the orientation and acceleration, you battery status, bandwidth from your device to the internet, and the results of any questions you answer. Your participation is entirely voluntary and appreciated!</p>
          <div className="row">
            <div className="col-sm-12 text-center">
              <button type="button" className="btn btn-primary btn-lg">
                Help out!
              </button>
            </div>
          </div>
          <br/><p style={pStyle}>By clicking you are indicating that you are at least 18 years old, have read and understood this consent form and agree to participate in this research study.</p>
        </div>
        <hr/>
        <div>
          <p style={pStyle}>If you have any questions about the research and informed consent, PUT IRB INFO HERE
        </div>
      </div>
    );
  }
}
