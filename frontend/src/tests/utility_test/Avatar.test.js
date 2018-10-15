import { Avatar } from "../../components";

test('Avatar', () => {
    const component = shallow(<Avatar />);
    expect(component).toHaveLength(1);
});