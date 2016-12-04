/**
 * Created by zhengquanbai on 16/11/23.
s */
import React from 'react';
import ImageTranslate from 'Components/ImageTranslate';
import image1 from './images/boy1.jpg';
import image2 from './images/boy2.jpg';
import image3 from './images/boy3.jpg';
import DBHelper from '../../indexedDB';
import './image_container.scss';
var images = [image1, image2, image3];
class ImageTranslateContainer extends React.Component {
    constructor(props) {
        super(props);
        this.id = 0;
        this.state = {
            galleries: [
                <ImageTranslate allowEditting={false}
                                imageSources={images}
                                key={this.id} />
            ]
        };
    }

    createGallery() {
        DBHelper.databaseExists('ImageGallery').then(
            (exists) => {
              alert("Exists: " + exists);
            },
            (error) => {
              alert(error);
            }
        );
        // new DBHelper('ImageGallery', 'gallery').then(
        //     (helper) => {
        //       helper.getObjectCount().then(
        //           (count) => {
        //             alert(count);
        //           },
        //           (error) => {
        //             alert(error)
        //           }
        //       );
        //     },
        //     (error) => {
        //       alert(error);
        //     }
        // );
        // let galleries = [...this.state.galleries];
        // let id = ++this.id;
        // galleries.push(<ImageTranslate key={id}
        //                                id={id}
        //                                ref={(gallery) => {this.imageGallery=gallery;}}
        //                                onDelete={(id) => this.handleCrossOut(id)} />);
        // this.setState({galleries});
    }

    handleCrossOut(id) {
        let galleries = [...this.state.galleries];
        let newGalleries = galleries.filter((gallery, index) => {
            if (gallery.props.id !== id) {
                return true;
            }
        });
        this.setState({
            galleries: newGalleries
        });
    }

    componentDidUpdate() {
        if (this.imageGallery && this.imageGallery.gallery) {
            this.imageGallery.gallery.scrollIntoView();

            // 确保只有创建 gallery 时 this.imageGallery 才有值
            this.imageGallery = null;
        }
    }
    render() {
        return (
            <div class="container">
                <a class="newgallary" onClick={() => this.createGallery()}>
                    <span><span id="specialFont">点此</span>创建新影集</span>
                </a>
                <button onClick={() => {
                  new DBHelper('ImageGallery', 'gallery').then(
                      (helper) => {
                        helper.deleteDatabase("ImageGallery").then(
                            (result) => {
                              alert(result);
                            },
                            (result) => {
                              alert(result);
                            }
                        )
                      },
                      (error) => {
                        alert(error);
                      }
                  )
                }}>Click</button>
                <div class="gallery-container">
                    {this.state.galleries}
                </div>
            </div>
        );
    }
}

export default ImageTranslateContainer;