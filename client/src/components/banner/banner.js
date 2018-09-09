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
                            <Typography style={{color:'white', textAlign:'center', padding:10, margin:'auto'}} variant={"headline"} >
                                Find your <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>📘</span>️ Runbook to <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>👀️</span>️ <b>Detect</b>, <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🎬</span> <b>Respond</b>, <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>📊</span> <b>Report</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none'}}>
                            <Typography style={{color:'white', textAlign:'center'}} variant={"subheading"} >
                                "Everybody has a plan until they get <b>punched</b> in the mouth." - Mike Tyson<br/>
                            </Typography>
                            <Typography style={{color:'#b2b9e1', textAlign:'center'}} variant={"subheading"} >
                                <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🐎️</span><b style={{color:'white'}}>Cavalry</b> is a collection of runbooks to help you coordinate the best decisions for security incident.
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default banner;
