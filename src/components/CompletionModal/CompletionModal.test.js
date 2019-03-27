import React from 'react';
import ReactDOM from 'react-dom';
import CompletionModal from './CompletionModal';

const AppStub = {
  state: {
    rows: [],
  },
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CompletionModal App={AppStub}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
