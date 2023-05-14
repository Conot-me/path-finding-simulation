import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect, use } from 'react'
import Dijkstras from '@/algorithms/dijkstra.js'
import Astar from '@/algorithms/astar.js'
import BFS from '@/algorithms/bfs.js'
import RecursiveBacktracker from '@/algorithms/recursivebacktracker.js'

export default function Home() {
  const [currentSelection, setCurrentSelection] = useState(null);
  const [gridSize, setGridSize] = useState(21)
  const [grid, setGrid] = useState([])
  const [startPos, setStartPos] = useState({X: Math.floor(gridSize/2), Y: Math.floor(gridSize/2)})
  const [targetPos, setTargetPos] = useState({X: gridSize-1, Y: gridSize-1})
  const [searchDelay, setSearchDelay] = useState(10)
  const [startIsPlaced, setStartIsPlaced] = useState(false)
  const [targetIsPlaced, setTargetIsPlaced] = useState(false)
  const [hoveredCell, setHoveredCell] = useState(null);
  const [currentAlgo, setcurrentAlgo] = useState("Algorithms")
  const [isSearching, setIsSearching] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isChecked, setIsChecked] = useState(false);

  const handleDelaySliderChange = (event) => {
    setSearchDelay(event.target.value);
  };

  const handleGridSliderChange = (event) => {
    setGridSize(event.target.value);
  };

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

  const handleMaze = async ()=>{
    setcurrentAlgo('RecursiveBacktracker')
    setIsSearching(true)
    setStartIsPlaced(false)
    setTargetIsPlaced(false)
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
            //console.log(isSearching)
            await astar.start();
            break;
          case "BFS":
            await bfs.start()
            break;
          case 'RecursiveBacktracker':
            setcurrentAlgo("Algorithms")
            await recursiveBacktracker.start()
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
        if(startPos !== null){
          grid[startPos.Y][startPos.X].cell = "empty";
          grid[startPos.Y][startPos.X].cost = Infinity;
        } 
        
        setStartPos(pos)
        grid[pos.Y][pos.X].cost = 0;
        grid[pos.Y][pos.X].cell = currentSelection; 

        break;
      case "target":
        setTargetIsPlaced(true)
        if(targetPos !== null){
          grid[targetPos.Y][targetPos.X].cell = "empty";
          grid[targetPos.Y][targetPos.X].cost = Infinity;
        }
        setTargetPos(pos)
        grid[pos.Y][pos.X].cost = Infinity;
        grid[pos.Y][pos.X].cell = currentSelection; 
        break;

      case "wall":
        switch(grid[pos.Y][pos.X].cell){
          case "start":
            setStartIsPlaced(false)
            grid[pos.Y][pos.X].cost = Infinity;
            grid[pos.Y][pos.X].cell = currentSelection; 
            break;
          case "target":
            setTargetIsPlaced(false)
            grid[pos.Y][pos.X].cost = Infinity;
            grid[pos.Y][pos.X].cell = currentSelection; 
            break;
            case "wall":
              grid[pos.Y][pos.X].cell = "empty"
              grid[pos.Y][pos.X].cost = Infinity;
              updateGrid();
              return;
          default:
          break;
        }
        grid[pos.Y][pos.X].cost = Infinity;
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
    setGrid([])
    setTargetPos(null)
    setStartPos(null)
    setStartIsPlaced(false)
    setTargetIsPlaced(false)
    var gridBuffer = []
    var id = 0;
    for(var i = 0; i < gridSize; i++){
      gridBuffer[i] = []
      for(var j = 0; j < gridSize; j++){
        gridBuffer[i][j] = {
          id: id++,
          cell: "empty",
          weight:  1,
          cost: Infinity,
          pos: {X: j, Y: i},
          parentPos: {X: null, Y: null}
        }
      }
    }
    setGrid(gridBuffer)
  }; 

  useEffect(() => {
    createGrid();
  },[gridSize]);

  const resetGrid = ()=>{
    // setIsSearching(false)
    for(var i = 0; i < gridSize; i++){
      for(var j = 0; j < gridSize; j++){
        if(grid[i][j].cell === "visited" || grid[i][j].cell === "unvisited" || grid[i][j].cell === "path"){
          grid[i][j].cell = "empty";
        }

        if(grid[i][j].cell === "start") continue;
        grid[i][j].cost = Infinity;
      }
    }
    updateGrid()
  }

  const removeWalls = ()=>{
    for(var i = 0; i < gridSize; i++){
      for(var j = 0; j < gridSize; j++){
        if(grid[i][j].cell === "wall"){
          grid[i][j].cell = "empty";
          grid[i][j].cost = Infinity;

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

const bfs = new BFS({
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

const recursiveBacktracker = new RecursiveBacktracker({
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
        <meta property="og:Path finding" content="Shortest Path Simulator" key="visualisation" />
      </Head>
      <section className={styles.Section}>
        
        <div className={styles.MenuContainer}>          
          <button className={styles.MenuButton} onClick={()=>setCurrentSelection("start")} style={(startIsPlaced || currentSelection === "start") ? isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "start" ? "#78bafc" : ""} : {borderColor: "red"}}>Place Start</button>
          <button className={styles.MenuButton} onClick={()=>setCurrentSelection("target")} style={(targetIsPlaced || currentSelection === "target") ? isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "target" ? "#ff7f7f" : ""}: {borderColor: "red"}}>Place Target</button>
          <button className={styles.MenuButton} onClick={()=>setCurrentSelection('wall')} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : {borderColor: currentSelection === "wall" ? "#000000" : ""}}>Add Walls</button>
          <div className={styles.Dropdown} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : null}>
            <button className={styles.MenuButton} style={currentAlgo === "Algorithms" ? {borderColor: "red"} : null}>{currentAlgo === false ? "Algorithms" : currentAlgo}</button>
            <div className={styles.DropdownContent}>
              <a onClick={()=>setcurrentAlgo("Dijkstras")}>Dijkstras</a>
              <a onClick={()=>setcurrentAlgo("A*")}>A*</a>
              <a onClick={()=>setcurrentAlgo("BFS")}>BFS</a>
            </div>
          </div>
          <button className={styles.MenuButton} onClick={()=>handleSearch()} style={((grid.length > 0 && !isSearching) && (startIsPlaced === true && targetIsPlaced === true)) ? {borderColor: "#78e080"} : {opacity: "0.5", pointerEvents: "none" }}>Find Path</button>
          <button className={styles.MenuButton} onClick={()=>handleMaze()} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : null}>Generate Maze</button>
          <button className={styles.MenuButton} onClick={()=>{grid.length > 0 ? (resetGrid(), removeWalls()) : createGrid()}}  style={isSearching ? {opacity: "0.5", pointerEvents: "none" } : null}>{grid.length > 0 ? "Reset grid" : "Create grid"}</button>
        </div>
        
        <div className={styles.Grid}>
          {grid.map((cellRow) => {
            return cellRow.map((cell) => {
              return (
                <div className={styles.Cell} key={cell.id} onClick={()=>handleClick(cell.pos)} onMouseEnter={() => {handleHover(cell.id); isMouseDown ? handleClick(cell.pos) : null}} onMouseDown={()=>handleMouseDown()} onMouseUp={()=>handleMouseUp()} style={cellStyle(cell)}>
                  {isChecked ? <p>{cell.cost === Infinity ? currentAlgo === "Dijkstras" ? "∞" : "" : cell.cost}</p> : null}
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

          <div className={styles.MenuContainer2}>

            <div className={styles.SliderContainer} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : null}>
              <label htmlFor="slider" className={styles.SliderLabel}>
                Speed
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={searchDelay}
                onChange={handleDelaySliderChange}
                className={styles.Slider}
                id="slider"
              />
              <span className={styles.SliderValue}>{searchDelay + "ms"}</span>
            </div>

            <div className={styles.SliderContainer} style={isSearching === true ? {opacity: "0.5", pointerEvents: "none" } : null}>
              <label htmlFor="slider" className={styles.SliderLabel}>
                Grid Size
              </label>
              <input
                type="range"
                min="10"
                max="50"
                value={gridSize}
                onChange={handleGridSliderChange}
                className={styles.Slider}
                id="slider"
              />
              <span className={styles.SliderValue}>{gridSize + "x" + gridSize}</span>
            </div>

            <label className={styles.Checkbox}>
              <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              <span className={styles.CheckboxMark}></span>
              <span className={styles.CheckboxLabel}>Traversal Cost</span>
            </label>
          </div>
          <div className={styles.Guide}>
            <h2 className={styles.GuideTitle}>Guide</h2>
            <p className={styles.GuideDescription}>This project is an interactive tool that helps users visualize the process of finding the shortest path between two points on a grid. Users can customize the grid size, obstacles, node positions and then watch as your choice of algorithm finds the optimal path.</p>
            <ul className={styles.GuideInstructions}>
              <li>Ensure that Start and Target nodes are placed on the grid. you can do this by clicking its associated button on the top left and clicking on the grid.</li><br/>
              <li>Make sure that you have a algorithm selected. You can do this by hovering over the algorithm button and selecting one of the algorithms that appear. You may also notice that the algorithm button now displays the correct algorithm you have chosen.</li><br/>
              <li>If you want to add walls simply click on the wall button and then click/drag over the grid. There is also a option to generate a maze in the grid, this will unfortunately make you repeat the steps above.</li><br/>
              <li>When you are ready to find your path, simply click on the "find path" button and watch the simulation.</li>
            </ul>
          </div>
        </div>
      </section>
    </>

  )
}