
import styles from "./MusicDetails.module.css";
import MusicDetailsForm from "./MusicDetailsForm/MusicDetailsForm";


export const MusicDetails = () => {
  return (
    
      <div className = {styles.container}>
        <MusicDetailsForm></MusicDetailsForm>
      </div>
  )
}


export default MusicDetails;
