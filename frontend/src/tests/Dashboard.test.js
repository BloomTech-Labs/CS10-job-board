import Dashboard from '../components/seeker/Dashboard';

test('Dashboard', () => {
    const component = shallow(<Dashboard />);
    expect(component).toHaveLength(1);
});
