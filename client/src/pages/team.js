import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupEmailaddress,
  addGroups,
  inviteAccount,
  createOrganization,
  checkOrganization,
  joinOrganization,
  leaveOrganization,
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
import { Form, FormGroup, Input, Badge } from 'reactstrap';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class Team extends Component {

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
            inputSkillsExperience:'',
            groups:[],
            groupItemCounter:0,
            groupIndex:0,
            validEmail:false,
            tabValue:0,
            selectItem1:false,
            selectItem2:false,
            selectItem3:false,
            organizationmember:false,
            organizationname:"",
            organizationnamejoin:"",
            validOrganization:false,
            validOrganizationJoin:false,
            organizationnamechanged:true,
            organizationnamejoinchanged:true,
            organizationnameexists:false,
            organizationnamejoinexists:false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleInputEmailaddress = this.handleInputEmailaddress.bind(this);
        this.handleInputOrganizationName = this.handleInputOrganizationName.bind(this);
        this.handleInputOrganizationNameJoin = this.handleInputOrganizationNameJoin.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
      // Current User Plan

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
    addGroup(emailaddress, groupIndex) {
      this.props.inviteAccount(emailaddress,this.props.organization.organizationname)
      // Get Previous Objective State which should start as an empty array '[]'
      const prevGroups = this.state.groups;

      // Function tasks in arguments to be pushed to array
      // Creating an empty 'tasks' array so elements can be added
      // 'expanded' determines if the objective expands to show 'tasks'
      prevGroups.push({
        emailaddress:  emailaddress,
        index: groupIndex,
      });

      this.setState({
        groups: prevGroups,
        groupItemCounter: this.state.groupItemCounter + 1,
        groupIndex: this.state.groupIndex + 1,
      }, () => {
        this.props.addGroups(this.state.groups)
        this.setState({
          inputEmailaddress:'',
        })
      });
    }

    handleInputEmailaddress = inputEmailaddress => event => {
        this.setState({
            [inputEmailaddress]: event.target.value,
        }, () => {
            this.props.addGroupEmailaddress(this.state.inputEmailaddress)
            const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (emailRegex.test(inputEmailaddress)) {
                // // console.log("Valid Email Address:",email);
            } else {
                // Invalid phone number
                // // console.log("Invalid Email Address:",email);
                this.setState({validEmail:false})
            }
            if (this.state.validEmail === false){
                // // console.log(event.target.value);
                this.validateEmail(this.state.inputEmailaddress);
            }
            if (this.state.validEmail === true){
                // // console.log(event.target.value);
                this.validateEmail(this.state.inputEmailaddress);
                // this.checkEmailExists(this.state.email);
            }
        });
    };

    handleInputOrganizationName = organizationname => event => {
      console.log(event.target.value.length)
      if (event.target.value.length <= 30){
        this.setState({
            [organizationname]: event.target.value,
            organizationnamechanged: true,
        }, () => {
          const organizationNameRegex = /^[a-zA-Z0-9]{4,10}$/
          if (organizationNameRegex.test(organizationname)) {
          } else {
              this.setState({validOrganization:false})
          }
          if (this.state.validOrganization === false){
            this.validateOrganizationName(this.state.organizationname)

          }
          if (this.state.validOrganization === true){
             this.props.checkOrganization(this.state.organizationname).then(() => {
               if (this.props.organization.check === "exists"){
                 this.setState({
                   validOrganization: false
                 })
               }
             })
            this.validateOrganizationName(this.state.organizationname)
          }
        })
      }
    };

    handleInputOrganizationNameJoin = organizationnamejoin => event => {
      console.log(event.target.value.length)
      if (event.target.value.length <= 30){
        this.setState({
            [organizationnamejoin]: event.target.value,
            organizationnamejoinchanged: true,
        }, () => {

          const organizationNameRegex = /^[a-zA-Z0-9]{4,10}$/
          if (organizationNameRegex.test(organizationnamejoin)) {
          } else {
              this.setState({validOrganizationJoin:false})
          }
          if (this.state.validOrganizationJoin === false){
            this.validateOrganizationNameJoin(this.state.organizationnamejoin)
          }
          if (this.state.validOrganizationJoin === true){
            this.props.checkOrganization(this.state.organizationnamejoin).then(() => {
              if (this.props.organization.check === "available"){
                this.setState({
                  validOrganizationJoin: false
                })
              }
            })
            this.validateOrganizationNameJoin(this.state.organizationnamejoin)
          }
        })
      }
    };

    validateOrganizationName(organizationname){
        const organizationNameRegex = /^[a-zA-Z0-9]{4,10}$/
        if (organizationNameRegex.test(organizationname)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validOrganization:true});

        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validOrganization:false})
        }
    }

    validateOrganizationNameJoin(organizationnamejoin){
        const organizationNameRegex = /^[a-zA-Z0-9]{4,10}$/
        if (organizationNameRegex.test(organizationnamejoin)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validOrganizationJoin:true});
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validOrganizationJoin:false})
        }
    }


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

    renderSetupGroups(){

      return(
        <div>

          <Form style={{marginTop:30}}>
            <Typography style={{color:'white'}} variant={'display2'}>Manage Team</Typography>
            <FormGroup>
              <Typography style={{color:'white'}}>Email Address</Typography>
              <Input value={this.state.inputEmailaddress} onChange={this.handleInputEmailaddress('inputEmailaddress')} placeholder="name@company.com"/>
            </FormGroup>
            {this.renderSetupButton()}
          </Form>
        </div>
      )
    }

    renderSetupButton(){
      if(this.state.validEmail === true){
        return (
          <Button style={{background:actionButton}} onClick={() => this.addGroup(this.state.inputEmailaddress,)}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Invite</b></Typography></Button>
        )
      } else {
        return (
          <Button disabled style={{background:"grey"}} ><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Invite</b></Typography></Button>
        )
      }
    }

    renderOrganizationNameError(){
      if(this.state.validOrganization === false){
        return (
            <Typography style={{color:'white'}} variant={'caption'}>Not a valid Organization name. At least 4 characters, max 30 characters, no special characters.</Typography>
        )
      }
      if(this.props.organization.check === "exists"){
        return (
            <Typography style={{color:'white'}} variant={'caption'}>This organization exists! Request to Join or Create a new Organization.</Typography>
        )
      }
    }

    renderOrganizationNameJoinError(){
      if(this.state.validOrganizationJoin === false){
        return (
          <div>
            <Typography style={{color:'white'}} variant={'caption'}>Not a valid Organization name. At least 4 characters, max 30 characters, no special characters.</Typography>
          </div>
        )
      }
      if(this.props.organization.check === "available"){
        return (
            <Typography style={{color:'white'}} variant={'caption'}>This organization does not exist! You can Create a new Organization or ask your team for the correct Organization name.</Typography>
        )
      }
    }

    createAndJoinOrganization(){
      this.props.createOrganization(this.state.organizationname,this.props.account.accountid).then(() => {
        this.props.joinOrganization(this.state.organizationname,this.props.account.accountid)
      })
    }

    renderButtonValidOrgName(){
      if (this.state.validOrganization === true && this.props.organization.check === 'available'){
        return (
          <div>
            <Button onClick={() => this.createAndJoinOrganization()} style={{background:actionButton}}><Typography style={{textTransform:'none', color:'white'}} variant={'caption'}><b>Create</b></Typography> </Button>
          </div>
        )
      } else {
        return (
          <Button disabled style={{background:'grey'}}><Typography style={{textTransform:'none', color:'white'}} variant={'caption'}><b>Create</b></Typography> </Button>
        )
      }
    }

    renderButtonValidOrgNameJoin(){
      if (this.state.validOrganizationJoin === true && this.props.organization.check === 'exists'){
        return (
          <Button style={{background:actionButton}}><Typography style={{textTransform:'none', color:'white'}} variant={'caption'}><b>Request</b></Typography> </Button>
        )
      } else {
        return (
          <Button disabled style={{background:'grey'}}><Typography style={{textTransform:'none', color:'white'}} variant={'caption'}><b>Request</b></Typography> </Button>
        )
      }
    }

    renderOrganizationSetup(){
      if (this.props.organization.organizationmember === false){
        return (
          <div>
            <Typography style={{color:'white', padding:40}} variant={'title'}><b>You need to Create or Join an Organization to be able to manage a Team</b></Typography>
              <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingTop:20, paddingBottom:20}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                <Grid item style={{ border:'1px solid #474f97', padding:40, width:'100%'}} xs>
            <Typography style={{color:'white'}}>Create an Organization</Typography>
            {this.state.validOrganization
              ?
              <Input valid value={this.state.organizationname} onChange={this.handleInputOrganizationName('organizationname')} placeholder="piedpiper"/>
              :
              <Input invalid value={this.state.organizationname} onChange={this.handleInputOrganizationName('organizationname')} placeholder="piedpiper"/>
            }
            {this.renderOrganizationNameError()}
            {this.renderButtonValidOrgName()}
            </Grid>
          </Grid>
            <br/>
              <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"50em", paddingBottom:40}} direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                <Grid item style={{ border:'1px solid #474f97', padding:40, width:'100%'}} xs>
            <Typography style={{color:'white'}}>Request to join Organization</Typography>
              {this.state.validOrganizationJoin
                ?
                <Input valid value={this.state.organizationnamejoin} onChange={this.handleInputOrganizationNameJoin('organizationnamejoin')} placeholder="piedpiper"/>
                :
                <Input invalid value={this.state.organizationnamejoin} onChange={this.handleInputOrganizationNameJoin('organizationnamejoin')} placeholder="piedpiper"/>
              }
            {this.renderOrganizationNameJoinError()}
            {this.renderButtonValidOrgNameJoin()}
            </Grid>
          </Grid>
          </div>
        )
      }
    }

    renderManageTeamSetup(){
      const { classes } = this.props;

      if (this.props.organization.organizationmember === true){
        return (
          <div >
            <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
              <Grid item>{this.renderSetupGroups()}</Grid>
            </Grid>
            <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:50}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
              <Grid item>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.groups.map(g => {
                        return (
                          <TableRow key={g.emailaddress}>
                            <TableCell>{g.emailaddress}</TableCell>
                            <TableCell><Badge style={{background:"red"}}>Invited</Badge></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
              <Button style={{background:actionButton}} onClick={() => this.props.leaveOrganization(this.props.organization.organizationname,this.props.account.accountid)}><Typography style={{color:'white'}} variant={'caption'}>Leave Organization</Typography></Button>
            </Grid>

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
                        height: this.state.height,
                    }}
                >
                    {/* Top Section */}
                      <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                        <Grid item>
                          {this.renderOrganizationSetup()}
                        </Grid>
                      </Grid>
                      {this.renderManageTeamSetup()}
                </div>
            </div>
        );
    }
}

Team.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ groups,users,account,organization }) {
    return { groups,users,account,organization };
}
export default connect(mapStateToProps, {
  addGroupEmailaddress,
  addGroups,
  inviteAccount,
  createOrganization,
  checkOrganization,
  joinOrganization,
  leaveOrganization,
})(withRouter(withStyles(styles)(Team)));
