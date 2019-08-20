import React, { Component } from 'react'
import { Grid, Paper, makeStyles, Typography, CssBaseline, Button, Stepper, Step, StepLabel } from '@material-ui/core';
import RestauranAuth from "../components/SignUp/RestauranAuth";
import RestaurantInfo from "../components/SignUp/RestaurantInfo";
import RestaurantDetail from "../components/SignUp/RestaurantDetail";
import { connect } from "react-redux";
import { setRestaurantRegister, doRegister } from '../redux/reducers/userReducer';
import CircularProgress from "@material-ui/core/CircularProgress";


const useStyles = makeStyles(theme => ({
  root: {
    padding: 10
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(2)
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: 20,
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  // paper: {
  //   display: ;
  // }
}));

const steps = ['Restaurant Info', 'Restaurant Detail', 'User Login'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <RestaurantInfo />;
    case 1:
      return <RestaurantDetail />;
    case 2:
      return <RestauranAuth />;
    default:
      throw new Error('Unknown step');
  }
}

function SignUpComponent(props) {
  const classes = useStyles();

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      props.onSetData();
    } else {
      let confirm = window.confirm('Apakah Data Kamu Sudah benar ? cek Kembali Sebelum Melanjutkan!');
      if (confirm) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs component={Paper} square elevation={6}>
        <div className={classes.paper}>
          <Typography variant="h5" component="h1" className={classes.title}>
            Sign Up
          </Typography>
          <main className={classes.layout}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    Your order number is #2001539. We have emailed your order confirmation, and will
                    send you an update when your order has shipped.
                  </Typography>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {getStepContent(activeStep)}
                    <div className={classes.buttons}>
                      {/* {activeStep !== 0 && (
                        <Button onClick={handleBack} className={classes.button}>
                          Back
                      </Button>
                      )} */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {props.isLoading ? <CircularProgress color="secondary" /> : null}
                        {activeStep === steps.length - 1 ? 'Sign Up Now!' : 'Next'}
                      </Button>
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          </main>
        </div>
      </Grid>
    </Grid>
  );
}

class SignUp extends Component {
  submit = () => {
    this.props.dispatch(doRegister(this.props.restaurant, response => {
      console.log('response', response);
      alert("Success Registering");
      this.props.history.push("/login");
    }, err => {
      console.log("err", err);
      alert((err && err.message) ? err.message : "An Error occured on trying to Register!");
    }))
  }

  render() {
    return (
      <React.Fragment>
        <SignUpComponent onSetData={this.submit} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    restaurant: userReducer.restaurant
  }
}

export default connect(mapStateToProps)(SignUp);