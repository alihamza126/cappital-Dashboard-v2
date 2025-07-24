import React from 'react'
import './style.scss'
import { ChecklistOutlined, DoneAllOutlined, ErrorOutlineOutlined, JoinRight, } from '@mui/icons-material';
import { fShortenNumber } from '/src/utils/format-number';
import { LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';

const SubjectOverview = ({ data }) => {
  const attempted = data?.correctCount + data?.wrongCount;
  const correct = data?.correctCount;
  const wrong = data?.wrongCount;
  const total = data?.totalCount;
  const attemptedPrecentage = (attempted / total) * 100;
  const correctPrecentage = (correct / (correct + wrong)) * 100;
  const wrongPrecentage = (wrong / (correct + wrong)) * 100;




  return (
    <motion.div whileHover={{ scale: 1.015 }}  className='subject-overview shadow mb-3 ms-3 ms-md-0'>
      <div className="container py-2">
        <div className="row py-1">
          <p className='text-center sub-title text-primary'>{data?.subject}</p>
        </div>
        <div className="row subject-info">
          <div className="info d-flex justify-content-between">
            <strong style={{color:'#1F63BE'}}>Attempted <DoneAllOutlined /> </strong>
            <p className='w-50' style={{color:'#1F63BE'}}><LinearProgress style={{ height: '18px' }} variant="determinate" color="inherit" value={attemptedPrecentage} className='w-75 rounded-5' />{fShortenNumber(attempted)}</p>
          </div>
          <div className="info d-flex justify-content-between">
            <strong style={{color:'#00B749'}}>Correct <JoinRight /></strong>
            <p className='w-50' style={{color:'#00B749'}}><LinearProgress style={{ height: '18px' }} variant="determinate" color="inherit" value={correctPrecentage} className='w-75 rounded-5' />{fShortenNumber(correct)}</p>
          </div>
          <div className="infod d-flex justify-content-between">
            <strong style={{color:'#D53D51'}}>Wrong <ErrorOutlineOutlined fontSize='12' /></strong>
            <p className='w-50' style={{color:'#D53D51'}}><LinearProgress style={{ height: '18px' }} variant="determinate" color="inherit" value={wrongPrecentage} className='w-75 rounded-5' />{fShortenNumber(wrong)}</p>
          </div>
          <div className="info d-flex justify-content-between">
            <strong style={{color:'#454545'}}>Total <ChecklistOutlined /></strong>
            <p className='px-2 fs-5' style={{color:'#454545'}}>{fShortenNumber(total)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SubjectOverview;