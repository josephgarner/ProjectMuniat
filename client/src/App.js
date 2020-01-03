import React, { Component } from 'react';

class App extends Component {
  state = {files: []}

  componentDidMount() {
    fetch('http://localhost:3001/drive')
      .then(response => response.json())
      .then(responseJson =>{
        this.setState({ files:responseJson.data });
      });
  }

  search(){
    
  }

  render() {
    console.log(this.state);
    if(this.state.files.length > 0){
      this.state.files = JSON.parse(this.state.files);
      return (
        <div className="App">
          <h1>Files</h1>
          {this.state.files.map(file =>
            <div key={file.id}>Index: {file.index} ----- Name: {file.filename}</div>
          )}
        </div>
      );
    }
    else{
      return (
        <div className="App">
          <h1>Files</h1>
          <p>No files found</p>
        </div>
      );
    }
    
  }
}

export default App