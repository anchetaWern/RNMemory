import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Game extends Component {
  static navigationOptions = () => {
    return {
      headerTitle: `RNMemory`,
      headerStyle: {
        backgroundColor: "#333"
      },
      headerTitleStyle: {
        color: "#FFF"
      }
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Game screen</Text>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff"
  },
  body: {
    marginTop: 10
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flatlistRow: {
    flex: 1,
    padding: 10
  }
};
