import Axios from "axios";
import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [edits, setEdit] = useState(false);
  const [editIndex, setIndex] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Axios.get("https://todo-list-523q.onrender.com")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }, []);

  const add = () => {
    if (!task.trim() || !date.trim()) {
      alert("Task and date cannot be empty!");
      return;
    }

    // Adding to the frontend state before making API call
    const newTask = { task, date, complete: false };
    setTasks([...tasks, newTask]);

    // Send the task to the backend
    Axios.post("https://todo-list-523q.onrender.com/task", { task, date })
      .then((response) => {
        setMessage(response.data);
        console.log("Added task:", response.data);
      })
      .catch((err) => console.log(err));

    // Reset input fields
    setTask('');
    setDate('');
  };

  const toggleComplete = (id) => {
    Axios.put(`https://todo-list-523q.onrender.com/task/${id}`, { complete: true })
      .then((response) => {
        console.log(response.data);
        alert(response.data);
      })
      .catch((error) => {
        alert(error.message);
      });

    setTasks(prevTasks =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, complete: !task.complete } : task
      )
    );
  };

  const edit = (id) => {
    const taskToEdit = tasks.find(task => task._id === id);
    setEdit(true);
    setIndex(id);
    setTask(taskToEdit.task);
  };

  const update = () => {
    Axios.put(`https://todo-list-523q.onrender.com/task/${editIndex}`, { task, complete: false })
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        alert(error.message);
      });

    setTasks(prev => prev.map(t => t._id === editIndex ? { ...t, task: task } : t));
    setEdit(false);
    setIndex(null);
    setTask('');
  };

  const deleteTask = (id) => {
    Axios.delete(`https://todo-list-523q.onrender.com/task/${id}`)
      .then((response) => {
        alert(response.data);
        setTasks((prevTasks) => prevTasks.filter(task => task._id !== id));
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
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
              {edits === true ?
                <button className="add" onClick={update}>Update</button> :
                <button className="add" onClick={add}>Add</button>}
            </div>
          </div>
        </div>
        <div>
          {tasks.length > 0 ?
            tasks.map((task) => (
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
                  <button className="edit" onClick={() => edit(task._id)}>Edit</button>
                  <span>{task.date}</span>
                  <button className="delete" onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </div>
            )) : <div>No tasks available.</div>}
        </div>
      </div>
    </>
  );
}

export default App;
