import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
    getPost
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";

const bodyBlue = "linear-gradient(#1a237e, #121858)";

class Base extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            <div>
                <Header/>
                  <script type="text/javascript">

                </script>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        minHeight:this.state.height
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{ height:300,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'column'} >
                      <Grid container alignItems={'flex-start'} justify={'flex-end'} direction={'row'} >

                      </Grid>


                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >

                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ posts }) {
    return { posts };
}
export default connect(mapStateToProps, {
  getPost,
})(withRouter(Base));
