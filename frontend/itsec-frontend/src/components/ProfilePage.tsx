import { Alert, AppBar, Avatar, Box, Button, Grid, Link, Modal, TextField, Toolbar, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { User } from "../appProps";
import { useEffect, useState } from "react";
import { passwordStrength } from 'check-password-strength'
import { useNavigate } from "react-router-dom";

interface ProfilePageProps {
    User: User,
    LoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setUser: React.Dispatch<React.SetStateAction<User>>
};

const ProfilePage = (props: ProfilePageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.LoggedIn)
      navigate('/login');
  }, []);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    formError: false,
    formMessage: '',
    errorMsgEmail: '',
    errorMsgPassword: '',
    errorMsgConfirmPassword: ''
  });

  const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

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

  const handleOpenEmailModal = () => {
    setEmailModalOpen(true);
  }

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    setFormState({
      ...formState,
      errorMsgEmail: '',
      errorMsgPassword: '',
      errorMsgConfirmPassword: ''
    });
  }    
  
  const handleOpenPasswordModal = () => {
    setPasswordModalOpen(true);
  }

  const handleClosePasswordModal = () => {
    setPasswordModalOpen(false);
    setFormState({
      ...formState,
      errorMsgEmail: '',
      errorMsgPassword: '',
      errorMsgConfirmPassword: ''
    });
  }    

  const handleLogout = () => {
    props.setUser({Email: '', Token: ''});
    props.setIsLoggedIn(false);
    navigate('/');
  }

  const handleGoBack = () => {
    navigate('/');
  }

  const sendEmailChangeRequest = async (newEmail: string): Promise<Response> => {
    const response = await fetch('http://localhost:8080/user/modify', {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + props.User.Token
      },
      body: JSON.stringify({
        "newEmail": newEmail
      })
    });
    return response;
  }

  const sendPasswordChangeRequest = async (newPassword: string): Promise<Response> => {
    const response = await fetch('http://localhost:8080/user/modify', {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + props.User.Token
      },
      body: JSON.stringify({
        "newPassword": newPassword
      })
    });
    return response;
  }

  const saveCredentials = (email: string, token: string) => {
    props.setUser({Email: email, Token: token});
  }

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget); 
    let email = data.get('email');
    let emailErr = validateEmail(email);

    setFormState({
      ...formState,
      formMessage: '',
      formError: false,
      errorMsgEmail: emailErr,
    });

    if (!emailErr) {
      let response = await sendEmailChangeRequest(email!!.toString());
      setEmailModalOpen(false);
      console.log(response);
      if (response.ok) {
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          formMessage: 'Email address changed successfully!',
          formError: false
        });
        saveCredentials(email!!.toString(), (await response.json()).token);
      }
      else if (response.status === 400) {
        // Server rejected email address
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          formMessage: 'Email address invalid or taken.',
          formError: true
        });
      }
      else {
        // Server encountered error
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          formMessage: 'Failed to change email. Please try again later.',
          formError: true
        });
      }
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget); 

    let password = data.get('password');
    let passwordConfirm = data.get('passwordConfirmation');

    let passwordErr = validatePassword(password);
    let passwordConfirmErr = validatePasswordConfirm(password, passwordConfirm);

    setFormState({
      ...formState,
      formMessage: '',
      formError: false,
      errorMsgPassword: passwordErr,
      errorMsgConfirmPassword: passwordConfirmErr
    });

    if (!passwordErr && !passwordConfirmErr) {
      let response = await sendPasswordChangeRequest(password!!.toString());
      setPasswordModalOpen(false);
      if (response.ok) {
        setFormState({
          ...formState,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          formMessage: 'Password changed successfully!',
          formError: false
        });
        console.log(response);
      }
      else if (response.status === 400) {
        // Server rejected password
        setFormState({
          ...formState,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          formMessage: 'Please provide a stronger password.',
          formError: true
        });
      }
      else {
        // Server encountered error
        setFormState({
          ...formState,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          formMessage: 'Failed to change password. Please try again later.',
          formError: true
        });
      }
    }
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
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Box sx={{ mt: 1, width: 400 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                  Profile
              </Box>
            </Grid>   
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-start">
                  Email:
              </Box>
            </Grid>              
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                  {props.User.Email}
              </Box>
            </Grid>    
            <Grid item xs={2}>
              <Box display="flex" justifyContent="flex-end">
                <Link href='#' onClick={handleOpenEmailModal} variant="body2">
                  (change)
                </Link>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-start">
                  Password:
              </Box>
            </Grid>              
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                  ••••••••••
              </Box>
            </Grid>    
            <Grid item xs={2}>
              <Box display="flex" justifyContent="flex-end">
                <Link href='#' onClick={handleOpenPasswordModal} variant="body2">
                  (change)
                </Link>
              </Box>
            </Grid>   
            <Grid item xs={12}>
              {formState.formMessage && (
                <Alert severity={formState.formError ? "error" : "info"}>{formState.formMessage}</Alert>
              )}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 5, width: 400 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleLogout}>
                Log out
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Link href='#' onClick={handleGoBack} variant="body2">
                Go back
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Modal
        open={emailModalOpen}
        onClose={handleCloseEmailModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box component="form" onSubmit={handleEmailSubmit} noValidate sx={style}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          </Box>
      </Modal>
      <Modal
        open={passwordModalOpen}
        onClose={handleClosePasswordModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box component="form" onSubmit={handlePasswordSubmit} noValidate sx={style}>
            <Grid container spacing={2}>
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
                  sx={{mt: 1}}
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
                  sx={{mt: 1}}
                  helperText={formState.errorMsgConfirmPassword}
                  error={formState.errorMsgConfirmPassword !== ''}
                />
              </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Submit
            </Button>
          </Box>
      </Modal>

      
    </Box>
  );
}
  
  export default ProfilePage;