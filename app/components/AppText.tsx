import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

import tw from "@/lib/tailwind";
interface AppTextProps {
  style?: StyleProp<TextStyle>;
  children:
  | JSX.Element
  | JSX.Element[]
  | string
  | number
  | (string | number)[]
  | Date
  | undefined;
}

const AppText: React.FC<AppTextProps> = ({
  children,
  style,
  ...otherProps
}) => {
  return (
    <Text allowFontScaling={false} style={[tw`text-base`, { fontFamily: 'Poppins' }, style]} {...otherProps}>
      {children}
    </Text>
  );
};



export default AppText;
