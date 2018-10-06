import React from "react";
import { Alert } from "antd";
import { withRouter } from "react-router-dom";
import { Elements, StripeProvider} from "react-stripe-elements";
import {CheckoutForm} from "../";
import '../../css/Billing.css';

class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            error: null,
            message: null
        }
    }

    // componentDidMount() {
    //     //axios call to mount producst from stripe?
    // }
    handleMessage = keyPair => {
        this.setState({ keyPair });
    }

    render() {
        const { error, message } = this.state;
        return (
            <div className="billing">
                {error ? (
                  <Alert message={error} type="error" closable showIcon />
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon />
                ) : (null)}
            
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                    <div className="checkout-card">
                        <h1>Free</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut} 
                                handleMessage={this.handleMessage}
                            />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                    <div className="checkout-card">
                        <h1>1 Job</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut} 
                                handleMessage={this.handleMessage}
                            />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                    <div className="checkout-card">
                        <h1>12 Jobs</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut} 
                                handleMessage={this.handleMessage}
                            />
                        </Elements>
                    </div>
                </StripeProvider>
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                    <div className="checkout-card">
                        <h1>Unlimited</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut} 
                                handleMessage={this.handleMessage}
                            />
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
