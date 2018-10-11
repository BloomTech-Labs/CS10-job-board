import App from '../App';

test('render an app component', () => {
  const wrapper = shallow(
    <App/>
  );
  expect(wrapper).toHaveLength(1);
});
