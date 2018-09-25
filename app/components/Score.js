import React, { Component } from "react";
import { View, Text } from "react-native";

export default class Score extends Component {
  render() {
    const { score, username } = this.props;

    return (
      <View style={styles.score_container}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.username}>{username}</Text>
      </View>
    );
  }
}

const styles = {
  score_container: {
    flex: 1,
    alignItems: "center"
  },
  score: {
    fontSize: 40,
    fontWeight: "bold"
  },
  username: {
    fontSize: 15
  }
};
