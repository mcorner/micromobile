import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

import Api from './api';
import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');
import AppConfig from './app_config';

const FIELDS = ['gender', 'age', 'race', 'education', 'salary'];
const QUESTIONS = {};
const OPTIONS = {};

QUESTIONS.gender = 'What is your gender?';
OPTIONS.gender = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary/Third Gender' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say'},
];

QUESTIONS.age = 'What is your age?';
OPTIONS.age = [
  { value: '<18', label: 'Under 18 years' },
  { value: '18-24', label: '18 to 24 years' },
  { value: '25-34', label: '25 to 34 years' },
  { value: '35-44', label: '35 to 44 years' },
  { value: '45-54', label: '45 to 54 years' },
  { value: '55-64', label: '55 to 64 years' },
  { value: '>64', label: 'Age 65 or older' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say'},
];

QUESTIONS.race = 'What is your race? For purposes of this question, persons of Spanish/Hispanic/Latino origin may be of any race.';
OPTIONS.race = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black or African American' },
  { value: 'american-indian', label: 'American Indian and Alaska Native' },
  { value: 'asian', label: 'Asian' },
  { value: 'pacific-islander', label: 'Native Hawaiian and Other Pacific Islander' },
  { value: 'other', label: 'Other race' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say'},
];

QUESTIONS.education = 'What is the highest degree or level of education you have completed?';
OPTIONS.education = [
  { value: 'nohighschooldiploma', label: 'No High School diploma' },
  { value: 'hs', label: 'High school graduate or equivalent (for example: GED)' },
  { value: 'college', label: 'Associate or Bachelor\'s degree' },
  { value: 'post-college', label: 'Master\'s, Doctorate, etc.' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say'},
];

QUESTIONS.salary = 'What was your total household income before taxes during the past 12 months?';
OPTIONS.salary = [
  { value: '<25', label: 'Less than $25,000' },
  { value: '25-35', label: '$25,000 to $34,999' },
  { value: '35-50', label: '$35,000 to $49,999' },
  { value: '50-75', label: '$50,000 to $74,999' },
  { value: '75-100', label: '$75,000 to $99,999' },
  { value: '100-150', label: '$100,000 to $149,999' },
  { value: '>150', label: '$50,000 to $74,999' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say'},
];

class Survey extends React.Component {
  state = {
    isSubmitting: false,
    answers: {},
  };

  static propTypes = {
    onComplete: PropTypes.func,
    experimentName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
  }

  checkDone(){
    const answers = this.state.answers;

    for (let i in FIELDS){
      let f = FIELDS[i];
      if (answers[f] == null){
        return false;
      }
    }
    return true;
  }

  sendResults(){
    console.log("send");
    this.setState({isSubmitting: true});
    Api.call({eventType: "survey_results", eventSubType: this.props.experimentName, data: this.state.answers}, Config.eventPath).then(() => {
      this.setState({isSubmitting: false});
      this.props.onComplete();
    });
  }

  componentWillMount(){
  }

  onSelectChanged(field, select) {
    const answers = this.state.answers;
    if (select){
      answers[field] = select.value;
    } else {
      answers[field] = null;
    }
    this.setState({answers:answers});
  }

  render() {
    let preventSubmit = (this.state.isSubmitting || !this.checkDone());

    let submitButtonText = null;
    if (this.state.isSubmitting){
      submitButtonText = 'Submitting...';
    } else if (!this.checkDone()){
      submitButtonText = 'Survey Not Finished';
    } else {
      submitButtonText = 'Submit';
    }

    let surveySelects = FIELDS.map((f,i) => {
      return (
        <div className="form-group" key={f}>
          <label htmlFor={f}>{QUESTIONS[f]}</label>
          <Select
            name={f}
            value={this.state.answers[f]}
            options={OPTIONS[f]}
            searchable={false}
            onChange={this.onSelectChanged.bind(this,f)}
            />
        </div>
      );}
    );

    return <div>
      <form>
        {surveySelects}
      </form>

      <button className="btn btn-primary btn-lg"
        aria-pressed={preventSubmit}
        onClick={!preventSubmit ? this.sendResults.bind(this) : null}>
        {submitButtonText}
      </button>
    </div>;
  }
}

export default Survey;
