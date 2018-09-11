import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class banner extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div
                    style={{
                        flexGrow: 1,
                        marginTop: 0,
                        justify: 'center',
                    }}
                >
                    <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", }} >

                        <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none'}}>
                            <Typography style={{color:'white', textAlign:'center'}} variant={"subheading"} >
                                "Everybody has a plan until they get <b>punched</b> in the mouth." - Mike Tyson <span aria-label="emoji" role="img">🥊</span>
                            </Typography>
                            <Typography style={{color:'#b2b9e1', textAlign:'center', marginTop:20}} variant={"subheading"} >
                                <b style={{color:'white'}}>Cavalry</b> is a collection of runbooks to help you coordinate security incidents.
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default banner;
