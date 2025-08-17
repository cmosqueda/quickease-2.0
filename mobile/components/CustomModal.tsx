import CustomView from "./CustomView";

import React, { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export interface CustomModalProps extends Omit<ModalProps, "visible"> {
  modalVisibility: boolean;
  setModalVisibility: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  containerStyle?: ViewStyle;
  overlayOpacity?: number;
}

const CustomModal: React.FC<CustomModalProps> = ({
  modalVisibility,
  setModalVisibility,
  children,
  containerStyle = {},
  overlayOpacity = 0.2,
  ...rest
}) => {
  const onRequestClose = async () => {
    NavigationBar.setVisibilityAsync("visible");
    setModalVisibility(false);
  };

  const onShow = async () => {
    NavigationBar.setVisibilityAsync("hidden");
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={modalVisibility}
      onRequestClose={onRequestClose}
      onShow={onShow}
      statusBarTranslucent
      navigationBarTranslucent
      {...rest}
    >
      <CustomView
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
            justifyContent: "flex-end",
          },
          containerStyle,
        ]}
      >
        {children}
      </CustomView>
    </Modal>
  );
};

export default CustomModal;
