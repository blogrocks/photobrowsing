import React from 'react';
import {render} from 'react-dom';
import ImageTranslateContainer from 'Components/ImageTranslateContainer';

import 'include_in_entry';
import DB from './indexedDB';

render(<ImageTranslateContainer />, document.getElementById('anchor'));
