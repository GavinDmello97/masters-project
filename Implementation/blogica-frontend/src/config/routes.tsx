/* package inports */
import React, { useState, useRef, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Dispatch } from "@reduxjs/toolkit";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

/* component/ inports */
import Header from "../components/Header";
import {
  Home,
  Feeds,
  SignIn,
  SignUp,
  ContributorList,
  ArticleList,
  ArticleDetail,
  AuthorProfile,
  NotFound,
  NewArticle,
} from "../screens/index";
import ScrollToTop from "../components/generic/scrollToTop";
import apis from "../config/api";
/* helper imports */
import reduxApiCallers from "../redux/thunks/reduxApiCallers";
import actions from "../redux/actionReducers/index";
import Footer from "../components/Footer";
const { loadUser, removeUser } = actions;

const MainRouter = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const MainRoutes = () => {
    const [isModalOpen, updateModalOpen] = useState(false);
    const [loading, updateLoading] = useState(false);
    const toggleModal = () => {
      updateModalOpen(!isModalOpen);
    };

    const state = useSelector((state: any) => {
      // eslint-disable-next-line no-labels, no-label-var
      return { userState: state.userActionReducer };
    });
    const { user } = state.userState;

    useEffect(() => {
      updateLoading(true);
      var userToken = localStorage.getItem("token");
      userToken && userToken.length > 0
        ? apis
            .getUserDetails()
            .then(({ data }) => {
              dispatch(loadUser(data));
              updateLoading(false);
            })
            .catch((err) => {
              alert("failed to load user. Please login");
              dispatch(removeUser());
              navigate("/auth/signin");
              updateLoading(false);
            })
        : updateLoading(false);
    }, []);

    useEffect(() => {
      if (user && location.pathname == "/main/home") {
        navigate("/main/feeds");
      } else if (!user && location.pathname == "/main/feeds") {
        navigate("/main/home");
      }
    }, [location.pathname, user]);
    if (loading) {
      return (
        <div className="vh-100 col-12 d-flex flex-column justify-content-between align-items-center"></div>
      );
    } else {
      return (
        <div className="vh-100 col-12 d-flex flex-column">
          {location.pathname != "/main/article/new" && (
            <Header modalCallback={() => toggleModal()} />
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Navigate to={user ? "/main/feeds" : "/main/home"} replace />
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/contributors" element={<ContributorList />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route
              path="/article/new"
              element={
                <ScrollToTop>
                  <NewArticle />
                </ScrollToTop>
              }
            />
            <Route
              path="/article/id/:articleId"
              element={
                <ScrollToTop>
                  <ArticleDetail />
                </ScrollToTop>
              }
            />
            <Route
              path="/author/id/:authorId"
              element={
                <ScrollToTop>
                  <AuthorProfile />
                </ScrollToTop>
              }
            />
            {/* default route */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
          {location.pathname != "/main/article/new" && <Footer />}
        </div>
      );
    }
  };

  const AuthRoutes = () => {
    return (
      <div>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* default route */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </div>
    );
  };

  return (
    <div className="">
      <Routes>
        {/* <Route path="/" element={<Navigate to="/main" replace />} /> */}
        <Route path={"main/*"} element={<MainRoutes />} />
        <Route path={"auth/*"} element={<AuthRoutes />} />
        <Route path={"not-found"} element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </div>
  );
};

export default MainRouter;
