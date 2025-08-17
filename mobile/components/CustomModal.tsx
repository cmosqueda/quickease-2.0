import CustomView from "./CustomView";

import React, { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Modal,
  ModalProps,
  useWindowDimensions,
  ViewStyle,
} from "react-native";

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
  const { height } = useWindowDimensions();

  const onRequestClose = () => setModalVisibility(false);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={modalVisibility}
      onRequestClose={onRequestClose}
      statusBarTranslucent
      {...rest}
    >
      <CustomView
        style={[
          {
            height,
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
