import React, { Component } from 'react';
import CharacterSelect from './game_route/CharacterSelectPage.js';
import Fight from './game_route/Fight.js';
import Victory from './game_route/Victory.js';

const saveUrl = 'http://localhost:3001/game_saves'

class Game extends Component{
    
  constructor(props){
    super(props)
    this.state = {
      collection: [],
      round: 1,
      bosses: [],
      player: null,
      opponent: null,
      beatGame: false,
      gameSave_id: null
    }
  }

  componentDidMount = () => {
      const characters = this.props.characters.map(data => data.attributes)
        this.setState({
          collection: characters.filter(character => character.group === "Playable"),
          bosses: characters.filter(character => character.group === "Boss")
        })
  }

  chooseCharacter = (char) => {
    let all = this.state.collection.filter(i => i !== char)
    let o = all[Math.floor(Math.random() * all.length)];
    all = this.state.collection.filter(i => i !== o)
    this.setState({
        collection: [...all],
        player: char,
        opponent: o
    });
    if (!!this.props.user) this.createSave(char, o)
  }

  createSave = (player, opponent) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        game_saves: {
        user_id: this.props.user.id,
        character_id: player.id,
        opponent_id: opponent.id,
        current_round: this.state.round 
        }
      })
    }
    fetch(saveUrl, options)
    .then(resp => resp.json())
    .then(json => {
      this.setState({
        gameSave_id: json.data.id
      })
    }
    )
  }

  updateSave = (opponent, round) => {
    const options = {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        game_saves: {
        opponent_id: opponent.id,
        current_round: round
      }
    })
    }
    fetch(saveUrl+'/'+this.state.gameSave_id, options)
    .then(resp => resp.json())
    .then(json => {
      this.setState({
        gameSave_id: json.data.id
      })
    })
  }

  loseGame = () => {
   //when player health <= 0, redirect to game over
  }

  advanceRound = () => {
    //triggered by opponent health <= 0
    if (this.state.round < 4){
      let o = this.state.collection[Math.floor(Math.random() * this.state.collection.length)];
      let all = this.state.collection.filter(i => i !== o)
      let next = this.state.round + 1
      this.setState({
        round: next,
        collection: [...all],
        opponent: o
      })
      if (this.props.user) this.updateSave(o,next)
    }else if (this.state.round == 4){
      let final = 5
      let boss = this.state.bosses[Math.floor(Math.random() * this.state.bosses.length)]
      this.setState({
        round: final,
        opponent: boss
      })
      if (this.props.user) this.updateSave(boss,final)
    }else{
      this.setState({
        beatGame: true
      })
    }
  }

  startGame = () => {
    return this.state.player ? <Fight loseGame={this.loseGame} advanceRound={this.advanceRound} round={this.state.round} player={this.state.player} opponent={this.state.opponent} /> : <CharacterSelect chooseCharacter={this.chooseCharacter} collection={this.state.collection} />
  }
    
  render() {
    return (
    <div>
      {this.state.beatGame ? <Victory /> : this.startGame()}
    </div>
    );
  }
}


export default Game;