import React, { useEffect, useState } from 'react';
import Subject from '../../components/subject/Subject';

import bio from '../../../assets/subjects/1.png';
import chem from '../../../assets/subjects/2.png';
import phy from '../../../assets/subjects/3.png';
import eng from '../../../assets/subjects/4.png';
import logic from '../../../assets/subjects/5.png';
import mock from '../../../assets/subjects/6.png';
import './subjectpage.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SubjectPage = () => {
  const path = useParams()?.subject;

  const numsSubjectData = [
    {
      name: "BIOLOGY",
      img: bio,
      link: '/dashboard/subject/nums/biology'
    },
    {
      name: "CHEMISTRY",
      img: chem,
      link: '/dashboard/subject/nums/chemistry'
    },
    {
      name: "PHYSICS",
      img: phy,
      link: '/dashboard/subject/nums/physics'
    },
    {
      name: "ENGLISH",
      img: eng,
      link: '/dashboard/subject/nums/english'
    },
    {
      name: "MOCK TESTS",
      img: mock,
      link: '/dashboard/subject/nums/mock/test'
    },
  ];

  const mdcatSubjectData = [
    {
      name: "BIOLOGY",
      img: bio,
      link: '/dashboard/subject/mdcat/biology'
    },
    {
      name: "CHEMISTRY",
      img: chem,
      link: '/dashboard/subject/mdcat/chemistry'
    },
    {
      name: "PHYSICS",
      img: phy,
      link: '/dashboard/subject/mdcat/physics'
    },
    {
      name: "ENGLISH",
      img: eng,
      link: '/dashboard/subject/mdcat/english'
    },
    {
      name: "LOGICAL REASONING",
      img: logic,
      link: '/dashboard/subject/mdcat/logic'
    },
    {
      name: "MOCK TESTS",
      img: mock,
      link: '/dashboard/subject/mdcat/mock/test'
    },
  ];

  const [subjectData, setSubjectData] = useState([]);
  const [user, setUser] = useState(useSelector((state) => state.auth?.user?.user?.user));
  const isMdcat = user?.isMdcat || false;
  const isNums = user?.isNums || false;
  const isMdcatNums = user?.isMdcatNums || false;
  const isTrial = user?.isTrialActive || false;
  const trialStatus = isTrial && !isMdcat && !isNums && !isMdcatNums;
  // const getTrialStatus = () => {
  //     return isTrial && !isMdcat && !isNums && !isMdcatNums;
  // };

  useEffect(() => {
    if (path === "nums") {
      setSubjectData(numsSubjectData);
    } else if (path === "mdcat") {
      setSubjectData(mdcatSubjectData);
    }
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-12 offset-md-2 text-center">
            <h1 className="subjectpage-heading p-3 fw-bold text-white rounded-5 mb-5">SELECT YOUR SUBJECT</h1>
          </div>
        </div>
        <div className="row">
          {subjectData.map((ele, index) => (
            <Subject key={index}  name={ele.name} img={ele.img} isLocked={(trialStatus)?ele.name=='MOCK TESTS':false} link={(trialStatus)?ele.name=='MOCK TESTS'?'#':ele.link:ele.link} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SubjectPage;
