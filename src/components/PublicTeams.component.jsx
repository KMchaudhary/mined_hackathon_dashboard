import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SimpleTeamCard from './SimpleTeamCard.component';

export default function PublicTeams() {  
  const [publicTeams, setPublicTeams] = useState();
  const [finishUseEffect, setFinishUseEffect] = useState(false);

  const navigate = useNavigate();

  const baseURL = process.env.NODE_ENV === "production" ? 'https://apis.mined2022.tech' : 'http://localhost:8000';

  useEffect(() => {

    const url = baseURL + '/api/my_reg/reg/publicTeams';
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
        setPublicTeams(data)
        setFinishUseEffect(true);
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
        setFinishUseEffect(true)
      });
  
    return () => {
      // cancel the request before component unmounts
      source.cancel();
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
      <>
        <div className="publicTeams text-slate-300">
          <h1 className="text-white text-center text-2xl font-semibold py-2 mb-4"><span className="py-2 border-b-4 rounded">Public Teams</span></h1>

          {
            
            <div className="container py-8">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {
                    (publicTeams && finishUseEffect) &&
                    publicTeams.map(team => (
                      <SimpleTeamCard key={team.id} team={team} />
                    ))
                  }
              </div>

            </div>
          }

        </div>
      </>
    )
}
