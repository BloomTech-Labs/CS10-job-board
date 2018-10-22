import React from 'react';
import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider} from 'react-stripe-elements';
import {CheckoutForm} from '../';

class Billing extends React.Component {

    render() {
        return (
            <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                <div className="billing">
                    <div className="checkout-card">
                        <h1>1 Job</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut}
                                user={this.props.user}
                                product={`sku_DoNhM1EGgKGLeg`}
                            />
                        </Elements>
                    </div>
                    <div className="checkout-card">
                        <h1>12 Jobs</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut}
                                user={this.props.user}
                                product={`sku_DoNp2frdbkieqn`}
                            />
                        </Elements>
                    </div>
                    <div className="checkout-card">
                        <h1>Unlimited</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut}
                                user={this.props.user}
                                product={`plan_DoNu8JmqFRMrze`}
                            />
                        </Elements>
                    </div>
                </div>
            </StripeProvider>
        );
    }
}

export default withRouter(Billing);
