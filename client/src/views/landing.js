import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getPosts,getUser,setAccount,
    filterPostByTagAction,
    getTags,
    lightThemeLoad,
    darkThemeLoad,
} from '../redux/actions';
import Hidden from '@material-ui/core/Hidden';
// import { AlgoliaPostsHits,AlgoliaConnectedCheckBoxRefinementList } from '../components/algolia/config';
import { CurrentRefinements, ClearRefinements,InstantSearch } from 'react-instantsearch-dom';
import { googleanalytics } from '../components/analytics';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
// import { Badge } from 'reactstrap';
import Truncate from 'react-truncate';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';

const keys = require('../secrets/keys');
// const bodyBlue = "linear-gradient(#1a237e, #121858)";
function findAndReplace(string, target, replacement) {
 var i = 0, length = string.length;
 for (i; i < length; i++) {
  string = string.replace(target, replacement);
 }
 return string;
}


class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadSelectOptions:false,
            selectValueOptions:[],
            selectValue:[],
            selectLoad:true,
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
            hTable: null,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    // Controls Onload Windows Height Dimensions
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillMount(){
      this.loadPostsGetTags()
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

    loadPostsGetTags = () =>{
      this.props.getPosts().then(() => {
        this.props.getTags().then(() => {
          this.getTagsReady()
          console.log("getTagsReady")
        })
        console.log("Got tags!",this.props.tags)
      })
      console.log("Got posts!")

    }


    getTagsReady(){
      let prevSelectOptions = this.state.selectValueOptions
      this.props.tags.allTags.map((tag) => {
        prevSelectOptions.push({
          value:tag,
          label:tag,
        })
      })
      console.log("Tags selectValueOptions:",this.state.selectValueOptions)
      this.setState({
        selectValueOptions: prevSelectOptions,
        loadSelectOptions:true
      },() => {
        this.setState({
          selectLoad:false
        })
      })
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

    renderObjectives(objectivelength){
      if (objectivelength === 1){
        return (
          <Typography variant="caption" style={{color: this.props.theme[0].PostsTypographyObjectives, marginLeft:20, marginTop:10}}>
          {objectivelength} Objective
        </Typography>
        )
      } else {
        return (
          <Typography variant="caption" style={{color: this.props.theme[0].PostsTypographyObjectives, marginLeft:20, marginTop:10}}>
          {objectivelength} Objectives
        </Typography>
        )
      }
    }

    renderSelect(){
      if (this.state.loadSelectOptions === true){
        return (
          <Select
            name="colors"
            options={this.state.selectValueOptions}
            className="basic-single"
            isClearable={true}
            isLoading={this.state.selectLoad}
            classNamePrefix="select"
            value={this.state.selectValue}
            onChange={this.handleChangeSelect('selectValue')}
          />
        )
      }
    }


    renderPosts(){
      if (this.props.posts !== null && this.props.posts.length > 0 ){
      return (this.props.posts.map((hit) => {
          return (
          <Grid item xs={12} key={hit.title+Math.random()+(Math.random())} style={{ marginBottom:5, maxWidth:'100%', marginLeft:10, marginRight:10}}>
            <Link to={{ pathname: '/post/' + hit.id + '/'+findAndReplace(findAndReplace(findAndReplace(findAndReplace(hit.title,' ','-'),'\'',''),'/','-'),'\\','-').toLowerCase()}} onClick={() => googleanalytics.Cavalry_Webapp_Landing_Runbook_Userclickedonrunbook(hit.title)}>
              <Button variant="contained" style={{ height:100, border: this.props.theme[0].PostsButtonBorder, background:this.props.theme[0].PostsButtonBackground, textTransform: 'none',  minWidth:'100%'}}>
                {/*}<Button variant="contained" style={{ height:100,background:'linear-gradient(#5533ff, #3d63ff)',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>*/}
                  <Grid container style={{flexGrow:1, marginLeft:10}}>
                      <Grid item xs={10} style={{textAlign:'left'}}>
                          <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                              <Grid item zeroMinWidth>
                                  <Typography variant="body1" style={{color:this.props.theme[0].PostsTypographyTitle, minWidth:0, flexGrow:1, overflowX:'hidden', fontWeight:'bold'}}>
                                    <Hidden mdDown>
                                    <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                                      {hit.title}
                                   </Truncate>
                                 </Hidden>
                                  </Typography>

                                  <Typography variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                    <Hidden mdDown>
                                    <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                                       {hit.description}
                                   </Truncate>
                                   </Hidden>
                                 </Typography>

                                <Typography variant="body2" style={{color:this.props.theme[0].PostsTypographyTitle, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                 <Hidden smUp>
                                 <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                    {hit.title}
                                </Truncate>
                              </Hidden>
                               </Typography>
                               <Typography variant="caption" style={{color:this.props.theme[0].PostsTypographyDescription, marginTop:5, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                 <Hidden smUp>
                                 <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                    {hit.description}
                                </Truncate>
                              </Hidden>
                                  </Typography>
                              </Grid>
                              <Grid item style={{marginRight:5}}>
                                <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                                  {hit.tags.slice(0, 3).map((value) => {
                                    if (value !== " "){
                                      return(
                                        <Grid key={value+Math.random()+(Math.random())} item >
                                          <span style={{background:this.props.theme[0].PostsTagsBackground,height:20, borderRadius:16,textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold', paddingLeft:10, paddingRight:10, marginRight:5}}>
                                            <Typography variant={'caption'} style={{color:'white'}}><font size="1"><b>{value}</b></font></Typography>
                                          </span>
                                      </Grid>)
                                    }
                                  }
                                  )}
                                </Grid>
                              </Grid>
                          </Grid>
                      </Grid>
                      <Hidden smDown>
                      <Grid item style={{ textAlign:'left',borderLeft: '2px solid rgba(0, 0, 0, 0.12)'}}>
                          <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                              <Grid item>
                                    {this.renderObjectives(hit.objectives.length)}
                              </Grid>
                          </Grid>
                      </Grid>
                    </Hidden>
                  </Grid>
              </Button>
            </Link>
          </Grid>
        )
      }))
    }
    }

    // renderAlgoliaFilter(){
    //   return (
    //     <Grid item style={{width:180, borderColor:'#474f97', textTransform: 'none', marginRight:20 }}>
    //         <Grid container style={{flexGrow:1, margin:"0 auto"}} >
    //           <CurrentRefinements />
    //           <ClearRefinements />
    //           <AlgoliaConnectedCheckBoxRefinementList attribute="tags"  />
    //         </Grid>
    //     </Grid>
    //   )
    // }

    handleChangeSelect = selectValue => (event) => {
      this.setState({
          [selectValue]: event,
      })
      console.log("Selected:",event)
     this.props.filterPostByTagAction(event.value)
   }

   renderTheme(){
     if (this.props.theme.length > 0){
       return this.props.theme[0].MainBackground
     } else {
       this.props.lightThemeLoad()
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
                          background: this.renderTheme(),
                          minHeight:this.state.height,
                          paddingTop:5,
                      }}
                  >
                  {this.renderBannerIfLoggedIn(this.state.isLoggedIn)}
                      <Grid container style={{flexGrow:1, paddingTop:0, margin:"0 auto", maxWidth:"63em"}} >
                          {/* Hide if below at tablet size or lower*/}
                          <Hidden smDown>
                          <Grid item style={{width:180, borderColor:'#474f97', textTransform: 'none', marginRight:20,marginLeft:10 }}>
                            <Typography style={{color:"#3d63ff"}} variant={'caption'}><b>Filter by Tag</b></Typography>
                            {this.renderSelect()}
                          </Grid>
                          </Hidden>
                          <Grid item xs style={{borderColor:'#474f97', textTransform: 'none', width:'100%'}}>
                              <Grid container style={{flexGrow:1, margin:"0 auto", width:'100%'}} >
                                  {/*<AlgoliaPostsHits style={{ width:'100%'}}/>*/}
                                  {this.renderPosts()}
                              </Grid>
                          </Grid>

                      </Grid>
                  </div>
            </InstantSearch>
        )
    }
}

function mapStateToProps({ posts,users,account,tags,theme}) {
    return { posts,users,account,tags,theme };
}

export default connect(mapStateToProps,{getPosts,getUser,setAccount, filterPostByTagAction,getTags,lightThemeLoad,darkThemeLoad})(withRouter(Landing));
