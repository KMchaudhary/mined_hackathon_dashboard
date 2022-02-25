import logo from '../MINeD_LOGO.png'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ChangePassword() {
    const [verify, setVerify] = useState(false);
    const [useEffectFinish, setUseEffectFinish] = useState(false);
    const [inputs, setInputs] = useState({});
    const [showPass, setShowPass] = useState(false);
    const [message, setMessage] = useState({show: false, type: 'fail', message: ''});

    const {confirmationCode} = useParams();
    
    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    useEffect(() => {
        const url = baseURL + '/api/user/forgot/' + confirmationCode;
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
            setUseEffectFinish(true);
            if(data.status === 'success') {
                setVerify(true);
            }
          })
          .catch(err => {
            if (axios.isCancel(err))
              return console.log('successfully aborted');
                    
            // handle error
            const res = err.response;
            if(res.data.status === 'fail') {
              setVerify(false);
              if(res.data.message === 'jwt expired')
                setMessage({show: true, type: 'fail', message: 'Password update timeout!'})
              else
                setMessage({show: true, type: 'fail', message: res.data.message});
              // navigate('/login');
            }
            setUseEffectFinish(true);
          });
      
        return () => {
          // cancel the request before component unmounts
          source.cancel();
        }
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      if(inputs.password !== inputs.confirmPassword) {
        setMessage("Confirm password not match with password");
        return;
      } else if(inputs.password.trim().length !== inputs.password.length) {
        setMessage("remove white space at start and end of password");
        return;
      } else if(inputs.password.length <= 6) {
        setMessage("Password should have atleast 6 characters long")
      }
      
      const url = baseURL + '/api/user/changePass';
      const data = {
        password: inputs.password,
        confirmPassword: inputs.confirmPassword,
        confirmationCode: confirmationCode
      }
      axios.post(url, data)
        .then(res => {
          const data = res.data;
          if(data.status === 'success') {
            setMessage({show: true, type: 'success', message: data.message})
          }
        })
        .catch(err => {

        })
    }

    return (
        <>
            {
                (useEffectFinish && verify) &&
                <div className="flex flex-col justify-center items-center min-h-screen px-3 py-5 bg-slate-900">
                    <div className="logo mb-8">
                        <img style={{width: '280px'}} src={logo} alt="Mined Logo" />
                    </div>

                    <h4 className="text-lg text-slate-400 font-semibold mb-3">Change password</h4>

                    {
                        message.show &&
                        <div className={`message max-w-[400px] w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                            {message.message}
                        </div>
                    }

                    <div className="border rounded-lg max-w-[400px] w-full p-4 bg-slate-800 text-slate-400 drop-shadow">
                    <form id="loginForm" action="/login" method="post" onSubmit={handleSubmit}>
                            
                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <label className="mb-2" htmlFor="password">Passwords</label>
                                </div>                            
                                <input
                                    className="w-full bg-slate-200 text-slate-900 font-semibold px-3 py-2 border outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={inputs.password || ''}
                                    onChange={handleChange}
                                    autoComplete={"off"}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between">
                                    <label className="mb-2" htmlFor="confirmPassword">Confirm password</label>
                                </div>                            
                                <input
                                    className="w-full bg-slate-200 text-slate-900 font-semibold px-3 py-2 border outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    type={showPass ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={inputs.confirmPassword || ''}
                                    onChange={handleChange}
                                    autoComplete={"off"}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <input
                                    className="w-4 h-4"
                                    type="checkbox"
                                    name=""
                                    id="showPass"
                                    checked={showPass}
                                    onChange={(e) => {
                                      setShowPass(!showPass);
                                    }}
                                />
                                <label className="ml-3" htmlFor="showPass">Show password</label>
                            </div>
                            
                            <input type="submit" className="mb-3 px-3 py-2 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring focus:ring-green-200 block" value="Change password"/>
                        
                            <div className="flex justify-center mt-4">
                                <Link 
                                    to="/login"
                                    className="text-blue-400 hover:text-blue-500 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                    </svg>
                                    <span className="ml-2">Back to login</span>
                                </Link>
                            </div>
                        </form>
                    </div>

                </div>
            }

            {
              (useEffect && !verify) &&
              <div className="flex flex-col justify-center items-center min-h-screen px-3 py-5 bg-slate-900">
                {
                  message.show &&
                  <div className={`message p-4 bg-slate-800 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                    {message.message}
                  </div>
                }
                <Link 
                  to="/login"
                  className="text-blue-400 hover:text-blue-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                  <span className="ml-2">Back to login</span>
                </Link>

              </div>
            }
        </>
    )
}
