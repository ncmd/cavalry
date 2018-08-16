import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Form, FormGroup,Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const subscribeButton = "linear-gradient(to right, #ff1744, #F44336 ";

class filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name:''
        };
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
                        <Grid item xs={12} style={{height:70, borderColor:'#474f97', textTransform: 'none'}}>
                            <Form>
                                <FormGroup>
                                    <Grid container style={{ flexGrow:1, display:'flex',justifyContent: 'center', alignItems: 'center' }} spacing={0} alignItems={'flex-start'} direction={'row'} justify={'center'} >
                                        <Grid style={{flexGrow:1}} item xs={4}>
                                            <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" />
                                        </Grid>
                                        <Grid item>
                                            <Button raised="true" variant="raised" style={{color:'white', textAlign:'center', border:'white',height:38, background:subscribeButton, textTransform: 'none', marginLeft:5}} onClick={this.handleClickOpen} >
                                                SUBSCRIBE
                                            </Button>
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

export default filter;
