
import { TagCreate } from "../components";

test('TagCreate', () => {
    const component = shallow(<TagCreate />);
    expect(component).toHaveLength(1);
});