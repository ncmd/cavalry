import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
    getPost
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
            height: window.innerHeight,
            post:[],
            objectives:[],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    // Controls Onload Windows Height Dimensions
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        console.log(this.props.location);
        this.props.getPost('/api'+this.props.location.pathname).then(() => {
              if(this.props.posts.objectives.length > 0) {
                let prevObjectives = this.state.objectives;
                console.log("Post Props Objectives:",this.props.posts.objectives)
                this.props.posts.objectives.map( r => {
                  prevObjectives.push({
                    title: r.title,
                    description: r.description,
                  })
                  this.setState({
                    objectives: prevObjectives,
                  })
                  console.log("Objectives:",prevObjectives)
                })
              }

            //   if (this.props.posts > 0 ){
            //     this.props.posts.map(r => {
            //         prevPost.push({
            //             title: r.title,
            //             description: r.description,
            //             objectives: r.objectives,
            //         });
            //         this.setState({
            //             post: prevPost,
            //         });
            //         return null
            //         console.log(this.state.post)
            //     });
            // }

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
          console.log("OOOO:",obj)
          return(
            <Grid key={obj.title}container alignItems={'stretch'} justify={'flex-start'} direction={'column'}  >
                <Grid style={{marginTop:50, marginLeft:50}} item>
                  <Typography variant={'subheading'} style={{color:'white'}}>{obj.title}</Typography>
                </Grid>
                <Grid style={{marginTop:50, marginLeft:50}} item>
                  <Typography variant={'subheading'} style={{color:'white'}}> <div dangerouslySetInnerHTML={{__html: obj.description}} /></Typography>
                </Grid>
              </Grid>
              )
        })
      )




      // if (this.state.objectives.length > 0){
        // console.log("ALL OBJECTIVES:",this.state.objectives)
        // this.state.post.objectives.map((obj, index) => {
        //   console.log("Objective",obj)
        //   return (
        //     <Grid style={{marginTop:50, marginLeft:'auto', marginRight:'auto', maxWidth:'50em'}} item>
        //       <Typography variant={'subheading'} style={{color:'white'}}>{obj.title}</Typography>
        //     </Grid>
        //   )
        // })
      // }
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
                    <Grid container style={{ height:370,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'column'} >
                      <Grid style={{marginLeft:'auto', marginRight:'auto', maxWidth:'50em'}} item>
                        <Typography variant={'display2'} style={{color:'white'}}>{this.props.posts.title}</Typography><br/>
                      </Grid>
                      <Grid style={{marginLeft:'auto', marginRight:'auto', maxWidth:'50em'}} item>
                        <Typography variant={'subheading'} style={{color:'white'}}>{this.props.posts.description}</Typography>
                      </Grid>
                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'flex-start'} justify={'flex-start'} direction={'column'}  >
                      {this.renderObjectives()}
                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ posts }) {
    return { posts };
}
export default connect(mapStateToProps, {
  getPost,
})(withRouter(Post));
