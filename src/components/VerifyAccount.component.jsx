import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function VerifyAccount() {

    const [message, setMessage] = useState({type: 'suceess', message: ''});
    const [useEffectFinish, setUseEffectFinish] = useState(false);

    const {confirmationCode} = useParams();

    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    useEffect(() => {
        const url = baseURL + '/api/user/verify/' + confirmationCode;
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
            if(data.status === 'success') {
                setMessage({type: 'success', message: data.message});
            }            
            setUseEffectFinish(true);
          })
          .catch(err => {
            if (axios.isCancel(err))
              return console.log('successfully aborted');
                    
            // handle error
            const res = err.response;
            if(res.data.status === 'fail') {
              if(res.data.message === 'jwt expired')
                setMessage({type: 'fail', message: 'Account verification timeout!'})
              else
                setMessage({type: 'fail', message: res.data.message});
              // navigate('/login');
            }
            setUseEffectFinish(true);
          });
      
        return () => {
          // cancel the request before component unmounts
          source.cancel();
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-3 py-5 bg-slate-900">
            
            {
                useEffectFinish &&
                <div>
                    <div className={`message max-w-[400px] w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                        {message.message}
                    </div>

                    <Link 
                        to="/login"
                        className="text-blue-400 flex justify-center w-full hover:text-blue-500 items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                        <span className="ml-2">Back to login</span>
                    </Link>
                </div>
            }
            
        </div>
    )
}
