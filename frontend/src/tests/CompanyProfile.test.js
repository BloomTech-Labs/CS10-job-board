import { CompanyProfile } from "../components";

test('CompanyProfile', () => {
    const component = shallow(<CompanyProfile />);
    expect(component).toHaveLength(1);
});