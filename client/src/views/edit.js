import React, { Component } from 'react';
import Header from '../components/header/header';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Prompt } from 'react-router'
import {
  updatePost,
  editSubmitTitle,
  editSubmitDescription,
  editSubmitTags,
  editSubmitObjectives,
  editSubmitDepartment,
  editClear,
  lightThemeLoad
} from '../redux/actions';
import { auth } from '../components/firebase';
import Grid from "@material-ui/core/Grid";
import { Form, FormGroup, Input } from 'reactstrap';
import Button from '@material-ui/core/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import './edit.css';
import { googleanalytics } from '../components/analytics';
// import Dialog from '@material-ui/core/Dialog';
// import Slide from '@material-ui/core/Slide';
import Select from 'react-select';
// import Octicon, {ScreenFull} from '@githubprimer/octicons-react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

Quill.register('modules/ImageResize', ImageResize);

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
  borderRadius: '5px 5px 5px 5px',
  border: '1px solid #ced4da',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: '100%',
  borderRadius: '5px 5px 5px 5px',
  border: '1px solid #ced4da',
});

class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      html: null,
      width: window.innerWidth,
      height: window.innerHeight,
      path: '',
      text: '',
      postAuthor: '',
      postId: '',
      postTitle: '',
      postDescription: '',
      objectives: [],
      tasks: [],
      tags: '',
      taglength: 0,
      postPublished: false,
      tagsValid: false,
      titleValid: false,
      descriptionValid: false,
      objectiveTitleValid: false,
      objectiveDescriptionValid: false,
      checked: [0],
      objectiveTitle: '',
      objectiveDescription: '',
      objectiveIndex: 0,
      objectiveDepartment: 'any',
      expandObjectiveState: false,
      status: null,
      contentPlaceholder: '<font color="#9E9E9E"><b>Tip: List all dependencies of this objective and how to complete it</b>\n<li>Scope</li>\n<li>Reference URLs</li>\n<li>Teams Involved & Contact Information</li>\n<li>Book Titles</li>\n<li>Applications Used</li>\n<li>Pictures & Files</li>\n<li>Costs</li>\n<li>Pros & Cons</li>\n<li>Warnings</li>\n<li>Estimated Time</li>\n<li>Trends</li></font>',
      contentPlaceholderDefault: '<font color="#9E9E9E"><b>Tip: List all dependencies of this objective and how to complete it</b>\n<li>Scope</li>\n<li>Reference URLs</li>\n<li>Teams Involved & Contact Information</li>\n<li>Book Titles</li>\n<li>Applications Used</li>\n<li>Pictures & Files</li>\n<li>Costs</li>\n<li>Pros & Cons</li>\n<li>Warnings</li>\n<li>Estimated Time</li>\n<li>Trends</li></font>',
      contentClicked: false,
      open: false,
      selectValueOptions: [{ value: "any", label: "any" }, { value: "legal", label: "legal" }, { value: "security", label: "security" }],
      selectValue: [],
      panelCollapsed: false,
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

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  CustomToolbar() {
    return (
      <div id="toolbar" style={{ background: this.props.theme[0].PostsButtonBackground }}>
        <select className="ql-header" defaultValue={""} onChange={e => e.persist()} >
          <option value="1"></option>
          <option value="2"></option>
          <option value=""></option>
        </select>
        <button className="ql-bold"></button>
        <button className="ql-list" value="bullet" />
        <button className="ql-list" value="ordered" />
        <button className="ql-link" />
        <button className="ql-image" />
      </div>
    )
  }

  handleChangeEditor(value) {
    this.setState({ text: value })
  }

  componentDidMount() {
    this.renderTheme()
    // Window Dimensions
    if (this.props.users.logged === false || this.props.users.logged === undefined) {
      this.setState({
        postPublished: true
      }, () => {
        this.props.history.push("/")
      })

    } else {
      // console.log("User ")
    }

    console.log("Props Posts", this.props.posts)
    this.setState({
      path: this.props.location.pathname,
      postAuthor: this.props.posts.author,
      postId: this.props.posts.id,
      postTitle: this.props.posts.title,
      postDescription: this.props.posts.description,
      objectives: this.props.posts.objectives,
      tags: this.props.posts.tags,
      tagsValid: true,
      titleValid: true,
      descriptionValid: true,
      objectiveTitleValid: false,
      objectiveDescriptionValid: false,
    })

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate() {
    if (this.state.postPublished === false) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
    }
  }

  clickEvent() {
    // console.log("Clicked")
    if (this.state.contentClicked === false) {
      this.setState({
        contentPlaceholder: '',
        contentClicked: true,
        objectiveDescription: '',
      }, () => {

        this.editor.content.innerHTML = this.state.contentPlaceholder
      })
    }

    if (this.state.contentClicked === true && this.state.contentPlaceholder === this.state.contentPlaceholderDefault) {
      this.setState({
        contentPlaceholder: '',
        contentClicked: true,
        objectiveDescription: '',
      }, () => {

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
    }, () => {
      this.validateTitle(this.state.postTitle)
      this.props.editSubmitTitle(this.state.postTitle);
    });

  };

  handlePostDescription = postDescription => event => {
    this.setState({
      [postDescription]: event.target.value,
    }, () => {
      this.validateDescription(this.state.postDescription);
      this.props.editSubmitDescription(this.state.postDescription);
    });

  };

  handlePostTags = tags => event => {
    this.setState({
      [tags]: event.target.value,
    }, () => {
      // console.log("Validating...")
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
    }, () => {
      this.validateObjectiveTitle(this.state.objectiveTitle);
    });
  };

  handleChangeObjectiveDescription(value) {
    this.setState({
      objectiveDescription: value,
    });
  };

  // Function that updates the 'taskTitle' state values using 'onChange' event
  handleChangeTask(event) {
    this.setState({ taskTitle: event.target.value });
  }

  removeObjective(objectiveIndex) {
    // console.log("this state objectives:",this.state.objectives)
    // Get static state of 'objectives'
    let prevObjectives = this.state.objectives;

    prevObjectives.map((obj, i) => {
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
  addObjective(objectiveTitle, objectiveDescription, objectiveIndex, objectiveDepartment) {
    // Get Previous Objective State which should start as an empty array '[]'
    googleanalytics.Cavalry_Webapp_Submit_Runbook_Runbookobjectivecreated(objectiveTitle)
    const prevObjectives = this.state.objectives;

    // Function tasks in arguments to be pushed to array
    // Creating an empty 'tasks' array so elements can be added
    // 'expanded' determines if the objective expands to show 'tasks'
    prevObjectives.push({
      title: objectiveTitle,
      description: objectiveDescription,
      index: objectiveIndex,
      department: objectiveDepartment,
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
      // console.log(this.props.submit)
      this.setState({
        objectiveTitle: '',
        objectiveTitleValid: false,
        objectiveDescription: '',
      })
    });

    this.updateWindowDimensions()

    // Now after the user clicks on 'Review' these values should be saved temporarily
    // After reviewing the Form, the 'objectives' state should be sent to back-end as normal when creating runbook
    // When user clicks on 'Review', the state should be appended temporary in redux
  }

  renderTags() {
    return this.state.tags.map((t, index) => {
      return (
        <Grid key={(Math.random() + Math.random()) + index} style={{ minWidth: '100%' }}>
          <FormGroup>
            <div style={{ color: 'white' }}>Objective {index + 1}</div>
            <Input placeholder={t.title} onChange={this.handlePostTitle('postTitle')} />
          </FormGroup>
          <FormGroup>
            <div style={{ color: 'white' }}>Objective {index + 1} Description</div>
            <Input type="textarea" style={{ height: 200 }} placeholder={t.description} onChange={this.handlePostDescription('postDescription')} />
          </FormGroup>
        </Grid>
      );
    });
  }

  validateTags(tags) {
    const tagRegex = /^.*[^,]$/
    // console.log(tags)
    if (tagRegex.test(tags)) {
      // // console.log("Valid Email Address:",email);
      var myArray = tags.split(',');
      this.setState({ taglength: myArray.length })
      if (myArray.length <= 5) {
        this.setState({ tagsValid: true });
        this.setState({
          tags: myArray
        })
      }
      this.props.editSubmitTags(myArray)
    } else {
      this.setState({ tagsValid: false })
    }
  }

  validateTitle(title) {
    if (this.state.postTitle !== '' && this.state.postTitle.length <= 55) {
      this.setState({ titleValid: true });
    } else {
      this.setState({ titleValid: false })
    }
  }
  validateObjectiveTitle(title) {
    if (this.state.objectiveTitle !== '') {
      // // console.log("Valid Email Address:",email);
      this.setState({ objectiveTitleValid: true });
      // console.log("Objective Title is valid!")
    } else {
      // console.log("Objective Title Still invalid...")
      this.setState({ objectiveTitleValid: false })
    }
  }
  validateObjectiveDescription(description) {
    if (this.state.objectiveDescription !== '') {
      // // console.log("Valid Email Address:",email);
      this.setState({ objectiveDescriptionValid: true });
      // console.log("Objective Description is valid!")
    } else {
      // console.log("Objective Description Still invalid...")
      this.setState({ objectiveDescriptionValid: false })
    }
  }

  validateDescription(description) {
    if (this.state.postDescription !== '' && this.state.postDescription.length <= 140) {
      // // console.log("Valid Email Address:",email);
      this.setState({ descriptionValid: true });
      // console.log("Description is valid!")
    } else {
      // console.log("Still invalid...")
      this.setState({ descriptionValid: false })
    }
  }

  renderReviewButton() {
    if (this.state.tagsValid === true && this.state.postTitle !== '' && this.state.postDescription !== '' && this.state.objectives.length > 0) {
      return (
        <Grid item >
          <Button style={{ background: this.props.theme[0].PrimaryLinear, textTransform: 'none', color: 'white', float: 'right', height: 35, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} onClick={() =>
            this.updatePost(
              this.state.postAuthor,
              this.state.postId,
              this.state.postTitle,
              this.state.postDescription,
              this.state.tags,
              this.state.objectives)}><b>Publish</b>
          </Button>
        </Grid>
      )
    } else if (this.state.tagsValid === true && this.state.postTitle !== '' && this.state.postDescription !== '' && this.state.objectives.length === 0) {
      return (
        <Grid item >
          <Button disabled style={{ background: this.props.theme[0].DisabledBackground, textTransform: 'none', color: this.props.theme[0].DisabledText, float: 'right', height: 35, letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><div style={{ verticalAlign: 'middle' }}><b>Add at least 1 Objective</b></div></Button>
        </Grid>
      )
    }
    else {
      return (
        <Grid item >
          <Button disabled style={{ background: this.props.theme[0].DisabledBackground, textTransform: 'none', color: this.props.theme[0].DisabledText, float: 'right', height: 35, letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><div style={{ verticalAlign: 'middle' }}><b>Fill out Runbook Details</b></div></Button>
        </Grid>
      )
    }
  }

  updatePost(author, id, title, description, tags, objectives) {
    // console.log("Clicked Once")
    this.props.updatePost(author, id, title, description, tags, objectives);
    this.setState({
      postPublished: true
    }, () => {
      googleanalytics.Cavalry_Webapp_Submit_Runbook_Userpublishedrunbook(title)
      this.props.history.push('/')
    })
  }

  editObjective(index) {
    // console.log("INDEX:",index)
    this.state.objectives.map((o, i) => {
      if (index === i) {
        this.setState({
          objectiveTitle: o.title,
          objectiveTitleValid: true,
          objectiveDescriptionValid: true,
          objectiveDescription: o.description
        }, () => {
          this.removeObjective(index)
        })
      }
      return null
    })
  }

  renderObjectives() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.objectives.map((obj, index) => (
                <Draggable key={obj.title} draggableId={obj.title + 1} index={index}>
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
                      <Accordion multiple={true}>
                        <AccordionTab key={obj.title} header={obj.title}>
                          <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: obj.description }} />
                          <Grid container spacing={8} alignItems="center" direction="row" justify="space-between" style={{ paddingTop: 5 }}>
                            <Grid key={obj.department + Math.random() + (Math.random())} item >
                              <span style={{ background: this.props.theme[0].PostsTagsBackground, borderRadius: 5, textAlign: 'center', color: 'white', display: 'inline-block', fontWeight: 'bold', paddingLeft: 10, paddingRight: 10, marginRight: 5 }}>
                                <div style={{ color: 'white', letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><b>{obj.department}</b></div>
                              </span>
                            </Grid>
                          </Grid>
                        </AccordionTab>
                      </Accordion>
                      <Grid container alignItems="center" direction="row" justify="space-between" style={{ marginTop: 8 }}>
                        <Grid item >
                          <Button style={{ background: 'transparent', border: '1px solid #3d63ff' }} onClick={() => this.removeObjective(index)}>
                            <div style={{ color: "#3d63ff", textTransform: 'none', letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}   >
                              <b>Remove</b>
                            </div></Button>
                        </Grid>
                        <Grid item >
                          <Button style={{ background: this.props.theme[0].PrimaryLinear, border: this.props.theme[0].PrimaryBorder }} onClick={() => this.editObjective(index)}><div style={{ color: 'white', textTransform: 'none', letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><b>Edit</b></div></Button>
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

  renderAddObjectiveButton() {
    if (this.state.objectiveTitleValid === true && this.state.objectiveTitle.length !== 0) {
      return (
        <Button style={{ border: this.props.theme[0].PrimaryBorder, height: 30, background: this.props.theme[0].PrimaryLinear, textTransform: 'none', color: 'white', letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }} onClick={() => this.addObjective(this.state.objectiveTitle, this.state.objectiveDescription, this.state.objectiveIndex, this.state.objectiveDepartment)}><b>Add Objective</b></Button>
      )
    } else {
      return (
        <Button disabled style={{ height: 30, background: this.props.theme[0].DisabledBackground, textTransform: 'none', color: this.props.theme[0].DisabledText, letterSpacing: '-0.5px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><b>Add Objective Title</b></Button>
      )
    }
  }

  imageHandler = (image, callback) => {
    var range = this.quillRef.getSelection().index;
    var value = prompt('What is the image URL');
    if (value) {
      this.quillRef.getEditor().insertEmbed(range.index, 'image', value, "user");
    }
  }

  findAndReplace = (string, target, replacement) => {
    var i = 0, length = string.length;
    for (i; i < length; i++) {
      string = string.replace(target, replacement);
    }
    return string;
  }

  selectLocalImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        // this.saveToServer(file);
        console.log("file", file)

        var promise = new Promise(function (resolve, reject) {
          resolve(auth.uploadImageForPost(file, "/posts/submit/" + file.name));
        })

        promise.then(() => {
          console.log("Completed uploadImageForPost")
          var promise = new Promise(function (resolve, reject) {
            resolve(auth.getImageUrl("/posts/submit/" + file.name));
          })
          promise.then((url) => {
            console.log("Completed getImageUrl", url)
            this.insertToEditor(url)
          })

        })
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  selectFullScreen = () => {
    this.setState({ open: !this.state.open })
  }


  insertToEditor = (url) => {
    // push image url to rich editor.
    const range = this.quillRef.getEditor().getSelection();
    // this.quillRef.insertEmbed(range.index, 'image', url);
    this.quillRef.getEditor().insertEmbed(range.index, 'image', url);
  }

  // // var customButton = document.querySelector('.ql-omega');
  omegafullscreen = () => {
    this.setState({ open: !this.state.open })
    // this.quillRef.getEditor().format('custom', 'test');
    // if (screenfull.enabled) {
    //   console.log('requesting fullscreen');
    //   screenfull.request();
    // } else {
    //   console.log('Screenfull not enabled');
    // }
  }

  renderSelect() {
    return (
      <Select
        defaultValue={this.state.selectValueOptions[0]}
        name="colors"
        options={this.state.selectValueOptions}
        className="basic-single"
        isClearable={false}
        classNamePrefix="select"
        onChange={this.handleChangeSelect('objectiveDepartment')}
      />
    )
  }


  handleChangeSelect = objectiveDepartment => (event) => {
    this.setState({
      [objectiveDepartment]: event.value,
    }, () => {
      this.props.editSubmitDepartment(event.value)
    })

  }

  modules = {
    ImageResize: {
      parchment: Quill.import('parchment')
    },
    toolbar: {
      container: "#toolbar",
      handlers: {
        'image': this.selectLocalImage,
        "fullscreen": this.selectFullScreen,
      }
    },
  }

  modulesorg = {
    ImageResize: {
      parchment: Quill.import('parchment')
    },
    toolbar: {
      container: [['bold', 'italic', 'underline', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['fullscreen']],
      handlers: {
        'image': this.selectLocalImage,
        "fullscreen": this.selectFullScreen,
      }
    },
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
      <div>
        {this.props.theme.length > 0 &&
          <div>
            <style>{'body { background-color:' + this.renderTheme() + ' }'}</style>
            <Prompt
              key='block-nav'
              when={this.state.postPublished === false}
              message='You have unsaved changes, are you sure you want to leave?'
            />
            <Header />
            <div
              style={{
                flexGrow: 1,
                justify: 'center',
                background: this.renderTheme(),
                height: this.state.height + (206 * this.state.objectives.length),
                paddingTop: 24,
                marginTop: 48,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              {/* Top Section */}
              <div style={{ color: this.props.theme[0].PostsTypographyTitle, letterSpacing: '-0.5px', fontSize: '21px', fontWeight: 300, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                <Grid container style={{ background: "transparent", flexGrow: 1, margin: "0 auto", maxWidth: 800 }} alignItems="center" direction="row" justify="center" >
                  <Grid item style={{ width: '100%' }} xs>
                    <b>Editing playbook</b>
                  </Grid>
                </Grid>
              </div>
              <div style={{ marginBottom: 20, marginTop: 20 }}>
                <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, flexGrow: 1, margin: "0 auto", maxWidth: 800 }} alignItems="center" direction="row" justify="center" >
                  <Grid item style={{ width: '100%', margin: 16 }} xs>
                    <Form style={{ flexGrow: 1, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
                      <Grid container style={{ flexGrow: 1, margin: "0 auto" }} direction={'row'} justify={'flex-start'} alignItems={'center'}>
                        <Grid item xs={10}>
                          <FormGroup>
                            {this.state.titleValid
                              ?
                              <Input style={{ height: 35, boxShadow: 'none' }} placeholder="Title" value={this.state.postTitle} onChange={this.handlePostTitle('postTitle')} />
                              :
                              <Input style={{ height: 35, boxShadow: 'none' }} invalid placeholder="Title" value={this.state.postTitle} onChange={this.handlePostTitle('postTitle')} />
                            }
                          </FormGroup>
                        </Grid>
                        <Grid item xs style={{ marginLeft: 5 }}>
                          <div style={{ color: this.props.theme[0].PostsTypographyTitle, textAlign: 'right', float: 'right', verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                            {this.state.postTitle.length}/55
                      </div>
                        </Grid>
                      </Grid>
                      <Grid container style={{ flexGrow: 1, margin: "0 auto", marginBottom: 8, height: "auto !important" }} direction={'row'} justify={'flex-start'} alignItems={'center'}>
                        <Grid item xs={10} style={{ height: "auto !important" }}>
                          <FormGroup style={{ margin: 0, height: "auto !important" }}>
                            {this.state.descriptionValid
                              ?
                              <Input type="textarea" style={{ minHeight: 40, height: "auto !important", boxShadow: 'none', overflow: 'hidden' }} placeholder="Description" value={this.state.postDescription} onChange={this.handlePostDescription('postDescription')} />
                              :
                              <Input invalid type="textarea" style={{ minHeight: 40, height: "auto !important", boxShadow: 'none', overflow: 'hidden' }} placeholder="Description" value={this.props.postDescription} onChange={this.handlePostDescription('postDescription')} />
                            }
                          </FormGroup>
                        </Grid>
                        <Grid item xs style={{ marginLeft: 5 }}>
                          <div style={{ color: this.props.theme[0].PostsTypographyTitle, textAlign: 'right', float: 'right', verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                            {this.state.postDescription.length}/140
                      </div>
                        </Grid>
                      </Grid>

                      <FormGroup style={{ margin: 0 }}>
                        <Grid container style={{ flexGrow: 1, margin: "0 auto" }} direction={'row'} justify={'flex-start'} alignItems={'center'}>
                          <Grid item xs={10}>
                            {this.state.tagsValid
                              ?
                              <Input style={{ height: 35, boxShadow: 'none' }} placeholder={"Tags"} value={this.state.tags} onChange={this.handlePostTags('tags')} />
                              :
                              <Input style={{ height: 35, boxShadow: 'none' }} invalid placeholder={"Tags"} value={this.state.tags} onChange={this.handlePostTags('tags')} />
                            }

                          </Grid>
                          <Grid item xs style={{ marginLeft: 5 }}>
                            <div style={{ color: this.props.theme[0].PostsTypographyTitle, ttextAlign: 'right', float: 'right', verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                              {this.state.taglength}/5
                                    </div>
                          </Grid>
                        </Grid>
                        <div style={{ marginTop: 5, color: this.props.theme[0].PostsTypographyTitle, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>Separate each Tag with a comma ( Ex. security,legal <span aria-label="emoji" role="img">✔️</span> ); no trailing commas ( Ex. security,legal, <span aria-label="emoji" role="img">❌</span> )</div>
                      </FormGroup>
                    </Form>
                  </Grid>
                </Grid>
              </div>
              <div style={{ color: this.props.theme[0].PostsTypographyTitle, letterSpacing: '-0.5px', fontSize: '21px', fontWeight: 300, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                <Grid container style={{ background: "transparent", flexGrow: 1, margin: "0 auto", maxWidth: 800 }} alignItems="center" direction="row" justify="center" >
                  <Grid item style={{ width: '100%' }} xs>
                    <b>Objectives</b>
                  </Grid>
                </Grid>
              </div>
              <div style={{ paddingTop: 20 }}>
                <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, flexGrow: 1, margin: "0 auto", maxWidth: 800 }} alignItems="center" direction="row" justify="center" >
                  <Grid item style={{ width: '100%', margin: 16 }} xs>
                    <Form style={{ flexGrow: 1, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
                      <FormGroup >
                        {this.state.objectiveTitleValid
                          ?
                          <Input style={{ height: 35, boxShadow: 'none' }} placeholder="Objective Title" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')} />
                          :
                          <Input style={{ height: 35, boxShadow: 'none' }} invalid placeholder="Objective Title" value={this.state.objectiveTitle} onChange={this.handleChangeObjectiveTitle('objectiveTitle')} />
                        }
                      </FormGroup>
                      <FormGroup>
                        {this.renderSelect()}
                        <div style={{ marginTop: 5, color: this.props.theme[0].PostsTypographyTitle, letterSpacing: '-0.5px', fontSize: '14px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>This is the ideal department you want to assign this objective.</div>
                      </FormGroup>
                      <FormGroup>
                        <div className="text-editor">
                          {this.CustomToolbar()}
                          <ReactQuill
                            ref={(el) => this.quillRef = el}
                            placeholder={"Text (optional)"}
                            modules={this.modules}
                            style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius }}
                            value={this.state.objectiveDescription}
                            onChange={this.handleChangeObjectiveDescription}
                          />
                        </div>
                      </FormGroup>
                      <FormGroup style={{ marginBottom: 0 }}>
                        <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, flexGrow: 1, margin: "0 auto", maxWidth: "63em" }} alignItems="flex-start" direction="row" justify="space-between" >
                          <Grid item style={{ width: '100%' }} xs>
                            {this.renderAddObjectiveButton()}
                          </Grid>
                          <Grid item style={{ width: '100%' }} xs>
                            {this.renderReviewButton()}
                          </Grid>
                        </Grid>
                      </FormGroup>
                    </Form>
                  </Grid>
                </Grid>
              </div>
              <Grid container alignItems="center" direction="row" justify="space-between" style={{ flexGrow: 1, margin: "0 auto", maxWidth: 800, paddingTop: 20 }}>
                <div style={{ color: this.props.theme[0].PostsTypographyTitle, letterSpacing: '-0.5px', fontSize: '21px', marginBottom: 20, fontWeight: 300, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                  <Grid container style={{ background: "transparent", flexGrow: 1, margin: "0 auto", maxWidth: 800 }} alignItems="center" direction="row" justify="center" >
                    <Grid item style={{ width: '100%' }} xs>
                      <b>Preview:</b> You can sort the order by dragging and dropping the objective
                    </Grid>
                  </Grid>
                </div>
                {this.renderObjectives()}
              </Grid>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps({ users, posts, account, path, submit, theme }) {
  return {
    users,
    posts,
    account,
    path,
    submit,
    theme
  };
}
export default connect(mapStateToProps, {
  updatePost,
  editSubmitTitle,
  editSubmitDescription,
  editSubmitTags,
  editSubmitObjectives,
  editSubmitDepartment,
  editClear,
  lightThemeLoad
})(withRouter(Edit));
