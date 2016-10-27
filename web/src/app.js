import React from 'react';
import {render} from 'react-dom';
import Game from 'Components/Game';

import '../resources/css/styles';
import 'include_in_entry';

render(<Game />, document.getElementById('anchor'));

