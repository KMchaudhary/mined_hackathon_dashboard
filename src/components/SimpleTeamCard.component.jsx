import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function SimpleTeamCard({team}) {
    const [message, setMessage] = useState({show: false, type:"fail", message: ""});
    const navigate = useNavigate();

    const sendJoinRequest = (id) => {
        const url = 'http://localhost:8000/api/my_reg/reg/request';
        const options = {
            headers: {
              'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.post(url, {teamId: id}, options)
            .then(res => {
                const data = res.data;
                if(data.status === "success") {
                    setMessage({show: true, type:"success", message: data.message})
                }
            })
            .catch(err => {
                // handle error
            const res = err.response;
                if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
                    localStorage.clear();
                    navigate('/login');
                }
                else if(res.status === 500) {
                    setMessage({show: true, type:"fail", message: 'Something went wrong!'})
                }
                else if(res.data.status === 'fail') {
                    setMessage({show: true, type:"fail", message: res.data.message})
                } 
                else {
                    setMessage({show: true, type:"fail", message: 'Something went wrong!'})
                }
            })
    }

  return (
    <>
        <div className="public-team bg-slate-800 rounded-lg p-4 hover:ring">
            <div className="relative flex justify-between border-b pb-2">
                <div className="text-lg font-bold text-center text-white flex-grow tracking-wider">{team.teamName}</div>                      
            </div>
                      
            <div className="team-info mt-4">
                <div className="mb-3">
                    <div className="font-semibold mb-2">Problem statement</div>
                    <div className="text-white pl-3">{team.problemStatement.name}</div>
                </div>

                <div className="">
                    <div className="font-semibold mb-2">Members</div>
                    <div className="pl-3">
                        <ul>
                            {
                                team.members.map(member => (
                                    <li key={member.id} className="mb-2 py-1">
                                                  <div className="flex flex-row justify-between items-center">
                                                      <div className="text-white flex flex-row items-center">

                                                          {
                                                              team.captainId === member.id ?
                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-workspace" viewBox="0 0 16 16">
                                                                      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H4Zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                                                                      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.373 5.373 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2H2Z"/>
                                                                  </svg>
                                                              :
                                                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle inline-block" viewBox="0 0 16 16">
                                                                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                                                  </svg>
                                                          }                                                                        
                                                          <span className="ml-2">{member.nameOnCertificate}</span>
                                                          {
                                                              team.captainId === member.id ? <span className="ml-3 text-slate-400">(Captain)</span> : <></>
                                                          }
                                                      </div>
                                                      
                                                  </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>                            
            </div>

            <div className="">
                <div className="flex justify-center mb-3">
                    <button 
                        className="px-3 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg focus:ring-blue-300 focus:ring"
                        onClick={e => sendJoinRequest(team.id)}
                    >
                        Send join request
                    </button>
                </div>
                {
                    (message.show) &&
                    <div className={`border ${message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'} shadow-sm p-4 rounded-lg`}>
                        {message.message}
                    </div>
                }
                
            </div>

                      

        </div>
    </>
  )
}
