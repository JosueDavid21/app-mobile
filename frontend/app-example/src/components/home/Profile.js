import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
const iconSize = 35;
const facebook = <Icon name={"facebook"} size={iconSize} color={"#106bff"} />;
const instagram = <Icon name={"instagram"} size={iconSize} color={"#d50868"} />;
const tiktok = <Icon name={"tiktok"} size={iconSize} color={"black"} />;
const youtube = <Icon name={"youtube"} size={iconSize} color={"#fe080a"} />;

const Profile = () => {
  const user = {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjMQzgGL0G1DOkQsVGbPa7QuG5WJ4C1BGyIA&usqp=CAU",
    name: "Josue David",
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.backContainer} />
        <Image source={{ uri: user.avatar }} style={styles.photoContainer} />
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.bottonContainer}>
        <View style={styles.buttonGoogle}>
          <Icon.Button
            name="google"
            backgroundColor={"white"}
            color={"#3e9f5e"}
            size={30}
            onPress={() => {
              Linking.openURL(
                "https://accounts.google.com/v3/signin/identifier?ifkv=ASKXGp2IJ4m-VrNUghUnWOLOHZmmHbNTTaFKeq8Rrq91bMEjE7NiX83W0O1mNXfVS7GXblw-j4qhdQ&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S218251293%3A1706563302800808&theme=glif"
              );
            }}
          >
            Login with Google
          </Icon.Button>
        </View>
        <Text style={styles.follow}>Follow us on our social networks</Text>
        <View style={styles.networkContainer}>
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL("https://tiktok.com/")}
          >
            {facebook}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              Linking.openURL("https://instagram.com/");
            }}
          >
            {instagram}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL("https://tiktok.com/")}
          >
            {tiktok}
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => Linking.openURL("https://linkedin.com/")}
          >
            {youtube}
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  topContainer: {
    width: "100%",
    height: "60%",
    alignItems: "center",
  },
  backContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    resizeMode: "cover",
    backgroundColor: "#cccccc",
    zIndex: 0,
  },
  photoContainer: {
    width: 300,
    height: 300,
    borderRadius: 150,
    top: "-25%",
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: "white",
    zIndex: 1,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: "white",
    backgroundColor: "green",
  },
  name: {
    top: "-20%",
    zIndex: 0,
    fontSize: 24,
    fontWeight: "bold",
  },
  bottonContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonGoogle: {
    alignItems: "center",
    marginBottom: "18%",
    borderColor: "#3e9f5e",
  },
  follow: {
    fontSize: 16,
  },
  networkContainer: {
    flexDirection: "row",
    marginTop: 14,
    width: "80%",
    justifyContent: "space-between",
  },
});

export default Profile;
