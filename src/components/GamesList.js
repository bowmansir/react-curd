import React from 'react';
import PropTypes from 'prop-types'
import GameCard from './GameCard';

const GamesList = ({ games, deleteGame }) => {
    const emptyMessage = (
        <p>There are no gmaes</p>
    );

    const gamesList = (
        <div className="ui four cards">
            {games.map(game => <GameCard deleteGame={deleteGame} game={game} key={game._id} />)}
        </div>
    );

    return (
        <div>
            {games.lenth === 0 ? emptyMessage : gamesList}
        </div>
    )
};


GamesList.PropTypes = {
   game: PropTypes.array.isRequired,
   deleteGame: PropTypes.func.isRequired
}

export default GamesList;