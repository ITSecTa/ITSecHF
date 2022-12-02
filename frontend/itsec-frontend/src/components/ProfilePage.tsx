import { Alert, AppBar, Avatar, Box, Button, Grid, Link, Modal, TextField, Toolbar, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { User } from "../appProps";
import { useState } from "react";
import { passwordStrength } from 'check-password-strength'
import { useNavigate } from "react-router-dom";

interface ProfilePageProps {
    User: User
};

const ProfilePage = (props: ProfilePageProps) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
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
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

  const handleOpenModal = () => {
    setModalOpen(true);
  }

  const handleCloseModal = () => {
    setModalOpen(false);
  }    

  const handleLogout = () => {
    // TODO
    navigate('/');
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
      formMessage: '',
      formError: false,
      errorMsgEmail: emailErr,
      errorMsgPassword: passwordErr,
      errorMsgConfirmPassword: passwordConfirmErr
    });

    if (!emailErr && !passwordErr && !passwordConfirmErr) {
      let response = await sendForm(formState);
      setModalOpen(false);
      if (response.ok) {
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          formMessage: 'Details changed successfully!',
          formError: false
        });
      }
      else {
        // Server encountered error
        setFormState({
          ...formState,
          errorMsgEmail: emailErr,
          errorMsgPassword: passwordErr,
          errorMsgConfirmPassword: passwordConfirmErr,
          formMessage: 'Failed to change. Please try again later.',
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
                <Typography component="h1" variant="h5">
                  Profile
                </Typography>
              </Box>
            </Grid>   
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-start">
                <Typography component="body" >
                  Email:
                </Typography>
              </Box>
            </Grid>              
            <Grid item xs={8}>
              <Box display="flex" justifyContent="flex-end">
                <Typography component="body" >
                  {props.User.Name}
                </Typography>
              </Box>
            </Grid>    
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-start">
                <Typography component="body" >
                  Password:
                </Typography>
              </Box>
            </Grid>              
            <Grid item xs={8}>
              <Box display="flex" justifyContent="flex-end">
                <Typography component="body" >
                  ••••••••••
                </Typography>
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
              color="primary"
              variant="contained"
              onClick={handleOpenModal}>
                Change
              </Button>
            </Grid>
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
              <Link href='/' variant="body2">
                Go back
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box component="form" onSubmit={handleSubmit} noValidate sx={style}>
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