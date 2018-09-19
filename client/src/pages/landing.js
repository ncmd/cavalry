import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getPosts,getUser,setAccount
} from '../redux/actions';
import Hidden from '@material-ui/core/Hidden';
import { AlgoliaPostsHits,AlgoliaConnectedCheckBoxRefinementList } from '../components/algolia/config';
import { CurrentRefinements, ClearRefinements,InstantSearch } from 'react-instantsearch-dom';

const keys = require('../secrets/keys');
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

      this.props.getPosts()
      if(this.props.users.logged === true){
        // console.log("DidMount Props Users:",this.props.users)
        this.setState({
          isLoggedIn:true
        },() => {
          //create account in firebase

        })
      } else {
        this.setState({
          isLoggedIn:false
        })
      }
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
            {/*<Subscribe/>*/}
          </div>
        )
      }
    }

    render() {
        return (
            <InstantSearch
              appId="43JRRJRQRC"
              apiKey={keys.algolia_api_key}
              indexName="posts"
          >
                <Header/>
                  <div
                      style={{
                          flexGrow: 1,
                          justify: 'center',
                          background: bodyBlue,
                          minHeight:this.state.height
                      }}
                  >
                  {this.renderBannerIfLoggedIn(this.state.isLoggedIn)}
                      <Grid container style={{flexGrow:1, paddingTop:20, margin:"0 auto", maxWidth:"63em"}} >
                          {/* Hide if below at tablet size or lower*/}
                          <Hidden smDown>
                          <Grid item style={{width:220, borderColor:'#474f97', textTransform: 'none', marginRight:20 }}>
                              <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                <CurrentRefinements />
                                <ClearRefinements />
                                <AlgoliaConnectedCheckBoxRefinementList attribute="tags"  />
                              </Grid>
                          </Grid>
                          </Hidden>
                          <Grid item xs style={{borderColor:'#474f97', textTransform: 'none', width:'100%'}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto", width:'100%'}} >
                                  <AlgoliaPostsHits style={{ width:'100%'}}/>
                              </Grid>
                          </Grid>

                      </Grid>
                  </div>
            </InstantSearch>
        )
    }
}


function mapStateToProps({ posts,users,account }) {
    return { posts,users,account };
}

export default connect(mapStateToProps,{getPosts,getUser,setAccount})(withRouter(Landing));
