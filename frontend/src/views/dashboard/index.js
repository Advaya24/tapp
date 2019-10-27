import React from "react";
import { connect } from "react-redux";
import {
    fetchSessions,
    setActiveSession,
    sessionsSelector,
    activeSessionSelector,
    applicantsSelector,
    positionTemplatesSelector,
    instructorsSelector,
    positionsSelector,
    assignmentsSelector
} from "../../api/actions";
import { offerTableSelector } from "../offertable/actions";
import { SessionSelect } from "../../components/session-select";
import { ApplicantsList } from "../../components/applicants-list";
import { PositionTemplatesList } from "../../components/postition-templates-list";
import { InstructorsList } from "../../components/instructors-list";
import { PositionsList } from "../../components/positions-list";
import { AssignmentsList } from "../../components/assignments-list";
import { SearchBox } from "../../components/search-box";
import { EmailButton } from "../../components/email-button";
import { ImportButton } from "../../components/import-button";
import { EditableField } from "../../components/edit-field-widgets";
import { ConnectedOfferTable } from "../offertable";

// Connect the SessionSelect component
let mapStateToProps = state => {
    return {
        sessions: sessionsSelector(state),
        activeSession: activeSessionSelector(state)
    };
};
let mapDispatchToProps = { fetchSessions, setActiveSession };
const ConnectedSessionSelect = connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionSelect);

const ConnectedApplicantList = connect(state => ({
    applicants: applicantsSelector(state)
}))(ApplicantsList);

const ConnectedPositionTemplateList = connect(state => ({
    position_templates: positionTemplatesSelector(state)
}))(PositionTemplatesList);

const ConnectedInstructorsList = connect(state => ({
    instructors: instructorsSelector(state)
}))(InstructorsList);

const ConnectedPositionsList = connect(state => ({
    positions: positionsSelector(state)
}))(PositionsList);

const ConnectedAssignmentsList = connect(state => ({
    assignments: assignmentsSelector(state)
}))(AssignmentsList);

const ConnectedSearchBox = connect(state => ({
    data: applicantsSelector(state)
}))(SearchBox);

const ConnectedEmailButton = connect(state => ({
    data: offerTableSelector(state)
}))(EmailButton);

/**
 * Encapsulate a react component in a frame.
 *
 * @param {object} props
 * @param {string} props.title The name of the component encapsulated
 */
function DashboardWidget(props) {
    const { children, title } = props;
    return (
        <div style={{ margin: 5 }}>
            <h5>
                The{" "}
                <span style={{ color: "green", fontFamily: "mono" }}>
                    {title}
                </span>{" "}
                Component
            </h5>
            <div style={{ border: "1px solid black", padding: 5 }}>
                {children}
            </div>
        </div>
    );
}

/**
 * A dashboard containing a sample of all the widgets connected
 * appropriately to the redux store.
 *
 */
function Dashboard() {
    const [selectedOffers, setSelectedOffers] = React.useState([]);
    return (
        <div>
            <DashboardWidget title="EditableField">
                <EditableField
                    title="Edit this super awesome content"
                    value={45}
                    onChange={console.log}
                >
                    Edit me!
                </EditableField>
            </DashboardWidget>
            <DashboardWidget title="SessionSelect">
                <ConnectedSessionSelect />
            </DashboardWidget>
            <DashboardWidget title="ApplicantsList">
                <ConnectedApplicantList />
            </DashboardWidget>
            <DashboardWidget title="PostitionTemplatesList">
                <ConnectedPositionTemplateList />
            </DashboardWidget>
            <DashboardWidget title="InstuctorsList">
                <ConnectedInstructorsList />
            </DashboardWidget>
            <DashboardWidget title="PositionsList">
                <ConnectedPositionsList />
            </DashboardWidget>
            <DashboardWidget title="AssignmentsList">
                <ConnectedAssignmentsList />
            </DashboardWidget>
            <DashboardWidget title="SearchBox">
                <ConnectedSearchBox />
            </DashboardWidget>
            <DashboardWidget title="ImportButton">
                <ImportButton />
            </DashboardWidget>
            <DashboardWidget title="EmailButton">
                <ConnectedEmailButton />
            </DashboardWidget>
            <DashboardWidget title="OfferTable">
                <ConnectedOfferTable
                    selected={selectedOffers}
                    setSelected={setSelectedOffers}
                />
            </DashboardWidget>
        </div>
    );
}

export default Dashboard;
