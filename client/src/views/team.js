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
  loadOrganizationAll,
  getAccount,
  changeOrgMemberDepartment,
} from '../redux/actions';
import { auth } from '../components/firebase'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// import {Link} from "react-router-dom";
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { Form, Input, Badge, InputGroupAddon, InputGroup, Table} from 'reactstrap';
import Select from 'react-select';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Send from '@material-ui/icons/Send';
import './team.css'

// const bodyBlue = "linear-gradient(#1a237e, #121858)";
// const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {

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
            listorganiztionmembers:[],
            loadSelectOptions:false,
            selectValueOptions:[{value:"any",label:"any"},{value:"legal",label:"legal"},{value:"security",label:"security"}],
            selectValue:[],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleInputEmailaddress = this.handleInputEmailaddress.bind(this);
        this.handleInputOrganizationName = this.handleInputOrganizationName.bind(this);
        this.handleInputOrganizationNameJoin = this.handleInputOrganizationNameJoin.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
      // Current User Plan
      if(this.props.account.organizationname !== ""){
        this.props.loadOrganizationAll(this.props.account.organizationname).then(() => {
          // console.log("Organization Loaded")
          this.props.organization.organizationmembers.map((member) => {
            console.log("Member",member)
            var prevlistorganiztionmembers = this.state.groups
            prevlistorganiztionmembers.push(
              {
                emailaddress: member.emailaddress,
                status: member.status,
                department: member.department,
              }
            )
            this.setState({
              groups: prevlistorganiztionmembers
            })
            return null
          })
        })
      }
      if (this.props.users.logged === true ){
        this.props.getAccount(this.props.users.login)
      }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if(this.props.account.organizationmember === true ){
          // console.log("Organization Name:",this.props.account.organizationname)
          // auth.getOrganizationMembers(this.props.account.organizationname)
        }
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

    handleChangeSelect = (index,selectValue) => (event) => {
      // this.setState({
      //     [selectValue]: event,
      // })

      const groups = this.state.groups;
      groups[index].department = event.value
      this.forceUpdate();
      this.props.changeOrgMemberDepartment(this.props.account.organizationname,index,event.value)
      console.log("Selected:",event.value)

   }

    // Adding Member to Organzition
    addGroup(emailaddress, groupIndex) {
      console.log(this.props.account.organizationname)
      this.props.inviteAccount(emailaddress,this.props.organization.organizationname).then( (newaccountid) => {
        console.log("Got new account id:",newaccountid)
        console.log(this.props.account.organizationname)
        auth.addMemberToOrganization(this.props.account.organizationname, emailaddress, newaccountid, "invited")
        // setTimeout(function(){   auth.addMemberToOrganization(this.props.account.organizationname, newaccountid) }, 3000);
      })

      // Get Previous Objective State which should start as an empty array '[]'
      const prevGroups = this.state.groups;

      // Function tasks in arguments to be pushed to array
      // Creating an empty 'tasks' array so elements can be added
      // 'expanded' determines if the objective expands to show 'tasks'
      prevGroups.push({
        emailaddress:  emailaddress,
        department: "any",
        status: "invited",
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
          const organizationNameRegex = /^[a-zA-Z0-9]{4,30}$/
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

          const organizationNameRegex = /^[a-zA-Z0-9]{4,30}$/
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
        const organizationNameRegex = /^[a-zA-Z0-9]{4,30}$/
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
        const organizationNameRegex = /^[a-zA-Z0-9]{4,30}$/
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
            // validate if email exists
            this.state.groups.map((member) => {
              console.log(member.emailaddress,email)
              if (member.emailaddress.indexOf(email) > -1){
                  this.setState({validEmail:false})
              }
              return null
            })
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validEmail:false})

        }
    }

    renderSetupGroups(){
      var str = this.props.account.organizationname;
      var res = str.toLowerCase();

      return(
        <div >
          <Form style={{width:'100%'}}>
            <div style={{maxWidth:800, marginLeft:'auto', marginRight:'auto',borderRadius:'5px 5px 0px 0px', background:this.props.theme[0].HeaderBackground, color:this.props.theme[0].PostsTypographyTitle, verticalAlign:'bottom', padding:10}}>Manage <b>{res}</b></div>
            <div style={{borderBottom:this.props.theme[0].PostsButtonBorder, width:'100%'}}></div>
            <div style={{maxWidth:800, marginLeft:'auto', marginRight:'auto',color:this.props.theme[0].PostsTypographyDescription, padding:10}}>Invite others to join your workspace.</div>
            <InputGroup style={{maxWidth:800, marginLeft:'auto', marginRight:'auto',paddingBottom:10,paddingLeft:10,paddingRight:10,width:'100%'}}>
              <Input style={{boxShadow:'0px 0px 0px 0px'}} value={this.state.inputEmailaddress} onChange={this.handleInputEmailaddress('inputEmailaddress')} placeholder="name@company.com"/>
              <InputGroupAddon addonType="append">{this.renderSetupButton()}</InputGroupAddon>
            </InputGroup>

          </Form>
        </div>
      )
    }

    renderSetupButton(){
      if(this.state.validEmail === true){
        return (
          <Button style={{border:this.props.theme[0].PostsButtonBorder, borderRadius:'0px 5px 5px 0px', textTransform:'none',background:this.props.theme[0].PrimaryLinear}} onClick={() => this.addGroup(this.state.inputEmailaddress,)}><div  style={{color:'white', textTransform: 'none'}}><b>Send Invitation<Send style={{fontSize:18,marginLeft:5}}/></b></div></Button>
        )
      } else {
        return (
          <Button style={{border:this.props.theme[0].PostsButtonBorder, borderRadius:'0px 5px 5px 0px', textTransform:'none', background:this.props.theme[0].DisabledBackground,color:this.props.theme[0].DisabledText}}>Send Invitation<Send style={{fontSize:18,marginLeft:5}}/></Button>
        )
      }
    }

    renderOrganizationNameError(){
      if(this.state.validOrganization === false){
        return (
            <div style={{color:this.props.theme[0].PostsTypographyTitle, marginBottom:5, letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >Not a valid Organization name. At least 4 characters, max 30 characters, no special characters.</div>
        )
      }
      if(this.props.organization.check === "exists"){
        return (
            <div style={{color:this.props.theme[0].PostsTypographyTitle,  marginBottom:5,letterSpacing:'-0.5px', fontSize:'14px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} >This organization exists! Request to Join or Create a new Organization.</div>
        )
      }
    }

    renderOrganizationNameJoinError(){
      if(this.state.validOrganizationJoin === false){
        return (
          <div>
            <div style={{color:this.props.theme[0].PostsTypographyTitle}} >Not a valid Organization name. At least 4 characters, max 30 characters, no special characters.</div>
          </div>
        )
      }
      if(this.props.organization.check === "available"){
        return (
            <div style={{color:this.props.theme[0].PostsTypographyTitle}} >This organization does not exist! You can Create a new Organization or ask your team for the correct Organization name.</div>
        )
      }
    }

    createAndJoinOrganization(){
      this.props.createOrganization(this.state.organizationname,this.props.account.emailaddress,this.props.account.accountid).then(() => {
        this.props.joinOrganization(this.state.organizationname,this.props.account.accountid)
        // auth.addMemberToOrganization(this.state.organizationname,this.props.account.accountid)
      })
    }

    renderButtonValidOrgName(){
      if (this.state.validOrganization === true && this.props.organization.check === 'available'){
        return (
          <div>
            <Button onClick={() => this.createAndJoinOrganization()} style={{borderRadius:this.props.theme[0].BorderRadius,background:this.props.theme[0].PrimaryLinear}}><div style={{textTransform:'none', color:'white'}} ><b style={{verticalAlign:'middle'}}>Continue<ArrowForward style={{fontSize:18, verticalAlign:'middle'}}/></b></div> </Button>
          </div>
        )
      } else {
        return (
          <Button disabled style={{borderRadius:this.props.theme[0].BorderRadius,background:this.props.theme[0].DisabledBackground}}><div style={{textTransform:'none', color:this.props.theme[0].DisabledText}} ><b style={{verticalAlign:'middle'}}>Continue<ArrowForward style={{fontSize:18, verticalAlign:'middle'}}/></b></div> </Button>
        )
      }
    }

    renderButtonValidOrgNameJoin(){
      if (this.state.validOrganizationJoin === true && this.props.organization.check === 'exists'){
        return (
          <Button style={{background:this.props.theme[0].PrimaryLinear}}><div style={{textTransform:'none', color:this.props.theme[0].PrimaryLinear}} ><b>Request</b></div> </Button>
        )
      } else {
        return (
          <Button disabled style={{background:'grey'}}><div style={{textTransform:'none', color:'white'}} ><b>Request</b></div> </Button>
        )
      }
    }

    renderOrganizationSetup(){
      if (this.props.account.organizationmember === false){
        return (
          <div>
            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
              <Grid item style={{ width:'100%'}} xs={12}>
                <Form style={{ flexGrow:1, maxWidth:800 ,marginLeft:'auto',marginRight:'auto'}}>
                    <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                    <Grid item style={{width:'100%'}}>
                      <div style={{color:this.props.theme[0].PostsTypographyTitle, textTransform: 'none', fontSize:'39px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} ><b>What's the name of your company or group?</b></div>
                    </Grid>
                    <Grid item style={{width:'100%'}}>
                      <div style={{color:this.props.theme[0].PostsTypographyTitle, fontSize:'21px', fontWeight:100, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>  We’ll use this to name your workspace, which you can always change later.
                      </div>
                    </Grid>
                  </Grid>
                </Form>
              </Grid>
            </Grid>

              <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", marginTop:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                <Grid item style={{width:'100%'}} xs={12}>
                  <Form style={{ flexGrow:1, maxWidth:800,marginLeft:'auto',marginRight:'auto', padding: 20,borderRadius:this.props.theme[0].BorderRadius, background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder}}>
                      <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                      <Grid item style={{width:'100%'}}>
                      <div style={{color:this.props.theme[0].PostsTypographyDescription, marginBottom:10}}>Company or group name</div>
                      {this.state.validOrganization
                        ?
                        <Input style={{marginBottom:10}} valid value={this.state.organizationname} onChange={this.handleInputOrganizationName('organizationname')} placeholder="piedpiper"/>
                        :
                        <Input style={{marginBottom:10}} invalid value={this.state.organizationname} onChange={this.handleInputOrganizationName('organizationname')} placeholder="piedpiper"/>
                      }
                      {this.renderOrganizationNameError()}
                      {this.renderButtonValidOrgName()}
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              </Grid>

              {/*<Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginTop:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                <Grid item style={{padding:10, width:'100%'}} xs={12}>
                  <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                      <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                      <Grid item style={{width:'100%'}}>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Request</b> to join a company or group</div>
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
                  </Form>
                </Grid>
              </Grid>*/}
          </div>
        )
      }
    }

    renderSelect(index,valueDepartment){

      if(this.state.selectValueOptions.length > 0){
        return(
          <Select
            name="department"
            options={this.state.selectValueOptions}
            className="menu-outer-top"
            isClearable={false}
            classNamePrefix="select"
            value={valueDepartment}
            onChange={this.handleChangeSelect(index,'selectValue')}
          />
        )
      }
    }

    renderSelectActions(index, valueAction){

    }

    renderManageTeamSetup(){
      // const { classes } = this.props;

      if (this.props.account.organizationmember === true && this.props.organization.organizationname !== ""){
        return (
          <div style={{marginLeft:10, marginRight:10}}>
            <Grid container style={{ background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
              <Grid item style={{width:'100%'}}>{this.renderSetupGroups()}</Grid>
            </Grid>
            <Grid container style={{ background:this.props.theme[0].PostsButtonBackground , border:this.props.theme[0].PostsButtonBorder, borderRadius:this.props.theme[0].BorderRadius, flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:30, marginTop:5}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >

              <Grid item style={{width:'100%', overflowX:'scroll', padding:20}}>
                <Table striped style={{ border:this.props.theme[0].PostsButtonBorder}}>
                  <thead>
                    <tr>
                      <th><Checkbox/></th>
                      <th style={{verticalAlign:'middle', color:this.props.theme[0].PostsTypographyTitle}}>Email Address</th>
                      <th style={{verticalAlign:'middle', color:this.props.theme[0].PostsTypographyTitle}}>Department</th>
                      <th style={{verticalAlign:'middle', color:this.props.theme[0].PostsTypographyTitle}}>Status</th>
                      <th style={{verticalAlign:'middle', color:this.props.theme[0].PostsTypographyTitle}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.groups.map((g,index) => {
                      if(g.status === "active"){
                        return (
                          <tr key={g.emailaddress}>
                            <th scope="row"><Checkbox/></th>
                            <td style={{verticalAlign:'middle'}}><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></td>
                            <td style={{verticalAlign:'middle'}}>{this.renderSelect(index,{value:g.department,label:g.department})}</td>
                            <td style={{verticalAlign:'middle'}}><Badge style={{background:"green"}}>{g.status}</Badge></td>
                          </tr>
                        )
                      } else if (g.status === "invited"){
                        return (
                          <tr key={g.emailaddress}>
                            <th scope="row"><Checkbox/></th>
                            <td style={{verticalAlign:'middle'}}><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></td>
                            <td style={{verticalAlign:'middle'}}>{this.renderSelect(index,{value:g.department,label:g.department})}</td>
                            <td style={{verticalAlign:'middle'}}><Badge style={{background:"blue"}}>{g.status}</Badge></td>
                          </tr>
                        )
                      }else if (g.status === "requested"){
                        return (
                          <tr key={g.emailaddress}>
                            <th scope="row"><Checkbox/></th>
                            <td style={{verticalAlign:'middle'}}><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></td>
                            <td style={{verticalAlign:'middle'}}>{this.renderSelect(index,{value:g.department,label:g.department})}</td>
                            <td style={{verticalAlign:'middle'}}><Badge style={{background:"red"}}>{g.status}</Badge></td>
                          </tr>
                        )
                      }
                      return null
                    })}
                  </tbody>
                </Table>
                {/*
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell><div style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Email Address</b></div></TableCell>
                        <TableCell><div style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Department</b></div></TableCell>
                        <TableCell><div style={{color:this.props.theme[0].PostsTypographyTitle}}><b>Status</b></div></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.groups.map((g,index) => {
                        if(g.status === "active"){
                          return (
                            <TableRow key={g.emailaddress}>
                              <TableCell><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></TableCell>
                              <TableCell>
                                {this.renderSelect(index,{value:g.department,label:g.department})}
                              </TableCell>
                              <TableCell><Badge style={{background:"green"}}>{g.status}</Badge></TableCell>
                            </TableRow>
                          )
                        } else if (g.status === "invited"){
                          return (
                            <TableRow key={g.emailaddress}>
                              <TableCell><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></TableCell>
                                <TableCell>
                                  {this.renderSelect(index,{value:g.department,label:g.department})}
                                </TableCell>
                              <TableCell><Badge style={{background:"blue"}}>{g.status}</Badge></TableCell>
                            </TableRow>
                          )
                        }else if (g.status === "requested"){
                          return (
                            <TableRow key={g.emailaddress}>
                              <TableCell><div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{g.emailaddress}</div></TableCell>
                                <TableCell>
                                  {this.renderSelect(index,{value:g.department,label:g.department})}
                                </TableCell>
                              <TableCell><Badge style={{background:"red"}}>{g.status}</Badge></TableCell>
                            </TableRow>
                          )
                        }
                      })}
                    </TableBody>
                  </Table>
                  */}


              </Grid>
            </Grid>
            <Grid container style={{ background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
              {/*<Button style={{background:actionButton}} onClick={() => this.props.leaveOrganization(this.props.organization.organizationname,this.props.account.accountid)}><div style={{color:'white'}} >Leave Organization</div></Button>*/}
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
                        background: this.props.theme[0].MainBackground,
                        height: this.state.height,
                        marginTop:48,
                        paddingLeft:10,
                        paddingRight:10,
                        paddingTop:24,
                    }}
                >
                    {/* Top Section */}
                      <Grid container style={{ flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                        <Grid item style={{width:'100%', marginTop:5}} >
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

function mapStateToProps({ groups,users,account,organization,theme }) {
    return { groups,users,account,organization ,theme};
}
export default connect(mapStateToProps, {
  addGroupEmailaddress,
  addGroups,
  inviteAccount,
  createOrganization,
  checkOrganization,
  joinOrganization,
  getAccount,
  leaveOrganization,
  loadOrganizationAll,
  changeOrgMemberDepartment,
})(withRouter(withStyles(styles)(Team)));
