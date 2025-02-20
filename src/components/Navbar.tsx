import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <li>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/syllabus-upload">Syllabus Upload</Link>
      </li>
    </div>
  )
}

export default Navbar
