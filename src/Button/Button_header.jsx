
import React from 'react';
import { Link } from 'react-router-dom';

function Button_Header ({text, link, className, onClick}) {  

  return (
    <div>
      <Link to={link}>
        <button className={className} onClick={onClick}>{text}</button>
      </Link>
    </div>
  );
}

export default Button_Header;