import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Profile from "./components/home/Profile";
import ListComponent from "./components/list/List";
import User from "./screen/User";
import Chat from "./screen/Chat";
import Pdf from "./screen/Pdf";

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const [color, setColor] = useState("red");
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Profile}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={Profile}
        options={{
          tabBarLabel: "New",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="alarm" color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name={"Products"}
        component={ListComponent}
        options={{
          tabBarLabel: "Products",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name={"clipboard-list"}
              color={color}
              size={35}
            />
          ),
        }}
      />
      <Tab.Screen
        name={"Name"}
        component={User}
        options={{
          tabBarLabel: "Name",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name={"account"} color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name={"OpenIA"}
        component={Chat}
        options={{
          tabBarLabel: "OpenIA",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name={"brain"} color={color} size={35} />
          ),
        }}
      />
      <Tab.Screen
        name={"PDF"}
        component={Pdf}
        options={{
          tabBarLabel: "PDF",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name={"file-pdf-box"}
              color={color}
              size={35}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
