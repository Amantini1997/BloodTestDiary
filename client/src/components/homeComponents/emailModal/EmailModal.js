import React, { Component } from "react";
import styled from "styled-components";
import Section from "./Section";
import Title from "./Title";
import ScrollBox from "../calendarComponents/ScrollBox";
import TestBox from "./TestBox";
import Button from "../editTest/Button";
import { inherits } from "util";
import { openAlert } from "./../../Alert.js";
import { getServerConnect } from "./../../../serverConnection.js";
import PatientSelect from "./PatientSelect";
import { WaveLoading } from "styled-spinkit";
const Container = styled.div`
  position: relative;
  height: 592px;
  width: 635px;
  background: rgba(244, 244, 244, 1);
`;

const Scroll = styled(ScrollBox)`
  height: ${props => (!props.fullLength ? `27%` : `66%`)};
`;
export default class EmailModal extends Component {
  constructor(props) {
    super(props);
    this.serverConnect = getServerConnect();
    this.state = {
      awaitResponse: false,
      selected: [],
      response: {},
      submitted: false,
      notNotified: props.notNotified.map(patient => {
        return {
          id: patient.test_id,
          dueDate: patient.due_date,
          name: `${patient.patient_name} ${patient.patient_surname}`
        };
      }),
      notified: props.notified.map(patient => {
        return {
          id: patient.test_id,
          dueDate: patient.due_date,
          name: `${patient.patient_name} ${patient.patient_surname}`,
          lastReminder: patient.last_reminder
        };
      })
    };
  }

  select = users => {
    if (users instanceof Array) {
      this.setState({
        selected: [
          ...this.state.selected.filter(
            user => !users.find(patient => patient.testId === user.testId)
          ),
          ...users
        ]
      });
    } else {
      this.setState({ selected: [...this.state.selected, users] });
    }
  };
  deselect = users => {
    if (users instanceof Array) {
      this.setState({
        selected: this.state.selected.filter(
          patient => !users.find(user => user.testId === patient.testId)
        )
      });
    } else {
      this.setState({
        selected: this.state.selected.filter(
          patient => users.testId !== patient.testId
        )
      });
    }
  };
  areAllIncluded(array1, array2) {
    let count = 0;
    array1.map(test => {
      array2.find(test2 => test.testId === test2.testId)
        ? (count += 1)
        : (count += 0);
    });

    return count === array2.length;
  }

  submit = () => {
    this.setState({ awaitResponse: true });
    let idList = this.state.selected.map(patient => patient.id);
    this.serverConnect.sendReminders(idList, res => {
      console.log(res);
      if (res.success) {
        openAlert(
          "Patients contacted successfully",
          "confirmationAlert",
          "Ok",
          () => {
            this.props.closeModal();
          }
        );
      } else {
        this.setState({
          failedMails: Object.keys(res.response)
            .map(type => {
              return res.response[type].length;
            })
            .reduce((a, b) => a + b),
          response: res.response,
          submitted: true,
          awaitResponse: false
        });
        this.props.handleError(res, "Something went wrong");
      }
    });
  };

  render() {
    if (this.state.awaitResponse) {
      return (
        <div
          style={{
            width: "300px",
            height: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "rgba(255,255,255,0.5)",
            color: "rgba(0,0,0,0.4)"
          }}
        >
          <WaveLoading color="#0b999d" size={90} />
          Hold on while we send the reminders
        </div>
      );
    } else {
      return (
        <Container>
          <Title onClose={this.props.closeModal}>Email Reminders</Title>
          {this.state.submitted ? (
            <>
              <TestBox
                noCheck
                stat={`${this.state.failedMails}/${this.state.selected.length}`}
                selected={this.areAllIncluded(
                  this.state.selected,
                  this.state.notNotified
                )}
                onAllCheck={check =>
                  check
                    ? this.select(this.state.notNotified)
                    : this.deselect(this.state.notNotified)
                }
                title={true}
                text="Emails Sent"
              />
              <Scroll fullLength={this.state.notified.length === 0}>
                <Section
                  awaitResponse={true}
                  response={this.state.response}
                  submitted={this.state.submitted}
                  selected={this.state.selected}
                  tests={this.state.selected}
                  select={(check, patient) =>
                    check ? this.select(patient) : this.deselect(patient)
                  }
                />
              </Scroll>
              <br />
            </>
          ) : (
            <>
              <PatientSelect
                direction="left"
                patients={this.state.notified}
                notified
                onSelectClick={id =>
                  this.setState({
                    selected: [
                      ...this.state.selected,
                      this.state.notNotified.filter(
                        patient => patient.id === id
                      )
                    ]
                  })
                }
              />

              <PatientSelect
                direction="right"
                patients={this.state.notNotified}
                onSelectClick={id =>
                  this.setState({
                    selected: [
                      ...this.state.selected,
                      ...this.state.notNotified.filter(
                        patient => patient.id === id
                      )
                    ]
                  })
                }
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "50%",
                  display: "flex",
                  transform: "translateX(-50%)",
                  justifyContent: "center"
                }}
              >
                <Button
                  backgroundColor={"#f44336"}
                  hoverColor={"#dc2836"}
                  onClick={this.props.closeModal}
                >
                  Cancel
                </Button>
                <Button
                  backgroundColor={"#0b999d"}
                  hoverColor={"#018589"}
                  onClick={this.submit}
                >
                  Send Reminders
                </Button>
              </div>
            </>
          )}
        </Container>
      );
    }
  }
}
