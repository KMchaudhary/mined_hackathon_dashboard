import logo from '../MINeD_LOGO.png';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function MyRegistrations() {

  const [registrations, setRegistrations] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const url = 'http://localhost:8000/api/my_reg';
    const source = axios.CancelToken.source();
    const options = {
      cancelToken: source.token,
      headers: {
        'authorization': `Bearer ${localStorage.getItem('user_token')}`
      }
    }

    axios.get(url, options)
      .then(res => {
        const data = res.data;
        console.log(data);
        setRegistrations(data)
      })
      .catch(err => {
        if (axios.isCancel(err))
          return console.log('successfully aborted');
                
        // handle error
        const res = err.response;
        if((res.data.status === 'fail' && res.status === 403) || res.data.error.name === 'JsonWebTokenError') {
          localStorage.clear();
          navigate('/login');
        }
      });
  
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
  

  const openDashboard = (id) => {
    const url = 'http://localhost:8000/api/my_reg/' + id;
    console.log('url', url);
    const options = {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('user_token')}`
      }
    }

    axios.get(url, options)
      .then(res => {
        const data = res.data;
        console.log(data);
        if(data.status === 'success') {
          localStorage.setItem('reg_token', data.token);
          navigate('/user/dashboard');
        }
      })
      .catch(err => {
        // handle error
        const res = err.response;
        if((res.data.status === 'fail' && res.status === 403) || res.data.error.name === 'JsonWebTokenError') {
          localStorage.clear();
          navigate('/login');
        }
      });
  }

  return (
    <>
      <div className="bg-slate-900 min-h-screen">
        {/* Header */}
        <header>
          <div className="px-4 sm:px-8 flex flex-row justify-between items-center border-b">
            <div className="left">
              <div className="Logo">
                <img className="h-12 sm:h-16" src={logo} alt="Mined Hackathon" />
              </div>
            </div>
            <div className="center text-white hidden sm:block sm:text-xl text-lg tracking-wider font-bold">My Registrations</div>
            <div className="right">
              <button className="nav-item-red text-red-500" onClick={e => {
                localStorage.clear();
                navigate('/login');
              }}>Logout</button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="px-4 py-8">
          <div className="container">
            <h1 className="sm:hidden text-lg text-white font-bold text-center mb-4">My registrations</h1>

            {
              (registrations && registrations.length === 0) &&
              <div className="flex justify-center items-center p-4">
                No Items found!
              </div>
            }
            {
              (registrations && registrations.length !== 0) &&
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {
                registrations.map((reg) => (
                  <div 
                    key={reg.id.toString()} 
                    className="bg-slate-800 cursor-pointer rounded-lg drop-shadow transition hover:scale-105 hover:border" 
                    onClick={e => openDashboard(reg.id)}
                  > 
                    <div to="" className="block p-4">
                      <div className="title text-white font-semibold text-lg">
                        {reg.hackathon.title}
                      </div>
                      <div className="description text-slate-400">
                        {reg.hackathon.description}
                      </div>
                    </div>
                  </div>
                ))               
                
              }
              </div>
            }
            
          </div>
        </main>

      </div>      
    </>
  )
}
