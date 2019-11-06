var puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
var helper = [1, 2, 3, 4, 5, 6, 7, 8, 0];

var win_puzzle = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
function initialize_game() {
    shuffle(helper);
    var k = 0;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            puzzle[i][j] = helper[k];
            k++;
        }
    }

    draw_puzzle();
}

function draw_puzzle() {
    var grid = "";

    grid += "<div class='grid-container'>\n";
    grid += "<div class='grid start'>\n";


    for (i = 0; i < 3; i++) {
        grid += "<div class='row'>\n";
        for (j = 0; j < 3; j++) {
            grid += "<div class='cell' onclick='tile_click(this.id)' data-pos='" + i + "," + j + "' " + "id='" + i + j + "'" + "> <img src='images/part" + puzzle[i][j] + ".jpg' alt=''>" + "</div>\n";
        }
        grid += "</div>\n";
    }


    grid += "</div>\n";
    grid += "</div>\n";

    grid += "</div>\n";
    grid += "</div>\n";



    grid += "<div class='grid-container'>\n";
    grid += "<div class='grid start'>\n";


    for (i = 0; i < 3; i++) {
        grid += "<div class='row'>\n";
        for (j = 0; j < 3; j++) {
            grid += "<div class='cell' onclick='tile_click(this.id)' data-pos='" + i + "," + j + "' " + "id='" + i + j + "'" + "> <img src='images/part" + win_puzzle[i][j] + ".jpg' alt = ''>" + "</div>\n";

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

    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
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

    console.log(x_0 + " " + y_0);
    return (x_0 + " " + y_0);

}
