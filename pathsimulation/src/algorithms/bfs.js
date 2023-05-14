import { useState } from "react";
import React from "react";
export default class BFS extends React.Component{

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

        this.currentNodePos = null;
        this.smallest = null;

      }

      async calculateDistance(node){
        let distance = Math.abs(this.startPos.X - node.X) + Math.abs(this.startPos.Y - node.Y);
        return distance
      }


    async start(){
        this.resetGrid()
        const dijkstraThis = this;
        if(this.targetIsPlaced && this.startIsPlaced && this.grid[this.startPos.Y][this.startPos.X].cell === "start" && this.grid[this.targetPos.Y][this.targetPos.X].cell === "target"){
          const unvisited = new Set();
          const visited = new Set();
          let iterator = unvisited.values();
          unvisited.add(`${this.startPos.X},${this.startPos.Y}`);
          while(this.isSearching && (this.grid[this.targetPos.Y][this.targetPos.X].cost === Infinity) && unvisited.size > 0) {
            let buffer = iterator.next().value
            const [i, j] = buffer.split(",");
            this.currentNodePos = { X: Number(i), Y: Number(j) };
            
            console.log(this.currentNodePos)

            // unvisited?.forEach(function(value){ //find the smallest cost node in the unvisited list
            //   const [i, j] = value.split(",");
            //   if(dijkstraThis.grid && dijkstraThis.grid[Number(j)] && dijkstraThis.grid[Number(j)][Number(i)]){
            //     const node = dijkstraThis.grid[Number(j)][Number(i)]; 
            //     if (dijkstraThis.smallest === null || node.cost < dijkstraThis.smallest) {
            //         dijkstraThis.smallest = node.cost;
            //         dijkstraThis.currentNodePos = { X: Number(i), Y: Number(j) };
            //     }
            //   }else {
            //     console.log("Index out of range or this.grid not initialized properly");
            //   }
            //   })
              visited.add(`${this.currentNodePos.Y},${this.currentNodePos.X}`);
              
              this.currentNodePos.Y === this.startPos.Y && this.currentNodePos.X === this.startPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X].cell = "visited";
              await this.timeoutUpdate(this.searchDelay)
        
              //check all neighbours, update their cost values and add to unvisited
              if(this.currentNodePos.Y > 0 && !visited.has(`${this.currentNodePos.Y-1},${this.currentNodePos.X}`) && this.grid[this.currentNodePos.Y -1][this.currentNodePos.X].cell !== "wall"){ //check above of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y - 1, X: this.currentNodePos.X})
                if(newDist < this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].cost){          
                  this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].cost = newDist;
                  this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y-1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y - 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y - 1}`); 
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X+1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X+1].cell !== "wall"){ //check right of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y, X: this.currentNodePos.X + 1})
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].cost) {
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].cost = newDist;
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y === this.targetPos.Y && this.currentNodePos.X+1 === this.targetPos.X ? null : this.grid[this.currentNodePos.Y][this.currentNodePos.X + 1].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X + 1},${this.currentNodePos.Y}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.Y < this.gridSize-1 && !visited.has(`${this.currentNodePos.Y+1},${this.currentNodePos.X}`) && this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell !== "wall"){ //check below of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y + 1, X: this.currentNodePos.X})
                if(newDist < this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cost) {
                  this.grid[(this.currentNodePos.Y + 1)][this.currentNodePos.X].cost = newDist;
                  this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].parentPos = this.currentNodePos;
                }
                this.currentNodePos.Y+1 === this.targetPos.Y && this.currentNodePos.X === this.targetPos.X ? null : this.grid[this.currentNodePos.Y + 1][this.currentNodePos.X].cell = "unvisited"
                unvisited.add(`${this.currentNodePos.X},${this.currentNodePos.Y + 1}`);
                await this.timeoutUpdate(this.searchDelay)
              }
        
              if(this.currentNodePos.X > 0 && !visited.has(`${this.currentNodePos.Y},${this.currentNodePos.X-1}`) && this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cell !== "wall"){ //check left of node
                let newDist = await this.calculateDistance({Y: this.currentNodePos.Y, X: this.currentNodePos.X - 1})
                if(newDist < this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cost) {          
                  this.grid[this.currentNodePos.Y][this.currentNodePos.X - 1].cost = newDist;
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
        if(this.grid[this.targetPos.Y][this.targetPos.X].cost === Infinity) {
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

  }