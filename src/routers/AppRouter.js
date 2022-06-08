
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import EditPage from '../components/EditPage';
import HomePage from '../components/Homepage';

const Header = () => (
    <header className='header'>
        <h1 className='header__text'>NavBar</h1>
        <NavLink to="/" className={navData => navData.isActive ? "header__link--active" : "header__link"}>Home</NavLink>
        <NavLink to="/add" className={navData => navData.isActive ? "header__link--active" : "header__link"}>Add</NavLink>
        {/* <p className='header__text'>My github page:</p> */}
    </header>
);

const AppRouter = () => (
    <BrowserRouter>
        <Header />

        <div className='content'>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<EditPage />} />
                <Route path="*" element={<Link to='/'>Go Home</Link>} />
            </Routes>
        </div>
    </BrowserRouter>
)

export default AppRouter;