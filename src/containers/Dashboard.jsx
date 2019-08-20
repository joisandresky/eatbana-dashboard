import React, { Component } from 'react';
import MainDashboard from '../components/DashboardWrapper';
import { connect } from "react-redux";
import { doLogout } from '../redux/reducers/userReducer';

class Dashboard extends Component {

  onLogout = () => {
    this.props.dispatch(doLogout(response => {
      this.props.history.push('/sign-in');
    }));
  }

  render() {
    return (
      <React.Fragment>
        <MainDashboard onLogout={this.onLogout} />
      </React.Fragment>
    );
  }
}

export default connect(null)(Dashboard);