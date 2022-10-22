import AssetLoader from "./assets/AssetLoader";
import Workplace from "./Workplace";
import { AiFillGithub } from 'react-icons/ai';


export default () => (
    <div className="edit-page">
        <AssetLoader />
        <Workplace />
        <div className="home-page__contact"><a href="https://github.com/AmazingCookie/video-editor" target="_blank"><AiFillGithub /> AmazingCookie</a> </div>
    </div>
    
)