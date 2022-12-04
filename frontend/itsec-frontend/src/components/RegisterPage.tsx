import { Alert, AppBar, Avatar, Box, Button, Grid, Link, TextField, Toolbar, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { passwordStrength } from "check-password-strength";

interface RegisterPageProps {
  LoggedIn: boolean
};

const RegisterPage = (props: RegisterPageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.LoggedIn)
      navigate('/');
  }, []);

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
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(value)) return 'Invalid email address.';
    return '';
  }

  const validatePassword = (password: any) => {
    if (!password) return 'Please enter your password.';
    let pwStrength = passwordStrength(password);
    if (pwStrength.length < 10) return 'Password must be at least 10 characters long.';
    if (!pwStrength.contains.includes('lowercase')) return 'Password must contain at least one lower-case letter.'
    if (!pwStrength.contains.includes('uppercase')) return 'Password must contain at least one upper-case letter.'
    if (!pwStrength.contains.includes('symbol')) return 'Password must contain at least one symbol.'
    if (!pwStrength.contains.includes('number')) return 'Password must contain at least one number.'
    if (pwStrength.value !== "Strong") return 'Password too weak.'
    return '';
  }

  const validatePasswordConfirm = (password: any, passwordConfirmation: any) => {
    if (!passwordConfirmation) return 'Please re-enter your password.';
    if (password !== passwordConfirmation) return 'Incorrect password confirmation.';
   return '';
  }

  const sendRegisterRequest = async (email: string, password: string): Promise<Response> => {
    const response = await fetch('http://localhost:8080/user/register', {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    });
    return response;
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
      let response = await sendRegisterRequest(email!!.toString(), password!!.toString());
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
      else if (response.status === 400) {
        // Server refused registration
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          registrationMessage: 'Failed to register: Invalid email or password.',
          registrationError: true
        });
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 450}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
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
            <Grid item xs={2}>
              <Link href='/' variant="body2">
                Go back
              </Link>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={6}>
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