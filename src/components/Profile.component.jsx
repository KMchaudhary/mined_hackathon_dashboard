import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [registration,setRegistration] = useState();
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

  useEffect(()=>{
    const url = baseURL + '/api/my_reg/reg/regInfo';
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
        setRegistration(data.registrationInfo)
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
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRegistration(values => ({...values, [name]: value}));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!registration.user.firstName || registration.user.firstName.trim() === "" || !registration.user.lastName || registration.user.lastName.trim() === ""
    || !registration.mobile || registration.mobile.trim() === "" || !registration.collageName || !registration.collageName.trim() === "" || 
    !registration.collageCity || registration.collageCity.trim() === "" || !registration.collageState || registration.collageState.trim() === "" || !registration.degree || registration.degree.trim() === "" ||
    !registration.branch || registration.branch.trim() === "" || !registration.semester || !registration.nameOnCertificate || registration.nameOnCertificate.trim() === "" ||
    !registration.discordId || registration.discordId.trim() === "" ||  !registration.linkedin || registration.linkedin.trim() === "" ||  !registration.githubLink || registration.githubLink.trim() === "" 
    ) {
        setMessage('Please fill all required fields');
        return;
    }

    let regExp = new RegExp(/^([+]\d{2})?\d{10}$/); // find non word character
    if(!regExp.test(registration.mobile)){
      setMessage('Mobile should contain 10 or +country_code and 10 digit number');
      return;
    }
    if(isNaN(registration.semester) || Number(registration.semester) > 10){
      setMessage('Semester should be less than or equal to 10');
      return;
    } 
    const data = {
      firstName: registration.user.firstName,
      lastName: registration.user.lastName,
      email: registration.user.email,
      mobile: registration.mobile,
      collageName: registration.collageName,
      collageCity: registration.collageCity,
      collageState: registration.collageState,
      degree: registration.degree,
      branch: registration.branch,
      semester: registration.semester,
      nameOnCertificate: registration.nameOnCertificate,
      discordId: registration.discordId,
      linkedin: registration.linkedin,
      githubLink: registration.githubLink
    };
    
    const url = baseURL + '/api/my_reg/reg/regInfo';
    const options = {
      headers: {
          'authorization': `Bearer ${localStorage.getItem('user_token')} ${localStorage.getItem('reg_token')}`
      }
    }

    axios.patch(url, data, options)
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
      <div className="profile">
        <h1 className="text-white text-center text-2xl font-semibold py-2"><span className="py-2 border-b-4 rounded">Profile</span></h1>
       
        <div className="wrapper my-8">
          {
            registration  &&

            <>
              {
                !edit && 
                <div className="card p-4 bg-slate-800 text-slate-400 rounded-lg">
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-white text-base sm:text-xl font-semibold tracking-wider">Hello <span className="whitespace-nowrap">{`${registration.user.firstName} ${registration.user.lastName}`} 👋</span></h2>
                    </div>
                    <button 
                      className="px-2 md:px-3 py-2 flex items-center font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring"
                      onClick={ e =>
                        setEdit(true)
                      }
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path><path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path></svg>
                      <span className="hidden md:block ml-2">Edit profile</span>
                    </button>
                  </div>
                  
                  <div className="info mt-3 overflow-x-auto">
                      <div className="text-white">
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Name on certificate</div>
                          <div className="whitespace-nowrap">{registration.nameOnCertificate}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Email</div>
                          <div className="whitespace-nowrap">{registration.user.email}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Mobile</div>
                          <div className="whitespace-nowrap">{registration.mobile}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Collage name</div>
                          <div className="whitespace-nowrap">{registration.collageName}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Collage city & state</div>
                          <div className="whitespace-nowrap">{registration.collageCity} <div className="dot bg-slate-400"></div> {registration.collageState}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Degree</div>
                          <div className="whitespace-nowrap">{registration.degree}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Branch</div>
                          <div className="whitespace-nowrap">{registration.branch}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Semester</div>
                          <div className="whitespace-nowrap">{registration.semester}</div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Linkedin link</div>
                          <div className="whitespace-nowrap"><a className="text-blue-500 truncate" rel="noreferrer" href={`${registration.linkedin}`} target="_blank" >{registration.linkedin}</a></div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Github link</div>
                          <div className="whitespace-nowrap"><a className="text-blue-500 truncate" rel="noreferrer" href={`${registration.githubLink}`} target="_blank">{registration.githubLink}</a></div>
                        </div>
                        <div className="p-2 rounded-lg sm:flex-col lg:flex-row border-slate-600 md:border-0 hover:bg-slate-700 flex">
                          <div className="font-semibold text-slate-400 pr-3 min-w-[120px] md:min-w-[200px] max-w-[120px] md:max-w-[200px] w-full">Discord Id</div>
                          <div className="whitespace-nowrap">{registration.discordId}</div>
                        </div>
                      </div>
                  </div>
                  
                </div>
              }
              {
                edit &&
                <form className="text-slate-400" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 content-center gap-6 sm:grid-cols-1">
                    <div>
                      <label className="block mb-2 font-semibold">First Name <span className="text-red-500">*</span></label>
                      <input 
                        className="input-el" 
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={ registration.user.firstName || ""}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Last Name <span className="text-red-500">*</span></label>
                      <input 
                        className="input-el" 
                        type="text"                               
                        id="lasttName"
                        name="lastName"
                        value={ registration.user.lastName || ""}
                        onChange={handleChange} 
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Mobile Number <span className="text-red-500">*</span></label>
                      <input className="input-el" type="tel"
                                    id="mobile"
                                    name="mobile"
                                    value={ registration.mobile || ""}
                                    onChange={handleChange} required/>
                    </div>
                    <div>
                      <label className="block mb-2">College Name</label>
                      <input 
                        className="input-el" 
                        type="text"                                
                        id="collageName"                               
                        name="collageName"                                 
                        value={ registration.collageName || ""}                                 
                        onChange={handleChange}        
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">College City</label>
                      <input 
                        className="input-el" 
                        type="text"
                        id="collageCity"
                        name="collageCity"
                        value={ registration.collageCity || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">College State</label>
                      <input 
                        className="input-el" 
                        type="text"
                        id="collageState"
                        name="collageState"
                        value={ registration.collageState || ""}
                        onChange={handleChange} 
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Degree</label>
                      <input 
                        className="input-el" type="text"
                        id="degree"
                        name="degree"
                        value={ registration.degree || ""}
                        onChange={handleChange} 
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">Branch Name</label>
                      <input 
                        className="input-el" type="text"
                        id="branch"
                        name="branch"
                        value={ registration.branch || ""}
                        onChange={handleChange}required/>
                    </div>
                    <div>
                      <label className="block mb-2">Semester</label>
                      <input 
                        className="input-el" type="number"
                        id="semester"
                        name="semester"
                        value={ registration.semester || ""}
                        onChange={handleChange} 
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Name On Certificate <span className="text-red-500">*</span></label>
                      <input 
                        className="input-el" type="text"
                        id="nameOnCertificate"
                        name="nameOnCertificate"
                        value={ registration.nameOnCertificate || ""}
                        onChange={handleChange}required/>
                    </div>

                    <div>
                      <label className="block mb-2">Email</label>
                      <div className="input-el bg-slate-300 mb-2" id="email">{registration.user.email}</div>
                      <div className="text-sm tracking-wider"><span className="font-semibold mr-2">Note :</span>You can not change email id</div>
                    </div>

                    <div>
                      <label className="block mb-2">Linkedin Link</label>
                      <input 
                        className="input-el" 
                        type="text"
                        id="linkedin"
                        name="linkedin"
                        value={ registration.linkedin || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Github Link</label>
                      <input 
                        className="input-el" 
                        type="text"
                        id="githubLink"
                        name="githubLink"
                        value={ registration.githubLink || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block mb-2">Discord Id <span className="text-red-500">*</span></label>
                      <input className="input-el" type="text"
                        id="discordId"
                        name="discordId"
                        value={ registration.discordId || ""}
                        onChange={handleChange} 
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between my-4">
                    <div>
                      {
                        (message !== "") &&
                        <div className="message max-w-[400px] w-full px-4 py-2 text-red-500 border border-red-500 rounded-lg mb-3">
                            {message}
                        </div>
                      }
                    </div>
                    
                    <div>
                      <button 
                        className="px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg focus:ring-slate-400 focus:ring mr-3"
                        onClick={e => {
                          e.preventDefault();
                          setEdit(false)
                        }}
                      >Close</button>
                      <button className="px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg" type="submit">Save Changes</button>
                    </div>
                  </div>                  
                </form>
              }
            </>            
          }         
        </div>
      </div>
    </>
  )
}
