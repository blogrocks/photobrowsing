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

    this.sources = props.imageSources; // PropTypes定义了sources为数组，缺省值为 []
    let imageGroup = this._generateImageGroup(this.sources); // 生成 img 对象数组

    this.state = {
      images: imageGroup,
      playing: true
    };
  }

  _generateImageGroup(sources) {
    if (!(sources && sources.length)) return []; // 确保sources是有值数组
    let num = sources.length;
    return sources.map((src, index) => {
      let imageClass = (index != num - 1) ? 'hidden' : ''; // 数组最后一个图片(最顶上的)显示，其他隐藏(opacity 为 0)

      return <img src={src} key={src} class={imageClass} />;
    });
  }

  componentDidMount() {
      this.scheduleAnimating(); // 开始图片切换动画
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  scheduleAnimating(interval = 4000) {
    if (interval < 4000) interval = 4000; // 图片切换的时间间隔不小于4s(图片观看时间 + 图片切换动画时间)

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
    let sources = this.sources; // 当前最新的图片源

    if (!(sources && sources.length)) return; // 无图片
    let newImageGroup = this._generateImageGroup(sources);

    this.setState({
      images: newImageGroup
    });

    this.setGalleryMinHeight(); // 设置 gallery 最小高度

    if (sources.length < 2) return; // 一张图片，无需切换

    let lastImageSrc = sources[sources.length - 1],
        secondToLastImageSrc = sources[sources.length - 2];
    newImageGroup.pop(); // 弹出最后一张
    newImageGroup.pop(); // 弹出倒数第二张
    newImageGroup.push(<img src={secondToLastImageSrc} key={secondToLastImageSrc} />); // 显示原先的倒数第二张图片
    newImageGroup.push(<img src={lastImageSrc} key={lastImageSrc} class="hidden" />);  // 隐藏原先的最后一张图片

    // 此时 setState 触发的重新渲染，将改变图片的 css 类，触发切换动画
    this.setState({
      images: newImageGroup
    });
    sources.unshift(sources.pop()); // 将底层 sources 的最后一个图片源移动为第一个。
  }

  /**
   * 该函数确保 gallery 的最小高度不小于位置处于最下面的图片的高度，
   * 通过改变图片在数组中的位置，并不断调用该函数，可以使得 gallery
   * 的高度为所有图片高度的最大值。
   */
  setGalleryMinHeight() {
    // 若未设gallery高度，其高度等于数组第一个元素的高度，因为最下面的图片定位为relative，其余为absolute
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
        // 将图片添加到源数组的开头，即作为当前最下面的图片
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
    if (this.state.images.length >= 2) { // 只有一张图片时不播放，无需控制按钮
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
            {this.state.images}
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