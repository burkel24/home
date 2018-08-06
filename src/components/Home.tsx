import * as React from 'react';
import { RouteProps } from 'react-router-dom';

import '~/home.css';

const Home: React.SFC<RouteProps> = (props) => {
  return (
    <div className="home py-5">
      <div className="content mx-auto font-weight-light">
      
        <div className="h-100 d-flex align-items-center py-4">
          <div className="sprite mr-5" />
          <div className="h-100 align-self-start text-left text-navy">
            <h1>Burke Livingston</h1>
            <h3 className="font-italic">Programming. Design. Music Production.</h3>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Home;