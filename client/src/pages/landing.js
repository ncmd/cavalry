import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Subscribe from '../components/subscribe/subscribe';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
// import Menu from '@material-ui/core/Menu';
// import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getPosts,getUser
} from '../redux/actions';
// import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
// import withWidth from '@material-ui/core/withWidth';
// import compose from 'recompose/compose';
// import { Badge } from 'reactstrap';
// import Truncate from 'react-truncate';
// import { firebase } from '../components/firebase';
// import HashTable from "../classes/HashTable";
import {AlgoliaHits,AlgoliaRefinementList} from '../components/algolia/config';

import {
  InstantSearch
} from 'react-instantsearch-dom';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
// const buttonBlue = "linear-gradient(#283593, #1a237e)";

class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterPosts:['TAG'],
            filterOptions:["Anything"],
            anchorEl: null,
            selectedIndex: 0,
            posts:[],
            width: window.innerWidth,
            height: window.innerHeight,
            isLoggedIn: false,
            initialSize: 1,
            arraySize: [],
            insert: "",
            find: "",
            erase: "",
            hTable: null
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    // Controls Onload Windows Height Dimensions
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillMount(){

      // if(this.props.users.length !== 0){
      //   console.log("DidMount Props Users:",this.props.users)
      //   // firebase.auth.onAuthStateChanged(authUser => {
      //   //   authUser
      //   //   ? this.setState({ isLoggedIn:true })
      //   //   : this.setState({ isLoggedIn:false });
      //   // })
      // }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    renderBannerIfLoggedIn(){
      if (this.props.users.logged === false){
        return(
          <div>
            <Banner/>
            <Subscribe/>
          </div>
        )
      }
    }

    render() {
        return (
            <InstantSearch
            appId="latency"
            apiKey="3d9875e51fbd20c7754e65422f7ce5e1"
            indexName="bestbuy"
          >
                <Header/>
                  <div
                      style={{
                          flexGrow: 1,
                          justify: 'center',
                          background: bodyBlue,
                          height:this.state.height
                      }}
                  >
                  {this.renderBannerIfLoggedIn()}
                      <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                          {/* Hide if below at tablet size or lower*/}
                          <Hidden smDown>
                          <Grid item style={{width:220,height:800, borderColor:'#474f97', textTransform: 'none', marginRight:20}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                <AlgoliaRefinementList/>
                              </Grid>
                          </Grid>
                          </Hidden>
                          <Grid item xs style={{height:800, borderColor:'#474f97', textTransform: 'none'}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                  <AlgoliaHits/>
                              </Grid>
                          </Grid>

                      </Grid>
                  </div>
            </InstantSearch>
        )
    }
}


function mapStateToProps({ posts,users }) {
    return { posts,users };
}

export default connect(mapStateToProps,{getPosts,getUser})(withRouter(Landing));
