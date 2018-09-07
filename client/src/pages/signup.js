import React, { Component } from 'react';
import Header from '../components/header/header';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,setUserEmail,emailJidoka,applySecurity
} from '../redux/actions';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { InputGroup, InputGroupText, InputGroupAddon, Input ,FormFeedback } from 'reactstrap';
import {Elements, StripeProvider} from "react-stripe-elements";
import SplitForm from "../components/stripe/splitform";
import { auth } from '../components/firebase';

const bodyBlue = "linear-gradient(#1a237e, #121858)";

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            status: null,
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
            stripe:null,
            showAccountCreation: true,
            showPaymentOption: false,
            showSelectPlan:false,
            email:'',
            password:'',
            confirmpassword:'',
            error:null,
            emailExists:false,
            emailError:null,
            scontact:false,
            validEmail: false,
            validPassword: false,
            validConfirmPassword: false,
            recaptcha:'',
            userSuccessfullySubscribed:false,
            tooltipEmailError:'',
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        window.addEventListener('resize', () => {
            if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'});
            } else if (
                window.innerWidth >= 450 &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'});
            }
        });

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.validateCaptchaClick = this.validateCaptchaClick.bind(this);
    }

    componentDidMount() {
        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (window.Stripe) {
            this.setState({stripe: window.Stripe('pk_test_A2LpNEMEMfYY7n9e5JBmhPlH')});
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                // Create Stripe instance once Stripe.js loads
                this.setState({stripe: window.Stripe('pk_test_A2LpNEMEMfYY7n9e5JBmhPlH')});
            });
        }
    }

    handleEmail = email => event => {

        this.setState({
            [email]: event.target.value,
        }, () => {
            const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (emailRegex.test(email)) {
                // // console.log("Valid Email Address:",email);
            } else {
                // Invalid phone number
                // // console.log("Invalid Email Address:",email);
                this.setState({validEmail:false})
            }
            if (this.state.validEmail === false){
                // // console.log(event.target.value);
                this.validateEmail(this.state.email);
            }
            if (this.state.validEmail === true){
                // // console.log(event.target.value);
                this.validateEmail(this.state.email);
                this.checkEmailExists(this.state.email);
            }
        });

    };

    validateEmail(email){
        const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailRegex.test(email)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validEmail:true});

        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validEmail:false})
        }
    }


    handlePassword = password => event => {

        this.setState({
            [password]: event.target.value,
        }, () => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*)(+=._-]{8,}$/
            if (passwordRegex.test(password)) {
                this.setState({validPassword:true})
            } else {
                this.setState({validPassword:false})
            }
            if (this.state.validPassword === false){
                // // console.log(event.target.value);
                this.validatePassword(this.state.password);
            }
            if (this.state.validPassword === true){
                // // console.log(event.target.value);
                this.validatePassword(this.state.password);
            }
        });
    };

    validatePassword(password){
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#[$%^&*)(+=._-]{8,}$/
        if (passwordRegex.test(password)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validPassword:true})
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validPassword:false})
        }
    }


    handleConfirmPassword = confirmpassword => event => {

        this.setState({
            [confirmpassword]: event.target.value,
        },() => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            if (passwordRegex.test(confirmpassword)) {
                this.setState({validConfirmPassword:true})
            } else {
                this.setState({validConfirmPassword:false})
            }
            if (this.state.validConfirmPassword === false){
                // // console.log(event.target.value);
                this.validateConfirmPassword(this.state.confirmpassword);
            }
            if (this.state.validConfirmPassword === true){
                // // console.log(event.target.value);
                this.validateConfirmPassword(this.state.confirmpassword);
            }
            console.log(this.state.validPassword,this.state.validConfirmPassword)
        })

    };

    validateConfirmPassword(confirmpassword){
        if (this.state.password === confirmpassword) {
            // // console.log("Valid Email Address:",email);
            this.setState({validConfirmPassword:true})
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validConfirmPassword:false})
        }
    }

    checkEmailExists(email){
        auth.checkEmailExists(email).then((response) => {
            console.log("Response:",response)
            if (response[0]=== "password"){
                this.setState({
                   emailExists:true,
                    emailError:"Email Exists!",
                    tooltipEmailError:'Email Exists!'
                });
                console.log(email, this.state.emailError)
            }
        })

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.interval);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleAccountCreation(){

        if (this.state.emailError === null ){
            this.setState({
                showAccountCreation: !this.state.showAccountCreation,
                showSelectPlan: !this.state.showSelectPlan,
                sContact: false,
                recaptcha: ''
            });
            this.props.setUserEmail(this.state.email,this.state.password);
        }
    };

    handleSelectPlan(){
      if (this.state.emailError === null ){
          this.setState({
              showPaymentOption: !this.state.showPaymentOption,
          });
      }
    }

    handleCancel(){
        this.setState({
            showAccountCreation: !this.state.showAccountCreation,
            showPaymentOption: !this.state.showPaymentOption,
            sContact: false,
            recaptcha: '',
            emailError: null
        });
    };

    handleSelectPlanCancel(){
        this.setState({
            showAccountCreation: !this.state.showAccountCreation,
            showPaymentOption: !this.state.showPaymentOption,
            sContact: false,
            recaptcha: '',
            emailError: null
        });
    };

    handleChangeRecaptcha(event) {
        this.setState({ recaptcha:event});
        // console.log("RECAPTCHA: ",event);
        this.validateCaptchaClick()
    }

    validateCaptchaClick(){

        // console.log("Button Clicked!");
        if (this.state.validEmail === true){
            this.props.applySecurity(this.state.email, this.state.recaptcha);
            // console.log("ALL VALID");
            this.setState({
                sContact: true
            })
        } else {
            // console.log("SOMETHING IS NOT VALID!",this.state.validEmail)
        }
    }

    renderErrorEmail(){

        if (this.state.email !== '' && this.state.validEmail === false && this.state.emailError === null){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>Enter a valid Email Address</FormFeedback>
            )
        }
        if (this.state.email !== '' && this.state.validEmail === true && this.state.emailError !== null){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>{this.state.emailError}</FormFeedback>
            )
        }
        if (this.state.email !== '' && this.state.validEmail === true && this.state.emailExists === true){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>Thie Email Exists</FormFeedback>
            )
        }
    }

    renderErrorPassword(){

        if (this.state.password !== '' && this.state.validPassword === false){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>8 characters, 1 letter, 1 number </FormFeedback>
            )
        }

    }

    renderErrorConfirmPassword(){

        if (this.state.confirmpassword !== '' && this.state.password !== this.state.confirmpassword){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>Passwords do not match</FormFeedback>
            )
        }

    }

    renderButton(){
        // If Valid Email and Recaptcha not empty
        if (this.state.validEmail === true && this.state.recaptcha !== ''){
            if(this.state.validEmail === true && this.state.validPassword === true && this.state.validConfirmPassword === true && this.state.recaptcha !== '' && this.state.emailExists === false){
                return(
                    <Button raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:20}}  onClick={() =>this.handleAccountCreation()}>Continue</Button>
                )
            } if(this.state.validEmail === true && this.state.validPassword === true && this.state.validConfirmPassword === true && this.state.recaptcha !== '' && this.state.emailExists === true){
                return(
                    <Button disabled raised="true" variant="raised" style={{height:40, width:'100%', background:'gray', color:'white', marginTop:20}} >Email Exists!</Button>
                )
            } else {
                return(
                    <Button disabled  raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:20, color:'white'}} >Hmmm... Something is not right...</Button>
                )
            }
        } else if (this.state.validEmail === false && (this.state.validPassword === false || this.state.validConfirmPassword === false) && this.state.recaptcha === ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Email | Password | Recaptcha</Button>
            )
        } else if (this.state.validEmail === false && (this.state.validPassword === true || this.state.validConfirmPassword === true) && this.state.recaptcha === ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Email | Recaptcha</Button>
            )
        } else if (this.state.validEmail === true && (this.state.validPassword === false || this.state.validConfirmPassword === false) && this.state.recaptcha === ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}> Password | Recaptcha</Button>
            )
        } else if (this.state.validEmail === true && this.state.validPassword === true && this.state.validConfirmPassword === true && this.state.recaptcha === ''){
            return(
                <Button disabled  raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:20, color:'white'}} >Are you a Robot? <span role="img" aria-label="emoji" style={{marginLeft:5}}>🤖</span></Button>
            )
        } else if (this.state.validEmail === false && (this.state.validPassword === true || this.state.validConfirmPassword === true) &&  this.state.recaptcha !== ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Confirm Email <span role="img" aria-label="emoji" style={{marginLeft:5}}>📮</span></Button>
            )
        } else if (this.state.validEmail === true && (this.state.validPassword === true || this.state.validConfirmPassword === true) && this.state.recaptcha !== '' && this.state.emailExists === true){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Email Exists!</Button>
            )
        }
        else if (this.state.validEmail === true && (this.state.validPassword === false || this.state.validConfirmPassword === false) &&  this.state.recaptcha !== ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Confirm Password <span role="img" aria-label="emoji" style={{marginLeft:5}}>🔐</span></Button>
            )
        }
        else
        {
            return(
                <Button  raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:20}} >Confirmed</Button>
            )
        }
    }

    renderSignup() {
        return (
            <Grid style={{background:'transparent'}} container direction={'column'} justify={'center'} alignItems={'center'}>
                <Paper square={false} style={{background:'#283593', width:428,maxWidth:"100%", marginTop:10}}>
                    <Grid item style={{margin:50, textAlign:'center', marginLeft:'auto',marginRight:'auto', width:'75%'}}>
                        <Typography variant="headline" style={{color:'white', marginTop:40}}>
                            <b>Create your account</b>
                        </Typography>

                        <InputGroup style={{marginTop:40}}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">📮</span></InputGroupText>
                            </InputGroupAddon>
                            {this.state.validEmail
                            ?
                            <Input valid placeholder="Email Address" onChange={this.handleEmail('email')}/>
                            :
                            <Input invalid placeholder="Email Address" onChange={this.handleEmail('email')}/>
                        }
                            {this.renderErrorEmail()}
                        </InputGroup>
                        <InputGroup style={{marginTop:40}}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">🔑</span></InputGroupText>
                            </InputGroupAddon>
                            {this.state.validPassword
                                ?
                                <Input valid type="password" placeholder="Password" onChange={this.handlePassword('password')}/>
                                :
                                <Input invalid type="password" placeholder="Password" onChange={this.handlePassword('password')}/>
                            }
                            {this.renderErrorPassword()}
                        </InputGroup>
                        <InputGroup style={{marginTop:40}}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">🔐</span></InputGroupText>
                            </InputGroupAddon>
                            {this.state.validConfirmPassword
                                ?
                                <Input valid type="password" placeholder="Confirm Password" onChange={this.handleConfirmPassword('confirmpassword')}/>
                                :
                                <Input invalid type="password" placeholder="Confirm Password" onChange={this.handleConfirmPassword('confirmpassword')}/>
                            }
                            {this.renderErrorConfirmPassword()}
                        </InputGroup>
                    <Grid item>
                        <ReCAPTCHA
                            style={{marginTop:40}}
                            ref="recaptcha"
                            sitekey="6LdOm2kUAAAAAADB0AG5kbLKCVWk7wNYqBoznwz3"
                            onChange={this.handleChangeRecaptcha.bind(this)}/>
                        {this.renderButton()}
                    </Grid>
                    </Grid>
                </Paper>
            </Grid>
        )
    }
    renderSelectPlan(){
      return (
          <Grid container style={{ background:'transparent'}} alignItems="center" direction="column" justify="center" >
            <Paper square={false} style={{background:'#283593',width:628,maxWidth:"100%", marginTop:10}}>
              <Typography variant="headline" style={{textAlign:'center',color:'white',marginTop:40}}><b>Select Plan</b></Typography><br/>
              <Grid item style={{marginLeft:'auto',marginRight:'auto', width:'75%',maxWidth:500, marginBottom:50, marginTop:0}} >
                  <Grid container style={{ background:'transparent'}} alignItems="center" direction="column" justify="center" spacing={8}>
                    <Grid item ><Button style={{background:'white',width:290, height:130}}><Typography style={{ textTransform:'none'}}>1 Year Starter</Typography></Button></Grid>
                    <Grid item ><Button style={{background:'white',width:290, height:130}}><Typography style={{ textTransform:'none'}}>1 Year Starter</Typography></Button></Grid>
                    <Grid item ><Button style={{background:'white',width:290, height:130}}><Typography style={{ textTransform:'none'}}>1 Year Starter</Typography></Button></Grid>
                    <Grid item ><Button raised="true" variant="raised" style={{marginLeft:'auto',marginRight:'auto',height:40, background:'#F44336', marginTop: 20,width:290}} onClick={() =>this.handleSelectPlanCancel()}>
                        <Typography style={{color:'white'}} variant={"body2"} >
                            cancel
                        </Typography>
                    </Button></Grid>
                  </Grid>

              </Grid>
            </Paper>
          </Grid>
        )
    }

    renderSubscription(){

        const {elementFontSize} = this.state;

        return (
            <Grid container style={{ background:'transparent'}} alignItems="center" direction="column" justify="center" >
              <Paper square={false} style={{background:'#283593',width:628,maxWidth:"100%", marginTop:10}}>
                <Typography variant="headline" style={{textAlign:'center',color:'white',marginTop:40}}><b>Cavalry subscription</b></Typography><br/>
                <Grid item style={{marginLeft:'auto',marginRight:'auto', width:'75%',maxWidth:500, marginBottom:50, marginTop:0}} >
                    <StripeProvider stripe={this.state.stripe}>
                        <div className="Checkout" >
                          <Typography variant="caption" style={{color:'#b2b9e1'}}>
                            You're about to set up an ongoing, autorenewing subscription to Cavalry for your email:
                          </Typography>
                            <Typography variant="caption" style={{color:'#b2b9e1', marginBottom:20 }}>
                                 <Typography style={{color:'white'}}>{this.state.email}</Typography><br/>
                                You'll pay USD $10.00 for this, monthly.<br/><br/>
                                This subscription will renew automatically each month until you cancel. You may cancel at any time. If you cancel, you will not be billed for any additional months of service, and service will continue until the end of the billing period. If you cancel, you will not receive a refund for any service already paid for. Receipts will be delivered via email.
                                By purchasing Cavalry Subscription, you agree to the Cavalry User Agreement.
                            </Typography>
                            <Elements >
                                <SplitForm fontSize={elementFontSize} />
                            </Elements>
                        </div>
                    </StripeProvider>
                    <Button raised="true" variant="raised" style={{marginLeft:'auto',marginRight:'auto',height:40, background:'#F44336', marginTop: 20,width:'100%'}} onClick={() =>this.handleCancel()}>
                        <Typography style={{color:'white'}} variant={"body2"} >
                            cancel
                        </Typography>
                    </Button>
                </Grid>
              </Paper>
            </Grid>
        )
    }

    renderThankYou(){
      return (
        <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"30em"}} alignItems="center" direction="column" justify="center" >
            <Typography variant="headline" style={{textAlign:'center',color:'white',marginTop:40}}>Thank you for your Subscription!</Typography>
            <Grid item style={{marginLeft:'auto',marginRight:'auto', width:'75%',maxWidth:500, marginBottom:40}} >
                <Typography variant="body2" style={{textAlign:'center',color:'white',marginTop:40}}>We will send you an Invoice to your email address: {this.state.email}</Typography>
            </Grid>
        </Grid>
      )
    }

    render() {

        let content = {};

        if (this.state.showAccountCreation === true){
            content = this.renderSignup()
        }

        if (this.state.showSelectPlan === true){
            content = this.renderSelectPlan()
        }


        if (this.state.showPaymentOption === true){
            content = this.renderSubscription()
        }

        if (this.state.userSuccessfullySubscribed === true){
          content = this.renderThankYou()
        }

        return (
            <div>
                <Header/>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        height: this.state.height+200
                    }}
                >
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                        <Grid style={{background:'transparent', width:'100%',height:105, marginTop:20}} container direction={'row'} justify={'center'} alignItems={'center'}>
                            <Paper style={{height:105, paddingLeft:20,paddingRight:20, background: "linear-gradient(to right, #ff1744, #F44336 "}}>
                                <Typography variant="display3"  style={{color:'white',textAlign:"center", marginTop:'auto',marginBottom:'auto', padding:'10px 0'}}>CAVALRY</Typography>
                            </Paper>
                        </Grid>
                        {content}
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ status, users }) {
    return { status,users };
}

export default connect(mapStateToProps,{pingBackend,setUserEmail,emailJidoka,applySecurity})(withRouter(Signup));
