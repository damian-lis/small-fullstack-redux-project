import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import {
  Container,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Icon from 'components/Icon';
import Header from 'components/Header';
import { signIn, signUp } from 'actions/auth.actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  googleButton: {
    marginBottom: theme.spacing(2),
    backgroundColor: 'red'
  }
}));

const Auth = ({ history }) => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const classes = useStyles();
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [authForm, setAuthForm] = useState(initialState);
  const { userInfo } = useSelector((state) => state.userLogin);

  const googleSuccess = async (res) => {
    console.log(res);
    const result = res?.profileObj;

    try {
      const form = {
        firstName: result.givenName,
        lastName: result.familyName,
        email: result.email,
        password: result.googleId
      };

      await dispatch(signUp(form));
    } catch (error) {
      console.log(error);
    }
  };

  const googleFaliure = () => {
    console.log('Google Sign In Unsuccessful. Try Again Later');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (
        !authForm.firstName ||
        !authForm.lastName ||
        !authForm.email ||
        !authForm.password ||
        authForm.password !== authForm.confirmPassword
      ) {
        alert('Please fill all fields or password does not matched !');
      } else {
        e.currentTarget.textContent = 'Signing up ....';
        dispatch(signUp(authForm));
      }
    } else {
      if (!authForm.email || !authForm.password) {
        alert('Please fill all fields !');
      } else {
        e.currentTarget.textContent = 'Signing in ...';
        dispatch(signIn(authForm));
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      history.push('/contact');
    }
  }, [history, userInfo]);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {`${isSignUp ? 'Sign Up' : 'Sign In'}`}
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      onChange={(e) =>
                        setAuthForm({
                          ...authForm,
                          firstName: e.target.value
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="lname"
                      name="lastName"
                      variant="outlined"
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      onChange={(e) =>
                        setAuthForm({
                          ...authForm,
                          lastName: e.target.value
                        })
                      }
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      email: e.target.value
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      password: e.target.value
                    })
                  }
                />
              </Grid>

              {isSignUp && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Confirm Password"
                    type="password"
                    id="conf_password"
                    autoComplete="confirm-password"
                    onChange={(e) =>
                      setAuthForm({
                        ...authForm,
                        confirmPassword: e.target.value
                      })
                    }
                  />
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}>
              {`${isSignUp ? 'Sign Up' : 'Sign In'}`}
            </Button>

            <GoogleLogin
              clientId={process.env.GOOGLE_ID}
              render={(renderProps) => (
                <Button
                  className={classes.googleButton}
                  color="primary"
                  fullWidth
                  startIcon={<Icon />}
                  variant="contained"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}>
                  Google Log In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFaliure={googleFaliure}
              cookiePolicy="single_host_origin"
            />

            <Grid container justify="flex-end">
              <Grid item>
                <Link to="#" variant="body2" onClick={() => setIsSignUp((val) => !val)}>{`${
                  isSignUp ? 'Already have an account? Sign in' : 'Dont have an account? Sign up'
                }`}</Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Auth;
