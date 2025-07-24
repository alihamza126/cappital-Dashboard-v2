import React, { useState } from 'react'
import './calculator.scss'
import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const Calculator = () => {
   const [result, setResult] = useState(null);
   const [data, setData] = useState({
      cal: '',
      fscMarks: '',
      fscTotal: "",
      isSelect: true,
      matricMarks: '',
      matricTotal: '',
      mdcatMarks: '',
      totalMdcatMarks: '',
   })
   const handleChange = (e) => {
      const { name, value } = e.target;
      setData(prevData => ({
         ...prevData,
         [name]: value
      }));
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      const mdcatWeightage = 0.5;
      const matricWeightage = 0.1;
      const fscWeightage = 0.4;

      const totalMdcatScore = parseFloat(data.mdcatMarks) / parseFloat(data.totalMdcatMarks) * 100;
      const totalMatricScore = parseFloat(data.matricMarks) / parseFloat(data.matricTotal) * 100;
      const totalFscScore = parseFloat(data.fscMarks) / parseFloat(data.fscTotal) * 100;

      const mdcatScore = totalMdcatScore * mdcatWeightage;
      const matricScore = totalMatricScore * matricWeightage;
      const fscScore = totalFscScore * fscWeightage;

      let res;
      if(matricScore){
         res = matricScore + fscScore + mdcatScore;
      }else{
         res=fscScore+mdcatScore;
      }
      if (!res) {
         setResult("Please Enter Correct Marks")
      }
      else {
         setResult(res.toFixed(4))
      }
   }

   return (
      <div className="calculator cal-glassy-background mb-1">
         <div className="container py-5 px-2">
            <div className="col-md-8 col-12 offset-md-2  p-0 ">
               <div className="cal-box shadow-lg bg-light">
                  <div className="title text-center mb-4">
                     <h3 className='text-primary'>Aggregate Calculator</h3>
                  </div>
                  <form action="">
                     <div className="form-group col-md-12">
                        <FormControl fullWidth>
                           <InputLabel id="demo-simple-select-label">Select</InputLabel>
                           <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={data.cal}
                              name='cal'
                              onChange={handleChange}
                              label="calculator"
                              className=''
                              required
                           >
                              <MenuItem value={'mdcat'}>MdCat</MenuItem>
                              <MenuItem value={'nums'}>NUMS</MenuItem>
                           </Select>
                        </FormControl>
                     </div>



                     <div className="form-group mt-4">
                        <label htmlFor="inputState">FSC Score:</label>
                        <input type="number" className='form-control' required name='fscMarks' value={data.fscMarks} onChange={handleChange} />
                     </div>
                     <div className="form-group mt-4">
                        <label htmlFor="inputState">Total FSC Marks:</label>
                        <input type="number" className='form-control' required name='fscTotal' value={data.fscTotal} onChange={handleChange} />
                     </div>
                     <div className="form-group mt-4">
                        <Checkbox aria-label='is include' name='isSelect' required value={data.isSelect} checked={data.isSelect} onChange={(e) => setData(prev => ({ ...prev, isSelect: !prev.isSelect }))} />
                        <label htmlFor="inputState">Include Matriculation</label>
                     </div>

                     {data.isSelect &&
                        <div className="form-group mt-4">
                           <div className="mt-2">
                              <label htmlFor="inputState">Matriculation Marks:</label>
                              <input type='number' className='form-control' required name='matricMarks' value={data.matricMarks} onChange={handleChange} />
                           </div>

                           <div className="mt-2">
                              <label htmlFor="inputState">Total Matriculation Marks:</label>
                              <input type='number' className='form-control' required name='matricTotal' value={data.matricTotal} onChange={handleChange} />
                           </div>
                        </div>
                     }

                     <div className="form-group mt-4">
                        <label htmlFor="inputState">MDCAT Marks:</label>
                        <input type='number' className='form-control' required name='mdcatMarks' value={data.mdcatMarks} onChange={handleChange} />

                        <label htmlFor="inputState" className='mt-2'>
                           Total MDCAT Marks:</label>
                        <input type='number' className='form-control' required name='totalMdcatMarks' value={data.totalMdcatMarks} onChange={handleChange} />
                     </div>
                     <button onClick={handleSubmit} className='btn btn-success mt-4 col-md-12 fw-bold' type="submit">Calculate</button>
                  </form>
                  {result &&
                     <div className="result">
                        <p className='text-center mt-3'>{result+"%"}</p>
                     </div>
                  }
               </div>
            </div>
         </div>
      </div>
   )
}

export default Calculator