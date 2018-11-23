import React, { Component } from 'react';
import Header from '../components/header/header';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser,createAccount
} from '../redux/actions';
import Button from '@material-ui/core/Button';
import { InputGroup,Input , FormFeedback } from 'reactstrap';
import { auth } from '../components/firebase';
import '../components/ribbon/ribbon.css';
import {Link} from "react-router-dom";
import { googleanalytics } from '../components/analytics';

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
            username:'',
            password:'ChangePass@123',
            confirmpassword:'',
            error:null,
            usernameExists:false,
            emailExists:false,
            usernameError:null,
            emailError:null,
            usernameChanged: true,
            emailChanged:true,
            sContact:false,
            validUsername: false,
            validEmail: false,
            validPassword: false,
            validConfirmPassword: false,
            redirectToLogin:false,
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
        this.handleUsername = this.handleUsername.bind(this);
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
    handleUsername = username => event => {

        this.setState({
            [username]: event.target.value,
            usernameChanged: true
        }, () => {
            const usernameRegex = /^[a-z0-9]{3,20}$/
            setTimeout(() => {
                this.setState({
                  usernameChanged:false
                })
            }, 900);

            if (usernameRegex.test(username)) {
                // // console.log("Valid Username:",username);
            } else {
                // Invalid phone number
                // // console.log("Invalid Username:",username);
                this.setState({validUsername:false})
            }
            if (this.state.validUsername === false){
                // // console.log(event.target.value);
                this.validateUsername(this.state.username);
            }
            if (this.state.validUsername === true){
                // // console.log(event.target.value);
                this.validateUsername(this.state.username);
                // setTimeout(() => {
                //   if(this.state.usernameChanged === false){
                //     this.checkUsernameExists(this.state.username);
                //     this.setState({
                //       sContact: false,
                //       recaptcha: ''
                //     })
                //   }
                // }, 1300);
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

    validateUsername(username){
      const usernameRegex = /^[a-z0-9]{3,20}$/
      if (usernameRegex.test(username)) {
          // // console.log("Valid Username Address:",username);
          this.setState({
            validUsername:true,
            recaptcha:''
          });
          // this.checkUsernameExists(username)

      } else {
          // Invalid phone number
          // // console.log("Invalid Username Address:",username);
          this.setState({
            validUsername:false,
            recaptcha:''
          })
      }
  }

  checkUsernameExists(username){
      auth.checkUsernameExists(username).then((response) => {
          if (response[0]=== "password"){
              this.setState({
                validUsername:false,
                usernameExists:true,
                usernameError:"This username exists. Login or reset password.",
                tooltipUsernameError:'This username exists. Login or reset password.'
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
              // this.handleAccountCreation()
              //
              // // create account in firebase
              // this.props.createAccount(this.state.email)
            })
        } else {
            // console.log("SOMETHING IS NOT VALID!",this.state.validEmail)
        }
    }

    handleCreateAnAccountButton(){
      if (this.state.sContact === true){
        this.handleAccountCreation()

        // create account in firebase
        this.props.createAccount(this.state.email,this.state.username)
        this.setState({
          redirectToLogin: true
        })
      }
    }

    renderErrorEmail(){
        if (this.state.email !== '' && this.state.validEmail === false && this.state.emailError === null){
            return(
                <FormFeedback tooltip style={{ letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>Enter a valid Email Address</FormFeedback>
            )

        }
        if (this.state.email !== '' && (this.state.validEmail === true|| this.state.validEmail === false) && this.state.emailError !== null){
            return(
                <FormFeedback tooltip style={{ letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>{this.state.emailError}</FormFeedback>
            )
        }
    }
    renderErrorUsername(){
        if (this.state.username !== '' && this.state.validUsername === false && this.state.usernameError === null){
            return(
                <FormFeedback tooltip style={{ letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>Lowercase letters, numbers, and must be between 3 - 20 characters</FormFeedback>
            )
        }
        if (this.state.username !== '' && (this.state.validUsername === true|| this.state.validUsername === false) && this.state.usernameError !== null){
            return(
                <FormFeedback tooltip style={{letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>{this.state.usernameError}</FormFeedback>
            )
        }
    }


    renderEmailAddress(){

        return (

          <InputGroup>
              {this.state.validEmail
              ?
              <Input valid style={{ width:'100%',minWidth:270,border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, boxShadow:'0px 0px 0px 0px', letterSpacing:'-0.5px', fontSize:'20px', fontWeight:400, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} placeholder="" onChange={this.handleEmail('email')}/>
              :
              <Input invalid  style={{ width:'100%',minWidth:270,border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, boxShadow:'0px 0px 0px 0px', letterSpacing:'-0.5px', fontSize:'20px', fontWeight:400, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} placeholder="" onChange={this.handleEmail('email')}/>
          }
              {this.renderErrorEmail()}
          </InputGroup>

        )
    }

    renderUsername(){

        return (

          <InputGroup>
              {this.state.validUsername
              ?
                <Input valid style={{width:'100%',minWidth:270,border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, boxShadow:'0px 0px 0px 0px', letterSpacing:'-0.5px', fontSize:'20px', fontWeight:400, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} placeholder="" onChange={this.handleUsername('username')}/>

              :
              <Input invalid style={{width:'100%',minWidth:270, border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, boxShadow:'0px 0px 0px 0px', letterSpacing:'-0.5px', fontSize:'20px', fontWeight:400, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} placeholder="" onChange={this.handleUsername('username')}/>

          }
              {this.renderErrorUsername()}
          </InputGroup>

        )
    }

    renderRecaptcha(){
      if (this.state.validEmail === true && this.state.validUsername === true && this.state.emailChanged === false && this.state.usernameChanged === false ){
        return (
          <ReCAPTCHA
              ref="recaptcha"
              sitekey={keys.google_recaptcha_site_key}
              onChange={this.handleChangeRecaptcha.bind(this)}/>
        )
      }  else {
        return (
          <div style={{width:273,height:78, background:"grey",borderRadius:'5px 5px 5px 5px',textAlign:'center',}}>
            <div style={{color:'white', display: 'inline-block', padding:'25px 0',letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Enter a valid Username & Email address</b></div>
          </div>
        )
      }
    }

    renderCreateAnAccountButton(){
      if (this.state.sContact === false){
        return (
          <Button disabled style={{height:40, marginTop:20,width:313,border:'1px solid rgba(27,31,35,0.2)', background:'grey'}}>
            <div  style={{ textTransform:'none', color:'white', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}><b>Verify ReCAPTCHA</b></div></Button>

        )
      }
      if (this.state.sContact === true){
        return (
          <Button style={{height:40, marginTop:20,width:313,border:'1px solid rgba(27,31,35,0.2)', background:'#28a745', backgroundImage:'linear-gradient(-180deg,#3d63ff,#5533ff 90%)'}} onClick={()=> this.handleCreateAnAccountButton()}>
            <div  style={{ textTransform:'none', color:'white', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}><b>Create an account</b></div></Button>

        )
      }

    }

    renderSignup(){
      if (this.state.sContact === true && this.state.redirectToLogin === true){
        return (
          <div>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item xs style={{ border:this.props.theme[0].PostsButtonBorder,  background:this.props.theme[0].PostsButtonBackground,borderRadius:this.props.theme[0].BorderRadius, padding:40, width:'100%'}}>
                <div  style={{color:this.props.theme[0].PostsTypographyTitle}}> Sent your password to your email address.</div>
                  <Link to={{pathname:'/login'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
                      <Button style={{height:30, background:this.props.theme[0].PrimaryLinear, textTransform: 'none'}}>
                          <div style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                              <b>Log in</b>
                          </div>
                      </Button>
                  </Link>
              </Grid>
            </Grid>
          </div>
        )
      } else {
        return (
          <div>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item style={{marginBottom:30}}>
                <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'39px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                    <b>Join Cavalry</b>
                </div>
                <div style={{color:this.props.theme[0].PostsTypographyTitle, marginTop:16,letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                    The best way to create, share, and coordinate your team with runbooks.
                </div>
              </Grid>
              <Grid item>
                <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                    <b>Create your account</b>
                </div>
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item xs style={{ border:this.props.theme[0].PostsButtonBorder, background:this.props.theme[0].PostsButtonBackground,borderRadius:this.props.theme[0].BorderRadius, padding:20, width:'100%'}}>
                <div  style={{marginBottom:10, textAlign:'left', color:this.props.theme[0].PostsTypographyDescription, letterSpacing:'-0.5px', fontSize:'20px', fontWeight:340, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Username</b></div>
                <Grid container style={{flexGrow:1, margin:"0 auto"}} direction={'row'} justify={'flex-start'} alignItems={'center'}>
                  <Grid item xs>
                    {this.renderUsername()}
                  </Grid>
                  <Grid item xs style={{marginLeft: 5}}>
                    <div style={{ color:this.props.theme[0].PostsTypographyTitle, textAlign:'left',letterSpacing:'-0.5px', fontSize:'14px', fontWeight:340, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                      {this.state.username.length}/20
                    </div>
                  </Grid>
                </Grid>
                <div  style={{marginTop:5,color:this.props.theme[0].PostsTypographyTitle,  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>What should we call you? You can create or join an organization later.</div>
                <div  style={{marginTop:20,marginBottom:10, textAlign:'left', color:this.props.theme[0].PostsTypographyDescription, letterSpacing:'-0.5px', fontSize:'20px', fontWeight:340, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Email address</b></div>
                {this.renderEmailAddress()}
                <div  style={{marginTop:5,color:this.props.theme[0].PostsTypographyTitle,  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>We’ll send updates to this inbox. We’ll never share your email address with anyone.</div>
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item>
                <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:300, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                    <b>Verify account</b>
                </div>
              </Grid>
            </Grid>
            <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
              <Grid item style={{border:this.props.theme[0].PostsButtonBorder, background:this.props.theme[0].PostsButtonBackground,borderRadius:this.props.theme[0].BorderRadius, padding:20, width:'100%'}} xs>
                <div  style={{marginBottom:10, textAlign:'left', color:this.props.theme[0].PostsTypographyDescription, letterSpacing:'-0.5px', fontSize:'20px', fontWeight:340, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Complete ReCAPTCHA</b></div>
                {this.renderRecaptcha()}
                <div  style={{borderTop:this.props.theme[0].PostsButtonBorder,borderBottom:this.props.theme[0].PostsButtonBorder, marginTop:20,padding:10,color:this.props.theme[0].PostsTypographyTitle,letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>By clicking on “<b>Create an account</b>” below, you agree to our <Link to={{pathname:'/terms'}} onClick={() => {console.log("clicked terms")}}>terms of service</Link> and <Link to={{pathname:'/privacy'}} onClick={() => {console.log("clicked privacy statement")}}>privacy statement</Link>.</div>
                {this.renderCreateAnAccountButton()}
            </Grid>
          </Grid>
          </div>
        )
      }
    }

    renderTheme(){
      if (this.props.theme.length > 0){
        return this.props.theme[0].MainBackground
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
                        background: this.renderTheme(),
                        paddingLeft:10,
                        paddingRight:10,
                        height:this.state.height+363,
                        marginTop:48,
                        paddingTop:24,
                    }}
                >
                    {this.renderSignup()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({ status, users, stripe,theme }) {
    return { status,users, stripe,theme };
}

export default connect(mapStateToProps,{pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser,createAccount})(withRouter(Signup));
