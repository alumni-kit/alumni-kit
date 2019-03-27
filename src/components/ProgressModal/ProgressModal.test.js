import React from 'react';
import ReactDOM from 'react-dom';
import ProgressModal from './ProgressModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProgressModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
