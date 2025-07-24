import React from 'react'
import sadface from '/sadface.gif'

const CrashError = () => {
  return (
    <div className="crash-page bg-light w-100"
      style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        flexDirection: 'column', justifyContent: 'center'
      }}
    >
      <div className="container"
        style={{
          height: '100vh', display: 'flex', alignItems: 'center',
          flexDirection: 'column', justifyContent: 'center'
        }}
      >
        <img src={sadface} height={300} />
        <h4 className='text-center'>Please verify your internet connection and reload the page</h4>
        <button className='btn btn-secondary mt-3' onClick={()=>window.location.reload()}>Reload</button>
      </div>
    </div>
  )
}

export default CrashError