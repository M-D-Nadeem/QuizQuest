import React, {useEffect, useState} from 'react'
import { getUserInfo } from '../apicalls/users'
import {message} from 'antd'
import { useDispatch } from 'react-redux'
import { SetUser } from '../redux/usersSlice'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import { RiRobot3Fill } from "react-icons/ri";
import { CiChat1 } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({children}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.users.user)
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const userMenu = [
    {
      title: "Home",
      paths: ["/","/user/write-exam/:id"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/user/reports")
    },
    {
      title:"Ai quiz",
      paths:["/quiz/ai"],
      icon:<RiRobot3Fill />,
      onClick: ()=>navigate("/quiz/ai")
    },
    // {
    //   title:"Discussion section",
    //   paths:["/chat"],
    //   icon:<CiChat1 />,
    //   onClick: ()=>navigate("/chat")
    // },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className='ri-logout-box-line'></i>,
      onClick: ()=>{
        localStorage.removeItem("token")
        navigate("/login");
      }
    }
  ] 
  const adminMenu = [
    {
      title: "Home",
      paths: ["/","/user/write-exam/:id"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/")
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add", "/admin/exams/edit/:id"],
      icon: <i className='ri-file-list-line'></i>,
      onClick: () => navigate("/admin/exams")
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: ()=>navigate("/admin/reports")
    },
    // {
    //   title: "Profile",
    //   paths: ["/profile"],
    //   icon: <i className='ri-user-line'></i>,
    //   onClick: ()=>navigate("/profile")
    // },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className='ri-logout-box-line'></i>,
      onClick: ()=>{
        localStorage.removeItem("token")
        navigate("/login");
      }
    }
  ]
  const getUserData = async() => {
    try{
      dispatch(ShowLoading())
      const response = await getUserInfo()
      dispatch(HideLoading())
      if(response.success){
        message.success(response.message)
        dispatch(SetUser(response.data))
        if(response.data.isAdmin){
              setMenu(adminMenu)
        }
        else{
              setMenu(userMenu)
        }
      }
      else{
        dispatch(HideLoading())
        
        console.log(response.message);
        message.error(response.message)
      }
    }
    catch(error){
        message.error(error.message)
        navigate("/login")
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // convert to seconds

        if (decodedToken.exp < currentTime) {
          // Token is expired
          localStorage.removeItem('token'); // Optionally remove the token
          navigate('/login');
        } else {
          // Token is valid, fetch user data if not already loaded
          if (!user) {
            getUserData();
          }
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, user]);
  const activeRoute = window.location.pathname;
  const getIsActiveOrNot = (paths) => {
      if(paths.includes(activeRoute)){
        return true;
      }
      else{
        if(activeRoute.includes("/admin/exams/edit")&&paths.includes("/admin/exams")){
          return true
        }
        if(activeRoute.includes("/user/write-exam/:id")&&paths.includes("/user/write-exam/:id")){
          return true
        }
        return false;
      }
  }
  return (
    user && <div className='layout'>
     <div className='flex gap-2 h-100'>
       <div className='sidebar'>
         <div className='menu'>
            {menu.map((item,index)=>{
              return(
                <div className={`menu-item ${getIsActiveOrNot(item.paths)&&"active-menu-item"}`} key={index} onClick={item.onClick}>
                    {item.icon}
                    {!collapsed&&<span>{item.title}</span>}
                </div>
              )
            })}
         </div>
       </div>
       <div className='body'>
         <div className='header flex justify-between'>
         <div className='cursor-pointer'>
          {!collapsed&&<i className="ri-close-line text-2xl flex items-center"
          onClick={()=>setCollapsed(true)}></i>}
          {collapsed&&<i className="ri-menu-2-line text-2xl flex items-center" onClick={()=>setCollapsed(false)}></i>}
         </div>
         <h1 className='text-2xl text-white flex items-center'>
           Quiz Portal 
         </h1>
         <div>
         <div className='flex justify-center items-center gap-1'>
          <i className="ri-user-line"></i>
          {user?.name}
         </div>
         <span>Role : {(user?.isAdmin)?"Admin":"User"}</span>
         </div>
         </div>
         <div className='content'>
            {children}
         </div>
       </div>
     </div>
    </div>
  )
}

export default ProtectedRoute