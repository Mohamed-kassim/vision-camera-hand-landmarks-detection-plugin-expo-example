import { VisionCameraProxy, Frame } from "react-native-vision-camera";
const plugin = VisionCameraProxy.initFrameProcessorPlugin("detectHands", {});

export interface HandDetectorOptions extends Record<string, any> {
  /**
   * The minimum confidence score for the hand detection to be considered successful.
   * Defaults to 0.5. Must be between 0 and 1.
   */
  minHandDetectionConfidence?: number;
  /**
   * The minimum confidence score of hand presence score in the hand landmark detection.
   * Defaults to 0.5. Must be between 0 and 1.
   */
  minHandPresenceConfidence?: number;
  /**
   * The minimum confidence score for the hand tracking to be considered successful.
   * Defaults to 0.5. Must be between 0 and 1.
   */
  minTrackingConfidence?: number;
  /**
   * The maximum number of hands that can be detected by the model.
   * Defaults to 1. Must be between 1 and 2.
   */
  numHands?: number;
  /**
   * Should auto scale face bounds, contour and landmarks on native side?
   * This option should be disabled if you want to draw on frame using `Skia Frame Processor`.
   * See [this](https://github.com/luicfrr/react-native-vision-camera-face-detector/issues/30#issuecomment-2058805546) and [this](https://github.com/luicfrr/react-native-vision-camera-face-detector/issues/35) for more details.
   *
   * @default false
   */
  autoScale?: boolean;
  /**
   * Required if you want to use `autoScale`. You must handle your own logic to get screen sizes, with or without statusbar size, etc...
   *
   * @default 1.0
   */
  windowWidth?: number;
  /**
   * Required if you want to use `autoScale`. You must handle your own logic to get screen sizes, with or without statusbar size, etc...
   *
   * @default 1.0
   */
  windowHeight?: number;
}

interface HandLandmark {
  x: number;
  y: number;
}
interface Handedness {
  label: string;
  score: number;
  index: number;
}
interface Hand {
  landmarks: HandLandmark[];
  handedness: Handedness;
}

type Hands = Hand[];
export function detectHands(frame: Frame, options: HandDetectorOptions): Hands {
  "worklet";
  console.log("plugin", plugin);
  if (plugin == null) {
    throw new Error("Failed to load Frame Processor Plugin!");
  }
  return plugin.call(frame, options) as unknown as Hands;
}

export type { Hand, Hands };
