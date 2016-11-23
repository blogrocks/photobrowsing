/**
 * Created by zhengquanbai on 16/11/23.
 */
import React from 'react';
import ImageTranslate from 'Components/ImageTranslate';
import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';

import './image_container.scss';

var images = [image1, image2, image3, image4];
class ImageTranslateContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            galleries: [
                <ImageTranslate imageSources={images} key="initial"/>
            ]
        };
    }

    createGallery() {
        let galleries = [...this.state.galleries];
        galleries.push(<ImageTranslate photoAddingAllowed key={galleries.length} />);
        this.setState({galleries});
    }
    render() {
        return (
            <div class="container">
                <a class="newgallary" onClick={() => this.createGallery()}>
                    <span>点此创建新影集</span>
                </a>
                <div class="galleryContainer">
                    {this.state.galleries}
                </div>
            </div>
        );
    }
}

export default ImageTranslateContainer;