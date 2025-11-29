import {
  VisualPatternEnum,
  VisualSizeEnum,
  VisualTypeEnum,
} from "@/constants/Models";
import React from "react";
import { View, ViewStyle } from "react-native";

interface MedicationIconProps {
  type: VisualTypeEnum;
  size?: VisualSizeEnum;
  pattern?: VisualPatternEnum;
  color: string;
}

// --- Constants ---
const SIZES = {
  [VisualSizeEnum.SMALL]: 25,
  [VisualSizeEnum.MEDIUM]: 35,
  [VisualSizeEnum.LARGE]: 50,
};

const MedicationIcon: React.FC<MedicationIconProps> = ({
  type = VisualTypeEnum.PILL,
  size = VisualSizeEnum.MEDIUM,
  pattern = VisualPatternEnum.SOLID,
  color = "#c5c5c5",
}) => {
  const baseSize = SIZES[size];
  const isRing = pattern === VisualPatternEnum.RING;

  const getBodyStyle = (): ViewStyle => ({
    backgroundColor: isRing ? "transparent" : color,
    borderColor: color,
    borderWidth: isRing ? baseSize * 0.1 : 0,
    overflow: "hidden",
  });

  switch (type) {
    case VisualTypeEnum.PILL: // Circle
      return (
        <View
          style={[
            { width: baseSize, height: baseSize, borderRadius: baseSize / 2 },
            getBodyStyle(),
          ]}
        ></View>
      );

    case VisualTypeEnum.TABLET: // Oval
      return (
        <View
          style={[
            {
              width: baseSize,
              height: baseSize * 0.6,
              borderRadius: baseSize * 0.15,
            },
            getBodyStyle(),
          ]}
        ></View>
      );

    case VisualTypeEnum.CAPSULE: // Oblong
      return (
        <View
          style={[
            {
              width: baseSize * 0.6,
              height: baseSize,
              borderRadius: baseSize * 0.3,
            },
            getBodyStyle(),
          ]}
        ></View>
      );

    case VisualTypeEnum.PATCH: // Rounded Square
      return (
        <View
          style={[
            { width: baseSize, height: baseSize, borderRadius: baseSize * 0.1 },
            getBodyStyle(),
          ]}
        ></View>
      );

    case VisualTypeEnum.DROP: // Teardrop (Rotated square with one sharp corner)
      return (
        <View
          style={{
            width: baseSize,
            height: baseSize,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={[
              getBodyStyle(),
              {
                width: baseSize * 0.8,
                height: baseSize * 0.8,
                borderTopLeftRadius: 0,
                borderTopRightRadius: baseSize * 0.5,
                borderBottomRightRadius: baseSize * 0.5,
                borderBottomLeftRadius: baseSize * 0.5,
                transform: [{ rotate: "45deg" }],
              },
            ]}
          ></View>
        </View>
      );

    case VisualTypeEnum.LIQUID: // Bottle
      return (
        <View
          style={{
            width: baseSize,
            height: baseSize,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* Cap */}
          <View
            style={{
              width: baseSize * 0.4,
              height: baseSize * 0.2,
              backgroundColor: color,
              opacity: 0.5,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            }}
          />
          {/* Body */}
          <View
            style={[
              {
                width: baseSize * 0.7,
                height: baseSize * 0.7,
                borderRadius: 8,
              },
              getBodyStyle(),
            ]}
          ></View>
        </View>
      );

    case VisualTypeEnum.INHALER: // L-Shape composition
      return (
        <View
          style={{
            width: baseSize,
            height: baseSize,
            justifyContent: "flex-end",
          }}
        >
          {/* Vertical Part */}
          <View
            style={[
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                width: baseSize * 0.4,
                height: baseSize * 0.9,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              },
              getBodyStyle(),
            ]}
          />
          {/* Horizontal Part */}
          <View
            style={[
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                width: baseSize * 0.8,
                height: baseSize * 0.4,
                borderBottomRightRadius: 10,
                borderBottomLeftRadius: 10,
              },
              getBodyStyle(),
            ]}
          ></View>
        </View>
      );

    case VisualTypeEnum.INJECTION: // Syringe
      return (
        <View
          style={{
            width: baseSize,
            height: baseSize,
            alignItems: "center",
            transform: [{ rotate: "45deg" }],
          }}
        >
          {/* Needle */}
          <View
            style={{
              width: 2,
              height: baseSize * 0.2,
              backgroundColor: "#999",
            }}
          />
          {/* Body */}
          <View
            style={[
              { width: baseSize * 0.25, height: baseSize * 0.6 },
              getBodyStyle(),
            ]}
          ></View>
          {/* Plunger */}
          <View
            style={{ width: baseSize * 0.4, height: 4, backgroundColor: color }}
          />
        </View>
      );

    case VisualTypeEnum.OINTMENT: // Tube
      return (
        <View
          style={{
            width: baseSize,
            height: baseSize,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ rotate: "-45deg" }],
          }}
        >
          {/* Tube Cap */}
          <View
            style={{
              width: baseSize * 0.4,
              height: baseSize * 0.2,
              backgroundColor: "#666",
            }}
          />
          {/* Tube Body */}
          <View
            style={[
              {
                width: baseSize * 0.5,
                height: baseSize * 0.7,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              },
              getBodyStyle(),
            ]}
          ></View>
        </View>
      );

    default:
      return (
        <View
          style={{ width: baseSize, height: baseSize, backgroundColor: "#ccc" }}
        />
      );
  }
};

export default MedicationIcon;
