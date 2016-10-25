import React from 'react';
import {render} from 'react-dom';
import Game from 'Components/Game';

import '../resources/css/styles';

if (process.env.NODE_ENV !== 'production') {
    require('../resources/index.html');
}


render(<Game />, document.getElementById('anchor'));