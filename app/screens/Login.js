import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator
} from "react-native";

import Pusher from "pusher-js/react-native";

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    username: "",
    is_loading: false
  };

  constructor(props) {
    super(props);
    this.pusher = null;
    this.my_channel = null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContent}>
          <Text style={styles.bigText}>RNMemory</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.text_field}
            onChangeText={username => {
              this.setState({ username });
            }}
            value={this.state.username}
            placeholder="Enter your username"
          />

          {!this.state.is_loading && (
            <Button onPress={this.login} title="Enter" color="#0064e1" />
          )}

          {this.state.is_loading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </View>
    );
  }

  login = () => {
    let username = this.state.username;

    if (username) {
      this.setState({
        is_loading: true
      });

      this.pusher = new Pusher("YOUR PUSHER APP KEY", {
        authEndpoint: "YOUR_NGROK_URL/pusher/auth",
        cluster: "YOUR_PUSHER_APP_CLUSTER",
        encrypted: true,
        auth: {
          params: { username: username }
        }
      });

      this.my_channel = this.pusher.subscribe(`private-user-${username}`);
      this.my_channel.bind("pusher:subscription_error", status => {
        Alert.alert(
          "Error",
          "Subscription error occurred. Please restart the app"
        );
      });

      this.my_channel.bind("pusher:subscription_succeeded", data => {
        console.log("subscription ok: ", data);

        this.my_channel.bind("opponent-found", data => {
          console.log("opponent found: ", data);

          let opponent =
            username == data.player_one ? data.player_two : data.player_one;

          Alert.alert("Opponent found!", `${opponent} will take you on!`);

          this.setState({
            is_loading: false,
            username: ""
          });

          this.props.navigation.navigate("Game", {
            pusher: this.pusher,
            username: username,
            opponent: opponent,
            my_channel: this.my_channel
          });
        });
      });
    }
  };
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
