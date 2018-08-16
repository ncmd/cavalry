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
                                Find your runbook to <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🔍</span>️ detect, <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🚨</span> respond, and <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>📕</span> report
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none'}}>
                            <Typography style={{color:'#b2b9e1', textAlign:'center'}} variant={"subheading"} >
                                Cavalry is a crowdsourced database of runbooks analyzing 100+ data points every second to help you make the best decisions during an incident — and when you execute, it connects you with 100+ <span aria-label="emoji" role="img" style={{fontSize:'1.8rem'}}>🐎</span> Cavalry professionals to save the day!
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default banner;
