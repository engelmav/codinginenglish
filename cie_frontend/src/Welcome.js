import React, { Component } from 'react'
import axios from 'axios';


class CieApi {
  startSignup(name) {
    // TODO: add logged out flow
    // TODO: credit card.
    console.log("Signing up to class", name);
    // Assume logged in.
  }
  async classList() {
    let res;
    try {
      res = await axios.get('/modules');
    } catch {
      console.log("Failed to get classes.");
    }
    return res.data;
  }
}

var cieApi = new CieApi();

export default class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classList: []
    };
  }

  async componentWillMount() {
    let classList = await cieApi.classList()
    this.setState({ classList });
  }
  render() {
    let { classList } = this.state;
    return (
      <div>
        <h1>coding_in_english</h1>
        <div>
          {classList.map((c, i) => <ClassCard key={i} name={c.name} />)}
        </div>
      </div>
    );
  }
}

// https://codepen.io/Kalyan_Lahkar/pen/wpeaJx
const ClassCard = ({ name }) => {
  const onClick = () => cieApi.startSignup(name);
  return <div><p>{name}</p><button onClick={onClick}>SIGN UP</button></div>;
}
