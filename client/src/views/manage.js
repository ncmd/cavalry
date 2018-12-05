import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups,
  unsubscribeAccount,
  getAccount,
  lightThemeLoad
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import {Link} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";
const cancelButton = "linear-gradient(to right, #2979ff, #03a9f4 ";
const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    color: 'black',
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

class Manage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      width: window.innerWidth,
      height: window.innerHeight,
      selectedOption: 'setupgroups',
      inputContactname: '',
      inputEmailaddress: '',
      inputInstantmessenger: '',
      inputDepartment: '',
      inputLocation: '',
      groups: [],
      groupItemCounter: 0,
      groupIndex: 0,
      tabValue: 0,
      selectItem1: false,
      selectItem2: false,
      selectItem3: false,
      modal: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  // Controls Onload Windows Height Dimensions
  componentDidMount() {
    this.renderTheme()
    if (this.props.users.logged === true) {
      this.props.getAccount(this.props.users.login)
    }

    // Current User Plan
    if (this.props.users.plan === '12months') {
      this.setState({
        selectItem2: true
      })
    } else if (this.props.users.plan === '1month') {
      this.setState({
        selectItem1: true
      })
    } else if (this.props.users.plan === 'beta') {
      this.setState({
        selectItem3: true
      })
    }
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);

  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  handleClickMyPosts() {
    this.setState({
      selectedOption: 'myposts'
    })
  }

  handleClickSetupGroups() {
    this.setState({
      selectedOption: 'setupgroups'
    })
  }


  // Adding Objective to New Runbook
  addGroup(contactname, emailaddress, instantmessenger, department, location, groupIndex) {
    // Get Previous Objective State which should start as an empty array '[]'
    const prevGroups = this.state.groups;

    // Function tasks in arguments to be pushed to array
    // Creating an empty 'tasks' array so elements can be added
    // 'expanded' determines if the objective expands to show 'tasks'
    prevGroups.push({
      contactname: contactname,
      emailaddress: emailaddress,
      instantmessenger: instantmessenger,
      department: department,
      location: location,
      index: groupIndex,
    });

    this.setState({
      groups: prevGroups,
      groupItemCounter: this.state.groupItemCounter + 1,
      groupIndex: this.state.groupIndex + 1,
    }, () => {
      this.props.addGroups(this.state.groups)
      this.setState({
        inputContactname: '',
        inputEmailaddress: '',
        inputInstantmessenger: '',
        inputDepartment: '',
        inputLocation: '',
      })
    });
  }

  handleInputContactname = inputContactname => event => {
    this.setState({
      inputContactname: event.target.value,
    }, () => {
      this.props.addGroupContactname(this.state.inputContactname)
    });
  };
  handleInputEmailaddress = inputEmailaddress => event => {
    this.setState({
      inputEmailaddress: event.target.value,
    }, () => {
      this.props.addGroupEmailaddress(this.state.inputEmailaddress)
    });
  };
  handleInputInstantMessenger = inputInstantmessenger => event => {
    this.setState({
      inputInstantmessenger: event.target.value,
    }, () => {
      this.props.addGroupInstantmessenger(this.state.inputInstantmessenger)
    });
  };
  handleInputDepartment = inputDepartment => event => {
    this.setState({
      inputDepartment: event.target.value,
    }, () => {
      this.props.addGroupDepartment(this.state.inputDepartment)
    });
  };
  handleInputLocation = inputLocation => event => {
    this.setState({
      inputLocation: event.target.value,
    }, () => {
      this.props.addGroupLocation(this.state.inputLocation)
    });
  };

  renderSetupGroups() {

    return (
      <div>

        <Form style={{ marginTop: 30 }}>
          <div style={{ color: 'white' }} >Manage Groups</div>
          <FormGroup style={{ marginTop: 20 }}>
            <Input value={this.state.inputContactname} onChange={this.handleInputContactname()} placeholder="firstname lastname" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.inputEmailaddress} onChange={this.handleInputEmailaddress()} placeholder="name@company.com" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.inputInstantmessenger} onChange={this.handleInputInstantMessenger()} placeholder="slack" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.inputDepartment} onChange={this.handleInputDepartment()} placeholder="security operations" />
          </FormGroup>
          <FormGroup>
            <Input value={this.state.inputLocation} onChange={this.handleInputLocation()} style={{ width: '50%', display: 'inline' }} placeholder="san francisco" />
            <Button style={{ background: actionButton }} onClick={() => this.addGroup(this.state.inputContactname, this.state.inputEmailaddress, this.state.inputInstantmessenger, this.state.inputDepartment, this.state.inputLocation, this.state.groupIndex)}><div style={{ color: 'white', textTransform: 'none' }}><b>Submit</b></div></Button>
          </FormGroup>
        </Form>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contact Name</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Instant Messenger</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.groups.map(g => {
                return (
                  <TableRow key={g.contactname}>
                    <TableCell component="th" scope="row">
                      {g.contactname}
                    </TableCell>
                    <TableCell>{g.emailaddress}</TableCell>
                    <TableCell>{g.instantmessenger}</TableCell>
                    <TableCell>{g.department}</TableCell>
                    <TableCell>{g.location}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    )
  }

  renderSelectedOption() {
    if (this.state.tabValue === 0) {
      return (
        this.renderAccountDetails()
      )
    } else if (this.state.tabValue === 1) {
      return (
        this.renderCurrentPlan()
      )
    } else if (this.state.tabValue === 2) {
      return (
        this.renderSupport()
      )
    }
  }

  renderAccountDetails() {
    return (
      <div style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em", paddingBottom: 40 }}>
        <Grid container style={{ flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em" }} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{ flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', paddingTop: 20, maxWidth: "45em" }} xs={12}>
            <div>
              <div style={{ background: this.props.theme[0].PostsButtonBackground, color: this.props.theme[0].PostsTypographyTitle }}>Your information</div>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ flexGrow: 1, border: '1px solid #474f97', margin: "0 auto", maxWidth: "50em", padding: 40, marginTop: 20 }} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
          <Grid item style={{ flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "45em" }} xs={12}>
            <div>
              <div style={{ color: this.props.theme[0].PostsTypographyDescription }}><b>Email Address: </b>{this.props.users.email}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }

  renderSupport() {
    return (
      <div style={{ background: 'white', marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em", paddingBottom: 40 }}>
        <Grid container style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em" }} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', paddingTop: 20, maxWidth: "45em" }} xs={12}>
            <div>
              <div style={{ color: 'black' }}>Contact support</div>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ flexGrow: 1, border: '1px solid #474f97', margin: "0 auto", maxWidth: "50em", padding: 40, marginTop: 20 }} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
          <Grid item style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "45em" }} xs={12}>
            <div>
              <div style={{ color: 'black' }}><b>Support Email: </b>cavalrytacticsinc@gmail.com</div>
            </div>
          </Grid>
        </Grid>
      </div>

    )
  }


  renderCurrentPlan() {
    return (
      <div style={{ background: 'white', marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em", paddingBottom: 40 }}>
        <Grid container style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em" }} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', paddingTop: 20, maxWidth: "45em" }} xs={12}>
            <div>
              <div style={{ color: 'black' }}>Your current plan</div>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ flexGrow: 1, border: '1px solid #474f97', margin: "0 auto", maxWidth: "50em", padding: 40, marginTop: 20 }} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
          <Grid item style={{ marginTop: 10 }}>
            {this.state.selectItem1
              ?
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 250, width: 265 }}>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >1 Month</div>
                  <div style={{ color: 'black' }} ><b>$35.00</b></div>
                  <div style={{ textTransform: 'none' }} >per month</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$35.00</b> billed every month</div>
                  <div style={{ textTransform: 'none' }} >(<b>$420.00</b> per year)</div>
                </div>
              </Button>
              :
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 230, width: 230 }}>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >1 Month</div>
                  <div style={{ color: 'black' }} ><b>$35.00</b></div>
                  <div style={{ textTransform: 'none' }} >per month</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$35.00</b> billed every month</div>
                  <div style={{ textTransform: 'none' }} >(<b>$420.00</b> per year)</div>
                </div>
              </Button>
            }
          </Grid>
          <Grid item style={{ marginTop: 10 }}>
            {this.state.selectItem2
              ?
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 250, width: 265 }}>
                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >12 Months</div>
                  <div style={{ color: 'black' }} ><b>$25.00</b></div>
                  <div style={{ textTransform: 'none' }} >per month</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$300.00</b> billed every 12 months</div>
                  <div style={{ textTransform: 'none' }} >(<b>$300.00</b> per year)</div>
                </div>
              </Button>
              :
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 230, width: 230 }}>
                <div className="ribbonred"><span aria-label="emoji" role="img">🔥Hot🔥</span></div>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >12 Months</div>
                  <div style={{ color: 'black' }} ><b>$25.00</b></div>
                  <div style={{ textTransform: 'none' }} >per month</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$300.00</b> billed every 12 months</div>
                  <div style={{ textTransform: 'none' }} >(<b>$300.00</b> per year)</div>
                </div>
              </Button>
            }
          </Grid>
          <Grid item style={{ marginTop: 10 }}>
            {this.state.selectItem3
              ?
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 250, width: 265 }}>
                <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >Beta Test</div>
                  <div style={{ color: 'black' }} ><b>$1.00</b></div>
                  <div style={{ textTransform: 'none' }} >for now...</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$1.00</b> billed every month</div>
                  <div style={{ textTransform: 'none' }} >(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</div>
                </div>
              </Button>
              :
              <Button disabled className="box" style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, height: 230, width: 230 }}>
                <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                <div>
                  <div style={{ color: 'black', textTransform: 'none' }} >Beta Test</div>
                  <div style={{ color: 'black' }} ><b>$1.00</b></div>
                  <div style={{ textTransform: 'none' }} >per month</div>
                  <div style={{ textTransform: 'none', marginTop: 20, borderTop: '2px solid rgba(0, 0, 0, 0.12)' }} ><b>$1.00</b> billed every month</div>
                  <div style={{ textTransform: 'none' }} >(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</div>
                </div>
              </Button>
            }
          </Grid>
          <Grid item xs={12}>
            <div style={{ color: 'black', textAlign: 'center' }}>All amounts are shown in <b>USD</b></div>
          </Grid>
          <Grid item style={{ background: 'white', borderColor: '#474f97', flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', paddingTop: 20, maxWidth: "45em" }} xs={12}>
            <div>
              <Button onClick={this.toggle} style={{ background: actionButton }}><div style={{ color: 'white', textTransform: 'none' }}><b>Cancel Subscription</b><span aria-label="emoji" role="img">😢</span></div></Button>
            </div>
            <Modal isOpen={this.state.modal} toggle={this.toggle}>
              <ModalHeader toggle={this.toggle}> <div style={{ textTransform: 'none' }}> <b>Cancel Subscription Confirmation</b></div></ModalHeader>
              <ModalBody>
                <b>Are you sure you want to unsubscribe? </b><span aria-label="emoji" role="img">😢</span>
                <div>This will continue your subscription till the end of the current billing period.</div>
              </ModalBody>
              <ModalFooter>
                <Button style={{ background: actionButton, color: 'white' }} onClick={() => this.handleUnsubscribeAccount()}><div style={{ color: 'white', textTransform: 'none' }}><b>Yes!</b> I want to unsubscribe!</div></Button>{' '}
                <Button style={{ background: cancelButton, color: 'white' }} onClick={() => this.toggle()}><div style={{ color: 'white', textTransform: 'none' }}><b>No!</b> I changed my mind!</div></Button>{' '}
              </ModalFooter>
            </Modal>
          </Grid>
        </Grid>
      </div>
    )
  }

  handleUnsubscribeAccount() {
    this.toggle()
    this.props.unsubscribeAccount(this.props.account.stripeSubscriptionId)
  }

  handleClickItem1() {
    this.setState({
      selectItem1: true,
      selectItem2: false,
      selectItem3: false,
    })
  }
  handleClickItem2() {
    this.setState({
      selectItem1: false,
      selectItem2: true,
      selectItem3: false,
    })
  }
  handleClickItem3() {
    this.setState({
      selectItem1: false,
      selectItem2: false,
      selectItem3: true,
    })
  }

  handleChangeTab = (event, tabValue) => {
    this.setState({ tabValue });
  };

  renderTheme() {
    if (this.props.theme.length > 0) {
      return this.props.theme[0].MainBackground
    } else {
      this.props.lightThemeLoad()
    }
  }

  render() {

    const { classes } = this.props;

    return (
      <div>
        <style>{'body { background-color:' + this.renderTheme() + ' }'}</style>
        <Header />
        <div
          style={{
            flexGrow: 1,
            justify: 'center',
            background: this.renderTheme(),
            height: this.state.height,
            marginTop: 48,
            padding: 5,
          }}
        >
          {/* Top Section */}
          <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, flexGrow: 1, margin: "0 auto", maxWidth: "63em" }} alignItems={'center'} justify={'center'} direction={'row'}>
            <Grid item style={{ padding: 20 }}>
              <Tabs
                classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                value={this.state.tabValue}
                onChange={this.handleChangeTab}
                fullWidth
              >
                <Tab label="ACCOUNT DETAILS" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
                <Tab label="CURRENT PLAN" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
                <Tab label="SUPPORT" classes={{ root: classes.tabRoot, selected: classes.tabSelected }} />
              </Tabs>
            </Grid>
          </Grid>
          {this.renderSelectedOption()}
          {/* Bottom Section
                    <Grid container style={{background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'row'}>
                      <Grid item>
                        <Button style={{background:actionButton}} onClick={() => this.handleClickSetupGroups()}><div  style={{color:'white', textTransform: 'none'}}><b>Setup Groups</b></div></Button>
                      </Grid>
                    </Grid>


                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>{this.renderSelectedOption(this.state.selectedOption)}</Grid>
                    </Grid>*/}
        </div>
      </div>
    );
  }
}

Manage.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ groups, users, account, theme }) {
  return {
    groups,
    users,
    account,
    theme
  };
}
export default connect(mapStateToProps, {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups,
  unsubscribeAccount,
  getAccount,
  lightThemeLoad
})(withRouter(withStyles(styles)(Manage)));
