import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
    getPost,
    addActivity,
    addActivityToOrganization,
    loadOrganizationAll,
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {

  },
});

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            selectedIndex: 1,
            width: window.innerWidth,
            height: window.innerHeight,
            postTitle:'',
            postDescription:'',
            objectives:[],
            runObjectives:[],
            logged:false,
            open:false,
            selectValueOptions:[],
            selectValue:[],
            organizationActivity:[],

        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    handleClose = () => {
      this.setState({ open: false });
    };

    renderSelect(index,selectOption){
      if(this.state.selectValueOptions.length > 0){
        return(
          <Select
            name="organizationmemeber"
            options={this.state.selectValueOptions}
            className="basic-single"
            isClearable={false}
            classNamePrefix="select"
            value={selectOption.value}
            onChange={this.handleChangeSelect(index,'selectValue')}
          />
        )
      }
      // if task was assigned, disable / or just be to reassign task
    }

    handleChangeSelect = (index,selectValue) => (event) =>  {
      const prevObjectives = this.state.objectives;
      prevObjectives[index].selectOption = event.value
      prevObjectives[index].selectEmail = event.label
      this.forceUpdate();
      // this.props.changeOrgMemberDepartment(this.props.account.organizationname,index,event.value)
      // console.log("You selected:",event)
      // console.log("Objectives:",this.state.objectives)
      // this.setState({
      //   objectives:prevObjectives
      // })

   }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {

      // Load select options if user is logged in
      if (this.props.users.logged === true && this.props.account.organizationmember !== false){
        var prevSelectOptions = this.state.selectValueOptions
          this.props.loadOrganizationAll(this.props.account.organizationname).then(()=>{
            this.props.organization.organizationmembers.map((member)=>{
              // console.log("member",member)
              // add each member to selectValueOptions
              prevSelectOptions.push({
                value: member.accountid,
                label: member.emailaddress,
              })

            })
          })
        // var prevOrganizationActivity = this.state.organizationActivity

        // this.props.organization.organizationactivity.map((activity)=>{
          // console.log(member)
        //   // add each member to selectValueOptions
        //   prevOrganizationActivity.push({
        //     runbookid: activity.runbookid,
        //     runbooktitle: activity.runbooktitle,
        //     runbookdescription: activity.runbookdescription,
        //     runbooktags: activity.runbooktags,
        //     runbookobjectives: activity.runbookobjectives,
        //   })
        //
        // })
        this.setState({
          selectValueOptions: prevSelectOptions,
          // organizationActivity: prevOrganizationActivity,
        })
        // console.log("State Organization Activity:",this.state.organizationActivity)
      }


        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        // console.log(this.props.location);
        this.props.getPost('/api'+this.props.location.pathname).then(() => {

              this.setState({
                postTitle:this.props.posts.title,
                postDescription:this.props.posts.description,
                postTags:this.props.posts.tags,
              })

              if(this.props.posts.objectives.length > 0) {
                let prevObjectives = this.state.objectives;
                // console.log("Post Props Objectives:",this.props.posts.objectives)
                this.props.posts.objectives.map( r => {
                  prevObjectives.push({
                    title: r.title,
                    description: r.description,
                    department: r.department,
                    selectOption: {value:"any",label:"any"},
                    assignButton: false,
                  })
                  this.setState({
                    objectives: prevObjectives,
                  })
                  // console.log("Objectives:",prevObjectives)
                  return null
                })
              }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    renderObjectives(){
      return(
        this.state.objectives.map( (obj,index) => {
          return(
            <Grid key={obj.title} style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder,margin:0, padding:20, marginTop: 5, borderRadius:'5px 5px 5px 5px'}} item xs={12} >

                  <div  style={{color:this.props.theme[0].PostsTypographyTitle,marginBottom:5, padding:5 }} >
                    <div  style={{background:this.props.theme[0].PrimaryLinear,width:28,height:28,borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>{index+1}</div> <b>{obj.title}</b>
                  </div>
                  <Grid container spacing={8} alignItems="center" direction="row" justify="space-between" style={{paddingTop:5}}>
                    <Grid key={obj.department+Math.random()+(Math.random())} item >
                      <span style={{background:this.props.theme[0].PostsTagsBackground,height:20, borderRadius:16,textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold', paddingLeft:10, paddingRight:10, marginRight:5}}>
                        <div style={{color:'white',  letterSpacing:'-0.5px', fontSize:'12px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}><b>{obj.department}</b></div>
                      </span>
                  </Grid>
                  </Grid>
                  <div style={{color:this.props.theme[0].PostsTypographyTitle}} >
                    <div style={{color:this.props.theme[0].PostsTypographyTitle}}  dangerouslySetInnerHTML={{__html: obj.description}} />
                  </div>

              </Grid>
              )
        })
      )

    }

     findAndReplace(string, target, replacement) {
     var i = 0, length = string.length;
     for (i; i < length; i++) {
      string = string.replace(target, replacement);
     }
     return string;
    }

    renderTheme(){
      if (this.props.theme.length > 0){
        return this.props.theme[0].MainBackground
      }
    }

    renderModal(){
      this.setState({
        open: !this.state.open
      })
    }

    handleAssignObjective(activity, accountid,emailaddress){
      console.log("handleAssignObjective",activity)
      // massage data
      // console.log("props.posts",this.props.posts)

      var data = {
          runbookid: this.props.posts.id,
          runbooktitle: this.props.posts.title,
          runbookdescription: this.props.posts.description,
          runbooktags: this.props.posts.tags,
          runbookobjectives: {
            objectivetitle: activity.obj.title,
            objectivedescription:activity.obj.description,
            objectivestatus:"assigned",
            objectiveassignedto: {accountid:accountid,emailaddress:emailaddress},
          },
      }
      // console.log("Handle Assigne objective Data",data)
      this.props.addActivity(data, accountid)
      this.props.addActivityToOrganization(this.props.account.organizationname,data)
    }

    renderAssignButton(index, obj, accountid){
      // console.log("obj",obj)
      if (this.state.objectives[index].assignButton === false){
        return (
          <Button style={{background:this.props.theme[0].PrimaryLinear}} onClick={() => this.handleAssignObjective({obj},accountid)}><div  style={{color:'white', textTransform:'none'}}><b>Assign</b></div></Button>
        )
      } else if (this.state.objectives[index].assignButton === true){
          return (
            <Button disabled style={{background:"grey"}}><div  style={{color:'white', textTransform:'none'}}><b>Assigned</b></div></Button>
          )
        }

    }

    renderAssignObjectives(){
      if (this.state.open === true){
        //load select options

        // need to fix this.
        // map all objectives for runbook that match runbook
        // that way each objective has an assigned user

        // this should be showing organizationactivity > runbookid === runbookid > objectives
        return (
          this.state.objectives.map((obj,index) => {
            return (
              <TableRow key={obj.index+obj.title}>
                  <TableCell component="th" scope="row">{obj.title}</TableCell>
                <TableCell>
                  {this.renderSelect(index,this.state.objectives[index].selectOption)}
                </TableCell>
                <TableCell padding="checkbox">{obj.department}</TableCell>
                <TableCell padding="checkbox">
                  <Button style={{background:this.props.theme[0].PrimaryLinear}} onClick={() => this.handleAssignObjective({obj},this.state.objectives[index].selectOption,this.state.objectives[index].selectEmail)}><div  style={{color:'white', textTransform:'none'}}><b>Assign</b></div></Button>
                  {/* {this.renderAssignButton(index,{obj},this.state.objectives[index].selectOption)}*/}
                </TableCell>
              </TableRow>
            )
          }
        )
      )
      }

    }

    renderDialog(){
      // if user not in organization, render modal asking to join team first
      // else show runbook launch dialog
    }

    renderAssingAllObjectives(){
      if (1 === 0){
        return(
          <Button style={{background:this.props.theme[0].PrimaryLinear, marginRight:20}}><div  style={{color:'white', textTransform:'none'}}><b>Assign All Objectives</b></div></Button>
        )
      } else if (2 === 2){
        return (
          <Button disabled style={{background:"grey", marginRight:20}}><div  style={{color:'white', textTransform:'none'}}><b>Assign All Objectives</b></div></Button>
        )
      }
    }

    renderPostTags(){
      if (this.state.postTags !== undefined){
        return (
          this.state.postTags.map((value) => {
            if (value !== " "){
              return(
                <Grid key={value+Math.random()+(Math.random())} item >
                  <span style={{background:this.props.theme[0].PostsTagsBackground,height:20, borderRadius:16,textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold', paddingLeft:10, paddingRight:10, marginRight:5}}>
                    <div style={{color:'white',  letterSpacing:'-0.5px', fontSize:'12px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}><b>{value}</b></div>
                  </span>
              </Grid>)
            }
          }
          )
        )

      }

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
                        background: this.renderTheme(),
                        minHeight:this.state.height,
                        paddingTop:5,
                    }}
                >
                <Grid container style={{ background:this.props.theme[0].PostsButtonBackground ,border:this.props.theme[0].PostsButtonBorder,  margin:"0 auto", maxWidth:"63em", padding:15, borderRadius:'5px 5px 5px 5px'}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                  <Grid item xs>
                    <div>
                      <Link style={{textDecoration: 'none' }} to={""}>
                        <b>creator</b>
                      </Link>
                      <b style={{color:this.props.theme[0].PostsTypographyTitle}}> / </b>
                      <Link style={{textDecoration: 'none' }}to={""}>
                      <b>{this.state.postTitle}</b>
                      </Link>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <div  style={{color:this.props.theme[0].PostsTypographyDescription}}>{this.state.postDescription}</div>
                  </Grid>
                    <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"flex-start"} direction={"row"} justify={"flex-start"}>
                    {this.renderPostTags()}
                  </Grid>
                  {this.props.users.logged
                    ?
                    <Grid container style={{ flexGrow:1, height:"100%", width:"100%" }}  alignItems={"flex-start"} direction={"row"} justify={"flex-end"}>
                    <Grid item  style={{paddingTop:5}}>
                    <div>
                      <Link style={{textDecoration: 'none' }} to={{ pathname: '/post/' + this.props.posts.id + '/'+this.findAndReplace(this.findAndReplace(this.state.postTitle,' ','-'),'\'','')+'/edit'}}>
                       <Button style={{background:this.props.theme[0].SecondaryLinear}}>
                         <div  style={{color:'white',textTransform:'none'}}><b>Edit</b></div>
                       </Button>
                     </Link>
                     <Button style={{background:this.props.theme[0].PrimaryLinear, marginLeft:20}} onClick={() => this.renderModal()}><div  style={{color:'white',textTransform:'none'}}><b>Run</b></div></Button>
                       <Dialog
                         fullScreen
                         open={this.state.open}
                         onClose={this.handleClose}
                         TransitionComponent={Transition}
                         style={{maxWidth:'63em',flexGrow:1, margin:"0 auto"}}
                       >

                       <div style={{padding:30}}>
                         <Grid container alignItems={'flex-start'} justify={'space-between'} direction={'row'} >
                           <Grid item>
                             <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Assign objectives to the appropriate users</b></div>
                           </Grid>
                           <Grid item>
                             {this.renderAssingAllObjectives()}
                             <Button style={{background:this.props.theme[0].SecondaryLinear}}><div  style={{color:'white', textTransform:'none'}} onClick={() => this.renderModal()}><b>Close</b></div></Button>
                           </Grid>
                         </Grid>

                         <Table className={classes.table}>
                           <TableHead>
                             <TableRow>
                               <TableCell component="th" scope="row"><div style={{color:'black'}}><b>Objective</b></div></TableCell>
                               <TableCell><div style={{color:'black'}}><b>Assigned this User</b></div></TableCell>
                               <TableCell padding="checkbox"><div style={{color:'black'}}><b>Dept.</b></div></TableCell>
                               <TableCell padding="checkbox"><div style={{color:'black'}}><b>Action</b></div></TableCell>
                             </TableRow>
                           </TableHead>
                           <TableBody>
                              {this.renderAssignObjectives()}
                              <TableRow>
                              </TableRow>
                           </TableBody>
                         </Table>
                       </div>


                       </Dialog>
                      </div>
                    </Grid>
                  </Grid>
                    :
                    <div></div>
                  }
                </Grid>


                        <Grid container style={{background:this.props.theme[0].PostsButtonBackground ,border:this.props.theme[0].PostsButtonBorder,  margin:"0 auto",  marginTop:5,maxWidth:"63em", padding:15, borderRadius:'5px 5px 5px 5px'}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                          <Grid item xs style={{}}>
                            <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>{this.state.objectives.length}</b> objectives</div>
                            <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>0</b> comments</div>
                          </Grid>
                          <Grid item  style={{marginLeft:10}}>
                            <InputGroup size="sm">
                              {/*<InputGroupAddon addonType="prepend" style={{marginLeft:5}}>
                                <Button style={{background:this.props.theme[0].PostActionBackgroundImage,borderRadius:'5px 0px 0px 5px', boxShadow:'0px 0px 0px 0px',  border:this.props.theme[0].PrimaryBorder, }}><div  style={{textTransform:'none', color:"#333333"}}><span aria-label="emoji" role="img">👁️</span><b>Watch</b></div></Button>
                                <Button disabled style={{background:"white",borderRadius:'0px 5px 5px 0px', boxShadow:'0px 0px 0px 0px',  borderRight:this.props.theme[0].PrimaryBorder,  borderTop:this.props.theme[0].PrimaryBorder, borderBottom:this.props.theme[0].PrimaryBorder}}><div  style={{color:"#525f7f"}}><b>0</b></div></Button>
                              </InputGroupAddon>
                              <InputGroupAddon addonType="prepend" style={{marginLeft:5}}>
                                <Button style={{background:this.props.theme[0].PostActionBackgroundImage,borderRadius:'5px 0px 0px 5px', boxShadow:'0px 0px 0px 0px',  border:this.props.theme[0].PrimaryBorder, }}><div  style={{textTransform:'none', color:"#333333"}}><span aria-label="emoji" role="img">😘️</span><b>Copy</b></div></Button>
                                <Button disabled style={{background:"white",borderRadius:'0px 5px 5px 0px', boxShadow:'0px 0px 0px 0px',  borderRight:this.props.theme[0].PrimaryBorder,  borderTop:this.props.theme[0].PrimaryBorder, borderBottom:this.props.theme[0].PrimaryBorder}}><div  style={{color:"#525f7f"}}><b>0</b></div></Button>
                              </InputGroupAddon>*/}
                              <InputGroupAddon addonType="prepend" style={{marginLeft:5}}>
                                <Button style={{background:this.props.theme[0].PostActionBackgroundImage,borderRadius:'5px 0px 0px 5px', boxShadow:'0px 0px 0px 0px',  border:this.props.theme[0].PrimaryBorder, }}><div  style={{textTransform:'none' , color:"#333333"}}><span aria-label="emoji" role="img">⭐</span><b>Stars</b></div></Button>
                                <Button disabled style={{background:"white",borderRadius:'0px 5px 5px 0px', boxShadow:'0px 0px 0px 0px',  borderRight:this.props.theme[0].PrimaryBorder,  borderTop:this.props.theme[0].PrimaryBorder, borderBottom:this.props.theme[0].PrimaryBorder}}><div  style={{color:"#525f7f"}}><b>0</b></div></Button>
                              </InputGroupAddon>

                            </InputGroup>
                          </Grid>
                        </Grid>
                    {/* Bottom Section */}
                    <Grid container style={{ flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em", paddingBottom:100 }}  alignItems={'flex-start'} justify={'flex-start'} direction={'row'}  >
                      {this.renderObjectives()}
                    </Grid>
                </div>
            </div>
        )
    }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps({ posts,users,theme, organization,account, activity}) {
    return { posts,users,theme,organization,account, activity };
}
export default connect(mapStateToProps, {
  getPost,
  addActivity,
  addActivityToOrganization,
  loadOrganizationAll,
})(withRouter(withStyles(styles)(Post)));
