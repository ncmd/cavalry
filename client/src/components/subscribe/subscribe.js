import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Form, FormGroup,Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addSubscriber
} from '../../redux/actions';
import { InputGroup, InputGroupText, InputGroupAddon,FormFeedback } from 'reactstrap';
import withWidth from "@material-ui/core/withWidth";

const subscribeButton = "linear-gradient(to right, #ff1744, #F44336 ";

class subscribe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email:'',
            validEmail:false,
            subButtonClicked:false,
        };
        this.handleEmail = this.handleEmail.bind(this);
    }

    handleEmail = email => event => {
        const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        this.setState({
            [email]: event.target.value,
        }, () => {
          if (emailRegex.test(email)) {
              console.log("Valid Email Address:",email);
          } else {
              // Invalid phone number
              console.log("Invalid Email Address:",email);
          }
          if (this.state.validEmail === false){
              // // console.log(event.target.value);
              this.validateEmail(this.state.email);
          }
          if (this.state.validEmail === true){
              // // console.log(event.target.value);
              this.validateEmail(this.state.email);
          }
        });
    };

    renderErrorEmail(){
        if (this.state.email !== '' && this.state.validEmail === false){
            return(
                <FormFeedback tooltip style={{marginLeft:51}}>Please enter a valid email address</FormFeedback>
            )
        }
    }

    validateEmail(email){
        const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (emailRegex.test(email)) {
            // // console.log("Valid Email Address:",email);
            this.setState({validEmail:true})
        } else {
            // Invalid phone number
            // // console.log("Invalid Email Address:",email);
            this.setState({validEmail:false})
        }
    }

    addSub(){
        this.props.addSubscriber(this.state.email)
        console.log("Added Subscriber!")
    }

    renderSubscribeButton(){
        if (this.state.validEmail === true && this.state.subButtonClicked === false){
          return (
              <Button onClick={() => this.addSub()} raised="true" variant="raised" style={{color:'white', textAlign:'center', border:'white',height:38, background:subscribeButton, textTransform: 'none', marginLeft:5}} >SUBSCRIBE</Button>
          )
        } else if (this.state.validEmail === false && this.state.subButtonClicked === false){
          return (
            <Button disabled style={{color:'white', textAlign:'center', border:'white',height:38, background:'grey', textTransform: 'none', marginLeft:5}} >SUBSCRIBE</Button>
          )
        }
        if (this.state.subButtonClicked === true ){
          return (
              <Button disabled style={{color:'white', textAlign:'center', border:'white',height:38, background:'grey', textTransform: 'none', marginLeft:5}} >Thank you!</Button>
          )
        }
    }

    render() {
        return (
            <div style={{marginBottom:20}}>
                <div
                    style={{
                        flexGrow: 1,
                        marginTop: 0,
                        justify: 'center',
                        height:70
                    }}
                >
                    <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", marginTop:20 }} >
                        <Grid item xs={12} style={{borderColor:'#474f97', textTransform: 'none', marginLeft:10, marginRight:10}}>
                            <Form>
                                <FormGroup>
                                    <Grid container style={{ flexGrow:1 }} spacing={0} direction={'row'} justify={'center'} alignItems={'center'} >
                                        <Grid style={{flexGrow:1, maxWidth:380}} item >
                                          <InputGroup >
                                              <InputGroupAddon addonType="prepend">
                                                  <InputGroupText style={{background:'white'}}><span aria-label="emoji" role="img">📮</span></InputGroupText>
                                              </InputGroupAddon>
                                              {this.state.validEmail
                                                  ?
                                                  <Input valid placeholder="Email Address" onChange={this.handleEmail('email')}/>
                                                  :
                                                  <Input invalid placeholder="Email Address" onChange={this.handleEmail('email')}/>
                                              }
                                              {this.renderErrorEmail()}
                                          </InputGroup>
                                        </Grid>
                                        <Grid item>
                                            {this.renderSubscribeButton()}
                                        </Grid>
                                    </Grid>
                                </FormGroup>
                            </Form>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ email }) {
    return { email };
}

export default connect(mapStateToProps,{addSubscriber})(withRouter(withWidth()(subscribe)));
