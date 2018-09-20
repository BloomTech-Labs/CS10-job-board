import React from "react";
import axios from "axios";
import '../css/Billing.css';

class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null
        }
    }

    componentDidMount() {
        //axios call to mount user data
    }

    handleBuy = e => {
        e.preventDefault();
        // Stripe integration
    }

    render() {
        return (
            <div className="billing">
                <form action="">
                    <input type="checkbox"/>
                    <input type="checkbox"/>
                    <input type="checkbox"/>
                    <button onClick={this.handleBuy}>Buy Now</button>
                </form>
            </div>
        );
    }
}

export default Billing;
