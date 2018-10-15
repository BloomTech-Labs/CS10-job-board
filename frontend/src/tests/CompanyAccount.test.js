import { CompanyAccount } from "../components";

test('CompanyAccount', () => {
    const component = shallow(<CompanyAccount />);
    expect(component).toHaveLength(1);
});