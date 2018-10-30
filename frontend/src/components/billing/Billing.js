import React from 'react';
import { CSSTransition } from "react-transition-group";
import { withRouter } from 'react-router-dom';
import { Elements, StripeProvider} from 'react-stripe-elements';
import {CheckoutForm} from '../';
import { Icon, Button } from 'antd';

class Billing extends React.Component {
    state = {
        products: null,
        activeProduct: null
    }

    componentDidMount() {
        let products = []
        const titles = [ `1 Job`, `12 Jobs`, `Unlimited Jobs`];
        const prices = [ 9.99, 99.99, 299.99 ]
        const descriptions = [
            [`1 job post credit, published for 30 days.`, `If unpublished after publishing, you can re-publish the job again until the 30 days is used.`],
            [`12 job credits, published for 30 days.`, `If unpublished after publishing, you can re-publish the job again until the 30 days is used.`],
            [`Unlimited posting and publishing.`, `Post as many jobs for as long as you wish. Publish & unpublish jobs as needed.`]
        ]
        const skus = [`sku_DoNhM1EGgKGLeg`, `sku_DoNp2frdbkieqn`, `plan_DoNu8JmqFRMrze`]
        for (let i = 0; i < titles.length; i++) {
            products[i] = {
                title: titles[i],
                price: prices[i],
                description: descriptions[i],
                sku: skus[i],
                active: true
            }
        }
        this.setState({ products: products });
    }

    hideOthers = e => {
        const { products } = this.state;
        this.setState({ activeProduct: products.filter(product => product.sku === e.target.name )[0] });
    }

    closeActive = e => {
        this.setState({ activeProduct: null });
    }

    render() {
        const { products, activeProduct } = this.state;
        const active = activeProduct !== null;
        const CheckoutCard = props => (
            <div className="checkout-card">
                <h1>{props.title}</h1>
                <h3>{`$${props.price}`}</h3>
                <ul>
                    {props.description.map((item, i) => {
                        return (
                            <li key={i}>{item}</li>
                        )
                    })}
                </ul>
                <div className="whitespace"></div>
                {props.active ? (
                   <Icon type="check-circle" />
                ) : (
                    <Button type="primary" onClick={props.hideOthers} name={`${props.sku}`}>Select</Button>
                )}
            </div>
        );
        
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
                                        description={product.description}
                                        sku={product.sku}
                                        hideOthers={this.hideOthers}
                                    />
                                </div>
                            )
                        })
                    ) : (null)
                    }

                    <CSSTransition
                        in={active}
                        timeout={300}
                        classNames="active-card"
                        >
                        <div>
                                {activeProduct ? (
                        <div className="checkout-card-container">
                            <h2>Selected:</h2>
                            <Icon type="close" onClick={this.closeActive}/>
                            <CheckoutCard 
                                title={activeProduct.title}
                                price={activeProduct.price}
                                description={activeProduct.description}
                                sku={activeProduct.sku}
                                hideOthers={this.hideOthers}
                                active={true}
                            />
                        </div>
                            ) : (null)}
                        </div>
                    </CSSTransition>

                    <CSSTransition
                        in={active}
                        timeout={300}
                        classNames="checkout-form-container"
                    >
                        <div className="checkout-form-container">
                            {activeProduct ? (
                                <Elements>
                                    <CheckoutForm 
                                        user={this.props.user}
                                        sku={`${activeProduct.sku}`}
                                        price={activeProduct.price}
                                        />
                                </Elements>
                            ) : (null)}
                        </div>
                    </CSSTransition>

                </div>
            </StripeProvider>
        );
    }
}

export default withRouter(Billing);
