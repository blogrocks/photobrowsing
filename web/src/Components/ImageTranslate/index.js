/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
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
      data: []
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({     // 将 setState 放在 setTimeout 里，确保其同步性。
        data: this._generateImageGroup()
      });
      setInterval(() => {
        let newImageGroup = this._generateImageGroup(),
            lastImage = images[images.length - 1];

        this.setState({
          data: newImageGroup
        });
        setTimeout(() => {
          newImageGroup.pop();
          newImageGroup.push(<img src={lastImage} key={lastImage} class="goAway" />);
          this.setState({
            data: newImageGroup
          });
          images.unshift(images.pop());
        }, 100);

      }, 2500);
    }, 0);
  }

  _generateImageGroup() {
    return images.map((image, index) => {
      return <img src={image} key={image} />;
    });
  }

  render() {
    return (
        <div class="image-container">
          {this.state.data}
        </div>
    );
  }
}


export default ImageTranslate;