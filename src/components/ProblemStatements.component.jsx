import React from 'react'

export default function ProblemStatements() {
  return (
    <>
      <div className="ps text-slate-300">
        <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4">Problem statements</span></h1>

        <div className="wrapper my-8">
          <ol className="list-decimal px-6">
            <li className="py-4 border-b text-blue-300 font-bold">
              <div className="ps-title">Problem statement 1</div>
              <p className="ps-body">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo officia reiciendis adipisci odit vitae quaerat doloremque, ut delectus dignissimos similique expedita quae iure error veritatis corrupti ex sapiente, ipsum cumque!</p>
            </li>
            <li className="py-4 border-b text-blue-300 font-bold">
              <div className="ps-title">Problem statement 2</div>
              <p className="ps-body">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo officia reiciendis adipisci odit vitae quaerat doloremque, ut delectus dignissimos similique expedita quae iure error veritatis corrupti ex sapiente, ipsum cumque!</p>
            </li>
            <li className="py-4 border-b text-blue-300 font-bold">
              <div className="ps-title">Problem statement 3</div>
              <p className="ps-body">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo officia reiciendis adipisci odit vitae quaerat doloremque, ut delectus dignissimos similique expedita quae iure error veritatis corrupti ex sapiente, ipsum cumque!</p>
            </li>
          </ol>
        </div>
      </div>
    </>
  )
}
