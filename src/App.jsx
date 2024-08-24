import React, { Suspense, lazy } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import Loader from "./layouts/loader/Loader.js";

import LandingPage from "./pages/landingpages.jsx";
import Login from "./pages/Login.jsx";

/****Layouts*****/
const FullLayout = lazy(() => import("./layouts/FullLayout.js"));

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

/***** Pages ****/
const Starter = lazy(() => import("./views/Starter.jsx"));
const StuffTables = lazy(() => import("./views/ui/StuffTables.js"));
const UserTable = lazy(() => import("./views/ui/UserTable.jsx"));
const TypeTables = lazy(() => import("./views/ui/TypeStuffTable.jsx"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "", element: <Navigate to="/landing" /> },
      { path: "dashboard", element: <Navigate to="/starter" /> },
      { path: "starter", element: <Starter /> },
      { path: "data-barang", element: <StuffTables /> },
      { path: "tipe-barang", element: <TypeTables /> },
      { path: "user", element: <UserTable /> },
      { path: "role", element: "" },
    ],
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

// Initialize smooth scroll
const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return (
    <Suspense fallback={<Loader />}>
      <div className="dark">{routing}</div>
    </Suspense>
  );
};

export default App;
