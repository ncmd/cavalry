import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import {Link} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Form, FormGroup, Input } from 'reactstrap';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";
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
    color:'black',
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
            selectedOption:'setupgroups',
            inputContactname:'',
            inputEmailaddress:'',
            inputInstantmessenger:'',
            inputDepartment:'',
            inputLocation:'',
            groups:[],
            groupItemCounter:0,
            groupIndex:0,
            tabValue:0,
            selectItem1:false,
            selectItem2:false,
            selectItem3:false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
      // Current User Plan
      if (this.props.account.plan === '12months'){
        this.setState({
          selectItem2:true
        })
      } else if (this.props.account.plan === '1month'){
        this.setState({
          selectItem1:true
        })
      } else if (this.props.account.plan === 'beta'){
        this.setState({
          selectItem3:true
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

    handleClickMyPosts(){
      this.setState({
        selectedOption: 'myposts'
      })
    }

    handleClickSetupGroups(){
      this.setState({
        selectedOption: 'setupgroups'
      })
    }


    // Adding Objective to New Runbook
    addGroup(contactname, emailaddress, instantmessenger, department,location, groupIndex) {
      // Get Previous Objective State which should start as an empty array '[]'
      const prevGroups = this.state.groups;

      // Function tasks in arguments to be pushed to array
      // Creating an empty 'tasks' array so elements can be added
      // 'expanded' determines if the objective expands to show 'tasks'
      prevGroups.push({
        contactname: contactname,
        emailaddress:  emailaddress,
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
          inputContactname:'',
          inputEmailaddress:'',
          inputInstantmessenger:'',
          inputDepartment:'',
          inputLocation:'',
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

    renderSetupGroups(){

      return(
        <div>

          <Form style={{marginTop:30}}>
            <Typography style={{color:'white'}} variant={'display2'}>Manage Groups</Typography>
            <FormGroup style={{marginTop:20}}>
              <Input value={this.state.inputContactname} onChange={this.handleInputContactname()} placeholder="firstname lastname"/>
            </FormGroup>
            <FormGroup>
              <Input value={this.state.inputEmailaddress} onChange={this.handleInputEmailaddress()} placeholder="name@company.com"/>
            </FormGroup>
            <FormGroup>
              <Input  value={this.state.inputInstantmessenger} onChange={this.handleInputInstantMessenger()} placeholder="slack"/>
            </FormGroup>
            <FormGroup>
              <Input value={this.state.inputDepartment} onChange={this.handleInputDepartment()} placeholder="security operations"/>
            </FormGroup>
            <FormGroup>
              <Input value={this.state.inputLocation} onChange={this.handleInputLocation()} style={{width:'50%',display:'inline'}} placeholder="san francisco"/>
              <Button style={{background:actionButton}} onClick={() => this.addGroup(this.state.inputContactname, this.state.inputEmailaddress,this.state.inputInstantmessenger,this.state.inputDepartment,this.state.inputLocation,this.state.groupIndex)}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Submit</b></Typography></Button>
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

    renderSelectedOption(){
      if( this.state.tabValue === 0){
        return(
          this.renderAccountDetails()
        )
      } else if ( this.state.tabValue === 1){
        return(
          this.renderCurrentPlan()
        )
      } else if ( this.state.tabValue === 2){
        return (
          this.renderSupport()
        )
      }
    }

    renderAccountDetails(){
      return (
        <div style={{background:'white', marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:40}}>
        <Grid container style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', paddingTop:20, maxWidth:"45em"}} xs={12}>
            <div>
              <Typography variant={'display1'} style={{color:'black'}}>Your information</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{flexGrow:1,border:'1px solid #474f97', margin:"0 auto", maxWidth:"50em", padding:40, marginTop:20}} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
          <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"45em"}} xs={12}>
            <div>
              <Typography variant={'body2'} style={{color:'black'}}><b>Email Address: </b>{this.props.users.email}</Typography>
            </div>
          </Grid>
        </Grid>
        </div>
      )
    }

    renderSupport(){
      return(
        <div style={{background:'white', marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:40}}>
          <Grid container style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
            <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', paddingTop:20, maxWidth:"45em"}} xs={12}>
              <div>
                <Typography variant={'display1'} style={{color:'black'}}>Contact support</Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container style={{flexGrow:1,border:'1px solid #474f97', margin:"0 auto", maxWidth:"50em", padding:40, marginTop:20}} direction={'row'} justify={'space-around'} alignItems={'center'} spacing={0}>
            <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"45em"}} xs={12}>
              <div>
                <Typography variant={'body2'} style={{color:'black'}}><b>Support Email: </b>cavalrytacticsinc@gmail.com</Typography>
              </div>
            </Grid>
          </Grid>
        </div>

      )
    }

    renderCurrentPlan(){
      return(
        <div style={{background:'white', marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:40}}>
        <Grid container style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', paddingTop:20, maxWidth:"45em"}} xs={12}>
            <div>
              <Typography variant={'display1'} style={{color:'black'}}>Your current plan</Typography>
            </div>
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
              <Button disabled className="box" style={{background:'white', height:230, width:230}}>
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
              <Button disabled className="box" style={{background:'white', height:230, width:230}}>
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
                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Beta Test</Typography>
                  <Typography style={{color:'black'}} variant={'display1'}><b>$1.00</b></Typography>
                  <Typography style={{textTransform:'none'}} variant={'caption'}>for now...</Typography>
                    <Typography style={{textTransform:'none', marginTop:20, borderTop: '2px solid rgba(0, 0, 0, 0.12)'}} variant={'caption'}><b>$1.00</b> billed every month</Typography>
                    <Typography style={{textTransform:'none'}} variant={'caption'}>(<b><span aria-label="emoji" role="img">Limited time only 😎</span></b>)</Typography>
                </div>
              </Button>
              :
              <Button disabled className="box" style={{background:'white', height:230, width:230}}>
                <div className="ribbongreen"><span aria-label="emoji" role="img">😎Beta😎</span></div>
                <div>
                  <Typography style={{color:'black',textTransform:'none'}} variant={'title'}>Beta Test</Typography>
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
        <Grid container style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
          <Grid item style={{background:'white',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', paddingTop:20, maxWidth:"45em"}} xs={12}>
            <div>
              <Button><Typography variant={'title'} style={{color:'black', textTransform:'none'}}>Cancel Subscription <span aria-label="emoji" role="img">😢</span></Typography></Button>
            </div>
          </Grid>
        </Grid>
      </div>
      )
    }

    handleClickItem1(){
      this.setState({
        selectItem1:true,
        selectItem2:false,
        selectItem3:false,
      })
    }
    handleClickItem2(){
      this.setState({
        selectItem1:false,
        selectItem2:true,
        selectItem3:false,
      })
    }
    handleClickItem3(){
      this.setState({
        selectItem1:false,
        selectItem2:false,
        selectItem3:true,
      })
    }



    handleChangeTab = (event, tabValue) => {
      this.setState({ tabValue });
    };

    render() {

      const { classes } = this.props;

        return (
            <div>
                <Header/>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        height:this.state.height,
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{background:'white',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'row'}>
                      <Grid item >
                        <Tabs
                          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                          value={this.state.tabValue}
                          onChange={this.handleChangeTab}
                          fullWidth
                        >
                          <Tab label="ACCOUNT DETAILS" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                          <Tab label="CURRENT PLAN" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                          <Tab label="SUPPORT" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                        </Tabs>
                      </Grid>
                    </Grid>
                    {this.renderSelectedOption()}
                    {/* Bottom Section
                    <Grid container style={{background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'row'}>
                      <Grid item>
                        <Button style={{background:actionButton}} onClick={() => this.handleClickSetupGroups()}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Setup Groups</b></Typography></Button>
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

function mapStateToProps({ groups,users,account }) {
    return { groups,users,account };
}
export default connect(mapStateToProps, {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroups
})(withRouter(withStyles(styles)(Manage)));
