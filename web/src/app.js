import React from 'react';
import {render} from 'react-dom';
import Game from 'Components/Game';
import ImageTranslate from 'Components/ImageTranslate';

import 'include_in_entry';

render(<ImageTranslate />, document.getElementById('anchor'));

