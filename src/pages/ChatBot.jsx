import React,{useContext,useState,useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { useSelector } from 'react-redux';

const Home = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName,setProjectName]=useState("");
  const [project,setProject]=useState([]);
  const navigate=useNavigate();
  const { token } = useSelector((state) => state.auth)
      
  async function createProject(e){ 
    e.preventDefault();
    const res = await apiConnector("POST", "http://localhost:4000/projects/create",{name:projectName} , {
      Authorization: `Bearer ${token}`,
    });
    getProject();
    setIsModalOpen(false);
  }    

  async function getProject(){
    const res = await apiConnector("GET", "http://localhost:4000/projects/all", null, {
      Authorization: `Bearer ${token}`,
  });
  
    setProject(res.data.projects);
  }

  useEffect(() => {
    getProject();
  },[]);
 
  return (  
    <main className='p-4 flex flex-wrap gap-3 mt-16 bg-white'>

      <div className=''>
        <button onClick={()=>setIsModalOpen(true)} className='p-4 h-full justify-center items-center text-lg font-medium flex gap-3 border border-slate-300 rounded-md'>
          New Project
          <i className="ri-link"></i>
        </button>
      </div>


      {
        project.map((project)=>(
          <div key={project._id} 
               className='p-4 cursor-pointer flex gap-2 flex-col border border-slate-300 rounded-md min-w-[200px] hover:bg-slate-200'
               onClick={()=>{navigate('/project',{
                state:{project}
               })}}
               >
            <h2 className='text-lg font-medium '>
              {project.name}
            </h2>
            <div>
              <span> <small className='text-[15px]'> <i className="ri-user-line"> </i> Collaborators: </small> </span>
              {project.users.length}
            </div>
          </div>
        ))
      }


      {isModalOpen && (
        <div className='fixed flex inset-0 bg-black bg-opacity-50 items-center justify-center'>
        <div className='flex bg-white flex-col justify-center p-6 pl-5 rounded-md gap-5'>
          <div className=' text-[30px] font-medium tracking-tighter'>
            Create New Project
          </div>
          <form onSubmit={createProject}>
            <label>
              <p className='text-[20px] tracking-tighter'>Project Name</p>
              <input required 
                     name='project'
                     value={projectName}
                     className='border border-gray-400 mb-6 mt-2 text-lg rounded-md h-[50px] w-full'
                     type='text'
                     onChange={(e)=>setProjectName(e.target.value)}
                     />
            </label>
            <div className='flex justify-around gap-4 items-center'>
              <button className='bg-slate-300 p-3 px-5 font-semibold rounded-md text-lg' onClick={()=>setIsModalOpen(false)}>Cancel</button>
              <button className='bg-blue-600 p-3 px-5 font-semibold text-white rounded-md text-lg' type='submit'>Create</button>
            </div>
          </form>
        </div>
        </div>
      )}

    </main>
  )
}

export default Home