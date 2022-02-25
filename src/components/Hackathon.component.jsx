import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Hackathon() {
  const [hackathon, setHackathon] = useState();

  const navigate = useNavigate();

  const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

  useEffect(() => {
    const url = baseURL + '/api/my_reg/reg/hackathon';
    const source = axios.CancelToken.source();
    const options = {
      cancelToken: source.token,
      headers: {
        'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
      }
    }

    axios.get(url, options)
      .then(res => {
        const data = res.data;
        console.log(data);
        setHackathon(data)
      })
      .catch(err => {
        if (axios.isCancel(err))
          return console.log('successfully aborted');
                
        // handle error
        const res = err.response;
        if((res.data.status === 'fail' && res.status === 403) || res.data.error.name === 'JsonWebTokenError') {
          localStorage.clear();
          navigate('/myReg');
        }
      });
  
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Hackathon */}
      <div className="hackathon text-slate-300">
        <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4 rounded">Hackathon</span></h1>

        { hackathon && 
          <div className="wrapper my-8">
            <div className="ht-title mb-3">👉 {hackathon.title}</div>
            <p className="ht-description mb-3">{hackathon.description}</p>
            <div className="mb-3">
              <div className="font-semibold mb-2">Team size <span className="ml-3 text-blue-400 font-semibold">3 - 5 members</span></div>
              <div className="font-semibold mb-2">Hackathon registration status :<span className="ml-3 text-blue-400 font-semibold">{hackathon.enableRegistration ? 'Open' : 'Close'}</span></div>
              <div className="font-semibold mb-2">Hackathon team generation status :<span className="ml-3 text-blue-400 font-semibold">{hackathon.enableTeamGeneration ? 'Open' : 'Close'}</span></div>
            </div>
          </div>
        }
      </div>
    </>
  )
}
