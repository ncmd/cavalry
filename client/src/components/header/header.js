import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem
} from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import { googleanalytics } from '../analytics';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser,getUser,searchBox,signoutUser,setPath,sendVerifyIdTokenToBackend,getStripeCustomerID,signoutAccount
} from '../../redux/actions';
import {Link} from "react-router-dom";
import {AlgoliaSearch} from '../../components/algolia/config';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';
import './header.css';
import ReactGA from 'react-ga';


ReactGA.initialize('UA-123951173-1',{
debug: true,
});

const headerSignupButton = "linear-gradient(to right, #ff1744, #F44336 ";
const headerPostButton = "linear-gradient(to right, #f44336, #e91e63 ";
const headerRequestButton = "linear-gradient(to right, #2979ff, #03a9f4 ";
const headerBlue = "#1a237e";
const accountButton = "linear-gradient(to right, #304ffe, #2962ff)";

class header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Gets Max Height of Window on Load
            width: window.innerWidth,
            height: window.innerHeight,
            isOpen: false,
            isLoggedIn: false,
            authUser: null,
            path:'',
            open: false,
            anchorEl: null,
            backgroundTheme:true
        };
        this.toggle = this.toggle.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    // Gets Max Height of Window on Load
    componentDidMount() {
          // if (auth.getJWTVerifyToken() !== null){
          //   this.props.sendVerifyIdTokenToBackend(auth.getJWTVerifyToken())
          // }

        ReactGA.pageview(window.location.pathname + window.location.search);
        this.props.getUser();

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

    }
    // Gets Max Height of Window on Load
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    // Gets Max Height of Window on Load
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    renderUserNotLoggedIn(){

      return (
        <Nav className="ml-auto" navbar>
          {/*<NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
            {this.state.backgroundTheme
              ?
              <Button raised="true" variant="raised" style={{border:'white', height:30, backgroundImage:'radial-gradient(#F44336 0%, #1a237e 0%, #474f97 60%)', textTransform: 'none'}} onClick={() => this.setState({backgroundTheme:!this.state.backgroundTheme})} >
                  <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <span aria-label="emoji" role="img">🌙<ArrowRight/>☀️</span>
                  </Typography>
              </Button>
              :
              <Button raised="true" variant="raised" style={{border:'white', height:30, background:'radial-gradient(#F44336 0%, #ff1744 0%, #F44336 60%)', textTransform: 'none'}} onClick={() => this.setState({backgroundTheme:!this.state.backgroundTheme})}  >
                  <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <span aria-label="emoji" role="img">☀️<ArrowRight/>🌙</span>
                  </Typography>
              </Button>
            }
          </NavItem> */}

          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
              <Link to={{pathname:'/login'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', textTransform: 'none'}}>
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                          <b>Log in</b>
                      </Typography>
                  </Button>
              </Link>
          </NavItem>
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
            <Link to={{pathname:'/signup'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedsignupbutton()}>
                  <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                          <b>Sign up</b>
                      </Typography>
                  </Button>
              </Link>
          </NavItem>

          </Nav>
      )
    }

    firebaseSignout(){
        auth.doSignOut()
        googleanalytics.Cavalry_Webapp_Header_Header_Userclickedsignoutbutton(this.props.users.login)
        // console.log("State isLoggedIn:",this.state.isLoggedIn)
        this.props.signoutUser()
        this.props.signoutAccount()
        this.props.history.push('/')
    }

    handleClick = event => {
      googleanalytics.Cavalry_Webapp_Header_Header_Userclickedaccountbutton(this.props.users.login)
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClickManage = () => {
     googleanalytics.Cavalry_Webapp_Header_Header_Userclickedmanagebutton()
     this.props.history.push('/manage')
  }

  handleClickTeam= () => {
     googleanalytics.Cavalry_Webapp_Header_Header_Userclickedteambutton()
     this.props.history.push('/team')
  }

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

    renderUserLoggedIn(){
      auth.getJWTVerifyToken()
      const { anchorEl } = this.state;
      return (
        <Nav className="ml-auto" navbar>
          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
              <Link to={{pathname:'/request'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedrequestbutton()}>
                  <Button style={{ height:30, background:headerRequestButton, marginRight:10, textTransform: 'none'}}  >
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                        <b>Request</b>
                      </Typography>
                  </Button>
              </Link>
          </NavItem>
        <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
            <Link to={{pathname:'/submit'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedpostbutton()}>
                <Button style={{ height:30, background:headerPostButton, marginRight:10, textTransform: 'none'}}  >
                    <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <b>Post</b>
                    </Typography>
                </Button>
            </Link>
        </NavItem>
          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2}}>
                <Button raised="true" variant="raised" style={{height:30, background:accountButton, color:'white',textTransform: 'none'}} onClick={this.handleClick}>
                  <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                  <b>Account</b>
                  </Typography>
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                   open={Boolean(anchorEl)}
                   onClose={this.handleClose}
                >
                    <MenuItem  style={{ background:'#474f97', textTransform: 'none', color:'white', marginTop:-9, marginBottom:-9}} onClick={() => this.handleClickTeam()}>
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <b>Team</b>
                      </Typography>
                    </MenuItem>
                    <MenuItem  style={{ background:'#474f97', textTransform: 'none', color:'white', marginTop:-9, marginBottom:-9}} onClick={() => this.handleClickManage()}>
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <b>Manage</b>
                      </Typography>
                    </MenuItem>
                    <MenuItem  style={{ background:'#474f97', textTransform: 'none', color:'white', marginTop:-9, marginBottom:-9}} onClick={() => this.firebaseSignout()}>
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                      <b>Signout</b>
                      </Typography>
                    </MenuItem>
                </Menu>
          </NavItem>
        </Nav>
      )
    }



    renderNothing(){
      return ({})
    }

    renderSearch(){
        // console.log("PATH:",this.props.location)
      if (this.props.location.pathname === '/'){
        return (
          <AlgoliaSearch/>
        )
      }
    }
    CavalryHomeClickEvent = () => {
      ReactGA.event({label:'Clicked on Cavalry Home', action:'Button Click', category:'User Clicks'});
    };
    CavalrySignupClickEvent = () => {
      ReactGA.event({label:'Clicked on Cavalry Signup', action:'Button Click', category:'User Clicks'});
    };
    CavalryLoginClickEvent = () => {
      ReactGA.event({label:'Clicked on Cavalry Signup', action:'Button Click', category:'User Clicks'});
    };

    render() {

        return (
            <div>
                <div
                    style={{
                        flexGrow: 1,
                        marginTop: 0,
                        justify: 'center',
                        background:headerBlue,
                    }}
                >
                    <Navbar style={{maxWidth:'63em', marginLeft:'auto', marginRight:'auto',paddingTop:10,paddingLeft:1,paddingRight:1}} color={headerBlue} dark expand="sm">
                      <Grid container style={{flexGrow:1, margin:"0 auto"}} direction="row" justify="space-between" alignItems="flex-start" spacing={24} >
                        <Grid item xs>
                          <Link to={{pathname:'/'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedhomebutton()}>
                              <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                                  <Typography style={{color:'white',textTransform: 'none'}} variant={"caption"} >
                                    <b>Cavalry</b>
                                  </Typography>
                              </Button>
                          </Link>
                        </Grid>
                        <Hidden smDown>
                        <Grid item xs={6}>
                          {this.renderSearch()}
                        </Grid>
                      </Hidden>
                        <Grid item xs>
                          <NavbarToggler onClick={this.toggle} style={{}}/>
                          <Collapse isOpen={this.state.isOpen} navbar>
                            {this.props.users.logged
                                ?
                                this.renderUserLoggedIn()
                                :
                                this.renderUserNotLoggedIn()
                            }
                          </Collapse>
                        </Grid>
                      </Grid>
                    </Navbar>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ posts,users,search,path,account }) {
    return { posts,users,search,path,account };
}

export default connect(mapStateToProps,{loginUser,getUser,searchBox,signoutUser,setPath,sendVerifyIdTokenToBackend,getStripeCustomerID,signoutAccount})(withRouter(header));
