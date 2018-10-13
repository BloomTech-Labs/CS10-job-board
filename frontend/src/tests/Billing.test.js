
import { Billing } from "../components";

test('Billing', () => {
    const component = shallow(<Billing />);
    expect(component).toHaveLength(1);
});