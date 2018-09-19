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
                    <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"35em",}} >
                        <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none', border:'1px solid #474f97', padding:20, marginLeft:5, marginRight:5}}>
                            <Typography style={{color:'#b2b9e1', textAlign:'center'}} variant={"title"} >
                                <b style={{color:'white'}}>Runbooks to Coordinate Security Incidents.</b>
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default banner;
