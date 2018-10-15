import { JobList } from "../components";

test('JobList', () => {
    const component = shallow(<JobList />);
    expect(component).toHaveLength(1);
});