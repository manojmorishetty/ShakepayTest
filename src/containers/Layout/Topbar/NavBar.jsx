import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";

const NavbarSW = () => {
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/home">Shake Pay</NavbarBrand>
      </Navbar>
    </div>
  );
};

export default NavbarSW;
