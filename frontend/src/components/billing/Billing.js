import React from 'react';
import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider} from 'react-stripe-elements';
import {CheckoutForm} from '../';
import { Icon } from 'antd';

class Billing extends React.Component {
    state = {
        products: null,
        activeProduct: null
    }

    componentDidMount() {
        let products = []
        const titles = [ `1 Job`, `12 Jobs`, `Unlimited Jobs`];
        const prices = [ 9.99, 99.99, 299.99 ]
        const skus = [`sku_DoNhM1EGgKGLeg`, `sku_DoNp2frdbkieqn`, `plan_DoNu8JmqFRMrze`]
        for (let i = 0; i < titles.length; i++) {
            products[i] = {
                title: titles[i],
                price: prices[i],
                sku: skus[i],
                active: true
            }
        }
        this.setState({ products: products });
    }

    hideOthers = e => {
        const { products } = this.state;
        this.setState({ activeProduct: products.filter(product => product.sku === e.target.name ) });
    }

    render() {
        const { products, activeProduct } = this.state;
        const CheckoutCard = props => (
            <div className="checkout-card">
                <h1>{props.title}</h1>
                <h3>{`$${props.price}`}</h3>
                <button onClick={props.hideOthers} name={`${props.sku}`}>Select</button>
            </div>
        );
        const checkoutCardActive = {
            position: "absolute",
            left: "0",
            transition: "all 0.6s ease"
        }


        return (
            <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                <div className="billing">

                    { products && !activeProduct ? (
                        products.map(product => {
                            return (
                                <div className="checkout-card-container" key={product.sku}>
                                    <CheckoutCard 
                                        title={product.title}
                                        price={product.price}
                                        sku={product.sku}
                                        token={this.props.token}
                                        logOut={this.props.logOut}
                                        hideOthers={this.hideOthers}
                                    />
                                </div>
                            )
                        })
                    ) : (null)
                    }

                    { activeProduct ? (
                        <div className="active-product">
                            <div className="checkout-card-container">
                                <CheckoutCard 
                                    title={activeProduct.title}
                                    price={activeProduct.price}
                                    sku={activeProduct.sku}
                                    token={this.props.token}
                                    logOut={this.props.logOut}
                                    hideOthers={this.hideOthers}
                                />
                                <Icon type="close" />
                            </div>
                            <div className="checkout-form-container">
                                <Elements>
                                    <CheckoutForm 
                                        user={this.props.user}
                                        sku={`${activeProduct.sku}`}
                                        price={activeProduct.price}
                                    />
                                </Elements>
                            </div>
                        </div>
                    ) : (null)}

                </div>
            </StripeProvider>
        );
    }
}

export default withRouter(Billing);
