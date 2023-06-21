import '@passageidentity/passage-elements/passage-profile';
import { useEffect } from 'react';

function Profile() {
    useEffect(()=>{
        require('@passageidentity/passage-elements/passage-profile');
    }, []);
    
  return (
      <div>
        <passage-profile app-id={process.env.NEXT_PUBLIC_PASSAGE_APP_ID}></passage-profile>
      </div>
  );
}
export default Profile;