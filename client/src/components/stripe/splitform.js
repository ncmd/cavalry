import React, {Component} from 'react';
import {CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe} from 'react-stripe-elements';
import './stripe.css'
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addUser,setStripeModal,setStripeProgress
} from '../../redux/actions';
import * as auth from "../firebase/auth";
import Button from '@material-ui/core/Button';

const payButtonColor = "linear-gradient(to right, #ff1744, #F44336 ";
const ownerInfo = {
  owner: {
    name: 'Jenny Rosen',
    address: {
      line1: 'Nollendorfstraße 27',
      city: 'Berlin',
      postal_code: '10777',
      country: 'DE',
    },
    email: 'jenny.rosen@example.com'
  },
};

class SplitForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
          complete: false,
          error:true,
          paymentError: '',
          cardnumber:false,
          expirationdate:false,
          cvc:false,
          postalcode:false,
          progresscompleted:0
        };
    }

    stripeSourceHandler(source) {
      // Insert the source ID into the form so it gets submitted to the server
      var form = document.getElementById('payment-form');
      var hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');
      hiddenInput.setAttribute('name', 'stripeSource');
      hiddenInput.setAttribute('value', source.id);
      form.appendChild(hiddenInput);

      // Submit the form
      form.submit();
    }

    renderProgress = () => {
    if (this.state.progresscompleted > 100) {
      this.setState({ progresscompleted: 0});
      this.props.setStripeProgress(tis.state.progresscompleted)

    } else {
      const diff = Math.random() * 10;
      this.setState({ progresscompleted: this.state.progresscompleted + diff });
      this.props.setStripeProgress(tis.state.progresscompleted)
    }
  }

    handleSubmit = () => {
            this.props.setStripeModal()
            this.renderProgress()
            this.props.stripe
                .createSource({type:'card'},ownerInfo)
                .then((payload) => {
                  console.log(this.props.users)
                  // Once add user, generate password (in backend), use password to create user, send password to user via email
                    this.props.addUser(this.props.users.email,payload.source.id,this.props.users.plan).then((password) =>{
                      console.log("PASSWORRRRRRD:",password)
                      auth.doCreateUserWithEmailAndPassword(this.props.users.email,password)
                    })

                }, (response) => {
                  if (response === null){
                    this.setState({
                      complete: true,
                      paymentError: '',
                      error:false,
                    });
                  } else {
                    this.setState({
                      paymentError: response,
                      error:true,
                    });
                  }
                });

    };

    handleBlur = () => {
        // console.log('[blur]');
    };
    handleChangeCardNumber = cardnumber => event => {
      console.log("cardnumber",event)
        this.setState({
          cardnumber: event.complete
        })
    };

    handleChangeExpirationDate = expirationdate => event => {
      console.log("expirationdate",event)
        this.setState({
          expirationdate: event.complete
        })
    };

    handleChangeCVC = cvc => event => {
      console.log("cvc",event)
        this.setState({
          cvc: event.complete
        })
    };

    handleChangePostalCode = postalcode => event => {
      console.log("postalcode",event)
        this.setState({
          postalcode: event.complete
        })
    };

    handleClick = () => {
        // console.log('[click]');
    };
    handleFocus = () => {
        // console.log('[focus]');
    };
    handleReady = () => {
        // console.log('[ready]');
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

    renderConfirmedPayment(){
      return(
        <div><Typography style={{color:'white'}}>Payment Confirmed!</Typography></div>
      )
    }

    renderPaymentError(){
      return(
        <div>
          <Typography style={{color:'white'}}>Payment Error! <br/> {this.state.paymentError}</Typography></div>
      )
    }

    renderPayButton(){
      if (this.state.cardnumber === true && this.state.expirationdate === true && this.state.cvc === true && this.state.postalcode === true){
        return (
          <Button style={{width:'50%', background:payButtonColor, color:'white', marginTop: 20, marginBottom: 20, textTransform:'none'}} onClick={() => {this.handleSubmit()}}><b>Pay</b></Button>
        )
      } else {
        console.log(this.state.cardnumber,this.state.expirationdate,this.state.cvc,this.state.postalcode)
        return (
          <Button disabled style={{width:'50%', background:'grey', color:'white', marginTop: 20, marginBottom: 20, textTransform:'none'}}><b>Pay</b></Button>
        )
      }
    }



    render() {
        if (this.state.complete === true) {
            return <h1 style={{color:'white'}}>Purchase Complete!</h1>;
        } else if (this.state.complete === false) {
          return (
              <form onSubmit={this.handleSubmit}>
                  <label style={{width:250, color:'white'}}>
                    <Typography variant={'body2'} style={{color:'white'}}>Card Number</Typography>
                      <CardNumberElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeCardNumber()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label><br/>
                  <label style={{color:'white'}}>
                      <Typography variant={'body2'} style={{color:'white'}}>Expiration Date</Typography>
                      <CardExpiryElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeExpirationDate()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label>{' '}
                  <label  style={{color:'white' ,width:100, marginLeft:10}}>
                      <Typography variant={'body2'} style={{color:'white'}}>CVC</Typography>
                      <CardCVCElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeCVC()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label><br/>
                <label style={{color:'white' , width:200}}>
                      <Typography variant={'body2'} style={{color:'white'}}>Postal Code</Typography>
                      <PostalCodeElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangePostalCode()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label><br/>
                {this.renderPayButton()}
                  <br/>
                  <a href="http://stripe.com" target="_blank" rel="noopener noreferrer"><img src="./images/powered_by_stripe.png" alt="Powered By Stripe" style={{width:170, height:36, marginBottom:20}}/></a>
              </form>
          );
        }
    }
}

function mapStateToProps({ users, stripe}) {
    return { users, stripe };
}

export default connect(mapStateToProps,{addUser,setStripeModal})(withRouter(injectStripe(SplitForm)));
