import React, { Component } from 'react';
import {
    lightThemeLoad,
} from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import './comment_quill.css';
import ReactQuill from 'react-quill';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }
});

class Comment_Quill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            rawcommentlength:0,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.handleChangeComment = this.handleChangeComment.bind(this);
    }

    CustomToolbar() {
        return (
            <div id="toolbar" style={{ background: this.props.theme[0].PostsButtonBackground }}>
                <button className="ql-bold"></button>
                <button className="ql-list" value="bullet" />
                <button className="ql-list" value="ordered" />
                <button className="ql-link" />
            </div>
        )
    }

    CustomToolbarReply() {
        return (
            <div id="toolbarReply" style={{ background: this.props.theme[0].PostsButtonBackground }}>
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
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
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

    renderTheme(p) {
        if (this.props.theme.length > 0) {
            return this.props.theme[0].MainBackground
        } else {
            this.props.lightThemeLoad()
        }
    }

    render() {
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
}

Post.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps({ theme }) {
    return {
        theme
    };
}
export default connect(mapStateToProps, {
    lightThemeLoad
})(withRouter(withStyles(styles)(Comment_Quill)));
