/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import Button from 'Components/Button';
import FileInput from 'Components/FileInput';
import SpaceHolder from 'Components/SpaceHolder';
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

    if (!(sources && sources.length)) return;
    let newImageGroup = this._generateImageGroup(sources),
        lastImageSrc = sources[sources.length - 1],
        secondToLastImageSrc = sources[sources.length - 2];

    this.setState({
      images: newImageGroup
    });
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
    return (
        <div class="image-slider">
          {
              this.props.photoAddingAllowed ?
                  <FileInput onChange={(files) => {this.handleFileAdded(files)}} /> : null
          }
          <SpaceHolder height="2px"/>
          <div class="btn-area">
            <Button onClick={this.handleButtonClick}>
              {this.state.playing ? '暂停' : '播放'}
            </Button>
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