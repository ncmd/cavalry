import React from 'react';
import ReactQuill from 'react-quill';
import Octicon, {ScreenFull, Zap} from '@githubprimer/octicons-react'
import { auth } from '../firebase';

const CustomButton = () => <Octicon icon={ScreenFull}/>

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar () {
  const cursorPosition = this.quill.getSelection().index
  this.quill.insertText(cursorPosition, "★")
  this.quill.setSelection(cursorPosition + 1)
}

function selectLocalImage () {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        // this.saveToServer(file);
        console.log("file",file)

        var promise = new Promise(function(resolve, reject) {
          resolve( auth.uploadImageForPost(file,"/posts/submit/"+file.name));
        })

        promise.then(() => {
        console.log("Completed uploadImageForPost")
          var promise = new Promise(function(resolve, reject) {
              resolve( auth.getImageUrl("/posts/submit/"+file.name));
          })
            promise.then((url) => {
              console.log("Completed getImageUrl",url)
              this.insertToEditor(url)
            })

        })
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
  <div id="toolbar">
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-blockquote"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-code-block"></button>
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-insertStar">
      <CustomButton />
    </button>
  </div>
)

/*
 * Editor component with custom toolbar and content containers
 */
class quill extends React.Component {
  constructor (props) {
    super(props)
    this.state = { editorHtml: '' }
    this.handleChange = this.handleChange.bind(this)
  }



  handleChange (html) {
  	this.setState({ editorHtml: html });
  }

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={quill.modules}
        />
      </div>
    )
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
quill.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      "insertStar": insertStar,
    }
  }
}

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
quill.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color',
]

/*
 * PropType validation
 */


export default quill;
