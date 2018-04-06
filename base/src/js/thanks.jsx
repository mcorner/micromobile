import React from 'react';
import PropTypes from 'prop-types';

export default class Thanks extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3 className="panel-title">Thanks!</h3>
        <p>Thanks for participating in our study.</p>
      </div>
    );
  }
}
