import { User } from "../appProps";

interface ProfilePageProps {
    User: User
};

const ProfilePage = (props: ProfilePageProps) => {
    console.log(props);
    return (
      <div>
        {( props === null ? <div>No user</div>: props.User.Name)}
      </div>
    );
  }
  
  export default ProfilePage;