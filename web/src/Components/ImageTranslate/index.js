/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import Button from 'Components/Button';
import FileInput from 'Components/FileInput';
import SpaceHolder from 'Components/SpaceHolder';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import $ from 'jquery';
import './image-translate.scss';

class ImageTranslate extends React.Component {
  constructor(props) {
    super(props);

    // PropTypes定义了sources为数组，缺省值为 []
    this.sources = props.imageSources;

    // 生成 img 对象数组
    this.imageGroup = this._generateImageGroup(this.sources);

    this.state = {
      // 显示最后一张图片
      image: this.imageGroup[this.imageGroup.length - 1],
      playing: true
    };
  }

  _generateImageGroup(sources) {
    // 确保sources是有值数组
    if (!(sources && sources.length)) return [];
    return sources.map((src, index) => {
      return <img src={src} key={src} />;
    });
  }

  componentDidMount() {
      this.scheduleAnimating(); // 开始图片切换动画
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  scheduleAnimating(interval = 4000) {
    // 图片切换的时间间隔不小于4s(图片观看时间 + 图片切换动画时间)
    if (interval < 4000) interval = 4000;

    let aboutToSwitch = () => {
      setTimeout(() => {
        this._switchPhoto();
      }, 2000); // 停留 2s，图片观看时间，然后切换图片
    }

    aboutToSwitch();

    this.timer = setInterval(() => {
      aboutToSwitch();
    }, interval);
  }

  _switchPhoto() {
    // 当前最新的图片组
    let imageGroup = this.imageGroup;

    // 无图片或一张图片
    if (!(imageGroup
          && imageGroup.length
          && imageGroup.length >= 2)) {
      clearInterval(this.timer);
      this.timer = null;
      return;
    }

    // 设置 gallery 最小高度
    this.setGalleryMinHeight();

    // 最后一张移到第一张
    imageGroup.unshift(imageGroup.pop());

    this.setState({
      image: imageGroup[imageGroup.length - 1]
    });
  }

  /**
   * 该函数确保 gallery 的最小高度不小于位置处于最下面的图片的高度，
   * 通过改变图片在数组中的位置，并不断调用该函数，可以使得 gallery
   * 的高度为所有图片高度的最大值。
   */
  setGalleryMinHeight() {
    let sliderHeight = $(this.gallery).height();

    if (!this.minHeight || this.minHeight < sliderHeight) { // 当我们发现某张图片的高度比当前 gallery 的最小高度大时
      this.minHeight = sliderHeight;                        // 保存此时的最小高度
      $(this.gallery).css("min-height", this.minHeight);    // 更新 gallery 的最小高度
    }
  }

  /**
   * 切换播放/暂停
   */
  handleButtonClick = (e) => {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.scheduleAnimating();
    }

    this.setState({playing: !this.state.playing});
  };

  /**
   * 添加图片的回调函数
   */
  handleFileAdded = (files) => {
    if (files) {
      files.forEach((file) => {
        let src = window.URL.createObjectURL(file);
        let image = <img src={src} key={src} />;
        this.imageGroup.unshift(image);
      });

      if (!this.timer) {
        this.setState({
          image: this.imageGroup[this.imageGroup.length - 1]
        });
        this.scheduleAnimating();
      }
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

    // 只有一张图片时不播放，无需控制按钮
    if (this.imageGroup.length >= 2) {
      controlButton = (
          <div class="btn-area">
            <Button onClick={this.handleButtonClick}>
              {this.state.playing ? '暂停' : '播放'}
            </Button>
          </div>
      );
    }

    return (
        <div class="gallery" ref={(gallery)=>{this.gallery = gallery}}>
          <div class="control-section">
            {imageSelector}
            {controlButton}
          </div>
          <div class="image-container">
            <ReactCSSTransitionGroup
              transitionName="photo"
              transitionEnterTimeout={2000}
              transitionLeaveTimeout={2000}>
              {this.state.image}
            </ReactCSSTransitionGroup>
          </div>
        </div>
    );
  }
}

ImageTranslate.propTypes = {
  photoAddingAllowed: React.PropTypes.bool,
  imageSources: React.PropTypes.array
};

ImageTranslate.defaultProps = {
  photoAddingAllowed: true,
  imageSources: []
};

export default ImageTranslate;