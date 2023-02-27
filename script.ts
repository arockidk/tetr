type tile_color = "z" | "s" | "l" | "j" | "i" | "t" | "o" | "b" | "g";
type rotation_state = 0 | 1 | 2 | 3;
let tile_color_array: string[] = ["z", "s", "l", "j", "i", "t", "o", "b", "g"];

interface ITile {
    color: tile_color;
    element: HTMLDivElement
}

let tiles: ITile[] = [];
const block_masks = {
    "t": [
        [[0,1,0],[1,1,1],[0, 0, 0]],
        [[0,1,0],[0,1,1],[0, 1, 0]],
        [[0,0,0],[1,1,1],[0, 1, 0]],
        [[0,1,0],[1,1,0],[0, 1, 0]]

    ],
    "z": [
        [[1,1,0],[0,1,1],[0, 0, 0]],


    ],
    "l": [
        [[0,0,1],[1,1,1],[0, 0, 0]],


    ],
    "s": [
        [[0,1,1],[1,1,0],[0, 0, 0]],


    ],
    "j": [
        [[1,0,0],[1,1,1],[0, 0, 0]],


    ],
    "o": [
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]]
    ],
    "i": [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
    ]
    
}
const ROWS = 20;
const COLUMNS = 10;
function setTileColor(tile: ITile, color: tile_color): ITile {
    tile.color = color;
    for (let color of tile_color_array) {
        tile.element.classList.remove("tile_" + color);

    }
    
    tile.element.classList.add("tile_" + color);
    return tile;
}
function createTile(color:tile_color = "b"): ITile {
    let tile:ITile = {element: document.createElement("div"), color: "b"};
    tile.element.classList.add("tile");
    tile.color = color;
    setTileColor(tile,color);
    tiles.push(tile);
    
    
    return tile;
}

function getTileAt(array: HTMLDivElement[],x: number, y: number): HTMLDivElement {
    return array[y * COLUMNS + x];
}

function getITileAt(x: number, y: number): ITile {
    return tiles[y * COLUMNS + x];
}
function getSolidsFromRectangle(topLeft: {x: number, y: number}, size: {x: number, y: number}): number[][] {
    let solids: number[][] = [];
    for (let row = 0; row < size.y; row++) {
        solids[row] = [];
        for (let col = 0; col < size.x; col++) {
            solids[row][col] = getITileAt(topLeft.x + col, topLeft.y + row).color === "b" ? 0 : 1;
        }
    }
    return solids;
    
}
function bitwiseMatrixComparison(a: number[][], b: number[][], action: "and" | "or" | "xor"): number[][] { 
    let result: number[][] = [];
    if (action === "and") {
        for (let row = 0; row < a.length; row++) {
            result[row] = [];
            for (let col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] && b[col][row];
            }
        }
    } else if (action === "or") {
        
        for (let row = 0; row < a.length; row++) {
            result[row] = [];
            for (let col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] || b[col][row];
            }
        }
    } else if (action === "xor") {
        for (let row = 0; row < a.length; row++) {
            result[row] = [];
            for (let col = 0; col < b.length; col++) {
                result[row][col] = a[row][col] ^ b[col][row];
            }
        }
    }
    return result;
}

function createBlock(block_color: tile_color, topLeft: {x: number,y:number}, rot_state: rotation_state):boolean {
    let topLeftIndex = topLeft.y * COLUMNS + topLeft.x;
    let changed: [ITile,tile_color][] = [];
    let r = 0;
    for (let row of block_masks[block_color][rot_state]) {
        // console.log(r);
        let c = 0;
        for (let col of row) {
            
                let cur: ITile = getITileAt(topLeft.x + c, topLeft.y + r);
                // console.log(topLeft.x + c, topLeft.y + r);
                // console.log(cur)
                let prev = cur.color;
                
                if (col === 1) {
                    if (cur.color !== "b") {
                        for (let pair of changed) {
                            setTileColor(pair[0], pair[1]);
                        }
                        return false;
                        
                    }
                    changed.push([cur,cur.color]);

                    setTileColor(cur, block_color);
                    
                    
                    
                }
            c += 1
        }
        r += 1;
        

    }
    return true;
    

}
function deleteBlock(block_color: tile_color, topLeft: {x: number,y:number}, rot_state: rotation_state) {
    let topLeftIndex = topLeft.y * COLUMNS + topLeft.x;
    
    let r = 0;
    for (let row of block_masks[block_color][rot_state]) {
        let c = 0;
        for (let col of row) {
            if (col === 1) {
                // console.log(topLeft.x + c, topLeft.y + r);

                let cur: ITile = getITileAt(topLeft.x + c, topLeft.y + r);
                setTileColor(cur, "b");
            }
            c += 1
        }
        r += 1;
        
    }

}
function moveBlock(block_color: tile_color, topLeft: {x: number,y: number}, rot_state: rotation_state, vector: {x: number, y: number}) {
    let new_pos = {x: topLeft.x + vector.x, y: topLeft.y + vector.y};
    deleteBlock(block_color, topLeft, rot_state);
    let success: boolean;
    try { 
        let temp = createBlock(
        block_color, 
        new_pos, 
         
        rot_state);
        success = temp;
    } catch {
        success = false 
    }
    console.log(success);

    if (success) {
        
        createBlock(block_color, new_pos, rot_state);
        
        
    } else {
        createBlock(block_color, topLeft, rot_state);
        // deleteBlock(block_color, new_pos, rot_state);
        console.error("EEE", topLeft)
    }


}
function createTiles() {
    let grid = document.getElementsByClassName("grid")[0];
    
    for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.appendChild(createTile("b").element);
    }
}
let rot_state: rotation_state = 0;
let piece_spawned: boolean = false;
let cur_top_left: {x: number, y: number} = {x: 1, y: 0}
const SPAWN_POS = {x: 1, y: 0};

window.onload = function() {
    createTiles();
    let board_state;
    createBlock("i",{x:1, y:16}, 0)
    setInterval(function() {
        if (!piece_spawned) {
            
            createBlock("t",SPAWN_POS,0); 
            cur_top_left = SPAWN_POS;
            piece_spawned = true;
        }
        try {
            moveBlock("t", cur_top_left, 0, {x:0,y:1});
            cur_top_left.y += 1;
        } catch (error) {
        }

        
        // console.log("y =", cur_top_left.y);
    },1000/60)
}
