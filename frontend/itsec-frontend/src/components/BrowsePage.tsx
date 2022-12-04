import { ImageList, ImageListItem, ImageListItemBar, Box, AppBar, Toolbar, Typography, Button, TextField, InputAdornment, 
  Modal, styled, Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { CAFFFile, defaultCaff, Comments, defaultComment, User } from "../appProps";
import { saveAs } from 'file-saver';
import { backendURL } from "../globalVars";

interface BrowsePageProps {
  CAFFs: CAFFFile[],
  loggedIn: boolean,
  user: User,
  token: string,
  addCaffToList: (caff: CAFFFile) => Promise<void>
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
  const [fileName, setFileName] = useState('');
  const [chosenCaff, setChosenCaff] = useState(defaultCaff);
  const [modalOpen, setModalOpen] = useState(false);
  const [comments, setComments] = useState([defaultComment]);
  const [currentComment, setCurrentComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(new File([], ""));
  const navigate = useNavigate();

  const style = {
    width: 400,
    backgroundColor: 'white',
    boxShadow: 24,
    p: 4
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized=DOMPurify.sanitize(event.target.value);
    setFilter(sanitized);
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized=DOMPurify.sanitize(event.target.value);
    if(event.target.value.length > 50) {
      alert('Filename too long!');
      return;
    }
    setFileName(sanitized);
  };

  const handleOpenModal = async (id: string) => {
    setModalOpen(true);
    const caff:any = props.CAFFs.find(caff => caff.caffID === id);
    setChosenCaff(typeof(caff) === 'undefined' ? defaultCaff : caff);

    try {
      setComments(Comments);
      const response = await getCommentsForCAFF(id);
      if(response.ok) {
        const commentsResponse = await response.json();
        setComments(commentsResponse.comments);
      } else {
        setComments(Comments);
      }
    } catch(error){
      console.error(error);
      setComments(Comments);
    }
  };

  const getCommentsForCAFF = async (id: string) => {
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

  const b64toBlob = (str: string) => {
  // decode base64
  const imageContent = atob(str);

  // create an ArrayBuffer and a view (as unsigned 8-bit)
  const buffer = new ArrayBuffer(imageContent.length);
  let view = new Uint8Array(buffer);

  // fill the view, using the decoded base64
  for(let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  const blob = new Blob([buffer], { type: "caff" });

  return blob;
  }

  const handleBuy = async () => {
    if(!props.loggedIn)
      handleLogin();
    else {
      try {
        const response = await sendBuyRequest(chosenCaff.caffID);
        if(response.ok) {
          const buyResponse = await response.json();
          if (buyResponse.caffName.endsWith('caff')) {
            saveAs(b64toBlob(buyResponse.file), buyResponse.caffName);
          } else {
            saveAs(b64toBlob(buyResponse.file), buyResponse.caffName + '.caff');
          }
        } else {
          console.error(response.statusText);
        }
      } catch(error){
        console.error(error);
      }
    }     
  };

  const sendBuyRequest= async (id: string) => {
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
      const response = await sendComment(chosenCaff.caffID, sanitized);
      if(response.ok) {
        setComments([...comments, { commentID: "", text: sanitized }]);
        setCurrentComment('');
      } else {
        console.error(response.statusText);
      }
    } catch(error){
      console.error(error);
      setComments([...comments, { commentID: "", text: sanitized }]);
      setCurrentComment('');
    }
  };

  const sendComment= async (id: string, data: string) => {
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

    if(fileName === '') {
      alert('Please provide a name!');
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
    formData.append('file', new File([data], fileName, {type: data.type}));
    const response = await fetch(backendURL + '/caff/upload', {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
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
            <Box sx={{position: 'absolute', marginLeft: 15, marginTop: 2}}>
              <TextField
                id="outlined-multiline-flexible"
                label="FileName"
                value={fileName}
                onChange={handleFileNameChange}
                style={{paddingRight: 30, marginTop: -8}}
              />
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
          caff.caffName.startsWith(filter) ? 
          <ImageListItem key={caff.caffID} onClick={() => handleOpenModal(caff.caffID)}>
            <img
              width="100px"
              height="100px"
              src={`data:image/bmp;base64,${caff.bitmap}`}
              alt={caff.caffID.toString()}
              loading="lazy"
            />
            <ImageListItemBar
              title={caff.caffName}
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
          <Grid container sx={{position: 'absolute', top: '13.8%', left: '25%', width: 824}}>
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h2" component="h2" align="center" color="#0063cc">
                {chosenCaff.caffName}
              </Typography>
              <img
                width="400px"
                height="400px"
                style={{backgroundColor: "white"}}
                src={`data:image/jpeg;base64,${chosenCaff.bitmap}`}
                alt={chosenCaff.caffID.toString()}
                loading="lazy"
              />           
              <BootstrapButton style={{ color: 'white', backgroundColor: '#0063cc', marginTop: "20px"}} onClick={handleBuy}>Buy</BootstrapButton>
            </Box>
            <Box sx={{height: 0, }}>
              <List sx={{ maxWidth: 360, height: 423, bgcolor: 'background.paper', overflow: 'auto',  }}>
                {comments.map((comment) => (
                  <ListItem alignItems="flex-start" key={comment.text + 'Anonymous'}>
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
                            {comment.text}
                          </Typography>                           
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ width: 360, height: 87, position: 'relative', bgcolor: 'background.paper', overflow: 'auto',  }}>
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
      </Modal>
    </Box>
  );
}

export default BrowsePage;