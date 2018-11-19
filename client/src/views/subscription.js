import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser
} from '../redux/actions';
import Button from '@material-ui/core/Button';
import { Progress } from 'reactstrap';
import {Elements, StripeProvider} from "react-stripe-elements";
import SplitForm from "../components/stripe/splitform";
import Check from '@material-ui/icons/Check';
import '../components/ribbon/ribbon.css';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { googleanalytics } from '../components/analytics';

// const bodyBlue = "linear-gradient(#1a237e, #121858)";
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
            password:'',
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
          <div style={{width:273,height:360, marginBottom:20, background: this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder,borderRadius:'5px 5px 5px 5px',textAlign:'center',}}>
            <div style={{color:this.props.theme[0].PostsTypographyTitle, display: 'inline-block', padding:'25px 0'}} >Please select a plan</div>
          </div>
        )
      }
    }

    renderModal(){
      this.props.setStripeModal()
      setInterval(this.renderProgress(), 100);
      setInterval(this.props.setStripeProgress(this.state.progresscompleted), 100);
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
                        height:this.state.height,
                        marginTop:48,
                        paddingTop:24,
                    }}
                >
                        <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em"}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                          <Grid item style={{marginBottom:30}}>
                            <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'45px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                                <b>Welcome to Cavalry</b>
                            </div>
                            <div style={{marginTop:16,color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                                You've taken your first step into a <span aria-label="emoji" role="img" style={{fontSize:30}}>🌎</span> global community.
                            </div>
                          </Grid>
                          <Grid item>
                            <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                                <b>Select a plan that works for you:</b>
                            </div>
                          </Grid>
                        </Grid>
                        <Grid container style={{flexGrow:1,border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, background: this.props.theme[0].PostsButtonBackground, margin:"0 auto", maxWidth:"50em", padding:40, marginTop:20}} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem1
                              ?
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:250, width:265, border:'8px solid #3d63ff'}} onClick={()=> {this.handleClickItem1()}}>
                                <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                  <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>1 Month</b></div>
                                  <div style={{textTransform:'none', marginTop:20,width:'100%', borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$7</b> billed every month</div>
                                  <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >(<b>$84</b> per year)</div>
                                </div>
                              </Button>
                              :
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:230, width:230 ,border:this.props.theme[0].PostsButtonBorder}} onClick={()=> {this.handleClickItem1()}}>
                                <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                  <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>1 Month</b></div>
                                  <div style={{textTransform:'none', marginTop:20,width:'100%', borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$7</b> billed every month</div>
                                  <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >(<b>$84</b> per year)</div>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem2
                              ?
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:280, width:265, border:'8px solid #3d63ff'}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                                  <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                    <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>12 Months</b></div>
                                    <div style={{textTransform:'none', marginTop:20, width:'100%',borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$60</b> billed annually</div>
                                    <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >(<b>$60</b> per year)</div>
                                  </div>
                              </Button>
                              :
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:280, width:230,border:this.props.theme[0].PostsButtonBorder}} onClick={()=> {this.handleClickItem2()}}>
                                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                                  <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                    <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>12 Months</b></div>
                                    <div style={{textTransform:'none', marginTop:20,width:'100%', borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$60</b> billed annually</div>
                                    <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >(<b>$60</b> per year)</div>
                                  </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item style={{marginTop:10}}>
                            {this.state.selectItem3
                              ?
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:250, width:265, border:'8px solid #3d63ff'}} onClick={()=> {this.handleClickItem3()}}>
                                 <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                                   <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                     <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Beta</b></div>
                                     <div style={{textTransform:'none', marginTop:20,width:'100%', borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$1</b> billed every month</div>
                                     <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</div>
                                 </div>
                              </Button>
                              :
                              <Button className="box" style={{background:this.props.theme[0].PostsButtonBackground, height:230, width:230,border:this.props.theme[0].PostsButtonBorder}} onClick={()=> {this.handleClickItem3()}}>
                                <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                                  <div style={{color:this.props.theme[0].PostsTypographyTitle}}>
                                    <div style={{textTransform:'none', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>Beta</b></div>
                                    <div style={{textTransform:'none', marginTop:20, width:'100%', borderTop: this.props.theme[0].PostsButtonBorder, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>$1</b> billed every month</div>
                                    <div style={{textTransform:'none'}} >(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</div>
                                </div>
                              </Button>
                            }
                          </Grid>
                          <Grid item xs={12}>
                            <div style={{ textAlign:'center', marginTop:5,color:this.props.theme[0].PostsTypographyTitle,  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>All amounts are shown in <b>USD</b>.</div>
                            <div style={{ textAlign:'center', marginTop:5,color:this.props.theme[0].PostsTypographyTitle,  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>Subscriptions can be <b>canceled</b> anytime.</div>
                          </Grid>
                        </Grid>

                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                            <b>Enter payment information:</b>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20}} direction={'row'} justify={'flex-start'} alignItems={'flex-start'}>
                      <Grid item xs style={{ padding:40, paddingTop:0,paddingBottom:0}}>
                          {this.renderStripe()}
                      </Grid>
                      <Grid item style={{ border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius,background:this.props.theme[0].PostsButtonBackground, padding:40}} xs>
                          <div style={{color:this.props.theme[0].PostsTypographyTitle, marginTop:-20, marginBottom:10, letterSpacing:'-0.5px', fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                              You're going to love Cavalry
                          </div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> <span aria-label="emoji" role="img">🚫</span> No Advertisements</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> 24/7 support by <span aria-label="emoji" role="img">📧</span> email</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> Create unlimited <span aria-label="emoji" role="img">🔒</span> <b>private</b> runbooks</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> Able to request for <span aria-label="emoji" role="img">📕</span> runbooks</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> Able to request new <span aria-label="emoji" role="img">😍</span> features</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> Create & edit your <span aria-label="emoji" role="img">📖</span> runbooks</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle,padding:5}} ><Check style={{color:'#00e676'}}/> 99.9% SLA <span aria-label="emoji" role="img">👍</span> uptime</div>
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

                  <DialogTitle><div style={{ letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>"Setting up your account..."</div></DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      <div style={{ letterSpacing:'-0.5px', fontSize:'24px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>"Setting up your subscription!"</div>
                    </DialogContentText>
                    <Progress animated value={100} />
                  </DialogContent>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps({ status, users, stripe,theme }) {
    return { status,users, stripe,theme };
}

export default connect(mapStateToProps,{pingBackend,setUserEmail,applySecurity,setPlan,setStripeModal,loginUser})(withRouter(Subscription));
