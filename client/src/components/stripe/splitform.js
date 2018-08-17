import React, {Component} from 'react';
import {CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe} from 'react-stripe-elements';
import './stripe.css'
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addUser
} from '../../redux/actions';

class SplitForm extends Component {

    constructor(props) {
        super(props);
        this.state = {complete: false};
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        // This generate the token used to be send to Backend Source
        if (this.props.stripe) {
            this.props.stripe
                .createToken()
                .then((payload) => {
                  console.log(this.props.users,payload.token.id)
                    this.props.addUser(this.props.users.email,payload.token.id)
                });
        } else {
            console.log("Stripe.js hasn't loaded yet.");
        }
        if (ev.ok){
            this.setState({complete: true});
        }
    };

    handleBlur = () => {
        console.log('[blur]');
    };
    handleChange = (change) => {
        console.log('[change]', change);
    };
    handleClick = () => {
        console.log('[click]');
    };
    handleFocus = () => {
        console.log('[focus]');
    };
    handleReady = () => {
        console.log('[ready]');
    };

    handleChangeRecaptcha(event) {
        this.setState({ recaptcha:event});
        console.log("RECAPTCHA: ",event)
    }

    handleChangeRecaptchaApply(event) {
        this.setState({ recaptchaApply:event});
        console.log("RECAPTCHA: ",event)
    }

    createOptions = (fontSize, padding) => {
        return {
            style: {
                base: {
                    fontSize,
                    color: '#424770',
                    letterSpacing: '0.025em',
                    fontFamily: 'Source Code Pro, monospace',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                    padding,
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        };
    };


    render() {
        console.log(this.props.users.email);
        if (this.state.complete) {
            return <h1>Purchase Complete</h1>;
        };
        return (
            <form onSubmit={this.handleSubmit}>
                <label style={{width:250, color:'white'}}>
                    Card Number
                    <CardNumberElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label><br/>
                <label style={{color:'white'}}>
                    Expiration Date
                    <CardExpiryElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label>{' '}
                <label  style={{color:'white' ,width:100}}>
                    CVC
                    <CardCVCElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label><br/>
                <label style={{color:'white' , width:100}}>
                    Postal Code
                    <PostalCodeElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label><br/>
                <button style={{width:'100%'}}>Pay</button><br/>
                <img src="./images/powered_by_stripe.png" alt="Powered By Strip" style={{width:250, marginBottom:20}}/>
                <Typography variant="caption" style={{color:'white'}}>Stripe is a secure PCI compliant Credit Card Processing Service and your credit card information is sent directly to them. <br/>For more information:  <a href={'https://stripe.com/docs/security'} target="_blank">https://stripe.com/docs/security</a></Typography>
            </form>
        );
    }
}

function mapStateToProps({ users }) {
    return { users };
}

export default connect(mapStateToProps,{addUser})(withRouter(injectStripe(SplitForm)));
