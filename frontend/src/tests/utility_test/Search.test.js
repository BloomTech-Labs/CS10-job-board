
import { Search } from "../../components";


test('Search', () => {
     const component = shallow(<Search />);
     expect(component).toHaveLength(1);
});