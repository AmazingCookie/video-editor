
import { HashRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import EditPage from '../components/EditPage';
import HomePage from '../components/Homepage';
import InspectPage from '../components/InspectPage';

const Header = () => (
    <header className='header'>
        <h1 className='header__text'>. . .</h1>
        <NavLink to="/" className={navData => navData.isActive ? "header__link--active" : "header__link"}><AiFillHome />Home</NavLink>
        <NavLink to="/edit" className={navData => navData.isActive ? "header__link--active" : "header__link"}>Edit</NavLink>
        <NavLink to="/inspect" className={navData => navData.isActive ? "header__link--active" : "header__link"}>Inspect</NavLink>
        {/* <p className='header__text'>My github page:</p> */}
    </header>
);

const AppRouter = () => (
    <HashRouter>
        <Header />
        <div className='content'>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/edit" element={<EditPage />} />
                <Route path="/inspect" element={<InspectPage />} />
                <Route path="*" element={<Link to='/'>Go Home</Link>} />
            </Routes>
        </div>
    </HashRouter>
)

export default AppRouter;