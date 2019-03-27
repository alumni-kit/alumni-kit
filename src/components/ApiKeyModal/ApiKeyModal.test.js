import React from 'react';
import ReactDOM from 'react-dom';
import ApiKeyModal from './ApiKeyModal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ApiKeyModal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
