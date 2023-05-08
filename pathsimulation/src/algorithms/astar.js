import { useState } from "react";
import React from "react";
export default class Astar extends React.Component{

/*

1. Define the state space: In this case, the state space is a 2D array where each cell represents a point on the grid. Each cell can be represented as a tuple (x, y), where x and y are the coordinates of the cell.

2.Define the goal state: The goal state is the destination cell or the final position that you want to reach. This can be represented as a tuple (x_goal, y_goal).

3.Define the start state: The start state is the initial position from where you start searching for the destination. This can be represented as a tuple (x_start, y_start).

4.Define the cost function: The cost function determines the cost of moving from one cell to another. In this case, the cost of moving from one cell to another is the Euclidean distance between the two cells. You can use the Pythagorean theorem to calculate the distance between two cells.

5.Define the heuristic function: The heuristic function estimates the cost of reaching the goal state from a given cell. In this case, you can use the Euclidean distance between the current cell and the goal state as the heuristic function.

6. Implement the A* algorithm:

      Create an open list to store the nodes that need to be explored.
      Create a closed list to store the nodes that have already been explored.
      Add the start state to the open list.
      While the open list is not empty:
      Select the node with the lowest f-value (f = g + h) from the open list.
      If the selected node is the goal state, return the path to that node.
      Generate the successors of the selected node (i.e., the neighboring cells that can be reached from the current cell).
      For each successor:
      Calculate the g-value (the cost of moving from the start state to the successor node).
      Calculate the h-value (the estimated cost of reaching the goal state from the successor node).
      Calculate the f-value (f = g + h).
      If the successor is already in the closed list with a lower f-value, skip it.
      If the successor is already in the open list with a lower f-value, update its f-value.
      If the successor is not in the open or closed list, add it to the open list with its f-value.
      Add the selected node to the closed list.
      Return failure if there is no path to the goal state.

      If there is a path, backtrack from the goal state to the start state using the parent pointers that were stored in each node during the search.

*/


    constructor(props) {
        super(props);
        const { grid, updateGrid, timeoutUpdate, gridSize, startPos, targetPos, searchDelay, resetGrid, startIsPlaced, targetIsPlaced, isSearching, setIsSearching } = props;
        this.grid = grid;
        this.updategrid = updateGrid;
        this.timeoutUpdate = timeoutUpdate;
        this.gridSize = gridSize;
        this.startPos = startPos;
        this.targetPos = targetPos;
        this.searchDelay = searchDelay
        this.resetGrid = resetGrid
        this.startIsPlaced = startIsPlaced
        this.targetIsPlaced = targetIsPlaced
        this.isSearching = isSearching
        this.setIsSearching = setIsSearching
        
        this.stopSearching = this.stopSearching.bind(this);

        this.currentNodePos = null;
        this.smallest = null;

    }

    async calculateDistance(node){
      //console.log(Math.abs(this.targetPos.X - node.X), Math.abs(this.startPos.X - node.X) + Math.abs(this.startPos.Y - node.Y))
      let H = Math.abs(this.targetPos.X - node.X) + Math.abs(this.targetPos.Y - node.Y);
      let G = Math.abs(this.startPos.X - node.X) + Math.abs(this.startPos.Y - node.Y);
      let F = H + G
      //console.log(H,G,F)
      return F
    }

    async start(){
        this.resetGrid()
        const dijkstraThis = this;
        if(this.targetIsPlaced && this.startIsPlaced && this.grid[this.startPos.Y][this.startPos.X].cell === "start" && this.grid[this.targetPos.Y][this.targetPos.X].cell === "target"){
          const unvisited = new Set();
          const visited = new Set();
          unvisited.add(`${this.startPos.X},${this.startPos.Y}`);
          while(this.isSearching && (this.grid[this.targetPos.Y][this.targetPos.X].distance === Infinity) && unvisited.size > 0) {
            //console.log(this.isSearching)
            
            this.smallest = null;
            this.currentNodePos = null;
            unvisited?.forEach(function(value){ //find the smallest distance node in the unvisited list
              const [i, j] = value.split(",");
              if(dijkstraThis.grid && dijkstraThis.grid[Number(j)] && dijkstraThis.grid[Number(j)][Number(i)]){
                const node = dijkstraThis.grid[Number(j)][Number(i)]; 
                if (dijkstraThis.smallest === null || node.distance < dijkstraThis.smallest) {
                    dijkstraThis.smallest = node.distance;
                    dijkstraThis.currentNodePos = { X: Number(i), Y: Number(j) };
                }
              }else {
                console.log("Index out of range or this.grid not initialized properly");
              }
              })
              visited.add(`${this.currentNodePos.Y},${this.currentNodePos.X}`);
              
              this.currentNodePos.Y === this.startPos.Y && this.currentNodePos.X === this.startPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X].cell = "visited";
              await this.timeoutUpdate(this.searchDelay)
        
              //check all neighbours, update their distance values and add to unvisited
              if(this.currentNodePos.Y > 0 && !visited.has(`${this.currentNodePos.Y-1},${this.currentNodePos.X}`) && this.grid[this.currentNodePos.Y -1][this.currentNodePos.X].cell !== "wall"){ //check above of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y - 1, X: this.currentNodePos.X})
                if(newDist < this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].distance){          
                  this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].distance = newDist;
                  this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y-1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y - 1}`); 
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X+1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X+1].cell !== "wall"){ //check right of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y, X: this.currentNodePos.X + 1})
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].distance) {
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].distance = newDist;
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y === this.targetPos.Y && this.currentNodePos.X+1 === this.targetPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X + 1},${this.currentNodePos.Y}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.Y < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y+1},${this.currentNodePos.X}`) && this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell !== "wall"){ //check below of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y + 1, X: this.currentNodePos.X})
                if(newDist < this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].distance) {
                  this.grid[(this.currentNodePos.Y + 1)][this.currentNodePos.X].distance = newDist;
                  this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y+1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y + 1}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X > 0 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X-1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cell !== "wall"){ //check left of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y, X: this.currentNodePos.X - 1})
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].distance) {          
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].distance = newDist;
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y === this.targetPos.Y && this.currentNodePos.X-1 === this.targetPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X-1},${this.currentNodePos.Y}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              unvisited.delete(`${this.currentNodePos.X},${this.currentNodePos.Y}`); //remove currentNode
          }
        
          if(this.isSearching === false) {
            alert("is searching false")
            return Promise;
            };

          this.updategrid()
          this.findPath()
          return Promise;
        }
        alert("Please Assign a Start and Target node")

        return Promise;
      }


      async findPath(){
        if(this.grid[this.targetPos.Y][this.targetPos.X].distance === Infinity) {
          alert("Target has not been reached!"); 
          return;
        }

        this.currentNodePos = { X: this.targetPos.X, Y: this.targetPos.Y };    
        while((this.currentNodePos.X !== this.startPos.X) || (this.currentNodePos.Y !== this.startPos.Y)){
          this.currentNodePos = this.grid[this.currentNodePos.Y][this.currentNodePos.X].parentPos;
          try{
            if((this.currentNodePos.X !== this.startPos.X) || (this.currentNodePos.Y !== this.startPos.Y)) this.grid[this.currentNodePos.Y][this.currentNodePos.X].cell = "path";
          }
          catch(error){
            console.log("error finding path "+error)
          }
          await this.timeoutUpdate(50)
        }
        alert("Shortest path has been found!"); 
      }

      render() {
        return null;
      }

      stopSearching(){
        //console.log("stop searching" + this.isSearching)
        // this.setIsSearching(false)
        //console.log(this.isSearching)
      }

  }