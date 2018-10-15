import { TagCreate } from '../components';

test('TagCreate', () => {
    const wrapper = shallow(<TagCreate tags={['example']} />);
    expect(wrapper.find('Tag').exists()).toEqual(true);  
});
