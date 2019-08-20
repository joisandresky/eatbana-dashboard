import React, { Component } from 'react';
import SignIn from "../components/Authentication/SignIn";
import { connect } from "react-redux";
import { doLogin } from "../redux/reducers/userReducer";

class SignInContainer extends Component {

  state = {
    email: '',
    password: ''
  }

  onHandleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit = () => {
    this.props.dispatch(doLogin({ email: this.state.email, password: this.state.password }, response => {
      if(response && response.user.role === 'guest') {
        alert('You are not Restaurant Owner or Admin! Please log in to another valid account!');
        return;
      }
      localStorage.setItem('token_id', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      this.props.history.push('/');
    }, err => {
      console.log('err', err);
      alert(err.error ? err.error : 'Terjadi Kesalahan Saat Melakukan Login');
    }));
  }

  render() {
    return (
      <div>
        <SignIn onSubmit={this.onSubmit} isLoading={this.props.isLoading} handleChange={this.onHandleChange} />
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoading: userReducer.isLoading
  }
}

export default connect(mapStateToProps)(SignInContainer);