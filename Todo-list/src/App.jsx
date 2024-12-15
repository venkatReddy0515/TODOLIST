import Axios from "axios";
import { useEffect, useState } from 'react';
import './App.css';
import { trusted } from "mongoose";
function App() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [edits,setEdit]=useState(false);
  const [editIndex,setIndex]=useState(null);
  const [message,setMessage]=useState('');

  useEffect(()=>{
    Axios.get("https://todo-list-backend-oofk.onrender.com")
    .then((response)=>{
      setTasks(response.data);
      console.log(tasks);
    })

  },[])
  const add = () => {
    if (!task.trim() || !date.trim()) {
      alert("Task and date cannot be empty!");
      return;
    }
    setTasks([...tasks, { task, date, complete: false }]);
    Axios.post("https://todo-list-backend-oofk.onrender.com/task",{task,date})
    .then((response)=>{
      setMessage(response);
      console.log(response);
    })
    .catch((err)=>
      console.log(err)
    )
    setTask('');
    setDate('');
  };

  const toggleComplete = (index) => {

    Axios.put(`https://todo-list-backend-oofk.onrender.com/task/${index}`,{task,complete:true})
    .then((response)=>{
      console.log(response.data);
      alert(response.data);
    })
    .catch((error)=>{
      alert(error.message);
    })
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === index ? { ...task, complete: !task.complete } : task
      )
    );
  };
  const edit=(index)=>{
  
    setEdit(true);
    setIndex(index);
    tasks.map((t)=>{
      t._id===index?setTask(t.task):console.log("not task found..");
    });
    
  }
  const update=()=>{
    Axios.put(`https://todo-list-backend-oofk.onrender.com/task/${editIndex}`,{task,complete:false})
    .then((response)=>{
      console.log(response.data);
      alert(response.data);
    })
    .catch((error)=>{
      alert(error.message);
    })
    setTasks((prev)=>prev.map((t)=>t._id===editIndex?{...t,task:task}:t))
    setIndex(null);
    setTask('');
    setEdit(false);
  }

  const Delete = (index) => {
    Axios.delete(`https://todo-list-backend-oofk.onrender.com/task/${index}`)
    .then((response)=>{
      alert(response.data)
    })
    .catch((error)=>{
      alert(error.data)
    })
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== index)
    );
  };

  return (
    <>
      <div>
        <div>
          <div className="container">
            <div className="search-bar">
              <div className="heading">
                <h1>Todo-List <span>React</span></h1>
              </div>
              <div className="input">
                <input
                  type="text"
                  name="task"
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Add Task"
                />
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {edits===true?<button className="add" onClick={update}>Update</button>:<button className="add" onClick={add} >Add</button>}
                
              </div>
            </div>
          </div>
          <div>
            {tasks.length >0 ?tasks.map((task) => (
              <div className="div" key={task._id}>
                <div className="tasks">
                  <input
                    type="checkbox"
                    name="box"
                    id="box"
                    checked={task.complete}
                    onChange={() => toggleComplete(task._id)}
                  />
                  <h1 className={task.complete ? "complete" : "not"}>{task.task}</h1>
                  <button className="edit" onClick={()=>edit(task._id)}>Edit</button>
                  <span>{task.date}</span>
                  <button className="delete" onClick={() => Delete(task._id)}>Delete</button>
                </div>
              </div>
            )):<div></div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
