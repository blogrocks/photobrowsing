import React from 'react';
import './fileinput.scss';
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labelVal: 'Add some image(s)...',
      inputDisabled: false,
    };
  }
  handleChange(e) {
    var toDisplay,
        imageFiles,
        selectedFiles = this.fileInput && this.fileInput.files;

    if (!(selectedFiles && selectedFiles.length)) return;

    imageFiles = Array.from(selectedFiles).filter((file) => {
      var imageType = /^image\//;
      return imageType.test(file.type);
    });
    toDisplay = imageFiles.length + " image(s) added";

    this.changeLabelText(toDisplay);
    this.props.onChange(imageFiles);
  }
  changeLabelText(text) {
    this.setState({
      labelVal: text,
      inputDisabled: true
    });
    setTimeout(() => {
      this.setState({
        labelVal: 'Add some image(s)...',
        inputDisabled: false
      })
    }, 3000);
  }
  handleLabelClick(e) {
    e.preventDefault();
    this.fileInput.click();
  }
  render() {
    let disabled = this.state.inputDisabled,
        labelTextClass = disabled ? 'disappear' : 'appear';

    return (
      <div>
        <input type="file"
               name="file"
               class="inputfile"
               multiple
               disabled={disabled}
               ref={(input) => {this.fileInput = input}}
               onChange={(e) => {this.handleChange(e)}} />
        <label htmlFor="file" onClick={(e) => this.handleLabelClick(e)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
          <span class={labelTextClass}>{this.state.labelVal}</span>
        </label>
      </div>
    );
  }
}

export default FileInput;