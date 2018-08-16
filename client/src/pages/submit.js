import React, { Component } from 'react';
import Header from '../components/header/header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    addPost
} from '../redux/actions';
import Grid from "@material-ui/core/Grid";
import { Form, FormGroup, Input } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const submitButton = "linear-gradient(to right, #ff1744, #F44336 ";

class Submit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            postTitle:'',
            postDescription:'',
            objectives: [{title:'Identify Source Computer',description:'Identify the Computer information such as the Hostname, IP Address, Owner of Computer.'}],
            tasks: [],
            tags:'',
            tagsValid:false,
            titleValid:false,
            descriptionValid:false,
            checked: [0],
            objectiveTasks: [],
            objectiveTaskCounter: 0,
            objectiveItemCounter: 0,
            objectiveTaskItemCounter: 0,
            taskItemCounter: 0,
            objectiveTitle: '',
            taskTitle: '',
            objectiveContent: [],
            expandObjectiveState: false,
            status: null
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleChangeObjective = this.handleChangeObjective.bind(this);
        this.handleChangeTask = this.handleChangeTask.bind(this);
    }

    componentDidMount() {
        // Window Dimensions
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        clearInterval(this.interval);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handlePostTitle = postTitle => event => {
        this.setState({
            [postTitle]: event.target.value,
        },() => {
          this.validateTitle(this.state.postTitle)
        });

    };

    handlePostDescription = postDescription => event => {
        this.setState({
            [postDescription]: event.target.value,
        }, ()=> {
          this.validateDescription(this.state.postDescription);
        });

    };

    handlePostTags = tags => event => {
        this.setState({
            [tags]: event.target.value,
        }, () => {
          console.log("Validating...")
          this.validateTags(this.state.tags)
        });
    };

    // Function for expanding 'objectives' onClick
  // Changes the 'expanded' value for an objective to the opposite value
  handleExpandObjectiveClick(objectiveIndex) {
    let prevObjectives = this.state.objectives;
    prevObjectives[objectiveIndex].expanded = !prevObjectives[objectiveIndex]
      .expanded;
    this.setState({
      objectives: prevObjectives,
    });
  }

  // Function for accepting 'enter' key pressed for adding Objectives
  // Prevent default should prevent console errors when nothing is submitted
  objectiveEnter(e) {
    if (e.key === 'Enter') {
      this.addObjective(
        this.state.objectiveTitle,
        this.state.objectiveItemCounter,
      );
      this.setState({
        objectiveTitle: '',
      });
      e.preventDefault();
    }
  }

  // Function for accepting 'enter' key pressed for adding Tasks
  // User will not need to manually press + button to add a task
  // After Task is submitted to 'state', clear 'task' Textfield value to blank
  // Prevent default should prevent console errors when nothing is submitted
  taskEnter(objectiveIndex, e) {
    if (e.key === 'Enter') {
      this.addTask(objectiveIndex);
      this.setState({
        taskTitle: '',
      });
      e.preventDefault();
    }
  }

  // Function that updates the 'objectiveTitle' state values using 'onChange' event
  handleChangeObjective(event) {
    this.setState({ objectiveTitle: event.target.value });
  }

  // Function that updates the 'taskTitle' state values using 'onChange' event
  handleChangeTask(event) {
    this.setState({ taskTitle: event.target.value });
  }

  // Function renders fields of form taken from 'formFields' file
  // Uses 'lodash' to create an empty array to map using the 'formFields' lines in file; takes the 'label' and 'name' values
  // 'key' is required to make all <div>'s unique
  // 'Grid' is used for layout
  // 'Field' is from 'redux-form' to help with managing Forms, uses component RunbookField to input validation


  // Function to remove an Objective in 'objective' state at a specific Index in state
  // Arguments is 'objectiveIndex' which is the position of where in the array user would like to remove
  removeObjective(objectiveIndex) {
    // Get static state of 'objectives'
    let prevObjectives = this.state.objectives;

    // Counter is used to start the positioning
    let thisCounter = 0;

    // Use map to go through all existing objectives matching the given 'objectiveIndex'
    // If there is a match, use 'splice' to remove element in prevObjectives array
    prevObjectives.map(obj => {
      if (obj.index === objectiveIndex) {
        prevObjectives.splice(thisCounter, 1);

        // Append a new state to Objectives with the modified array state
        this.setState({
          objectives: prevObjectives,
        });
      }
      // If given objectiveIndex does not match this obj.index, increase counter by 1
      thisCounter = thisCounter + 1;

      // 'return' to prevent error 'Expected to return a value in arrow function  array-callback-return'
        return prevObjectives
    });
  }

  // Function to add a task to an 'objective' state at a specific index
  // Arguments is 'objectiveIndex' which is used to get the position where in the array user would like to add a task
  addTask(objectiveIndex) {
    // Get static state of 'objectives'
    const prevObjectives = this.state.objectives;
    // Append 'title' element to 'tasks' for the objective
    prevObjectives[objectiveIndex].tasks.push({
      title: this.state.taskTitle,
    });
    // Append a new state to Objectives with the modified array state
    this.setState({
      objectives: prevObjectives,
    });
  }

  // Adding Objective to New Runbook
  addObjective(objectiveTitle, objectiveIndex) {
    // Get Previous Objective State which should start as an empty array '[]'
    const prevObjectives = this.state.objectives;

    // Function tasks in arguments to be pushed to array
    // Creating an empty 'tasks' array so elements can be added
    // 'expanded' determines if the objective expands to show 'tasks'
    prevObjectives.push({
      title: objectiveTitle,
      index: objectiveIndex,
      tasks: [],
      expanded: false,
    });

    // Set the State of current page of objectives
    // Increase the ObjectiveItemCounter so that it can create an index for additional objective positioning
    // Reset the objectiveTitle to blank so the previous entry does not show
    this.setState({
      objectives: prevObjectives,
      objectiveItemCounter: this.state.objectiveItemCounter + 1,
      objectiveTitle: '',
    });

    this.updateWindowDimensions()

    // Now after the user clicks on 'Review' these values should be saved temporarily
    // After reviewing the Form, the 'objectives' state should be sent to back-end as normal when creating runbook
    // When user clicks on 'Review', the state should be appended temporary in redux
  }


  renderObjectives(){
    return this.state.objectives.map((obj,index) => {
      return (
        <Grid key={(Math.random()+Math.random())+index} style={{minWidth:'100%'}}>
          <FormGroup>
              <Typography variant="button" style={{color:'white'}}>Objective {index+1}</Typography>
              <Input placeholder={obj.title}  onChange={this.handlePostTitle('postTitle')}/>
          </FormGroup>
          <FormGroup>
              <Typography variant="button" style={{color:'white'}}>Objective {index+1} Description</Typography>
              <Input type="textarea" style={{height:200}} placeholder={obj.description} onChange={this.handlePostDescription('postDescription')}/>
          </FormGroup>
        </Grid>
      );
    });
  }

  renderTags(){
    return this.state.tags.map((t,index) => {
      return (
        <Grid key={(Math.random()+Math.random())+index} style={{minWidth:'100%'}}>
          <FormGroup>
              <Typography variant="button" style={{color:'white'}}>Objective {index+1}</Typography>
              <Input placeholder={t.title}  onChange={this.handlePostTitle('postTitle')}/>
          </FormGroup>
          <FormGroup>
              <Typography variant="button" style={{color:'white'}}>Objective {index+1} Description</Typography>
              <Input type="textarea" style={{height:200}} placeholder={t.description} onChange={this.handlePostDescription('postDescription')}/>
          </FormGroup>
        </Grid>
      );
    });
  }

  validateTags(tags){
      const tagRegex = /^.*[^,]$/
      console.log(tags)
      if (tagRegex.test(tags)) {
          // // console.log("Valid Email Address:",email);
          this.setState({tagsValid:true});
          var myArray = tags.split(',');
          this.setState({
            tags: myArray
          })

          console.log("Tags are valid!")
      } else {
          console.log("Still invalid...")
          this.setState({tagsValid:false})
      }
  }

  validateTitle(title){
      if (this.state.postTitle !=='') {
          // // console.log("Valid Email Address:",email);
          this.setState({titleValid:true});
          console.log("Title is valid!")
      } else {
          console.log("Still invalid...")
          this.setState({titleValid:false})
      }
  }

  validateDescription(description){
      if (this.state.postDescription !=='') {
          // // console.log("Valid Email Address:",email);
          this.setState({descriptionValid:true});
          console.log("Description is valid!")
      } else {
          console.log("Still invalid...")
          this.setState({descriptionValid:false})
      }
  }

  renderReviewButton(){
    if(this.state.tagsValid === true && this.state.postTitle !== '' && this.state.postDescription !== ''){
      return (
        <Grid item >
            <Button style={{background:submitButton, color:'white'}} onClick={()=> this.submitPost(this.state.postTitle,this.state.postDescription, this.state.tags)}>SUBMIT</Button>
        </Grid>
      )
    } else {
      return (
        <Grid item >
            <Button disabled style={{background:'grey',  color:'white'}} >Complete Form</Button>
        </Grid>
      )
    }

  }

    submitPost(title,description,tags){
        console.log("Clicked Once")
        this.props.addPost(title,description,tags);
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
                        height:this.state.height+(300*this.state.objectives.length)
                    }}
                >
                    {/* Top Section */}
                    <Grid container style={{background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems="center" direction="column" justify="center" >
                        <Grid item >
                            <Form style={{ marginTop:20, marginBottom:20, width:500}}>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Title</Typography>
                                    <Input placeholder="Malware found on user's machine"  onChange={this.handlePostTitle('postTitle')}/>
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Description</Typography>
                                    <Input type="textarea" style={{height:200}} placeholder="Received alert of malware on user's machine" onChange={this.handlePostDescription('postDescription')}/>
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Tags</Typography>
                                      {this.state.tagsValid
                                      ?
                                      <Input valid type="textarea" placeholder="Examples: malware,apt,pup; Separate each tag with ',' " onChange={this.handlePostTags('tags')}/>
                                      :
                                      <Input invalid type="textarea" placeholder="Examples: malware,apt,pup; Separate each tag with ',' " onChange={this.handlePostTags('tags')}/>
                                      }
                                </FormGroup>
                                <Grid container style={{flexGrow:1, margin:"0 auto", maxWidth:"63em"}} >
                                  {this.renderObjectives()}
                                </Grid>
                                <Grid container alignItems="center" direction="row" justify="flex-end" >
                                    <Grid item >
                                        <Button style={{ height:30, background:'#474f97', textTransform: 'none', color:'white', marginBottom:20}} onClick={()=> this.addObjective()} >Add Objective</Button>
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" direction="row" justify="space-between" >
                                    <Grid item >
                                        <Button style={{border:'2px solid black', borderColor:'#474f97', color:'white', marginRight:40}}>CANCEL</Button>
                                    </Grid>
                                    <Grid item >
                                        {this.renderReviewButton()}
                                    </Grid>
                                </Grid>
                            </Form>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ posts }) {
    return { posts };
}

export default connect(mapStateToProps,{addPost})(withRouter(Submit));
