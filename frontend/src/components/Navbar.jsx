import { useState } from 'react';
import AuthenticationService from '../api/authentication/AuthenticationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from 'react-router-dom';

function Navbar(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileUserMenuOpen, setMobileUserMenuOpen] = useState(false);

    const navigate = useNavigate();
    const userRoles = AuthenticationService.getUserRoles();

    const handleSearch = () => {
        if(searchQuery.trim()){
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    const handleSearchKeyPress = (e) => {
        if(e.key === 'Enter'){
            handleSearch();
        }
    };

    const getMenuOptions = () => {

        const consumerMenu = [
            { label: "My Orders", path: "/myorders" },
            { label: "My Profile", path: "/myprofile" },
            { label: "My Requests", path: "/myrequests" }
        ];

        const merchantMenu = [
            { label: "Merchant Profile", path: "/merchant/profile" },
            { label: "My Products", path: "/merchant/my_products" },
            { label: "Merchant Orders", path: "/merchant/orders" },
            { label: "Add Product", path: "/merchant/products/new" },
            { label: "My Analytics", path: "/merchant/my_analytics"}
        ];

        const adminMenu = [
            { label: "Analytics", path: "/admin/analytics" },
            { label: "Users", path: "/admin/users" },
            { label: "Merchants", path: "/admin/merchants" },
            { label: "Merchant Requests", path: "/admin/merchant-requests" }
        ];

        let result = [];

        for(let idx in userRoles){
            if(userRoles[idx] === 'CONSUMER'){
                result.push(...consumerMenu);
            }
            if(userRoles[idx] === 'MERCHANT'){
                result.push(...merchantMenu);
            }
            if(userRoles[idx] === 'ADMIN'){
                result.push(...adminMenu);
            }
        }
        return result;
    };
    return (
        <div className="Navbar bg-white shadow-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="app-name font-bold text-2xl text-blue-600 tracking-wide cursor-pointer" onClick={()=>navigate("/")}>
                    <h1>My Ecommerce</h1>
                </div>
                <a
                    href="https://www.linkedin.com/in/sree-nihaar-chaturvedula"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl text-blue-600 hover:text-blue-800 transition"
                    title="Visit LinkedIn Profile"
                >
                    <FontAwesomeIcon icon={faLinkedin} />
                </a>
            </div>

            {/* Desktop Menu (400px+) */}
            <div className="service hidden sm:flex items-center gap-5">
                {searchOpen ? (
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setSearchOpen(false)}
                        onKeyDown={handleSearchKeyPress}
                        autoFocus
                        className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : (
                    <div
                        className="search text-2xl cursor-pointer hover:text-gray-700"
                        onClick={() => setSearchOpen(true)}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                )}
                {(AuthenticationService.isUserLoggedIn()) ? (
                    <> {(userRoles.includes('CONSUMER'))?
                        <Link to="/cart" className="text-2xl p-2 rounded-full cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Link>
                    :
                        <></>
                    }
                        <div className="relative">
                            <div
                                className="text-2xl p-2 rounded-full cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <FontAwesomeIcon icon={faUserAstronaut} />
                            </div>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    {getMenuOptions().map((option) => (
                                        <Link
                                            key={option.path}
                                            to={option.path}
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-b last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            {option.label}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={() => {
                                            AuthenticationService.logout();
                                            setUserMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-t text-left rounded-b-lg cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ):(
                    <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium transition hover:bg-blue-700 hover:shadow-md">
                        Register / Login
                    </Link>
                )}

            </div>

            {/* Mobile Menu Button (<400px) */}
            <div className="sm:hidden flex items-center gap-4">
                {searchOpen ? (
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setSearchOpen(false)}
                        onKeyDown={handleSearchKeyPress}
                        autoFocus
                        className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                    />
                ) : (
                    <div
                        className="search text-2xl cursor-pointer hover:text-gray-700"
                        onClick={() => setSearchOpen(true)}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                )}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-xl p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
                </button>
            </div>

            {/* Overlay when menu is open */}
            {menuOpen && (
                <div
                    className="sm:hidden fixed inset-0 bg-black/50 bg-opacity-40 z-40"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Slide Menu */}
            <div className={`sm:hidden fixed top-0 right-0 h-screen w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
                menuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}>
                <div className="flex flex-col pt-5">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-2xl self-end pr-5 pb-4"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="border-t border-gray-300"></div>
                    {(AuthenticationService.isUserLoggedIn())?(
                        <>
                            <Link
                                to="/cart"
                                onClick={() => setMenuOpen(false)}
                                className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition border-b"
                            >
                                <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                                <span className="text-lg">My Cart</span>
                            </Link>

                            <div className="border-b">
                                <div
                                    onClick={() => setMobileUserMenuOpen(!mobileUserMenuOpen)}
                                    className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition"
                                >
                                    <FontAwesomeIcon icon={faUserAstronaut} className="text-2xl" />
                                    <span className="text-lg">Account</span>
                                </div>
                                {mobileUserMenuOpen && (
                                    <div className="bg-gray-50 border-t">
                                        {getMenuOptions().map((option) => (
                                            <Link
                                                key={option.path}
                                                to={option.path}
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    setMobileUserMenuOpen(false);
                                                }}
                                                className="block px-8 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition border-b last:border-b-0"
                                            >
                                                {option.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    AuthenticationService.logout();
                                    setMenuOpen(false);
                                }}
                                className="w-full px-5 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-b text-left font-medium cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ):(
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                            className="mx-5 mt-4 flex justify-center items-center rounded-lg bg-blue-600 py-3 text-white font-medium transition hover:bg-blue-700"
                        >
                            Register / Login
                        </Link>
                    )}


                    <div className="search px-5 py-4 cursor-pointer hover:bg-gray-100 flex items-center gap-3 border-b border-gray-300">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyPress}
                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-600"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Navbar;