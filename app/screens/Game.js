import React, { Component } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";

import Score from "../components/Score";
import Card from "../components/Card";

import shuffleArray from "../helpers/shuffleArray";

import cards_data from "../data/cards";

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

  state = {
    current_selection: [],
    selected_pairs: [],
    score: 0,
    opponent_score: 0
  };

  constructor(props) {
    super(props);

    this.pusher = null;
    this.my_channel = null;
    this.opponent_channel = null;
    this.username = null;
    this.opponent = null;

    let sources = {
      fontawesome: FontAwesome,
      entypo: Entypo
    };

    let clone = JSON.parse(JSON.stringify(cards_data));

    this.cards = cards_data.concat(clone);
    this.cards.map(obj => {
      let id = Math.random()
        .toString(36)
        .substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
    });

    this.cards = shuffleArray(this.cards);
  }

  componentDidMount() {
    const { navigation } = this.props;

    this.pusher = navigation.getParam("pusher");
    this.my_channel = navigation.getParam("my_channel");

    this.username = navigation.getParam("username");
    this.opponent = navigation.getParam("opponent");

    this.setState({
      cards: this.cards
    });

    if (this.opponent) {
      this.opponent_channel = this.pusher.subscribe(
        `private-user-${this.opponent}`
      );
      this.opponent_channel.bind("pusher:subscription_error", status => {
        Alert.alert("Subscription error", "Please restart the app");
      });

      this.opponent_channel.bind("pusher:subscription_succeeded", data => {
        console.log("opponent subscription ok: ", data);

        this.opponent_channel.bind("client-opponent-scored", data => {
          console.log("score updated: ", data);
          this.setState({
            opponent_score: data.score
          });
        });

        this.opponent_channel.bind("client-opponent-won", data => {
          Alert.alert("You lose", `${data.username} won the game`);
          this.resetCards();
        });
      });
    }
  }

  render() {
    let contents = this.state.cards;

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <FlatList
            data={contents}
            renderItem={this.renderCard}
            numColumns={4}
            keyExtractor={item => item.id}
            columnWrapperStyle={styles.flatlistRow}
          />
        </View>
        <View style={styles.bottomContent}>
          <Score score={this.state.score} username={this.username} />
          <Score score={this.state.opponent_score} username={this.opponent} />
        </View>
      </View>
    );
  }

  renderCard = ({ item }) => {
    return (
      <Card
        key={item.id}
        src={item.src}
        name={item.name}
        color={item.color}
        is_open={item.is_open}
        clickCard={this.clickCard.bind(this, item.id)}
      />
    );
  };

  clickCard = id => {
    let selected_pairs = [...this.state.selected_pairs];
    let current_selection = this.state.current_selection;
    let score = this.state.score;

    let index = this.state.cards.findIndex(card => {
      return card.id == id;
    });

    let cards = [...this.state.cards];

    if (
      cards[index].is_open == false &&
      selected_pairs.indexOf(cards[index].name) === -1
    ) {
      cards[index].is_open = true;

      current_selection.push({
        index: index,
        name: cards[index].name
      });

      if (current_selection.length == 2) {
        if (current_selection[0].name == current_selection[1].name) {
          score += 1;
          selected_pairs.push(cards[index].name);

          this.my_channel.trigger("client-opponent-scored", {
            username: this.username,
            score: score
          });

          if (score == 12) {
            score = 0;
            Alert.alert("Awesome!", "You won the game");
            this.my_channel.trigger("client-opponent-won", {
              username: this.username
            });

            this.resetCards();
          }
        } else {
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards
            });
          }, 500);
        }

        current_selection = [];
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection
      });
    }
  };

  resetCards = () => {
    let cards = this.cards.map(obj => {
      obj.is_open = false;
      return obj;
    });

    cards = shuffleArray(cards);

    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 0,
      opponent_score: 0
    });
  };
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
