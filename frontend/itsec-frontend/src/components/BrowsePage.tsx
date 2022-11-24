import { useNavigate } from "react-router-dom";

const BrowsePage = (props: any) => {
    const navigate = useNavigate();

    const onClick = () => {
      props.setUser({ Name: "vmi", Password: "vmi"});  
      navigate('profile');
    }
    
    return (
      <div>
        <button onClick={onClick}></button>
        Browse
      </div>
    );
  }
  
  export default BrowsePage;