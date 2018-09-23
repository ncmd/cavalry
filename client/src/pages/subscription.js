import React, { Component } from 'react';
import Header from '../components/header/header';
import ReCAPTCHA from 'react-google-recaptcha';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser
} from '../redux/actions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Progress ,InputGroup, InputGroupText, InputGroupAddon, Input , FormFeedback } from 'reactstrap';
import {Elements, StripeProvider} from "react-stripe-elements";
import SplitForm from "../components/stripe/splitform";
import { auth } from '../components/firebase';
import Check from '@material-ui/icons/Check';
import '../components/ribbon/ribbon.css';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { googleanalytics } from '../components/analytics';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const keys = require('../secrets/keys');

class Subscription extends Component {

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
            scontact:false,
            validEmail: false,
            validPassword: false,
            validConfirmPassword: false,
            recaptcha:'',
            userSuccessfullySubscribed:false,
            tooltipEmailError:'',
            selectItem1:false,
            selectItem2:false,
            selectItem3:false,
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

    }

    handleClickOpenDialog = () => {
      this.props.setStripeModal()
      console.log("open")
    };

    handleCloseDialog(){
      console.log("close")
      this.props.history.push('/')
    };

    componentDidMount() {

        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        // console.log("Process.env.NODE_ENV:",process.env.NODE_ENV)
        if (window.Stripe) {
            this.setState({stripe: window.Stripe(keys.stripe_publishable_key)});
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                // Create Stripe instance once Stripe.js loads
                this.setState({stripe: window.Stripe(keys.stripe_publishable_key)});
            });
        }
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
            this.props.setUserEmail(this.state.email,this.state.password);
        }
    };

    handleCancel(){
        this.setState({
            sContact: false,
            recaptcha: '',
            emailError: null
        });
    };

    handleSelectPlanCancel(){
        this.setState({
            sContact: false,
            recaptcha: '',
            emailError: null
        });
    };

    handleClickItem1(){
      this.props.setPlan("1month")
      googleanalytics.Cavalry_Webapp_Signup_Signup_Userselectedplan("1month")
      this.setState({
        selectItem1:true,
        selectItem2:false,
        selectItem3:false,
      })
    }
    handleClickItem2(){
      this.props.setPlan("12months")
      googleanalytics.Cavalry_Webapp_Signup_Signup_Userselectedplan("12month")
      this.setState({
        selectItem1:false,
        selectItem2:true,
        selectItem3:false,
      })
    }
    handleClickItem3(){
      this.props.setPlan("beta")
      googleanalytics.Cavalry_Webapp_Signup_Signup_Userselectedplan("beta")
      this.setState({
        selectItem1:false,
        selectItem2:false,
        selectItem3:true,
      })
    }

    renderProgress = () => {
      if (this.state.progresscompleted > 100) {
        this.setState({ progresscompleted: 0, buffer: 5 });
      } else {
        this.setState({ progresscompleted: this.state.progresscompleted + 10, });
      }
    }

    renderStripe(){
      const {elementFontSize} = this.state;

      if(this.state.selectItem1 === true || this.state.selectItem2 === true || this.state.selectItem3 === true ){
        return (
          <StripeProvider stripe={this.state.stripe}>
              <div className="Checkout" style={{padding:0}} >
                  <Elements >
                      <SplitForm fontSize={elementFontSize} />
                  </Elements>
              </div>
          </StripeProvider>
        )

      } else {
        return (
          <div style={{width:273,height:360, marginBottom:20, background:'#474f97',borderRadius:'5px 5px 5px 5px',textAlign:'center',}}>
            <Typography style={{color:'white', display: 'inline-block', padding:'25px 0'}} variant={'body2'}>Please finish section <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>1</Typography></Typography>
          </div>
        )
      }
    }

    renderModal(){
      this.props.setStripeModal()
      setInterval(this.renderProgress(), 100);
      setInterval(this.props.setStripeProgress(this.state.progresscompleted), 100);
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
                        height:this.state.height,
                    }}
                >
                        <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                          <Grid item>
                            <Typography variant={'subheading'} style={{color:'white'}}>
                              <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>1</Typography> <b>Select a plan that works for you:</b>
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container style={{flexGrow:1,border:'1px solid #474f97', margin:"0 auto", maxWidth:"50em", padding:40, marginTop:20}} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem1
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem1()}}>
                                <div className="ribbonblue"><span aria-label="emoji" role="img">❄️Cool❄️</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>1 Month</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$35.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                  <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$35.00</b> billed every month</Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>(<b>$420.00</b> per year)</Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem1()}}>
                                <div className="ribbonblue"><span aria-label="emoji" role="img">❄️Cool❄️</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>1 Month</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$35.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$35.00</b> billed every month</Typography>
                                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b>$420.00</b> per year)</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem2
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>12 Months</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$25.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$300.00</b> billed every 12 months</Typography>
                                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b>$300.00</b> per year)</Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>12 Months</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$25.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$300.00</b> billed every 12 months</Typography>
                                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b>$300.00</b> per year)</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem3
                              ?
                              <Button className="box" style={{background:'white', height:250, width:265, border:'8px solid #00e676'}} onClick={()=> {this.handleClickItem3()}}>
                                   <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Beta</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$1.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>for now...</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$1.00</b> billed every month</Typography>
                                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</Typography>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:'white', height:230, width:230}} onClick={()=> {this.handleClickItem3()}}>
                                <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                                <div>
                                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Beta</Typography>
                                  <Typography style={{color:'black'}} variant={'display1'}><b>$1.00</b></Typography>
                                  <Typography style={{textTransform:'none'}} variant={'caption'}>per month</Typography>
                                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$1.00</b> billed every month</Typography>
                                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</Typography>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant={'caption'} style={{color:'white', textAlign:'center'}}>All amounts are shown in <b>USD</b></Typography>
                          </Grid>
                        </Grid>

                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <Typography variant={'subheading'} style={{color:'white'}}>
                          <Typography style={{background:'red', width:23,height:23, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>2</Typography> <b>Enter payment information:</b>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'row'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item xs style={{ padding:40, paddingTop:0,paddingBottom:0}}>
                          {this.renderStripe()}
                      </Grid>
                      <Grid item style={{ border:'1px solid #474f97', padding:40}} xs>
                        <Typography style={{color:'white'}} variant={'title'}><b>This plan includes:</b></Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> <span aria-label="emoji" role="img">🚫</span> No Advertisements</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> 24/7 support by <span aria-label="emoji" role="img">📧</span> email</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> <span aria-label="emoji" role="img">📚</span> Unlimited runbook access</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> Able to request for <span aria-label="emoji" role="img">📕</span> runbooks</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> Able to request new <span aria-label="emoji" role="img">😍</span> features</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> Create & edit your <span aria-label="emoji" role="img">📖</span> runbooks</Typography>
                        <Typography style={{color:'white',padding:5}} variant={'body2'}><Check style={{color:'#00e676'}}/> 95.9% SLA <span aria-label="emoji" role="img">👍</span> uptime</Typography>
                      </Grid>
                    </Grid>
                </div>
                <Dialog
                  disableBackdropClick
                  disableEscapeKeyDown
                  open={this.props.stripe.modal}
                  onClose={this.handleCloseDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Setting up your account..."}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description-1">
                      Setting up your subscription!
                    </DialogContentText>
                    <Progress animated value={100} />
                  </DialogContent>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps({ status, users, stripe }) {
    return { status,users, stripe };
}

export default connect(mapStateToProps,{pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser})(withRouter(Subscription));
