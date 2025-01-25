import React from "react";
import {
  Camera,
  useCameraFormat,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useCameraPermission } from "react-native-vision-camera";
import { useEffect, useState } from "react";
import { useCameraDevice } from "react-native-vision-camera";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Worklets } from "react-native-worklets-core";
import { detectHands, Hand } from "../../components/hand-detector";

export default function TabTwoScreen() {
  const device = useCameraDevice("back");
  const format = useCameraFormat(device, [{ fps: 10 }]);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  console.log("dimensions", windowWidth, windowHeight);

  const [hand, setHand] = useState<Hand | null>(null);
  const handleHand = Worklets.createRunOnJS((detectedHand: Hand | null) => {
    setHand(detectedHand);
  });

  // const frameProcessor = useFrameProcessor(
  //   frame => {
  //     'worklet';

  //     // const frameWidth = frame.height;
  //     // const frameHeight = frame.width;
  //     const hands = detectHands(frame, {
  //       autoScale: true,
  //       windowHeight: windowHeight,
  //       windowWidth: windowWidth,
  //     });
  //     console.log('hands', hands);
  //     // console.log('frameWidth, frameHeight', frameWidth, frameHeight);
  //     // console.log('data', data);
  //     // const scaleX = windowWidth / frameWidth;
  //     // const scaleY = windowHeight / frameHeight;

  //     const detectedHand = hands[0];
  //     if (!detectedHand) {
  //       handleHand(null);
  //       return;
  //     }
  //     // Calculate scaling factor while preserving aspect ratio

  //     // const points: Point[] = [];
  //     // const normalizedPoints: Point[] = [];
  //     // const jsScaledLandmarks: Point[] = [];
  //     // for (const hand of data || []) {
  //     //   for (const mark of hand.landmarks) {
  //     //     // Rotate from landscape right to portrait by:
  //     //     // - Swapping x and y coordinates
  //     //     // - Inverting the new x coordinate (1 - x)
  //     //     points.push({
  //     //       x: (1 - mark.y) * frameWidth * scaleX,
  //     //       y: mark.x * frameHeight * scaleY,
  //     //     });
  //     //     jsScaledLandmarks.push({
  //     //       x: mark.x * frameWidth * scaleX,
  //     //       y: mark.y * frameHeight * scaleY,
  //     //     });
  //     //   }
  //     //   for (const mark of hand.normalizedLandmarks) {
  //     //     normalizedPoints.push({
  //     //       x: mark.y,
  //     //       y: windowWidth - mark.x,
  //     //     });
  //     //   }
  //     //   console.log('raw landmarks', hand.landmarks);
  //     //   console.log('native scaled landmarks', hand.normalizedLandmarks);
  //     //   console.log('js scaled landmarks', jsScaledLandmarks);
  //     // }

  //     // console.log('points', points);
  //     // console.log('normalizedPoints', normalizedPoints);
  //     console.log('detectedHand.handedness', detectedHand.handedness);
  //     handleHand(detectedHand);
  //   },
  //   [windowWidth, windowHeight],
  // );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      const hands = detectHands(frame, {
        autoScale: true,
        windowHeight: windowHeight,
        windowWidth: windowWidth,
      });
      console.log("hands", hands);
      // console.log('hands', hands);
      // const detectedHand = hands[0];
      // if (!detectedHand) {
      //   handleHand(null);
      //   return;
      // }
      // console.log('detectedHand.handedness', detectedHand.handedness);
      // handleHand(detectedHand);
      // frame.close();
    },
    [windowWidth, windowHeight]
  );

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (!hasPermission) {
    return <Text>No permission</Text>;
  }
  if (device == null) {
    return <Text>No device</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        // fps={30}.

        format={format}
        pixelFormat="rgb"
      />
      {/* <HandLandmarks hand={hand} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
