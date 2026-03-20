'use client';
import {useState,useEffect} from 'react';
import axios from 'axios';

export default function Home(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [token,setToken]=useState('');
  const [tasks,setTasks]=useState([]);
  const [title,setTitle]=useState('');

  const login=async()=>{
    const res=await axios.post('http://localhost:5000/auth/login',{email,password});
    setToken(res.data.access);
  };

  const load=async()=>{
    const res=await axios.get('http://localhost:5000/tasks',{
      headers:{Authorization:`Bearer ${token}`}
    });
    setTasks(res.data);
  };

  const add=async()=>{
    await axios.post('http://localhost:5000/tasks',{title},{
      headers:{Authorization:`Bearer ${token}`}
    });
    load();
  };

  return(
    <div style={{padding:20}}>
      <h1>Task Manager</h1>

      <input placeholder="email" onChange={e=>setEmail(e.target.value)}/>
      <input type="password" placeholder="password" onChange={e=>setPassword(e.target.value)}/>
      <button onClick={login}>Login</button>

      <hr/>

      <input placeholder="task" onChange={e=>setTitle(e.target.value)}/>
      <button onClick={add}>Add</button>

      <button onClick={load}>Load Tasks</button>

      {tasks.map((t:any)=>(
        <div key={t.id}>{t.title} - {t.completed?'Done':'Pending'}</div>
      ))}
    </div>
  );
}
