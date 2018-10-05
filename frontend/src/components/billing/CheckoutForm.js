import React from 'react';
import axios from "axios";
import {CardElement, injectStripe} from 'react-stripe-elements';
import "../../css/CheckoutForm.css";

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      pay: false
    }
  }

  showStripeCheckout = () => {
    this.setState({ pay: true });
  }

  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    let response = await fetch("/charge", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: token.id
    });

    if (response.ok) console.log("Purchase Complete!")
  }

  render() {
    const { pay } = this.state;
    return (
      <div className="checkout-form">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        {pay ? (
          <button onClick={this.submit}>Pay</button>
        ) : (
          <button onClick={this.showStripeCheckout}>Purchase</button>
        )}
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);