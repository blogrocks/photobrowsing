/**
 * Created by zhengquanbai on 16/11/23.
 */
import React from 'react';
import ImageTranslate from 'Components/ImageTranslate';
import image1 from './images/boy1.jpg';
import image2 from './images/boy2.jpg';
import image3 from './images/boy3.jpg';
import image4 from './images/boy4.jpg';

import './image_container.scss';

var images = [image1, image2, image3];
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

    calcRows(galleries) {
        let rows = [];

        for(let i = 0; i < galleries.length; i += 2) {
            if ((i + 1) < galleries.length) {
                rows.push(
                    <div class="galleryContainer" key={i}>
                        {galleries[i]}
                        {galleries[i+1]}
                    </div>
                );
            } else {
                rows.push(
                    <div class="galleryContainer" key={i}>
                        {galleries[i]}
                    </div>
                );
            }
        }
        return rows;
    }
    render() {
        return (
            <div class="container">
                <a class="newgallary" onClick={() => this.createGallery()}>
                    <span><span id="specialFont">点此</span>创建新影集</span>
                </a>
                {this.calcRows(this.state.galleries)}
            </div>
        );
    }
}

export default ImageTranslateContainer;