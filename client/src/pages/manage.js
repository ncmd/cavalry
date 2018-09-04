import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessager,
  addGroupDepartment,
  addGroupLocation,
  addGroups
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import {Link} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Form, FormGroup, Input } from 'reactstrap';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";

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
            inputInstantmessager:'',
            inputDepartment:'',
            inputLocation:'',
            groups:[],
            groupItemCounter:0,
            groupIndex:0
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {

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
    addGroup(contactname, emailaddress, instantmessager, department,location, groupIndex) {
      // Get Previous Objective State which should start as an empty array '[]'
      const prevGroups = this.state.groups;

      // Function tasks in arguments to be pushed to array
      // Creating an empty 'tasks' array so elements can be added
      // 'expanded' determines if the objective expands to show 'tasks'
      prevGroups.push({
        contactname: contactname,
        emailaddress:  emailaddress,
        instantmessager: instantmessager,
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
          inputInstantmessager:'',
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
    handleInputInstantMessager = inputInstantmessager => event => {
        this.setState({
            inputInstantmessager: event.target.value,
        }, () => {
          this.props.addGroupInstantmessager(this.state.inputInstantmessager)
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
              <Input  value={this.state.inputInstantmessager} onChange={this.handleInputInstantMessager()} placeholder="slack"/>
            </FormGroup>
            <FormGroup>
              <Input value={this.state.inputDepartment} onChange={this.handleInputDepartment()} placeholder="security operations"/>
            </FormGroup>
            <FormGroup>
              <Input value={this.state.inputLocation} onChange={this.handleInputLocation()} style={{width:'50%',display:'inline'}} placeholder="san francisco"/>
              <Button style={{background:actionButton}} onClick={() => this.addGroup(this.state.inputContactname, this.state.inputEmailaddress,this.state.inputInstantmessager,this.state.inputDepartment,this.state.inputLocation,this.state.groupIndex)}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Submit</b></Typography></Button>
            </FormGroup>
          </Form>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contact Name</TableCell>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Instant Messager</TableCell>
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
                      <TableCell>{g.instantmessager}</TableCell>
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

    renderSelectedOption(option){
      if(option === 'myposts'){
        return (
          <div>Sorry this feature is in construction. Target Date 9/10/18</div>
        )
      }
      if(option === 'setupgroups'){
        return (
          this.renderSetupGroups()
        )
      }

    }

    render() {
        return (
            <div>
                <Header/>
                  <script type="text/javascript">

                </script>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,

                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{ height:300,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'row'} spacing={40}>
                      {/*<Grid item>
                        <Button style={{background:actionButton}} onClick={() => this.handleClickMyPosts()}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>My Posts</b></Typography></Button>
                      </Grid>*/}
                      <Grid item>
                        <Button style={{background:actionButton}} onClick={() => this.handleClickSetupGroups()}><Typography variant={"caption"} style={{color:'white', textTransform: 'none'}}><b>Setup Groups</b></Typography></Button>
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>{this.renderSelectedOption(this.state.selectedOption)}</Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ groups }) {
    return { groups };
}
export default connect(mapStateToProps, {
  addGroupContactname,
  addGroupEmailaddress,
  addGroupInstantmessager,
  addGroupDepartment,
  addGroupLocation,
  addGroups
})(withRouter(Manage));
