import React from 'react';
import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider} from 'react-stripe-elements';
import {CheckoutForm} from '../';

const CheckoutCard = props => (
    <div className="checkout-card">
        <h1>{props.title}</h1>
        <h3>{`$${props.price}`}</h3>
        <button onClick={props.hideOthers} name={`${props.sku}`} data-price={props.price}>Select</button>
    </div>
)

class Billing extends React.Component {
    state = {
        products: null,
        activeSku: null,
        activePrice: null
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
        this.setState({ activeSku: e.target.name, activePrice: e.target.dataset.price });
    }

    render() {
        const { products, activePrice, activeSku } = this.state;

        return (
            <StripeProvider apiKey={`${process.env.REACT_APP_STRIPE_KEY}`}>
                <div className="billing">

                    { products ? (
                        products.map(product => {
                            return (
                                <div className="checkout-card-container">
                                    {
                                        activeSku === null || activeSku === product.sku ? (
                                            <CheckoutCard 
                                                key={product.sku}
                                                title={product.title}
                                                price={product.price}
                                                sku={product.sku}
                                                token={this.props.token}
                                                logOut={this.props.logOut}
                                                hideOthers={this.hideOthers}
                                                />
                                        ) : (null)
                                    }
                                </div>
                            )
                        })
                    ) : (null)
                    }
                    <div className="checkout-card-container">
                        <Elements>
                            <CheckoutForm 
                                user={this.props.user}
                                product={`${activeSku}`}
                                price={activePrice}
                            />
                        </Elements>
                    </div>
                </div>
            </StripeProvider>
        );
    }
}

export default withRouter(Billing);
