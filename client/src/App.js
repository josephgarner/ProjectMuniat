import React, { Component } from 'react';

class App extends Component {
  state = {files: []}

  componentDidMount() {
    fetch('/users')
      .then(res => res.json())
      .then(files => this.setState({ files }))
      .then();
    console.log(this.state);
  }

  render() {
    return (
      <div className="App">
        <h1>Files</h1>
        {this.state.files.map(file =>
          <div key={file.id}>{file.filename}</div>
        )}
      </div>
    );
  }
}

export default App