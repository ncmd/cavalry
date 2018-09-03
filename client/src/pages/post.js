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
            filterItems:['FILTER1', 'FILTER2', 'FILTER3', 'FILTER4', 'FILTER5'],
            anchorEl: null,
            selectedIndex: 1,
            resultItems:['RESULT1', 'RESULT2', 'RESULT3', 'RESULT4', 'RESULT5', 'RESULT6', 'RESULT7', 'RESULT8'],
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

          // console.log("props.title:",this.props.posts.title)
          // console.log("props.description:",this.props.posts.description)
          // console.log("props.id:",this.props.posts.id)

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
            <Grid key={obj.title} style={{background:'white', maxWidth:'50em', margin:20}} container spacing={8} alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                <Grid style={{marginTop:30, marginLeft:50, marginRight:'auto',maxWidth:'50em'}} item>
                  <Typography variant={'headline'} style={{color:'black'}}>{obj.title}</Typography>
                </Grid>
                <Grid style={{marginTop:20, marginLeft:50, marginRight:'auto', maxWidth:'50em', marginBottom:50}} item>
                  <div dangerouslySetInnerHTML={{__html: obj.description}} />
                </Grid>
              </Grid>
              )
        })
      )

    }

    render() {
      function findAndReplace(string, target, replacement) {
       var i = 0, length = string.length;
       for (i; i < length; i++) {
        string = string.replace(target, replacement);
       }
       return string;
      }

        return (
            <div>
                <Header/>
                  <script type="text/javascript">

                </script>
                <div
                    style={{
                        flexGrow: 1,
                        justify: 'center',
                        background: bodyBlue,
                        height:this.state.height+1000
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{ height:300,background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems={'center'} justify={'center'} direction={'column'} >
                      <Grid container alignItems={'flex-start'} justify={'flex-end'} direction={'row'} >

                        <Grid item>
                             <Link to={{ pathname: '/post/' + this.props.posts.id + '/'+findAndReplace(findAndReplace(this.props.posts.title,' ','-'),'\'','')+'/edit'}}>
                          <Button style={{background:"linear-gradient(to right, #ff1744, #F44336 "}}>
                            <Typography style={{color:'white'}}>Edit</Typography>
                          </Button>
                        </Link>
                        </Grid>


                      </Grid>
                      <Grid style={{marginLeft:'auto', marginRight:'auto', maxWidth:'50em'}} item>
                        <Typography variant={'display2'} style={{color:'white'}}>{this.state.postTitle}</Typography><br/>
                      </Grid>
                      <Grid style={{marginLeft:'auto', marginRight:'auto', maxWidth:'50em'}} item>
                        <Typography variant={'subheading'} style={{color:'white'}}>{this.state.postDescription}</Typography>
                      </Grid>

                    </Grid>

                    {/* Bottom Section */}
                    <Grid container style={{ height:1400,background:'#283593',borderColor:'#474f97', flexGrow:1, marginLeft:'auto', marginRight:'auto', marginTop: 20, maxWidth:"63em"}}  alignItems={'center'} justify={'flex-start'} direction={'column'}  >
                      {this.renderObjectives()}
                    </Grid>
                </div>
            </div>
        );
    }
}


function mapStateToProps({ posts,users }) {
    return { posts,users };
}
export default connect(mapStateToProps, {
  getPost,
})(withRouter(Post));
