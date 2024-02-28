import React, { useState } from "react";
import { Text, View, StyleSheet, Button, TextInput, Alert } from "react-native";
import * as ExpoDocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

const serverIP = process.env.EXPO_PUBLIC_ServerIP;

const Pdf = () => {
  const [file, setFile] = useState({ canceled: true });
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");

  const handleFilePicker = async () => {
    const result = await ExpoDocumentPicker.getDocumentAsync();
    setFile(result);
  };

  const handleUpload = async () => {
    try {
      if (!file.canceled && question === "") {
      } else {
        const response = await FileSystem.uploadAsync(
          `http://${serverIP}/upload`,
          file.assets[0].uri,
          {
            fieldName: file.assets[0].name,
            httpMethod: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Question: question,
              Name: file.assets[0].name,
            },
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          }
        );
        await response;
        setResult(response.body);
        setQuestion("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Button title={"Select PDF"} onPress={handleFilePicker} />
      {!file.canceled && (
        <Text style={styles.text}>{file.assets[0].name} seleccionado.</Text>
      )}

      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder={"Ingresa tu pregunta"}
      />
      <Button title={"send"} onPress={handleUpload} />
      <View style={styles.response}>
        <Text style={styles.text}>{result}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  response: {
    padding: 50,
  },
});
export default Pdf;
