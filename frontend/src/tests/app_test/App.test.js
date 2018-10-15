import App from '../../App';

test('App', () => {
	const component = shallow(<App />);
	expect(component).toHaveLength(1);
});

