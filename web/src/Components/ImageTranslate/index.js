/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import Button from 'Components/Button';
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';
import './image-translate.scss';

let images = [image1, image2, image3, image4];

class ImageTranslate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      playing: true
    };
  }

  _generateImageGroup() {
    return images.map((image, index) => {
      return <img src={image} key={image} />;
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({     // 将 setState 放在 setTimeout 里，确保其同步性。
        data: this._generateImageGroup()
      });
      this.startSliding();
    }, 0);
  }

  startSliding(interval = 2500) {
    this.timer =
        setInterval(() => {
          let newImageGroup = this._generateImageGroup(),
              lastImage = images[images.length - 1];

          this.setState({
            data: newImageGroup
          });
          setTimeout(() => { // 稍等片刻，确保 dom 更新完成。
            newImageGroup.pop();
            newImageGroup.push(<img src={lastImage} key={lastImage} class="goAway" />);
            this.setState({
              data: newImageGroup
            });
            images.unshift(images.pop());
          }, 100);

        }, interval);
  }

  handleButtonClick = () => {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    } else {
      this.startSliding();
    }

    this.setState({playing: !this.state.playing});
  };

  render() {
    return (
        <div class="image-slider">
          <div class="image-container">
            {this.state.data}
          </div>
          <div class="btn-area">
            <Button onClick={this.handleButtonClick}>
              {this.state.playing ? '暂停' : '播放'}
            </Button>
          </div>
          <input type="file" multiple="multiple" style={{padding: '10px'}}/>
        </div>
    );
  }
}


export default ImageTranslate;