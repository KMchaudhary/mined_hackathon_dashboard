import React from 'react'

export default function Profile() {
  return (
    <>
      <div className="profile">
        <h1 className="text-white text-center text-2xl font-semibold py-2"><span className="py-2 border-b-4">Profile</span></h1>
      
        <div className="wrapper my-8">
          <form className="text-slate-400">
              <div className="grid md:grid-cols-2 content-center gap-6 sm:grid-cols-1">
                <div>
                  <label className="block mb-2 font-semibold">First Name</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Last Name</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Mobile Number</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">College Name</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">College City</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">College State</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Degree</label>
                  <input className="input-el" type="text" />
                </div>

                <div>
                  <label className="block mb-2">Branch Name</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Semester</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Name On Certificate</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Linkedin Link</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Github Link</label>
                  <input className="input-el" type="text" />
                </div>
                <div>
                  <label className="block mb-2">Discord Id</label>
                  <input className="input-el" type="text" />
                </div>
              </div>
              <div className="flex justify-end my-4">
                <button className="px-3 py-2 font-semibold bg-slate-500 text-white hover:bg-slate-600 rounded-lg mr-3" type="submit">Reset</button>
                <button className="px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg" type="submit">Save Changes</button>
              </div>
            </form>
        </div>
      </div>
    </>
  )
}
