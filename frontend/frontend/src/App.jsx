import{Routes,Route,Navigate,useLocation} from "react-router";
import Login from"./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { checkAuth } from "./authSlice";
import { useDispatch,useSelector} from "react-redux";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/admin";
import AdminDelete from "./components/AdminDelete";
import AdminUpdate from "./components/AdminUpdate";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

function App(){
 

const {isAuthenticated,loading,user} = useSelector((state)=>state.auth);
const dispatch = useDispatch();
const location = useLocation();


useEffect(()=>{
    dispatch(checkAuth());
  },[ dispatch]);

  if (loading && (location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin"))) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}


  return(
    <>
    <Routes>
       <Route path="/" element={<Landing />}></Route>
       <Route path="/problems" element={<Homepage />}></Route>
       <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}></Route>
       <Route path="/login" element={isAuthenticated ?<Navigate to={location.state?.from || "/problems"} replace/>:<Login></Login>}></Route>
       <Route path="/signup" element={isAuthenticated ?<Navigate to={location.state?.from || "/problems"} replace/>:<Signup></Signup>}></Route>
       <Route path="/admin" element={isAuthenticated && user?.role === "admin" ? <Admin/> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === "admin" ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/update" element={isAuthenticated && user?.role === "admin" ? <AdminUpdate /> : <Navigate to="/" />} />
       <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
    </Routes>
    </>
  )
}

export default App;
