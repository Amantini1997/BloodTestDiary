import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
    height: 200px;
    width: 100%;
    padding-bottom: 20px;
    background: white;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;


    color: #646464;


    .prefrencesTitle {
      margin: 15px;
      margin-bottom: 5px;
      font-size: 140%;
    }

    .message {
      font-size: 110%;
    }
`;

export default class PrefrencesPanel extends Component {

  constructor(props){
      super(props);
      this.state = {
      };
  }

  render(){
    return (
      <Container>
        <p className="prefrencesTitle">Preferences</p>
        <p className="message">To be added...</p>
      </Container>
    )
  }
}
