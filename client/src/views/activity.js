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
import { Form, FormGroup, Input } from 'reactstrap';
import { AlgoliaRequestsHits } from '../components/algolia/config';
import { InstantSearch } from 'react-instantsearch-dom';
import Truncate from 'react-truncate';
import Hidden from '@material-ui/core/Hidden';
import Checkbox from '@material-ui/core/Checkbox';

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
                    <Grid container style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder, flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                            <Grid container style={{background:'transparent', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                            <Grid item>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>Your Activity</b></Typography>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>runbook name: runbooktitle </b></Typography>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>assigned by: emailaddress</b></Typography>
                              <Typography style={{color:this.props.theme[0].PostsTypographyTitle}} variant={'body2'}><b>objectives1:</b></Typography>
                                <Checkbox disabled value="checkedD" /> Do some task<br/>
                                <Checkbox disabled checked value="checkedE" /> Do another task
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
