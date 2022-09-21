import React from 'react';

const GREEN_COLOR = '#03c75a';
const WHITE_COLOR = '#ffffff';

export const LogoNaver = ({ invert, props }) => {
  const fgColor = invert ? WHITE_COLOR : GREEN_COLOR;
  const styles = {
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:svg': 'http://www.w3.org/2000/svg',
    version: '1.1',
    'xml:space': 'preserve',
    width: '20',
    height: '20',
    viewBox: '0 0 20 20',
    ...props,
  };
  return (
    <svg style={styles}>
      <g xmlns="http://www.w3.org/2000/svg" transform="translate(8.832,9.662) scale(-1,1)">
        <path
          d="m 0,0 -5.683,8.135 h -4.711 V -7.064 h 4.935 V 1.071 L 0.224,-7.064 H 4.935 V 8.135 H 0 Z"
          style={{ fill: fgColor, fillOpacity: 1, fillRule: 'nonzero', stroke: 'none' }}
        />
      </g>
    </svg>
  );
};
