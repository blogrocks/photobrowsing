/**
 * Created by zhengquanbai on 16/11/23.
 */
import React from 'react';
import ImageTranslate from 'Components/ImageTranslate';

import './image_container.scss';

var images = [];
class ImageTranslateContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="container">
                <ImageTranslate imageSources={images} hello="1"/>
                <ImageTranslate hello="2"/>
            </div>
        );
    }
}

export default ImageTranslateContainer;