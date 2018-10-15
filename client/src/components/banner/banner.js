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
          sentence4:"The Cavalry's Here!",
          render:true,
        };
    }

    clearTimeouts() {
        this.timeouts.forEach(clearTimeout);
    }

    timeout(){
      setTimeout(() => {
        this.setState({
          render:false,
        })
      }, 18900);
    }

    componentDidMount() {
      this.timeout()
    }


    componentWillUnmount(){
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    }

    renderTypist(){
      if (this.state.render === true){
        return (
          <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"35em", paddingBottom:10}} >
              <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none', border:'0px solid #474f97', marginLeft:5, marginRight:5}}>
          <div style={{color:'#3d63ff', textAlign:'center', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:440, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} variant={"title"} >
            <Typist>
              <span><b>{this.state.sentence1}</b></span>
                <Typist.Backspace count={this.state.sentence1.length} delay={1000} />
              <span><b>{this.state.sentence2}</b></span>
                <Typist.Backspace count={this.state.sentence2.length} delay={1000} />
              <span><b>{this.state.sentence3}</b></span>
                <Typist.Backspace count={this.state.sentence3.length} delay={1000} />
              <span><b>{this.state.sentence4}</b></span>
            </Typist>
          </div>
        </Grid>
    </Grid>
        )
      }
    }

    // renderSignup(){
    //   if(this.state.showSignup === true){
    //     return (
    //       <Grid container style={{ flexGrow:1, margin:"0 auto", maxWidth:"35em", paddingBottom:10}} >
    //         <Grid item xs={12} style={{ borderColor:'#474f97', textTransform: 'none', border:'0px solid #474f97', marginLeft:5, marginRight:5}}>
    //
    //       </Grid>
    //   </Grid>
    //     )
    //   }
    // }




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
                    {this.renderTypist()}
                </div>
            </div>
        );
    }
}

export default banner;
