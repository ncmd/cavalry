import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getPosts,
  starPost,
  getUser,
  setAccount,
  filterPostByTagAction,
  getTags,
  lightThemeLoad
} from '../redux/actions';
import Hidden from '@material-ui/core/Hidden';
import { InstantSearch } from 'react-instantsearch-dom';
import { googleanalytics } from '../components/analytics';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Truncate from 'react-truncate';
import Select from 'react-select';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Objectives from '@material-ui/icons/ListAlt';
import Commments from '@material-ui/icons/ModeComment';
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago'

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
      loadSelectOptions: false,
      selectValueOptions: [],
      selectValue: [],
      selectLoad: true,
      filterOptions: ["Anything"],
      anchorEl: null,
      selectedIndex: 0,
      posts: [],
      account: [],
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
    this.myInput = React.createRef()
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  // Controls Onload Windows Height Dimensions
  componentDidMount() {
    this.renderTheme()
    JavascriptTimeAgo.locale(en)
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillMount() {
    this.loadPostsGetTags()

    if (this.props.users.logged === true) {
      // console.log("DidMount Props Users:",this.props.users)
      this.setState({
        isLoggedIn: true
      }, () => {
        //create account in firebase
      })
    } else {
      this.setState({
        isLoggedIn: false
      })
    }
  }

  loadPostsGetTags = () => {
    this.setState({
      selectLoad: true,
    })
    this.props.getPosts().then(() => {
      let prevPosts = this.state.posts
      if (this.props.posts.length > 0) {
        this.props.posts.map((post) => {
          prevPosts.push({
            author: post.author,
            description: post.description,
            id: post.id,
            objectives: post.objectives,
            stars: post.stars,
            starred: post.starred,
            tags: post.tags,
            timestamp: post.timestamp,
            title: post.title,
          })   
          return null
        })
        this.setState({
          posts: prevPosts,
        })
        this.props.getTags().then(() => {
          this.getTagsReady()
        })
      }
    })
  }

  getTagsReady(){
    let prevSelectOptions = this.state.selectValueOptions
    if (prevSelectOptions.length === 0){
      this.props.tags.allTags.map((tag) => {
        prevSelectOptions.push({
          value: tag,
          label: tag,
        })
        return null
      })
      console.log("Tags selectValueOptions:", this.state.selectValueOptions)
      this.setState({
        selectValueOptions: prevSelectOptions,
        loadSelectOptions: true
      }, () => {
        this.setState({
          selectLoad: false
        })
      })
    } else {
      console.log("Tags selectValueOptions:", this.state.selectValueOptions)
      this.setState({
        selectValueOptions: prevSelectOptions,
        loadSelectOptions: true
      }, () => {
        this.setState({
          selectLoad: false
        })
      })
    }
    
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  renderBannerIfLoggedIn(logged) {
    if (logged === false) {
      return (
        <div>
          <Banner />
        </div>
      )
    }
  }

  renderObjectives(objectivelength) {
    if (objectivelength === 1) {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <Objectives style={{ verticalAlign: 'middle', fontSize: 18, color: this.props.theme[0].PostsTypographyDescription }} /> {objectivelength} Objective
        </div>
      )
    } else {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <Objectives style={{ verticalAlign: 'middle', fontSize: 18, color: this.props.theme[0].PostsTypographyDescription }} /> {objectivelength} Objectives
        </div>
      )
    }
  }

  renderSelect() {
    if (this.state.loadSelectOptions === true) {
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

  renderClickStar(postid, starred, index) {
    // console.log( this.state.posts[index].starred)
    if (this.props.account.username !== undefined && this.props.posts.length > 0) {
      var ind = this.props.posts[index].starred.indexOf(this.props.account.username);
      console.log(this.props.posts[0].starred);
      if (ind === -1) {
        return (
          <Hidden mdDown>
            <Grid item xs={1} style={{ textAlign: 'center', paddingRight: 16 }} onClick={() => this.handleClickStar(postid, index)}>
              <div style={{ borderRadius: '16px', textTransform: 'none', paddingTop: 10 }} >
                <StarBorder style={{ verticalAlign: 'bottom', fontSize: 38, color: this.props.theme[0].PostsTypographyDescription }} />
              </div>
              <div style={{ borderRadius: '16px', textTransform: 'none', color: this.props.theme[0].PostsTypographyDescription, paddingBottom: 10, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 500, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} >
                {this.props.posts[index].stars}
              </div>
            </Grid>
          </Hidden>
        )
      } else if (ind !== -1) {
        return (
          <Hidden mdDown>
            <Grid item xs={1} style={{ textAlign: 'center', paddingRight: 16 }} onClick={() => this.handleClickStar(postid, index)}>
              <div style={{ borderRadius: '16px', textTransform: 'none', paddingTop: 10 }} >
                <Star style={{ verticalAlign: 'bottom', fontSize: 38, color: this.props.theme[0].PrimaryLight }} />
              </div>
              <div style={{ borderRadius: '16px', textTransform: 'none', color: this.props.theme[0].PostsTypographyDescription, paddingBottom: 10, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 500, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} >
                {this.props.posts[index].stars}
              </div>
            </Grid>
          </Hidden>
        )
      }
    } else {
      return (
        <Hidden mdDown>
          <Grid item xs={1} style={{ textAlign: 'center', paddingRight: 16 }}>
            <div style={{ borderRadius: '16px', textTransform: 'none', paddingTop: 10 }} >
              <Star style={{ verticalAlign: 'bottom', fontSize: 38, color: this.props.theme[0].PrimaryLight }} />
            </div>
            <div style={{ borderRadius: '16px', textTransform: 'none', color: this.props.theme[0].PostsTypographyDescription, paddingBottom: 10, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 500, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} >
              {this.props.posts[index].stars}
            </div>
          </Grid>
        </Hidden>
      )
    }
  }

  handleClickStar(postid, index) {
    if (this.props.account.username !== undefined) {
      console.log(this.state.posts[index].starred)
      let prevStarred = this.state.posts
      var ind = this.props.posts[index].starred.indexOf(this.props.account.username);
      // does not exist; add
      if (ind === -1) {
        prevStarred[index].starred.push(this.props.account.username)
        this.setState({
          posts: prevStarred
        })
        this.props.starPost(postid, this.props.account.username, prevStarred[index].starred, 1, index)
      } else if (ind !== -1) {
        var i = prevStarred[index].starred.indexOf(this.props.account.username);
        if (i !== -1) prevStarred[index].starred.splice(i, 1)
        this.setState({
          posts: prevStarred
        })
        this.props.starPost(postid, this.props.account.username, prevStarred[index].starred, -1, index)
      }
    }
  }

  renderTimeAgo(index) {
    if (this.state.posts.length > 0) {
      return (
        <ReactTimeAgo locale="en">
          {Date.parse(this.state.posts[index].timestamp)}
        </ReactTimeAgo>
      )
    }
  }

  renderPosts() {
    if (this.state.posts !== null && this.state.posts.length > 0) {
      return (this.props.posts.map((hit, index) => {
        return (
          <Grid item xs={12} key={hit.title + Math.random() + (Math.random())} style={{ marginBottom: 5, maxWidth: '100%', marginLeft: 10, marginRight: 10, paddingTop: 5 }}>
            <Button variant="contained" style={{ border: this.props.theme[0].PostsButtonBorder, background: this.props.theme[0].PostsButtonBackground, textTransform: 'none', minWidth: '100%' }}>
              {/*}<Button variant="contained" style={{ height:100,background:'linear-gradient(#5533ff, #3d63ff)',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>*/}
              <Grid container style={{ flexGrow: 1 }}>
                {this.renderClickStar(hit.id, hit.starred, index)}
                <Grid item xs style={{ textAlign: 'left' }}>
                  <Grid container style={{ flexGrow: 1 }} alignItems={'flex-start'} justify={'flex-start'} direction={'column'} >
                    <Link style={{ textDecoration: 'none', width: '100%' }} to={{ pathname: '/post/' + hit.id + '/' + findAndReplace(findAndReplace(findAndReplace(findAndReplace(hit.title, ' ', '-'), '\'', ''), '/', '-'), '\\', '-').toLowerCase() }} onClick={() => googleanalytics.Cavalry_Webapp_Landing_Runbook_Userclickedonrunbook(hit.title)}>
                      <Grid item zeroMinWidth >
                        <div style={{ color: this.props.theme[0].PostsTypographyTitle, minWidth: 0, flexGrow: 1, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 500, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                          <Hidden mdDown>
                            <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                              {hit.title}
                            </Truncate>
                          </Hidden>
                        </div>
                        <div style={{ color: this.props.theme[0].PostsTypographyDescription, marginTop: 5, minWidth: 0, flexGrow: 1, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 440, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                          <Hidden mdDown>
                            <Truncate width={600} lines={1} ellipsis={<span>...</span>}>
                              {hit.description}
                            </Truncate>
                          </Hidden>
                        </div>
                        <div style={{ color: this.props.theme[0].PostsTypographyTitle, minWidth: 0, flexGrow: 1, letterSpacing: '-0.5px', fontSize: '15px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                          <Hidden smUp >
                            <Truncate width={321} lines={1} ellipsis={<span>...</span>}>
                              {hit.title}
                            </Truncate>
                          </Hidden>
                        </div>
                        <div style={{ color: this.props.theme[0].PostsTypographyDescription, marginTop: 5, minWidth: 0, flexGrow: 1, letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                          <Hidden smUp>
                            <Truncate width={321} lines={1} ellipsis={<span>...</span>}>
                              {hit.description}
                            </Truncate>
                          </Hidden>
                        </div>
                      </Grid>
                    </Link>
                    <Link style={{ textDecoration: 'none' }} to={{ pathname: '/post/' + hit.id + '/' + findAndReplace(findAndReplace(findAndReplace(findAndReplace(hit.title, ' ', '-'), '\'', ''), '/', '-'), '\\', '-').toLowerCase() }} onClick={() => googleanalytics.Cavalry_Webapp_Landing_Runbook_Userclickedonrunbook(hit.title)}>
                      <Grid item style={{ marginRight: 5 }}>
                        <Grid container style={{ flexGrow: 1, height: "100%", width: "100%", }} spacing={0} alignItems={"center"} direction={"row"} justify={"space-between"}>
                          <Hidden smUp>
                            <Grid item style={{ height: 20 }}>
                              <div style={{ color: this.props.theme[0].PostsTypographyObjectives, marginRight: 10, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                                <StarBorder style={{ verticalAlign: 'middle', fontSize: 18, color: this.props.theme[0].PostsTypographyDescription }} /> 0 Stars
                                         </div>
                            </Grid>
                          </Hidden>
                          <Grid item style={{ height: 20 }}>
                            {this.renderObjectives(hit.objectives.length)}
                          </Grid>
                          <Grid item style={{ marginRight: 10, height: 20 }}>
                            <div style={{ color: this.props.theme[0].PostsTypographyObjectives, marginLeft: 10, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                              <Commments style={{ verticalAlign: 'middle', fontSize: 18, color: this.props.theme[0].PostsTypographyDescription }} /> 0 Comments
                                   </div>
                          </Grid>
                          <Hidden mdDown>
                            {hit.tags.slice(0, 3).map((value) => {
                              if (value !== " " && value.length < 12) {
                                return (
                                  <Grid key={value + Math.random() + (Math.random())} item style={{ height: 20, verticalAlign: 'middle' }}>
                                    <span style={{ verticalAlign: 'middle', background: this.props.theme[0].PostsTagsBackground, borderRadius: 5, textAlign: 'center', color: 'white', display: 'inline-block', fontWeight: 'bold', paddingLeft: 10, paddingRight: 10, marginRight: 5, height: 17 }}>
                                      <div style={{ verticalAlign: 'middle', color: 'white', letterSpacing: '1px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                                        <b>{value}</b>
                                      </div>
                                    </span>
                                  </Grid>)
                              }
                              return null
                            }
                            )}
                          </Hidden>
                        </Grid>
                      </Grid>
                    </Link>
                  </Grid>
                </Grid>
                <Hidden smDown>
                  <Grid item xs={3} style={{ textAlign: 'left', borderLeft: '2px solid rgba(0, 0, 0, 0.12)' }}>
                    <Grid container style={{ flexGrow: 1 }} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                      <Grid item>
                        <div style={{ marginTop: 5, color: this.props.theme[0].PostsTypographyObjectives, marginLeft: 20 }}>
                          <div style={{ textTransform: 'none', color: this.props.theme[0].PostsTypographyDescription, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>Posted by: <Link to={"/users/" + hit.author} style={{ textDecoration: 'none' }}>{hit.author}</Link></div>
                        </div>
                      </Grid>
                      <Grid item>
                        <div style={{ marginTop: 5, color: this.props.theme[0].PostsTypographyObjectives, marginLeft: 20 }}>
                          <div style={{ textTransform: 'none', color: this.props.theme[0].PostsTypographyDescription, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                            Last publish:{' '}
                            {this.renderTimeAgo(index)}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Hidden>
              </Grid>
            </Button>

          </Grid>
        )
      }))
    }
  }

  handleChangeSelect = selectValue => (event) => {
    this.setState({
      [selectValue]: event,
    })
    console.log("Selected:", event)
    try {
      if (event !== null) {
        this.props.filterPostByTagAction(event.value)
      } else {
        this.setState({
          selectLoad: true,
        },() => {
          this.loadPostsGetTags()
        })
        
        
      }
    }
    catch (err) {
      console.log(err.message)
    }


  }

  renderTheme() {
    if (this.props.theme.length > 0) {
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
        <style>{'body { background-color:' + this.renderTheme() + ' }'}</style>
        <Header />
        <div
          style={{
            flexGrow: 1,
            justify: 'center',
            background: this.renderTheme(),
            minHeight: this.state.height,
            marginTop: 48,
            paddingTop: 5,
          }}
        >
          {/* {this.renderBannerIfLoggedIn(this.state.isLoggedIn)} */}
          <Grid container style={{ flexGrow: 1, paddingTop: 0, margin: "0 auto", maxWidth: "63em" }} >
            {/* Hide if below at tablet size or lower*/}
            <Hidden smDown>
              <Grid item style={{ width: 180, borderColor: '#474f97', textTransform: 'none', marginRight: 20, marginLeft: 10 }}>
                <div style={{ color: "#3d63ff", letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} ><b>Filter by Tag</b></div>
                {this.renderSelect()}
              </Grid>
            </Hidden>
            <Grid item xs style={{ borderColor: '#474f97', textTransform: 'none', width: '100%' }}>
              <Grid container style={{ flexGrow: 1, margin: "0 auto", width: '100%' }} >
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

function mapStateToProps({ posts, users, account, tags, theme }) {
  return {
    posts,
    users,
    account,
    tags,
    theme
  };
}

export default connect(mapStateToProps, {
  getPosts,
  starPost,
  getUser,
  setAccount,
  filterPostByTagAction,
  getTags,
  lightThemeLoad
})(withRouter(Landing));
