import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, use } from 'react'
import Dijkstras from '@/algorithms/dijkstra.js'
import Astar from '@/algorithms/astar.js'

export default function Home() {
  const [currentSelection, setCurrentSelection] = useState(null);
  const [gridSize, setGridSize] = useState(21)
  const [grid, setGrid] = useState([])
  const [gridWidth, setGridWidth] = useState(60)
  const [gridHeight, setGridHeight] = useState(60)
  const [targetDistance, setTragetDistance] = useState(0)
  const [startPos, setStartPos] = useState({X: Math.floor(gridSize/2), Y: Math.floor(gridSize/2)})
  const [targetPos, setTargetPos] = useState({X: gridSize-1, Y: gridSize-1})
  const [searchDelay, setSearchDelay] = useState(10)
  const [startIsPlaced, setStartIsPlaced] = useState(true)
  const [targetIsPlaced, setTargetIsPlaced] = useState(true)
  const [hoveredCell, setHoveredCell] = useState(null);
  const [currentAlgo, setcurrentAlgo] = useState("Algorithms")
  const [isSearching, setIsSearching] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const handleHover = (cellId) => {
    setHoveredCell(cellId);
  };

  const handleMouseDown = ()=>{
    setIsMouseDown(true)
  }
  const handleMouseUp = ()=>{
    setIsMouseDown(false)
  }
  const handleSearch = async () => {
    setCurrentSelection(null)
    setIsSearching(true)
  }

  useEffect(() => {
    if(isSearching){
      (async ()=> {
        switch(currentAlgo){
          case "Dijkstras":
            await dijkstras.start();
            //dijkstras.stop();
            break;
          case "A*":
            // alert("not implemented in this version")
            console.log(isSearching)
            await astar.start();
            break;
          case "BFS":
            alert("not implemented in this version")
            break;
          default:
            alert("Please choose an algorithm!")
      }
      setIsSearching(false)
    })()
    return;
  }
  
}, [isSearching]);

  
  const handleClick = (pos) => {
    switch(currentSelection){
      case "start": 
        setStartIsPlaced(true)
        grid[startPos.Y][startPos.X].cell = "empty";
        grid[startPos.Y][startPos.X].distance = Infinity; 
        
        setStartPos(pos)
        grid[pos.Y][pos.X].distance = 0;
        grid[pos.Y][pos.X].cell = currentSelection; 

        break;
      case "target":
        setTargetIsPlaced(true)
        grid[targetPos.Y][targetPos.X].cell = "empty";
        grid[targetPos.Y][targetPos.X].distance = Infinity;
        setTargetPos(pos)
        grid[pos.Y][pos.X].distance = Infinity;
        grid[pos.Y][pos.X].cell = currentSelection; 
        break;

      case "wall":
        switch(grid[pos.Y][pos.X].cell){
          case "start":
            setStartIsPlaced(false)
            grid[pos.Y][pos.X].distance = Infinity;
            grid[pos.Y][pos.X].cell = currentSelection; 
            break;
          case "target":
            setTargetIsPlaced(false)
            grid[pos.Y][pos.X].distance = Infinity;
            grid[pos.Y][pos.X].cell = currentSelection; 
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
        grid[pos.Y][pos.X].cell = currentSelection; 
        break;
      default:
        null
    }
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
          pos: {X: j, Y: i},
          parentPos: {X: null, Y: null}
        }
      }
    }
    setGrid(gridBuffer)
  }; 

  useEffect(() => {
    createGrid();
  },[]);

  const resetGrid = ()=>{
    // setIsSearching(false)
    for(var i = 0; i < gridSize; i++){
      for(var j = 0; j < gridSize; j++){
        if(grid[i][j].cell === "visited" || grid[i][j].cell === "unvisited" || grid[i][j].cell === "path"){
          grid[i][j].cell = "empty";
        }

        if(grid[i][j].cell === "start") continue;
        grid[i][j].distance = Infinity;
      }
    }
    updateGrid()
  }

  const removeWalls = ()=>{
    for(var i = 0; i < gridSize; i++){
      for(var j = 0; j < gridSize; j++){
        if(grid[i][j].cell === "wall"){
          grid[i][j].cell = "empty";
          grid[i][j].distance = Infinity;

        }
      }
    }
    updateGrid()
  }

  const updateGrid = ()=> {setGrid([...grid])};

  const dijkstras = new Dijkstras({
    grid: grid,
    updateGrid: updateGrid,
    timeoutUpdate: timeoutUpdate,
    gridSize: gridSize,
    startPos: startPos,
    targetPos: targetPos,
    searchDelay: searchDelay,
    resetGrid: resetGrid,
    startIsPlaced: startIsPlaced,
    targetIsPlaced: targetIsPlaced,
    isSearching: isSearching,
    stopSearching: stopSearching,
 });

  const astar = new Astar({
    grid: grid,
    updateGrid: updateGrid,
    timeoutUpdate: timeoutUpdate,
    gridSize: gridSize,
    startPos: startPos,
    targetPos: targetPos,
    searchDelay: searchDelay,
    resetGrid: resetGrid,
    startIsPlaced: startIsPlaced,
    targetIsPlaced: targetIsPlaced,
    isSearching: isSearching,
    stopSearching: stopSearching,
});

  function stopSearching(){
    //setIsSearching(false)
  }

  async function findTargetDistance(){
    setTragetDistance(Math.abs(startPos.X - targetPos.X) + Math.abs(startPos.Y - targetPos.Y));
  }

  useEffect(() => {
    findTargetDistance()
  }, [startPos, targetPos]);

  const cellStyle = (cell) =>{
    return{
      backgroundColor: (()=>{ //IIFE (immediately invoked function expression)
        switch(cell.cell){
          case "start":
            return "#78bafc" // blue
          case "target": 
            return "#ff7f7f" // red
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
      height: `${100/gridSize}%`,
      border: cell.id === hoveredCell ? (()=>{
        switch(currentSelection){
          case "start":
            return "2px solid #78bafc" // blue
          case "target": 
            return " 2px solid #ff7f7f" // red
          case "wall": 
            return " 2px solid #000000" // black
          default:
            return "1px solid #465b7f"
        }
      })() : "1px solid #465b7f"
    }
  };
  

  return (
    <>
      <Head>
        <title>Path Simulator</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <section className={styles.Section}>
        
        <div className={styles.MenuContainer}>
        <button className={styles.MenuButton} onClick={()=>{grid.length > 0 ? (resetGrid(), removeWalls()) : createGrid()}}  style={isSearching ? {opacity: "0.5", pointerEvents: "none" } : null}>{grid.length > 0 ? "Reset grid" : "Create grid"}</button>
        <div className={styles.Dropdown}>
          <button className={styles.MenuButton}>{currentAlgo === false ? "Algorithms" : currentAlgo}</button>
          <div className={styles.DropdownContent}>
            <a onClick={()=>setcurrentAlgo("Dijkstras")}>Dijkstras</a>
            <a onClick={()=>setcurrentAlgo("A*")}>A*</a>
            <a onClick={()=>setcurrentAlgo("BFS")}>BFS</a>
          </div>
        </div>
        <button className={styles.MenuButton} onClick={()=>handleSearch()} style={(grid.length > 0 && !isSearching) ? {} : {opacity: "0.5", pointerEvents: "none" }}>Find Path</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection("start")} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "start" ? "#78bafc" : ""}}>Place Start</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection("target")} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "target" ? "#ff7f7f" : ""}}>Place Target</button>
        <button className={styles.MenuButton} onClick={()=>setCurrentSelection('wall')} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "wall" ? "#000000" : ""}}>Add Walls</button>
        </div>
        
        <div className={styles.Grid} style={{width: `${gridWidth}%`, height: `${gridHeight}%`}}>
          {grid.map((cellRow) => {
            return cellRow.map((cell) => {
              return (
                <div className={styles.Cell} key={cell.id} onClick={()=>handleClick(cell.pos)} onMouseEnter={() => {handleHover(cell.id); isMouseDown ? handleClick(cell.pos) : null}} onMouseDown={()=>handleMouseDown()} onMouseUp={()=>handleMouseUp()} style={cellStyle(cell)}>
                  {/* <p>{cell.distance === Infinity ? "∞" : cell.distance}</p> */}
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