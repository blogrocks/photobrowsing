/**
 * Created by vimer on 16/11/2016.
 */
import React from 'react';
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import './image-translate.scss';

class ImageTranslate extends React.Component {
  render() {
    return (
        <div class="image-container">
          <img src={image1} alt=""/>
          <img src={image2} alt=""/>
        </div>
    );
  }
}


export default ImageTranslate;