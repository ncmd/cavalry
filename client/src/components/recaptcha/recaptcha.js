import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Form, FormGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '@material-ui/core/Button';

class recaptcha extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name:'',
            recaptcha: '',
            recaptchaApply: '',
        };

        this.handleChangeRecaptcha = this.handleChangeRecaptcha.bind(this);
        this.handleChangeRecaptchaApply = this.handleChangeRecaptchaApply.bind(this);
        this.validateCaptchaClick = this.validateCaptchaClick.bind(this);
        this.validateCaptchaClickApply = this.validateCaptchaClickApply.bind(this);
    }

    handleChangeRecaptcha(event) {
        this.setState({ recaptcha:event});
        console.log("RECAPTCHA: ",event)
    }

    handleChangeRecaptchaApply(event) {
        this.setState({ recaptchaApply:event});
        console.log("RECAPTCHA: ",event)
    }

    validateCaptchaClick(){

        console.log("Button Clicked!");
        if (1===1){
            this.props.emailJidoka(this.state.name, this.state.phone, this.state.email, this.state.recaptcha);
            console.log("ALL VALID");
            this.setState({
                sContact: true
            })
        } else {
            console.log("SOMETHING IS NOT VALID!",this.state.validName, this.state.validPhone,this.state.validEmail)
        }
    }

    validateCaptchaClickApply(){

        console.log("Button Clicked!");
        if (1===1){
            this.props.applySecurity(this.state.recaptchaApply);
            console.log("ALL VALID");
        } else {
            console.log("SOMETHING IS NOT VALID!")
        }
    }

    renderButton(){
        if (this.state.recaptcha !== ''){
            if(this.state.recaptcha !== ''){
                return(
                    <Button disabled style={{background:'green',color:'white', marginTop:20}}>Thank you! We will contact you soon!</Button>
                )
            } else {
                return(
                    <Button onClick={this.validateCaptchaClick} style={{background:'blue',color:'white', marginTop:20}}>Send Request</Button>
                )
            }
        } else if (this.state.recaptcha === ''){
            return(
                <Button disabled style={{background:'grey',color:'white', marginTop:20}}>Send Request</Button>
            )

        }
        else
        {
            return(
                <Button style={{background:'green',color:'white', marginTop:20}}>Sent!</Button>
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
                    }}
                >
                    <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", }} >
                        <Grid item xs={12} style={{height:40, borderColor:'#474f97', textTransform: 'none'}}>
                            <Form>
                                <FormGroup>
                                    <Grid container style={{ flexGrow:1, display:'flex',justifyContent: 'center', alignItems: 'center' }} spacing={0} alignItems={'flex-start'} direction={'row'} justify={'center'} >
                                        <Grid style={{flexGrow:1}} item>

                                            <ReCAPTCHA
                                                ref="recaptcha"
                                                sitekey="6Ld7TVAUAAAAAAnsapjoE7XOJcdBZnIxtSIRgtsR"
                                                onChange={this.handleChangeRecaptcha.bind(this)}/>
                                            {this.renderButton()}
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

export default recaptcha;
