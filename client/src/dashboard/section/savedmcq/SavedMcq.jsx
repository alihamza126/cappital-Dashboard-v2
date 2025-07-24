import { Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../baseUrl';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { Close } from '@mui/icons-material';

const CourseDetails = () => {
  const [mcqs, setMcqs] = useState([]);
  const alphabets = ["A", "B", "C", "D"];
  const config = {
    loader: { load: ['[tex]/ams'] },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
  };

  const showCenteredSnackbar = (message, variant) => {
    enqueueSnackbar(message, {
      variant: variant,
      autoHideDuration: 4000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      action: (
        <IconButton size="small" aria-label="close" color="inherit" onClick={() => closeSnackbar()}>
          <Close fontSize="small" />
        </IconButton>
      )
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/mcq/bookmarks');
        if (res.data) {
          setMcqs(res.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  const handleUnbookmark = async (mcqId) => {
    try {
      await axiosInstance.put('/mcq/unbookmark', { mcqId });
      setMcqs((prevMcqs) => prevMcqs.filter((mcq) => mcq._id !== mcqId));

    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };



  return (
    <div className='position-relative'>
      {/* Sticky heading */}
      <div className="position-sticky top-0 container text-center py-3 rounded-4 mt-0 shadow fw-bold bg-white" style={{ zIndex: 222 }}>
        <Typography
          variant="h4"
          style={{ color: '#1976D2' }}
          fontWeight={'bold'}
          className="mt-2 d-inline"
          align="center"
          gutterBottom
        >
          Bookmarked MCQs
        </Typography>
      </div>

      {/* Preview of MCQs */}
      <MathJaxContext version={3} config={config}>
        <ul className='p-4'>
          {mcqs.map((ele, i) => (
            <div className='mt-1' key={ele.id}> {/* Ensure each item has a unique `id` */}
              <li style={{ listStyle: 'none' }}>
                <div className="col py-1 d-flex justify-content-between">
                  <b className='col-11 text-dark'>Q:{i + 1}) &nbsp; <MathJax inline>{ele.question}</MathJax></b>
                  <span className='col-1'>
                    <Button
                      className='shadow-sm'
                      title='click to remove from bookmark'
                      onClick={() => handleUnbookmark(ele._id)}
                    >
                      <i className="fas fa-bookmark text-danger fs-5"></i>
                    </Button>
                  </span>
                </div>
                {ele.options.map((inEle, inI) => (
                  <div className="d-flex gap-2 text-dark" key={inI}>
                    <div
                      style={{
                        background: ele.correctOption === inI + 1 && '#1CC88A',
                        color: ele.correctOption === inI + 1 && '#fff',
                        borderRadius: '50%',
                        padding: '1px',
                        height: 'fit-content'
                      }}
                    >
                      ({alphabets[inI]})
                    </div>
                    <div>
                      <MathJax inline>{inEle}</MathJax>
                    </div>
                  </div>
                ))}
                <div className="row pt-3">
                  <div className='fw-bold text-success' style={{ color: '#625b5bc4' }}>
                    Explanation:
                  </div>
                  <div>
                    <MathJax style={{ whiteSpace: 'pre-line' }} inline>{ele.explain}</MathJax>
                  </div>
                </div>
              </li>
              <hr className='bg-secondary' style={{ height: '2px' }} />
            </div>
          ))}
          {
            mcqs.length === 0 && (
              <div className='text-center py-3'>
              <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="90px" height="90px"><path fill="#eb6773" d="M37,6c0-1.105-0.895-2-2-2H13c-1.105,0-2,0.895-2,2v4h26V6z"/><path fill="#b31523" d="M11,41.72c0,0.996,1.092,1.606,1.94,1.084L24,35.998l11.06,6.806C35.908,43.326,37,42.716,37,41.72	V30H11V41.72z"/><rect width="26" height="12" x="11" y="18" fill="#cf1928"/><rect width="26" height="8" x="11" y="10" fill="#d9414f"/><radialGradient id="8vh1TYA_OzqvwTN~y4NyIa" cx="37.181" cy="24.128" r="11.585" gradientUnits="userSpaceOnUse"><stop offset=".348"/><stop offset=".936" stop-opacity=".098"/><stop offset="1" stop-opacity="0"/></radialGradient><path fill="url(#8vh1TYA_OzqvwTN~y4NyIa)" d="M37,12.051C30.851,12.562,26,17.72,26,24	s4.851,11.438,11,11.949V12.051z" opacity=".3"/><linearGradient id="8vh1TYA_OzqvwTN~y4NyIb" x1="28" x2="48" y1="1786" y2="1786" gradientTransform="translate(0 -1762)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#21ad64"/><stop offset="1" stop-color="#088242"/></linearGradient><circle cx="38" cy="24" r="10" fill="url(#8vh1TYA_OzqvwTN~y4NyIb)"/><path fill="#fff" d="M38.5,29h-1c-0.276,0-0.5-0.224-0.5-0.5v-9c0-0.276,0.224-0.5,0.5-0.5h1c0.276,0,0.5,0.224,0.5,0.5v9	C39,28.776,38.776,29,38.5,29z"/><path fill="#fff" d="M33,24.5v-1c0-0.276,0.224-0.5,0.5-0.5h9c0.276,0,0.5,0.224,0.5,0.5v1c0,0.276-0.224,0.5-0.5,0.5h-9	C33.224,25,33,24.776,33,24.5z"/></svg>
                <h4 className='text-danger'>No MCQs bookmarked yet!</h4>
              </div>
            )
          }
        </ul>
      </MathJaxContext>
    </div>
  );
};

export default CourseDetails;
