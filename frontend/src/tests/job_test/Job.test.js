
import { Job } from "../../components";

test('Job', () => {
    const component = shallow(<Job />);
    expect(component).toHaveLength(1);
});