import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessenger,
  addGroupDepartment,
  addGroupLocation,
  addGroupSkillsExperience,
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
    handleInputSkillsExperience = inputSkillsExperience => event => {
        this.setState({
            inputSkillsExperience: event.target.value,
        }, () => {
          this.props.addGroupLocation(this.state.inputLocation)
        });
    };


    renderSetupGroups(){

      return(
        <div>

          <Form style={{marginTop:30}}>
            <Typography style={{color:'white'}} variant={'display2'}>Manage Team</Typography>
            <FormGroup style={{marginTop:20}}>
              <Typography style={{color:'white'}}>Full Name</Typography>
              <Input value={this.state.inputContactname} onChange={this.handleInputContactname()} placeholder="firstname lastname"/>
            </FormGroup>
            <FormGroup>
              <Typography style={{color:'white'}}>Email Address</Typography>
              <Input value={this.state.inputEmailaddress} onChange={this.handleInputEmailaddress()} placeholder="name@company.com"/>
            </FormGroup>
            <FormGroup>
              <Typography style={{color:'white'}}>Instant Messager</Typography>
              <Input  value={this.state.inputInstantmessenger} onChange={this.handleInputInstantMessenger()} placeholder="slack"/>
            </FormGroup>
            <FormGroup>
              <Typography style={{color:'white'}}>Role</Typography>
              <Input value={this.state.inputDepartment} onChange={this.handleInputDepartment()} placeholder="security operations"/>
            </FormGroup>
            <FormGroup>
              <Typography style={{color:'white'}}>Location</Typography>
              <Input value={this.state.inputLocation} onChange={this.handleInputLocation()} style={{width:'63em',display:'inline'}} placeholder="san francisco"/>
            </FormGroup>
            <FormGroup>
              <Typography style={{color:'white'}}>Skills & Experience</Typography>
              <Input type='textarea' value={this.state.inputSkillsExperience} onChange={this.handleInputSkillsExperience()} style={{width:'100%',display:'inline'}} placeholder="windows forensics, mac os x forensics, linux system administration"/>
            </FormGroup>
            <Button style={{background:actionButton}} onClick={() => this.addGroup(this.state.inputContactname, this.state.inputEmailaddress,this.state.inputInstantmessenger,this.state.inputDepartment,this.state.inputLocation,this.state.groupIndex)}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Submit</b></Typography></Button>
          </Form>

        </div>
      )
    }


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
                        height: this.state.height
                    }}
                >
                    {/* Top Section */}

                    <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>{this.renderSetupGroups()}</Grid>
                    </Grid>
                    <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:50}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>
                        <Paper className={classes.root}>
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Contact Name</TableCell>
                                <TableCell>Email Address</TableCell>
                                <TableCell>Instant Messenger</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Skills & Experience</TableCell>
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
                                    <TableCell>{g.skillsexperience}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    </Grid>


                </div>
            </div>
        );
    }
}

Team.propTypes = {
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
  addGroupSkillsExperience,
  addGroups
})(withRouter(withStyles(styles)(Team)));
