import App from '../App';

// First test for App component

test('render an app component', () => {
  const wrapper = shallow(
    <App/>
  );
  expect(wrapper).toHaveLength(1);
});
