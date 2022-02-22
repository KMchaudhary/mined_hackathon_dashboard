import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProblemStatements() {
  const [problemStatements, setProblemStatements] = useState();

  const navigate = useNavigate();

  useEffect(() => {

    const url = 'http://localhost:8000/api/my_reg/reg/problemStatements';
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
        setProblemStatements(data)
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

  return (
    <>
      <div className="ps text-slate-300">
        <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4">Problem statements</span></h1>

        <div className="wrapper my-8">
          <ol className="list-decimal px-6">
            {
              problemStatements &&
              problemStatements.map(ps => (
                <li key={ps.id.toString()} className="py-4 border-b text-blue-300 font-bold">
                  <div className="ps-title">{ps.name}</div>
                  <p className="ps-body">{ps.body}</p>
                </li>
              ))
              
            }
          </ol>
        </div>
      </div>
    </>
  )
}
