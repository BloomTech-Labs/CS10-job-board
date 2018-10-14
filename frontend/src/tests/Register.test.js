import { Register } from "../components";

test('Register', () => {
    const component = shallow(<Register />);
    expect(component).toHaveLength(1);
});