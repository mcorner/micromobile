import React from 'react';
import PropTypes from 'prop-types';

import Api from './api';
import ImagesLoaded from 'imagesloaded';

import Select from 'react-select';
import 'react-select/dist/react-select.min.css';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');

var options = [
  { value: 'commuting', label: 'Commuting' },
  { value: 'working', label: 'Working' },
  { value: 'studying', label: 'Studying' },
  { value: 'hanging_out', label: 'Hanging Out' },
  { value: 'watching_tv', label: 'Watching TV' },
  { value: 'other', label: 'Other' },
];

let Camera = null;

class Experiment5 extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isSubmitting: false,
    imageData: null,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  componentWillMount(){
    Camera = navigator.camera;
  }

  componentWillUnmount(){
    this.removeCapture();
  }

  removeCapture(){
    // camera plugin adds stuff to DOM...soo...bad...
    var elems = document.getElementsByClassName("cordova-camera-capture");
    for(let i=0; i<elems.length; i++){
      elems[i].remove();
    }
  }

  sendResults(){
    this.setState({isSubmitting: true});
    const syncResults = new MicroMobile.SyncResults(Config.apiHost, Config.syncResultPath);
    syncResults.addResults({activityResponse: this.state.activityResponse.value, imageData: this.state.imageData});

    syncResults.sync().then(()=>{
      this.props.onExperimentComplete();
    });
  }

  inputImage(e){
    const fileList = e.target.files;

    let file = null;

    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].type.match(/^image\//)) {
        file = fileList[i];
        break;
      }
    }

    if (file !== null) {
      this.setState({imageData: URL.createObjectURL(file)});
    }
  }

  getPicture(){
    this.removeCapture();

    navigator.camera.getPicture(this.onCameraSuccess.bind(this), this.onCameraFail.bind(this), {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: false,
      targetWidth: 240,
      targetHeight: 320,
      correctOrientation: true  //Corrects Android orientation quirks
    });
  }

  onCameraSuccess(imageData) {
    this.setState({imageData: "data:image/jpeg;base64," + imageData});
    console.log("camera success");
  }

  onCameraFail(message) {
    alert('Failed because: ' + message);
  }

  onSelectChanged(element) {
    this.setState({activityResponse: element});
  }

  render() {
    let isSubmitting = this.state.isSubmitting;

    let captureButton = null;
    if (this.state.activityResponse){
      if (device.platform == "browser"){
        captureButton = <label className="btn btn-primary btn-lg btn-file">
        Take Photo <input type="file" accept="image/*" onChange={this.inputImage.bind(this)}/>
        </label>;
      } else {
        captureButton = <button className="btn btn-primary btn-lg" onClick={this.getPicture.bind(this)}>{"Take Photo"}</button>;
      }
    }

    let image = null;
    if (this.state.imageData){
      image = <img className="img-responsive" src={this.state.imageData}/>;
      captureButton = <button className="btn btn-primary btn-lg"
        aria-pressed={isSubmitting}
        onClick={!isSubmitting ? this.sendResults.bind(this) : null}>
        {isSubmitting ? 'Submitting...' : 'Submit Photo'}
      </button>;
    }

    let formBody = null;
    if (!this.state.activityResponse){
      formBody = <form>
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
      </form>;
    }

    return <div>
      <h4>Take a photo of your environment!</h4>
      <p>You can help us study the environments people use their phones in by taking a quick photo.  Pick something (a desk, a TV, an outdoor shot, but nothing personal) that describes where you are.  Please, no photos of people.  Thanks!.</p>
      {formBody}
      <div className="row">
        <div className="col-xs-6">
          {captureButton}
        </div>
        <div className="col-xs-1">
        </div>
        <div className="col-xs-5">
          {image}
        </div>
      </div>
    </div>;
  }
}

export default Experiment5;
