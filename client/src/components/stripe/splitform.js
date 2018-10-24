import React, {Component} from 'react';
import {CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, injectStripe} from 'react-stripe-elements';
import './stripe.css'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addUser,setStripeModal,loginUser,setAccount,updateFirebaseAccountsWithStripeCustomerId,getStripeCustomerID,stripePaymentStatus
} from '../../redux/actions';
import Button from '@material-ui/core/Button';
import { googleanalytics } from '../analytics';

// const payButtonColor = "linear-gradient(to right, #ff1744, #F44336 ";
const ownerInfo = {
  owner: {
    name: 'Cavalry Tactics',
    address: {
      line1: 'Nollendorfstraße 27',
      city: 'Berlin',
      postal_code: '10777',
      country: 'DE',
    },
    email: 'cavalrytacticsinc@gmail.com'
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

  componentDidMount() {

  }

  componentWillUnmount() {

  }


    handleSubmit = () => {
      googleanalytics.Cavalry_Webapp_Signup_Signup_Userclickedpaybutton(this.props.users.email)
      this.props.setStripeModal()
            this.props.stripe
                .createSource({type:'card'},ownerInfo)
                .then((payload) => {
                    this.props.addUser(this.props.users.email,this.props.users.login,payload.source.id,this.props.users.plan).then(() =>{
                        googleanalytics.Cavalry_Webapp_Signup_Account_Useraccountcreated(this.props.users.email)
                        this.props.history.push('/team')

                    })

                }, (response) => {
                  if (response === null){
                    this.props.setStripeModal()
                    this.props.stripePaymentStatus(false)
                    this.setState({
                      complete: true,
                      paymentError: '',
                      error:false,
                    });
                  } else {
                    this.props.setStripeModal()
                    this.props.stripePaymentStatus(true)
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
      // console.log("cardnumber",event)
        this.setState({
          cardnumber: event.complete
        })
    };

    handleChangeExpirationDate = expirationdate => event => {
      // console.log("expirationdate",event)
        this.setState({
          expirationdate: event.complete
        })
    };

    handleChangeCVC = cvc => event => {
      // console.log("cvc",event)
        this.setState({
          cvc: event.complete
        })
    };

    handleChangePostalCode = postalcode => event => {
      // console.log("postalcode",event)
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
        // console.log("RECAPTCHA: ",event)
    }

    handleChangeRecaptchaApply(event) {
        this.setState({ recaptchaApply:event});
        // console.log("RECAPTCHA: ",event)
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
        <div><div style={{color:'white'}}>Payment Confirmed!</div></div>
      )
    }

    renderPaymentError(){
      return(
        <div>
          <div style={{color:'white'}}>Payment Error! <br/> {this.state.paymentError}</div></div>
      )
    }

    renderPayButton(){
      if (this.state.cardnumber === true && this.state.expirationdate === true && this.state.cvc === true && this.state.postalcode === true){
        return (
          <Button style={{width:'50%', background:this.props.theme[0].PrimaryLinear, color:'white', marginTop: 20, marginBottom: 20, textTransform:'none'}} onClick={() => {this.handleSubmit()}}><b>Pay</b></Button>
        )
      } else {
        // console.log(this.state.cardnumber,this.state.expirationdate,this.state.cvc,this.state.postalcode)
        return (
          <Button disabled style={{width:'50%', background:'grey', color:'white', marginTop: 20, marginBottom: 20, textTransform:'none'}}><b>Pay</b></Button>
        )
      }
    }

    renderStripePaymentError(){
      if (this.props.stripe.paymentstatus === true){
        return (
          <div>This Credit Card is not pass Stripe Payment System. Try a different Credit Card.</div>
        )
      }
    }

    renderStripeLogo(){
      if(this.props.theme[0].theme === 'dark'){
        return(
          <a href="http://stripe.com" target="_blank" rel="noopener noreferrer"><img src="./images/powered_by_stripe_dark.png" alt="Powered By Stripe" style={{width:170, height:41, marginBottom:20}}/></a>
        )

      }
      if(this.props.theme[0].theme === 'light'){
        return(
          <a href="http://stripe.com" target="_blank" rel="noopener noreferrer"><img src="./images/powered_by_stripe_light.png" alt="Powered By Stripe" style={{width:170, height:41, marginBottom:20}}/></a>
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
                    <div  style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Card Number</b></div>
                      <CardNumberElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeCardNumber()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label><br/>
                  <label style={{color:'white'}}>
                      <div  style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Expiration Date</b></div>
                      <CardExpiryElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeExpirationDate()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label>{' '}
                  <label  style={{color:'white' ,width:100, marginLeft:10}}>
                      <div  style={{color:this.props.theme[0].PostsTypographyTitle}}><b>CVC</b></div>
                      <CardCVCElement
                          onBlur={this.handleBlur}
                          onChange={this.handleChangeCVC()}
                          onFocus={this.handleFocus}
                          onReady={this.handleReady}
                          {...this.createOptions(this.props.fontSize)}
                      />
                  </label><br/>
                <label style={{color:'white' , width:200}}>
                      <div  style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Postal Code</b></div>
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
                  {this.renderStripePaymentError()}
                  {this.renderStripeLogo()}
              </form>
          );
        }
    }
}

function mapStateToProps({ users, stripe, account,theme}) {
    return { users, stripe, account,theme };
}

export default connect(mapStateToProps,{addUser,setStripeModal,loginUser,setAccount,getStripeCustomerID,updateFirebaseAccountsWithStripeCustomerId,stripePaymentStatus})(withRouter(injectStripe(SplitForm)));
