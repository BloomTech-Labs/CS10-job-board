import { CompanyDashboard} from "../../components";

test('CompanyDashboard', () => {
    const component = shallow(<CompanyDashboard />);
    expect(component).toHaveLength(1);
});