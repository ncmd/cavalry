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
import Check from '@material-ui/icons/Check';
import '../components/ribbon/ribbon.css';
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
            selectItem1:false,
            selectItem2:true,
            selectItem3:false,
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
                <Paper square={false} style={{background:'#283593', width:428,maxWidth:"100%", marginTop:20}}>
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

    handleClickItem1(){
      this.setState({
        selectItem1:true,
        selectItem2:false,
        selectItem3:false,
      })
    }
    handleClickItem2(){
      this.setState({
        selectItem1:false,
        selectItem2:true,
        selectItem3:false,
      })
    }
    handleClickItem3(){
      this.setState({
        selectItem1:false,
        selectItem2:false,
        selectItem3:true,
      })
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

        const {elementFontSize} = this.state;

        return (
            <div>
                <Header/>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        paddingLeft:10,
                        paddingRight:10,

                    }}
                >
                    <Grid container style={{flexGrow:1, margin:"0 auto", paddingTop:10, paddingBottom:20, maxWidth:"50em", background:"#1a237e"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item style={{marginLeft:'auto',marginRight:'auto'}}>
                        <Typography variant={'headline'} style={{color:'white'}}><b>Cheaper</b> than your monthly <span aria-label="emoji" role="img">☕</span> coffee habit.</Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <Typography variant={'subheading'} style={{color:'white'}}>
                          <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>1</Typography> <b>Select a plan that works for you:</b>
                        </Typography>
                      </Grid>
                      </Grid>
                        <Grid container style={{flexGrow:1,border:'1px solid #474f97', margin:"0 auto", marginTop:20, maxWidth:"50em", padding:40}} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem1
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem1()}}>
                                <div className="ribbonblue"><span aria-label="emoji" role="img">❄️Cool❄️</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>1 Month</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$10.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                  <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$10.00</b> billed every 1 month</Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem1()}}>
                                <div className="ribbonblue"><span aria-label="emoji" role="img">❄️Cool❄️</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>1 Month</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$10.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$10.00</b> billed every 1 month</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem2
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Popular🔥</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>12 Months</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$8.33</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$99.96</b> billed every 12 months</Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Popular🔥</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>12 Months</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$8.33</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$99.96</b> billed every 12 months</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem3
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem3()}}>
                                   <div className="ribbonpurple"><span aria-label="emoji" role="img">💎Epic💎</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Lifetime</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$300.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>once only</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$300.00</b> billed once </Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem3()}}>
                                <div className="ribbonpurple"><span aria-label="emoji" role="img">💎Epic💎</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Lifetime</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$300.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>once only</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$300.00</b> billed once only</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item>
                            <Typography variant={'caption'} style={{color:'white'}}>All amounts are shown in <b>USD</b></Typography>
                          </Grid>
                        </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <Typography variant={'subheading'} style={{color:'white'}}>
                          <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>2</Typography> <b>Enter your email address:</b>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item xs style={{ border:'1px solid #474f97', padding:40, width:'100%'}}>
                        <Typography variant={'body2'} style={{color:'white'}}> <b>Privacy guarantee:</b> We do not share your information and will contact you only as needed to provide our service.</Typography>
                        <InputGroup style={{marginTop:20}}>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">📧</span></InputGroupText>
                            </InputGroupAddon>
                            {this.state.validEmail
                            ?
                            <Input valid style={{border:0, borderRadius:'0 5px 5px 0'}} placeholder="email👩‍💻@gmail.com" onChange={this.handleEmail('email')}/>
                            :
                            <Input invalid  style={{border:0, borderRadius:'0 5px 5px 0'}} placeholder="email👩‍💻@gmail.com" onChange={this.handleEmail('email')}/>
                        }
                            {this.renderErrorEmail()}
                        </InputGroup>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <Typography variant={'subheading'} style={{color:'white'}}>
                          <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>3</Typography> <b>Verify ReCAPTCHA:</b>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item style={{ border:'1px solid #474f97', padding:40, width:'100%'}} xs>
                        <Typography variant={'body2'} style={{color:'white'}}> <b>Fraud Detection:</b> We keep the <span aria-label="emoji" role="img">🤖</span> bots away and do our best to provide you get great content with no interruption.</Typography>
                        <ReCAPTCHA
                            style={{marginTop:20}}
                            ref="recaptcha"
                            sitekey="6LdOm2kUAAAAAADB0AG5kbLKCVWk7wNYqBoznwz3"
                            onChange={this.handleChangeRecaptcha.bind(this)}/>
                    </Grid>
                  </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <Typography variant={'subheading'} style={{color:'white'}}>
                          <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>4</Typography> <b>Enter payment information:</b>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'row'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item xs style={{ padding:40, paddingTop:0,paddingBottom:0}}>
                          <StripeProvider stripe={this.state.stripe}>
                              <div className="Checkout" >
                                  <Elements >
                                      <SplitForm fontSize={elementFontSize} />
                                  </Elements>
                              </div>
                          </StripeProvider>
                      </Grid>
                      <Grid item style={{ border:'1px solid #474f97', padding:40}} xs>
                        <Typography style={{color:'white'}} variant={'title'}><b>This Plan includes:</b></Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> No Advertisements</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> 24/7 customer support by email</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> 95.9% SLA uptime</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> Access to recruiting network</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> Never selling your data</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> 30 days risk-free</Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:100}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item >
                        <Typography variant={'caption'} style={{color:'white'}}>
                          <span aria-label="emoji" role="img">🔒</span> Secure Server Secure checkout. You are 100% backed by our 30-Day Money-Back Guarantee.<br/>
                          By submitting this form you agree to our Terms of service
                        </Typography>

                      </Grid>
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
