import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AppCurrentVisits from "../app-current-visits";
import AppWidgetSummary from "../app-widget-summary";
import { useSelector } from "react-redux";
import right from "/png/right.png";
import wrong from "/png/wrong.png";
import { Box, Grid } from "@mui/material";
import SubjectOverview from "../app-subject-overview";
import { Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import statsImg from '/public/stats.gif'
import ReactSpeedometer from "react-d3-speedometer";
import axiosInstance from "../../../../baseUrl";
import DashboardSkeleton from "../../../../skeleton/Dashboard-Skeletion";

export default function AppView() {
  let user = useSelector((state) => state.auth?.user);
  user = user?.user?.user;
  const [statsData, setStatsData] = useState({});
  const [pieChartData, setPieChartData] = useState([]);
  const [error, setError] = useState(null);
  const [meterValue, setMetervalue] = useState(0);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.post("/mcq/stats", { userId: user._id });
        setStatsData(res.data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch statistics data. Please try again later.");
        setLoading(false);
      }
    }
    fetchData();
  }, [user._id]);

  useEffect(() => {
    if (statsData?.combinedSubjectCounts) {
      const series = statsData.combinedSubjectCounts.map(subjectData => ({
        label: subjectData?.subject,
        value: (subjectData?.correctCount || 0) + (subjectData?.wrongCount || 0),
      }));
      setPieChartData(series);
      const value = (statsData.solvedLength / (statsData.solvedLength + statsData.wrongLength)) * 100;
      setMetervalue(value)
    }
  }, [statsData]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" className="ps-2" sx={{ mb: 5, mt: 2 }}>
        Hi, Welcome back{" "}
        <span className="text-primary fw-bold">{user?.username}</span>👋
      </Typography>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}
      {
        loading && <DashboardSkeleton/>

      }
      {
        (statsData.solvedLength > 0 || statsData.wrongLength > 0) &&
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={6} className="px-2 px-md-1">
            <AppWidgetSummary
              title="Attempted Right MCQS"
              total={statsData.solvedLength}
              color="success"
              icon={<img alt="icon" src={right} height={83} />}
            />
          </Grid>

          <Grid xs={12} className="mt-md-0 mt-2 px-2 px-md-2" sm={6} md={6}>
            <AppWidgetSummary
              title="Attempted Wrong MCQS"
              total={statsData.wrongLength}
              color="info"
              icon={<img alt="icon" src={wrong} height={90} />}
            />
          </Grid>

          <Grid xs={12} sm={12} md={12}>
            <Typography variant="h4" sx={{ mb: 2, mt: 4, textAlign: "center" }}>
              <span className="text-primary fw-bold">Subjects Overview 📚</span>
            </Typography>
          </Grid>

          <Row className="hamza w-100">
            {statsData?.combinedSubjectCounts ? (
              statsData.combinedSubjectCounts.map((ele, index) => (
                <Grid xs={12} md={4} lg={4} sm={6} key={index}>
                  <SubjectOverview data={ele} />
                </Grid>
              ))
            ) : (
              "Solve Mcqs to see stats"
            )}
          </Row>

          <Grid xs={12} md={6} lg={6} p={1}>
            <div className="bg-white rounded-3 overflow-hidden shadow-sm ">
              <AppCurrentVisits
                title="Subject Wise Attempted MCQs"
                className="h-100"

                chart={{
                  series: pieChartData,
                }}
              />
            </div>
          </Grid>
          <Grid xs={12} md={6} lg={6} p={1}>
            <div className="overflow-hidden bg-white h-100 shadow-sm rounded-3 d-flex flex-column  align-items-center justify-content-between">
              <div style={{ padding: ".88rem 3rem", fontFamily: 'fredoka', fontSize: '1.5rem' }} className="row w-100 bg-primary px-3 text-white">Performance</div>
              <div style={{ position: "relative", width: "385px" }}>
                <ReactSpeedometer
                  width={385}
                  maxSegmentLabels={0}
                  segments={5555}
                  needleHeightRatio={0.7}
                  forceRender
                  value={meterValue}
                  minValue={0}
                  maxValue={100}
                  currentValueText={meterValue.toFixed(2)}
                  ringWidth={57}
                  needleTransitionDuration={3333}
                  needleTransition="easeElastic"
                  needleColor={'#90f2ff'}
                  textColor={'#aaa'}
                  ariaLabel={'Performance Speedometer'}
                />
              </div>
            </div>
          </Grid>

        </Grid>
      }
      <>
        {
          (statsData.solvedLength < 1 && statsData.wrongLength < 1) &&
          <div className="col-md-12">
            <div className="nav-shoadow py-1 rounded-5">
              <div className="row justify-content-center">
                <span className='w-auto mt-0'>
                  <img src={statsImg} height="180" alt="" />
                </span>
              </div>
              <p className='text-center fw-bold fs-5 text-dark' style={{ fontFamily: 'inter' }}>Attempt MCQ's to View statistics</p>
              <div className="row justify-content-center">
                <button class="button w-auto">

                  <div class="hoverEffect">
                    <div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        }
      </>
    </Container>
  );
}
