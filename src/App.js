import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';

import Clarifai from 'clarifai';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  clarifaiApp = null;
  apiKey = '0d063a274864474195a50619ad796181';

  constructor() {
    super();
    this.clarifaiApp = new Clarifai.App({
      apiKey: this.apiKey
    });
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    };
  }

  calculateFaceLocation = (data) => {
    const clarfaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarfaiFace.left_col * width,
      topRow: clarfaiFace.top_row * height,
      rightCol: width - (clarfaiFace.right_col * width),
      bottomRow: height - (clarfaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = (input) => {
    this.setState({ imageUrl: this.state.input});
    this.clarifaiApp.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(
        (response) => {
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
          this.displayFaceBox(this.calculateFaceLocation(response));
        }
      )
      .catch(error => console.error(error));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
