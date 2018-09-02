import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Subscribe from '../components/subscribe/subscribe';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getPosts,getUser
} from '../redux/actions';
import Hidden from '@material-ui/core/Hidden';
import { AlgoliaHits,AlgoliaConnectedCheckBoxRefinementList } from '../components/algolia/config';
import { CurrentRefinements, ClearRefinements } from 'react-instantsearch-dom';

import {
  InstantSearch
} from 'react-instantsearch-dom';

const bodyBlue = "linear-gradient(#1a237e, #121858)";

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

    renderBannerIfLoggedIn(logged){
      if (logged === false){
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
              appId="43JRRJRQRC"
              apiKey="f30aafcad64f2d5e2df7e302733b428f"
              indexName="posts"
          >
                <Header/>
                  <div
                      style={{
                          flexGrow: 1,
                          justify: 'center',
                          background: bodyBlue,
                          height:this.state.height+(100*8)
                      }}
                  >
                  {this.renderBannerIfLoggedIn(this.props.users.logged)}
                      <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                          {/* Hide if below at tablet size or lower*/}
                          <Hidden smDown>
                          <Grid item style={{width:220,height:800, borderColor:'#474f97', textTransform: 'none', marginRight:20}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                <CurrentRefinements />
                                <ClearRefinements />
                                <AlgoliaConnectedCheckBoxRefinementList attribute="tags"  />
                              </Grid>
                          </Grid>
                          </Hidden>
                          <Grid item xs style={{height:800, borderColor:'#474f97', textTransform: 'none', width:'100%'}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto", width:'100%'}} >
                                  <AlgoliaHits style={{ width:'100%'}}/>
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
