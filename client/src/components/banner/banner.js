import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Typist from 'react-typist';

class banner extends Component {

    constructor(props) {
        super(props);
        this.state = {
          sentence1:"Coordinate your team.",
          sentence2:"Share your knowledge.",
          sentence3:"Stay prepared.",
          sentence4:"The Cavalry's Here!"
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
                    <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"35em", paddingBottom:20}} >
                        <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none', border:'0px solid #474f97', padding:20, marginLeft:5, marginRight:5}}>
                            <Typography style={{color:'#3d63ff', textAlign:'center'}} variant={"title"} >
                              <Typist>
                                <span><b>{this.state.sentence1}</b></span>
                                  <Typist.Backspace count={this.state.sentence1.length} delay={1000} />
                                <span><b>{this.state.sentence2}</b></span>
                                  <Typist.Backspace count={this.state.sentence2.length} delay={1000} />
                                <span><b>{this.state.sentence3}</b></span>
                                  <Typist.Backspace count={this.state.sentence3.length} delay={1000} />
                                <span><b>{this.state.sentence4}</b></span>
                              </Typist>
                            </Typography>

                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default banner;
