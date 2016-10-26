import React from 'react';
import {render} from 'react-dom';
import Game from 'Components/Game';

import '../resources/css/styles';

if (process.env.NODE_ENV !== 'production') {
    require('../resources/index.html');

    const cssFileName = 'builds/stylesheets/styles.css';
    const originalCallback = window.webpackHotUpdate;

    window.webpackHotUpdate = function (...args) {
        const links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
            const link = links[i];
            if (link.href.search(cssFileName) !== -1) {
                let linkHref = link.href;
                // link.href = 'about:blank';
                link.href = linkHref;
                originalCallback(...args);
                return;
            }
        }
    }
}

render(<Game />, document.getElementById('anchor'));

