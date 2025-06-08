import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from "../layout/Layout";

import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/home/Home';
import Restaurants from '../pages/Restaurants';



export default function app() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/restaurants" element={<Restaurants />} />
      </Routes>
    </Router>
  );
}
