
import { CompanyLanding } from "../components";

test('CompanyLanding', () => {
    const component = shallow(<CompanyLanding />);
    expect(component).toHaveLength(1);
});