
import { JobPost } from "../../components";

test('JobPost', () => {
    const component = shallow(<JobPost />);
    expect(component).toHaveLength(1);
});