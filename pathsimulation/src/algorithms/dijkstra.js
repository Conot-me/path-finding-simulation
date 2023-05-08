import { useState } from "react";
import React from "react";
export default class Dijkstras extends React.Component{

    constructor(props) {
        super(props);
        const { grid, updateGrid, timeoutUpdate, gridSize, startPos, targetPos, searchDelay, resetGrid, startIsPlaced, targetIsPlaced, isSearching, stopSearching } = props;
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
        this.stopSearching = stopSearching
        
        this.stop = this.stop.bind(this);

        this.currentNodePos = null;
        this.smallest = null;

      }


    async start(){
        // Step 1: Initialize distances from start node to all other nodes.
        // Step 2: already done through create this.grid.
        //Step 3: create a set of unvisited nodes.
        // console.log(this.isSearching)
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
                let newDist = this.grid[this.currentNodePos.Y][this.currentNodePos.X].distance + this.grid[this.currentNodePos.Y -1][this.currentNodePos.X].weight
                if(newDist < this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].distance){          
                  this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].distance = newDist;
                }
                this.currentNodePos.Y-1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y - 1}`); 
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X+1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X+1].cell !== "wall"){ //check right of node
                let newDist = this.grid[this.currentNodePos.Y][this.currentNodePos.X].distance + this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].weight
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].distance) {
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].distance = newDist;
                }
                this.currentNodePos.Y === this.targetPos.Y && this.currentNodePos.X+1 === this.targetPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X + 1},${this.currentNodePos.Y}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.Y < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y+1},${this.currentNodePos.X}`) && this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell !== "wall"){ //check below of node
                let newDist = this.grid[this.currentNodePos.Y][this.currentNodePos.X].distance + this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].weight
                if(newDist < this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].distance) {
                  this.grid[(this.currentNodePos.Y + 1)][this.currentNodePos.X].distance = newDist;
                }
                this.currentNodePos.Y+1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y + 1}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X > 0 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X-1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cell !== "wall"){ //check left of node
                let newDist = this.grid[this.currentNodePos.Y][this.currentNodePos.X].distance + this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].weight
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].distance) {          
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].distance = newDist;
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
    
        this.counter = 0;
        this.currentNodePos = { X: this.targetPos.X, Y: this.targetPos.Y };
        this.smallest = Infinity;
    
        while((this.currentNodePos.X !== this.startPos.X) || (this.currentNodePos.Y !== this.startPos.Y)){
          let nodeBuffer = null
          if((this.currentNodePos.Y - 1 >= 0) && (this.grid[this.currentNodePos.Y-1][this.currentNodePos.X].distance < this.smallest) && (this.grid[this.currentNodePos.Y-1][this.currentNodePos.X].cell !== "unvisited")){ //check above of node
            this.smallest = this.grid[this.currentNodePos.Y-1][this.currentNodePos.X].distance;
            nodeBuffer = { X: this.currentNodePos.X, Y: this.currentNodePos.Y-1};
          } 
          if((this.currentNodePos.X + 1 <= this.gridSize - 1) && (this.grid[this.currentNodePos.Y][this.currentNodePos.X+1].distance < this.smallest) && (this.grid[this.currentNodePos.Y][this.currentNodePos.X+1].cell !== "unvisited")){ //check right of node
            this.smallest = this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].distance;
            nodeBuffer = { X: this.currentNodePos.X + 1, Y: this.currentNodePos.Y}; 
          }
          if((this.currentNodePos.Y + 1 <= this.gridSize - 1) && (this.grid[this.currentNodePos.Y+1][this.currentNodePos.X].distance < this.smallest) && (this.grid[this.currentNodePos.Y+1][this.currentNodePos.X].cell !== "unvisited")){ //check below of node
            this.smallest = this.grid[this.currentNodePos.Y+1][this.currentNodePos.X].distance;
            nodeBuffer = { X: this.currentNodePos.X, Y: this.currentNodePos.Y+1}; 
          }
          if((this.currentNodePos.X - 1 >= 0) && (this.grid[this.currentNodePos.Y][this.currentNodePos.X-1].distance < this.smallest) && (this.grid[this.currentNodePos.Y][this.currentNodePos.X-1].cell !== "unvisited")){ //check left of node
            this.smallest = this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].distance;
            nodeBuffer = { X: this.currentNodePos.X - 1, Y: this.currentNodePos.Y};     
          } 
        
          this.currentNodePos = nodeBuffer; 
          try{
            if((this.currentNodePos.X !== this.startPos.X) || (this.currentNodePos.Y !== this.startPos.Y)) this.grid[this.currentNodePos.Y][this.currentNodePos.X].cell = "path";
          }
          catch(error){
            console.log("error finding path "+error)
          }
          this.counter++;
          await this.timeoutUpdate(50)
        }
        alert("Shortest path has been found!"); 
      }

      render() {
        return null;
      }

      stop(){
        // console.log("stop searching" + this.isSearching)
        // this.stopSearching()
        // console.log(this.isSearching)
      }

  }