import { Alert, AppBar, Avatar, Box, Button, Grid, Link, TextField, Toolbar, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    loginError: false,
    loginMessage: '',
    errorMsgEmail: '',
    errorMsgPassword: '',
  });

  const validateEmail = (value: any) => {
    if (!value) return 'Please enter your email address.';
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(value)) return 'Invalid email address.';
    return '';
  }

  const validatePassword = (password: any) => {
    if (!password) return 'Please enter your password.';
    return '';
  }

  const sendForm = (payload: any): any => {
    //TODO
    console.log(payload);
    return {ok: true};
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let email = data.get('email');
    let password = data.get('password');

    let emailErr = validateEmail(email);
    let passwordErr = validatePassword(password);

    setFormState({
      ...formState,
      errorMsgEmail: emailErr,
      errorMsgPassword: passwordErr,
    });
    
    if (!emailErr && !passwordErr) {
      let response = await sendForm(formState);
      if (response.ok) {
        // User logged in successfully
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          loginMessage: 'Logged in successfully!',
          loginError: false
        });
        await new Promise(res => setTimeout(res, 2000));
        navigate('/');
      }
      else {
        // Server encountered error
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          loginMessage: 'Failed to login. Please try again later.',
          loginError: true
        });
      }
    }
  };

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }} color="black">
            ITSecTa
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          marginTop: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 450 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                helperText={formState.errorMsgEmail}
                error={formState.errorMsgEmail !== ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={formState.errorMsgPassword}
                error={formState.errorMsgPassword !== ''}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {formState.loginMessage && (
            <Alert severity={formState.loginError ? "error" : "info"}>{formState.loginMessage}</Alert>
          )}
          <Grid container>
            <Grid item xs={2}>
              <Link href='/' variant="body2">
                Go back
              </Link>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={6}>
              <Link href='' onClick={handleRegister} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
  
  export default LoginPage;