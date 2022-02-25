import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SimpleTeamCard from './SimpleTeamCard.component'

export default function SearchTeam() {

    const [teamName, setTeamName] = useState("");
    const [team, setTeam] = useState();
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    const changeTeamName = (e) => {
        setTeamName(e.target.value);        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(teamName.trim() === "") return;
        
        const url = baseURL + '/api/my_reg/reg/teams/' + teamName;
        const options = {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
            }
        }

        axios.get(url, options)
            .then(res => {
                setTeam(res.data);
                setNotFound(false)
            })
            .catch(err => {
                // handle error
                const res = err.response;
                console.log(res);
                if(res.status === 403 && res.data.error.name === 'JsonWebTokenError') {
                    localStorage.clear();
                    navigate('/myReg');
                }

                if(res.data.status === "fail") {
                    setNotFound(true);
                }
            })
    }
    

    return (
        <>
            <div className="search team text-slate-300">
                 <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4 rounded">Search team</span></h1>
            
                <div className="wrapper py-8">
                    <form action="" method="get" onSubmit={handleSubmit}>
                        <div className="flex">
                            <input 
                                className="px-3 py-2 w-full bg-slate-100 text-slate-900 font-semibold outline-none focus:ring-blue-500 focus:ring rounded-l-lg" 
                                type="search"
                                placeholder='Search team by "team name"'
                                value={teamName}
                                onChange={changeTeamName}
                            />
                            <button 
                                className="px-3 py-2 bg-slate-700 text-white font-semibold outline-none hover:bg-slate-600 focus:ring focus:ring-slate-400 rounded-r-lg"
                            >Search</button>
                        </div>
                    </form>

                    <div className="flex justify-center items-center py-8">
                        <div className="max-w-[500px] w-full">
                            {
                                notFound && 
                                <div className="p-4 text-xl text-center bg-slate-800 rounded-lg text-slate-400">No team found! 🧐</div>
                            }
                            
                            {
                                (!notFound && !team) && 
                                <div className="p-4 text-xl text-center text-slate-400">👆 Search any team by "team name"  and send join request if you have not team</div>
                            }

                            {
                                (!notFound && team) &&
                                <SimpleTeamCard team={team} />
                            }

                            
                        </div>
                        
                    </div>
                </div>
            
            </div>
        </>
    )
}
