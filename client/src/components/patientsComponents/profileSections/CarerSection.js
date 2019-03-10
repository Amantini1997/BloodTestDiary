import React from "react";
import styled from "styled-components";
import InfoCell from "./profileCells/InfoCell";
import InputCell from "./profileCells/InputCell";
import SectionContainer from "./SectionContainer";

export default class CarerSection extends React.Component {
    render() {
        const content = (
            <>
                <InputCell
                    field={"Relationship"}
                    value={this.props.carerRelationship}
                    id={"carer_relationship"}
                    disabled={this.props.hasCarer}
                />

                <InputCell
                    field={"Name"}
                    value={this.props.carerName}
                    id={"carer_name"}
                    disabled={this.props.hasCarer}
                />

                <InputCell
                    field={"Surname"}
                    value={this.props.carerSurname}
                    id={"carer_surname"}
                    disabled={this.props.hasCarer}
                />

                <InputCell
                    field={"Email"}
                    value={this.props.carerEmail}
                    id={"carer_email"}
                    disabled={this.props.hasCarer}
                />

                <InputCell
                    field={"Phone"}
                    value={this.props.carerPhone}
                    id={"carer_phone"}
                    disabled={this.props.hasCarer}
                />

                <InputCell
                    field={"Is this patient without carer ?"}
                    value={this.props.hasCarer}
                    id={"has_carer"}
                    type={"checkbox"}
                    onChange={this.props.onCarerClick}
                />
            </>
        );
        return (
            <SectionContainer
                title={"Carer info"}
                content={content}
            />
        );
    }
}