import React, { Component } from 'react';
import { Comment} from 'semantic-ui-react'
import { InputGroup, InputGroupAddon,Button } from 'reactstrap';
export const renderCommentReplies = (rootComment,replies) => {
    return (
      replies.map((nestedComment,index) => {
        if (nestedComment.replies === undefined){
            if(this.props.account.username !== undefined && nestedComment.user === this.props.account.username){
              return (
                <Comment.Group key={nestedComment.timestamp} size='mini'  collapsed={nestedComment.collapse}  >
                  <Comment style={{border:this.props.theme[0].PrimaryOutlineBorder, borderRadius:this.props.theme[0].BorderRadius}}>
                    <Comment.Avatar as='a' src={nestedComment.avatar}/>
                    <Comment.Content>
                      <Comment.Author as='a'><span style={{color:this.props.theme[0].PostsTypographyTitle}}>{nestedComment.user}</span></Comment.Author>
                      <Comment.Metadata>
                        <span style={{color:this.props.theme[0].PostsTypographyObjectives}}>{this.renderTime(nestedComment.timestamp)}</span>
                      </Comment.Metadata>
                      <Comment.Text>
                        <div className="ql-editor" style={{color:this.props.theme[0].PostsTypographyTitle,padding:0 }}  dangerouslySetInnerHTML={{__html: nestedComment.comment}} />
                      </Comment.Text>
                      <Comment.Actions>
                        <Button onClick={() => this.editReplyComment(nestedComment.parentid,nestedComment.id,nestedComment.comment)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                          <b>Edit</b>
                        </Button>
                        <Button onClick={() => this.deleteComment(nestedComment.id)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                          <b>Delete</b>
                        </Button>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
              </Comment.Group>
              )
            } else {
              return (
                <Comment.Group key={nestedComment.timestamp} size='mini'  collapsed={nestedComment.collapse}>
                  <Comment>
                    <Comment.Avatar as='a' src={nestedComment.avatar}/>
                    <Comment.Content>
                      <Comment.Author as='a'><span style={{color:this.props.theme[0].PostsTypographyTitle}}>{nestedComment.user}</span></Comment.Author>
                      <Comment.Metadata>
                        <span style={{color:this.props.theme[0].PostsTypographyObjectives}}>{this.renderTime(nestedComment.timestamp)}</span>
                      </Comment.Metadata>
                      <Comment.Text>
                        <div className="ql-editor" style={{color:this.props.theme[0].PostsTypographyTitle,padding:0 }}  dangerouslySetInnerHTML={{__html: nestedComment.comment}} />
                      </Comment.Text>
                      <Comment.Actions>
                        <Button onClick={() => this.openReplyCommentBox(nestedComment.id)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                          <b>Reply</b>
                        </Button>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
              </Comment.Group>
              )
            }
        } else if (nestedComment.replies !== undefined){
          // get this current state
          if(this.props.account.username !== undefined && nestedComment.user === this.props.account.username){
            return (
              <Comment.Group key={nestedComment.timestamp} size='mini' collapsed={nestedComment.collapse} >
                <Comment style={{border:this.props.theme[0].PrimaryOutlineBorder, borderRadius:this.props.theme[0].BorderRadius}}>
                  <Comment.Avatar as='a' src={nestedComment.avatar} onClick={() => this.collapseNestedComment(rootComment,index)} />
                  <Comment.Content>
                    <Comment.Author as='a'><span style={{color:this.props.theme[0].PostsTypographyTitle}}>{nestedComment.user}</span></Comment.Author>
                    <Comment.Metadata>
                      <span style={{color:this.props.theme[0].PostsTypographyObjectives}}>{this.renderTime(nestedComment.timestamp)}</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div className="ql-editor" style={{color:this.props.theme[0].PostsTypographyTitle,padding:0 }}  dangerouslySetInnerHTML={{__html: nestedComment.comment}} />
                    </Comment.Text>
                    <Comment.Actions>
                      <Button onclick={() => this.editReplyComment(nestedComment.parentid,nestedComment.id,nestedComment.comment)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                        <b>Edit</b>
                      </Button>
                      <Button onClick={() => this.deleteComment(nestedComment.id)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                        <b>Delete</b>
                      </Button>
                    </Comment.Actions>
                  </Comment.Content>
                  {this.renderCommentReplies(rootComment,nestedComment.replies)}
                </Comment>
            </Comment.Group>
            )
          } else {
            return (
              <Comment.Group key={nestedComment.timestamp} size='mini' collapsed={nestedComment.collapse}>
                <Comment>
                  <Comment.Avatar as='a' src={nestedComment.avatar} onClick={() => this.collapseNestedComment(rootComment,index)} />
                  <Comment.Content>
                    <Comment.Author as='a'><span style={{color:this.props.theme[0].PostsTypographyTitle}}>{nestedComment.user}</span></Comment.Author>
                    <Comment.Metadata>
                      <span style={{color:this.props.theme[0].PostsTypographyObjectives}}>{this.renderTime(nestedComment.timestamp)}</span>
                    </Comment.Metadata>
                    <Comment.Text>
                      <div className="ql-editor" style={{color:this.props.theme[0].PostsTypographyTitle,padding:0 }}  dangerouslySetInnerHTML={{__html: nestedComment.comment}} />
                    </Comment.Text>
                    <Comment.Actions>
                      <Button  onClick={() => this.openReplyCommentBox(nestedComment.id)} style={{paddingTop:3, paddingBottom:3,paddingLeft:6, paddingRight:6, border:0, background:'transparent', color:this.props.theme[0].PostsTypographyObjectives, letterSpacing:'-0.5px', fontSize:'13px', fontWeight:350, fontFamily:"-apple-system,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\""}}>
                        <b>Reply</b>
                      </Button>
                    </Comment.Actions>
                  </Comment.Content>
                  {this.renderCommentReplies(rootComment,nestedComment.replies)}
                </Comment>
            </Comment.Group>
            )
          }
        }
        return null
      })
    )
  }