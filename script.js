var tile_color_array = ["z", "s", "l", "j", "i", "t", "o", "b", "g"];
var tiles = [];
var block_masks = {
    "t": [
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
        [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
        [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
    ],
    "z": [
        [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    ],
    "l": [
        [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    ],
    "s": [
        [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    ],
    "j": [
        [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    ],
    "o": [
        [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
    ],
    "i": [
        [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
    ]
};
var ROWS = 20;
var COLUMNS = 10;
function setTileColor(tile, color) {
    tile.color = color;
    for (var _i = 0, tile_color_array_1 = tile_color_array; _i < tile_color_array_1.length; _i++) {
        var color_1 = tile_color_array_1[_i];
        tile.element.classList.remove("tile_" + color_1);
    }
    tile.element.classList.add("tile_" + color);
    return tile;
}
function createTile(color) {
    if (color === void 0) { color = "b"; }
    var tile = { element: document.createElement("div"), color: "b" };
    tile.element.classList.add("tile");
    tile.color = color;
    setTileColor(tile, color);
    tiles.push(tile);
    return tile;
}
function getTileAt(array, x, y) {
    return array[y * COLUMNS + x];
}
function getITileAt(x, y) {
    // console.log(x,y,y * COLUMNS + x, tiles[y * COLUMNS + x]);
    return tiles[y * COLUMNS + x];
}
function getSolidsFromRectangle(topLeft, size) {
    var solids = [];
    for (var row = 0; row < size.y; row++) {
        solids[row] = [];
        for (var col = 0; col < size.x; col++) {
            var itile = getITileAt(topLeft.x + col, topLeft.y + row);
            try {
                solids[row][col] = itile.color === "b" ? 0 : 1;
            }
            catch (error) {
                // console.log("errored")
                solids[row][col] = 1;
            }
        }
    }
    // console.table(solids);
    return solids;
}
function matrixContains(matrix, needle) {
    for (var i = 0; i < matrix.length; i++) {
        var row = matrix[i];
        for (var j = 0; j < row.length; j++) {
            var element = row[j];
            // console.log(element,i,j);
            if (element === needle) {
                return true;
            }
        }
    }
    return false;
}
function bitwiseMatrixComparison(a, b, action) {
    var result = [];
    if (action === "and") {
        for (var row = 0; row < a.length; row++) {
            result.push([]);
            for (var col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] && b[row][col];
            }
        }
    }
    else if (action === "or") {
        for (var row = 0; row < a.length; row++) {
            result.push([]);
            for (var col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] || b[row][col];
            }
        }
    }
    else if (action === "xor") {
        for (var row = 0; row < a.length; row++) {
            result.push([]);
            for (var col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] ^ b[row][col];
            }
        }
    }
    return result;
}
function formattedArray(array) {
    var formatted = "[";
    for (var i = 0; i < array.length; i++) {
        var e = array[i];
        if (e instanceof Array) {
            formatted += formattedArray(e);
        }
        else {
            formatted += e.toString();
            if (i !== array.length - 1) {
                formatted += ", ";
            }
        }
    }
    formatted += "]";
    return formatted;
}
function checkColision(block_color, block_rotation, tl) {
    var mask = block_masks[block_color][block_rotation];
    var solids = getSolidsFromRectangle(tl, { x: mask[0].length, y: mask.length });
    var result = bitwiseMatrixComparison(mask, solids, "and");
    var cont = matrixContains(result, 1);
    return cont;
}
function createBlock(block_color, topLeft, rot_state) {
    var topLeftIndex = topLeft.y * COLUMNS + topLeft.x;
    var changed = [];
    var r = 0;
    for (var _i = 0, _a = block_masks[block_color][rot_state]; _i < _a.length; _i++) {
        var row = _a[_i];
        // console.log(r);
        var c = 0;
        for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
            var col = row_1[_b];
            var cur = getITileAt(topLeft.x + c, topLeft.y + r);
            // console.log(topLeft.x + c, topLeft.y + r);
            // console.log(cur)
            if (col === 1) {
                var prev = cur.color;
                if (cur.color !== "b") {
                    for (var _c = 0, changed_1 = changed; _c < changed_1.length; _c++) {
                        var pair = changed_1[_c];
                        setTileColor(pair[0], pair[1]);
                    }
                    return false;
                }
                changed.push([cur, cur.color]);
                setTileColor(cur, block_color);
            }
            c += 1;
        }
        r += 1;
    }
    return true;
}
function deleteBlock(block_color, topLeft, rot_state) {
    var topLeftIndex = topLeft.y * COLUMNS + topLeft.x;
    var r = 0;
    for (var _i = 0, _a = block_masks[block_color][rot_state]; _i < _a.length; _i++) {
        var row = _a[_i];
        var c = 0;
        for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
            var col = row_2[_b];
            if (col === 1) {
                // console.log(topLeft.x + c, topLeft.y + r);
                var cur = getITileAt(topLeft.x + c, topLeft.y + r);
                setTileColor(cur, "b");
            }
            c += 1;
        }
        r += 1;
    }
}
function moveBlock(block_color, topLeft, rot_state, vector) {
    var new_pos = { x: topLeft.x + vector.x, y: topLeft.y + vector.y };
    if (new_pos.x < 0 || new_pos.x > COLUMNS - 3) {
        return false;
    }
    deleteBlock(block_color, topLeft, rot_state);
    var mask = block_masks[block_color][rot_state];
    // let solids = getSolidsFromRectangle(topLeft, {x: mask[0].length, y: mask.length});
    // console.table(solids);
    var success = !checkColision(block_color, rot_state, new_pos);
    // console.log(success, "EE");
    if (success) {
        // try {
        //     createBlock(block_color, new_pos, rot_state);
        // } catch (error) {
        // }
        createBlock(block_color, new_pos, rot_state);
        // console.log("success");
        return true;
    }
    else {
        createBlock(block_color, topLeft, rot_state);
        // deleteBlock(block_color, new_pos, rot_state);
        return false;
    }
}
function createTiles() {
    var grid = document.getElementsByClassName("grid")[0];
    for (var i = 0; i < ROWS * COLUMNS; i++) {
        grid.appendChild(createTile("b").element);
    }
}
var rot_state = 0;
var piece_spawned = false;
var cur_top_left = { x: 1, y: 0 };
var keys = {
    "left": false,
    "right": false,
    "up": false,
    "down": false
};
var SPAWN_POS = { x: 4, y: 0 };
var STANDARD_GRAVITY = 1 / 64;
var SOFT_DROP_FACTOR = 62220;
var GRAVITY = STANDARD_GRAVITY;
var gravity_complete = 0;
window.onload = function () {
    createTiles();
    var board_state;
    createBlock("o", { x: 1, y: 16 }, 0);
    setInterval(function () {
        if (!piece_spawned) {
            createBlock("t", SPAWN_POS, 0);
            cur_top_left = SPAWN_POS;
            piece_spawned = true;
        }
        try {
            if (keys.down) {
                GRAVITY = STANDARD_GRAVITY * SOFT_DROP_FACTOR;
            }
            else {
                GRAVITY = STANDARD_GRAVITY;
            }
            if (gravity_complete >= 1) {
                var move = Math.floor(gravity_complete);
                gravity_complete -= Math.floor(gravity_complete);
                if (moveBlock("t", cur_top_left, 0, { x: 0, y: move })) {
                    cur_top_left.y += move;
                    console.log(cur_top_left);
                }
            }
            else {
                gravity_complete += GRAVITY;
            }
            if (keys.right) {
                if (moveBlock("t", cur_top_left, 0, { x: 1, y: 0 })) {
                    cur_top_left.x += 1;
                }
            }
            else if (keys.left) {
                if (moveBlock("t", cur_top_left, 0, { x: -1, y: 0 })) {
                    cur_top_left.x -= 1;
                }
            }
        }
        catch (error) {
        }
        // console.log("y =", cur_top_left.y);
        // console.log(cur_top_left);
    }, 1000 / 60);
};
window.onkeydown = function (e) {
    console.log(e);
    if (e.keyCode == 39) {
        keys.right = true;
    }
    else if (e.keyCode == 37) {
        keys.left = true;
    }
    else if (e.keyCode == 40) {
        keys.down = true;
    }
};
window.onkeyup = function (e) {
    console.log(e);
    if (e.keyCode == 39) {
        keys.right = false;
    }
    else if (e.keyCode == 37) {
        keys.left = false;
    }
    else if (e.keyCode == 40) {
        keys.down = false;
    }
};
