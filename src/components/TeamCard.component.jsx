import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function TeamCard({team, problemStatements}) {
    const [edit, setEdit] = useState(false);
    const [leaveForm, setLeaveForm] = useState({show: false, teamName: ''});
    const [deleteForm, setDeleteForm] = useState({show: false, teamName: ''});
    const [inputs, setInputs] = useState({
        teamName: team.teamName,
        problemStatementId: team.problemStatementId,
        isPublic: team.isPublic,
        allowAutoMemberAssign: team.allowAutoMemberAssign
    });
    const [removeList, setRemoveList] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // teamName, problemStatementId,isPublic,allowAutoMemberAssign
        if(!inputs.teamName || inputs.teamName.trim() === "" || !inputs.problemStatementId || inputs.problemStatementId.trim() === "") {
            setMessage('Please fill all required fields');
            return;
        }
        const data = inputs;
        data.removeList = removeList;
        
        const url = baseURL + '/api/my_reg/reg/myTeam/' + team.id;
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.patch(url, data, options)
        .then(res => {
            const data = res.data;
            if(data.status === "success") {
                window.location.reload();
            }            
        })
        .catch(err => {                
            // handle error
            const res = err.response;
            if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
                localStorage.clear();
                navigate('/login');
            }

            if(res.data.status === 'fail') {
                setMessage({show: true, type: 'fail', message: res.data.message});
            } 
        });
    }

    const pushInRemoveList = (id) => { 
        setRemoveList(values => [...values, id]);
    }

    const leaveTeam = (e) => {
        e.preventDefault();
        if(team.teamName !== leaveForm.teamName) return;
        
        // leave team
        const url = baseURL + '/api/my_reg/reg/myTeam/' + team.id + '/leave'
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.get(url, options)
            .then(res => {
                const data = res.data;
                if(data.status === 'success') {
                    setMessage({show: true, type: 'success', message: data.message});
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(err => {
                // handle error
                const res = err.response;
                if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
                    localStorage.clear();
                    navigate('/login');
                }

                if(res.data.status === 'fail') {
                    setMessage({show: true, type: 'fail', message: res.data.message});
                }
            })
    }

    const deleteTeam = (e) => {
        e.preventDefault();
        if(team.teamName !== deleteForm.teamName) return;
        
        // leave team
        const url = baseURL + '/api/my_reg/reg/myTeam/' + team.id + '/delete'
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.get(url, options)
            .then(res => {
                const data = res.data;
                if(data.status === 'success') {
                    setMessage({show: true, type: 'success', message: data.message});
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(err => {
                // handle error
                const res = err.response;
                if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
                    localStorage.clear();
                    navigate('/login');
                }

                if(res.data.status === 'fail') {
                    setMessage({show: true, type: 'fail', message: res.data.message});
                }
            })
    }

    return (
        <>
            {
                !edit &&
                <div className="max-w-[500px] w-full py-4">
                    {
                        message.show &&
                        <div className={`message w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                            {message.message}
                        </div>
                    }
                    <div className="team w-full p-4 bg-slate-800 rounded-lg my-8">
                        
                        <div className="relative flex justify-between border-b pb-2">
                            <div className="text-lg font-bold text-center text-white flex-grow">{team.teamName}</div>

                            {
                                (team.isCaptain && !edit) &&  
                                <button 
                                    className="hover:text-white title-guid"
                                    onClick={e => setEdit(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                                    </svg>
                                    <span className="title-guid-text-left">Edit team</span>
                                </button>
                            }                        

                        </div>
                        
                        <div className="team-info mt-3">
                            <div className="mb-3">
                                <div className="font-semibold mb-2">Problem statement</div>
                                <div className="text-white pl-3">{team.problemStatement.name}</div>
                            </div>
                            
                            <div className="mb-3">
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

                                                        {   
                                                            (edit && team.captainId !== member.id) &&
                                                            <div className="remove-member flex items-center">
                                                                <button className="hover:text-red-500 title-guid">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-x-fill" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
                                                                    </svg>
                                                                    <span className="title-guid-text-left">Remove member</span>
                                                                </button>
                                                            </div>
                                                        }
                                                        
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 font-semibold">
                                    Public team: <span className="text-blue-400">{team.isPublic ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="mb-2 font-semibold">
                                    Allow auto members assign: <span className="text-blue-400">{team.allowAutoMemberAssign ? 'Yes' : 'No'}</span>
                                </div>
                            </div>           
                        </div>

                        <div className="flex justify-center">
                            <div>
                                
                            </div>
                            {
                                !team.isCaptain &&  
                                <div className="pt-3 mt-2 border-t w-full">
                                    {
                                        !leaveForm.show &&
                                        <button 
                                            className="flex items-center px-3 py-2 font-semibold text-red-500 border-red-500 border rounded-lg focus:ring-red-300 focus:ring-1" 
                                            title="Leave team"
                                            onClick={e => 
                                                setLeaveForm(values => ({...values, show: true}))
                                            }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16">
                                                <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z"/>
                                            </svg>
                                            <span className="ml-2">Leave the team</span>
                                        </button>
                                    }
                                    {
                                        leaveForm.show &&
                                        <form id="leaveTeamForm" action="" onSubmit={leaveTeam}>
                                            <div className="flex flex-row">
                                                <input 
                                                    type="text" 
                                                    className="input-el flex-grow"
                                                    placeholder="Confirm team name here"
                                                    value={leaveForm.teamName || ''}
                                                    onChange={e =>                                             
                                                        setLeaveForm(values => ({...values, teamName: e.target.value}))
                                                    }
                                                />
        
                                                <button 
                                                    className="ml-3 px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring"
                                                    onClick={e =>{
                                                        e.preventDefault();
                                                        setLeaveForm(values => ({...values, show: false}))
                                                    }}
                                                >Cancle</button> 
        
                                                <button
                                                    type="submit"
                                                    className="ml-3 px-3 py-2 font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg focus:ring-red-300 focus:ring"
                                                >Leave</button> 
                                            </div>
                                        </form>
                                    }
                                </div>
                                
                            }
                        </div>
                    </div>
                </div>
                
            }

            {
                (edit && team.isCaptain) &&
                <div className="max-w-[500px] w-full my-8">
                    {
                        message.show &&
                        <div className={`message w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                            {message.message}
                        </div>
                    }
                    <div className="edit-team p-4 bg-slate-800 rounded-lg">
                        <form id="editTeamForm" action="" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2" htmlFor="teamName">Team name <span className="text-red-500">*</span></label>
                                <input 
                                    className="input-el" 
                                    type="text" 
                                    id="teamName"
                                    name="teamName"
                                    value={inputs.teamName || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-4">
                            <label className="block mb-2" htmlFor="problemStatementId">Select problem statement <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select 
                                    className="input-el block w-full appearance-none"
                                    name="problemStatementId"
                                    id="problemStatementId"
                                    value={inputs.problemStatementId}
                                    onChange={handleChange}
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
                            </div>

                            <div className="mb-4 flex flex-row items-center">
                            <input 
                                className="w-4 h-4 mr-3" 
                                type="checkbox" 
                                name="isPublic" 
                                id="isPublic"
                                checked={inputs.isPublic || false}
                                onChange={handleChange}
                            />
                            <label className="leading-6" htmlFor="isPublic">Make team public</label>
                            </div>
                            
                            <div className="mb-4 flex flex-row items-center">
                                <input 
                                    className="w-4 h-4 mr-3" 
                                    type="checkbox" 
                                    name="allowAutoMemberAssign" 
                                    id="allowAutoMemberAssign" 
                                    checked={inputs.allowAutoMemberAssign || false}
                                    onChange={handleChange}
                                />
                                <label className="leading-6" htmlFor="allowAutoMemberAssign">Allow auto team assign</label>
                            </div>

                            <div className="mb-4">
                                <div className="mb-2">Members</div>
                                <div className="pl-3">
                                    <ul>
                                        {
                                            team.members.map(member => (
                                                !removeList.includes(member.id) &&
                                                <li key={member.id} className="mb-2 py-1">
                                                    <div className={`flex flex-row justify-between items-center`}>
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

                                                        {
                                                            (edit && team.captainId !== member.id) &&
                                                            <div className="remove-member flex items-center">
                                                                <button 
                                                                    className="hover:text-red-500 title-guid"
                                                                    onClick={e => {
                                                                        e.preventDefault()
                                                                        pushInRemoveList(member.id)
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-x-fill" viewBox="0 0 16 16">
                                                                        <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
                                                                    </svg>
                                                                    <span className="title-guid-text-left">Remove member</span>
                                                                </button>
                                                            </div>
                                                        }
                                                        
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>         
                                </div>
                            </div> 
                            <hr className='my-3' />
                            <div className="flex flex-row justify-end">
                                <button 
                                    className="px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring mr-3"
                                    onClick={e => {
                                        setEdit(false)
                                        setRemoveList([])
                                    }}
                                >Close</button>

                                <input 
                                    className="px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg focus:ring-green-300 focus:ring" 
                                    type="submit" 
                                    value="Save changes" />
                            </div>
                        </form>
                    </div>

                    <div className="p-4 bg-slate-800 rounded-lg mt-4">
                        <div className="flex">
                            
                                <div>
                                    {
                                        !deleteForm.show &&
                                        <button 
                                            className="flex items-center px-3 py-2 font-semibold text-red-500 border-red-500 border rounded-lg focus:ring-red-300 focus:ring-1" 
                                            title="Leave team"
                                            onClick={e => 
                                                setDeleteForm(values => ({...values, show: true}))
                                            }
                                        >
                                            Delete team
                                        </button>
                                    }
                                    {
                                        deleteForm.show &&
                                        <form id="deleteTeamForm" action="" onSubmit={deleteTeam}>
                                            <div className="flex flex-row">
                                                <input 
                                                    type="text" 
                                                    className="input-el flex-grow"
                                                    placeholder="Confirm team name here"
                                                    value={deleteForm.teamName || ''}
                                                    onChange={e =>                                             
                                                        setDeleteForm(values => ({...values, teamName: e.target.value}))
                                                    }
                                                />
        
                                                <button 
                                                    className="ml-3 px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring"
                                                    onClick={e =>{
                                                        e.preventDefault();
                                                        setDeleteForm(values => ({...values, show: false}))
                                                    }}
                                                >Cancle</button> 
        
                                                <button
                                                    type="submit"
                                                    className="ml-3 px-3 py-2 font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg focus:ring-red-300 focus:ring"
                                                >Delete</button> 
                                            </div>
                                        </form>
                                    }
                                </div>
                        </div>
                    </div>
                </div>
                
            }
            
        </>
    )
}
