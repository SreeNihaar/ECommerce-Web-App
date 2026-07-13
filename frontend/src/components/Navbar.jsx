import { useState } from 'react';
import AuthenticationService from '../api/authentication/AuthenticationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

function Navbar(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(AuthenticationService.isUserLoggedIn());
    return (
        <div className="Navbar bg-white shadow-md px-6 h-16 flex items-center justify-between sticky top-0 z-50">
            <div className="app-name font-bold text-2xl text-blue-600 tracking-wide cursor-pointer">
                <h1>My Ecommerce</h1>
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
                {(isLoggedIn) ? (
                    <>
                        <div className="text-2xl p-2 rounded-full cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </div>
                        <div className="text-2xl p-2 rounded-full cursor-pointer hover:bg-gray-100 hover:text-blue-600 transition" >
                            <FontAwesomeIcon icon={faUserAstronaut} />
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
                    {(isLoggedIn)?(
                        <>
                            <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition border-b">
                                <FontAwesomeIcon icon={faUserAstronaut} className="text-2xl" />
                                <span className="text-lg">Profile</span>
                            </div>

                            <div className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition border-b">
                                <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                                <span className="text-lg">My Cart</span>
                            </div>
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
                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-600"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Navbar;