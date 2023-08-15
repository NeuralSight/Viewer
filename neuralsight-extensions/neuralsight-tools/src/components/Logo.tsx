import React, { ReactElement } from 'react';

function Logo(): ReactElement {
  return (
    <img
      src={'../../assets/Gif_Logo.gif'}
      alt="Neural Labs"
      className=""
      style={{ width: 'auto', height: '40px' }}
    />
  );
}

export default Logo;
