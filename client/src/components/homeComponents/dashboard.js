import React, { Component } from 'react';

import styled from "styled-components";
import OverduePatients from "./dashboardComponents/overduePatients";

import './dashboard.css';

class Dashboard extends Component {
  render() {
    return (

      <div className={"dashboard"}>
        <div className={"overduePatients"}>
          <OverduePatients
            notificationNumber={
              APPOINTMENTS_EXAMPLE_ANYTIME.length +
              APPOINTMENTS_EXAMPLE_SCHEDULED.length
            }
            anytimeAppointments={APPOINTMENTS_EXAMPLE_ANYTIME}
            scheduledAppointments={APPOINTMENTS_EXAMPLE_SCHEDULED}
          />
        </div>
        <div className={"calender"}>
        </div>
        <div className={"ongoingWeekly"}>

        </div>
      </div>
    );
  }
}

const APPOINTMENTS_EXAMPLE_ANYTIME = [
  {
    status: "completed",
    patientName: "Luka Kralj"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell"
  },
  {
    status: "late",
    patientName: "Danilo del Busso"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini"
  },
  {
    status: "pending",
    patientName: "IDK Who Else To Put"
  }
];

const APPOINTMENTS_EXAMPLE_SCHEDULED = [
  {
    status: "pending",
    patientName: "Luka Kralj",
    time: "09:00"
  },
  {
    status: "completed",
    patientName: "Alvaro Rausell",
    time: "12:00"
  },
  {
    status: "late",
    patientName: "Danilo del Busso",
    time: "13:00"
  },
  {
    status: "completed",
    patientName: "Alessandro Amantini",
    time: "15:00"
  },
  {
    status: "pending",
    patientName: "Just A Very Long Name To Test This",
    time: "23:30"
  }
];

export default Dashboard;
