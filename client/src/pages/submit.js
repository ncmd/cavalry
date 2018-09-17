import React, { Component } from 'react';
import Header from '../components/header/header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Prompt } from 'react-router'
import {
    addPost,
    editSubmitTitle,
    editSubmitDescription,
    editSubmitTags,
    editSubmitObjectives,
    editClear,
} from '../redux/actions';
import Grid from "@material-ui/core/Grid";
import { Form, FormGroup, Input } from 'reactstrap';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import './submit.css';
import { googleanalytics } from '../components/analytics';

Quill.register('modules/ImageResize', ImageResize);

const bodyBlue = "linear-gradient(#1a237e, #121858)";
const objectiveButton = "linear-gradient(to right, #304ffe, #2962ff)";
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
  background: isDragging ? 'lightgreen' : 'white',

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
            path:'',
            text: '',
            postId:'',
            postTitle:'',
            postDescription:'',
            objectives: [],
            tasks: [],
            tags:'',
            postPublished: false,
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
            contentPlaceholder:'<font color="#9E9E9E"><b>Tip: List all dependencies of this objective and how to complete it</b>\n<li>Scope</li>\n<li>Reference URLs</li>\n<li>Teams Involved & Contact Information</li>\n<li>Book Titles</li>\n<li>Applications Used</li>\n<li>Pictures & Files</li>\n<li>Costs</li>\n<li>Pros & Cons</li>\n<li>Warnings</li>\n<li>Estimated Time</li>\n<li>Trends</li></font>',
            contentPlaceholderDefault:'<font color="#9E9E9E"><b>Tip: List all dependencies of this objective and how to complete it</b>\n<li>Scope</li>\n<li>Reference URLs</li>\n<li>Teams Involved & Contact Information</li>\n<li>Book Titles</li>\n<li>Applications Used</li>\n<li>Pictures & Files</li>\n<li>Costs</li>\n<li>Pros & Cons</li>\n<li>Warnings</li>\n<li>Estimated Time</li>\n<li>Trends</li></font>',
            contentClicked: false,
        };
        this.onDragEnd = this.onDragEnd.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleChangeObjectiveTitle = this.handleChangeObjectiveTitle.bind(this);
        this.handleChangeObjectiveDescription = this.handleChangeObjectiveDescription.bind(this);
        this.handleChangeTask = this.handleChangeTask.bind(this);
        this.handleChangeEditor = this.handleChangeEditor.bind(this);
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

    this.props.editSubmitObjectives(this.state.objectives)
  }
  handleChangeEditor(value) {
    this.setState({ text: value })
  }

    componentDidMount() {
        // Window Dimensions

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(){
      if (this.state.postPublished === false) {
        window.onbeforeunload = () => true
      } else {
        window.onbeforeunload = undefined
      }
    }

    clickEvent(){
      console.log("Clicked")
      if (this.state.contentClicked === false){
        this.setState({
          contentPlaceholder: '',
          contentClicked:true,
          objectiveDescription: '',
        },() => {
          console.log(this.state.contentPlaceholder)
          this.editor.content.innerHTML = this.state.contentPlaceholder
        })
      }

      if (this.state.contentClicked === true && this.state.contentPlaceholder === this.state.contentPlaceholderDefault){
        this.setState({
          contentPlaceholder: '',
          contentClicked:true,
          objectiveDescription: '',
        },() => {
          console.log(this.state.contentPlaceholder)
          this.editor.content.innerHTML = this.state.contentPlaceholder
        })
      }

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
          this.props.editSubmitTitle(this.state.postTitle);
          console.log("PROPS SUBMIT",this.props.submit)
        });

    };

    handlePostDescription = postDescription => event => {
        this.setState({
            [postDescription]: event.target.value,
        }, ()=> {
          this.validateDescription(this.state.postDescription);
          this.props.editSubmitDescription(this.state.postDescription);
          console.log("PROPS SUBMIT",this.props.submit)
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

  handleChangeObjectiveDescription (value) {
    this.setState({
        objectiveDescription: value,
    },() => {
        this.validateObjectiveDescription(this.state.objectiveDescription);

    });
  };

  // Function that updates the 'taskTitle' state values using 'onChange' event
  handleChangeTask(event) {
    this.setState({ taskTitle: event.target.value });
  }

  removeObjective(objectiveIndex) {
    console.log("this state objectives:",this.state.objectives)
    // Get static state of 'objectives'
    let prevObjectives = this.state.objectives;

    prevObjectives.map((obj,i) => {
      if (i === objectiveIndex) {
        prevObjectives.splice(objectiveIndex, 1);

        // Append a new state to Objectives with the modified array state
        this.setState({
          objectives: prevObjectives,
          objectiveItemCounter: objectiveIndex - 1,
          objectiveIndex: objectiveIndex - 1,
        });
      }

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
    googleanalytics.Cavalry_Webapp_Submit_Runbook_Runbookobjectivecreated(objectiveTitle)
    const prevObjectives = this.state.objectives;

    // Function tasks in arguments to be pushed to array
    // Creating an empty 'tasks' array so elements can be added
    // 'expanded' determines if the objective expands to show 'tasks'
    prevObjectives.push({
      title: objectiveTitle,
      description:  objectiveDescription,
      index: objectiveIndex,
    });

    // Set the State of current page of objectives
    // Increase the ObjectiveItemCounter so that it can create an index for additional objective positioning
    // Reset the objectiveTitle to blank so the previous entry does not show
    this.setState({
      objectives: prevObjectives,
      objectiveItemCounter: this.state.objectiveItemCounter + 1,
      objectiveIndex: this.state.objectiveIndex + 1,
    }, () => {
      this.props.editSubmitObjectives(this.state.objectives)
      console.log(this.props.submit)
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

          this.props.editSubmitTags(myArray)

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
          console.log("Objective Description is valid!")
      } else {
          console.log("Objective Description Still invalid...")
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
    if(this.state.tagsValid === true && this.state.postTitle !== '' && this.state.postDescription !== '' && this.state.objectives.length > 0){
      return (
        <Grid item >
            <Button style={{background:submitButton, color:'white'}} onClick={()=> this.submitPost(this.state.postTitle,this.state.postDescription, this.state.tags, this.state.objectives)}>SUBMIT</Button>
        </Grid>
      )
    } else {
      return (
        <Grid item >
            <Button disabled style={{background:'grey', textTransform: 'none',  color:'white'}} >Review</Button>
        </Grid>
      )
    }
  }

    submitPost(title,description,tags,objectives){
        console.log("Clicked Once")
        this.props.addPost(title,description,tags,objectives);
        this.setState({
          postPublished: true
        }, () => {
          googleanalytics.Cavalry_Webapp_Submit_Runbook_Userpublishedrunbook(title)
          this.props.history.push('/')
        })
    }

    editObjective(index){
      // console.log("INDEX:",index)
      this.state.objectives.map((o,i) => {
        if (index === i){
          this.setState({
            objectiveTitle: o.title,
            objectiveTitleValid:true,
            objectiveDescriptionValid:true,
            objectiveDescription: o.description
          },() => {
            this.removeObjective(index)
          })
        }
        return null
      })
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
                      <Grid container spacing={8} alignItems="center" direction="row" justify="space-between" >
                        <Grid item >
                          <Button style={{background:submitButton,color:'white'}} onClick={() => this.removeObjective(index)}>Remove</Button>
                        </Grid>
                        <Grid item >
                          <Button style={{background:submitButton,color:'white'}} onClick={() => this.editObjective(index)}>Edit</Button>
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
      if (this.state.objectiveTitleValid === true && this.state.objectiveDescriptionValid === true && this.state.objectiveDescription.length !== 0 && this.state.objectiveTitle.length !== 0){
        return (
          <Button style={{ height:30, background:objectiveButton, textTransform: 'none', color:'white', marginBottom:20}} onClick={()=> this.addObjective(this.state.objectiveTitle,this.state.objectiveDescription,this.state.objectiveIndex)} >Add Objective</Button>
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
      } else {
        return (
          <Button disabled style={{ height:30, background:'grey', textTransform: 'none', color:'white', marginBottom:20}}>Add Objective Title & Description</Button>
        )

      }
    }

    imageHandler(image, callback){
    var range = this.quillRef.getEditor().getSelection();
    var value = prompt('What is the image URL');
    if(value) {
        this.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
        }
    }

    render() {
        return (
            <div>
              <Prompt
                key='block-nav'
                when={this.state.postPublished === false}
                message='You have unsaved changes, are you sure you want to leave?'
              />
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
                    <Grid container style={{background:'#283593', flexGrow:1, margin:"0 auto", maxWidth:"63em"}} alignItems="center" direction="row" justify="center" >
                        <Grid item style={{width:'100%'}} xs>
                            <Form style={{ flexGrow:1, maxWidth:800, padding:5 ,marginLeft:'auto',marginRight:'auto'}}>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Runbook Title</b></Typography>
                                      {this.state.titleValid
                                      ?
                                      <Input valid placeholder="Subject of a problem or process" value={this.state.postTitle} onChange={this.handlePostTitle('postTitle')}/>
                                      :
                                      <Input invalid placeholder="Subject of a problem or process" value={this.state.postTitle}  onChange={this.handlePostTitle('postTitle')}/>
                                      }
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Runbook Description</b></Typography>

                                      {this.state.descriptionValid
                                      ?
                                      <Input valid type="textarea" style={{height:100}} placeholder="Why this problem or process is important to know"  value={this.state.postDescription}  onChange={this.handlePostDescription('postDescription')}/>
                                      :
                                      <Input invalid type="textarea" style={{height:100}} placeholder="Why this problem or process is important to know" value={this.props.postDescription} onChange={this.handlePostDescription('postDescription')}/>
                                      }
                                </FormGroup>
                                <FormGroup>
                                    <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Runbook Tags</b></Typography>
                                      {this.state.tagsValid
                                      ?
                                      <Input valid placeholder={"Separate each tag with ',' (comma"} value={this.state.tags} onChange={this.handlePostTags('tags')}/>
                                      :
                                      <Input invalid placeholder={"Separate each tag with ',' (comma)"} value={this.state.tags} onChange={this.handlePostTags('tags')}/>
                                      }
                                </FormGroup>

                                  <FormGroup>
                                      <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Objective Title</b></Typography>
                                        {this.state.objectiveTitleValid
                                        ?
                                        <Input valid placeholder="Step 1 on how to solve the problem or process" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')}/>
                                        :
                                        <Input invalid placeholder="Step 1 on how to solve the problem or process" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')}/>
                                        }
                                  </FormGroup>
                                  <FormGroup>
                                      <Typography variant="button" style={{color:'white', textTransform:'none'}}><b>Objective Description</b> </Typography>
                                      <ReactQuill modules={{
                                        ImageResize: {
                                              parchment: Quill.import('parchment')
                                          },
                                            toolbar: [
                                        ['bold', 'italic', 'underline','strike'],
                                        [{'list': 'ordered'}, {'list': 'bullet'}],
                                        ['link', 'image','video'],
                                        ['clean']
                                      ],
                                    }} style={{background:'white', height:500}} value={this.state.objectiveDescription} onChange={this.handleChangeObjectiveDescription} />
                                  </FormGroup>
                                  <FormGroup>
                                    {this.renderAddObjectiveButton()}
                                  </FormGroup>
                                  <FormGroup>
                                    {this.renderReviewButton()}
                                  </FormGroup>
                            </Form>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" direction="row" justify="space-between" style={{ flexGrow:1, margin:"0 auto", maxWidth:"63em", paddingTop:20}}>
                      <Typography variant={'button'} style={{color:'white', textTransform:'none'}}>You can sort the objectives by dragging and dropping the objects</Typography>
                      {this.renderObjectives()}
                    </Grid>
                </div>
            </div>
        );
    }
}
function mapStateToProps({ posts, path,submit}) {
    return { posts, path, submit };
}
export default connect(mapStateToProps,{addPost,editSubmitTitle,editSubmitDescription,editSubmitTags,editSubmitObjectives,editClear})(withRouter(Submit));
