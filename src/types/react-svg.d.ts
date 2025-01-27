// src/types/react-svg.d.ts
import React from 'react';

declare module 'react' {
  interface ReactSVG extends React.FC<React.SVGProps<SVGSVGElement>> {}
  interface SVGAttributes extends React.SVGProps<SVGSVGElement> {}
}
