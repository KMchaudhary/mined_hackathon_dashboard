import React from 'react'

export default function MyTeam() {
  return (
    <>
      {/* My Team */}
      <div className="my-team">
        <h1 className="text-white text-center text-2xl font-semibold py-2"><span className="py-2 border-b-4">My Team</span></h1>

        <div className="wrapper text-slate-400 min-h-[400px] flex justify-center items-center">
          {/* if team is not assigned */}
          <div>
            <p className="text-lg text-center mb-3 py-8 font-bold bg-slate-800 rounded-lg">You have no team assign yet!</p>
            <p className="text-center mb-3">Select one option</p>
            <div className="flex justify-center">
              <button className="px-3 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 rounded-lg">Create new team</button>
              <div className="my-auto mx-4 font-semibold">OR</div>
              <button className="px-3 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 rounded-lg">Auto team assign</button>
            </div>
          </div>

          {/* if team is assigned */}
        </div>
      </div>
    </>
  )
}
