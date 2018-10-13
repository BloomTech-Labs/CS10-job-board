
import { JobPreview } from "../components";

test('JobPreview', () => {
    const component = shallow(<JobPreview {...props} />);
    expect(component).toHaveLength(2);
});