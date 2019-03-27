import React, { Component } from 'react';
import styled from "styled-components";
import {getServerConnect} from "../../serverConnection";
import dateformat from "dateformat";
import {openAlert} from "../Alert";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background: white;
  align-items: center;
  padding: 1%;
`;

const ContentContainer = styled.div`
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
`;

const TitleContainer = styled.div`
  width: 100%;
  height: auto;
`;

const Title = styled.p`
  text-align: center;
  font-size: 150%;
  margin: 0;
  width: 100%;
`;

const SelectContainer = styled.div`
  text-align: center;
  width: 40%;
  padding: 3%;
`;

const InputContainer = styled.div`
  text-align: center;
  width: 40%;
  padding: 3%;
`;

const CheckboxContainer = styled.div`
  text-align: center;
  width: 90%;
  padding: 3%
`;

const Label = styled.label`
`;

const LabelContainer = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #ccc;
`;

const RadioButton = styled.input.attrs({ type: "checkbox" })`
  position: relative;
  width: 20px;
  appearance: none;
  height: 20px;
  border-radius: 50%;
  outline: none;
  border: solid 3px #0d4e56;
  margin: 0 5px 0 0;
  padding: 0;
  transition: 100ms;
  cursor: pointer;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background: #0b999d;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0;
    transition: 100ms;
  }
  &:checked {
    border: solid 3px #0b999d;
  }

  &:checked::before {
    opacity: 1;
  }
`;

export default class Report extends Component {
    constructor(props) {
        super(props);

        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    };

    handleSelectChange(e) {
        this.setState({ monthSelected: e.target.value});
    };

    handleInputChange(e) {
        this.setState({ yearSelected: e.target.value });
    }

    handleCheckboxChange(e) {
        this.setState( { wholeYear: e.target.value} );
    }

    onGenerateClick = () => {
        // TODO: remove hard coded values
        getServerConnect().generateReport("March", "2019", (res) => {
            const time = dateformat(new Date(), "HH:MM:ss");
            if (res.success) {
                this.setState({
                    html: res.html,
                    time: time
                });
            }
            else {
                this.setState({
                    html: undefined,
                });
                openAlert(
                    `${"Report could not be generated."}`,
                    "confirmationAlert",
                    "OK",
                    () => {
                        return;
                    }
                );
            }
        });
    };

    render(){
        return (
            <Container>
                <TitleContainer>
                    <Title>Create report</Title>
                </TitleContainer>
                <ContentContainer>
                    <SelectContainer>
                        <LabelContainer>
                            <Label htmlFor={"select_month_alert"}>Select month</Label>
                        </LabelContainer>
                        <select id={"select_month_alert"} onChange={this.handleSelectChange}>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="May">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="October">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>
                    </SelectContainer>
                    <InputContainer>
                        <Label htmlFor={"input_year_alert"}>Type in year</Label>
                        <Input id={"input_year_alert"} onChange={this.handleInputChange}/>
                    </InputContainer>
                    <CheckboxContainer>
                        <LabelContainer>
                            <Label htmlFor={"whole_year_checkbox_alert"}>Generate report for whole year</Label>
                        </LabelContainer>
                        <RadioButton id={"whole_year_checkbox_alert"} onChange={this.handleCheckboxChange}/>
                    </CheckboxContainer>
                </ContentContainer>
            </Container>
        )
    }
}
