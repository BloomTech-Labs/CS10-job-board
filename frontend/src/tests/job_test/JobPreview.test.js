import { JobPreview } from '../../components';

test('JobPreview', () => {
	const component = mount(<JobPreview job={{}} />);
    expect(component.props().job).toBeDefined();
    expect(component.find('StylizedLine'));
});
