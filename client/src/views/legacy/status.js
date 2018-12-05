import React, { Component } from 'react';
import Header from '../../components/header/header';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    pingBackend,
} from '../../redux/actions';
// import Typography from '@material-ui/core/Typography';
import axios from "axios/index";

const bodyBlue = "linear-gradient(#1a237e, #121858)";

class Status extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            statusPing: null,
            statusPosts: null,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    callApiPing(){
        // Checking API Status
        try {
            this.intervalcallApiPing = setInterval(async () => {
                await axios.get('https://cavalry-app.herokuapp.com/api/ping').then((response) => {
                    console.log("UP");
                    // console.log(response);
                    this.setState({
                        statusPing: "UP ✅"
                    });
                }).catch((response) => {
                    if (response.status === undefined) {
                        this.setState({
                            statusPing: "DOWN ⚠️"
                        });
                    }
                });
            }, 1000);
        } catch(e) {
            console.log(e);
        }
    }

    callApiPosts(){
        // Checking API Status
        try {
            this.intervalcallApiPosts = setInterval(async () => {
                await axios.get('https://cavalry-app.herokuapp.com/api/posts').then((response) => {
                    console.log("UP");
                    console.log(response);
                    this.setState({
                        statusPosts: "UP ✅"
                    });
                }).catch((response) => {
                    if (response.statusPosts === undefined) {
                        this.setState({
                            statusPosts: "DOWN ⚠️"
                        });
                    }
                });
            }, 10000);
        } catch(e) {
            console.log(e);
        }
    }

    async componentDidMount() {
        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.callApiPing();
        this.callApiPosts();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.intervalcallApiPing);
        clearInterval(this.intervalcallApiPosts);
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
                        height:this.state.height
                    }}
                >
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                        <Grid item style={{height:800, borderColor:'#474f97', textTransform: 'none', marginRight:20}}>
                            {/* <Typography style={{color:'white'}}>/api/ping Status: {this.state.statusPing}</Typography><br/>
                            <Typography style={{color:'white'}}>/api/posts Status: {this.state.statusPosts}</Typography><br/> */}
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ status }) {
    return { status };
}

export default connect(mapStateToProps,{pingBackend})(withRouter(Status));
