import React from 'react';
import PropTypes from 'prop-types';

import Api from './api';
import ImagesLoaded from 'imagesloaded';

import MicroMobile from 'micromobile-lib';
const Config = require('../../config.json');

const images = [
  'https://i.ytimg.com/i/-9-kyTW8ZkZNDHQJ6FgpwQ/1.jpg',
  'https://www.icann.org/assets/icann_logo-2b08a348dacd091333bdba6d5c589675.png',
  'https://abs.twimg.com/a/1470716385/img/t1/spinner-rosetta-blue-26x26.gif',
  'https://scontent.xx.fbcdn.net/t39.2365-6/851558_160351450817973_1678868765_n.png',
  'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  'https://www.baidu.com/img/bd_logo1.png',
  'https://imgcache.qq.com/ac/www_tencent/zh-cn/images/sitelogo_zh-cn.gif',
  'https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  'https://img.t.sinajs.cn/t6/style/images/global_nav/WB_logo-x2.png?id=1404211047727',
  'http://static2.varzesh3.com/v3/static/img/varzesh3-logo.png',
  'https://template.digikala.com/digikala/Image/Public/vtwo/digikala-logo-slogan.png',
  'https://blogfa.com/static/images/blogfa-logo.gif',
  'https://www.google.com.vn/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  'http://stc.v3.news.zing.vn/css/img/logo_zing_trithuc.png',
  'https://www.google.com.sa/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  'https://img1cdn.haraj.com.sa/static/images5/haraj-logo.png',
  'https://img.alicdn.com/tps/i1/TB1qC0rIVXXXXbjaXXXH0F6FVXX-150-62.png',
];

const imgStyle = {
  height: '0px',
};

let startBwTime = null;

class Experiment4 extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isSubmitting: false,
    isMeasuring: false,
    imageUrl: null,
    loadTime: null,
  };

  static propTypes = {
    onExperimentComplete: PropTypes.func,
  };

  sendResults(){
    this.setState({isSubmitting: true});
    const syncResults = new MicroMobile.SyncResults(Config.apiHost, Config.syncResultPath);

    syncResults.addResults({imageUrl: this.state.imageUrl, loadTime: this.state.loadTime});

    syncResults.sync().then(()=>{
      this.props.onExperimentComplete();
    });
  }

  measureImage(){
    const p = new Promise((resolve, reject) =>{
      const imgLoad = ImagesLoaded(document.querySelector('#bwImageDiv'), {timeout: 8000});
      imgLoad.on( 'done', () => {
        var loadTime = new Date().getTime() - startBwTime;
        this.setState({loadTime: loadTime, isMeasuring: false});
        this.sendResults();
        resolve();
      });
      imgLoad.on( 'fail', () => {
        this.setState({loadTime: 'failed', isMeasuring: false});
        this.sendResults();
        reject();
      });
    });

    p.then(() => {console.log("Image load test done");}, () => {console.log("At least one image  failed.");});
  }

  loadImage(){
    startBwTime = new Date().getTime();
    const url = images[Math.floor(Math.random()*images.length)];

    this.setState({isMeasuring: true, imageUrl: url}, this.measureImage);
  }

  render() {
    let isSubmitting = this.state.isSubmitting;

    let image = null;
    if (this.state.imageUrl) {
      image = <img id='bw_26dac5a978_img' src={this.state.imageUrl} style={imgStyle}>
      </img>;
    }

    let button = null;
    if (!this.state.loadTime){
      button = <button className="btn btn-primary btn-lg"
        aria-pressed={this.state.isMeasuring}
        onClick={!this.state.isMeasuring ? this.loadImage.bind(this) : null}>
        {this.state.isMeasuring ? 'Measuring...' : 'Measure'}
      </button>;
    }

    return <div>
      <h4>Help us collect information about how your network works!</h4>
      <p>This experiment will load a simple logo from a major company, such as Google, Facebook, or Baidu to see if your network allows images from those sites.</p>
      <div id='bwImageDiv'>
        {image}
      </div>
      {this.state.loadTime ? null : <h4> Press measure to load the image!</h4>}
      {button}
    </div>;
  }
}

export default Experiment4;
