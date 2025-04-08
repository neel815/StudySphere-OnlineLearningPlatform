import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setIsScrolled(currentScrollPos > 0);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const data = [
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Mathematics" },
  ];

  const matchRoute = (route) => {
    return matchPath(route, location.pathname);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        transition: {
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg ${
        isScrolled ? "bg-[#000000]/80" : "bg-transparent"
      } transition-all duration-300`}
    >
      <div className="flex h-16 items-center justify-center border-b-[1px] border-b-[#ffffff1a]">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">
          <Link to="/">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              src={logo} 
              alt="Logo" 
              width={160} 
              height={32} 
              loading="lazy" 
            />
          </Link>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                link.title === "Catalog" || link.title === "Simulations" ? (
                  <motion.li
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-full"
                  >
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 py-1 ${
                        matchRoute("/catalog/:catalogName") || matchRoute("/simulations/:simulationName")
                          ? "text-[#00ffff]"
                          : "text-white"
                      }`}
                    >
                      <p className="font-medium">{link.title}</p>
                      <BsChevronDown className="transition-transform group-hover:rotate-180" />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-xl bg-[#1C1C1C] p-4 text-white opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] border border-[#ffffff1a]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-[#1C1C1C] border-l border-t border-[#ffffff1a]"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : link.title === "Catalog" ? (
                          subLinks.length > 0 ? (
                            subLinks
                              .filter((subLink) => subLink?.courses?.length > 0)
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-3 pl-4 hover:bg-[#ffffff0f] transition-colors"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )
                        ) : (
                          data.map((item, i) => (
                            <Link
                              to={`/simulations/${item.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-3 pl-4 hover:bg-[#ffffff0f] transition-colors"
                              key={i}
                            >
                              <p>{item.name}</p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.li>
                ) : (
                  <li key={index} className="h-full">
                    <Link
                      to={link.path}
                      className={`group relative flex items-center px-2 py-1 text-base font-medium text-white transition-all duration-200 hover:text-[#00ffff]
                        ${matchRoute(link?.path) ? "text-[#00ffff]" : "text-white"}`}
                    >
                      {link.title}
                      <div className={`absolute bottom-0 left-0 h-[2px] w-full transform origin-left scale-x-0 bg-[#00ffff] transition-transform duration-200 group-hover:scale-x-100
                        ${matchRoute(link?.path) ? "scale-x-100" : "scale-x-0"}`}></div>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </nav>
          <div className="hidden items-center gap-x-4 md:flex">
            {user && (
              <Link to="/dashboard/cart" className="relative">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <AiOutlineShoppingCart className="text-2xl text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-[#00ffff] text-center text-xs font-bold text-black">
                      {totalItems}
                    </span>
                  )}
                </motion.div>
              </Link>
            )}
            {token === null && (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border border-gray-300 bg-transparent px-6 py-2 text-white hover:bg-white hover:text-black transition-all duration-200"
                  >
                    Log in
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-white px-6 py-2 text-black font-medium hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign up
                  </motion.button>
                </Link>
              </>
            )}
            {token !== null && <ProfileDropdown />}
          </div>
          <button className="mr-4 md:hidden">
            <AiOutlineMenu fontSize={24} fill="#ffffff" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;