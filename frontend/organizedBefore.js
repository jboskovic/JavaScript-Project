'use strict';


let src_part = "images/Friends/";
let src_picture = "images/Friends/Friends.jpg";
let puzzle;
let score;
let gameStarted = 0;
let Astar;
let interval = 0;
let timer_for_show = 0;
let gameShow = 0;
let tileMoved = 0;
let win = 0;

function startNewGame() {
    GameArea.start();
}

function onUserInsert() {
    let u = document.getElementById('username').value;
    let s = score.getScore();
    putScore(u, s).then((message) => {
        presentScores();
        let formElement = document.getElementsByClassName('formClass')[0];
        formElement.style.visibility = 'visible';
    });
}
function presentScores() {
    let element = document.getElementById('scoreList');
    getUsersScores().then((list) => {
        let text = '<label class="scoreRank">Rank</label><br>';
        for (let i = 0; i < list.length; i++) {
            let username = list[i].username;
            let score = list[i].score;
            let p = `<label class='scoreRank'>${username}  ${score}</label><br>`;
            text += p;
        }
        element.innerHTML = text;
    });
}
var GameArea = {
    start: function () {
        document.getElementById('username').value = ''
        puzzle = new Puzzle(src_part, src_picture);
        score = new Score();
        puzzle.draw_puzzle();
        tileMoved = 0;
        gameStarted = 1;
        interval = 0;
        timer_for_show = 0;
        gameShow = 0;
        win = 0;
        let formElement = document.getElementsByClassName('formClass')[0];
        formElement.style.visibility = 'hidden';
        presentScores();
    },
    restart: function () {
        if (gameStarted == 1) {
            gameStarted = 0;
            GameArea.start();
        }
    },

    image: function (id, src) {
        if (tileMoved == 1) {
            return;
        }
        puzzle.change_image(id, src);
    },

    tile: function (id) {
        if (gameShow == 1 || win == 1) {
            return;
        }
        tileMoved = 1;
        puzzle.tile_click(id);
        if (puzzle.check_game() == "WIN") {
            win = 1;
            let formElement = document.getElementsByClassName('formClass')[0];
            formElement.style.visibility = 'visible';
        }

    },
    show: function () {
        gameShow = 1;
        Astar = new astar(puzzle.getPuzzle());
        let moves = Astar.astarAlgorithm();
        if (moves == -1) {
            console.log("Nema resenja");
            return;
        }
        console.log(moves);

        this.interval_function = function () {
            if (interval < moves.length) {
                puzzle.setPuzzle(moves[interval]);
                interval++;
                puzzle.draw_puzzle();
                score.incrementScore();
                score.present("Moves: ");
            } else {
                interval = 0;
                window.clearInterval(timer_for_show);
                win = 1;
                gameShow = 0;
                console.log("finished");
            }
        };

        timer_for_show = window.setInterval(this.interval_function, 1000);
    },

}



class Puzzle {
    constructor(src_part, src_picture) {
        this.src_picture = src_picture;
        this.src_part = src_part;
        this.puzzle = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 0]);
        this.win_puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    }

    getPuzzle() {
        return this.puzzle;
    }
    setPuzzle(newPuzzle) {
        this.puzzle = newPuzzle;
    }


    shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        let tmp = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        let k = 0;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                tmp[i][j] = array[k++];

        return [[1, 2, 3], [4, 5, 6], [7, 0, 8]];
    }



    draw_puzzle() {
        let grid = "";

        grid += "<div class='grid-container'>\n";
        grid += "<div class='grid'>\n";


        for (let i = 0; i < 3; i++) {
            grid += "<div class='row'>\n";
            for (let j = 0; j < 3; j++) {
                grid += "<div class='cell' onclick='GameArea.tile(this.id)' data-pos='" + i + "," + j + "' " + "id='" + i + j + "'" + "> <img src='" + this.src_part + "part" + this.puzzle[i][j] + ".jpg' alt=''>" + "</div>\n";
            }
            grid += "</div>\n";
        }

        grid += "</div>\n";
        grid += "</div>\n";

        grid += "</div>\n";
        grid += "</div>\n";

        /*
        grid += "<div id='image_help'>\n";
        grid += "<img src='" + this.src_picture + "'>";
        grid += "</div>"*/
        document.getElementById('imageSide').style.src = this.src_picture;

        let elem = document.getElementById('game_window');
        if (typeof elem != 'undefined' && elem != null) {
            elem.innerHTML = grid;
        }
    }
    check_neighbors(x, y) {
        let x_0 = -1;
        let y_0 = -1;

        if (x != 0 && this.puzzle[x - 1][y] == 0) {
            x_0 = x - 1;
            y_0 = y;
        }
        else if (x != 2 && this.puzzle[x + 1][y] == 0) {
            x_0 = x + 1;
            y_0 = y;
        }
        else if (y != 0 && this.puzzle[x][y - 1] == 0) {
            x_0 = x;
            y_0 = y - 1;
        }
        else if (y != 2 && this.puzzle[x][y + 1] == 0) {
            x_0 = x;
            y_0 = y + 1;
        }

        return [x_0, y_0];
    }
    check_game() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.puzzle[i][j] != this.win_puzzle[i][j]) {
                    return "NOWIN";
                }
            }
        }

        return "WIN";

    }
    tile_click(id) {
        let i = id[0];
        let j = id[1];

        i = Number(i);
        j = Number(j);
        if (i < 0 || i > 2 || j < 0 || j > 2) {
            console.log("greska");
            return;
        }

        let zero_coordinates = this.check_neighbors(i, j);
        let x_0 = zero_coordinates[0]
        let y_0 = zero_coordinates[1];

        if (this.puzzle[i][j] == 0) {
            return;
        }

        if (x_0 == -1 || y_0 == -1) {
            return;
        }


        this.puzzle[x_0][y_0] = this.puzzle[i][j];
        this.puzzle[i][j] = 0;
        score.incrementScore();
        score.present("Moves: ");
        this.draw_puzzle();

    }
    change_image(id, src) {
        this.src_picture = src;
        if (id == "Friends") {
            this.src_part = "images/Friends/";
            this.draw_puzzle();
        } else if (id == "TheSimpsons") {
            this.src_part = "images/TheSimpsons/";
            this.draw_puzzle();
        } else if (id == "TheLionKing") {
            this.src_part = "images/TheLionKing/";
            this.draw_puzzle();
        } else if (id == "LiloAndStitch") {
            this.src_part = "images/LiloAndStitch/";
            this.draw_puzzle();
        }
    }

}

class Score {
    constructor() {
        this.score = 0;
        this.pScore = document.getElementById("scoreText");
        this.present("Moves: ");

    }
    incrementScore() {
        this.score += 1;
    }

    present(write) {
        this.pScore.innerHTML = write + this.score;
    }
    getScore() {
        return this.score;
    }
}

function astar(puzzle) {
    this.puzzle = puzzle;
    this.win_puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    //this.moves_to_solve = [];

    //this.get_moves_to_solve = function () { return this.moves_to_solve; }

    this.serialize = function (state) {
        let serialized = []
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                serialized.push(String(state[i][j]))
            }
        }

        return serialized.join(':');
    }
    this.deserialize = function (serialized) {
        let serialized_list = serialized.split(":");

        let deserialized = [[Number(serialized_list[0]), Number(serialized_list[1]), Number(serialized_list[2])], [Number(serialized_list[3]), Number(serialized_list[4]), Number(serialized_list[5])], [Number(serialized_list[6]), Number(serialized_list[7]), Number(serialized_list[8])]];

        return deserialized;
    }

    this.copy_matrix = function (old_matrix) {
        let new_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                new_matrix[i][j] = old_matrix[i][j];
            }
        }

        return new_matrix;
    }

    this.h = function (state) {
        let deserialized = this.deserialize(state);

        let H = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (deserialized[i][j] == 0) {
                    H += 2 - i + 2 - j;
                }
                else if (deserialized[i][j] % 3 == 0) {
                    H += 2 - j + Math.abs(deserialized[i][j] / 3 - 1 - i);
                }
                else {
                    H += Math.abs(deserialized[i][j] / 3 - i) + Math.abs(deserialized[i][j] % 3 - j - 1);
                }
            }
        }

        return H;
    }

    this.get_neighbors = function (state) {
        let deserialized = this.deserialize(state);

        let neighbors = [];

        let blank_i = -1;
        let blank_j = -1;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (deserialized[i][j] == 0) {
                    blank_i = i;
                    blank_j = j;
                }
            }
        }

        let i_0 = blank_i;
        let j_0 = blank_j;


        if (i_0 > 0) {
            let new_matrix = this.copy_matrix(deserialized);
            new_matrix[i_0][j_0] = new_matrix[i_0 - 1][j_0];
            new_matrix[i_0 - 1][j_0] = 0;
            neighbors.push(this.serialize(new_matrix));
        }

        if (i_0 < 2) {
            let new_matrix = this.copy_matrix(deserialized);
            new_matrix[i_0][j_0] = new_matrix[i_0 + 1][j_0];
            new_matrix[i_0 + 1][j_0] = 0;
            neighbors.push(this.serialize(new_matrix));
        }

        if (j_0 > 0) {
            let new_matrix = this.copy_matrix(deserialized);
            new_matrix[i_0][j_0] = new_matrix[i_0][j_0 - 1];
            new_matrix[i_0][j_0 - 1] = 0;
            neighbors.push(this.serialize(new_matrix));
        }

        if (j_0 < 2) {
            let new_matrix = this.copy_matrix(deserialized);
            new_matrix[i_0][j_0] = new_matrix[i_0][j_0 + 1];
            new_matrix[i_0][j_0 + 1] = 0;
            neighbors.push(this.serialize(new_matrix));
        }


        return neighbors;

    }

    this.astarAlgorithm = function () {
        let start_state = this.serialize(this.puzzle);
        let end_state = this.serialize(this.win_puzzle);


        let open_list = new Set([]);
        open_list.add(start_state);
        let closed_list = new Set([]);

        let D = {};
        D[start_state] = 0;

        let parent = {};

        parent[start_state] = -1;

        while (open_list.size > 0) {
            let n = -1;
            let min_d = Infinity;
            for (let v of open_list) {
                if (D[v] + this.h(v) < min_d) {
                    n = v;
                    min_d = D[v] + this.h(v);
                }
            }


            if (n == -1) {
                return -1;
            }

            if (n == end_state) {
                let path = [];

                while (n != -1) {
                    path.push(n);
                    n = parent[n];
                }

                path.reverse();

                let paths = [];

                for (let i = 0; i < path.length; i++) {
                    let tmp = this.deserialize(path[i]);
                    paths.push(tmp);
                }
                /* path.forEach(function (element) {
                     let tmp = this.deserialize(element);
                     console.log(tmp);
                     paths.push(tmp);
                 });*/

                return paths;

            }

            let neigh = this.get_neighbors(n);
            for (let i = 0; i < neigh.length; i++) {
                let m = neigh[i];
                let weight = 1
                if (!open_list.has(m) && !closed_list.has(m)) {
                    open_list.add(m);
                    parent[m] = n;
                    D[m] = D[n] + weight;
                }
                else {
                    if (D[m] > D[n] + weight) {
                        D[m] = D[n] + weight;
                        parent[m] = n;

                        if (closed_list.has(m)) {
                            open_list.add(m);
                            closed_list.delete(m);
                        }
                    }
                }
            }

            closed_list.add(n);
            open_list.delete(n);

        }

        return -1;

    }

}


// -------------------- communication with server ---------------
async function putScore(username, score) {
    try {
        const url = "http://localhost:3000/users/";
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                username: username,
                score: score
            })
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
    } catch (err) {
        console.log(err);
    }
}
async function getUsersScores() {
    try {
        const url = "http://localhost:3000/users/";
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (err) {
        console.log(err);
    }
}

