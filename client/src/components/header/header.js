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
import { auth} from '../firebase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser,getUser,searchBox,signoutUser,setPath
} from '../../redux/actions';
import {Link} from "react-router-dom";
import {AlgoliaSearch} from '../../components/algolia/config';
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const headerSignupButton = "linear-gradient(to right, #ff1744, #F44336 ";
const headerBlue = "#1a237e";

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
      this.props.getUser()
      // console.log("Header this.props.users.logged:",this.props.users.logged)

      // firebase.auth.onAuthStateChanged((response) => {
      //     console.log("Response:",response)
      //     if (response !== null){
      //         this.setState({ isLoggedIn: true })
      //     } else {
      //         this.props.signoutUser()
      //         this.setState({ isLoggedIn: false })
      //     }
      // })



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

          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <Link to={{pathname:'/login'}}>
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', marginRight:10, textTransform: 'none'}}>
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"button"} >
                          <b>Login</b>
                      </Typography>
                  </Button>
              </Link>
          </NavItem>
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
            <Link to={{pathname:'/signup'}}>
                  <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                      <Typography style={{color:'white',textTransform: 'none'}} variant={"button"} >
                          <b>Signup</b>
                      </Typography>
                  </Button>
              </Link>
          </NavItem>
          </Nav>
      )
    }

    firebaseSignout(){
        auth.doSignOut()
        // console.log("State isLoggedIn:",this.state.isLoggedIn)
        this.props.signoutUser()
    }

    handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

    renderUserLoggedIn(){
      const { anchorEl } = this.state;
      return (
        <Nav className="ml-auto" navbar>
        <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
            <Link to={{pathname:'/submit'}}>
                <Button style={{ height:30, background:headerSignupButton, marginRight:10, textTransform: 'none'}}  >
                    <Typography style={{color:'white',textTransform: 'none'}} variant={"button"} >
                      <b>Post</b>
                    </Typography>
                </Button>
            </Link>

        </NavItem>
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <Link to={{pathname:'/'}}>
                <Button raised="true" variant="raised" style={{height:30, background:'#474f97', color:'white',textTransform: 'none'}} onClick={this.handleClick}>
                  <b>Account</b>
                </Button>
                <Menu
                  id="simple-menu"
                  open={this.state.open}
                  anchorEl={anchorEl}
                   open={Boolean(anchorEl)}
                   onClose={this.handleClose}
                >
                    <MenuItem  style={{ background:'#474f97', textTransform: 'none', color:'white', marginTop:-9, marginBottom:-9}} onClick={() => this.firebaseSignout()}>Signout</MenuItem>

                </Menu>

              </Link>
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
                      <Grid container style={{flexGrow:1, margin:"0 auto"}} direction="row" justify="space-between" alignItems="flex-start" >
                        <Grid item xs>
                          <Link to={{pathname:'/'}} style={{marginLeft:5}}>
                              <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                                  <Typography style={{color:'white',textTransform: 'none'}} variant={"button"} >
                                    <b>Cavalry</b>
                                  </Typography>
                              </Button>
                          </Link>
                        </Grid>
                        <Grid item xs style={{width:'100%'}}>
                          {this.renderSearch()}
                        </Grid>
                        <Grid item xs>
                          <NavbarToggler onClick={this.toggle} style={{marginRight:5}}/>
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

function mapStateToProps({ posts,users,search,path }) {
    return { posts,users,search,path };
}

export default connect(mapStateToProps,{loginUser,getUser,searchBox,signoutUser,setPath})(withRouter(header));
