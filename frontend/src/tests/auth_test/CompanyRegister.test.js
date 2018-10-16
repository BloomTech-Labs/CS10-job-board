import { CompanyRegister } from "../../components";

test('CompanyRegister', () => {
    const component = shallow(<CompanyRegister />);
    expect(component).toHaveLength(1);
});