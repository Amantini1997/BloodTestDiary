import React from "react";
import styled from "styled-components";

import WeekDaySection from "./calendarComponents/WeekDaySection";
import ScrollBox from "./calendarComponents/ScrollBox";
import AppointmentSection from "./calendarComponents/AppointmentSection";

const Container = styled.div`
  margin: 3px;
  padding: 0%;
  width: auto;
  height: 100%;
  overflow: hidden;

`;

class OngoingWeekly extends React.Component {

  constructor(props){
      super(props);
  }


  render() {
    return (
      <>
        <Container>
          <WeekDaySection
            notificationNumber={
              this.props.notificationNumber
                ? this.props.notificationNumber
                : "0"
            }
            dayName={"This Week"}
          />
          <ScrollBox>
            <AppointmentSection
              type="Appointments"
              appointments={this.props.anytimeAppointments}
              editTest={this.props.editTest}
            />
            <div style={{width:"100%",height:"10%"}}/>
            </ScrollBox>
        </Container>
      </>
    );
  }
}

export default OngoingWeekly;
