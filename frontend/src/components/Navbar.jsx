import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";

function Navbar(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="Navbar bg-green-400 flex flex-row justify-between h-15 align-middle px-5">
            <div className="app-name font-bold self-center text-2xl">
                <h1>My Ecommerce</h1>
            </div>

            {/* Desktop Menu (400px+) */}
            <div className="service hidden sm:flex flex-row justify-around gap-4 bg-blue-500 pr-5 rounded items-center">
                {searchOpen ? (
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setSearchOpen(false)}
                        autoFocus
                        className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-600"
                    />
                ) : (
                    <div
                        className="search text-3xl cursor-pointer hover:text-gray-700"
                        onClick={() => setSearchOpen(true)}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                )}
                <div className="cart text-3xl self-center cursor-pointer hover:text-gray-700">
                    <FontAwesomeIcon icon={faCartShopping} />
                </div>
                <div className="profile text-3xl self-center cursor-pointer hover:text-gray-700" >
                    <FontAwesomeIcon icon={faUserAstronaut} />
                </div>
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
                    className="text-2xl focus:outline-none cursor-pointer"
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
            <div className={`sm:hidden fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
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

                    <div className="profile px-5 py-4 cursor-pointer hover:bg-gray-100 flex items-center gap-3 border-b border-gray-300">
                        <FontAwesomeIcon icon={faUserAstronaut} className="text-2xl" />
                        <span className="text-lg">Profile</span>
                    </div>

                    <div className="cart px-5 py-4 cursor-pointer hover:bg-gray-100 flex items-center gap-3 border-b border-gray-300">
                        <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                        <span className="text-lg">My Cart</span>
                    </div>

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