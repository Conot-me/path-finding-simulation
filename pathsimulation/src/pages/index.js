import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, use } from 'react'

export default function Home() {
  const [currentSelection, setCurrentSelection] = useState(null);
  const [gridSize, setGridSize] = useState(21)
  const [grid, setGrid] = useState([])
  const [gridWidth, setGridWidth] = useState(60)
  const [gridHeight, setGridHeight] = useState(60)
  const [targetDistance, setTragetDistance] = useState(0)
  const [startPos, setStartPos] = useState({X: Math.floor(gridSize/2), Y: Math.floor(gridSize/2)})
  const [targetPos, setTargetPos] = useState({X: 3, Y: 7})
  const [searchDelay, setSearchDelay] = useState(10)
  const [startIsPlaced, setStartIsPlaced] = useState(true)
  const [targetIsPlaced, setTargetIsPlaced] = useState(true)
  
  const handleClick = (pos) => {
    switch(currentSelection){
      case "start": 
        setStartIsPlaced(true)
        grid[startPos.Y][startPos.X].cell = "empty";
        grid[startPos.Y][startPos.X].distance = Infinity; 
        
        setStartPos(pos)
        grid[pos.Y][pos.X].distance = 0;
        break;
      case "target":
        setTargetIsPlaced(true)
        grid[targetPos.Y][targetPos.X].cell = "empty";
        grid[targetPos.Y][targetPos.X].distance = Infinity;
        setTargetPos(pos)
        grid[pos.Y][pos.X].distance = Infinity;
        break;

      case "wall":
        switch(grid[pos.Y][pos.X].cell){
          case "start":
            setStartIsPlaced(false)
            grid[pos.Y][pos.X].distance = Infinity;
            break;
          case "target":
            setTargetIsPlaced(false)
            grid[pos.Y][pos.X].distance = Infinity;
            break;
            case "wall":
              grid[pos.Y][pos.X].cell = "empty"
              grid[pos.Y][pos.X].distance = Infinity;
              updateGrid();
              return;
          default:
          break;
        }
        grid[pos.Y][pos.X].distance = Infinity;
        break;
      default:
        null
    }

    grid[pos.Y][pos.X].cell = currentSelection; 
    updateGrid();
  };
  
  async function timeoutUpdate(delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    updateGrid()
  }

  const createGrid = ()=> {
    var gridBuffer = []
    var id = 0;
    for(var i = 0; i < gridSize; i++){
      gridBuffer[i] = []
      for(var j = 0; j < gridSize; j++){
        gridBuffer[i][j] = {
          id: id++,
          cell: i === startPos.Y && j === startPos.X ? "start" : i === targetPos.Y && j === targetPos.X ? "target" : "empty",
          weight:  1,
          distance: i === startPos.Y && j === startPos.X ? 0 : Infinity,
          pos: {X: j, Y: i}
        }
      }
    }
    setGrid(gridBuffer)
  }; 

  const resetGrid = ()=>{
    for(var i = 0; i < gridSize; i++){
      for(var j = 0; j < gridSize; j++){
        if(grid[i][j].cell === "visited" || grid[i][j].cell === "unvisited" || grid[i][j].cell === "path" || grid[i][j].cell === "wall"){
          grid[i][j].cell = "empty";
        }

        if(grid[i][j].cell === "start") continue;
        grid[i][j].distance = Infinity;
      }
    }
    updateGrid()
  }

  const updateGrid = ()=> {setGrid([...grid])};

  var currentNodePos;
  var smallest = null;

  const dijkstra = async ()=>{
  // Step 1: Initialize distances from start node to all other nodes. already done through createGrid.
  // Step 2: already done through create grid.
  //Step 3: create a set of unvisited nodes.
  resetGrid()

  if(targetIsPlaced && startIsPlaced && grid[startPos.Y][startPos.X].cell === "start" && grid[targetPos.Y][targetPos.X].cell === "target"){
    const unvisited = new Set();
    const visited = new Set();
    unvisited.add(`${startPos.X},${startPos.Y}`);
  
    while(grid[targetPos.Y][targetPos.X].distance === Infinity && unvisited.size > 0) {
      smallest = null;
      currentNodePos = null;
      unvisited?.forEach(function(value){ //find the smallest distance node in the unvisited list
        const [i, j] = value.split(",");
        if(grid && grid[Number(j)] && grid[Number(j)][Number(i)]){
          const node = grid[Number(j)][Number(i)]; 
          if (smallest === null || node.distance < smallest) {
            smallest = node.distance;
            currentNodePos = { X: Number(i), Y: Number(j) };
  
          }
        }else {
          console.log("Index out of range or grid not initialized properly");
        }
        })
        visited.add(`${currentNodePos.Y},${currentNodePos.X}`);
        
        currentNodePos.Y === startPos.Y && currentNodePos.X === startPos.X ? null : grid[currentNodePos.Y][currentNodePos.X].cell = "visited";
        await timeoutUpdate(searchDelay)
  
        //check all neighbours, update their distance values and add to unvisited
        if(currentNodePos.Y > 0 && !visited.has(`${currentNodePos.Y-1},${currentNodePos.X}`) && grid[currentNodePos.Y -1][currentNodePos.X].cell !== "wall"){ //check above of node
          let newDist = grid[currentNodePos.Y][currentNodePos.X].distance + grid[currentNodePos.Y -1][currentNodePos.X].weight
          if(newDist < grid[currentNodePos.Y - 1][currentNodePos.X].distance){          
            grid[currentNodePos.Y - 1][currentNodePos.X].distance = newDist;
          }
          currentNodePos.Y-1 === targetPos.Y && currentNodePos.X === targetPos.X ? null : grid[currentNodePos.Y - 1][currentNodePos.X].cell = "unvisited"
          unvisited.add(`${currentNodePos.X},${currentNodePos.Y - 1}`); 
          await timeoutUpdate(searchDelay)
        }
  
        if(currentNodePos.X < gridSize-1 && !visited.has(`${currentNodePos.Y},${currentNodePos.X+1}`) && grid[currentNodePos.Y][currentNodePos.X+1].cell !== "wall"){ //check right of node
          let newDist = grid[currentNodePos.Y][currentNodePos.X].distance + grid[currentNodePos.Y][currentNodePos.X + 1].weight
          if(newDist < grid[currentNodePos.Y][currentNodePos.X + 1].distance) {
            grid[currentNodePos.Y][currentNodePos.X + 1].distance = newDist;
          }
          currentNodePos.Y === targetPos.Y && currentNodePos.X+1 === targetPos.X ? null : grid[currentNodePos.Y][currentNodePos.X + 1].cell = "unvisited"
          unvisited.add(`${currentNodePos.X + 1},${currentNodePos.Y}`);
          await timeoutUpdate(searchDelay)
        }
  
        if(currentNodePos.Y < gridSize-1 && !visited.has(`${currentNodePos.Y+1},${currentNodePos.X}`) && grid[currentNodePos.Y + 1][currentNodePos.X].cell !== "wall"){ //check below of node
          let newDist = grid[currentNodePos.Y][currentNodePos.X].distance + grid[currentNodePos.Y + 1][currentNodePos.X].weight
          if(newDist < grid[currentNodePos.Y + 1][currentNodePos.X].distance) {
            grid[(currentNodePos.Y + 1)][currentNodePos.X].distance = newDist;
          }
          currentNodePos.Y+1 === targetPos.Y && currentNodePos.X === targetPos.X ? null : grid[currentNodePos.Y + 1][currentNodePos.X].cell = "unvisited"
          unvisited.add(`${currentNodePos.X},${currentNodePos.Y + 1}`);
          await timeoutUpdate(searchDelay)
        }
  
        if(currentNodePos.X > 0 && !visited.has(`${currentNodePos.Y},${currentNodePos.X-1}`) && grid[currentNodePos.Y][currentNodePos.X - 1].cell !== "wall"){ //check left of node
          let newDist = grid[currentNodePos.Y][currentNodePos.X].distance + grid[currentNodePos.Y][currentNodePos.X - 1].weight
          if(newDist < grid[currentNodePos.Y][currentNodePos.X - 1].distance) {          
            grid[currentNodePos.Y][currentNodePos.X - 1].distance = newDist;
          }
          currentNodePos.Y === targetPos.Y && currentNodePos.X-1 === targetPos.X ? null : grid[currentNodePos.Y][currentNodePos.X - 1].cell = "unvisited"
          unvisited.add(`${currentNodePos.X-1},${currentNodePos.Y}`);
          await timeoutUpdate(searchDelay)
        }
  
        unvisited.delete(`${currentNodePos.X},${currentNodePos.Y}`);
    }
  
    updateGrid()
    findPath()
    return;
  }
  alert("Please Assign a Start and Target node")
}

  const findPath = async ()=> {
    if(grid[targetPos.Y][targetPos.X].distance === Infinity) {
      alert("Target has not been reached!"); 
      return;
    }

    let counter = 0;
    currentNodePos = { X: targetPos.X, Y: targetPos.Y };
    smallest = Infinity;

    while((currentNodePos.X !== startPos.X) || (currentNodePos.Y !== startPos.Y)){
      let nodeBuffer = null
      if((currentNodePos.Y - 1 >= 0) && (grid[currentNodePos.Y-1][currentNodePos.X].distance < smallest) && (grid[currentNodePos.Y-1][currentNodePos.X].cell !== "unvisited")){ //check above of node
        smallest = grid[currentNodePos.Y-1][currentNodePos.X].distance;
        nodeBuffer = { X: currentNodePos.X, Y: currentNodePos.Y-1};
      } 
      if((currentNodePos.X + 1 <= gridSize - 1) && (grid[currentNodePos.Y][currentNodePos.X+1].distance < smallest) && (grid[currentNodePos.Y][currentNodePos.X+1].cell !== "unvisited")){ //check right of node
        smallest = grid[currentNodePos.Y][currentNodePos.X + 1].distance;
        nodeBuffer = { X: currentNodePos.X + 1, Y: currentNodePos.Y}; 
      }
      if((currentNodePos.Y + 1 <= gridSize - 1) && (grid[currentNodePos.Y+1][currentNodePos.X].distance < smallest) && (grid[currentNodePos.Y+1][currentNodePos.X].cell !== "unvisited")){ //check below of node
        smallest = grid[currentNodePos.Y+1][currentNodePos.X].distance;
        nodeBuffer = { X: currentNodePos.X, Y: currentNodePos.Y+1}; 
      }
      if((currentNodePos.X - 1 >= 0) && (grid[currentNodePos.Y][currentNodePos.X-1].distance < smallest) && (grid[currentNodePos.Y][currentNodePos.X-1].cell !== "unvisited")){ //check left of node
        smallest = grid[currentNodePos.Y][currentNodePos.X - 1].distance;
        nodeBuffer = { X: currentNodePos.X - 1, Y: currentNodePos.Y};     
      } 
    
      currentNodePos = nodeBuffer; 
      try{
        if((currentNodePos.X !== startPos.X) || (currentNodePos.Y !== startPos.Y)) grid[currentNodePos.Y][currentNodePos.X].cell = "path";
      }
      catch(error){
        console.log("error finding path "+error)
      }
      counter++;
      await timeoutUpdate(50)
    }
    alert("Shortest path has been found!"); 
  }

  async function findTargetDistance(){
    setTragetDistance(Math.abs(startPos.X - targetPos.X) + Math.abs(startPos.Y - targetPos.Y));
  }

  useEffect(() => {
    findTargetDistance()
  }, [startPos, targetPos]);

  return (
    <>
      <Head>
        <title>Path Simulator</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <section className={styles.Section}>
        <div className={styles.MenuContainer}>
        <button className={styles.MenuButton} onClick={()=>{grid.length > 0 ? resetGrid() : createGrid()}}>{grid.length > 0 ? "Reset grid" : "Create grid"}</button>
        <button className={styles.MenuButton} onClick={()=>dijkstra()} style={grid.length > 0 ? {} : {opacity: "0.5", pointerEvents: "none" }}>Dijkstras</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection("start")} style={{borderColor: currentSelection === "start" ? "#78bafc" : ""}}>Start</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection("target")} style={{borderColor: currentSelection === "target" ? "#ff7f7f" : ""}}>Target</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection('wall')} style={{borderColor: currentSelection === "wall" ? "#000000" : ""}}>Wall</button>
        </div>
        
        <div className={styles.Grid} style={{width: `${gridWidth}%`, height: `${gridHeight}%`}}>
          {grid.map((cellRow) => {
            return cellRow.map((cell) => {
              return (
                <div className={styles.Cell} key={cell.id} onClick={()=>handleClick(cell.pos)} style={{
                  backgroundColor: (()=>{ //IIFE (immediately invoked function expression)
                    switch(cell.cell){
                      case "start":
                        return "#78bafc" // orange
                      case "target": 
                        return "#ff7f7f" // pink
                      case "path": 
                        return "#78e080" // light green
                      case "visited": 
                        return "#d1c4e9" // pale lavender
                      case "unvisited": 
                        return "#f6c37d" //  warm orange-yellow
                      case "wall": 
                        return "#000000" // black
                      default:
                        return ""
                    }
                  })(),                  
                  width: `${100/gridSize}%`,
                  height: `${100/gridSize}%`
                  }}>
                  <p>{cell.distance === Infinity ? "∞" : cell.distance}</p>
                </div>
              );
            });
          })}
          <div className={styles.Legends}>
              <p style={{color: "#78bafc" }}>Start Node</p>
              <p style={{color: "#ff7f7f" }}>Target Node</p>
              <p style={{color: "#d1c4e9" }}>Visited Node</p>
              <p style={{color: "#f6c37d" }}>Unvisited Node</p>
              <p style={{color: "#78e080" }}>Path Node</p>
          </div>
        </div>

      </section>
    </>

  )
}