import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'typeface-roboto';

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

ReactDOM.render(<App />, document.getElementById('root'));
