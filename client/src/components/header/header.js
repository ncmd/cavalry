import React, { Component } from 'react';
// import Button from '@material-ui/core/Button';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    Button,
    // Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Grid from '@material-ui/core/Grid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from '../firebase';
import { googleanalytics } from '../analytics';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser,
    getUser,
    searchBox
    ,signoutUser,
    setPath,
    sendVerifyIdTokenToBackend
    ,getStripeCustomerID,
    signoutAccount,
    getAccount,
    signoutOrganization,
    lightThemeLoad,
    darkThemeLoad,
} from '../../redux/actions';
import {Link} from "react-router-dom";
import {AlgoliaSearch} from '../../components/algolia/config';
// import Hidden from '@material-ui/core/Hidden';
import './header.css';
import ReactGA from 'react-ga';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

ReactGA.initialize('UA-123951173-1',{
debug: true,
});
//
// const headerSignupButton = "linear-gradient(to right, #F44336, #ff1744";
// const headerPostButton = "linear-gradient(to right, #f44336, #e91e63 ";
// const headerRequestButton = "linear-gradient(to right, #2979ff, #03a9f4 ";
const headerBlue = "#1a237e";
// const accountButton = "linear-gradient(to right, #304ffe, #2962ff)";

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Gets Max Height of Window on Load
            popoverOpen: false,
            width: window.innerWidth,
            height: window.innerHeight,
            isOpen: false,
            isLoggedIn: false,
            authUser: null,
            path:'',
            open: false,
            anchorEl: null,
            backgroundTheme:true,
            anchorEl: null,
            mobileMoreAnchorEl: null,

        };
        this.toggle = this.toggle.bind(this);
        this.toggleAlgoliaResults = this.toggleAlgoliaResults.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleAlgoliaResults() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  componentWillMount(){

  }

    // Gets Max Height of Window on Load
    componentDidMount() {

      if(this.props.theme[0].theme === "dark"){
        this.setState({
          backgroundTheme: false
        })
      }

      if(this.props.theme[0].theme === "light"){
        this.setState({
          backgroundTheme: true
        })
      }

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

    setLightTheme(){
      this.props.lightThemeLoad()
      this.setState({
        backgroundTheme: !this.state.backgroundTheme
      })
    }

    setDarkTheme(){
      this.props.darkThemeLoad()
      this.setState({
        backgroundTheme: !this.state.backgroundTheme
      })
    }

    renderUserNotLoggedIn(){

      return (
        <Grid item >
            {this.state.backgroundTheme
              ?
              <Button style={{height:40,  border: '0px solid #3d63ff',boxShadow:'none',  background:'transparent', textTransform: 'none'}} onClick={() => this.setDarkTheme()} >
                  <div style={{color:'white',textTransform: 'none'}}  >
                      <span aria-label="emoji" role="img">🌙</span>
                  </div>
              </Button>
              :
              <Button style={{height:40,  border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}} onClick={() => this.setLightTheme()}  >
                  <div style={{color:'white',textTransform: 'none'}}  >
                      <span aria-label="emoji" role="img">☀️</span>
                  </div>
              </Button>
            }

            <Link to={{pathname:'/login'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
              <Button size="sm" style={{ marginLeft:16,height:40, background:'transparent', width:120, border: '1px solid #3d63ff',  boxShadow:'none'}}>
                  <div style={{color:"#3d63ff", textTransform:'none',  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                      <b>LOG IN</b>
                  </div>
              </Button>
            </Link>
            <Link to={{pathname:'/signup'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedsignupbutton()}>
                  <Button raised="true" variant="raised" style={{border:'white',marginLeft:16, height:40, width:120, background:this.props.theme[0].PrimaryLinear, border:this.props.theme[0].PrimaryBorder, textTransform: 'none'}} >
                      <div style={{color:'white',textTransform: 'none',  letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                          <b>SIGN UP</b>
                      </div>
                  </Button>
              </Link>
            </Grid>
      )
    }

    firebaseSignout(){
        auth.doSignOut()
        googleanalytics.Cavalry_Webapp_Header_Header_Userclickedsignoutbutton(this.props.users.login)
        // console.log("State isLoggedIn:",this.state.isLoggedIn)
        this.props.signoutUser()
        this.props.signoutAccount()
        this.props.signoutOrganization()
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

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

    renderUserLoggedIn(){
      auth.getJWTVerifyToken()

      const { anchorEl } = this.state;
      return (
        <div >
            {this.state.backgroundTheme
              ?
              <Button style={{height:35,  border: '0px solid #3d63ff',boxShadow:'none',  background:'transparent', textTransform: 'none'}} onClick={() => this.setDarkTheme()} >
                  <div style={{color:'white',textTransform: 'none'}}  >
                      <span aria-label="emoji" role="img">🌙</span>
                  </div>
              </Button>
              :
              <Button style={{height:40,  border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}} onClick={() => this.setLightTheme()}  >
                  <div style={{color:'white',textTransform: 'none'}}  >
                      <span aria-label="emoji" role="img">☀️</span>
                  </div>
              </Button>
            }
              <Link to={{pathname:'/activity'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedactivitybutton()}>
                <Button size="sm" style={{ height:40, background:'transparent', marginRight:10, border: '0px solid #3d63ff',  boxShadow:'none'}}>
                      <div style={{color:"#3d63ff", textTransform:'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                        <b>Activity</b>
                      </div>
                  </Button>
              </Link>
              <Link to={{pathname:'/request'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedrequestbutton()}>
                <Button size="sm" style={{ height:40, background:'transparent', marginRight:10, border: '0px solid #3d63ff',  boxShadow:'none'}}>
                      <div style={{color:"#3d63ff", textTransform:'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                        <b>Request</b>
                      </div>
                  </Button>
              </Link>
            <Link to={{pathname:'/submit'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedpostbutton()}>
              <Button size="sm" style={{ height:40, background:'transparent',marginRight:10, border: '0px solid #3d63ff',  boxShadow:'none'}}>
                    <div style={{color:"#3d63ff", textTransform:'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                      <b>Post</b>
                    </div>
                </Button>
            </Link>
            <Link to={{pathname:'/team'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedteambutton()}>
              <Button size="sm" style={{ height:35, background:'transparent',marginRight:10, border: '0px solid #3d63ff',  boxShadow:'none'}}>
                    <div style={{color:"#3d63ff", textTransform:'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                      <b>Team</b>
                    </div>
                </Button>
            </Link>
            <Button raised="true" variant="raised" style={{border:this.props.theme[0].PrimaryBorder, height:35,background:this.props.theme[0].PrimaryLinear, textTransform: 'none'}} onClick={this.handleClick}>
              <div style={{color:"white", textTransform:'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}   >
                  <b>Account</b>
              </div>
            </Button>

        </div>
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

    renderTheme(){
      if (this.props.theme.length > 0){
        return this.props.theme[0].MainBackground
      } else {
        this.props.lightThemeLoad()
      }
    }

    handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
      this.setState({ anchorEl: null });
      this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = event => {
      this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
      this.setState({ mobileMoreAnchorEl: null });
    };

    render() {
       const { anchorEl, mobileMoreAnchorEl } = this.state;
       const { classes } = this.props;
       const isMenuOpen = Boolean(anchorEl);
       const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

       const renderMenu = (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={this.handleMenuClose}
          >
              <MenuItem  style={{textTransform: 'none', color:'black'}} onClick={() => this.handleClickManage()}>
                <div style={{color:'black',textTransform: 'none'}}  >
                <b>Manage</b>
                </div>
              </MenuItem>
              <MenuItem  style={{ textTransform: 'none', color:'black'}} onClick={() => this.firebaseSignout()}>
                <div style={{color:'black',textTransform: 'none'}}  >
                <b>Sign out</b>
                </div>
              </MenuItem>
          </Menu>
        );

        var renderMobileMenu = (<div></div>)

        if (this.props.users.logged === true ){
          renderMobileMenu = (
            <Menu
              anchorEl={mobileMoreAnchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={isMobileMenuOpen}
              onClose={this.handleMobileMenuClose}
            >

                {this.state.backgroundTheme
                  ?
                  <MenuItem onClick={() => this.setDarkTheme()}>
                    <IconButton style={{  border: '0px solid #3d63ff',boxShadow:'none',  background:'transparent', textTransform: 'none'}} onClick={() => this.setDarkTheme()}  >
                        <span aria-label="emoji" role="img">🌙</span>
                    </IconButton>
                    <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                      <b>Dark theme</b>
                    </div>
                  </MenuItem>
                  :
                  <MenuItem onClick={() => this.setLightTheme()}>
                  <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}} onClick={() => this.setLightTheme()}  >
                    <span aria-label="emoji" role="img">☀️</span>
                  </IconButton>
                  <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                    <b>Light theme</b>
                  </div>
                </MenuItem>
                }
              <Link to={{pathname:'/activity'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
              <MenuItem>
                <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
                  < span aria-label="emoji" role="img">🔥</span>
                </IconButton>
                  <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                    <b>Activity</b>
                  </div>
              </MenuItem>
            </Link>
            <Link to={{pathname:'/request'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
            <MenuItem>
              <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
                < span aria-label="emoji" role="img">💡</span>
              </IconButton>
                <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                  <b>Request</b>
                </div>
            </MenuItem>
          </Link>
          <Link to={{pathname:'/submit'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
          <MenuItem>
            <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
              < span aria-label="emoji" role="img">🚩</span>
            </IconButton>
              <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                <b>Post</b>
              </div>
          </MenuItem>
        </Link>
          <Link to={{pathname:'/team'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
          <MenuItem>
            <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
              < span aria-label="emoji" role="img">👥</span>
            </IconButton>
              <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
                <b>Team</b>
              </div>
          </MenuItem>
        </Link>
          <Link to={{pathname:'/manage'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedmanagebutton()}>
          <MenuItem>
            <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
              < span aria-label="emoji" role="img">👤</span>
            </IconButton>
            <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
              <b>Account</b>
            </div>
          </MenuItem>
        </Link>
          <MenuItem onClick={() => this.firebaseSignout()}>
            <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}>
              < span aria-label="emoji" role="img">👋</span>
            </IconButton>
            <div style={{color:'black',textTransform: 'none', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}  >
              <b>Sign out</b>
            </div>
          </MenuItem>
            </Menu>
          );
        }

          if (this.props.users.logged === false ){
            renderMobileMenu = (
              <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
              >

                  {this.state.backgroundTheme
                    ?
                    <MenuItem onClick={() => this.setDarkTheme()}>
                      <IconButton style={{  border: '0px solid #3d63ff',boxShadow:'none',  background:'transparent', textTransform: 'none'}} onClick={() => this.setDarkTheme()}  >
                          <span aria-label="emoji" role="img">🌙</span>
                      </IconButton>
                      <div style={{color:'black',textTransform: 'none'}}  >
                        <b>Dark theme</b>
                      </div>
                    </MenuItem>
                    :
                    <MenuItem onClick={() => this.setLightTheme()}>
                    <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}} onClick={() => this.setLightTheme()}  >
                      <span aria-label="emoji" role="img">☀️</span>
                    </IconButton>
                    <div style={{color:'black',textTransform: 'none'}}  >
                      <b>Light theme</b>
                    </div>
                  </MenuItem>
                  }
                  <Link to={{pathname:'/login'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedloginbutton()}>
                <MenuItem>
                  <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}  >
                    < span aria-label="emoji" role="img">🐎</span>
                  </IconButton>
                    <div style={{color:'black',textTransform: 'none'}}  >
                      <b>Log in</b>
                    </div>
                </MenuItem>
              </Link>
              <Link to={{pathname:'/signup'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedsignupbutton()}>
                <MenuItem>
                  <IconButton style={{border: '0px solid #3d63ff', boxShadow:'none', background:'transparent', textTransform: 'none'}}  >
                    <span aria-label="emoji" role="img">✋</span>
                  </IconButton>
                  <div style={{color:'black',textTransform: 'none'}}  >
                    <b>Sign up</b>
                  </div>
                </MenuItem>
                  </Link>
              </Menu>
            );
          }




        return (
            <div>
                <div
                    style={{
                        flexGrow: 1,
                        marginBottom: 0,
                        justify: 'center',
                        background:this.renderTheme(),
                    }}
                >
                <AppBar position="static" style={{background:this.props.theme[0].MainBackground,  boxShadow:'0px 0px 0px 0px', borderBottom:this.props.theme[0].PostsButtonBorder}}>
                  <Toolbar variant="dense">
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:'63em'}} direction="row" justify="space-between" alignItems="stretch" >
                      <Grid item xs>
                        <Link  style={{color:"#3d63ff",textDecoration: 'none' }} to={{pathname:'/'}} onClick={() => googleanalytics.Cavalry_Webapp_Header_Header_Userclickedhomebutton()}>
                          <div>
                            <div style={{textTransform:'none', height:25,fontSize:'25px', fontWeight:400, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                            <img src="/cavalry.svg" style={{width:40,height:40}}></img>
                            <b style={{paddingLeft:8}}>Cavalry</b></div>
                          </div>
                        </Link>
                      </Grid>
                      {/*
                        <Hidden smDown>
                        <Grid item xs={6}>
                          <div style={{background:'transparent'}}>
                            {this.renderSearch()}
                          </div>
                        </Grid>
                        </Hidden>
                        */}

                    <div className={classes.grow} />
                      <div className={classes.sectionDesktop}>

                            {this.props.users.logged
                                ?
                                this.renderUserLoggedIn()
                                :
                                this.renderUserNotLoggedIn()
                            }

                      </div>
                    </Grid>
                    <div className={classes.sectionMobile}>
                      <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="primary">
                        <MenuIcon />
                      </IconButton>
                    </div>
                  </Toolbar>
                </AppBar>
                {renderMenu}
                {renderMobileMenu}
                </div>
            </div>
        );
    }
}

header.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ posts,users,search,path,account,organization,theme }) {
    return { posts,users,search,path,account,organization,theme };
}

export default connect(mapStateToProps,{loginUser,getUser,searchBox,signoutUser,setPath,sendVerifyIdTokenToBackend,getStripeCustomerID,signoutAccount,getAccount,signoutOrganization,lightThemeLoad,darkThemeLoad})(withRouter(withStyles(styles)(header)));
