import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./containers/SignIn";
import { Provider } from "react-redux";
import store from "./redux/store";
import Dashboard from './containers/Dashboard';
import SignUp from './containers/SignUp';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('token_id') ? <Component {...props} /> : <Redirect to="/sign-in" />
  )} />
)

function App() {
  return (
    <Provider store={store}>
      <Switch>
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <PrivateRoute path="/" component={Dashboard} />
        {/* <Route path="*" render={() => <Redirect to="/" />} /> */}
      </Switch>
    </Provider>
  );
}

export default App;
