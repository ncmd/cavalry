import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  addRequest,
  editRequestTags
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form, FormGroup, Input } from 'reactstrap';
import { AlgoliaRequestsHits,AlgoliaConnectedCheckBoxRefinementList } from '../components/algolia/config';
import { InstantSearch } from 'react-instantsearch-dom';

const keys = require('../secrets/keys');
const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Request extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            requestDescription:'',
            tagsValid:false,
            tags:'',
            runbookRequested:false,
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

    handleRequestDescription = requestDescription => event => {
        this.setState({
            [requestDescription]: event.target.value,
        });
    };

    handleRequestTags = tags => event => {
        this.setState({
            [tags]: event.target.value,
        }, () => {
          console.log("Validating...")
          this.validateTags(this.state.tags)
        });
    };


    validateTags(tags){
        const tagRegex = /^.*[^,]$/
        console.log(tags)
        if (tagRegex.test(tags)) {
            // // console.log("Valid Email Address:",email);
            this.setState({tagsValid:true});
            var myArray = tags.split(',');
            this.setState({
              tags: myArray
            })

            this.props.editRequestTags(myArray)

            console.log("Tags are valid!")
        } else {
            console.log("Still invalid...")
            this.setState({tagsValid:false})
        }
    }

    submitRequest(description,tags){
      if(this.state.tagsValid === true){
        this.props.addRequest(description,tags);
        this.setState({
          runbookRequested: true
        }, () => {
          this.props.history.push('/request')
        })
      }
    }

    renderRequestButton(){
      if (this.state.tagsValid === true && this.state.requestDescription !== ''){
        return (
          <Button style={{color:'white', background:actionButton, textTransform:'none'}} onClick={() => this.submitRequest(this.state.requestDescription,this.state.tags)}><Typography variant={'caption'} style={{color:'white'}}><b>Request</b></Typography></Button>
        )
      } else if (this.state.tagsValid === false ||  this.state.requestDescription === ''){
        return(
          <Button disabled style={{ background:'grey', textTransform:'none'}} ><Typography variant={'caption'} style={{color:'white'}}><b>Request</b></Typography></Button>
        )
      }
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
                        background: bodyBlue,

                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                      <Grid item style={{padding:10, width:'100%'}} xs={12}>
                        <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                        <Typography style={{color:'white'}} variant={'body2'}><b>Request a Runbook</b></Typography>
                        <Input style={{width:'100%', height:200}} type="textarea" placeholder={'Describe your current problem.'}  onChange={this.handleRequestDescription('requestDescription')}/>
                          <FormGroup>
                              <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Runbook Tags</b></Typography>
                                {this.state.tagsValid
                                ?
                                <Input valid placeholder={"Separate each tag with ',' (comma"} value={this.state.tags} onChange={this.handleRequestTags('tags')}/>
                                :
                                <Input invalid placeholder={"Separate each tag with ',' (comma)"} value={this.state.tags} onChange={this.handleRequestTags('tags')}/>
                                }
                          </FormGroup>
                        {this.renderRequestButton()}
                        </Form>
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid container style={{flexGrow:1, margin:"0 auto", width:'100%'}} >
                          <AlgoliaRequestsHits style={{ width:'100%'}}/>
                      </Grid>
                    </Grid>
                </div>
            </div>
          </InstantSearch>
        );
    }
}


function mapStateToProps({ requests }) {
    return { requests };
}
export default connect(mapStateToProps, {
  addRequest,
  editRequestTags,
})(withRouter(Request));
