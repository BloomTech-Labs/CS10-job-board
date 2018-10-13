
import { JobPreview } from "../components";

test('JobPreview', () => {
    const mockProps = {
        title: "firstTitle",
        min_salary: 100000,
        max_salary: 200000,
        description: "firstDescription"
    }
    shallow(<JobPreview {...mockProps} />);
});