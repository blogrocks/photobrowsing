/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import Button from 'Components/Button';
import FileInput from 'Components/FileInput';
import SpaceHolder from 'Components/SpaceHolder';
import $ from 'jquery';
import './image-translate.scss';

class ImageTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.sources = !(props.imageSources && props.imageSources.length) ? [] : [...props.imageSources];
    let imageGroup = this._generateImageGroup(this.sources);
    this.state = {
      images: imageGroup,
      playing: true
    };
  }

  _generateImageGroup(sources) {
    if (!(sources && sources.length)) return [];
    let count = sources.length;
    return sources.map((src, index) => {
      let imageClass = (index != count - 1) ? 'hidden' : '';

      return <img src={src} key={src} class={imageClass} />;
    });
  }

  componentDidMount() {
      this.scheduleAnimating();
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
    let sources = this.sources;

    if (!(sources && sources.length)) return; // 无图片
    let newImageGroup = this._generateImageGroup(sources);

    this.setState({
      images: newImageGroup
    });

    let sliderHeight = $(this.slider).height();
    if (!this.minHeight || this.minHeight < sliderHeight) {
      this.minHeight = sliderHeight;
      $(this.slider).css("min-height", this.minHeight);
    }

    if (sources.length < 2) return; // 一张图片，无需切换

    let lastImageSrc = sources[sources.length - 1],
        secondToLastImageSrc = sources[sources.length - 2];
    setTimeout(() => { // 停留2s，图片观看时间
      newImageGroup.pop();
      newImageGroup.pop();
      newImageGroup.push(<img src={secondToLastImageSrc} key={secondToLastImageSrc} />);
      newImageGroup.push(<img src={lastImageSrc} key={lastImageSrc} class="hidden" />);
      this.setState({
        images: newImageGroup
      });
      sources.unshift(sources.pop());
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
        this.sources.unshift(window.URL.createObjectURL(file));
      });
    }
  };

  render() {
    let imageSelector = null, controlButton = null;
    if (this.props.photoAddingAllowed) {
      imageSelector = (
          <div>
            <FileInput onChange={(files) => {this.handleFileAdded(files)}} />
            <SpaceHolder height="2px" />
          </div>
      );
    }
    if (this.state.images.length >= 2) {
      controlButton = (
          <div class="btn-area">
            <Button onClick={this.handleButtonClick}>
              {this.state.playing ? '暂停' : '播放'}
            </Button>
          </div>
      );
    }

    return (
        <div class="image-slider" ref={(slider)=>{this.slider=slider}}>
          <div class="control-header">
            {imageSelector}
            {controlButton}
          </div>
          <div class="image-container">
            {this.state.images}
          </div>
        </div>
    );
  }
}

ImageTranslate.defaultProps = {
  photoAddingAllowed: false
};

export default ImageTranslate;