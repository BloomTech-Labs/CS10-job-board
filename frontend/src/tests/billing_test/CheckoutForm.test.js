import { CheckoutForm} from '../../components';
import ReactTestUtils from 'react-dom/test-utils';

test('CheckoutForm', () => {
	window.Stripe = function() {
		let rendered = ReactTestUtils.renderIntoDocument(<CheckoutForm error={{}} message={{}} pay={{}} />);
		expect(rendered).toHaveLength(1);
	};
});
