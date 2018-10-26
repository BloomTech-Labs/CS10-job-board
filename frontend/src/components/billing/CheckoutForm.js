import React from 'react';
import { CSSTransition } from "react-transition-group";
import axios from 'axios';
import numeral from "numeral";
import { Alert, Form, Input, Icon, InputNumber, Button } from 'antd';
import { CardElement, injectStripe } from 'react-stripe-elements';

const FormItem = Form.Item;

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pay: false,
      error: null,
      message: null,
      quantity: 1,
      total: null,
      loading: null,
      success: false
    }
  }

  showStripeCheckout = () => {
    this.setState({ pay: true });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  updateQuantity = e => {
    this.setState({ quantity: e, total: numeral(e * this.props.price).format('$0.00') });
  }

  handlePayment = e => {
    e.preventDefault();
    this.setState({ error: null, message: null, loading: true });
    const { cardholder_name } = this.state;
    // Tokenize purchase with stripe object from injectStripe component
    this.props.stripe.createToken({ name: `${cardholder_name}` })
      .then(response => {
        const stripe_token = response.token.id;
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.post(`${process.env.REACT_APP_API}pay/`, {
            stripe_token: stripe_token,
            user: this.props.user,
            purchased: this.props.sku,
            quantity: this.state.quantity
          }, requestOptions )
          .then(response => {
            this.setState({ message: `Payment successful!`, loading: false, success: true });
          })
          .catch(err => {
            this.setState({ error: `Problem processing your payment. Try again.`, loading: false});
          });
      })
      .catch(err => {
        this.setState({ error: `Problem validating your card. Try again.`, loading: false});
      });
  }

  render() {
    const { error, message, quantity, total, loading, success } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="checkout-form">
        {error ? (
          <Alert message={error} type="error" closable showIcon banner/>
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon={false} banner/>
        ) : (null)}

          <FormItem label="Cardholder Name">
            {getFieldDecorator('cardholder_name', {
              rules: [{
                required: true,
                message: 'Please add the cardholder name',
              }],
            })(
              <Input placeholder="Full name on the card" name="cardholder_name" onChange={this.onChange}/>
            )}
          </FormItem>

          {/* If product is 1 Job, show Quantity to buy multiple */}
          {this.props.sku === `sku_DoNhM1EGgKGLeg` ? (
            <FormItem label="Number of jobs" style={{ width: "90px"}}>
              <InputNumber
                onChange={this.updateQuantity} name="quantity" id="quantity"
                step={1}
                min={1}
                defaultValue={1}
                max={11}
                value={quantity}
              />
            </FormItem>
          ) : (null)}

        <div className="stripe-card">
            <CardElement />
        </div>
        <h3 className="total">Total: {total ? `${total}` : `$${quantity * this.props.price}`}</h3>
        <div className="whitespace"></div>
        {success ? (
          <Icon type="check-circle" theme="filled"/>
        ) : (
          <Button type="primary" loading={loading} onClick={this.handlePayment}>Buy</Button>
        )}
        {/* <CSSTransition
          in={success}
          timeout={300}
          classNames="invoice-link"
        >

        </CSSTransition> */}
      </div>
    );
  }
}

// export default injectStripe(CheckoutForm);
export default CheckoutForm = Form.create()(injectStripe(CheckoutForm));