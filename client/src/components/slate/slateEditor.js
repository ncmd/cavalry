import React from 'react';
import { Editor } from 'slate-react';
// import { Value } from 'slate';
import Html from 'slate-html-serializer'
// import FormatToolbar from './formatToolbar';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';
// import Icons from 'slate-editor-icons';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import {
    lightThemeLoad
  } from '../../redux/actions';

const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
}

// Add a dictionary of mark tags.
const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
}

const rules = [
    {
        deserialize(el, next) {
            const type = BLOCK_TAGS[el.tagName.toLowerCase()]
            if (type) {
                return {
                    object: 'block',
                    type: type,
                    data: {
                        className: el.getAttribute('class'),
                    },
                    nodes: next(el.childNodes),
                }
            }
        },
        serialize(obj, children) {
            if (obj.object === 'block') {
                switch (obj.type) {
                    case 'code':
                        return (
                            <pre>
                                <code>{children}</code>
                            </pre>
                        )
                    case 'paragraph':
                        return <p className={obj.data.get('className')}>{children}</p>
                    case 'quote':
                        return <blockquote>{children}</blockquote>
                }
            }
        },
    },
    // Add a new rule that handles marks...
    {
        deserialize(el, next) {
            const type = MARK_TAGS[el.tagName.toLowerCase()]
            if (type) {
                return {
                    object: 'mark',
                    type: type,
                    nodes: next(el.childNodes),
                }
            }
        },
        serialize(obj, children) {
            if (obj.object === 'mark') {
                switch (obj.type) {
                    case 'bold':
                        return <strong>{children}</strong>
                    case 'italic':
                        return <em>{children}</em>
                    case 'underline':
                        return <u>{children}</u>
                }
            }
        },
    },
]

// Create a new serializer instance with our `rules`
const html = new Html({ rules })

const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '~', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' }),
]

const initialValue = localStorage.getItem('content') || '<p>Text (Optional)</p>'


// function CodeNode(props) {
//     return (
//         <pre {...props.attributes}>
//             <code>{props.children}</code>
//         </pre>
//     )
// }

// function BoldMark(props) {
//     return <strong>{props.children}</strong>
// }

function MarkHotkey(options) {
    const { type, key } = options

    // Return our "plugin" object, containing the `onKeyDown` handler.
    return {
        onKeyDown(event, editor, next) {
            // If it doesn't match our `key`, let other plugins handle it.
            if (!event.ctrlKey || event.key !== key) return next()

            // Prevent the default characters from being inserted.
            event.preventDefault()

            // Toggle the mark `type`.
            editor.toggleMark(type)
        },
    }
}

// Define our app...
class SlateEditor extends React.Component {
    // Set the initial value when the app is first constructed.
    state = {
        value: html.deserialize(initialValue),
    }

    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        // When the document changes, save the serialized HTML to Local Storage.
        if (value.document !== this.state.value.document) {
            const string = html.serialize(value)
            localStorage.setItem('content', string)
        }

        this.setState({ value })
    }

    // Define a new handler which prints the key that was pressed.
    onKeyDown = (event, editor, next) => {
        console.log(event.key)
        if (!event.ctrlKey) return next()

        switch (event.key) {
            case 'b': {
                event.preventDefault()
                editor.toggleMark('bold')
            }
            case '`': {
                const isCode = editor.value.blocks.some(block => block.type === 'code')
                event.preventDefault()
                editor.setBlocks(isCode ? 'paragraph' : 'code')
            }
            default: {
                return next()
            }
        }
    }

    renderNode = (props, editor, next) => {
        switch (props.node.type) {
            case 'code':
                return (
                    <pre {...props.attributes}>
                        <code>{props.children}</code>
                    </pre>
                )
            case 'paragraph':
                return (
                    <p {...props.attributes} className={props.node.data.get('className')}>
                        {props.children}
                    </p>
                )
            case 'quote':
                return <blockquote {...props.attributes}>{props.children}</blockquote>
            default:
                return next()
        }
    }
    // Add a `renderMark` method to render marks.
    renderMark = (props, editor, next) => {
        const { mark, attributes } = props
        switch (mark.type) {
            case 'bold':
                return <strong {...attributes}>{props.children}</strong>
            case 'italic':
                return <em {...attributes}>{props.children}</em>
            case 'underline':
                return <u {...attributes}>{props.children}</u>
            default:
                return next()
        }
    }


    // Render the editor.
    render() {
        return (
            <div>
                <ButtonToolbar style={{marginBottom:5}}>
                    <ButtonGroup style={{ background: 'transparent' }}>
                        <Button size="sm" style={{ background: 'transparent', border: 0 }}>
                            <AccessAlarm style={{ color: 'red' }} />
                        </Button>
                    </ButtonGroup>
                </ButtonToolbar>
                <Editor
                    value={this.state.value}
                    plugins={plugins}
                    onChange={this.onChange}
                    // onKeyDown={this.onKeyDown}
                    renderNode={this.renderNode}
                    // Add the `renderMark` prop...
                    renderMark={this.renderMark}
                    style={{ background: 'white', border: this.props.theme[0].PostsButtonBorder, borderRadius: this.props.theme[0].BorderRadius, padding:15 }}

                />
            </div>
        )
    }
}

function mapStateToProps({ theme }) {
    return {
        theme
    };
}
export default connect(mapStateToProps, {
    lightThemeLoad
})(withRouter(SlateEditor));
