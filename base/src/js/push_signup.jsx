import React from 'react';
import PropTypes from 'prop-types';
import Push from './push';

export default class PushSignup extends React.Component {
  static propTypes = {
    agreeChanged: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
  }

  componentWillMount(){
  }

  onPressAgree(){
    Push.subscribe(this.props.path).then(()=>{this.props.agreeChanged();});
  }

  render() {
    return (
      <div>
        <p> We would love it if you could help us out again!  We will send you notifications (only occasionally!) to repeat this short experiment, Thanks!</p>

        <button type="button" className="btn btn-primary" onClick={this.onPressAgree.bind(this)}>
          I will help!
        </button>
      </div>
    );
  }
}
