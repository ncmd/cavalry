import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
    getPost
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
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    handleClose = () => {
      this.setState({ open: false });
    };

    renderSelect(index,valueAssignedMember){
      if(this.state.selectValueOptions.length > 0){
        return(
          <Select
            name="organizationmemeber"
            options={this.state.selectValueOptions}
            className="basic-single"
            isClearable={false}
            classNamePrefix="select"
            value={valueAssignedMember}
            onChange={this.handleChangeSelect(index,'selectValue')}
          />
        )
      }
      // if task was assigned, disable / or just be to reassign task
    }

    handleChangeSelect = (index,selectValue) => (event) => {
      // const groups = this.state.groups;
      // groups[index].department = event.value
      // this.forceUpdate();
      // this.props.changeOrgMemberDepartment(this.props.account.organizationname,index,event.value)
      // console.log("Selected:",event.value)

   }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {

      // Load select options if user is logged in
      if (this.props.users.logged === true){
        var prevSelectOptions = this.state.selectValueOptions
        this.props.organization.organizationmembers.map((member)=>{
          // console.log(member)
          // add each member to selectValueOptions
          prevSelectOptions.push({
            value: member.emailaddress,
            label: member.emailaddress,
          })

        })
        this.setState({
          selectValueOptions: prevSelectOptions
        })
      }


        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        // console.log(this.props.location);
        this.props.getPost('/api'+this.props.location.pathname).then(() => {

              this.setState({
                postTitle:this.props.posts.title,
                postDescription:this.props.posts.description,
              })

              if(this.props.posts.objectives.length > 0) {
                let prevObjectives = this.state.objectives;
                // console.log("Post Props Objectives:",this.props.posts.objectives)
                this.props.posts.objectives.map( r => {
                  prevObjectives.push({
                    title: r.title,
                    description: r.description,
                    department: r.department,
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

                  <Typography variant={'body2'} style={{color:this.props.theme[0].PostsTypographyTitle}}>
                    <Typography variant={'body2'} style={{background:this.props.theme[0].PrimaryLinear, width:26,height:26, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>{index+1}</Typography> <b>{obj.title}</b>
                  </Typography>
                  <Grid container spacing={8} alignItems="center" direction="row" justify="space-between" >
                    <Grid key={obj.department+Math.random()+(Math.random())} item >
                      <span style={{background:'#7795f8',height:20, borderRadius:16,textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold', paddingLeft:10, paddingRight:10, marginRight:5}}>
                        <Typography variant={'caption'} style={{color:'white'}}><font size="1"><b>{obj.department}</b></font></Typography>
                      </span>
                  </Grid>
                  </Grid>
                  <div style={{color:this.props.theme[0].PostsTypographyDescription}} dangerouslySetInnerHTML={{__html: obj.description}} />
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

    renderAssignObjectives(){
      if (this.state.open === true){
        //load select options

        return (
          this.props.posts.objectives.map((obj,index) => {
            return (
              <TableRow key={obj.index+obj.title}>
                  <TableCell component="th" scope="row">{obj.title}</TableCell>

                <TableCell>
                  {this.renderSelect(index,{value:"test@gmail.com",label:"test@gmail.com"})}
                </TableCell>
                <TableCell padding="checkbox">{obj.department}</TableCell>
                <TableCell padding="checkbox">
                   <Button style={{background:this.props.theme[0].PrimaryLinear}}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}}><b>Assign</b></Typography></Button>
                </TableCell>
              </TableRow>
            )
          }
        )
      )
      }

    }

    renderLaunch(){
      if (1 === 1){
        return(
          <Button style={{background:this.props.theme[0].PrimaryLinear, marginRight:20}}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}}><b>Launch</b></Typography></Button>
        )
      } else if (2 === 2){
        return (
          <Button disabled style={{background:"grey", marginRight:20}}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}}><b>Launch</b></Typography></Button>
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
                        minHeight:this.state.height
                    }}
                >
                    <Grid container style={{ background:this.props.theme[0].PostsButtonBackground ,border:this.props.theme[0].PostsButtonBorder,  margin:"0 auto", maxWidth:"63em", padding:25, borderRadius:'5px 5px 5px 5px'}} alignItems={'flex-start'} justify={'flex-start'} direction={'column'}>
                      <Grid item xs>
                        <Typography variant={'display1'} style={{color:this.props.theme[0].PostsTypographyTitle}}><b>{this.state.postTitle}</b></Typography><br/>
                      </Grid>
                      <Grid item xs>
                        <Typography variant={'subheading'} style={{color:this.props.theme[0].PostsTypographyDescription}}>{this.state.postDescription}</Typography>
                      </Grid>
                      <Grid item xs style={{paddingTop:20}}>
                        {this.props.users.logged
                          ?
                          <div>
                            <Link to={{ pathname: '/post/' + this.props.posts.id + '/'+this.findAndReplace(this.findAndReplace(this.state.postTitle,' ','-'),'\'','')+'/edit'}}>
                             <Button style={{background:this.props.theme[0].SecondaryLinear}}>
                               <Typography variant={'caption'} style={{color:'white'}}><b>Edit</b></Typography>
                             </Button>
                           </Link>
                           <Button style={{background:this.props.theme[0].PrimaryLinear, marginLeft:20}} onClick={() => this.renderModal()}><Typography variant={'caption'} style={{color:'white'}}><b>Run</b></Typography></Button>
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
                                   <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>Assign objectives to the appropriate users</b></Typography>
                                 </Grid>
                                 <Grid item>
                                   <Button style={{background:this.props.theme[0].PrimaryLinear, marginRight:20}}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}}><b>Launch</b></Typography></Button>
                                   <Button style={{background:this.props.theme[0].SecondaryLinear}}><Typography variant={'caption'} style={{color:'white', textTransform:'none'}} onClick={() => this.renderModal()}><b>Close</b></Typography></Button>
                                 </Grid>
                               </Grid>

                               <Table className={classes.table}>
                                 <TableHead>
                                   <TableRow>
                                     <TableCell component="th" scope="row"><Typography style={{color:'black'}}><b>Objective</b></Typography></TableCell>
                                     <TableCell><Typography style={{color:'black'}}><b>Assigned to</b></Typography></TableCell>
                                     <TableCell padding="checkbox"><Typography style={{color:'black'}}><b>Department</b></Typography></TableCell>
                                     <TableCell padding="checkbox"><Typography style={{color:'black'}}><b>Action</b></Typography></TableCell>
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
                          :
                          <div></div>
                        }
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


function mapStateToProps({ posts,users,theme, organization}) {
    return { posts,users,theme,organization };
}
export default connect(mapStateToProps, {
  getPost,
})(withRouter(withStyles(styles)(Post)));
