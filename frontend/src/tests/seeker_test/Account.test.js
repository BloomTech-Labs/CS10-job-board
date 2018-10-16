import Account from '../../components/seeker/Account'

test('Account', () => {
    const component = shallow(<Account />);
    expect(component).toHaveLength(1);
});
