import React, { Component } from 'react';
import Header from '../components/header/header';
import Grid from '@material-ui/core/Grid';
import {
  getPost,
  addActivity,
  addActivityToOrganization,
  loadOrganizationAll,
  starPost,
  lightThemeLoad,
  addCommentToPostFirestore,
  replyCommentInPostFirestore,
  deleteReplyCommentFirestore
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupAddon, Button } from 'reactstrap';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import { Accordion, AccordionTab } from 'primereact/accordion';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './post.css';
import ReactQuill from 'react-quill';
import { Comment } from 'semantic-ui-react'
import JavascriptTimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from 'react-time-ago/no-tooltip'
import { findFirst, findAndDeleteAll } from 'obj-traverse/lib/obj-traverse';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  }
});

// const CommentData = require('../components/comments/CommentData.json')

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: [0, 1, 2],
      anchorEl: null,
      selectedIndex: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      postTitle: '',
      postDescription: '',
      objectives: [],
      runObjectives: [],
      logged: false,
      open: false,
      panelCollapsed: true,
      selectValueOptions: [],
      selectValue: [],
      organizationActivity: [],
      postAuthor: '',
      postId: '',
      postStars: '',
      postTimestamp: '',
      postStarred: [],
      postComments: [],
      postCommentCount: 0,
      comment: "",
      reply: "",
      rawcomment: "",
      rawcommentlength: 0,
      rawreplylength: 0,
      collapsed: true,
      openFullscreen: false,
      editing: false,
      originalComment: "",
      originalReply: "",
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
  }

  // Renders the custom toolbar for quill; need to change to slatejs.org later
  CustomToolbar(id) {
    return (
      <div id={id} style={{ background: this.props.theme[0].PostsButtonBackground }}>
        <button className="ql-bold"></button>
        <button className="ql-list" value="bullet" />
        <button className="ql-list" value="ordered" />
        <button className="ql-link" />
      </div>
    )
  }


  // Controls Onload Windows Height Dimensions
  componentDidMount() {
    this.renderTheme()
    JavascriptTimeAgo.locale(en)
    // let prevPostComments = this.state.postComments
    // CommentData.map((comment) => {
    //   prevPostComments.push(comment)
    //   return null
    // })
    // this.setState({
    //   postComments: prevPostComments,
    // })
    // Load select options if user is logged in
    if (this.props.users.logged === true && this.props.account.organizationmember !== false) {
      var prevSelectOptions = this.state.selectValueOptions
      this.setState({
        selectValueOptions: prevSelectOptions,
        // organizationActivity: prevOrganizationActivity,
      })
      // console.log("State Organization Activity:",this.state.organizationActivity)
    }

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    // console.log(this.props.location);
    this.props.getPost('/api' + this.props.location.pathname).then(() => {
      this.setState({
        postTitle: this.props.posts.title,
        postDescription: this.props.posts.description,
        postTags: this.props.posts.tags,
        postAuthor: this.props.posts.author,
        postId: this.props.posts.id,
        postStars: this.props.posts.stars,
        postTimestamp: this.props.posts.timestamp,
        postStarred: this.props.posts.starred,
        postCommentCount: this.props.posts.commentcount,
      })
      if (this.props.posts.comments) {
        let prevComments = this.state.postComments;
        this.props.posts.comments.map(c => {
          prevComments.push({
            id: c.id,
            index: c.index,
            parentDepth: c.parentDepth,
            parentid: c.parentid,
            avatar: "/cavaly.svg",
            user: c.user,
            timestamp: c.timestamp,
            comment: c.comment,
            collapse: false,
            showCommentBox: false,
            replies: c.replies
          })
          this.setState({
            postComments: prevComments,
          })
          return null
        })
      }
      console.log(this.state.postComments)

      if (this.props.posts.objectives !== null) {
        let prevObjectives = this.state.objectives;
        this.props.posts.objectives.map(r => {
          prevObjectives.push({
            title: r.title,
            description: r.description,
            department: r.department,
            selectOption: { value: "any", label: "any" },
            assignButton: false,
          })
          this.setState({
            objectives: prevObjectives,
          })
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

  renderObjectives() {
    return (
      this.state.objectives.map((obj, index) => {
        return (
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

  renderObjectiveLength(objectivelength) {
    if (objectivelength === 1) {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyDescription, height: 28, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b style={{ verticalAlign: 'middle' }}>{objectivelength} objective</b>
        </div>
      )
    } else {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyDescription, height: 28, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b style={{ verticalAlign: 'middle' }}>{objectivelength} objectives</b>
        </div>
      )
    }
  }

  renderPostTags() {
    if (this.state.postTags !== undefined) {
      return (
        this.state.postTags.map((value) => {
          if (value !== " ") {
            return (
              <Grid key={value + Math.random() + (Math.random())} item>
                <span style={{ verticalAlign: 'middle', background: this.props.theme[0].PostsTagsBackground, borderRadius: 5, textAlign: 'center', color: 'white', display: 'inline-block', fontWeight: 'bold', paddingLeft: 10, paddingRight: 10, marginRight: 5 }}>
                  <div style={{ verticalAlign: 'middle', color: 'white', letterSpacing: '1px', fontSize: '12px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                    <b>{value}</b>
                  </div>
                </span>
              </Grid>)
          }
          return null
        }
        )
      )
    }
  }

  renderEditIfOwnedByUser(currentUser) {
    if (this.state.postAuthor === currentUser) {
      return (
        <Link style={{ textDecoration: 'none', float: 'right', height: 25 }} to={{ pathname: '/post/' + this.props.posts.id + '/' + this.findAndReplace(this.findAndReplace(this.state.postTitle, ' ', '-'), '\'', '') + '/edit' }}>
          <Button size="sm" style={{ height: 25, background: 'transparent', width: 55, border: '1px solid #3d63ff', boxShadow: 'none' }} onClick={() => this.props.history.push("/signup")}>
            <div style={{ color: "#3d63ff", textTransform: 'none', letterSpacing: '-0.5px', fontSize: '10px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}   >
              <b>EDIT</b>
            </div>
          </Button>
        </Link>
      )
    }
  }

  renderCommentQuill() {
    return (
      <ReactQuill
        ref={(el) => this.quillRef = el}
        placeholder={"What are your thoughts?"}
        modules={this.modules}
        value={this.state.comment}
        style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, color: this.props.theme[0].PostsTypographyTitle }}
        onChange={this.handleChangeComment}
      />
    )
  }

  renderReplyCommentQuill() {
    return (
      <ReactQuill
        ref={(el) => this.quillRefReply = el}
        placeholder={"What are your thoughts?"}
        modules={this.modulesReply}
        value={this.state.reply}
        style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, color: this.props.theme[0].PostsTypographyTitle }}
        onChange={this.handleChangeReply}
      />
    )
  }

  renderClickStar(postid, starred, index) {
    // console.log( this.state.posts[index].starred)
    if (this.props.account.username !== undefined && this.props.posts.length > 0) {
      var ind = this.state.postStarred.indexOf(this.props.account.username);
      console.log(this.state.postStarred);
      if (ind === -1) {
        return (
          <Button style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, height: 28, verticalAlign: 'middle', background: this.props.theme[0].PostActionBackgroundImage, borderRadius: '5px 0px 0px 5px', boxShadow: '0px 0px 0px 0px', border: this.props.theme[0].PrimaryBorder }} >
            <div style={{ verticalAlign: 'middle', textTransform: 'none', color: "#333333", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <StarBorder style={{ verticalAlign: 'bottom', fontSize: 18 }} /><b>Stars</b>
            </div>
          </Button>
        )
      } else if (ind !== -1) {
        return (
          <Button style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, height: 28, verticalAlign: 'middle', background: this.props.theme[0].PostActionBackgroundImage, borderRadius: '5px 0px 0px 5px', boxShadow: '0px 0px 0px 0px', border: this.props.theme[0].PrimaryBorder }}>
            <div style={{ verticalAlign: 'middle', textTransform: 'none', color: "#333333", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <Star style={{ verticalAlign: 'bottom', fontSize: 18, color: this.props.theme[0].PrimaryLight }} /><b>Stars</b>
            </div>
          </Button>
        )
      }
    } else {
      return (
        <Button style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, height: 28, verticalAlign: 'middle', background: this.props.theme[0].PostActionBackgroundImage, borderRadius: '5px 0px 0px 5px', boxShadow: '0px 0px 0px 0px', border: this.props.theme[0].PrimaryBorder }}>
          <div style={{ verticalAlign: 'middle', textTransform: 'none', color: "#333333", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 340, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
            <Star style={{ verticalAlign: 'bottom', fontSize: 18, color: this.props.theme[0].PrimaryLight }} /><b>Stars</b>
          </div>
        </Button>
      )
    }
  }

  handleClickStar(postid, index) {
    if (this.props.account.username !== undefined) {
      console.log(this.state.postStarred)
      let prevStarred = this.state.postStarred
      var ind = this.state.postStarred.indexOf(this.props.account.username);
      // does not exist; add
      if (ind === -1) {
        prevStarred.push(this.props.account.username)
        this.setState({
          postStarred: prevStarred
        })
        this.props.starPost(postid, this.props.account.username, prevStarred.starred, 1, null)
      } else if (ind !== -1) {
        var i = prevStarred.indexOf(this.props.account.username);
        if (i !== -1) prevStarred.splice(i, 1)
        this.setState({
          postStarred: prevStarred
        })
        this.props.starPost(postid, this.props.account.username, this.state.postStarred, -1, null)
      }
    }
  }

  modules = {
    toolbar: {
      container: "#toolbar",
    },
  }
  modulesReply = {
    toolbar: {
      container: "#toolbarReply",
    },
  }

  collapseNestedCommentNew(postid) {
    let prevPostComments = this.state.postComments
    prevPostComments.map((post, index) => {
      let foundPost = findFirst(prevPostComments[index], 'replies', { id: postid })
      if (foundPost !== false) {
        if (typeof foundPost.replies === 'undefined') {
        } else {
          foundPost.replies.map((r, i) => {
            r.collapse = !r.collapse
            return null
          })
          this.setState({
            postComments: prevPostComments,
          })
        }
      }
      return null
    })
  }

  collapseRootComment(index) {
    let prevPostComments = this.state.postComments
    prevPostComments[index].replies.map((reply, ind) => {
      prevPostComments[index].replies[ind].collapse = !this.state.postComments[index].replies[ind].collapse
      return null
    })
    this.setState({
      postComments: prevPostComments
    })
  }

  renderCommentTemplateEditDelete(postid, key, avatar, collapse, user, timestamp, parentid, commentid, commenttext, showcommentbox, allcommentdata, parentdepth, type) {

    return (
      <div key={key} >
        <Comment.Group size='mini' collapsed={collapse}  >
          <Comment style={{ border: this.props.theme[0].PrimaryOutlineBorder, borderRadius: this.props.theme[0].BorderRadius }}>
            <Comment.Avatar as='a' src={avatar} />
            <Comment.Content>
              <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{user}</span></Comment.Author>
              <Comment.Metadata>
                <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(timestamp)}</span>
              </Comment.Metadata>
              <Comment.Text>
                <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: commenttext }} />
              </Comment.Text>
              <Comment.Actions>
                <Button onClick={() => this.editReplyComment(parentid, commentid, commenttext)} style={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 6, paddingRight: 6, border: 0, background: 'transparent', color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                  <b>Edit</b>
                </Button>
                <Button onClick={() => this.deleteComment(postid, commentid)} style={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 6, paddingRight: 6, border: 0, background: 'transparent', color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                  <b>Delete</b>
                </Button>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
          {showcommentbox
            ?
            <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em" }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
              <Grid item xs={12} style={{ maxWidth: 640 }}>
                <div className="text-editor-reply">
                  {this.CustomToolbar("toolbarReply")}
                  {this.renderReplyCommentQuill()}
                </div>
              </Grid>
              <Grid item xs={12} style={{ maxWidth: 640 }}>
                {this.renderReplyButton(commentid, commentid, commenttext, allcommentdata, parentdepth)}
              </Grid>
            </Grid>
            :
            <div></div>
          }
        </Comment.Group>
      </div>
    )
  }

  renderCommentTemplateReplyContent(user, timestamp, comment, commentid) {
    return (
      <Comment.Content>
        <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{user}</span></Comment.Author>
        <Comment.Metadata>
          <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(timestamp)}</span>
        </Comment.Metadata>
        <Comment.Text>
          <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: comment }} />
        </Comment.Text>
        <Comment.Actions>
          <Button onClick={() => this.toggleReplyCommentBox(commentid)} style={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 6, paddingRight: 6, border: 0, background: 'transparent', color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
            <b>Reply</b>
          </Button>
        </Comment.Actions>
      </Comment.Content>
    )
  }

  renderCommentReplies(rootComment, replies) {
    return (
      replies.map((nestedComment, index) => {
        if (nestedComment.replies === undefined) {
          if (this.props.account.username !== undefined && nestedComment.user === this.props.account.username) {
            return (this.renderCommentTemplateEditDelete(this.state.postId, nestedComment.timestamp, nestedComment.avatar, nestedComment.collapse, nestedComment.user, nestedComment.timestamp, nestedComment.parentid, nestedComment.id, nestedComment.comment, nestedComment.showCommentBox, nestedComment, nestedComment.parentDepth))
          } else if (this.props.account.username !== undefined && nestedComment.user !== this.props.account.username) {
            return (
              <Comment.Group key={nestedComment.timestamp} size='mini' collapsed={nestedComment.collapse}>
                <Comment>
                  <Comment.Avatar as='a' src={nestedComment.avatar} />
                  {this.renderCommentTemplateReplyContent(nestedComment.user, nestedComment.timestamp, nestedComment.comment, nestedComment.id)}
                </Comment>
                {nestedComment.showCommentBox
                  ?
                  <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em" }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
                    <Grid item xs={12} style={{ maxWidth: 640 }}>
                      <div className="text-editor-reply">
                        {this.CustomToolbar("toolbarReply")}
                        {this.renderReplyCommentQuill()}
                      </div>
                    </Grid>
                    <Grid item xs={12} style={{ maxWidth: 640 }}>
                      {this.renderReplyButton(nestedComment.id, nestedComment.id, nestedComment.comment, nestedComment, nestedComment.parentDepth)}
                    </Grid>
                  </Grid>
                  :
                  <div></div>
                }
              </Comment.Group>
            )
          }
        } else if (nestedComment.replies !== undefined) {
          // get this current state
          if (this.props.account.username !== undefined && nestedComment.user === this.props.account.username) {
            return (this.renderCommentTemplateEditDelete(this.state.postId, nestedComment.timestamp, nestedComment.avatar, nestedComment.collapse, nestedComment.user, nestedComment.timestamp, nestedComment.parentid, nestedComment.id, nestedComment.comment, nestedComment.showCommentBox, nestedComment, nestedComment.parentDepth))
          } else if (this.props.account.username !== undefined && nestedComment.user !== this.props.account.username) {
            return (
              <Comment.Group key={nestedComment.timestamp} size='mini' collapsed={nestedComment.collapse}>
                <Comment>
                  <Comment.Avatar as='a' src={nestedComment.avatar} onClick={() => this.collapseNestedCommentNew(nestedComment.id)} />
                  {this.renderCommentTemplateReplyContent(nestedComment.user, nestedComment.timestamp, nestedComment.comment, nestedComment.id)}
                  {nestedComment.showCommentBox
                    ?
                    <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em" }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
                      <Grid item xs={12} style={{ maxWidth: 640 }}>
                        <div className="text-editor-reply">
                          {this.CustomToolbar("toolbarReply")}
                          {this.renderReplyCommentQuill()}
                        </div>
                      </Grid>
                      <Grid item xs={12} style={{ maxWidth: 640 }}>
                        {this.renderReplyButton(nestedComment.id, nestedComment.id, nestedComment.comment, nestedComment, nestedComment.parentDepth)}
                      </Grid>
                    </Grid>
                    :
                    <div></div>
                  }
                  {this.renderCommentReplies(rootComment, nestedComment.replies)}
                </Comment>
              </Comment.Group>
            )
          } else {
            return (
              <Comment.Group key={nestedComment.timestamp} size='mini' collapsed={nestedComment.collapse}>
                <Comment>
                  <Comment.Avatar as='a' src={nestedComment.avatar} onClick={() => this.collapseNestedCommentNew(nestedComment.id)} />
                  <Comment.Content>
                    <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{nestedComment.user}</span></Comment.Author>
                    <Comment.Metadata>
                      <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(nestedComment.timestamp)}</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: nestedComment.comment }} />
                    </Comment.Text>
                  </Comment.Content>
                  {this.renderCommentReplies(rootComment, nestedComment.replies)}
                </Comment>
              </Comment.Group>
            )
          }
        }
        return null
      })
    )
  }

  renderAllComments() {
    if (this.state.postComments) {
      return (
        this.state.postComments.map((comment, index) => {
          // If there are no replies for root comment
          if (comment.replies === undefined) {
            // if user is logged in and this comment user === current signed in user
            if (this.props.account.username !== undefined && comment.user === this.props.account.username) {
              // Allow user to edit comment
              return (this.renderCommentTemplateEditDelete(this.state.postId, comment.timestamp, comment.avatar, comment.collapse, comment.user, comment.timestamp, comment.parentid, comment.id, comment.comment, comment.showCommentBox, comment, comment.parentDepth, "editComment", "deleteComment"))
            } else {
              //  Show a border if the user made the comment
              if (this.props.account.username !== undefined && comment.user === this.props.account.username) {
                return (
                  <Comment key={comment.timestamp} style={{ border: this.props.theme[0].PrimaryBorder, borderRadius: this.props.theme[0].BorderRadius }}>
                    <Comment.Avatar as='a' src={comment.avatar} />
                    <Comment.Content>
                      <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{comment.user}</span></Comment.Author>
                      <Comment.Metadata>
                        <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(comment.timestamp)}</span>
                      </Comment.Metadata>
                      <Comment.Text>
                        <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: comment.comment }} />
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                )
              } else {
                //  No border if the user did not make the comment
                return (
                  <Comment key={comment.timestamp}>
                    <Comment.Avatar as='a' src={comment.avatar} />
                    <Comment.Content>
                      <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{comment.user}</span></Comment.Author>
                      <Comment.Metadata>
                        <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(comment.timestamp)}</span>
                      </Comment.Metadata>
                      <Comment.Text>
                        <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: comment.comment }} />
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                )
              }
            }
            // if there are replies in root comment...
          } else if (comment.replies !== undefined) {
            // if user is logged in
            if (this.props.account.username !== undefined) {
              return (
                <Comment.Group threaded key={comment.timestamp} size='mini' >
                  <Comment >
                    <Comment.Avatar as='a' src={comment.avatar} onClick={() => this.collapseRootComment(index)} />
                    {/* Allow user to reply to comment*/}
                    {this.renderCommentTemplateReplyContent(comment.user,comment.timestamp,comment.comment,comment.id)}
                    {comment.showCommentBox
                      ?
                      <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em" }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
                        <Grid item xs={12} style={{ maxWidth: 640 }}>
                          <div className="text-editor-reply">
                            {this.CustomToolbar("toolbarReply")}
                            {this.renderReplyCommentQuill()}
                          </div>
                        </Grid>
                        <Grid item xs={12} style={{ maxWidth: 640 }}>
                          {this.renderReplyButton(comment.id, comment.id, comment.comment, comment, comment.parentDepth)}
                        </Grid>
                      </Grid>
                      :
                      <div></div>
                    }
                    {this.renderCommentReplies(index, this.state.postComments[index].replies)}
                  </Comment>
                </Comment.Group>
              )
              // If user is logged in and comment user === currently logged in user...
            } else if (this.props.account.username !== undefined && comment.user === this.props.account.username) {
              return (
                <Comment key={comment.timestamp} style={{ border: this.props.theme[0].PrimaryOutlineBorder, borderRadius: this.props.theme[0].BorderRadius }}>
                  <Comment.Avatar as='a' src={comment.avatar} />
                  <Comment.Content>
                    <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{comment.user}</span></Comment.Author>
                    <Comment.Metadata>
                      <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(comment.timestamp)}</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: comment.comment }} />
                    </Comment.Text>
                    <Comment.Actions>
                      <Button onClick={() => this.editComment(comment.id, comment.comment)} style={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 6, paddingRight: 6, border: 0, background: 'transparent', color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                        <b>Edit</b>
                      </Button>
                      <Button onClick={() => this.deleteComment(this.state.postId, comment.id)} style={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 6, paddingRight: 6, border: 0, background: 'transparent', color: this.props.theme[0].PostsTypographyObjectives, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
                        <b>Delete</b>
                      </Button>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              )
            } else {
              return (
                <Comment key={comment.timestamp} >
                  <Comment.Avatar as='a' src={comment.avatar} />
                  <Comment.Content>
                    <Comment.Author as='a'><span style={{ color: this.props.theme[0].PostsTypographyTitle }}>{comment.user}</span></Comment.Author>
                    <Comment.Metadata>
                      <span style={{ color: this.props.theme[0].PostsTypographyObjectives }}>{this.renderTime(comment.timestamp)}</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div className="ql-editor" style={{ color: this.props.theme[0].PostsTypographyTitle, padding: 0 }} dangerouslySetInnerHTML={{ __html: comment.comment }} />
                    </Comment.Text>
                  </Comment.Content>
                  {this.renderCommentReplies(index, this.state.postComments[index].replies)}
                </Comment>
              )
            }
          }
          return null
        })
      )
    }
  }

  renderTime(time) {
    if (this.state.postComments.length > 0) {
      return (
        <ReactTimeAgo locale="en">
          {time}
        </ReactTimeAgo>
      )
    }
  }

  addComment(postid, comment) {

    let prevPostComments = this.state.postComments
    let commentData = {
      id: this.state.postCommentCount + 1,
      index: [0],
      parentDepth: [0],
      parentid: 0,
      avatar: '/cavalry.svg',
      user: this.props.account.username,
      timestamp: Date.now(),
      comment: this.findAndReplace(comment, '<p><br></p><p><br></p><p><br></p><p><br></p>', ''),
      collapse: false,
      showCommentBox: false,
      replies: []
    }
    this.props.addCommentToPostFirestore(postid, commentData)
    if (prevPostComments) {
      prevPostComments.unshift(commentData)
      console.log(prevPostComments)
    } else {
      prevPostComments.push(commentData)
      console.log(prevPostComments)
    }

    this.setState({
      postCommentCount: this.state.postCommentCount + 1,
      postComments: prevPostComments,
      comment: "",
      rawcommentlength: 0,
    })

  }

  toggleReplyCommentBox(commentid, cancel = false) {
    let prevPostComments = this.state.postComments

    // loop through index of prevpost
    prevPostComments.map((post, index) => {
      let foundPost = findFirst(prevPostComments[index], 'replies', { id: commentid })
      if (foundPost !== false) {
        if (typeof foundPost.replies === 'undefined') {

        } else {
          if (cancel === false) {
            foundPost.showCommentBox = !foundPost.showCommentBox
            this.setState({
              postComments: prevPostComments,
              reply: "",
              rawreplylength: 0,
            })
          } else if (cancel === true) {
            console.log("Cancel false")
            foundPost.showCommentBox = false
            this.setState({
              postComments: prevPostComments
            })
          }
        }
      }
      return null
    })
  }

  editComment(postid, thiscomment) {
    // get existing comment value
    this.setState({
      comment: thiscomment
    })
    let prevPostComments = this.state.postComments
    prevPostComments.map((comment, index) => {
      if (comment.id === postid) {
        // delete selected comment
        prevPostComments.splice(index, 1);
        // opencomment box for parent
        prevPostComments[index].showCommentBox = true
        this.setState({
          postComments: prevPostComments,
        })
      }
      return null
    })
  }

  editReplyComment(parentpostid, postid, thiscomment) {
    // get existing comment value
    this.setState({
      reply: thiscomment,
      originalReply: thiscomment,
    })
    // delete selected comment
    let prevPostComments = this.state.postComments

    prevPostComments.map((post, index) => {
      if (typeof post.replies === 'undefined') {
        let foundPost = findFirst(prevPostComments[index], 'replies', { id: postid })
        if (foundPost !== false) {
          foundPost.showCommentBox = true
          this.setState({
            postComments: prevPostComments,
          })
        }
      } else {
        let foundPost = findFirst(prevPostComments[index], 'replies', { id: parentpostid })
        if (foundPost !== false) {
          foundPost.showCommentBox = true
          this.setState({
            postComments: prevPostComments,
          })
        }
      }
      return null
    })
  }

  replyComment(commentid, commentdata, parentid, postid, parentdepth) {
    let prevPostComments = this.state.postComments
    let commentData = {
      id: this.state.postCommentCount + 1,
      parentDepth: [0],
      parentid: parentid,
      avatar: '/cavalry.svg',
      user: this.props.account.username,
      timestamp: Date.now(),
      comment: this.findAndReplace(commentdata, '<p><br></p><p><br></p><p><br></p><p><br></p>', ''),
      collapse: false,
      showCommentBox: false,
      replies: []
    }

    // loop through index of prevpost
    prevPostComments.map((post, index) => {
      let foundPost = findFirst(prevPostComments[index], 'replies', { id: commentid })
      if (foundPost !== false) {
        if (typeof foundPost.replies === 'undefined') {
          // need to delete the original reply here
          console.log(commentData)
          foundPost.replies.unshift(commentData)
          this.setState({
            postComments: prevPostComments,
            postCommentCount: this.state.postCommentCount + 1
          })
          this.props.replyCommentInPostFirestore(postid, commentid, commentData)
          this.toggleReplyCommentBox(commentid)
        } else {
          foundPost.replies.unshift(commentData)
          this.setState({
            postComments: prevPostComments,
            postCommentCount: this.state.postCommentCount + 1
          })
          this.props.replyCommentInPostFirestore(postid, commentid, commentData)
          this.toggleReplyCommentBox(commentid)
        }
      }
      return null
    })

  }

  deleteComment(postid, commentid) {

    let prevPostComments = this.state.postComments
    // go through all comments
    prevPostComments.map((comment, index) => {
      // if commentid === comment.id, remove that item in index
      if (comment.id === commentid) {
        console.log("Found match.... deleting")
        prevPostComments.splice(index, 1);
        this.setState({
          postComments: prevPostComments,
        })
        this.props.deleteReplyCommentFirestore(postid, commentid)
      } else {
        console.log("No match for index",index)
        // if comment.id has no match, loop through replies with findFirst
        if (comment.replies !== undefined) {
          let foundPost = findFirst(prevPostComments[index], 'replies', { id: commentid })
          if (foundPost !== false) {
            // prevPostComments.splice(index, 1);
            findAndDeleteAll(prevPostComments[index], 'replies', { id: commentid })
            console.log("Found Post, deleting...", commentid)
            this.setState({
              postComments: prevPostComments,
            })
            this.props.deleteReplyCommentFirestore(postid, commentid)
          }
        }
      }

      // if if the commentid is not found, look through replies


      return null
    })
  }

  handleChangeComment = (value) => {
    let editor = this.quillRef.getEditor();
    let unprivilegedEditor = this.quillRef.makeUnprivilegedEditor(editor);
    // You may now use the unprivilegedEditor proxy methods
    this.setState({
      comment: value,
      rawcommentlength: unprivilegedEditor.getLength(),
    }, () => {
      console.log(this.state.rawcommentlength)
    });
  };

  handleChangeReply = (value) => {
    let editor = this.quillRefReply.getEditor();
    let unprivilegedEditor = this.quillRefReply.makeUnprivilegedEditor(editor);
    // You may now use the unprivilegedEditor proxy methods
    this.setState({
      reply: value,
      rawreplylength: unprivilegedEditor.getLength(),
    }, () => {
      console.log(this.state.rawreplylength)
    });
  };

  // This is for replying to the post; not to a comment
  renderCommentButton(parentid) {
    if ((this.state.rawcommentlength - 1) > 0 && this.state.comment !== "<p><br></p>" && (this.state.rawcommentlength - 1) <= 1000) {
      return (
        <div style={{ float: 'right' }}>
          {this.renderCommentLengthCount()}
          <Button style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, background: this.props.theme[0].PrimaryLinear }} onClick={() => this.addComment(this.state.postId, this.state.comment)}>
            <div style={{ verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Comment</b>
            </div>
          </Button>
        </div>
      )
    } else {
      return (
        <div style={{ float: 'right' }}>
          {this.renderCommentLengthCount()}
          <Button disabled style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, border: 0, background: this.props.theme[0].DisabledBackground }} onClick={() => this.addComment(this.state.postId, this.state.comment)}>
            <div style={{ color: this.props.theme[0].DisabledText, verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Comment</b>
            </div>
          </Button>
        </div>
      )
    }
  }

  renderReplyButton(commentid, parentid, parentdepth) {
    if ((this.state.rawreplylength - 1) > 0 && this.state.reply !== "<p><br></p>" && (this.state.rawreplylength - 1) <= 1000) {
      return (
        <div style={{ float: 'right' }}>
          {this.renderReplyLengthCount()}
          <Button style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, background: this.props.theme[0].PrimaryLinear }} onClick={() => this.replyComment(commentid, this.state.reply, parentid, this.state.postId, parentdepth)}>
            <div style={{ verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Reply</b>
            </div>
          </Button>
          <Button onClick={() => this.toggleReplyCommentBox(commentid, true)} style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, border: 0, background: "transparent" }}>
            <div style={{ color: this.props.theme[0].PrimaryLight, verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Cancel</b>
            </div>
          </Button>
        </div>
      )
    } else {
      return (
        <div style={{ float: 'right' }}>
          {this.renderReplyLengthCount()}
          <Button disabled style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, border: 0, background: this.props.theme[0].DisabledBackground }}>
            <div style={{ color: this.props.theme[0].DisabledText, verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Reply</b>
            </div>
          </Button>
          <Button onClick={() => this.toggleReplyCommentBox(commentid, true)} style={{ float: 'right', marginLeft: 16, height: 35, marginTop: 5, border: 0, background: "transparent", color: this.props.theme[0].PrimaryLight }}>
            <div style={{ color: this.props.theme[0].PrimaryLight, verticalAlign: 'middle', letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <b>Cancel</b>
            </div>
          </Button>
        </div>
      )
    }
  }

  renderCommentLengthCount() {
    if (this.state.rawcommentlength > 0) {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, float: 'left', marginTop: 5, padding: 5, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b>{this.state.rawcommentlength - 1}/1000</b>
        </div>
      )
    } else {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, float: 'left', marginTop: 5, padding: 5, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b>0/1000</b>
        </div>
      )
    }
  }

  renderReplyLengthCount() {
    if (this.state.rawreplylength > 0) {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, float: 'left', marginTop: 5, padding: 5, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b>{this.state.rawreplylength - 1}/1000</b>
        </div>
      )
    } else {
      return (
        <div style={{ color: this.props.theme[0].PostsTypographyObjectives, float: 'left', marginTop: 5, padding: 5, letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
          <b>0/1000</b>
        </div>
      )
    }
  }

  renderCommentBox() {
    if (this.props.account.username !== undefined) {
      return (
        <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em", padding: 15, borderRadius: '5px 5px 5px 5px' }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
          <Grid item xs={12} style={{ maxWidth: 640 }}>
            <div style={{ verticalAlign: 'middle', color: "#3d63ff", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              Comment as <b>{this.props.account.username}</b>
            </div>
          </Grid>
          <Grid item xs={12} style={{ maxWidth: 640 }}>
            <div className="text-editor">
              {this.CustomToolbar("toolbar")}
              {this.renderCommentQuill()}
            </div>
          </Grid>
          <Grid item xs={12} style={{ maxWidth: 640 }}>
            {this.renderCommentButton(0)}
          </Grid>
          <Grid item xs={12} style={{ maxWidth: 640, borderTop: this.props.theme[0].PostsButtonBorder, marginTop: 16 }}>
            <Comment.Group threaded style={{ marginTop: 16 }} size='mini'>
              {this.renderAllComments()}
            </Comment.Group>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em", padding: 15, borderRadius: '5px 5px 5px 5px' }} alignItems={'flex-start'} justify={'center'} direction={'row'}>
          <Grid item style={{ maxWidth: "63em" }}>
            <div style={{ verticalAlign: 'middle', color: "#525f7f", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}>
              <Button size="sm" style={{ marginRight: 5, height: 25, background: 'transparent', width: 55, border: '1px solid #3d63ff', boxShadow: 'none' }} onClick={() => this.props.history.push("/login")}>
                <div style={{ color: "#3d63ff", textTransform: 'none', letterSpacing: '-0.5px', fontSize: '10px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}   >
                  <b>LOG IN</b>
                </div>
              </Button>
              or
                 <Button size="sm" style={{ marginRight: 5, marginLeft: 5, height: 25, background: 'transparent', width: 55, border: '1px solid #3d63ff', boxShadow: 'none' }} onClick={() => this.props.history.push("/signup")}>
                <div style={{ color: "#3d63ff", textTransform: 'none', letterSpacing: '-0.5px', fontSize: '10px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}   >
                  <b>SIGN UP</b>
                </div>
              </Button>
              to write your thoughts.
            </div>
          </Grid>
          <Grid item xs={12} style={{ borderTop: this.props.theme[0].PostsButtonBorder, marginTop: 16 }}>
            <Comment.Group threaded style={{ marginTop: 16 }} size='mini'>
              {this.renderAllComments()}
            </Comment.Group>
          </Grid>
        </Grid>
      )
    }
  }

  renderTheme(p) {
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
            <Header />
            <div
              style={{
                flexGrow: 1,
                justify: 'center',
                background: this.renderTheme(),
                minHeight: this.state.height,
                paddingTop: 5,
                marginTop: 48,
                paddingLeft: 10,
                paddingRight: 10,
                paddingBottom: 100,
              }}
            >
              <Grid container style={{ background: "transparent", margin: "0 auto", maxWidth: "63em", paddingTop: 15, paddingBottom: 15 }} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                <Grid item xs={12}>
                  <div>
                    <b style={{ color: this.props.theme[0].PostsTypographyDescription }}> {this.props.posts.author} </b>
                    <b style={{ color: this.props.theme[0].PostsTypographyDescription }}> / </b>
                    <b style={{ color: this.props.theme[0].PostsTypographyDescription }}>{this.state.postTitle}</b>
                    {this.renderEditIfOwnedByUser(this.props.account.username)}
                  </div>
                </Grid>
              </Grid>
              <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, margin: "0 auto", maxWidth: "63em", padding: 15, borderRadius: '5px 5px 5px 5px' }} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}>
                <Grid item xs={12}>
                  <div style={{ color: this.props.theme[0].PostsTypographyDescription }}>{this.state.postDescription}</div>
                </Grid>
                <Grid item xs={12}>
                  <Grid container style={{ flexGrow: 1, width: "100%", verticalAlign: 'top' }} alignItems={"flex-start"} direction={"row"} justify={"flex-start"}>
                    {this.renderPostTags()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid container style={{ background: this.props.theme[0].PostsButtonBackground, border: this.props.theme[0].PostsButtonBorder, margin: "0 auto", marginTop: 5, marginBottom: 5, maxWidth: "63em", paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, borderRadius: '5px 5px 5px 5px' }} alignItems={'flex-start'} justify={'space-between'} direction={'row'}>
                <Grid item xs >
                  {this.renderObjectiveLength(this.state.objectives.length)}
                </Grid>
                <Grid item style={{ marginLeft: 10 }}>
                  <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend" style={{ marginLeft: 5, height: 28 }}>
                      {this.renderClickStar(this.state.postId, this.state.postsStarred, null)}
                      <Button style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3, height: 28, verticalAlign: 'middle', background: "white", borderRadius: '0px 5px 5px 0px', boxShadow: '0px 0px 0px 0px', borderRight: this.props.theme[0].PrimaryBorder, borderTop: this.props.theme[0].PrimaryBorder, borderBottom: this.props.theme[0].PrimaryBorder }}>
                        <div style={{ verticalAlign: 'middle', color: "#525f7f", letterSpacing: '-0.5px', fontSize: '13px', fontWeight: 350, fontFamily: "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"" }}><b>{this.state.postStars}</b>
                        </div>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Grid>
              </Grid>
              {/* Bottom Section */}
              <Grid container style={{ flexGrow: 1, marginLeft: 'auto', marginRight: 'auto', maxWidth: "63em" }} alignItems={'flex-start'} justify={'flex-start'} direction={'row'}  >
                <Grid item xs style={{ width: '100%' }}>
                  <Accordion multiple={true}>
                    {this.renderObjectives()}
                  </Accordion>
                </Grid>
              </Grid>
              {this.renderCommentBox()}
            </div>
          </div>
        }
      </div>
    )
  }
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ posts, users, theme, organization, account, activity }) {
  return {
    posts,
    users,
    theme,
    organization,
    account,
    activity
  };
}
export default connect(mapStateToProps, {
  getPost,
  addActivity,
  addActivityToOrganization,
  loadOrganizationAll,
  starPost,
  lightThemeLoad,
  addCommentToPostFirestore,
  replyCommentInPostFirestore,
  deleteReplyCommentFirestore
})(withRouter(withStyles(styles)(Post)));
