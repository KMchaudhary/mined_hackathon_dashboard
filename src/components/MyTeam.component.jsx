import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AutoTeamAssignForm from './AutoTeamAssignForm.component';

import CreateTeamForm from './CreateTeamForm.component';

export default function MyTeam() {
  const [myTeam, setMyTeam] = useState();
  const [finishUseEffect, setFinishUseEffect] = useState(false);
  const [problemStatements, setProblemStatements] = useState();
  const [choice, setChoice] = useState("");
  const [message, setMessage] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const url1 = 'http://localhost:8000/api/my_reg/reg/myTeam';
    const source = axios.CancelToken.source();
    const options = {
      cancelToken: source.token,
      headers: {
        'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
      }
    }

    axios.get(url1, options)
      .then(res => {
        const data = res.data;
        setMyTeam(data);
        setFinishUseEffect(true);
      })
      .catch(err => {
        if (axios.isCancel(err))
          return console.log('successfully aborted');
                
        // handle error
        const res = err.response;
        if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
          localStorage.clear();
          navigate('/login');
        }

        if(res.status === 404 || res.MyTeam === null) {
          setMyTeam();
          setFinishUseEffect(true);
        }
      });

    const url2 = 'http://localhost:8000/api/my_reg/reg/problemStatementsOnly';
    axios.get(url2, options)
      .then(res => {
        const data = res.data;
        setProblemStatements(data);
      })
      .catch(err => {
        if (axios.isCancel(err))
          return console.log('successfully aborted');
                
        // handle error
        const res = err.response;
        if((res.data.status === 'fail' && res.status === 403) || (res.data.error && res.data.error.name === 'JsonWebTokenError')) {
          localStorage.clear();
          navigate('/login');
        }
      });
  
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const clearChoice = () => {
    setChoice("");
  }

  return (
    <>
      {/* My Team */}
      <div className="my-team">
        <h1 className="text-white text-center text-2xl font-semibold py-2"><span className="py-2 border-b-4">My Team</span></h1>

        <div className="wrapper text-slate-400 min-h-[400px] flex justify-center items-center">
          {/* if team is not assigned */}
          {
            (!myTeam && finishUseEffect) &&
            <div>
              <div className={`${choice !== '' ? 'hidden' : ''}`}>
                <p className="text-lg text-center mb-3 py-8 px-4 font-bold bg-slate-800 rounded-lg">You have no team assign yet!</p> 
                <p className="text-center mb-3">Select one option</p>
                <div className="flex justify-center">                
                  <button 
                    className={`px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg`}
                    onClick={e => {setChoice("createTeam")}}
                  >Create new team</button>
                  
                  <div className="my-auto mx-4 font-semibold">OR</div>
                  
                  <button 
                    className={`px-3 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg`}
                    onClick={e => {setChoice("autoAssign")}}
                  >Assign team automatically</button>
                </div>

              </div>
              
              
            </div>
          }

          {/* if team is assigned */}
          {
            myTeam &&
            <div>My Team deatil is on console</div>
          }

          {
            choice === "createTeam" &&
            <CreateTeamForm clearChoice={clearChoice} problemStatements={problemStatements} />
          }

          {
            choice === "autoAssign" &&
            <AutoTeamAssignForm clearChoice={clearChoice} problemStatements={problemStatements} />
          }          
          
        </div>
      </div>
    </>
  )
}
