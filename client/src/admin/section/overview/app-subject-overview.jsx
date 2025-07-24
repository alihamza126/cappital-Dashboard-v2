import React from 'react'
import './style.scss'
import { ChecklistOutlined, DoneAllOutlined, ErrorOutlineOutlined, JoinRight,} from '@mui/icons-material';
import { fShortenNumber } from '/src/utils/format-number';
import { LinearProgress } from '@mui/material';

const SubjectOverview = ({ data }) => {
  return (
    <div className='subject-overview shadow'>
      <div className="container py-2">
        <div className="row py-1">
          <p className='text-center sub-title text-primary'>{data?.subject}</p>
        </div>
        <div className="row subject-info">
          <div className="info d-flex justify-content-between">
            <strong className='text-info'>Attempted <DoneAllOutlined /> </strong>
            <p className='text-info  w-50'><LinearProgress style={{ height: '10px' }} variant="determinate" color="inherit" value={69} className='w-75 rounded-5' />{fShortenNumber(data?.wrong+data?.right)}</p>
          </div>
          <div className="info d-flex justify-content-between">
            <strong className='text-success'>Right <JoinRight /></strong>
            <p className='text-success  w-50'><LinearProgress style={{ height: '10px' }} variant="determinate" color="inherit" value={69} className='w-75 rounded-5' />{fShortenNumber(data?.right)}</p>
          </div>
          <div className="info d-flex justify-content-between">
            <strong className='text-danger'>Wrong <ErrorOutlineOutlined fontSize='12'/></strong>
            <p className='text-danger  w-50'><LinearProgress style={{ height: '10px' }} variant="determinate" color="inherit" value={69} className='w-75 rounded-5' />{fShortenNumber(data?.wrong)}</p>
          </div>
          <div className="info d-flex justify-content-between">
            <strong className='text-primary'>Total <ChecklistOutlined /></strong>
            <p className='text-primary px-2 fs-5'>{fShortenNumber(data?.total)}</p>
          </div>



        </div>
      </div>
    </div>
  )
}

export default SubjectOverview;