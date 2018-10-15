
import { Landing } from "../../components";

test('Landing', () => {
    const component = shallow(<Landing />);
    expect(component).toHaveLength(1);
});