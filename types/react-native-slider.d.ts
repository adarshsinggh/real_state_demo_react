declare module 'react-native-slider' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface SliderProps {
      value?: number;
      onValueChange?: (value: number) => void;
      minimumValue?: number;
      maximumValue?: number;
      step?: number;
      disabled?: boolean;
      minimumTrackTintColor?: string;
      maximumTrackTintColor?: string;
      thumbTintColor?: string;
      thumbStyle?: ViewStyle;
      trackStyle?: ViewStyle;
    }
  
    export default class Slider extends Component<SliderProps> {}
  }
  