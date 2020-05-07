import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/map.jsx';
import BasicDetails from './components/basicDetails.jsx';
import DataSelection from './components/dataSelection.jsx';
import Axios from 'axios';
import { states } from './state_coordinates';

const bannerStyle = {
  width: '100%',
  height: '80px',
  backgroundColor: '#00004d',
  position: 'relative',
  marginBottom: '20px',
  color: 'white',
  verticalAlign: 'middle',
  padding: '10px',
  fontFamily: 'Arial',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playCoordinates: [],
      selectedFile: null,
      indexes: [],
      currentYear: '',
      dataSelected: false,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.calculateCenter = this.calculateCenter.bind(this);
    this.playMap = this.playMap.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.fileData = this.fileData.bind(this);
    this.yearChange = this.yearChange.bind(this);
  }

  handleDataChange(event) {
    Axios.get(`/data/?dataType=${event.target.value}`)
      .then((data) => {
        this.setState({ currentData: data.data, dataSelected: true }, () => {
          console.log('this.state.currentData', this.state.currentData);
          this.calculateCenter();
        });
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  }

  playMap() {
    let counter = 0;
    let maxCounter = this.state.finalCoordinates.length;
    this.timer = setInterval(() => {
      if (counter === maxCounter - 1) {
        clearInterval(this.timer);
      }
      let currentYear = this.state.currentData[counter]['Year'];
      let currentCoords = this.state.playCoordinates;
      currentCoords.push(this.state.finalCoordinates[counter]);
      this.yearChange(currentCoords, currentYear);
      counter++;
    }, 200);
  }

  yearChange(newEntry, currentYear) {
    this.setState({
      playCoordinates: newEntry,
      currentYear: currentYear,
    });
  }

  // On file select (from the pop up)
  onFileChange(event) {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  }

  // On file upload (click the upload button)
  onFileUpload() {
    // Create an object of formData
    const formData = new FormData();
    // Update the formData object
    formData.append(
      'myFile',
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    // Details of the uploaded file
    // Request made to the backend api
    // Send formData object
    Axios.post('/data', formData)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // File content to be displayed after
  // file upload is complete
  fileData() {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{' '}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <div style={{ fontStyle: 'italic' }}>
            Note: the uploaded data must be saved in a precise format by year
            and abbreviated state acronym. A template can be found{' '}
            <a href="https://docs.google.com/spreadsheets/d/1wW2-udneHi491-px6hM3VsZXi7ak9NGm-Yd04eJi8c0/edit?usp=sharing">
              here
            </a>
            .
          </div>
        </div>
      );
    }
  }

  calculateCenter() {
    let coordinates = [];
    for (let row = 0; row < this.state.currentData.length; row++) {
      //total for each
      let northTotal = 0;
      let westTotal = 0;
      //total sum of data, to be divided later
      let totalData = 0;
      for (let eachState = 0; eachState < states.length; eachState++) {
        //create variables from state data for ease
        const dataAmount = this.state.currentData[row][
          states[eachState]['name']
        ];
        const northCoord = states[eachState]['north'];
        const westCoord = states[eachState]['west'];
        //get totals for coordinates
        if (dataAmount === undefined) {
        }
        if (dataAmount !== 0 || dataAmount !== undefined) {
          northTotal += dataAmount * northCoord;
          westTotal += dataAmount * westCoord;
          //get totalAmount
          totalData += dataAmount;
        }
      }
      //creating averages
      let northAverage = northTotal / totalData;
      let westAverage = westTotal / totalData;
      //creating final object
      let yearObj = {
        year: this.state.currentData[row]['Year'],
        north: northAverage,
        west: westAverage * -1,
      };
      //push final object into array
      coordinates.push(yearObj);
    }
    this.setState({ finalCoordinates: coordinates });
  }

  componentDidMount() {
    Axios.get('/indexes').then((data) => {
      this.setState({ indexes: data.data });
    });
  }

  render() {
    let playbutton = <div></div>;
    if (this.state.dataSelected === true) {
      playbutton = (
        <div>
          <button class="button is-medium" onClick={this.playMap}>
            Play!
          </button>
        </div>
      );
    }

    return (
      <div>
        <div style={bannerStyle}>
          <h1 class="title is-1" style={{ color: 'white' }}>
            Macro Trends
          </h1>
        </div>
        <div style={{ float: 'left', margin: '10px', width: '300px' }}>
          <div style={{ marginTop: '20px' }}>
            <DataSelection
              handleDataChange={this.handleDataChange}
              state={this.state}
            />
          </div>
          <div class="columns" style={{ marginTop: '15px' }}>
            <div class="column">{playbutton}</div>
            <div class="column" style={{ verticalAlign: 'middle' }}>
              <BasicDetails year={this.state.currentYear} />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <hr />
            <div>
              <h2 class="subtitle is-4" style={{ textAlign: 'center' }}>
                Or upload your own data!
              </h2>
              <div class="columns" style={{ marginTop: '15px' }}>
                <div class="column" style={{ textAlign: 'center' }}>
                  <div class="file">
                    <label class="file-label">
                      <input
                        class="file-input"
                        type="file"
                        onChange={this.onFileChange}
                      />
                      <span class="file-cta">
                        <span class="file-label">Choose a file…</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div class="column" style={{ textAlign: 'center' }}>
                  <button class="button " onClick={this.onFileUpload}>
                    Upload!
                  </button>
                </div>
              </div>
            </div>
            {this.fileData()}
          </div>
        </div>
        <div style={{ float: 'left', margin: '10px' }}>
          <Map coordinates={this.state.playCoordinates} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
