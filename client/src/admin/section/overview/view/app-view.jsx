
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------
import right from '/png/right.png';
import wrong from '/png/wrong.png';
import { Box, Grid } from '@mui/material';
import SubjectOverview from '../app-subject-overview';
import { Row } from 'react-bootstrap';

export default function AppView() {
  let user = useSelector((state) => state.auth.user);
  user = user?.user?.user;
  console.log(user)


  const dummydata = [
    { "subject": "Mathematics", "attempted": 300, "right": 250, "wrong": 50, "total": 300 },
    { "subject": "History", "attempted": 200, "right": 150, "wrong": 50, "total": 200 },
    { "subject": "Science", "attempted": 400, "right": 350, "wrong": 50, "total": 400 },
    { "subject": "Geography", "attempted": 150, "right": 120, "wrong": 30, "total": 150 },
    { "subject": "Literature", "attempted": 250, "right": 200, "wrong": 50, "total": 250 },
    { "subject": "Computer Science", "attempted": 180, "right": 160, "wrong": 20, "total": 180 }
  ]

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5, mt: 2 }}>
        Hi, Welcome back <span className='text-primary fw-bold'>{user.user.username}</span>👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title=" Attempted Right MCQS"
            total={714000}
            color="success"
            icon={<img alt="icon" src={right} height={83} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="Attempted Wrong MCQS"
            total={13444}
            color="info"
            icon={<img alt="icon" src={wrong} height={90} />}
          />
        </Grid>

        {/* subject overview */}
        <Grid xs={12} sm={12} md={12}>
          <Typography variant="h4" sx={{ mb: 1, mt: 4, textAlign: "center" }}>
            <span className='text-primary fw-bold'>Subjects Overview 📚</span>
          </Typography>
        </Grid>

        {/* //SubjectOverview containers */}
        <Row>
          {dummydata.map((ele, index) => (
            <Grid xs={12} md={4} lg={4} sm={6} >
              <SubjectOverview key={index} data={ele} />
            </Grid>
          ))}
        </Row>



        {/* //charts overview */}
        {/* <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '09/01/2003',
                '10/01/2003',
                '07/01/2003',
                '08/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={12} lg={12}>
          <AppCurrentVisits
            title="Subjects"
            chart={{
              series: [
                { label: 'Mathematics', value: 300 },
                { label: 'History', value: 200 },
                { label: 'Science', value: 400 },
                { label: 'Geography', value: 150 },
                { label: 'Literature', value: 250 },
                { label: 'Computer Science', value: 180 }
              ]
              ,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
