import React from 'react';
import { Alert } from 'antd';
import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider} from 'react-stripe-elements';
import {CheckoutForm} from '../';

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
    // handleMessage = keyPair => {
    //     this.setState(keyPair);
    // }

    render() {
        const { error, message } = this.state;
        return (
            <div className="billing">
            
                <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                    <div className="checkout-card">
                        <h1>Free</h1>
                        <Elements>
                            <CheckoutForm 
                                token={this.props.token}
                                logOut={this.props.logOut} 
                                // handleMessage={this.handleMessage}
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
                                // handleMessage={this.handleMessage}
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
                                // handleMessage={this.handleMessage}
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
                                // handleMessage={this.handleMessage}
                            />
                        </Elements>
                    </div>
                </StripeProvider>

            </div>
        );
    }
}

export default withRouter(Billing);
