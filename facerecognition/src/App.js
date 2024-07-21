import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import Register from './components/Register/Register';
 
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
//////////////////////////////////////////////////////////////////////////////////////////////////

const setupClarifiai = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '74238a6dc70d45d9b3b5dcb0bf418c12';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'shreyc03';       
  const APP_ID = 'test';
  // Change these to whatever model and image URL you want to use
  // const MODEL_ID = 'face-detection';
  // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

  return {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id : '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
    }})
  }
  
  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map(region => region.region_info.bounding_box);
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;

    return clarifaiFaces.map(face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    })
    // returning an array of objects
  }

  displayFaceBox = (boxes) => {
    console.log(boxes);
    this.setState({boxes: boxes});
  } 

  OnInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  OnSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", setupClarifiai(this.state.input))
    .then(response => response.json())
    .then(response => {
        if (response) {
          fetch("http://localhost:3001/image", {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  OnRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    }
    if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  } 

  render() {
    return (
      <div className="App">
        <ParticlesBg className="particles" type="cobweb" bg={true} num={200} color='#ffffff'/>
        <Navigation isSignedIn={this.state.isSignedIn} OnRouteChange={this.OnRouteChange}/>
        {
          (this.state.route === 'home') ?
          <div>
            <Logo />
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries}
            />
            <ImageLinkForm 
              OnInputChange = {this.OnInputChange} 
              OnSubmit = {this.OnSubmit}  
            />
            <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
          </div> :
          (
            this.state.route === 'signin' ?
            <Signin loadUser={this.loadUser} OnRouteChange={this.OnRouteChange}/> :
            <Register loadUser={this.loadUser} OnRouteChange={this.OnRouteChange}/>
          )       
        } 
      </div>
    );
  }
}

export default App;