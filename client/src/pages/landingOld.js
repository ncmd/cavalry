import React, { Component } from 'react';
import Header from '../components/header/header';
import Banner from '../components/banner/banner';
import Subscribe from '../components/subscribe/subscribe';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from "react-router-dom";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    getPosts,getUser
} from '../redux/actions';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import withWidth from '@material-ui/core/withWidth';
import compose from 'recompose/compose';
import { Badge } from 'reactstrap';
import Truncate from 'react-truncate';
import { firebase } from '../components/firebase';
import HashTable from "../classes/HashTable";

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const buttonBlue = "linear-gradient(#283593, #1a237e)";
const filter1Options = [
    'Anything',
    'Hide sensitive notification content',
    'Hide all notification content',
];


const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
        [theme.breakpoints.down('sm')]: {
            backgroundColor: 'red',
        },
        [theme.breakpoints.up('md')]: {
            backgroundColor: 'blue',
        },
        [theme.breakpoints.up('lg')]: {
            backgroundColor: 'green',
        },
    },
});

const listItemStyle = {
    background:buttonBlue,
    border:'2px solid black',
    borderColor:'#474f97',
    textTransform: 'none',
    minWidth:'100%',
    borderRadius: 3,
    color: 'white',
    height: 70,
    MuiList:{padding:0}
};

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

    newHashTable() {
    let hTable = new HashTable(this.state.initialSize);
    let arraySize = [];
    for (let i = 0; i < hTable.size; i++) {
      arraySize.push(i);
    }
    this.setState({
      arraySize,
      hTable
    });
  }
  insert(item) {
    if (this.state.hTable !== null) {
      this.state.hTable.insert(item);
      this.forceUpdate();
    }
  }
  find(item) {
    if (this.state.hTable !== null) {
      const result = this.state.hTable.find(this.state.filterOptions[this.state.selectedIndex]);
      console.log("Finding Item:",this.state.filterOptions[this.state.selectedIndex])
      console.log("Result:",result)
    }
    // This is not the truly way to find and element in the table
    // The good one is the above commented lines
    // const found = document.querySelector(
    //   '[data-key="' + this.state.find + '"]'
    // );
    // if (found != null) {
    //   found.classList.add("found");
    //   setTimeout(() => {
    //     found.classList.remove("found");
    //   }, 3000);
    // }
  }
  clear() {
    if (this.state.hTable !== null) {
      this.state.hTable.clear();
      this.forceUpdate();
    }
  }
  erase() {
    if (this.state.hTable !== null && this.state.erase !== null) {
      this.state.hTable.erase(this.state.erase);
      this.forceUpdate();
    }
  }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillMount(){

      if(this.props.users.length !== 0){
        console.log("DidMount Props Users:",this.props.users)
        firebase.auth.onAuthStateChanged(authUser => {
          authUser
          ? this.setState({ isLoggedIn:true })
          : this.setState({ isLoggedIn:false });
        })
      }

        // Get all Posts
        this.props.getPosts().then(() => {
            let prevPosts = this.state.posts;
            let prevTags = this.state.filterOptions.slice();
            this.newHashTable()
            this.insert('Anything')
            if (this.props.posts !== null ){
                this.props.posts.map((r,index) => {
                    prevPosts.push({
                        id: r.id,
                        title: r.title,
                        description: r.description,
                        tags:r.tags,
                        objectives: r.objectives
                    })
                    if(r.tags.length > 1){
                      r.tags.map((t,index) => {

                        this.insert(this.findAndReplace(t, " ", ""))
                        console.log("Insert:",this.findAndReplace(t, " ", ""))
                      })
                    } else {
                       this.insert(r.tags)
                       console.log("Insert:",r.tags)
                    }

                    this.setState({
                        posts: prevPosts,
                        filterOptions: this.state.hTable.buckets[0].values()
                    });
                    return null
                    console.log()
                })
            }
        });
        console.log("POSTS PROPS",this.props.posts)
        console.log("USERS PROPS",this.props.users)
    }

    allTags(){

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleClickListItem = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, anchorEl: null },() => {
          console.log("Index:",this.state.selectedIndex)
          console.log("Option:",this.state.filterOptions[this.state.selectedIndex])
        })
      }

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    // Filter
    renderFilterPosts(){
        return(
            this.state.filterPosts.map(value => (
                <Grid item xs={12} key={value+1} style={{minWidth:'100%'}} >
                    <List component="nav" style={{paddingTop:0}}>
                        <ListItem
                            button
                            aria-haspopup="true"
                            aria-controls="lock-menu"
                            aria-label="When device is locked"
                            onClick={this.handleClickListItem}
                            style={listItemStyle}
                        >
                            <ListItemText
                                primary={<Typography style={{color:'white'}} variant="button">{value}</Typography>}
                                secondary={<Typography style={{color:'#939ed5'}} variant="caption">{this.state.filterOptions[this.state.selectedIndex]}</Typography>}
                            />
                        </ListItem>
                    </List>
                    <Menu
                        id="lock-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        {this.state.filterOptions.map((option, index) => (
                            <MenuItem
                                key={option+1}
                                selected={index === this.state.selectedIndex}
                                onClick={event => this.handleMenuItemClick(event, index)}
                                style={{width:188, background:'#283593', color:'white' , margin:'-8px 0 -8px 0'}}
                            >
                                <Typography variant="caption" style={{color:'white'}}>
                                    {option}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Grid>

                )
            )
        )
    }

    renderTags(postIndex){
      // console.log(this.state.posts[postIndex].tags.length)
      if (this.state.posts[postIndex].tags.length !== 0){
        return(
          this.state.posts[postIndex].tags.map((value) => (
            <Grid key={value+Math.random()+(Math.random())} item >
              <h5><Badge color="primary" style={{textTransform: 'none', marginRight:5,}}>{value}</Badge></h5>
            </Grid>

          ))
        )
      }

    }

    findAndReplace(string, target, replacement) {
      var i = 0, length = string.length;
      for (i; i < length; i++) {
       string = string.replace(target, replacement);
      }
      return string;
    }

    // Results
    renderResultPosts(tag){
      if(tag !== 'Anything'){
        return(
          this.state.posts.map((value,index) => (
            value.tags.map((t,i) => {
              if(t === tag[0]){
                console.log("Found:",t,tag[0],value.title)
                return(
                    <Grid item xs={12} key={value.title+Math.random()+(Math.random())} style={{ marginBottom:15, maxWidth:'100%', marginLeft:10, marginRight:10}}>
                      <Link to={{ pathname: '/post/' + value.id + '/'+this.findAndReplace(this.findAndReplace(value.title,' ','-'),'\'','')}}>
                        <Button variant="contained" style={{ height:150,background:'#283593',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>
                            <Grid container style={{flexGrow:1, marginLeft:10}}>
                                <Grid item xs={9} style={{textAlign:'left'}}>
                                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                        <Grid item zeroMinWidth>
                                            <Typography variant="title" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                              <Hidden mdDown>
                                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                                 {value.title}
                                             </Truncate>
                                           </Hidden>
                                            </Typography>

                                            <Typography variant="subheading" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                              <Hidden mdDown>
                                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                                 {value.description}
                                             </Truncate>
                                             </Hidden>
                                           </Typography>

                                          <Typography variant="body2" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                           <Hidden smUp>
                                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                              {value.title}
                                          </Truncate>
                                        </Hidden>
                                         </Typography>
                                         <Typography variant="caption" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                           <Hidden smUp>
                                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                              {value.description}
                                          </Truncate>
                                        </Hidden>

                                            </Typography>
                                        </Grid>
                                        <Grid item style={{marginTop:10 ,marginRight:5, overflow:"hidden"}}>
                                          <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                                              {this.renderTags(index)}
                                          </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Hidden smDown>
                                <Grid item style={{ textAlign:'left',borderLeft: '2px solid rgba(0, 0, 0, 0.12)'}}>
                                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                        <Grid item>
                                            <Typography variant="subheading" style={{color:'#939ed5', marginLeft:20, marginTop:10}}>
                                                {value.objectives.length} Objectives
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                              </Hidden>
                            </Grid>
                        </Button>
                      </Link>
                    </Grid>
                )
              }
            })
          ))
        )

      }
      if(tag === 'Anything'){
        return(
            this.state.posts.map((value,index) => (
                    <Grid item xs={12} key={value.title+Math.random()+(Math.random())} style={{ marginBottom:15, maxWidth:'100%', marginLeft:10, marginRight:10}}>
                      <Link to={{ pathname: '/post/' + value.id + '/'+this.findAndReplace(this.findAndReplace(value.title,' ','-'),'\'','')}}>
                        <Button variant="contained" style={{ height:150,background:'#283593',borderColor:'#474f97', textTransform: 'none',  minWidth:'100%'}}>
                            <Grid container style={{flexGrow:1, marginLeft:10}}>
                                <Grid item xs={9} style={{textAlign:'left'}}>
                                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                        <Grid item zeroMinWidth>
                                            <Typography variant="title" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                              <Hidden mdDown>
                                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                                 {value.title}
                                             </Truncate>
                                           </Hidden>
                                            </Typography>

                                            <Typography variant="subheading" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                              <Hidden mdDown>
                                              <Truncate width={580} lines={1} ellipsis={<span>...</span>}>
                                                 {value.description}
                                             </Truncate>
                                             </Hidden>
                                           </Typography>

                                          <Typography variant="body2" style={{color:'white', minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                           <Hidden smUp>
                                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                              {value.title}
                                          </Truncate>
                                        </Hidden>
                                         </Typography>
                                         <Typography variant="caption" style={{color:'#939ed5', marginTop:10, minWidth:0, flexGrow:1, overflowX:'hidden'}}>
                                           <Hidden smUp>
                                           <Truncate width={275} lines={1} ellipsis={<span>...</span>}>
                                              {value.description}
                                          </Truncate>
                                        </Hidden>

                                            </Typography>
                                        </Grid>
                                        <Grid item style={{marginTop:10 ,marginRight:5, overflow:"hidden"}}>
                                          <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                                              {this.renderTags(index)}
                                          </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Hidden smDown>
                                <Grid item style={{ textAlign:'left',borderLeft: '2px solid rgba(0, 0, 0, 0.12)'}}>
                                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                        <Grid item>
                                            <Typography variant="subheading" style={{color:'#939ed5', marginLeft:20, marginTop:10}}>
                                                {value.objectives.length} Objectives
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                              </Hidden>
                            </Grid>
                        </Button>
                      </Link>
                    </Grid>
                )
            )
        )
      }

    }


    renderBannerIfLoggedIn(){
      if (this.state.isLoggedIn === false){
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
            <div>
                <Header/>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        height:this.state.height+(this.state.posts.length*100)
                    }}
                >
                    {this.renderBannerIfLoggedIn()}
                    <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                        {/* Hide if below at tablet size or lower*/}
                        <Hidden smDown>
                        <Grid item style={{width:220,height:800, borderColor:'#474f97', textTransform: 'none', marginRight:20}}>
                            <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                {this.renderFilterPosts()}
                            </Grid>
                        </Grid>
                        </Hidden>
                        <Grid item xs style={{height:800, borderColor:'#474f97', textTransform: 'none'}}>
                            <Grid container style={{flexGrow:1, margin:"0 auto"}} >
                                {this.renderResultPosts(this.state.filterOptions[this.state.selectedIndex])}
                            </Grid>
                        </Grid>

                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ posts,users }) {
    return { posts,users };
}

export default connect(mapStateToProps,{getPosts,getUser})(withRouter(compose(withStyles(styles),withWidth())(Landing)));
