/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  ListView,
  Image,
  Text,
  NavigatorIOS,
  WebView,
  TouchableHighlight
} = React;

var API_URL = 'https://api.github.com/search/repositories?q=react+native&sort=stars&order=desc';
var PARAMS = '';
var REQUEST_URL = API_URL + PARAMS;

var ReactNativeStars = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        initialRoute={{
          component: ItemList,
          title: 'React Native Stars'
          }}
      />
    );
  }
});

var ItemList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.items),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderItem}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading ...
        </Text>
      </View>
    );
  },

  renderItem: function(item) {
    return(
      <ItemCell
        onSelect={() => this.selectItem(item)}
        item={item}
      />
    );
  },

  selectItem: function(item) {
    this.props.navigator.push({
      title: item.full_name,
      component: WebView,
      passProps: {url: item.html_url}
    });
  },
});

var ItemCell = React.createClass({
  render: function() {
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.container}>
        <Image
          source={{uri: this.props.item.owner.avatar_url}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{this.props.item.name}</Text>
          <Text style={styles.owner}>{this.props.item.owner.login}</Text>
          <Text style={styles.stars}>☆{this.props.item.stargazers_count}</Text>
        </View>
      </View>
      </TouchableHighlight>
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  listView: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#FFFFFF',
  },
  rightContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: '#444444',
  },
  owner: {
    fontSize: 15,
    textAlign: 'left',
    color: '#888888',
  },
  stars: {
    fontSize: 20,
    textAlign: 'right',
    color: '#444444',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

AppRegistry.registerComponent('ReactNativeStars', () => ReactNativeStars);
