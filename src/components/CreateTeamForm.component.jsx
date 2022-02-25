import axios from 'axios';
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateTeamForm({clearChoice, problemStatements}) {

    const [inputs, setInputs] = useState({
        teamName: '',
        problemStatementId: '',
        isPublic: false,
        allowAutoMemberAssign: false
    });
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
        
        const url = baseURL + '/api/my_reg/reg/myTeam/create';
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.post(url, data, options)
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
                setMessage(res.data.message);
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

                <div className="create-team-form bg-slate-800 p-4 rounded-lg">
                    <h3 className="mb-4 text-xl font-semibold text-green-500 text-center">Create new team</h3>

                    <form id="createTeamForm" action="" onSubmit={handleSubmit}>
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
                        
                        <div className="flex flex-row justify-end">
                        <button 
                            className="px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring mr-3"
                            onClick={clearChoice}
                        >Close</button>

                        <input 
                            className="px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg focus:ring-green-300 focus:ring" 
                            type="submit" 
                            value="Create" />
                        </div>

                    </form>
                </div>

            </div>
            
            
        </>
    )
}
