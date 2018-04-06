import React from 'react';
import PropTypes from 'prop-types';

export default class AppEngage extends React.Component {
  static propTypes = {
    engageClicked: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  onPress(e){
    this.props.engageClicked();
  }

  render() {
    return (
      <div onClick={this.onPress.bind(this)}>
        <h3 className="panel-title">Thanks!</h3>
        <p>Just one more thing!  We would really appreciate it if you could repeat this same experiment using a mobile app.  Just click the link below and it will take you to the App Store, install the app, open it, and we will guide you through the same steps.</p>

        <div className="row">
          <div className="col-sm-12 text-center">
            <button type="button" className="btn btn-primary btn-lg">
              Help out!
            </button>
          </div>
        </div>
      </div>
    );
  }
}
