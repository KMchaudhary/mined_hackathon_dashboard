import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Requests() {

  const [requestSend,setRequestSend] = useState();
  const [requestReceived, setRequestReceived] = useState();
  const [message, setMessage] = useState({show: false, type: 'fail', message: ''});

  const navigate = useNavigate();

  const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

  useEffect(()=>{
    const url = baseURL + '/api/my_reg/reg/request';
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
        setRequestReceived(data.requestReceived)
        setRequestSend(data.requestSend)
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

  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  const rejectRequest = (id) => {
    handleSubmit(id, false);
  }

  const acceptRequest = (id) => {
    handleSubmit(id, true);
  }

  const handleSubmit = (id, accept) => {
    const url = baseURL + '/api/my_reg/reg/request/' + id;
    const options = {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
      }
    }
    const data = {
      accept: accept
    }

    axios.post(url, data, options)
      .then(res => {
        const data = res.data;
        if(data.status === "success") {
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
          navigate('/myReg');
        }

        // if(res.data.status === 'fail') {
        //  setMessage(res.data.message);
        // } 
    });

  }

  return (
    <>
      <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4">Requests</span></h1>
      <div className="request wrapper">

        <div className="text-slate-400">
          <div className="mb-4">
            {
              message.show &&
              <div className={`message w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                {message.message}
              </div>
            }
          </div>

          <div className="mb-4">
            <h1 className="text-lg font-semibold text-white mb-2">Send Requests</h1>
            {
              (requestSend && requestSend.length > 0) &&
              <ul className="block list-none mb-4">
              {
                requestSend.map(send => (
                  <li key={send.id} className="py-2 px-4 bg-slate-800 flex justify-between items-center">
                    <div className="text-white"><span className="text-slate-400 font-semibold text-sm">To : </span>{send.teamName}</div>
                    <div className="font-semibold">{(!send.isAccepted && !send.isRejected) ? 'waiting' : (send.isAccepted ? 'Accepted' : 'Rejected')}</div>
                  </li>
                ))
              }
              </ul>
            }

            {
              (requestSend && requestSend.length === 0) &&
              <div className="p-4 bg-slate-800 rounded-lg">
                No request sended yet!
              </div>
            }
            
          </div>

          <div>
            <h1 className="text-lg font-semibold text-white mb-2">Received Requests</h1>
            {
              (requestReceived && requestReceived.length > 0) &&
              <ul className="block list-none">

                {
                  requestReceived.map(receive => (
                    <li key={receive.id} className="py-2 text-slate-300 bg-slate-800 px-4 flex justify-between items-center">
                      <div className="text-white"><span className="text-slate-400 font-semibold text-sm">To : </span>{receive.senderName}</div>
                      <div>
                        <button 
                          className="px-3 py-1 font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg mr-3"
                          onClick={e => rejectRequest(receive.id)}
                        >Reject</button>

                        <button 
                          className="px-3 py-1 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg"
                          onClick={e => acceptRequest(receive.id)}
                        >Accept</button>
                      </div>
                    </li>  
                  ))
                }

              </ul>
            }
            {
              (requestReceived && requestReceived.length === 0) &&
              <div className="p-4 bg-slate-800 rounded-lg">
                No request received yet!
              </div>
            }
          </div>
        </div>
        
      </div>
    </>
  )
}
