import axios from 'axios';
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../MINeD_LOGO.png';

export default function Login() {
  const [inputs, setInputs] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const passwordEl = useRef();

  const navigate = useNavigate();

  const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log('handle submit')
      if(!inputs.email || inputs.email === "" || !inputs.password || inputs.password === "")
      {
          return;
      }

      const url = 'http://localhost:8000/api/users/login';

      axios.post(url, {
          email: inputs.email, 
          password: inputs.password
      })
      .then(res => {
        const data = res.data;
        if(data.status === 'success') {
            localStorage.setItem('user_token', data.token);
            navigate('/myReg');
        }
      })
      .catch(err => {
          const data = err.response.data;
          if(data.status === 'fail') {
            setMessage(data.message);
          }        
      })
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen px-3 py-5 bg-slate-900">
                <div className="logo mb-8">
                    <img style={{width: '280px'}} src={logo} alt="Mined Logo" />
                </div>

                <h4 className="text-lg text-slate-400 font-semibold mb-3">Log In</h4>

                {
                    (message !== "") &&
                    <div className="message max-w-[400px] w-full p-4 text-red-500 border border-red-500 rounded-lg mb-3">
                        Wrong email or password!
                    </div>
                }


                <div className="border rounded-lg max-w-[400px] w-full p-4 bg-slate-800 text-slate-400 drop-shadow">
                    <form action="/login" method="post" onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block" htmlFor="email">Email</label>
                            <input
                                className="w-full bg-slate-200 text-slate-900 font-semibold px-3 py-2 border outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                type="email"
                                name="email"
                                id="email"
                                value={inputs.email || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="mb-2 block" htmlFor="password">Passwords</label>
                            <input
                                className="w-full bg-slate-200 text-slate-900 font-semibold px-3 py-2 border outline-none rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                type="password"
                                name="password"
                                id="password"
                                value={inputs.password || ''}
                                onChange={handleChange}
                                ref={passwordEl}
                                autoComplete={'on'}
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
                                    passwordEl.current.type = (showPass === false ? "text" : "password")
                                    setShowPass(!showPass);
                                }}
                            />
                            <label className="ml-3" htmlFor="showPass">Show password</label>
                        </div>

                        
                        <input type="submit" className="mb-3 px-3 py-2 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring focus:ring-green-200 block" value="Sign in"/>
                    
                        <p>New to hackathon? <Link className="text-blue-400" to="/signup"> register now</Link></p>
                    </form>
                </div>

            </div>
    </>
  )
}
