import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Form, FormGroup,Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addSubscriber
} from '../../redux/actions';
import { InputGroup, InputGroupText, InputGroupAddon,FormFeedback } from 'reactstrap';

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
        this.setState({
          subButtonClicked: true
        })
        console.log("Added Subscriber!")
    }

    renderSubscribeButton(){
        if (this.state.validEmail === true && this.state.subButtonClicked === false){
          return (
              <Button onClick={() => this.addSub()} raised="true" variant="raised" style={{color:'white', textAlign:'center', border:'white',height:42.5, background:subscribeButton, textTransform: 'none', marginLeft:5}} >Subscribe</Button>
          )
        } else if (this.state.validEmail === false && this.state.subButtonClicked === false){
          return (
            <Button  raised="true" disabled style={{color:'white', textAlign:'center', border:'white',height:42.5, background:'#121858', textTransform: 'none', marginLeft:5}} >Subscribe</Button>
          )
        }
        if (this.state.subButtonClicked === true ){
          return (
              <Button raised="true" disabled style={{color:'white', textAlign:'center', border:'white',height:42.5, background:'#121858', textTransform: 'none', marginLeft:5}} >Thank you!</Button>
          )
        }
    }


    render() {
        return (
            <div>
                <div
                    style={{
                        flexGrow: 1,
                        marginTop: 0,
                        justify: 'center',
                        height:70
                    }}
                >
                {this.state.subButtonClicked
                ?
                <Grid container style={{ flexGrow:1, marginLeft:'auto', marginRight:'auto', maxWidth:"63em" }}  direction={'row'} justify={'center'} alignItems={'flex-start'}  >
                    <Grid item style={{borderColor:'#474f97', marginTop:20, textTransform: 'none', marginLeft:10, marginRight:10}}>
                      <Typography variant={"headline"} style={{color:'white'}}><b>Thank you for Subscribing! <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🎉</span>️</b></Typography>
                      </Grid>
                    </Grid>
                :
                <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", marginTop:20 }} >
                    <Grid item xs={12} style={{borderColor:'#474f97', textTransform: 'none', marginLeft:10, marginRight:10}}>
                        <Form>
                            <FormGroup>
                                <Grid container style={{ flexGrow:1 }} spacing={0} direction={'row'} justify={'center'} alignItems={'center'} >
                                    <Grid item >
                                      <InputGroup >
                                          <InputGroupAddon addonType="prepend">
                                              <InputGroupText style={{background:'#283593', border:'0'}}><span aria-label="emoji" role="img">📧</span></InputGroupText>
                                          </InputGroupAddon>
                                          {this.state.validEmail
                                              ?
                                              <Input style={{background:'#283593', color:'white', borderRadius:'.25rem'}} valid placeholder="Enter email address" onChange={this.handleEmail('email')}/>
                                              :
                                              <Input style={{background:'#283593', color:'white', border:0, borderRadius:'.25rem'}} invalid placeholder="Enter email address" onChange={this.handleEmail('email')}/>
                                          }
                                          {this.renderErrorEmail()}
                                          {this.renderSubscribeButton()}
                                      </InputGroup>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </Form>
                    </Grid>
                </Grid>
              }

                </div>
            </div>
        );
    }
}


function mapStateToProps({ email }) {
    return { email };
}

export default connect(mapStateToProps,{addSubscriber})(withRouter((subscribe)));
