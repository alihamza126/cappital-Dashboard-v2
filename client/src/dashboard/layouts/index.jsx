import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";
import { Outlet } from "react-router-dom";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />
      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          // marginTop: 6,
        }}
      > 
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main className="">
          {children}
          <Outlet />
        </Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
