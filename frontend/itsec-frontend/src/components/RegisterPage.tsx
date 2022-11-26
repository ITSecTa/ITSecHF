import { Alert, AppBar, Avatar, Box, Button, Grid, Link, TextField, Toolbar, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { useState } from "react";



const RegisterPage = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    registrationError: false,
    registrationMessage: '',
    errorMsgEmail: '',
    errorMsgPassword: '',
    errorMsgConfirmPassword: ''
  });
  
  const validateEmail = (value: any) => {
    if (!value) return 'Please enter your email address.';
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(value)) return 'Invalid email address.';
    return '';
  }

  const validatePassword = (password: any) => {
    if (!password) return 'Please enter your password.';
    if ((password as string).length < 7) return 'Password must be at least 7 characters long.';
    return '';
  }

  const validatePasswordConfirm = (password: any, passwordConfirmation: any) => {
    if (!passwordConfirmation) return 'Please re-enter your password.';
    if (password !== passwordConfirmation) return 'Incorrect password confirmation.';
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
    let passwordConfirm = data.get('passwordConfirmation');

    let emailErr = validateEmail(email);
    let passwordErr = validatePassword(password);
    let passwordConfirmErr = validatePasswordConfirm(password, passwordConfirm);

    setFormState({
      ...formState,
      registrationMessage: '',
      registrationError: false,
      errorMsgEmail: emailErr,
      errorMsgPassword: passwordErr,
      errorMsgConfirmPassword: passwordConfirmErr
    });

    if (!emailErr && !passwordErr && !passwordConfirmErr) {
      let response = await sendForm(formState);
      if (response.ok) {
        // User registered successfully
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          registrationMessage: 'Registration successful!',
          registrationError: false
        });
        await new Promise(res => setTimeout(res, 2000));
        navigate('/login');
      }
      else {
        // Server encountered error
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          registrationMessage: 'Failed to register. Please try again later.',
          registrationError: true
        });
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  helperText={formState.errorMsgEmail}
                  error={formState.errorMsgEmail !== ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText={formState.errorMsgPassword}
                  error={formState.errorMsgPassword !== ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="passwordConfirmation"
                  label="Confirm password"
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  helperText={formState.errorMsgConfirmPassword}
                  error={formState.errorMsgConfirmPassword !== ''}
                />
              </Grid>
            </Grid>
            {formState.registrationMessage && (
              <Alert severity={formState.registrationError ? "error" : "info"}>{formState.registrationMessage}</Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="" onClick={handleLogin} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
  
  export default RegisterPage;