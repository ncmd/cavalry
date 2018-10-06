import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser,
} from '../redux/actions';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { InputGroup, InputGroupText, InputGroupAddon, Input, FormFeedback } from 'reactstrap';
import * as auth from "../components/firebase/auth";

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const resetPasswordButton = "linear-gradient(to right, #ff1744, #F44336 ";

class PasswordReset extends Component {

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
        };
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
        if (this.state.validEmail === true && this.state.emailExists === true && this.state.password !== ''){
            return(
                <Button raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:40}}  onClick={() =>this.handleLogin(this.state.email,this.state.password)}>Login</Button>
            )
        } else if (this.state.validEmail === true && this.state.emailExists === false){
            return(
                <Button disabled raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:40}}> This account does not exist</Button>
            )
        }else if (this.state.validEmail === true && this.state.emailExists === true && this.state.password === ''){
            return(
                <Button disabled raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:40}}> Enter your password</Button>
            )
        }

        else if (this.state.validEmail !== true && this.state.emailExists === false){
            return(
                <Button disabled raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:40}}> Enter a valid email address</Button>
            )
        } else {
            return(
                <Button disabled raised="true" variant="raised" style={{height:40, width:'100%', background:'#6772e5', marginTop:40}}> Enter a valid email address</Button>
            )
        }
    }

    handleLogin(email,password){
      auth.doSignInWithEmailAndPassword(email,password).then((response) => {
          if (response === 'The password is invalid or the user does not have a password.'){
            this.setState({
              loginError: response
            })
          } else if (response.operationType === "signIn"){
              this.props.loginUser(response.user.uid)
              this.props.history.push('/')
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

    renderLoginError(){
      if (this.state.loginError === ''){
        return (
          <div></div>
        )
      } else {
        return (
          <div>
            <Typography style={{color:'white'}} variant={'caption'}>{this.state.loginError}</Typography>
            <Button style={{background:resetPasswordButton}} onClick={() => auth.doPasswordReset(this.state.email)}><Typography style={{color:'white'}} variant={'caption'}><b>Reset password</b></Typography></Button>
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
                        height:this.state.height
                    }}
                >
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                        <Grid style={{background:'transparent'}} container direction={'row'} justify={'center'} alignItems={'center'}>
                            <Paper square={false} style={{background:'#283593', height:425,width:428,maxWidth:"95%", marginTop:20}}>
                                <Grid item style={{margin:20, textAlign:'center', marginLeft:'auto',marginRight:'auto', width:'75%'}}>
                                    <Typography variant="headline" style={{color:'white', marginTop:40}}>
                                        <b>Create a new password</b>
                                    </Typography>
                                    <InputGroup style={{marginTop:40}}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">🔑</span></InputGroupText>
                                        </InputGroupAddon>
                                        {this.state.validPassword
                                            ?
                                            <Input valid  style={{border:0}} type="password" placeholder="Password" onChange={this.handlePassword('password')}/>
                                            :
                                            <Input invalid style={{border:0}} type="password" placeholder="Password" onChange={this.handlePassword('password')}/>
                                        }
                                    </InputGroup>
                                    <InputGroup style={{marginTop:40}}>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">🔑</span></InputGroupText>
                                        </InputGroupAddon>
                                        {this.state.validPassword
                                            ?
                                            <Input valid  style={{border:0}} type="password" placeholder="Verify Password" onChange={this.handlePassword('password')}/>
                                            :
                                            <Input invalid style={{border:0}} type="password" placeholder="Verify Password" onChange={this.handlePassword('password')}/>
                                        }
                                    </InputGroup>
                                    {this.renderLoginError()}
                                    {this.renderButton()}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ users }) {
    return { users };
}

export default connect(mapStateToProps,{loginUser})(withRouter(PasswordReset));
