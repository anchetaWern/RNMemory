import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login screen</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  topContent: {
    flex: 1,
    justifyContent: "center"
  },
  bigText: {
    fontSize: 25,
    fontWeight: "bold"
  },
  mainContent: {
    flex: 1
  },
  label: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "#333"
  },
  text_field: {
    width: 200,
    height: 40,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10
  }
};
