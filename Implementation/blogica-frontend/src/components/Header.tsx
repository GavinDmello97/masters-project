/* package inports */
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggler,
  Collapse,
  NavItem,
  NavLink,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
} from "reactstrap";
import { NavLink as RRNavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { useMediaQuery } from "react-responsive";

/* component/screen inports */

/* helper imports */
import { cssHover } from "./generic/hoverProps";
import { icons } from "../config/configuration";
import Generic from "../components/generic/GenericComponents";
import { toggler } from "../utils/generic";
import actions from "../redux/actionReducers/index";
const { loadUser, removeUser } = actions;

const Header = ({ modalCallback }: any) => {
  const dispatch: Dispatch<any> = useDispatch();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const navigate = useNavigate();
  const [isNavOpen, updateNavOpen] = useState(false);

  const state = useSelector((state: any) => {
    // eslint-disable-next-line no-labels, no-label-var
    return { userState: state.userActionReducer };
  });
  const { user } = state.userState;

  return (
    <div className="col-12">
      {/* Show toggle button when size is smaller than md */}
      <Navbar
        light
        expand="md"
        className=" border-bottom col-12  px-md-0 flex-row"
      >
        <div
          className=" col-12  d-flex flex-row  d-md-none"
          style={{ margin: 0 }}
        >
          {/* Toggle button to show/hide articles list/elements */}
          {isTabletOrMobile && (
            <div className="col-2 d-flex justify-content-center align-items-center">
              <NavbarToggler
                onClick={() => toggler(isNavOpen, updateNavOpen)}
                style={{
                  padding: 0,
                  minHeight: 50,
                  minWidth: 50,
                  maxWidth: 70,
                  maxHeight: 70,
                }}
              />
            </div>
          )}

          {isTabletOrMobile && (
            <div className="col-8 col-md-2 m-md-0 p-md-0">
              <div
                className=" d-flex justify-content-center align-items-center"
                style={{ margin: 0 }}
              >
                <img
                  onClick={() => navigate("/main")}
                  className=""
                  src={icons.app_logo}
                  height={60}
                  alt="Blogica"
                />
              </div>
            </div>
          )}

          {user && isTabletOrMobile && (
            <div className=" col-2 d-flex  justify-content-end  align-items-center ">
              <UserAvatar user={user} />
            </div>
          )}

          {/* Wrapper to collapse. Has a key isOpen  */}
        </div>
        <Collapse className=" " isOpen={isNavOpen} navbar>
          {/* Navigation */}
          <Nav navbar className=" col-sm-12 pt-3 ">
            {!user && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                <NavLink
                  tag={RRNavLink}
                  className={"nav-link "}
                  to="/main/articles"
                >
                  <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                    <i
                      className="fa fa-file-text-o fa-lg me-2 "
                      aria-hidden="true"
                    ></i>

                    <span>Articles</span>
                  </div>
                </NavLink>
              </NavItem>
            )}
            {user && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                <NavLink
                  tag={RRNavLink}
                  className={"nav-link "}
                  to="/main/feeds"
                >
                  <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                    <i className="fa fa-eercast fa-lg me-2" />
                    <span className="mb-0 pb-0">My feeds</span>
                  </div>
                </NavLink>
              </NavItem>
            )}
            <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
              <NavLink
                tag={RRNavLink}
                className={"nav-link "}
                to="/main/contributors"
              >
                <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                  <i className="fa  fa-pencil-square-o fa-lg me-2 " />
                  <span className="mb-0 pb-0">Contributors</span>
                </div>
              </NavLink>
            </NavItem>
            {!isTabletOrMobile && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                {/* <NavLink
                    tag={RRNavLink}
                    className={"nav-link  "}
                    to="/"

                  > */}
                <div
                  className=" d-flex justify-content-center"
                  style={{ marginLeft: 12 }}
                >
                  <img
                    onClick={() => navigate("/main")}
                    className=" col-auto mb-2"
                    src={icons.app_logo}
                    height={60}
                    width={60}
                    alt="Blogica"
                  />
                </div>
                {/* </NavLink> */}
              </NavItem>
            )}
            {!user && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                <NavLink
                  tag={RRNavLink}
                  className={"nav-link "}
                  to="/auth/signup"
                >
                  <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                    <i
                      className="fa fa-plus-square-o fa-lg  me-2 "
                      aria-hidden="true"
                    ></i>
                    <span className="mb-0 pb-0">Register</span>
                  </div>
                </NavLink>
              </NavItem>
            )}
            {!user && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                <NavLink
                  tag={RRNavLink}
                  className={"nav-link "}
                  to="/auth/signin"
                >
                  <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                    <i
                      className="fa fa-sign-in fa-lg me-2 "
                      aria-hidden="true"
                    ></i>

                    <span>Sign In</span>
                  </div>
                </NavLink>
              </NavItem>
            )}

            {user && (
              <NavItem className=" ms-2 ms-sm-4 ps-0 ps-sm-2 ps-md-0 ms-md-0  flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-start align-items-md-center  ">
                <NavLink
                  tag={RRNavLink}
                  className={"nav-link "}
                  to="/main/articles"
                >
                  <div className=" d-flex flex-row justify-content-start justify-content-md-center align-items-center ">
                    <i
                      className="fa fa-file-text-o fa-lg me-2 "
                      aria-hidden="true"
                    ></i>

                    <span>Articles</span>
                  </div>
                </NavLink>
              </NavItem>
            )}

            {user && !isTabletOrMobile && (
              <div className=" ms-sm-2 flex-grow-1 flex-shrink-1 d-sm-flex flex-column justify-content-center align-items-center">
                <UserAvatar user={user} />
              </div>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const UserAvatar = (props: any) => {
  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate();
  const { user } = props;
  const [isDropdownOpen, updateDropdown] = useState(false);
  const [myProfileDropdown, updateMyProfileDropdown] = useState(false);
  return (
    <Dropdown
      style={{ position: "absolute", zIndex: 1200 }}
      isOpen={isDropdownOpen}
      toggle={() => {
        updateDropdown(!isDropdownOpen);
      }}
    >
      <DropdownToggle style={{ backgroundColor: "white", border: "0px" }}>
        <Generic.Avatar
          image_url={process.env.REACT_APP_API_URL + user.image_url}
          fullname={`${user.firstname} ${user.lastname}`}
          size={40}
        />
      </DropdownToggle>

      <DropdownMenu
        style={{
          marginTop: 10,
          marginRight: -2,
          boxShadow: "2px 2px 10px 2px rgba(0, 0, 255, .2)",
        }}
      >
        <div
          className="mx-3 mt-1 mb-2"
          onClick={() => updateMyProfileDropdown(!myProfileDropdown)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span> My Profile </span>
          {myProfileDropdown ? (
            <i className="fa fa-chevron-down " />
          ) : (
            <i className="fa fa-chevron-right " />
          )}
        </div>

        {myProfileDropdown && (
          <div>
            <DropdownItem divider />
            {/* For v2 */}
            <DropdownItem
              onClick={() => {
                navigate("/main/feeds/", {
                  state: { tab: 0 },
                });
              }}
            >
              My Articles
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                navigate("/main/feeds/", {
                  state: { tab: 1 },
                });
              }}
            >
              My Article Drafts
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                navigate("/main/feeds/", {
                  state: { tab: 2 },
                });
              }}
            >
              Recent Viewed Articles
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                navigate("/main/feeds/", {
                  state: { tab: 3 },
                });
              }}
            >
              Saved Articles
            </DropdownItem>
          </div>
        )}
        <DropdownItem divider />
        <DropdownItem
          onClick={() => {
            localStorage.setItem("token", "");
            dispatch(removeUser());
          }}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Header;