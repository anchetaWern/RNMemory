import React from "react";
import { createStackNavigator } from "react-navigation";

import LoginScreen from "./app/screens/Login";
import GameScreen from "./app/screens/Game";

console.ignoredYellowBox = ["Setting a timer"];

export default createStackNavigator(
  {
    Login: LoginScreen,
    Game: GameScreen
  },
  {
    initialRouteName: "Login"
  }
);
