import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addRequest,
  editRequestTags,
  getRequests,
  loadOrganizationAll,
  completeOrganizationActivity
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Form, Input  } from 'reactstrap';
import { InstantSearch } from 'react-instantsearch-dom';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import CompleteIcon from '@material-ui/icons/CheckCircle';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Hidden from '@material-ui/core/Hidden';
import {Link} from "react-router-dom";
import Truncate from 'react-truncate';
import { googleanalytics } from '../components/analytics';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const keys = require('../secrets/keys');
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {

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
class Activity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            visible: true,
            activity:[],
            activityorganization: [],
            commentInput:'',
            fade:true,
            tabValue:0,

        };
        this.onDismiss = this.onDismiss.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    onDismiss() {
      this.setState({ visible: false });
    }


    // Controls Onload Windows Height Dimensions
    componentDidMount() {
      // loading assigned user activity objectives
      // if(this.props.activity.length > 0){
      //   var prevActivity = this.state.activity
      //   this.props.activity.map((act,index)=> {
      //     prevActivity.push({act})
      //   })
      //   this.setState({
      //     activity:prevActivity
      //   })
      //   console.log("All Activity:",this.state.activity)
      // }

      // load organization activity to props

        this.props.loadOrganizationAll(this.props.account.organizationname).then(() => {
          // Loading organization activity objectives
          if (this.props.organization.organizationactivity.length > 0 && this.props.organization.organizationactivity.length !== undefined ){
            var prevAccountActivity = this.state.activity
            var prevActivityOrganization = this.state.activityorganization
            this.props.organization.organizationactivity.map((act, index) => {
              prevActivityOrganization.push({act})
              if (this.props.account.accountid === act.runbookobjectives.objectiveassignedto.accountid){
                prevAccountActivity.push({act})
              }
              return null
            })
            this.setState({
              organizationactivity:prevActivityOrganization,
              activity:prevAccountActivity
            })
            console.log("Organization Activity:", this.state.activityorganization)
          }

        })




        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleCommentInput = commentInput => event => {
        this.setState({
            [commentInput]: event.target.value,
        });
    };

    handleClickCompleteObjective(index){
      var prevActivity = this.state.activity
      prevActivity[index].act.runbookobjectives.objectivestatus = 'complete'
      console.log("Handleclick",prevActivity[index])

      var data = {
          runbookid: prevActivity[index].act.runbookid,
          runbooktitle:  prevActivity[index].act.runbooktitle,
          runbookdescription: prevActivity[index].act.runbookdescription,
          runbooktags:prevActivity[index].act.runbooktags,
          runbookobjectives: {
            objectivetitle: prevActivity[index].act.runbookobjectives.objectivetitle,
            objectivedescription: prevActivity[index].act.runbookobjectives.objectivedescription,
            objectivestatus: 'complete',
            objectiveassignedto: prevActivity[index].act.runbookobjectives.objectiveassignedto,
          },
      }

      this.props.completeOrganizationActivity(this.props.account.organizationname,data)

      this.setState({
        activity: prevActivity,
      }, () => {

        setTimeout(() => {
          delete prevActivity[index]
          this.setState({
            fade: false,
            activity: prevActivity,
          })
        }, 900);
      })
    }

    renderCommentCompleteButton(activityindex){
      if (this.state.commentInput !== ''){
        return(
            <Button style={{background:this.props.theme[0].PrimaryLinear, border:this.props.theme[0].PostsButtonBorder}} onClick={()=>this.handleClickCompleteObjective(activityindex)}><div style={{color:'white',textTransform:'none'}} ><b>Complete</b></div></Button>
        )
      } else if ( this.state.commentInput === '' ){
        return (
          <Button disabled style={{background:"grey", border:this.props.theme[0].PostsButtonBorder}}><div style={{color:'white',textTransform:'none'}} ><b>Complete</b></div></Button>
        )
      }
    }

    renderProgressStatus(objectivestatus){
      if (objectivestatus === 'assigned'){
        return (
          <CircularProgress style={{width:22,height:22}} />

        )
      } else if ( objectivestatus === 'complete'){
        return (
            <CompleteIcon style={{width:22,height:22, color:'#3d5afe'}}/>
        )
      }
    }


    renderActivityObjectives(obj,ind){
        return (

            <div style={{flexGrow:1}}>
              <ExpansionPanel >
                <ExpansionPanelSummary style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}} expandIcon={<ExpandMoreIcon style={{color:this.props.theme[0].PostsTypographyTitle}}/>}>
                  {this.renderProgressStatus(obj.objectivestatus)}<div style={{color:this.props.theme[0].PostsTypographyDescription, marginLeft:20}}><b>{obj.objectivetitle}</b></div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                    <div style={{color:this.props.theme[0].PostsTypographyTitle}}  dangerouslySetInnerHTML={{__html: obj.objectivedescription}} />
                </ExpansionPanelDetails>
                <ExpansionPanelActions style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                  <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>Add Comment</b></div>
                  <Input placeholder="" onChange={this.handleCommentInput('commentInput')}></Input> <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>{this.state.commentInput.length}/60</b></div>
                  {this.renderCommentCompleteButton(ind)}
                </ExpansionPanelActions>
              </ExpansionPanel>
            </div>

        )
    }

    renderOrganizationActivityObjectives(runbookid){
      return (
        this.state.activityorganization.map((act,index) => {
          if (act.act.runbookid === runbookid){
            console.log("Act:",act.act.runbookobjectives.objectivetitle)
            return (
              <div style={{flexGrow:1, marginBottom:5}} key={act.act.runbookobjectives.objectivetitle+index}>
                <ExpansionPanel >
                  <ExpansionPanelSummary style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}} expandIcon={<ExpandMoreIcon style={{color:this.props.theme[0].PostsTypographyTitle}}/>}>
                    <CircularProgress style={{width:22,height:22,marginRight:20}} /><div style={{color:this.props.theme[0].PostsTypographyDescription}}><b>{act.act.runbookobjectives.objectivetitle}</b></div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                      <div style={{color:this.props.theme[0].PostsTypographyTitle}}  dangerouslySetInnerHTML={{__html: act.act.runbookobjectives.objectivedescription}} />
                  </ExpansionPanelDetails>
                  <ExpansionPanelActions style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                    <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>Add Comment</b></div>
                    <Input placeholder="I completed the objective!" onChange={this.handleCommentInput('commentInput')}></Input> <div  style={{color:this.props.theme[0].PostsTypographyDescription}}><b>{this.state.commentInput.length}/60</b></div>
                    {this.renderCommentCompleteButton(index)}
                  </ExpansionPanelActions>
                </ExpansionPanel>
              </div>
            )
          }
          return null
        })
      )
    }

    renderAssignedActivity(){
      if (this.state.tabValue === 0 ){
        return (
          this.state.activity.map((act,index)=> {
            if (act.act.runbookobjectives.objectivestatus === 'assigned'){
              return (
                <Grid item key={act.act.runbooktitle+index} style={{padding:10, width:'100%'}} xs={12}>
                  <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                      <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                      <Grid item style={{width:'100%'}}>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Runbook name: </b>{act.act.runbooktitle}</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Objectives assigned to you:</b></div>
                        {this.renderActivityObjectives(act.act.runbookobjectives,index)}
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              )
            }
            return null
          })
        )
      } else if (this.state.tabValue === 1){
        return (
          this.state.activity.map((act,index)=> {
            console.log("Act & Index:",act.act,index)
            if (act.act.runbookobjectives.objectivestatus === 'complete'){
              return (
                <Grid item key={act.act.runbooktitle+index} style={{padding:10, width:'100%'}} xs={12}>
                  <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                      <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                      <Grid item style={{width:'100%'}}>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Runbook name: </b>{act.act.runbooktitle}</div>
                        <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Objectives assigned to you:</b></div>
                        {this.renderActivityObjectives(act.act.runbookobjectives,index)}
                      </Grid>
                    </Grid>
                  </Form>
                </Grid>
              )
            }
            return null
          })
        )
      }

    }

      findAndReplace = (string, target, replacement) => {
       var i = 0, length = string.length;
       for (i; i < length; i++) {
        string = string.replace(target, replacement);
       }
       return string;
      }

    renderOrganizationActivity(organizationname){
      const { classes } = this.props;

      return (
        this.state.activityorganization.map((act,index) => {
          // console.log(act,index)
            return (
              <Grid item xs={12} key={act.act.runbooktitle+Math.random()+(Math.random())}  style={{padding:10, width:'100%',marginLeft:'auto',marginRight:'auto'}}>
                <ExpansionPanel >
                    <ExpansionPanelSummary style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}} expandIcon={<ExpandMoreIcon style={{color:this.props.theme[0].PostsTypographyTitle}}/>}>

                    {/*}<Button variant="contained" style={{ height:100,background:'linear-gradient(#5533ff, #3d63ff)',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>*/}
                      <Grid container style={{flexGrow:1, marginLeft:10}}>
                          <Grid item xs={10} style={{textAlign:'left'}}>
                              <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                  <Grid item zeroMinWidth>
                                      <div variant="body1" style={{color:this.props.theme[0].PostsTypographyTitle, minWidth:0, flexGrow:1, overflowX:'hidden', fontWeight:'bold'}}>
                                        <Hidden mdDown>
                                        <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                                          {act.act.runbooktitle}
                                       </Truncate>
                                     </Hidden>
                                      </div>
                                      <Link to={{ pathname: '/post/' + act.act.runbookid + '/'+this.findAndReplace(this.findAndReplace(this.findAndReplace(this.findAndReplace(act.act.runbooktitle,' ','-'),'\'',''),'/','-'),'\\','-').toLowerCase()}} onClick={() => googleanalytics.Cavalry_Webapp_Landing_Runbook_Userclickedonrunbook(act.act.runbooktitle)}>
                                        <div  style={{color:this.props.theme[0].PostsTypographyDescription}}>View Runbook</div>
                                      </Link>
                                      <div variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                        <Hidden mdDown>
                                        <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                                           {act.act.runbookdescription}
                                       </Truncate>
                                       </Hidden>
                                     </div>

                                    <div variant="body2" style={{color:this.props.theme[0].PostsTypographyTitle, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                     <Hidden smUp>
                                     <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                        {act.act.runbooktitle}
                                    </Truncate>
                                  </Hidden>
                                   </div>
                                   <div variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                     <Hidden smUp>
                                     <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                        {act.act.runbookdescription}
                                    </Truncate>
                                  </Hidden>
                                      </div>
                                  </Grid>
                                  <Grid item style={{marginRight:5}}>
                                    <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                                      {act.act.runbooktags.slice(0, 3).map((value) => {
                                        if (value !== " "){
                                          return(
                                            <Grid key={value+Math.random()+(Math.random())} item >
                                              <span style={{background:this.props.theme[0].PostsTagsBackground,height:20, borderRadius:16,textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold', paddingLeft:10, paddingRight:10, marginRight:5}}>
                                                <div style={{color:'white',  letterSpacing:'-0.5px', fontSize:'12px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}><b>{value}</b></div>
                                              </span>
                                          </Grid>)
                                        }
                                        return null
                                      }
                                      )}
                                    </Grid>
                                  </Grid>
                              </Grid>
                          </Grid>
                      </Grid>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" scope="row"><div style={{color:'black'}}><b>Objective</b></div></TableCell>
                        <TableCell><div style={{color:'black'}}><b>Assigned User</b></div></TableCell>
                        <TableCell padding="checkbox"><div style={{color:'black'}}><b>Status</b></div></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                       <TableRow>
                       </TableRow>
                    </TableBody>
                  </Table>
                </ExpansionPanelDetails>
              </ExpansionPanel >
              </Grid>
            )

        })
      )
    }

    renderOrganizationRunbookObjectiveStatus(runbookname,index){
      // const { classes } = this.props;

        if (this.state.open === true){

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

    handleChangeTab = (event, tabValue) => {
      this.setState({ tabValue });
    };


    render() {
        const { classes } = this.props;
        return (
          <InstantSearch
            appId="43JRRJRQRC"
            apiKey={keys.algolia_api_key}
            indexName="requests"
        >
            <div>
                <Header/>
                <div
                    style={{
                        flexGrow: 1,
                        background: this.props.theme[0].MainBackground,
                        height: this.state.height,
                        marginTop:48,
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginBottom:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                            <Grid item xs>
                              <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Your Activity</b></div>
                                <Tabs
                                  classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                                  value={this.state.tabValue}
                                  onChange={this.handleChangeTab}
                                  fullWidth
                                >
                                  <Tab label="Assigned to me" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                                  <Tab label="Completed" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                                </Tabs>

                            </Grid>
                          </Grid>
                        </Form>
                      </Grid>
                    </Grid>
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginBottom:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      {this.renderAssignedActivity()}
                    </Grid>
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginBottom:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                            <Grid item style={{width:'100%'}}>
                              <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Your Organization's Activity</b></div>
                            </Grid>
                          </Grid>
                        </Form>
                      </Grid>
                    </Grid>
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginBottom:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                      {this.renderOrganizationActivity(this.props.account.organizationname)}
                    </Grid>
                    </Grid>
                </div>
            </div>
          </InstantSearch>
        );
    }
}

Activity.propTypes = {
  classes: PropTypes.object.isRequired,
};



function mapStateToProps({ account, activity,requests,theme,organization }) {
    return { account, activity,requests,theme,organization };
}
export default connect(mapStateToProps, {
  addRequest,
  editRequestTags,
  getRequests,
  loadOrganizationAll,
  completeOrganizationActivity
})(withRouter(withStyles(styles)(Activity)));
