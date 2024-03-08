import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import { Chip } from "react-native-paper";
import * as ExpoDocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

import Notice from "../components/Notice";

const serverIP = process.env.EXPO_PUBLIC_ServerIP;

const Classifier = () => {
  const [file, setFile] = useState({ assets: null, canceled: true });
  const [result, setResult] = useState("");
  const [chips, setChips] = useState([]);
  const [charge, setCharge] = useState(true);
  const [notice, setNotice] = useState(false);

  const toggleModalVisibility = () => {
    setNotice(false);
  };

  useEffect(() => {
    const opc = [
      { id: 1, text: "Economía", selected: true },
      { id: 2, text: "Política", selected: true },
      { id: 3, text: "Educación", selected: true },
      { id: 4, text: "Deportes", selected: true },
      { id: 5, text: "Seguridad", selected: true },
      { id: 6, text: "Tecnología", selected: true },
      { id: 7, text: "Salud", selected: true },
      { id: 8, text: "Medio Ambiente", selected: true },
    ];
    setChips([]);
    setChips(opc);
  }, []);

  const handleFilePicker = async () => {
    const document = await ExpoDocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: false,
    });
    setFile(document);
  };

  const handleChipPress = (chipId) => {
    setChips(
      chips.map((chip) => {
        if (chip.id === chipId) {
          return { ...chip, selected: !chip.selected };
        }
        return chip;
      })
    );
  };

  const handleUpload = async () => {
    const labels = [];
    chips.map((chip) => {
      if (chip.selected) {
        labels.push(chip.text);
      }
    });
    if (file.assets === null || labels.length < 1) {
      setNotice(true);
    } else {
      setNotice(false);
      try {
        await FileSystem.uploadAsync(
          `http://${serverIP}/upload`,
          file.assets[0].uri,
          {
            fieldName: file.assets[0].name,
            httpMethod: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              name: file.assets[0].name,
            },
            uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          }
        );
      } catch (error) {
        setCharge(false);
        console.error("Error en la carga del archivo (Frontend):", error);
      }
      if (charge) {
        const queryParams = new URLSearchParams({
          name: file.assets[0].name,
        }).toString();
        try {
          const response = await fetch(
            `http://${serverIP}/getText?${queryParams}`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error("Error de red o servidor");
          }
          const text = await response.text();
          const data = {
            text: text,
            labels: labels,
          };
          const classifier = await fetch(
            "http://192.168.100.5:3001/classifier",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const result = await classifier.json();
          let show = "";
          for (let i = 0; i < result.labels.length; i++) {
            const score = result.scores[i] * 100;
            show += `${result.labels[i]}   -   ${score.toFixed(3)}\n`;
          }
          setResult(show);
          setFile({ assets: null, canceled: true });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Notice
        render={notice}
        message={"Selecciona un pdf y por lo menos 1 item"}
        closeModal={toggleModalVisibility}
      />
      <View style={styles.containerButton}>
        <Button title={"Select PDF"} onPress={handleFilePicker} />
      </View>
      <Text style={styles.text}>Select the items to be classifier:</Text>
      <View style={styles.chip}>
        {chips.map((chip) => (
          <Chip
            key={chip.id}
            onPress={() => handleChipPress(chip.id)}
            mode={chip.selected ? "flat" : "outlined"}
            selected={chip.selected}
            style={{ margin: 5 }}
          >
            {chip.text}
          </Chip>
        ))}
      </View>
      <View style={styles.containerButton}>
        <Button title={"Classifier"} onPress={handleUpload} />
      </View>
      <View style={styles.response}>
        <Text style={styles.text}>{result}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  containerButton: {
    width: "75%",
    marginBottom: 20,
  },
  chip: {
    marginBottom: "3%",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "3%",
  },
  response: {
    padding: 50,
  },
});

export default Classifier;
