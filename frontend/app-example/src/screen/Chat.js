import React, { useState } from "react";
import { TextInput, View, StyleSheet, Text, Button, Modal } from "react-native";

import Notice from "../components/Notice";

const serverIP = process.env.EXPO_PUBLIC_ServerIP;

const Chat = () => {
  const [num, setNum] = useState("");
  const [result, setResult] = useState("");
  const [notice, setNotice] = useState(false);

  const toggleModalVisibility = () => {
    setNotice(false);
  };

  const getResultFromOpenApi = async () => {
    if (num === "") {
      setNotice(true);
    } else {
      setNotice(false);
      try {
        const response = await fetch(`http://${serverIP}/openapi`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ num }),
        });
        const jsonData = await response.json();
        setResult(jsonData.result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Notice
        render={notice}
        message={"Asegurate de ingresar un número"}
        closeModal={toggleModalVisibility }
      />
      <Text style={styles.text}>
        {"Ingrese el número que desea convertir a binario"}
      </Text>
      <TextInput
        style={styles.input}
        inputMode="numeric"
        value={num}
        onChangeText={setNum}
      />
      <View style={styles.container_btn}>
        <Button title={"Enviar"} onPress={getResultFromOpenApi} />
      </View>
      <View style={styles.response}>
        <Text style={styles.text2}>{result}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 20,
  },
  input: {
    width: "50%",
    textAlign: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 25,
  },
  container_btn: {
    width: "30%",
  },
  text2: {
    fontSize: 18,
    fontWeight: "bold",
  },
  response: {
    padding: 50,
  },
});

export default Chat;
