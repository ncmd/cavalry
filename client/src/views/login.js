import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser,getAccount,loadOrganizationAll
} from '../redux/actions';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { InputGroup, InputGroupText, InputGroupAddon, Input, FormFeedback,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as auth from "../components/firebase/auth";
import { googleanalytics } from '../components/analytics';
import {Link} from "react-router-dom";
// const bodyBlue = "linear-gradient(#1a237e, #121858)";
const resetPasswordButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            email:'',
            password:'',
            status: null,
            emailExists:false,
            loginError: '',
            modal: false
        };
        this.toggle = this.toggle.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    componentDidMount() {
        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.interval);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
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
                // this.checkEmailExists(this.state.email);
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

    checkEmailExists(email){
        auth.checkEmailExists(email).then((response) => {
            console.log("Response:",response)
            if (response[0]=== "password"){
                this.setState({
                    emailExists:true,
                    emailError:"Email Exists!"
                });
                console.log(email, this.state.emailError)
            }
            if (response[0]!== "password"){
                this.setState({
                    emailExists:false,
                });
            }
        })

    }


    handlePassword = password => event => {

        this.setState({
            [password]: event.target.value,
        }, () => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
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
                // if (event.key === 'Enter') {
                //   this.handleLogin(this.state.email,this.state.password)
                // }
            }
        });
    };

    _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate');
    }
  }


    validatePassword(password){
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (passwordRegex.test(password)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validPassword:true})
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validPassword:false})
        }
    }

    renderButton(){
      return (
        <Button style={{height:40, marginTop:20,width:'100%',border:'1px solid rgba(27,31,35,0.2)', background:'#28a745', backgroundImage:'linear-gradient(-180deg,#3d63ff,#5533ff 90%)'}}  onClick={() =>this.handleLogin(this.state.email,this.state.password)}><Typography variant={'caption'} style={{ textTransform:'none', color:'white'}}><b>Sign in</b></Typography></Button>
      )

    }

    handleLogin(email,password){
      auth.doSignInWithEmailAndPassword(email,password).then((response) => {
          if (response === 'The password is invalid or the user does not have a password.'){
            googleanalytics.Cavalry_Webapp_Login_Account_Userfailedsignedin(email)
            this.setState({
              loginError: response
            })
          } else if (response.operationType === "signIn"){
            googleanalytics.Cavalry_Webapp_Login_Account_Usersignedin(email)
              this.props.loginUser(response.user.uid,email)
              this.props.getAccount(response.user.uid).then(() => {
                this.props.loadOrganizationAll(this.props.account.organizationname)
                if (this.props.account.stripeSubscriptionPlan === "1month" || this.props.account.stripeSubscriptionPlan === "12months" || this.props.account.stripeSubscriptionPlan === "beta" ){
                  this.props.history.push('/')
                } else {
                  this.props.history.push('/subscription')
                }
              })
          }
      }
    )
    }

    renderErrorEmail(){

        if (this.state.email !== '' && this.state.validEmail === false && this.state.emailError === null){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>Enter a valid Email Address</FormFeedback>
            )
        } else if (this.state.email !== '' && this.state.validEmail === true && this.state.emailError !== null){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>{this.state.emailError}</FormFeedback>
            )
        }
    }

    toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  passwordResetSetup(){
    auth.doPasswordReset(this.state.email)
    this.toggle()

  }

    renderLoginError(){
      if (this.state.loginError === ''){
        return (
          <div></div>
        )
      } else {
        return (
          <div>
            <Typography style={{color:this.props.theme[0].PostsTypographyDescription}} variant={'caption'}>{this.state.loginError}</Typography>
            <Button style={{background:resetPasswordButton}} onClick={() => this.passwordResetSetup()}><Typography style={{color:'white', textTransform:'none'}} variant={'caption'}><b>Reset password</b></Typography></Button>
              <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Reset link sent!</ModalHeader>
                <ModalBody>
                  Please check your Email for your password reset link.
                </ModalBody>
                <ModalFooter>
                  <Button style={{background:this.props.theme[0].PrimaryLinear}} onClick={ () => this.toggle()}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}}><b>Close</b></Typography></Button>{' '}
                </ModalFooter>
              </Modal>
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
                        background: this.props.theme[0].MainBackground,
                        height:this.state.height
                    }}
                >
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                        <Grid style={{ height:480,width:428, marginTop:20, marginLeft:'auto', marginRight:'auto'}} container direction={'row'} justify={'center'} alignItems={'flex-start'}>
                                <Grid item style={{ textAlign:'center', marginTop:20,marginLeft:'auto',marginRight:'auto', width:'75%'}}>
                                  <img src="./cavalry.svg" style={{width:70,height:70}}></img>
                                    <Typography style={{color:this.props.theme[0].PostsTypographyTitle, margin:20, letterSpacing:'-0.5px', fontSize:'24px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                                        <b>Sign in to Cavalry</b>
                                    </Typography>
                                </Grid>
                                <Grid item style={{ textAlign:'center', marginLeft:'auto',marginRight:'auto', width:'90%', background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, padding:20}}>
                                  <Typography variant={'caption'} style={{marginTop:20, marginBottom:10, textAlign:'left', color:this.props.theme[0].PostsTypographyDescription}} ><b>Email address</b></Typography>
                                  <InputGroup >
                                      <Input style={{ border:this.props.theme[0].PostsButtonBorder, boxShadow:'0px 0px 0px 0px'}} placeholder="" onChange={this.handleEmail('email')}/>
                                  </InputGroup>
                                  <Typography variant={'caption'} style={{marginTop:20, marginBottom:10, textAlign:'left', color:this.props.theme[0].PostsTypographyDescription}} ><b>Password</b></Typography>
                                  <InputGroup>
                                      {this.state.validPassword
                                          ?
                                          <Input valid  style={{ border:this.props.theme[0].PostsButtonBorder, boxShadow:'0px 0px 0px 0px'}} type="password" placeholder="" onChange={this.handlePassword('password')}/>
                                          :
                                          <Input invalid style={{ border:this.props.theme[0].PostsButtonBorder, boxShadow:'0px 0px 0px 0px'}} type="password" placeholder="" onChange={this.handlePassword('password')}/>
                                      }
                                  </InputGroup>
                                  {this.renderLoginError()}
                                  {this.renderButton()}
                                </Grid>
                                <Grid item style={{ marginTop:20,textAlign:'center', marginLeft:'auto',marginRight:'auto', width:'90%', background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, padding:20}}>
                                  <Typography style={{color:this.props.theme[0].PostsTypographyTitle, margin:10, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                                      <b>New to Cavalry? <Link to={{ pathname: '/signup'}}>Create an account.</Link></b>
                                  </Typography>
                                </Grid>

                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ users,account,theme }) {
    return { users, account,theme };
}

export default connect(mapStateToProps,{loginUser, getAccount,loadOrganizationAll})(withRouter(Login));
