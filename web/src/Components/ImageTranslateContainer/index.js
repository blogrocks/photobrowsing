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
var images = [];
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
        let galleries = [...this.state.galleries];
        let id = ++this.id;
        galleries.push(<ImageTranslate key={id}
                                       id={id}
                                       ref={(gallery) => {this.imageGallery=gallery;}}
                                       onDelete={(id) => this.handleCrossOut(id)} />);
        this.setState({galleries});
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

    componentDidMount() {
        new DBHelper('ImageGallery', 'gallery').then(
            (helper) => {
              this.dbHelper = helper;
            },
            (error) => {
              alert(error);
            }
        );
    }
    componentDidUpdate() {
        if (this.imageGallery && this.imageGallery.gallery) {
            this.imageGallery.gallery.scrollIntoView();

            // 只有创建 gallery 时 this.imageGallery 才有值
            this.imageGallery = null;
        }
    }
    render() {
        return (
            <div class="container">
                <button onClick={() => {
                  try {
                    this.dbHelper.addObjects([
                      {id: 102, name: 'abc'},
                      {id: 103, name: "小红"}
                    ])
                        .then(
                            (result) => { console.log(result); },
                            (error) => { console.log(error); }
                        );

                  } catch (e) {
                    alert(e);
                  }
                }}>Click</button>

                <button onClick={() => {
                  try {
                    this.dbHelper.clearObjectStore()
                        .then(
                            (result) => {console.log(result);},
                            (error) => {console.log(error)}
                        )
                  } catch (e) {
                    alert(e);
                  }
                }}>Clear</button>

                <button onClick={() => {
                    try {
                        this.dbHelper.updateOneObject({id: 122, name: '柏正权'})
                            .then(
                                (result) => {console.log(result)},
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>
                    Update
                </button>

                <button onClick={() => {
                    try {
                        this.dbHelper.updateObjects([{id: 102, name: '柏正'}, {id: 133, name: 'hello world'}])
                            .then(
                                (result) => {console.log(result)},
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>Update objects</button>

                <button onClick={() => {
                    try {
                        this.dbHelper.deleteOneObject(102)
                            .then(
                                (result) => {console.log(result)},
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>Delete One object</button>

                <button onClick={() => {
                    try {
                        this.dbHelper.deleteObjects([102, 103])
                            .then(
                                (result) => {console.log(result)},
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>Delete objects</button>

                <button onClick={() => {
                    try {
                        this.dbHelper.getOneObject(102)
                            .then(
                                (result) => {
                                    if (result) {
                                        alert(result.name);
                                    }
                                },
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>Get One Object</button>


                <button onClick={() => {
                    try {
                        this.dbHelper.getObjects([102, 103])
                            .then(
                                (result) => {
                                    if (result) {
                                        console.log(result);
                                    }
                                },
                                (error) => {console.log(error)}
                            )
                    } catch (e) {
                        alert(e);
                    }
                }}>Get All Objects</button>
                <a class="newgallary" onClick={() => this.createGallery()}>
                    <span><span id="specialFont">点此</span>创建新影集</span>
                </a>
                <div class="gallery-container">
                    {this.state.galleries}
                </div>
            </div>
        );
    }
}

export default ImageTranslateContainer;