import React from 'react'
import './bg.scss';

export const Bg = ({data}) => {
    const bg=data.Bg;
    const left=data.left;
    const top=data.top;
  return (
    <div className="bg">
            <div className="shade" style={{background:`${bg}`,left:`${left}`,top:`${top}`}}></div>
    </div>
  )
}
