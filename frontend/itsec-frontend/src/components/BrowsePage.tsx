import { ImageList, ImageListItem, ImageListItemBar, Box, AppBar, Toolbar, Typography, Button, TextField, InputAdornment, Modal, styled } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CAFFFile, defaultCaff } from "../appProps";

interface BrowsePageProps {
  CAFFs: CAFFFile[],
  loggedIn: boolean
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BootstrapButton = styled(Button)({
  color: 'black',
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: 'white',
  borderColor: '#0063cc',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#0069d9',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#0062cc',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

const BrowsePage = (props: BrowsePageProps) => {
  const [filter, setFilter] = useState('');
  const [chosenCaff, setChosenCaff] = useState(defaultCaff);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleOpenModal = (id: number) => {
    setModalOpen(true);
    const caff:any = props.CAFFs.find(caff => caff.Id === id);
    setChosenCaff(typeof(caff) === 'undefined' ? defaultCaff : caff);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setChosenCaff(defaultCaff);
  };

  const handleBuy = () => {
    if(!props.loggedIn)
      handleLogin();
    /*else
        handle buying*/
  };

  const handleLogin = () => {
    navigate('login');
  };

  const handleRegister = () => {
    navigate('register');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }} color="black">
            ITSecTa
          </Typography>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-multiline-flexible"
              label="Search"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img width="20px" height="20px" alt="searchicon" src="SearchIcon.png" />
                  </InputAdornment>
                ),
              }}
              value={filter}
              onChange={handleSearchChange}
            />
          </Box>
          { props.loggedIn ? <div/> : 
            <>
              <BootstrapButton onClick={handleLogin}>Login</BootstrapButton>
              <BootstrapButton onClick={handleRegister}>Register</BootstrapButton>
            </>
          }
        </Toolbar>
      </AppBar>
      <Box marginTop="60px"/>
      <ImageList variant="masonry" cols={6} gap={20}>
        {props.CAFFs.map((caff) => (
          caff.Name.startsWith(filter) ? 
          <ImageListItem key={caff.Id} onClick={() => handleOpenModal(caff.Id)}>
            <img
              width="100px"
              height="100px"
              src={`${caff.Source}?w=248&fit=crop&auto=format`}
              srcSet={`${caff.Source}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={caff.Id.toString()}
              loading="lazy"
            />
            <ImageListItemBar
              title={caff.Name}
              subtitle={caff.Price.toFixed(2) + ' ft.'}
            />
          </ImageListItem> 
          : <div />
        ))}
      </ImageList>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h2" component="h2" align="center" color="#0063cc">
              {chosenCaff.Name}
            </Typography>
            <img
              width="400px"
              height="400px"
              style={{backgroundColor: "white"}}
              src={`${chosenCaff.Source}?w=248&fit=crop&auto=format`}
              srcSet={`${chosenCaff.Source}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={chosenCaff.Id.toString()}
              loading="lazy"
            />           
            <BootstrapButton style={{ color: 'white', backgroundColor: '#0063cc', marginTop: "20px"}} onClick={handleBuy}>Buy</BootstrapButton>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} align="right" color="#0063cc" variant="h5" style={{marginTop: "-35px"}}>
              {chosenCaff.Price.toFixed(2) + ' ft.'}
            </Typography>
          </Box>
      </Modal>
    </Box>
  );
}

export default BrowsePage;