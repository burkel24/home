import * as React from 'react';
import { RouteProps, withRouter } from 'react-router-dom';

import '~/navbar.css';

const Navbar: React.SFC<RouteProps> = (props) => {

  return (
    <div className="navbar">
      <div className="content mx-auto d-flex align-items-center h-100 justify-content-between">
        <div className="mx-4">./burke.sh</div>
        <div>
          <a href="/blog" className="ml-5">Blog</a>
          <a href="/projects" className="ml-5">Projects</a>
          <a href="/about" className="ml-5">About</a>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Navbar);