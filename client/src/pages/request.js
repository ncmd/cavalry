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

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const actionButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Request extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
            requestTitle:'',
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

    handleRequestTitle = requestTitle => event => {
        this.setState({
            [requestTitle]: event.target.value,
        });
    };

    // renderTags(){
    //   return this.state.tags.map((t,index) => {
    //     return (
    //       <Grid key={(Math.random()+Math.random())+index} style={{minWidth:'100%'}}>
    //         <FormGroup>
    //             <Typography variant="button" style={{color:'white'}}>Objective {index+1}</Typography>
    //             <Input placeholder={t.title}  onChange={this.handlePostTitle('postTitle')}/>
    //         </FormGroup>
    //         <FormGroup>
    //             <Typography variant="button" style={{color:'white'}}>Objective {index+1} Description</Typography>
    //             <Input type="textarea" style={{height:200}} placeholder={t.description} onChange={this.handlePostDescription('postDescription')}/>
    //         </FormGroup>
    //       </Grid>
    //     );
    //   });
    // }
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
        this.props.addRequest(description,tags);
        this.setState({
          runbookRequested: true
        }, () => {
          this.props.history.push('/request')
        })
    }

    render() {
        return (
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
                        <Input style={{width:'100%', height:200}} type="textarea" placeholder={'Describe your current problem.'}  onChange={this.handleRequestTitle('requestTitle')}/>
                          <FormGroup>
                              <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Runbook Tags</b></Typography>
                                {this.state.tagsValid
                                ?
                                <Input valid placeholder={"Separate each tag with ',' (comma"} value={this.state.tags} onChange={this.handleRequestTags('tags')}/>
                                :
                                <Input invalid placeholder={"Separate each tag with ',' (comma)"} value={this.state.tags} onChange={this.handleRequestTags('tags')}/>
                                }
                          </FormGroup>
                        <Button style={{color:'white', background:actionButton, textTransform:'none'}} variant={'caption'}><b>Request</b></Button>
                        </Form>
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      <Grid item>
                        Existing Requests
                      </Grid>
                    </Grid>
                </div>
            </div>
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
