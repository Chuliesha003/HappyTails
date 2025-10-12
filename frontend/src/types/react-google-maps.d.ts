/// <reference types="google.maps" />

// Type fix for @react-google-maps/api JSX components
declare module '@react-google-maps/api' {
  import { ComponentType } from 'react';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const GoogleMap: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const MarkerF: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useJsApiLoader(options: any): any;
}
