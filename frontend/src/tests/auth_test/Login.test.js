
import { Login } from "../../components";

test('Login', () => {
    const component = shallow(<Login />);
    expect(component).toHaveLength(1);
});