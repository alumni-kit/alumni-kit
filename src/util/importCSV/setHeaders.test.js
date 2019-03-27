import setHeaders from './setHeaders';

const AppStub = {
    setState: function(incomingState) {
        this.state = incomingState;
    },
    state: {
      columns: [],
    },
};

beforeEach(() => {
    // Clears the state before each test
    AppStub.setState({ columns: [] });
});

it('sets state regardless of input', () => {
    expect(AppStub.state.columns).toHaveLength(0);
    setHeaders.apply(AppStub, []);
    expect(AppStub.state.columns.length).toBeGreaterThan(0);
});

it('adds an id and status column after importing', () => {
  setHeaders.apply(AppStub, [['First Name', 'Last Name']]);
  const { columns } = AppStub.state;
  expect(columns.filter(column => column.name === "id")).toHaveLength(1);
  expect(columns.filter(column => column.name === "Status")).toHaveLength(1);
});

it('adds the required fields if they are missing', () => {
    const requiredFields = ["Status", "id", "First Name", "Last Name", "Email1", "Email2", "Phone1", "Phone2", "Mailing Address", "Education", "Job"];

    setHeaders.apply(AppStub, [[]]);
    const { columns } = AppStub.state;

    requiredFields.forEach((requiredField) => {
        expect(columns.filter(column => column.name === requiredField)).toHaveLength(1);
    });
});

it('adds necessary column meta data to every column', () => {
    setHeaders.apply(AppStub, [[]]);
    const { columns } = AppStub.state;

    columns.forEach((column) => {
        expect(column).toHaveProperty('editable', false);
        expect(column).toHaveProperty('key');
        expect(column).toHaveProperty('name');
    });
});

it('formats the status column', () => {
    setHeaders.apply(AppStub, [[]]);
    const { columns } = AppStub.state;

    const statusColumn = columns.filter(column => column.name === "Status")[0];
    expect(statusColumn).toHaveProperty('formatter');
    expect(typeof statusColumn.formatter).toBe('function');
});

