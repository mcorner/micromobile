import React from 'react';
import PropTypes from 'prop-types';

import AppConfig from './app_config';

export default class ExperimentHeader extends React.Component {
  state = {
    showClose: false,
  };

  static propTypes = {
    directLink: PropTypes.bool.isRequired,
    onNavigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  goHome(){
    this.props.onNavigate("/");
  }

  mraidClose(){
    mraid.close();
  }

  componentDidMount(){
    setTimeout(()=>{this.setState({showClose: true});}, 5000);
  }

  render() {
    let backButton = null;
    if (!this.props.directLink){
      backButton =
        <button type="button" className="btn btn-default navbar-btn" onClick={this.goHome.bind(this)}>
          Home
        </button>;
    }

    let closeButton = null;
    if (this.state.showClose){
      closeButton = <button type="button" className="close pull-right" aria-label="Close" onClick={this.mraidClose.bind(this)}>
                  <span aria-hidden="true">&times;</span>
                </button>;
    }

    let contents = null;
    if ((typeof(mraid) != 'undefined')){
      contents = <div className="row">
        <div className="col-xs-2">
        </div>
        <div className="col-xs-8">
          <img className="img-responsive center-block" style={{height: '50px', paddingTop: '15px', paddingBottom: '10px'}} src={AppConfig.root()+"img/umass.png"}/>
        </div>
        <div className="col-xs-2">
          {closeButton}
        </div>
      </div>;
    } else {
      contents = <div className="row">
      <div className="col-xs-3">
        {backButton}
      </div>
      <div className="col-xs-9">
        <img className="img-responsive pull-right" style={{height: '50px', paddingTop: '15px', paddingBottom: '10px'}} src={AppConfig.root()+"img/umass.png"}/>
      </div>
    </div>;
    }

    return (
      <div className="container">
        {contents}
      </div>
    );
  }
}
