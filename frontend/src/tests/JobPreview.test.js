
import { JobPreview } from "../components";

test('JobPreview', () => {
    const component = shallow(<JobPreview />);
    expect(component).toHaveLength(1);
});