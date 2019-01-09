import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATED, GAME_DELETED } from '../constants';

export const setGames = (games) => {
    return {
        type: SET_GAMES,
        games
    }
};

export const fetchGames = () => {
    return dispatch => {
        fetch('/api/games')
            .then(res => res.json())
            .then(data => dispatch(setGames(data.games)))
    }
};



const handleResponse = (response) => {
    if(response.ok) {
        return response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response
        throw error;
    }
}

export const saveGame = (data) => {
    return dispatch => {
       return fetch('/api/games', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
         .then(data=>dispatch(addGame(data.game)));
    }
}

export const addGame = (game) => {
    return {
        type: ADD_GAME,
        game
    }
} 

export const fetchGame = (id) => {
    return dispatch => {
        return fetch(`/api/games/${id}`)
        .then(res=>res.json())
        .then(data=>dispatch(gameFetched(data.game)))
    }
}

export const gameFetched = (game) => {
    return {
        type: GAME_FETCHED,
        game
    }
}


export const updateGame = (data) => {
    return dispatch => {
       return fetch(`/api/games/${data._id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
         .then(data=>dispatch(gameUpdate(data.game)));
    }
}

export const gameUpdate = (game) => {
   return {
       type: GAME_UPDATED,
       game
   }
}

export const deleteGame = (id) => {
    return dispatch => {
       return fetch(`/api/games/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(handleResponse)
         .then(data=>dispatch(gameDelete(id)));
    }
}


export const gameDelete = (id) => {
    return {
        type: GAME_DELETED,
        id,
    }
}
