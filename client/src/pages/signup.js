import React, { Component } from 'react';
import Header from '../components/header/header';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser,createAccount
} from '../redux/actions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Progress ,InputGroup, InputGroupText, InputGroupAddon, Input , FormFeedback } from 'reactstrap';
import {Elements, StripeProvider} from "react-stripe-elements";
import SplitForm from "../components/stripe/splitform";
import { auth } from '../components/firebase';
import Check from '@material-ui/icons/Check';
import '../components/ribbon/ribbon.css';
import {Link} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { googleanalytics } from '../components/analytics';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const keys = require('../secrets/keys');

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            status: null,
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
            stripe:null,
            email:'',
            password:'ChangePass@123',
            confirmpassword:'',
            error:null,
            emailExists:false,
            emailError:null,
            emailChanged:true,
            sContact:false,
            validEmail: false,
            validPassword: false,
            validConfirmPassword: false,
            recaptcha:'',
            userSuccessfullySubscribed:false,
            tooltipEmailError:'',
            dialog: false,
            completed: 0,
            progresscompleted:0,
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
        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.validateCaptchaClick = this.validateCaptchaClick.bind(this);

    }

    handleClickOpenDialog = () => {
      this.props.setStripeModal()
      console.log("open")
    };

    handleCloseDialog(){
      console.log("close")
    };

    componentDidMount() {

        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

    }

    handleEmail = email => event => {

        this.setState({
            [email]: event.target.value,
            emailChanged: true
        }, () => {
            const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            setTimeout(() => {
                this.setState({
                  emailChanged:false
                })
            }, 900);

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
                setTimeout(() => {
                  if(this.state.emailChanged === false){
                    this.checkEmailExists(this.state.email);
                    this.setState({
                      sContact: false,
                      recaptcha: ''
                    })
                  }
                }, 1300);
            }
        });

    };

    validateEmail(email){
        const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailRegex.test(email)) {
            // // console.log("Valid Email Address:",email);
            this.setState({
              validEmail:true,
              recaptcha:''
            });
            // this.checkEmailExists(email)

        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({
              validEmail:false,
              recaptcha:''
            })
        }
    }

    checkEmailExists(email){
        auth.checkEmailExists(email).then((response) => {
            if (response[0]=== "password"){
                this.setState({
                  validEmail:false,
                  emailExists:true,
                  emailError:"This email address exists. Login or reset password.",
                  tooltipEmailError:'This email address exists. Login or reset password.'
                });
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
            this.props.setUserEmail(this.state.email);
        }
    };

    handleCancel(){
        this.setState({
            sContact: false,
            recaptcha: '',
            emailError: null
        });
    };



    handleChangeRecaptcha(event) {
        this.setState({ recaptcha:event});
        this.validateCaptchaClick()
    }

    validateCaptchaClick(){

        // console.log("Button Clicked!");
        if (this.state.validEmail === true){
          // console.log("props.applySecurity:",this.state.email, this.state.recaptcha)
            this.props.applySecurity(this.state.email, this.state.recaptcha)
            googleanalytics.Cavalry_Webapp_Signup_Signup_Userclickedrecaptcha(this.state.email)
            // console.log("ALL VALID");
            this.setState({
                sContact: true
            }, () => {
              this.handleAccountCreation()

              // create account in firebase
              this.props.createAccount(this.state.email)
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
        if (this.state.email !== '' && (this.state.validEmail === true|| this.state.validEmail === false) && this.state.emailError !== null){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>{this.state.emailError}</FormFeedback>
            )
        }
    }


    renderEmailAddress(){

        return (

          <InputGroup>
              <InputGroupAddon addonType="prepend">
                  <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">📧</span></InputGroupText>
              </InputGroupAddon>
              {this.state.validEmail
              ?
              <Input valid style={{border:0, borderRadius:'0 5px 5px 0'}} placeholder="email@gmail.com" onChange={this.handleEmail('email')}/>
              :
              <Input invalid  style={{border:0, borderRadius:'0 5px 5px 0'}} placeholder="email@gmail.com" onChange={this.handleEmail('email')}/>
          }
              {this.renderErrorEmail()}
          </InputGroup>

        )
    }

    renderRecaptcha(){
      if (this.state.validEmail === true && this.state.emailChanged === false ){
        return (
          <ReCAPTCHA
              ref="recaptcha"
              sitekey={keys.google_recaptcha_site_key}
              onChange={this.handleChangeRecaptcha.bind(this)}/>
        )
      }  else {
        return (
          <div style={{width:273,height:78, background:'#474f97',borderRadius:'5px 5px 5px 5px',textAlign:'center',}}>
            <Typography style={{color:'white', display: 'inline-block', padding:'25px 0'}} variant={'body2'}>Please finish section <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>1</Typography></Typography>
          </div>
        )
      }
    }

    renderSignup(){
      if (this.state.sContact === true){
        return (
          <div>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item xs style={{ border:'1px solid #474f97', padding:40, width:'100%'}}>
                <Typography variant={'body2'} style={{color:'white'}}> Sent your password to your email address.</Typography>
                  <Link to={{pathname:'/login'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
                      <Button raised="true" variant="raised" style={{height:30, background:'#474f97', textTransform: 'none'}}>
                          <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                              <b>Log in</b>
                          </Typography>
                      </Button>
                  </Link>
              </Grid>
            </Grid>
          </div>
        )
      } else {
        return (
          <div>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item>
                <Typography variant={'subheading'} style={{color:'white'}}>
                  <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>1</Typography> <b>Enter your email address:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item xs style={{ border:'1px solid #474f97', padding:40, width:'100%'}}>
                <Typography variant={'body2'} style={{color:'white'}}> <b>Privacy guarantee:</b> We do not share your information and will contact you only as needed to provide our service.</Typography>
                {this.renderEmailAddress()}
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item>
                <Typography variant={'subheading'} style={{color:'white'}}>
                  <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>2</Typography> <b>Verify reCAPTCHA:</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item style={{ border:'1px solid #474f97', padding:40, width:'100%'}} xs>
                <Typography variant={'body2'} style={{color:'white'}}> <b>Fraud Detection:</b> We keep the <span aria-label="emoji" role="img">🤖</span> bots away and do our best to provide you great content with no interruption.</Typography>
                {this.renderRecaptcha()}
            </Grid>
          </Grid>
          </div>
        )
      }
    }

    render() {
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
                        height:this.state.height

                    }}
                >
                    {this.renderSignup()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({ status, users, stripe }) {
    return { status,users, stripe };
}

export default connect(mapStateToProps,{pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser,createAccount})(withRouter(Signup));
