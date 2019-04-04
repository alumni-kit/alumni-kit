import React from 'react';
import ReactDOM from 'react-dom';
import EarlyExitModal from './EarlyExitModal';

const AppStub = {
  state: {
    rows: [],
  },
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EarlyExitModal App={AppStub}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
