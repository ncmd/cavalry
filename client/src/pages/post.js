import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';

const bodyBlue = "linear-gradient(#1a237e, #121858)";

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterItems:['FILTER1', 'FILTER2', 'FILTER3', 'FILTER4', 'FILTER5'],
            anchorEl: null,
            selectedIndex: 1,
            resultItems:['RESULT1', 'RESULT2', 'RESULT3', 'RESULT4', 'RESULT5', 'RESULT6', 'RESULT7', 'RESULT8'],
            width: window.innerWidth,
            height: window.innerHeight
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
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        height:this.state.height+(this.state.resultItems.length*100)
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{ height:370,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >

                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}} >

                    </Grid>
                </div>
            </div>
        );
    }
}
export default Post;
