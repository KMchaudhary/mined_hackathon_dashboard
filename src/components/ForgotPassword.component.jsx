import logo from '../MINeD_LOGO.png'
import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({show: false, type: 'success', message: ''});

    const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

    const sendPasswordMail = (e) => {
        e.preventDefault();
    
        if(!email || email.trim() === "") return setMessage("email is required!");
    
        const url = baseURL + '/api/user/forgot';
        axios.post(url, {
            email: email
        })
            .then(res => {
            const data = res.data;
                if(data.status === 'success') {
                    setMessage({show: true, type: 'success', message: data.message});
                }
            })
            .catch(err => {
                const data = err.response.data;
                if(data.status === 'fail') {
                    setMessage({show: true, type: 'fail', message: data.message});
                }
            })
      }

    return (
        <>
            <div className="flex flex-col justify-center items-center min-h-screen px-3 py-5 bg-slate-900">
                <div className="logo mb-8">
                    <img style={{width: '280px'}} src={logo} alt="Mined Logo" />
                </div>

                <h4 className="text-lg text-slate-400 font-semibold mb-3">Forgot password?</h4>

                {
                    message.show &&
                    <div className={`message max-w-[400px] w-full p-4 ${message.type === 'success' ? 'text-green-500 border-green-500' : 'text-red-500 border-red-500'} border rounded-lg mb-3`}>
                        {message.message}
                    </div>
                }

                <div className="border rounded-lg max-w-[400px] w-full p-4 bg-slate-800 text-slate-400 drop-shadow">
                    <form id="forgotForm" method="post" onSubmit={sendPasswordMail}>
                            <div className="mb-3">
                                <label className="mb-2 block" htmlFor="email">Email</label>
                                <input
                                    className="input-el mb-2"
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <span className="text-sm tracking-wider">Type the address linked to your account for this application and we will send you password reset information via email. Email might end up to spam folder so check these as well.</span>
                            </div>
                            <button 
                                className="w-full px-3 py-2 border text-white rounded-lg bg-slate-900 hover:bg-slate-500 focus:ring font-semibold"
                            >Send instruction</button>

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
        </>
    )
}
