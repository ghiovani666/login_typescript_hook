import React, { useReducer, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';

import { login } from '../api/AuthAPI';
import ListErrors from './common/ListErrors';
import useAuth from '../context/auth';
import { navigate, Link, RouteComponentProps, Redirect } from '@reach/router';
import { IErrors } from '../types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`,
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1,
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  })
);

export default function Login(_: RouteComponentProps) {
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IErrors | null>();
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      console.log(user);
      dispatch({ type: 'LOAD_USER', user });
      navigate('/');
    } catch (error) {
      console.log(error);
      setLoading(false);
      // if (error.status === 422) {
      //   setErrors(error.data.errors);
      // }
    }
  };

  if (user) {
    return <Redirect to="/" noThrow />;
  }
  return (
    <div className="auth-page">
      <form className={classes.container} noValidate autoComplete="off">
        <Card className={classes.card}>
          <CardHeader className={classes.header} title="Login App" />
          <CardContent>
            <div>
              <TextField
                fullWidth
                id="username"
                type="email"
                label="Username"
                placeholder="Username"
                margin="normal"
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                fullWidth
                id="password"
                type="password"
                label="Password"
                placeholder="Password"
                margin="normal"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              className={classes.loginBtn}
              onClick={handleSubmit}
              disabled={loading}>
              Login
            </Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
