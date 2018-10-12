import App from '../App';

// First test for App component

test('App', () => {
	const component = shallow(<App />);
	expect(component).toHaveLength(1);
});

