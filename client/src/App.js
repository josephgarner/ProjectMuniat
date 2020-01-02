import React, { Component } from 'react';

class App extends Component {
  state = {files: []}

  componentDidMount() {
    fetch('http://localhost:3001/drive')
      .then(response => response.json())
      .then(responseJson =>{
        this.setState({ files:JSON.parse(responseJson.data) });
      });
  }

  render() {
    console.log(this.state);
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