
/**
 * Created by zhengquanbai on 16/10/27.
 */

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