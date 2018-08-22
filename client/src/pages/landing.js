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
            filterPosts:['CATEGORY', 'PLATFORM', 'SKILLS', 'COST', 'RATING'],
            anchorEl: null,
            selectedIndex: 0,
            posts:[],
            width: window.innerWidth,
            height: window.innerHeight,
            isLoggedIn: false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
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
            if (this.props.posts !== null ){
                this.props.posts.map(r => {
                    prevPosts.push({
                        id: r.id,
                        title: r.title,
                        description: r.description,
                        tags:r.tags,
                        objectives: r.objectives
                    });
                    this.setState({
                        posts: prevPosts,
                    });
                    return null
                });
            }
        });
        console.log("POSTS PROPS",this.props.posts)
        console.log("USERS PROPS",this.props.users)
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
        this.setState({ selectedIndex: index, anchorEl: null });
    };

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
                                secondary={<Typography style={{color:'#939ed5'}} variant="caption">{filter1Options[this.state.selectedIndex]}</Typography>}
                            />
                        </ListItem>
                    </List>
                    <Menu
                        id="lock-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        {filter1Options.map((filter1Options, index) => (
                            <MenuItem
                                key={filter1Options+1}
                                selected={index === this.state.selectedIndex}
                                onClick={event => this.handleMenuItemClick(event, index)}
                                style={{width:188, background:'#283593', color:'white' , margin:'-8px 0 -8px 0'}}
                            >
                                <Typography variant="caption" style={{color:'white'}}>
                                    {filter1Options}
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
            <Badge key={value+Math.random()+(Math.random())} color="primary" style={{textTransform: 'none', marginRight:5,}}>{value}</Badge>
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
    renderResultPosts(){

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
                                        <Grid item style={{marginTop:10 ,marginRight:5, overflow:"hidden", overflowX:"scroll"}}>
                                          <Grid container style={{ flexGrow:1, height:"100%", width:"100%", }}  alignItems={"center"} direction={"row"} justify={"space-between"}>
                                              <Grid style={{}} item>
                                                {this.renderTags(index)}
                                              </Grid>
                                          </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Hidden smDown>
                                <Grid item style={{ textAlign:'left',borderLeft: '2px solid rgba(0, 0, 0, 0.12)'}}>
                                    <Grid container style={{flexGrow:1}} alignItems={'flex-start'} justify={'space-between'} direction={'column'} >
                                        <Grid item>
                                            <Typography variant="subheading" style={{color:'white', marginLeft:20}}>
                                                Rating
                                            </Typography>
                                        </Grid>
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
                                {this.renderResultPosts()}
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
