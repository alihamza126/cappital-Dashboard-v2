import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from '/src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
      className='d-flex align-items-center justify-content-between'
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h3" style={{fontFamily:"fredoka",fontWeight:"500"}}>{fShortenNumber (total)}</Typography>

        <Typography variant="subtitle2"fontSize={16}  sx={{ color: 'text.disabled',fontWeight:"bold",paddingRight:"2rem"}}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
