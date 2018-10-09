import React from 'react';
import axios from "axios";
import { Alert } from "antd";
import { CardElement, injectStripe } from 'react-stripe-elements';
import "../../css/CheckoutForm.css";

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: false,
      error: null,
      message: null
    }
  }

  showStripeCheckout = () => {
    this.setState({ pay: true });
  }

  handlePayment = e => {
    e.preventDefault();
    this.setState({ error: null, message: null });
    // Tokenize purchase with stripe object from injectStripe component
    this.props.stripe.createToken({ name: "Name" })
      .then(response => {
        // console.log(response);
        const stripe_token = response.token.id;
        const token = localStorage.getItem('token');
        // console.log(token, this.props.token);
        // compare token to token set in App.js when user logged in.
        if (token !== this.props.token) {
          this.props.logOut(e, `Error authenticating account. Please log in again.`);
        } else {
          const requestOptions = { headers: { Authorization: `JWT ${token}` }};
          axios.post(`${process.env.REACT_APP_API}pay/`, stripe_token, requestOptions )
            .then(response => {
              this.setState({ message: `Payment successful!`});
            })
            .catch(err => {
              this.setState({ error: `Problem processing your payment. Try again.`});
            });
        }
      })
      .catch(err => {
        this.setState({ error: `Problem processing your payment. Try again.`})
      });
  }

  render() {
    const { error, message, pay } = this.state;
    return (
      <div className="checkout-form">
        {error ? (
          <Alert message={error} type="error" closable showIcon banner/>
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon banner/>
        ) : (null)}
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.handlePayment}>Buy</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);