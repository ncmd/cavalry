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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { exec, init } from 'pell'
import 'pell/dist/pell.css'
import IndentIcon from '@material-ui/icons/FormatIndentIncrease';
import OutdentIcon from '@material-ui/icons/FormatIndentDecrease';

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const submitButton = "linear-gradient(to right, #ff1744, #F44336 ";


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  width: '100%',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: '100%',
});

class Submit extends Component {

    constructor(props) {
        super(props);
        this.state = {
           html: null,
            width: window.innerWidth,
            height: window.innerHeight,
            postTitle:'',
            postDescription:'',
            objectives: [],
            tasks: [],
            tags:'',
            tagsValid:false,
            titleValid:false,
            descriptionValid:false,
            objectiveTitleValid:false,
            objectiveDescriptionValid:false,
            checked: [0],
            objectiveTitle: '',
            objectiveDescription: '',
            objectiveIndex:0,
            expandObjectiveState: false,
            status: null,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleChangeObjectiveTitle = this.handleChangeObjectiveTitle.bind(this);
        this.handleChangeObjectiveDescription = this.handleChangeObjectiveDescription.bind(this);
        this.handleChangeTask = this.handleChangeTask.bind(this);
    }

    onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const objectives = reorder(
      this.state.objectives,
      result.source.index,
      result.destination.index
    );

    this.setState({
      objectives,
    });
  }

    componentDidMount() {
        // Window Dimensions
        this.editor = init({
          element: document.getElementById('editor'),
          value:'test?',
          onChange: objectiveDescription => this.setState({ objectiveDescription }, () => {
          this.validateObjectiveDescription(this.state.objectiveDescription)
          }),
          styleWithCSS: false,
          actions: [
                'bold',
                'olist',
                'ulist',
                'underline',
                {
                  name: 'image',
                  result: () => {
                    const url = window.prompt('Enter the image URL (Limited to Height-800px Width-800px)')
                    if (url) exec('insertImage', url)
                  }
                },
                {
                  name: 'outdent',
                  title: 'Outdent',
                  icon: '⬅️',
                  result: () => { exec('outdent')}
                },
                {
                  name: 'indent',
                  title: 'Indent',
                  icon: '➡️',
                  result: () => { exec('indent')}
                },
                {
                  name: 'link',
                  result: () => {
                    const url = window.prompt('Enter the link URL')
                    if (url) exec('createLink', url)
                  }
                }
              ],
              classes: {
                actionbar: 'pell-actionbar-custom-name',
                button: 'pell-button-custom-name',
                content: 'pell-content-custom-name',
                selected: 'pell-button-selected-custom-name'
              },
        })
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
          console.log("Handle Post Description",this.state.postDescription)
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

  handleChangeObjectiveTitle = objectiveTitle => event => {
    this.setState({
        [objectiveTitle]: event.target.value,
    },() => {
      this.validateObjectiveTitle(this.state.objectiveTitle);
    });
  };

  handleChangeObjectiveDescription = objectiveDescription => event => {
    this.setState({
        [objectiveDescription]: event.target.value,
    },() => {
        this.validateObjectiveTitle(this.state.objectiveDescription);
    });
  };

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
  addObjective(objectiveTitle, objectiveDescription, objectiveIndex) {
    // Get Previous Objective State which should start as an empty array '[]'
    const prevObjectives = this.state.objectives;

    // Function tasks in arguments to be pushed to array
    // Creating an empty 'tasks' array so elements can be added
    // 'expanded' determines if the objective expands to show 'tasks'
    prevObjectives.push({
      title: objectiveTitle,
      description:  objectiveDescription,
      index: objectiveIndex,
      pictures:[],
      expanded: false,
    });

    // Set the State of current page of objectives
    // Increase the ObjectiveItemCounter so that it can create an index for additional objective positioning
    // Reset the objectiveTitle to blank so the previous entry does not show
    this.setState({
      objectives: prevObjectives,
      objectiveItemCounter: this.state.objectiveItemCounter + 1,
      objectiveIndex: this.state.objectiveIndex + 1,
    }, () => {
      this.setState({
        objectiveTitle: '',
        objectiveTitleValid:false,
        objectiveDescription: '',
      })
    });

    this.updateWindowDimensions()

    // Now after the user clicks on 'Review' these values should be saved temporarily
    // After reviewing the Form, the 'objectives' state should be sent to back-end as normal when creating runbook
    // When user clicks on 'Review', the state should be appended temporary in redux
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
  validateObjectiveTitle(title){
      if (this.state.objectiveTitle !=='') {
          // // console.log("Valid Email Address:",email);
          this.setState({objectiveTitleValid:true});
          console.log("Objective Title is valid!")
      } else {
          console.log("Objective Title Still invalid...")
          this.setState({objectiveTitleValid:false})
      }
  }
  validateObjectiveDescription(description){
      if (this.state.objectiveDescription !=='') {
          // // console.log("Valid Email Address:",email);
          this.setState({objectiveDescriptionValid:true});
          console.log("Objective Title is valid!")
      } else {
          console.log("Objective Title Still invalid...")
          this.setState({objectiveDescriptionValid:false})
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
            <Button style={{background:submitButton, color:'white'}} onClick={()=> this.submitPost(this.state.postTitle,this.state.postDescription, this.state.tags, this.state.objectives)}>SUBMIT</Button>
        </Grid>
      )
    } else {
      return (
        <Grid item >
            <Button disabled style={{background:'grey',  color:'white'}} >Review</Button>
        </Grid>
      )
    }
  }

    submitPost(title,description,tags,objectives){
        console.log("Clicked Once")
        this.props.addPost(title,description,tags,objectives);
    }

    renderObjectives(){
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.objectives.map((obj, index) => (

                <Draggable key={obj.title} draggableId={obj.title+1} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                        <Typography style={{color:'black'}}>Objective {index+1}</Typography>
                        <Typography style={{color:'black'}}>Title: {obj.title}</Typography>
                        Description: <div dangerouslySetInnerHTML={{__html: obj.description}} />
                      <Grid container alignItems="center" direction="row" justify="flex-end" >
                            <Grid item >
                              <Button style={{background:submitButton,color:'white'}} onClick={() => this.removeObjective(obj.index)}>Remove Objective</Button>
                            </Grid>
                        </Grid>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      )
    }

    renderAddObjectiveButton(){
      if (this.state.objectiveTitleValid === true && this.state.objectiveDescriptionValid === true){
        return (
          <Button style={{ height:30, background:'#474f97', textTransform: 'none', color:'white', marginBottom:20}} onClick={()=> this.addObjective(this.state.objectiveTitle,this.state.objectiveDescription,this.state.objectiveIndex)} >Add Objective</Button>
        )
      } else if (this.state.objectiveTitleValid === false && this.state.objectiveDescriptionValid === false){
        return (
          <Button disabled style={{ height:30, background:'grey', textTransform: 'none', color:'white', marginBottom:20}}>Add Objective Title & Description</Button>
        )
      } else if (this.state.objectiveTitleValid === false && this.state.objectiveDescriptionValid === true){
        return (
          <Button disabled style={{ height:30, background:'grey', textTransform: 'none', color:'white', marginBottom:20}}>Add Objective Title</Button>
        )
      } else if (this.state.objectiveTitleValid === true && this.state.objectiveDescriptionValid === false){
        return (
          <Button disabled style={{ height:30, background:'grey', textTransform: 'none', color:'white', marginBottom:20}}>Add Objective Description</Button>
        )
      }
    }

    render() {

      // var placeholderObjDescription = " ----------Bullet Points----------\n - Hostname\n\n ------------New Line------------\n line1<space><space><enter> \n line2\n\n --------------Link--------------\n [Link to Google](https://www.google.com)\n\n -------------Tables-------------\n | Column1 | Column2 |\n | row | ✔ |"
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
                    <Grid container style={{background:'#283593',borderColor:'#474f97', flexGrow:1, margin:"0 auto"}} alignItems="center" direction="column" justify="center" >
                        <Grid item>
                            <Form style={{ marginTop:20, marginBottom:20,flexGrow:1, width:800}}>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Title</Typography>
                                      {this.state.titleValid
                                      ?
                                      <Input valid placeholder="Malware found on user's machine"  onChange={this.handlePostTitle('postTitle')}/>
                                      :
                                      <Input invalid placeholder="Malware found on user's machine"  onChange={this.handlePostTitle('postTitle')}/>
                                      }
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Description</Typography>

                                      {this.state.descriptionValid
                                      ?
                                      <Input valid type="textarea" style={{height:100}} placeholder="Received alert of malware on user's machine" onChange={this.handlePostDescription('postDescription')}/>
                                      :
                                      <Input invalid type="textarea" style={{height:100}} placeholder="Received alert of malware on user's machine" onChange={this.handlePostDescription('postDescription')}/>
                                      }
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white'}}>Tags</Typography>
                                      {this.state.tagsValid
                                      ?
                                      <Input valid type="textarea" placeholder={"Separate each tag with ',' (comma)\nExample: malware,apt,pup;"} onChange={this.handlePostTags('tags')}/>
                                      :
                                      <Input invalid type="textarea" placeholder={"Separate each tag with ',' (comma)\nExample: malware,apt,pup"} onChange={this.handlePostTags('tags')}/>
                                      }
                                </FormGroup>

                                  <FormGroup>
                                      <Typography variant="button" style={{color:'white'}}>Objective</Typography>
                                        {this.state.objectiveTitleValid
                                        ?
                                        <Input valid placeholder="Identify Source Computer" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')}/>
                                        :
                                        <Input invalid placeholder="Identify Source Computer" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')}/>
                                        }
                                  </FormGroup>
                                  <FormGroup>
                                      <Typography variant="button" style={{color:'white'}}>Objective Description </Typography>
                                      <div id="editor" className="pell" style={{width:'100%'}}/>
                                  </FormGroup>

                                <Grid container alignItems="center" direction="row" justify="flex-end" >
                                    <Grid item >
                                        {this.renderAddObjectiveButton()}
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" direction="row" justify="space-between" >
                                    <Grid item >
                                        <Button style={{border:'2px solid black', borderColor:'#474f97', color:'white', marginRight:40}}>DISCARD</Button>
                                    </Grid>
                                    <Grid item >
                                        <Button style={{border:'2px solid black', borderColor:'#474f97', color:'white', marginRight:40}}>SAVE</Button>
                                    </Grid>
                                    <Grid item >
                                        {this.renderReviewButton()}
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" direction="row" justify="space-between" style={{marginTop:20}}>
                                {this.renderObjectives()}
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
