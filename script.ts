type tile_color = "z" | "s" | "l" | "j" | "i" | "t" | "o" | "b" | "g";
type block_color = "z" | "s" | "l" | "j" | "i" | "t" | "o";
type rotation_state = 0 | 1 | 2 | 3;
type int = number;
let tile_color_array: string[] = ["z", "s", "l", "j", "i", "t", "o", "b", "g"];

interface ITile {
    color: tile_color;
    element: HTMLDivElement
} 

let tiles: ITile[] = [];
let colors = ["t", "o", "z", "s", "i", "j", "l"]
const block_masks: {[K in block_color]: int[][][]} = {
    "t": [
        [[0,1,0],[1,1,1],[0, 0, 0]],
        [[0,1,0],[0,1,1],[0, 1, 0]],
        [[0,0,0],[1,1,1],[0, 1, 0]],
        [[0,1,0],[1,1,0],[0, 1, 0]]

    ],
    "z": [
        [[1,1,0],[0,1,1],[0, 0, 0]],
        [[0,0,1],[0,1,1],[0, 1, 0]],
        [[0, 0, 0],[1,1,0],[0,1,1]],
        [[0,1,0],[1,1,0],[1, 0, 0]],
        
    ],
    "l": [
        [[0,0,1],[1,1,1],[0, 0, 0]],
        [[0,1,0],[0,1,0],[0, 1, 1]],
        [[0,0,0],[1,1,1],[1, 0, 0]],
        [[1,1,0],[0,1,0],[0, 1, 0]],
    ],
    "s": [
        [[0,1,1],[1,1,0],[0, 0, 0]],
        [[1,0,0],[1,1,0],[0, 1, 0]],
        [[0, 0, 0],[0,1,1],[1,1,0]],
        [[0,1,0],[0,1,1],[0, 0, 1]],
    ],
    "j": [
        [[1,0,0],[1,1,1],[0, 0, 0]],
        [[0,1,1],[0,1,0],[0, 1, 0]],
        [[0,0,0],[1,1,1],[0, 0, 1]],
        [[0,1,0],[0,1,0],[1, 1, 0]],
    ],
    "o": [
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
        [[0,1,1,0],[0,1,1,0],[0,0,0,0]],
    ],
    "i": [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    ]
    
}
const ROWS = 20;
const COLUMNS = 10;
const random = (min: int, max: int):int => Math.random() * (max - min) + min;
function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex: int;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
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
    // console.log(x,y,y * COLUMNS + x, tiles[y * COLUMNS + x]);
    return tiles[y * COLUMNS + x];
}
function getSolidsFromRectangle(topLeft: {x: number, y: number}, size: {x: number, y: number}): number[][] {
    let solids: number[][] = [];
    for (let row = 0; row < size.y; row++) {
        solids[row] = [];
        for (let col = 0; col < size.x; col++) {
            if (topLeft.x + col > COLUMNS - 1 || topLeft.x + col < 0) {
                solids[row][col] = 1;
                continue;
            }
            let itile: ITile = getITileAt(topLeft.x + col, topLeft.y + row);
            try {
                solids[row][col] = itile.color === "b" ? 0 : 1;
            } catch (error) {
                // console.log("errored")
                solids[row][col] = 1;
            }
            
            
        }
    }
    // console.table(solids);
    return solids;
    
}
function matrixContains<T>(matrix:T[][], needle: T): boolean {
    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i];
        for (let j = 0; j < row.length; j++) {
            let element = row[j];
            // console.log(element,i,j);
            if (element === needle) {
                return true;
            }

        }
    }
    return false;
}

function bitwiseMatrixComparison(a: number[][], b: number[][], action: "and" | "or" | "xor"): number[][] { 
    let result: number[][] = [];
    if (action === "and") {
        for (let row = 0; row < a.length; row++) {
            result.push([]);
            for (let col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] && b[row][col];
            }
        }
    } else if (action === "or") {
        
        for (let row = 0; row < a.length; row++) {
            result.push([]);
            for (let col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] || b[row][col];
            }
        }
    } else if (action === "xor") {
        for (let row = 0; row < a.length; row++) {
            result.push([]);
            for (let col = 0; col < a[row].length; col++) {
                result[row][col] = a[row][col] ^ b[row][col];
                
            }
        }
    }
    return result;
}
function formattedArray(array: any[]): string {
    let formatted = "["
    
    for (let i = 0; i < array.length; i++) {
        let e = array[i];
        if (e instanceof Array) {
            formatted += formattedArray(e);
        } else {
            formatted += e.toString();
            if (i !== array.length - 1) {
                formatted += ", ";
            }
        }
    }
    formatted += "]"
    return formatted;
}
function checkColision(block_color: block_color, block_rotation: rotation_state,tl: {x: number, y: number}):boolean {
    let mask = block_masks[block_color][block_rotation];
    let solids = getSolidsFromRectangle(tl, {x: mask[0].length, y: mask.length});
    
    let result = bitwiseMatrixComparison(mask,solids,"and") 
    let cont = matrixContains<int>(result, 1);
    
    return cont;

}
function createBlock(block_color: block_color, topLeft: {x: number,y:number}, rot_state: rotation_state):boolean {
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
                
                if (col === 1) {
                    let prev = cur.color;
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
function deleteBlock(block_color: block_color, topLeft: {x: number,y:number}, rot_state: rotation_state) {
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
function rotateBlock(block_color: block_color, topLeft: {x: number,y: number}, old: rotation_state, New: rotation_state):boolean  {

    deleteBlock(block_color, topLeft, old);
    let mask = block_masks[block_color][New];
    // let solids = getSolidsFromRectangle(topLeft, {x: mask[0].length, y: mask.length});
    // console.table(solids);
    let success: boolean = !checkColision(block_color, New, topLeft);
    // console.log(success, "EE");

    if (success) {
        // try {
        //     createBlock(block_color, new_pos, rot_state);
        // } catch (error) {
            
        // }
        createBlock(block_color, topLeft, New);
        // console.log("success");
        return true;
        
        
    } else {
        createBlock(block_color, topLeft, old);
        // deleteBlock(block_color, new_pos, rot_state);
        return false;

    }


}
function moveBlock(block_color: block_color, topLeft: {x: number,y: number}, rot_state: rotation_state, vector: {x: number, y: number}):boolean  {
    let new_pos = {x: topLeft.x + vector.x, y: topLeft.y + vector.y};
    
    deleteBlock(block_color, topLeft, rot_state);
    let mask = block_masks[block_color][rot_state];
    // let solids = getSolidsFromRectangle(topLeft, {x: mask[0].length, y: mask.length});
    // console.table(solids);
    let success: boolean = !checkColision(block_color, rot_state, new_pos);
    // console.log(success, "EE");

    if (success) {
        // try {
        //     createBlock(block_color, new_pos, rot_state);
        // } catch (error) {
            
        // }
        createBlock(block_color, new_pos, rot_state);
        // console.log("success");
        return true;
        
        
    } else {
        createBlock(block_color, topLeft, rot_state);
        // deleteBlock(block_color, new_pos, rot_state);
        return false;

    }


}
function rotateCW(old: rotation_state): rotation_state {
    return (old >= 3 ? 0 : old + 1) as rotation_state;
}
function rotateCCW(old: rotation_state): rotation_state {
    return (old <= 0 ? 3 : old - 1) as rotation_state;
}
function createTiles() {
    let grid = document.getElementsByClassName("grid")[0];
    
    for (let i = 0; i < ROWS * COLUMNS; i++) {
        grid.appendChild(createTile("b").element);
    }
}
function generateRandomColor(): block_color {
    let ra = Math.floor(random(0,7));
    let color = colors[ra] as block_color;
    console.log(color);
    return color;
} 
const generate7Bag = (): block_color[] => shuffle(colors.map((v)=>v)) as block_color[];
let rot_state: rotation_state = 0;
let piece_spawned: boolean = false;
let cur_top_left: {x: number, y: number} = {x: 1, y: 0}
let keys = {
    "left": false,
    "right": false,
    "cw": false,
    "ccw": false,
    "sd": false,
    "hd": false,
}
const SPAWN_POS = {x: 4, y: 0};
const STANDARD_GRAVITY = 1/64;
let DAS = 10;
let SOFT_DROP_FACTOR = 20;
let GROUNDED_TIME = 30;
let GRAVITY = STANDARD_GRAVITY;
let placed = 0;
let gravity_complete = 0;
let grounded = 0;
let das_timer = 0;
let debounce = {
    "CW": false,
    "CCW": false,
    "HD": false
};
let cur_color: block_color;
let next = [...generate7Bag(),...generate7Bag()];
window.onload = function() {
        createTiles();
        let board_state;
        // createBlock("o", {x:1, y:16}, 0)
        setInterval(function() {
            if (!piece_spawned) {
                rot_state = 0;
                // console.log("Spawning")
                cur_color = next.shift();
                createBlock(cur_color,{x: 4, y: 0}, rot_state); 
                cur_top_left = {x: 4, y: 0};
                // console.log(cur_top_left,SPAWN_POS);
                piece_spawned = true;
                placed++;

                if (placed % 7 === 0) {
                    next.push(...generate7Bag());
                }
                console.log(next)
            }

            try {
                
                if (keys.sd) {
                    GRAVITY = STANDARD_GRAVITY * SOFT_DROP_FACTOR;
                } else {
                    GRAVITY = STANDARD_GRAVITY;
                }
                if (gravity_complete >= 1) {
                    let move = Math.floor(gravity_complete);
                    gravity_complete -= Math.floor(gravity_complete);
                    for (let i = 0; i < move; i++) {
                        if (moveBlock(cur_color, cur_top_left, rot_state, {x:0,y:1})) {
                            cur_top_left.y += 1;
                            console.log(cur_top_left)
                        }
                    }   
                } else {
                    gravity_complete += GRAVITY;
                }
                

                if (keys.right) {
                    if (das_timer === 0 || das_timer > DAS) {
                        if (moveBlock(cur_color, cur_top_left, rot_state, {x:1,y:0})) {
                            cur_top_left.x += 1;
                        }
                        
                    } 
                    das_timer += 1;
                } else if (keys.left) {
                    if (das_timer === 0 || das_timer > 9) {
                        if (moveBlock(cur_color, cur_top_left, rot_state, {x:-1,y:0})) {
                            cur_top_left.x -= 1;
                        }
                        
                    } 
                    das_timer += 1;
                } else if (keys.cw && !debounce.CW) {
                    if (rotateBlock(cur_color, cur_top_left, rot_state, rotateCW(rot_state))) {
                        rot_state = rotateCW(rot_state);
                        debounce.CW = true;
                    }
                } 
                else if (keys.ccw && !debounce.CCW) {
                    if (rotateBlock(cur_color, cur_top_left, rot_state, rotateCCW(rot_state))) {
                        rot_state = rotateCCW(rot_state);
                        debounce.CCW = true;
                    }
                } 
                if (!(keys.left || keys.right)) {
                    das_timer = 0;
                }
                if (keys.hd && !debounce.HD) {
                    while (moveBlock(cur_color, cur_top_left, rot_state, {x:0,y:1})) {
                        cur_top_left.y += 1;
                    }
                    grounded = Infinity;
                    debounce.HD = true;
                }
            } catch (error) {
                
            }



            // console.log("y =", cur_top_left.y);
            deleteBlock(cur_color,cur_top_left,rot_state);
            if (checkColision(cur_color,rot_state,{x: cur_top_left.x, y: cur_top_left.y + 1})) {
                grounded += 1;
            } else {
                grounded = 0;
            }
            createBlock(cur_color,cur_top_left,rot_state);
            if (grounded >= GROUNDED_TIME) {
                // console.log("EE")
                piece_spawned = false;
                
                grounded = 0;
            } 

        },1000/60)
        

}
window.onkeydown = function(e: KeyboardEvent) {
    console.log(e)
    if (e.keyCode == 39) {
        keys.right = true;
    } else if (e.keyCode == 37) {
        keys.left = true;
    }
    else if (e.keyCode == 40) {
        keys.sd = true;
    }
    else if (e.keyCode == 38) {
        keys.cw = true;
    }
    else if (e.key == "a") {
        keys.ccw = true;
    }
    else if (e.key == " ") {
        keys.hd = true;
    }
}
window.onkeyup = function(e: KeyboardEvent) {
    console.log(e)
    if (e.keyCode == 39) {
        keys.right = false;
    } else if (e.keyCode == 37) {
        keys.left = false;
    } else if (e.keyCode == 40) {
        keys.sd = false;
    }
    else if (e.keyCode == 38) {
        keys.cw = false;
        debounce.CW = false;
    }
    else if (e.key == "a") {
        keys.ccw = false;
        debounce.CCW = false;
    }
    else if (e.key == " ") {
        keys.hd = false;
        debounce.HD = false;
    }
}