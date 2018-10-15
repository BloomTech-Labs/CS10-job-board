
import { JobPreview } from "../components";

test('JobPreview', () => {
    // const job = {
    //     title: 'Software Engineer',
    //     min_salary: 100000,
    //     max_salary: 150000,
    //     description: 'Software engineer description'
    // }
    // const component = shallow(<JobPreview job="post" />);
    // expect(component.props().job).toEqual();
    // expect(JobPreview()).toContainEqual(job);
    // const component = shallow(<JobPreview job="post" />);
   const component = mount(<JobPreview job={{}} />); 
   expect(component.props().job).toBeDefined();
    
});
