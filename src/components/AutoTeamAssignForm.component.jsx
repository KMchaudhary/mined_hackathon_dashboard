import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AutoTeamAssignForm({clearChoice, problemStatements}) {
    const [message, setMessage] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [psId, setPsId] = useState("");
    const navigate = useNavigate();

    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    const handleSubmit = (e) => {
        e.preventDefault();
        if(psId.trim() === "") {
            setMessage('Please! Select problem statement before submit');
            setSuccessMsg("");
            return;
        }

        const url = baseURL + '/api/my_reg/reg/myTeam/autoAssign';
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        const data = {
            problemStatementId: psId.trim()
        }

        axios.post(url, data, options)
        .then(res => {
            const data = res.data;
            if(data.status === "success") {
                setMessage("");
                setSuccessMsg(data.message);
            }
            
        })
        .catch(err => {                
            // handle error
            const res = err.response;
            if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
                localStorage.clear();
                navigate('/login');
            }

            if(res.status === 500) {
                setMessage("Something went wrong!");
                setSuccessMsg("");
            }

            if(res.data.status === 'fail') {
                setMessage(res.data.message);
                setSuccessMsg("");
            } 
        });
    }

    return (
        <>
            <div className="max-w-[400px] w-full my-8">
                {
                    (message !== "") &&
                    <div className="message max-w-[400px] w-full p-4 text-red-500 border border-red-500 rounded-lg mb-3">
                        {message}
                    </div>
                }

                <div className="create-team-form bg-slate-800 p-4 rounded-lg max-w-[400px] w-full my-8">
                    <h3 className="mb-4 text-xl font-semibold text-blue-500 text-center">Auto team assign</h3>

                    <form id="autoTeamAssignForm" action="" onSubmit={handleSubmit}>

                        <div className="mb-4">
                        <label className="block mb-2" htmlFor="teamName">Select problem statement</label>
                        <div className="relative mb-2">
                            <select 
                                className="input-el block w-full appearance-none"
                                name="problemStatementId"
                                id="problemStatementId"
                                value={psId || ""}
                                onChange={e => setPsId(e.target.value)}
                            >
                                <option value="">-- Select one --</option>
                            
                                {
                                    problemStatements.map((ps) => (
                                        <option key={ps.id} value={ps.id}>{ps.name}</option>
                                    ))
                                }
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="font-bold mr-2">Note:</div>
                            <div>Once our algorithm assign team automatically you can not change team</div>
                        </div>
                        </div>
                        
                        <div className="flex flex-row justify-end">
                        <button 
                            className="px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg mr-3 focus:ring-slate-400 focus:ring"
                            onClick={clearChoice}
                        >Close</button>

                        <input 
                            className="px-3 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg focus:ring-blue-500 focus:ring" 
                            type="submit" 
                            value="Submit" />
                        </div>

                    </form>
                </div>

                {
                    (successMsg !== "") &&
                    <div className="message max-w-[400px] w-full p-4 text-green-500 border border-green-500 rounded-lg my-3">
                        {successMsg} <br /> Refresh page to see your team information.
                    </div>
                }
            </div>
            
        </>
    )
}
