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

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            selectedIndex: 1,
            width: window.innerWidth,
            height: window.innerHeight,
            postTitle:'',
            postDescription:'',
            objectives:[],
            logged:false,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {


        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        // console.log(this.props.location);
        this.props.getPost('/api'+this.props.location.pathname).then(() => {

              this.setState({
                postTitle:this.props.posts.title,
                postDescription:this.props.posts.description,
              })

              if(this.props.posts.objectives.length > 0) {
                let prevObjectives = this.state.objectives;
                // console.log("Post Props Objectives:",this.props.posts.objectives)
                this.props.posts.objectives.map( r => {
                  prevObjectives.push({
                    title: r.title,
                    description: r.description,
                  })
                  this.setState({
                    objectives: prevObjectives,
                  })
                  // console.log("Objectives:",prevObjectives)
                  return null
                })
              }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    renderObjectives(){
      return(
        this.state.objectives.map( (obj,index) => {
          // console.log("OOOO:",obj)
          return(
            <Grid key={obj.title} style={{background:this.props.theme[0].PostsButtonBackground,border:this.props.theme[0].PostsButtonBorder,margin:0, padding:20,  borderRadius:'5px 5px 5px 5px'}} item xs={12} >

                  <Typography variant={'body2'} style={{color:this.props.theme[0].PostsTypographyTitle}}>
                    <Typography variant={'body2'} style={{background:this.props.theme[0].PrimaryLinear, width:26,height:26, borderRadius:'50%',textAlign:'center',color:'white',display:'inline-block', fontWeight:'bold'}}>{index+1}</Typography> <b>{obj.title}</b>
                  </Typography>
                  <div style={{color:this.props.theme[0].PostsTypographyDescription}} dangerouslySetInnerHTML={{__html: obj.description}} />


              </Grid>
              )
        })
      )

    }

     findAndReplace(string, target, replacement) {
     var i = 0, length = string.length;
     for (i; i < length; i++) {
      string = string.replace(target, replacement);
     }
     return string;
    }

    renderTheme(){
      if (this.props.theme.length > 0){
        return this.props.theme[0].MainBackground
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
                        background: this.renderTheme(),
                        minHeight:this.state.height
                    }}
                >
                    <Grid container style={{ background:this.props.theme[0].PostsButtonBackground ,border:this.props.theme[0].PostsButtonBorder,  margin:"0 auto", maxWidth:"63em", padding:25, borderRadius:'5px 5px 5px 5px'}} alignItems={'flex-start'} justify={'flex-start'} direction={'column'}>
                      <Grid item xs>
                        <Typography variant={'display1'} style={{color:this.props.theme[0].PostsTypographyTitle}}><b>{this.state.postTitle}</b></Typography><br/>
                      </Grid>
                      <Grid item xs>
                        <Typography variant={'subheading'} style={{color:this.props.theme[0].PostsTypographyDescription}}>{this.state.postDescription}</Typography>
                      </Grid>
                      <Grid item xs style={{paddingTop:20}}>
                        {this.props.users.logged
                          ?
                          <div>
                            <Link to={{ pathname: '/post/' + this.props.posts.id + '/'+this.findAndReplace(this.findAndReplace(this.state.postTitle,' ','-'),'\'','')+'/edit'}}>
                             <Button style={{background:"linear-gradient(to right, #ff1744, #F44336 "}}>
                               <Typography variant={'caption'} style={{color:'white'}}><b>Edit</b></Typography>
                             </Button>
                           </Link>
                           <Button style={{background:this.props.theme[0].PrimaryLinear, marginLeft:20}}><Typography variant={'caption'} style={{color:'white'}}><b>Run</b></Typography></Button>
                          </div>
                          :
                          <div></div>
                        }

                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em", paddingBottom:100 }}  alignItems={'flex-start'} justify={'flex-start'} direction={'row'}  >
                      {this.renderObjectives()}
                    </Grid>
                </div>
            </div>
        )
    }
}


function mapStateToProps({ posts,users,theme }) {
    return { posts,users,theme };
}
export default connect(mapStateToProps, {
  getPost,
})(withRouter(Post));
