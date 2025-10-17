/// <reference types="google.maps" />

// Type augmentation for @react-google-maps/api JSX components
declare module '@react-google-maps/api' {
  import { ComponentType } from 'react';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const GoogleMap: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const MarkerF: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const InfoWindow: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const InfoWindowF: ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useJsApiLoader(options: any): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useLoadScript(options: any): any;
}
