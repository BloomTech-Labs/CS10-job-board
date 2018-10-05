import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Elements, StripeProvider} from "react-stripe-elements";
import {CheckoutForm} from "../";
import '../../css/Billing.css';

class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null
        }
    }

    // componentDidMount() {
    //     //axios call to mount user data
    // }

    render() {
        return (
            <div className="billing">
            {/* //     <h3>Payment Info</h3>
            //     <form>
            //         <div>
            //             <label htmlFor="">Unlimited Jobs, 1 Month $199.99</label>
            //             <input type="checkbox"/>
            //         </div>
            //         <div>
            //             <label htmlFor="">Post 12 Jobs, $99.99</label>
            //             <input type="checkbox"/>
            //         </div>
            //         <div>
            //             <label htmlFor="">Post Job, $9.99</label>
            //             <input type="checkbox"/>
            //         </div>
            //         <button onClick={this.handleBuy}>Buy Now</button>
            //     </form> */}
            
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
                    <div className="checkout-card">
                        <h1>Free</h1>
                        <Elements>
                            <CheckoutForm />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
                    <div className="checkout-card">
                        <h1>1 Job</h1>
                        <Elements>
                            <CheckoutForm />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
                    <div className="checkout-card">
                        <h1>12 Jobs</h1>
                        <Elements>
                            <CheckoutForm />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`}>
                    <div className="checkout-card">
                        <h1>Unlimited</h1>
                        <Elements>
                            <CheckoutForm />
                        </Elements>
                    </div>
                </StripeProvider>
            </div>
        );
    }
}

export default withRouter(Billing);


// <h3>Select a membership</h3>
//     <div class="row">
//         {% for object in object_list %}
//         <div class="col-sm-4 col-md-4">
//             <h2>{{ object.membership_type }}</h2>
//             <p>Price: ${{ object.price }}<small>/month</small></p>
//             <p>{{ object.plan_description }}</p>
//             {% if object.membership_type != 'Free' %}
//             <form method="POST" action=".">
//                 {% csrf_token %}
//                 {% if object.membership_type != current_membership %}
//                     <button class="btn btn-warning">Select</button>
//                 {% else %}
//                     <small>This is your current membership</small>
//                 {% endif %}
//                 <input type="hidden" name="membership_type" value="{{ object.membership_type }}"></input>
//             </form>
//             {% endif %}
//         </div>
//         {% endfor %}
//     </div>
