import React from "react";
import { View, StyleSheet, Text, Button, Modal } from "react-native";

function Notice(props) {
  return (
    <Modal animationType="slide" transparent={true} visible={props.render}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{props.message}</Text>
          <Button title="Cerrar" onPress={props.closeModal}></Button>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 35,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
  },
});
export default Notice;
