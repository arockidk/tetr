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
    return tiles[y * COLUMNS + x];
}
function getSolidsFromRectangle(topLeft, size) {
    var solids = [];
    for (var row = 0; row < size.y; row++) {
        solids[row] = [];
        for (var col = 0; col < size.x; col++) {
            solids[row][col] = getITileAt(topLeft.x + col, topLeft.y + row).color === "b" ? 0 : 1;
        }
    }
    return solids;
}
function bitwiseMatrixComparison(a, b, action) {
    var result = [];
    if (action === "and") {
        for (var row = 0; row < a.length; row++) {
            result[row] = [];
            for (var col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] && b[col][row];
            }
        }
    }
    else if (action === "or") {
        for (var row = 0; row < a.length; row++) {
            result[row] = [];
            for (var col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] || b[col][row];
            }
        }
    }
    else if (action === "xor") {
        for (var row = 0; row < a.length; row++) {
            result[row] = [];
            for (var col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] ^ b[col][row];
            }
        }
    }
    return result;
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
            var prev = cur.color;
            if (col === 1) {
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
    deleteBlock(block_color, topLeft, rot_state);
    var success;
    try {
        var temp = createBlock(block_color, new_pos, rot_state);
        success = temp;
    }
    catch (_a) {
        success = false;
    }
    console.log(success);
    if (success) {
        createBlock(block_color, new_pos, rot_state);
    }
    else {
        createBlock(block_color, topLeft, rot_state);
        // deleteBlock(block_color, new_pos, rot_state);
        console.error("EEE", topLeft);
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
var SPAWN_POS = { x: 1, y: 0 };
window.onload = function () {
    createTiles();
    var board_state;
    createBlock("i", { x: 1, y: 16 }, 0);
    setInterval(function () {
        if (!piece_spawned) {
            createBlock("t", SPAWN_POS, 0);
            cur_top_left = SPAWN_POS;
            piece_spawned = true;
        }
        try {
            moveBlock("t", cur_top_left, 0, { x: 0, y: 1 });
            cur_top_left.y += 1;
        }
        catch (error) {
        }
        // console.log("y =", cur_top_left.y);
    }, 1000 / 60);
};
