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
import { auth } from '../firebase';

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
            isLoggedIn: false
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

          <NavItem style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/login">
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', marginRight:10, textTransform: 'none'}}>
                      <Typography style={{color:'white'}} variant={"button"} >
                          LOG IN
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>
      )
    }

    renderUserNotSignedUp(){
      return (
          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/signup">
                  <Button raised="true" variant="raised" style={{border:'white', height:30, background:headerSignupButton, textTransform: 'none'}} >
                      <Typography style={{color:'white'}} variant={"button"} >
                          SIGNUP
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>
      )
    }

    renderUserLoggedIn(){
      return (

          <NavItem  style={{marginRight:'auto',marginLeft:'auto',padding:2, maxWidth:'60%'}}>
              <NavLink href="/landing">
                  <Button raised="true" variant="raised" style={{height:30, background:'#474f97', marginRight:10, textTransform: 'none'}} onClick={auth.doSignOut}>
                      <Typography style={{color:'white'}} variant={"button"} >
                          SIGNOUT
                      </Typography>
                  </Button>
              </NavLink>
          </NavItem>

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
                                {this.state.isLoggedIn
                                    ?
                                    this.renderUserLoggedIn()
                                    :
                                    this.renderUserNotLoggedIn()
                                }
                                {this.state.isLoggedIn
                                    ?
                                    this.renderNothing()
                                    :
                                    this.renderUserNotSignedUp()
                                }
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            </div>
        );
    }
}

export default header;
