import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typist from 'react-typist';
import 'react-typist/dist/Typist.css';

class banner extends Component {

    constructor(props) {
        super(props);
        this.state = {
          sentence1:"🔍 Search",
          sentence2:", 👟 run",
          sentence3:", 📣 coordinate",
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
      }, 12000);
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
          <div style={{color:'#3d63ff', textAlign:'center', letterSpacing:'-0.5px', fontSize:'24px', fontWeight:340, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}} variant={"title"} >
            <Typist cursor={{blink: true}}>
              <span><b>{this.state.sentence1}</b></span>
                <Typist.Delay ms={700} />
              <span><b>{this.state.sentence2}</b></span>
                <Typist.Delay ms={700} />
              <span><b>{this.state.sentence3}</b></span>
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
