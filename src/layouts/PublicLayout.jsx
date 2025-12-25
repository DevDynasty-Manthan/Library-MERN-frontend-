import Navbar from '../components/navigation/Navbar.jsx';

const PublicLayout = ({children})=>{
   return(
    <div className="flex flex-col h-screen w-full">
    <Navbar />
    <main className="flex-1 w-full overflow-auto">{children}</main> 
    </div>
   )
}

export default PublicLayout;