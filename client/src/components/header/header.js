import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth,firebase } from '../firebase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    loginUser
} from '../../redux/actions';

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
      if(this.props.users.length !== 0){
        console.log("DidMount Props Users:",this.props.users)
        firebase.auth.onAuthStateChanged(authUser => {
          authUser
          ? this.setState({ isLoggedIn:true })
          : this.setState({ isLoggedIn: false });
        })
      }
    

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
        <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
            <NavLink href="/submit">
                <Button style={{ height:30, background:'#474f97', marginRight:10, textTransform: 'none'}}  >
                    <Typography style={{color:'white'}} variant={"button"} >
                        POST
                    </Typography>
                </Button>
            </NavLink>
        </NavItem>

          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/login">
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', marginRight:10, textTransform: 'none'}}>
                      <Typography style={{color:'white'}} variant={"button"} >
                          LOG IN
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/signup">
                  <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                      <Typography style={{color:'white'}} variant={"button"} >
                          SIGNUP
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>
          </Nav>
      )
    }

    renderUserNotSignedUp(){
      return (
        {}
      )
    }

    renderUserLoggedIn(){
      return (
        <Nav className="ml-auto" navbar>
        <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
            <NavLink href="/submit">
                <Button style={{ height:30, background:'#474f97', marginRight:10, textTransform: 'none'}}  >
                    <Typography style={{color:'white'}} variant={"button"} >
                        POST
                    </Typography>
                </Button>
            </NavLink>
        </NavItem>
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/">
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', marginRight:10, textTransform: 'none'}} onClick={auth.doSignOut}>
                      <Typography style={{color:'white'}} variant={"button"} >
                          SIGNOUT
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>
        </Nav>
      )
    }

    renderNothing(){
      return ({})
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
                    <Navbar style={{maxWidth:'63em', marginLeft:'auto', marginRight:'auto',padding:5}} color={headerBlue} dark expand="sm">
                        <NavbarBrand href="/" style={{marginLeft:5}}>
                            <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                                <Typography style={{color:'white'}} variant={"button"} >
                                    CAVALRY
                                </Typography>
                            </Button>
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} style={{marginRight:5}}/>
                        <Collapse isOpen={this.state.isOpen} navbar>


                                {this.state.isLoggedIn
                                    ?
                                    this.renderUserLoggedIn()
                                    :
                                    this.renderUserNotLoggedIn()
                                }

                        </Collapse>
                    </Navbar>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ posts,users }) {
    return { posts,users };
}

export default connect(mapStateToProps,{loginUser})(withRouter(header));
