import { JobPreview, StylizedLine } from '../components';


test('JobPreview', () => {
	const component = mount(<JobPreview job={{}} />);
    expect(component.props().job).toBeDefined();
    expect(component.find('StylizedLine'));
});

// test('StylizedLine', () => {
// 	const component = renderer.create(<StylizedLine />).toJSON();
// 	expect(component).toMatchSnapshot();
// });
