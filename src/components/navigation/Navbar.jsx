import { Link ,useNavigate} from "react-router-dom";
import {useAuth} from "../../features/auth/AuthContext.jsx";
const Navbar = () => {
  const {isAuthenticated, user, logout} = useAuth();
  const navigate = useNavigate();
  const handleLogout = ()=>{
    logout();
    navigate('/');
  }
  return (
    <header className="w-full bg-evergreen-950/95 text-evergreen-50 border-b border-evergreen-800 sticky top-0 z-40 backdrop-blur">
      <nav className="mx-auto flex h-16 items-center justify-between px-4 max-w-6xl">
        {/* left logo + title */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-frosted-mint-400">
            <img
              src="https://i.pinimg.com/736x/13/ea/9d/13ea9d70df14a98b23f51fb7b8b663bb.jpg"
              alt="Study Point logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold tracking-tight md:text-base">
            Study Point
          </span>
        </div>

        {/* center links (desktop) */}
        <div className="hidden items-center gap-6 text-sm text-evergreen-100 md:flex">
          <Link to="/" className="transition hover:text-frosted-mint-300">
            Home
          </Link>
          <Link to="/about" className="transition hover:text-frosted-mint-300">
            About
          </Link>
          <Link to="/plans" className="transition hover:text-frosted-mint-300">
            Plans
          </Link>
          <Link
            to="/contacts"
            className="transition hover:text-frosted-mint-300"
          >
            Contacts
          </Link>
        </div>

        {/* right login/signup buttons */}

        <div className="hidden items-center gap-3 text-sm sm:flex">
          {isAuthenticated? (<>
          <button onClick={()=>{
            navigate('/profile')
          }}  className="px-4 py-2 rounded-xl bg-frosted-mint-400/20 backdrop-blur-sm text-frosted-mint-50 border border-frosted-mint-300/50 hover:bg-frosted-mint-300/30 hover:scale-[1.02] transition-all font-semibold text-sm shadow-lg hover:shadow-xl" >
            Profile ({user?.name || "Student"})
          </button>
          <button 
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-linear-to-r from-dark-emerald-700 to-pine-teal-700 text-evergreen-50 hover:from-dark-emerald-800 hover:to-pine-teal-800 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all ml-2"
        >
  Logout
</button>
          </>):( <>
           <Link
            to="/login"
            className="rounded-full border border-frosted-mint-400 px-3 py-1.5 text-frosted-mint-200 transition hover:bg-frosted-mint-100 hover:text-evergreen-950"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-frosted-mint-400 px-4 py-1.5 font-semibold text-evergreen-950 transition hover:bg-frosted-mint-300"
          >
            Sign Up
          </Link></>)}
          
          
         
        </div>

        {/* mobile menu icon (optional placeholder) */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-evergreen-100 hover:bg-evergreen-800 sm:hidden"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-5 bg-evergreen-100" />
          <span className="mt-1 block h-0.5 w-5 bg-evergreen-100" />
          <span className="mt-1 block h-0.5 w-5 bg-evergreen-100" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
