import { CompanyJobList } from "../../components";

test('CompanyJobList', () => {
    const component = shallow(<CompanyJobList />);
    expect(component).toHaveLength(1);
});