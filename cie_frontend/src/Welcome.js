import React, { Component } from 'react'
import axios from 'axios';


class CieApi {
  startSignup(name) {
    // TODO: add logged out flow
    // TODO: credit card.
    console.log("Signing up to class", name);
    // Assume logged in.
  }
  async classList(){
    try {
      await axios.get('/classes');
    } catch {
      console.log("Failed to get classes.");
    }
    return [
      'Dev Teams and Loops',
      'Restaurants and Functions'
    ]
  }
}

var cieApi = new CieApi();

export default class Welcome extends Component {
  render() {

    return (
      <div>
        <h1>coding_in_english</h1>
        <div>
          {cieApi.classList().map((c, i) => <ClassCard key={i} name={c} />)}        
        </div>
      </div>
    );
  }
}

const ClassCard = ({name}) => {
  const onClick = () => cieApi.startSignup(name);
  return <div><p>{name}</p><button onClick={onClick}>SIGN UP</button></div>;
}
