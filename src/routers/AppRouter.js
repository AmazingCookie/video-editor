
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import AssetLoader from '../components/AssetLoader';
import HomePage from '../components/Homepage';

const Header = () => (
    <header>
        <h1>I'm a header</h1>
        <NavLink to="/" className={navData => navData.isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/add" className={navData => navData.isActive ? "active" : ""}>Add</NavLink>
    </header>
);

const AppRouter = () => (
    <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AssetLoader />} />
            <Route path="*" element={<Link to='/'>Go Home</Link>} />
        </Routes>
    </BrowserRouter>
)

export default AppRouter;