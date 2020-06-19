import React from 'react';
import ReactDOM from "react-dom";
import './App.css';
//import Videos from './components/videos/videos'

function App() {
  return (
    <div className="App">
      <header id='header'>Youtube Channel API</header>
      <QueryForm/>
    </div>
  );
}

class QueryForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        videos: [],
        pageVal: 1
    }
  }

  componentDidMount() {
    fetch('http://localhost:8080/api/channel')
    .then(res => res.json())
    .then(videos => this.setState({videos: videos}, () => {}));
  }

  SubmitHandler = (event) => {
    event.preventDefault();
    var chan = ReactDOM.findDOMNode(this.refs.channel).value;
    var results = ReactDOM.findDOMNode(this.refs.maxResults).value;
    var phrase = ReactDOM.findDOMNode(this.refs.keyPhrase).value;
    
    fetch('http://localhost:8080/api/channel?channel='+chan+'&maxResults='+results+'&keyPhrase='+phrase)
    .then(res => res.json())
    .then(videos => this.setState({videos: videos}, () => {
      console.log('fetched these videos', videos);
    }));
    
  }

  thumbnailClicked = (e) => {
    ReactDOM.findDOMNode(this.refs.model).src = 'https://www.youtube.com/embed/'+e.currentTarget.id;
  }

  pageClicked = (e) => {
    this.setState({pageVal: e.currentTarget.id});
    this.render();
  }

  fourColums = (e) => {
    if (window.getComputedStyle(ReactDOM.findDOMNode(this.refs.videos)).getPropertyValue("column-count") == 3) {
      document.getElementById("videos").style.columnCount = 4;
    } else {
      document.getElementById("videos").style.columnCount = 3;
    }
  }

  numOfPages = (videos) => {
    let pages = []
    if (videos%12 == 0) {
      for (let a = 0; a < videos/12; a++) {
        pages.push(a);
      }
      return pages;
    } else {
      for (let a = 0; a < parseInt(videos/12)+1; a++) {
        pages.push(a);
      }
      return pages;
    }
  }

  render() {
    let split = 1;
    if (this.state.pageVal != 0) {
      split = this.state.pageVal;
    }
    return (
      <div className="App">
        <div id="inputForm">
          <form onSubmit={this.SubmitHandler}>
            <p>Specify Search Results:</p>
            <p>Channel: <input ref="channel" id="channel" type="text"/></p>
            <p>Number of Videos: <input ref="maxResults" id="maxResults" type="text"/></p>
            <p>Key Terms: <input ref="keyPhrase" id="keyTerms" type="text"/></p>
            <a></a>
            <input type='submit'/>
          </form>
          <iframe ref="model" id="model" width="426" height="240" src="" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>
        <div class="switch">
          Add 4th Column: <input type="checkbox" onClick={this.fourColums}></input>
        </div>
        <div id="videoGrid">
        <div id="div_top_hypers">
          <ul id="ul_top_hypers">
            {this.numOfPages(this.state.videos.length).map(page => 
              <li onClick={this.pageClicked} class="page" id={page+1} key={page+1}>{page+1}</li>
            )}
          </ul>
        </div>
          <ul ref="videos" id="videos">
              {this.state.videos.slice((12*split-12),(12*split)).map(video => 
                <li onClick={this.thumbnailClicked} class="thumbnail" id={video.id.videoId} key={video.id.videoId}>
                  <h1 class="title">{video.snippet.title}</h1>
                  <img class="icon" src={video.snippet.thumbnails.medium.url}></img>
                  <p class="description">{video.snippet.description}</p>
                </li>
              )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
