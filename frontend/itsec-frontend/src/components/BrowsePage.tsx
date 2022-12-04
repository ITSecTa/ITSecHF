import { ImageList, ImageListItem, ImageListItemBar, Box, AppBar, Toolbar, Typography, Button, TextField, InputAdornment, 
  Modal, styled, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { CAFFFile, defaultCaff, Comments, defaultComment, User, Comment } from "../appProps";
import { saveAs } from 'file-saver';
import { backendURL } from "../globalVars";

interface BrowsePageProps {
  CAFFs: CAFFFile[],
  loggedIn: boolean,
  user: User,
  token: string,
  addCaffToList: (caff: CAFFFile) => Promise<void>
};

interface BuyResponse {
  CaffName: string,
  File: string
}

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

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      marginRight: 2
    },
    children: name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0] + name[name.length - 1],
  };
}

const BrowsePage = (props: BrowsePageProps) => {
  const [filter, setFilter] = useState('');
  const [chosenCaff, setChosenCaff] = useState(defaultCaff);
  const [modalOpen, setModalOpen] = useState(false);
  const [comments, setComments] = useState([defaultComment]);
  const [currentComment, setCurrentComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(new File([], ""));
  const navigate = useNavigate();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '38%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized=DOMPurify.sanitize(event.target.value);
    setFilter(sanitized);
  };

  const handleOpenModal = async (id: number) => {
    setModalOpen(true);
    const caff:any = props.CAFFs.find(caff => caff.CaffID === id);
    setChosenCaff(typeof(caff) === 'undefined' ? defaultCaff : caff);

    try {
      const response = await getCommentsForCAFF(id);
      if(response.ok) {
        const commentsResponse: Comment[] = await response.json();
        setComments(commentsResponse);
      } else {
        setComments(Comments);
      }
    } catch(error){
      console.error(error);
      setComments(Comments);
    }
  };

  const getCommentsForCAFF = async (id: number) => {
    const response = await fetch(backendURL + '/comments/' + id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
      }
    });
    return response;
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setChosenCaff(defaultCaff);
  };

  const b64toBlob = (b64Data: string, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  const handleBuy = async () => {
    if(!props.loggedIn)
      handleLogin();
    else {
      try {
        const response = await sendBuyRequest(chosenCaff.CaffID);
        if(response.ok) {
          const buyResponse: BuyResponse = await response.json();
          saveAs(b64toBlob(buyResponse.File), buyResponse.CaffName + 'caff');
        } else {
          console.error(response.statusText);
        }
      } catch(error){
        console.error(error);
      }
    }     
  };

  const sendBuyRequest= async (id: number) => {
    const response = await fetch(backendURL + '/caff/purchase/' + id, {
      method: 'GET',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + props.token
      }
    });
    return response;
  };

  const handleLogin = () => {
    navigate('login');
  };

  const handleRegister = () => {
    navigate('register');
  };

  const handleProfile = () => {
    navigate('profile');
  };

  const handleComment = async () => {
    if(!props.loggedIn || currentComment === '')
      return;
    
    const sanitized=DOMPurify.sanitize(currentComment);
    try {
      const response = await sendComment(chosenCaff.CaffID, sanitized);
      if(response.ok) {
        setComments([...comments, { CommentID: 1, Text: sanitized }]);
        setCurrentComment('');
      } else {
        console.error(response.statusText);
      }
    } catch(error){
      console.error(error);
      setComments([...comments, { CommentID: 1, Text: sanitized }]);
      setCurrentComment('');
    }
  };

  const sendComment= async (id: number, data: string) => {
    const response = await fetch(backendURL + '/comments/add/' + id, {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + props.token
      },
      body: JSON.stringify({
        text: data
      })
    });
    return response;
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value.length > 500) {
      alert('Comment too long!');
      return;
    }
    setCurrentComment(event.target.value);
  };

	const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) 
      return;

		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = async () => {
    if(selectedFile.name === "")
      return;

    if(!selectedFile.name.endsWith('.caff')) {
      alert('File extension is not appropriate!');
      return;
    }

    try {
      const response = await uploadCAFF(selectedFile);
      if(response.ok) {
        alert('Succesful upload!');
        const responseCaff = await response.json();
        props.addCaffToList(responseCaff);
      } else {
        console.error(response.statusText);
      }
    } catch(error){
      console.error(error);
    }
	};

  const uploadCAFF = async (data: File) => {
    const formData = new FormData();
    formData.append('files', data);
    const response = await fetch(backendURL + '/caff/upload', {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': 'Bearer ' + props.token
      },
      body: formData
    });
    return response;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }} color="black">
            ITSecTa
          </Typography>
          {props.loggedIn ? (
            <Box sx={{paddingRight: 85}}>
              <BootstrapButton onClick={handleUpload}>Upload</BootstrapButton>
              <input style={{paddingLeft: 30}} type="file" name="file" onChange={changeHandler} />
            </Box>)
            : <div/>}
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
              marginRight: 1
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
          { props.loggedIn ? <Avatar {...stringAvatar(props.user.Email)} onClick={handleProfile}/> : 
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
          caff.CaffName.startsWith(filter) ? 
          <ImageListItem key={caff.CaffID} onClick={() => handleOpenModal(caff.CaffID)}>
            <img
              width="100px"
              height="100px"
              src={`${caff.bitmap}?w=248&fit=crop&auto=format`}
              srcSet={`${caff.bitmap}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={caff.CaffID.toString()}
              loading="lazy"
            />
            <ImageListItemBar
              title={caff.CaffName}
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
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={16} sx={{height: 0}}>
            <Grid xs={8} sx={{height: 0}}>
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h2" component="h2" align="center" color="#0063cc">
                  {chosenCaff.CaffName}
                </Typography>
                <img
                  width="400px"
                  height="400px"
                  style={{backgroundColor: "white"}}
                  src={`${chosenCaff.bitmap}?w=248&fit=crop&auto=format`}
                  srcSet={`${chosenCaff.bitmap}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={chosenCaff.CaffID.toString()}
                  loading="lazy"
                />           
                <BootstrapButton style={{ color: 'white', backgroundColor: '#0063cc', marginTop: "20px"}} onClick={handleBuy}>Buy</BootstrapButton>
              </Box>
            </Grid>
            <Grid xs={8} sx={{height: 0}}>
              <Box sx={{height: 0}}>
                <List sx={{ maxWidth: 360, maxHeight: 500, left: 60, top: 73.5, bgcolor: 'background.paper', overflow: 'auto',  }}>
                  {comments.map((comment) => (
                    <ListItem alignItems="flex-start" key={comment.Text + 'Anonymous'}>
                      <ListItemAvatar>
                        <Avatar {...stringAvatar('Anonymous')} />
                      </ListItemAvatar>
                      <ListItemText
                        primary='Anonymous'
                        secondary={
                          <>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {comment.Text}
                            </Typography>                           
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                  <Box sx={{ width: 360, height: 87, top: 65, left: 60, position: 'relative', bgcolor: 'background.paper', overflow: 'auto',  }}>
                    <TextField
                      margin="normal"
                      id="comment-text"
                      label="Comment"
                      name="Comment"
                      autoFocus
                      multiline
                      value={currentComment}
                      onChange={handleCommentChange}
                    />
                    <BootstrapButton style={{ position: 'fixed', color: 'white', backgroundColor: props.loggedIn ? '#0063cc' : 'grey', marginTop: "20px", marginLeft: "20px"}} onClick={handleComment}>Comment</BootstrapButton>
                  </Box>
                </Box>
              </Grid>
          </Grid>
      </Modal>
    </Box>
  );
}

export default BrowsePage;