var puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
var helper = [1, 2, 3, 4, 5, 6, 7, 8, 0];



var win_puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
function initialize_game() {
    shuffle(helper);
    var k = 0;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            puzzle[i][j] = helper[k];
            k++;
        }
    }

    draw_puzzle();

}
function show_moves() {
    astar();
}

function draw_puzzle() {
    var grid = "";

    grid += "<div class='grid-container'>\n";
    grid += "<div class='grid'>\n";


    for (let i = 0; i < 3; i++) {
        grid += "<div class='row'>\n";
        for (let j = 0; j < 3; j++) {
            grid += "<div class='cell' onclick='tile_click(this.id)' data-pos='" + i + "," + j + "' " + "id='" + i + j + "'" + "> <img src='images/part" + puzzle[i][j] + ".jpg' alt=''>" + "</div>\n";
        }
        grid += "</div>\n";
    }


    grid += "</div>\n";
    grid += "</div>\n";

    grid += "</div>\n";
    grid += "</div>\n";



    grid += "<div class='grid-container'>\n";
    grid += "<div class='grid'>\n";


    for (let i = 0; i < 3; i++) {
        grid += "<div class='row'>\n";
        for (let j = 0; j < 3; j++) {
            grid += "<div class='cell' data-pos='" + i + "," + j + "' " + "id='" + i + j + "'" + "> <img src='images/part" + win_puzzle[i][j] + ".jpg' alt = ''>" + "</div>\n";

        }
        grid += "</div>\n";
    }


    grid += "</div>\n";
    grid += "</div>\n";

    document.getElementById('game_window').innerHTML = grid;
}

function shuffle(array) {
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

    return array;
}

function restart_game() {
    document.getElementById('game_window').innerHTML = ""
    initialize_game();
}

function tile_click(id) {
    var i = id[0];
    var j = id[1];

    var zero_coordinates = check_neighbors(i, j);
    var x_0 = zero_coordinates[0] - '0';
    var y_0 = zero_coordinates[2] - '0';

    if (x_0 != -1 && y_0 != -1) {
        i = i - '0';
        j = j - '0';
        puzzle[x_0][y_0] = puzzle[i][j];
        puzzle[i][j] = '0';
        draw_puzzle();
        check_game();
    }

}
function check_game() {
    var win = true;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (puzzle[i][j] != win_puzzle[i][j]) {
                win = false;
                break;
            }
        }
    }

    if (win == true) {
        console.log("you have won");
    }
}
function check_neighbors(x, y) {
    var x_0 = -1;
    var y_0 = -1;

    x = x - '0';
    y = y - '0';

    if (x != 0 && puzzle[x - 1][y] == 0) {
        x_0 = x - 1;
        y_0 = y;
    }
    else if (x != 2 && puzzle[x + 1][y] == 0) {
        x_0 = x + 1;
        y_0 = y;
    }
    else if (y != 0 && puzzle[x][y - 1] == 0) {
        x_0 = x;
        y_0 = y - 1;
    }
    else if (y != 2 && puzzle[x][y + 1] == 0) {
        x_0 = x;
        y_0 = y + 1;
    }

    return (x_0 + " " + y_0);

}

function copy_matrix(old_matrix) {
    var new_matrix = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            new_matrix[i][j] = old_matrix[i][j];
        }
    }

    return new_matrix;
}
function serialize(state) {
    var serialized = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            serialized.push(String(state[i][j]))
        }
    }

    return serialized.join(':');
}

function deserialize(serialized) {
    var serialized_list = serialized.split(":");

    var deserialized = [[serialized_list[0] - '0', serialized_list[1] - '0', serialized_list[2] - '0'], [serialized_list[3] - '0', serialized_list[4] - '0', serialized_list[5] - '0'], [serialized_list[6] - '0', serialized_list[7] - '0', serialized_list[8] - '0']];

    return deserialized;
}


function get_neighbors(state) {
    var deserialized = deserialize(state);

    neighbors = [];

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

    i_0 = blank_i;
    j_0 = blank_j;


    if (i_0 > 0) {
        let new_matrix = copy_matrix(deserialized);
        new_matrix[i_0][j_0] = new_matrix[i_0 - 1][j_0];
        new_matrix[i_0 - 1][j_0] = 0;
        neighbors.push(serialize(new_matrix));
    }

    if (i_0 < 2) {
        let new_matrix = copy_matrix(deserialized);
        new_matrix[i_0][j_0] = new_matrix[i_0 + 1][j_0];
        new_matrix[i_0 + 1][j_0] = 0;
        neighbors.push(serialize(new_matrix));
    }

    if (j_0 > 0) {
        let new_matrix = copy_matrix(deserialized);
        new_matrix[i_0][j_0] = new_matrix[i_0][j_0 - 1];
        new_matrix[i_0][j_0 - 1] = 0;
        neighbors.push(serialize(new_matrix));
    }

    if (j_0 < 2) {
        let new_matrix = copy_matrix(deserialized);
        new_matrix[i_0][j_0] = new_matrix[i_0][j_0 + 1];
        new_matrix[i_0][j_0 + 1] = 0;
        neighbors.push(serialize(new_matrix));
    }


    return neighbors;

}

function h(state) {

    var deserialized = deserialize(state);

    H = 0;

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
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


function astar() {
    var start_state = serialize(puzzle);
    var end_state = serialize(win_puzzle);


    var open_list = new Set();
    open_list.add(start_state);
    var closed_list = new Set([]);

    var D = {};
    D[start_state] = 0;

    var parent = {};

    parent[start_state] = -1;

    while (open_list.size > 0) {
        var n = -1;
        var min_d = Infinity;
        for (let v of open_list) {
            if (D[v] + h(v) < min_d) {
                n = v;
                min_d = D[v] + h(v);
            }
        }


        if (n == -1) {
            return -1;
        }

        if (n == end_state) {
            var path = [];

            while (n != -1) {
                path.push(n);
                n = parent[n];
            }

            path.reverse();
            var paths = [];
            path.forEach(function (element) {
                paths.push(deserialize(element));
            });

            console.log(paths);
            return 1;

        }

        var neigh = get_neighbors(n);
        for (let i = 0; i < neigh.length; i++) {
            var m = neigh[i];
            var weight = 1
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