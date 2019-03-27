import setRows from './setRows';

const AppStub = {
    setState: function(incomingState) {
        this.state = incomingState;
    },
    state: {
        rows: [],
    },
};

beforeEach(() => {
    // Clears the state before each test
    AppStub.setState({ rows: [] });
});

it('sets state if there is at least one row', () => {
    expect(AppStub.state.rows).toHaveLength(0);
    setRows.apply(AppStub, ['filename', [{}]]);
    expect(AppStub.state.rows.length).toBeGreaterThan(0);
});

it('adds an id property', () => {
    expect(AppStub.state.rows).toHaveLength(0);
    setRows.apply(AppStub, ['filename', [{}]]);
    expect(AppStub.state.rows.length).toBeGreaterThan(0);
});
