import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmModal from './ConfirmModal';

const AppStub = {
  state: {
    rows: [],
  },
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConfirmModal App={AppStub} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
