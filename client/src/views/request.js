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
// import { AlgoliaRequestsHits } from '../components/algolia/config';
import { InstantSearch } from 'react-instantsearch-dom';
import Truncate from 'react-truncate';
import Hidden from '@material-ui/core/Hidden';

const keys = require('../secrets/keys');
// const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Request extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            requestDescription:'',
            requestDescriptionLength:0,
            tagsValid:false,
            tags:'',
            runbookRequested:false,
            requests:[],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {

      // if (this.props.users === undefined){
      //   this.props.history.push("/")
      // } else {
      //     // console.log("User ")
      // }
      this.props.getRequests().then(()=> {
        if (this.props.requests.length > 0){
          var prevRequests = this.state.requests
          this.props.requests.map((req) => {
            prevRequests.push({
              description: req.description,
              tags: req.tags,
            })
            return null
          })
          this.setState({
            requests:prevRequests
          })
          console.log("This state requests:",this.state.requests)
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

    handleRequestDescription = requestDescription => event => {

        if (event.target.value.length < 149 || this.state.requestDescription.length < 149) {
          this.setState({
              [requestDescription]: event.target.value,
              requestDescriptionLength: event.target.value.length,
          });
          console.log(this.state.requestDescription.length)
        } else {
          this.setState({
              [requestDescription]: this.state.requestDescription,
              requestDescriptionLength: event.target.value.length,
          });
          console.log(this.state.requestDescription.length)
        }
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

            // this.props.editRequestTags(myArray)

            console.log("Tags are valid!")
        } else {
            console.log("Still invalid...")
            this.setState({tagsValid:false})
        }
    }

    submitRequest(description,tags){
      console.log("submitRequest:",description,tags)
      if(this.state.tagsValid === true){
        this.props.addRequest(description,tags);
        var prevRequests = this.state.requests
        prevRequests.push({
          description:description,
          tags:tags,
        })
        this.setState({
          requests:prevRequests,
          runbookRequested: true,
        })
      }
    }

    renderRequestButton(){
      if (this.state.tagsValid === true && this.state.requestDescription !== ''){
        return (
          <Button style={{color:'white', background:actionButton, textTransform:'none'}} onClick={() => this.submitRequest(this.state.requestDescription,this.state.tags)}><div  style={{color:'white'}}><b>Request</b></div></Button>
        )
      } else if (this.state.tagsValid === false ||  this.state.requestDescription === ''){
        return(
          <Button disabled style={{ background:'grey', textTransform:'none'}} ><div  style={{color:'white'}}><b>Request</b></div></Button>
        )
      }
    }

    renderRequests(){
      if ( this.state.requests.length > 0 ){
      return (this.state.requests.map((hit,index) => {
          return (
          <Grid item xs={12} key={index+Math.random()+(Math.random())} style={{ marginBottom:5, maxWidth:'100%', marginLeft:10, marginRight:10}}>
              <Button variant="contained" style={{ height:100, border: this.props.theme[0].PostsButtonBorder, background:this.props.theme[0].PostsButtonBackground, textTransform: 'none',  minWidth:'100%'}}>
                {/*}<Button variant="contained" style={{ height:100,background:'linear-gradient(#5533ff, #3d63ff)',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>*/}
                  <Grid container style={{flexGrow:1, marginLeft:10}}>
                      <Grid item xs={10} style={{textAlign:'left'}}>
                          <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                              <Grid item zeroMinWidth>
                                  <div variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                    <Hidden mdDown>
                                    <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                                       {hit.description}
                                   </Truncate>
                                   </Hidden>
                                 </div>
                               <div variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                 <Hidden smUp>
                                 <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                    {hit.description}
                                </Truncate>
                              </Hidden>
                                  </div>
                              </Grid>
                          </Grid>
                      </Grid>
                  </Grid>
              </Button>
          </Grid>
        )
      }))
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
                              <div style={{color:this.props.theme[0].PostsTypographyTitle}} ><b>Request a Runbook</b></div>
                            </Grid>
                            <Grid item>

                              <div style={{color:this.props.theme[0].PostsTypographyDescription}} ><b>{this.state.requestDescriptionLength}/150</b></div>
                            </Grid>
                          </Grid>

                        <Input style={{width:'100%', height:70}} type="textarea" placeholder={'Describe your current problem.'} value={this.state.requestDescription} onChange={this.handleRequestDescription('requestDescription')}/>
                          <FormGroup>
                              <div variant="button" style={{color:this.props.theme[0].PostsTypographyDescription, textTransform:'none'}}><b>Runbook Tags</b></div>
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
                      <Grid item xs style={{borderColor:'#474f97', textTransform: 'none', width:'100%'}}>
                          <Grid container style={{flexGrow:1, margin:"0 auto", width:'100%'}} >
                              {/*<AlgoliaPostsHits style={{ width:'100%'}}/>*/}
                              {this.renderRequests()}
                          </Grid>
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}

                </div>
            </div>
          </InstantSearch>
        );
    }
}


function mapStateToProps({ requests,theme }) {
    return { requests,theme };
}
export default connect(mapStateToProps, {
  addRequest,
  editRequestTags,
  getRequests,
})(withRouter(Request));
