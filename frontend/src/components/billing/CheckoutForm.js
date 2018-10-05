import React from 'react';
import axios from "axios";
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

handlePurchase = e => {
    e.preventDefault();
    const { token } = await this.props.stripe.createToken({name: "Name"});
    console.log(token);
    let response = await fetch("/charge", {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: token.id
  });
    axios.post(`${process.env.REACT_APP_API}/charge`)

  if (response.ok) console.log("Purchase Complete!")
}

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.handlePurchase}>Send</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);