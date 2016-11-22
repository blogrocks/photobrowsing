/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import Button from 'Components/Button';
import FileInput from 'Components/FileInput';
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';
import image5 from './images/hboy3.jpg';
import image6 from './images/hboy4.jpg';
import './image-translate.scss';

let images = [];

class ImageTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      playing: true
    };
  }

  _generateImageGroup() {
    let imageNumber = images.length;
    return images.map((image, index) => {
      let imageClass = (index != imageNumber - 1) ? 'hidden' : '';

      return <img src={image} key={image} class={imageClass} />;
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({     // 将 setState 放在 setTimeout 里，确保其同步性。
        data: this._generateImageGroup()
      });
      this.scheduleAnimating();
    }, 0);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  scheduleAnimating(interval = 4000) {
    if (interval < 4000) interval = 4000;
    this._switchPhoto();
    this.timer = setInterval(() => {
      this._switchPhoto();
    }, interval);
  }

  _switchPhoto() {
    if (!(images && images.length)) return;
    let newImageGroup = this._generateImageGroup(),
        lastImage = images[images.length - 1],
        secondToLastImage = images[images.length - 2];

    this.setState({
      data: newImageGroup
    });
    setTimeout(() => { // 停留2s，图片观看时间
      newImageGroup.pop();
      newImageGroup.pop();
      newImageGroup.push(<img src={secondToLastImage} key={secondToLastImage} />);
      newImageGroup.push(<img src={lastImage} key={lastImage} class="hidden" />);
      this.setState({
        data: newImageGroup
      });
      images.unshift(images.pop());
    }, 2000);
  }

  handleButtonClick = (e) => {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.scheduleAnimating();
    }

    this.setState({playing: !this.state.playing});
  };

  handleFileAdded = (files) => {
    if (files) {
      files.forEach((file) => {
        images.unshift(window.URL.createObjectURL(file));
      });
    }
  };

  render() {
    return (
        <div class="image-slider">
          <div class="btn-area">
            <Button onClick={this.handleButtonClick}>
              {this.state.playing ? '暂停' : '播放'}
            </Button>
          </div>
          <FileInput onChange={(files) => {this.handleFileAdded(files)}} />
          <div class="image-container">
            {this.state.data}
          </div>
        </div>
    );
  }
}


export default ImageTranslate;