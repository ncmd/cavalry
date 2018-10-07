import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addRequest,
  editRequestTags,
  getRequests,
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form, FormGroup, Input,Alert  } from 'reactstrap';
import { AlgoliaRequestsHits } from '../components/algolia/config';
import { InstantSearch } from 'react-instantsearch-dom';
import Truncate from 'react-truncate';
import Hidden from '@material-ui/core/Hidden';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';

const keys = require('../secrets/keys');
const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";


class Activity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            visible: true,

        };
        this.onDismiss = this.onDismiss.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    onDismiss() {
      this.setState({ visible: false });
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



    render() {
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
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em", marginBottom:5}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                            <Grid item style={{width:'100%'}}>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'display1'}><b>Your Activity</b></Typography>
                            </Grid>
                          </Grid>
                        </Form>
                      </Grid>
                    </Grid>
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                            <Grid item style={{width:'100%'}}>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>Runbook name: </b>runbooktitle</Typography>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>Assigned by: </b>emailaddress</Typography>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>Objectives assigned to you:</b></Typography>
                              <div style={{flexGrow:1}}>
                                <ExpansionPanel >
                                  <ExpansionPanelSummary style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}} expandIcon={<ExpandMoreIcon style={{color:this.props.theme[0].PostsTypographyTitle}}/>}>
                                    <CircularProgress style={{width:22,height:22,marginRight:20}} /><Typography style={{color:this.props.theme[0].PostsTypographyDescription}}><b>Objective Title</b></Typography>
                                  </ExpansionPanelSummary>

                                  <ExpansionPanelDetails style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                                    <Typography style={{color:this.props.theme[0].PostsTypographyDescription}}>
                                      Objective Description
                                    </Typography>

                                  </ExpansionPanelDetails>

                                  <ExpansionPanelActions style={{background:this.props.theme[0].PostsButtonBackground, border:this.props.theme[0].PostsButtonBorder}}>
                                    <Typography>Add Comment</Typography>
                                    <Input placeholder=""></Input> <Typography>0/45</Typography>
                                    <Button style={{background:this.props.theme[0].PrimaryLinear, border:this.props.theme[0].PostsButtonBorder}}><Typography style={{color:'white',textTransform:'none'}} variant={'caption'}><b>Complete</b></Typography></Button>
                                  </ExpansionPanelActions>
                                </ExpansionPanel>
                              </div>
                            </Grid>
                          </Grid>
                        </Form>
                      </Grid>
                    </Grid>
                </div>
            </div>
          </InstantSearch>
        );
    }
}


function mapStateToProps({ activity,requests,theme }) {
    return { activity,requests,theme };
}
export default connect(mapStateToProps, {
  addRequest,
  editRequestTags,
  getRequests,
})(withRouter(Activity));
