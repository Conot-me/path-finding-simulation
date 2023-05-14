import React from "react";
export default class RecursiveBacktracker extends React.Component{

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
        // console.log(this.grid[0][0])
        // this.currentNodePos = { X: Math.floor(Math.random() * this.gridSize-1) , Y: Math.floor(Math.random() * this.gridSize-1) };
    }

    async setWalls(){
        for(var i = 0; i < this.gridSize; i++){
            for(var j = 0; j < this.gridSize; j++){
                this.grid[i][j].cell = "wall";
                this.grid[i][j].cost = Infinity;
            }
        }  
        await this.updategrid()        
    }


    async start(){
        console.log("we are starting!!!!")
        //console.log(this.grid[0][0])

        const currentNodePos = { X: Math.floor(Math.random() * (this.gridSize-1)) , Y: Math.floor(Math.random() * (this.gridSize-1)) };
        await this.setWalls()
        const unvisited = [];


        try {
            this.grid[currentNodePos.Y][currentNodePos.X].cell = "empty";

        } catch (error) {
            console.log(currentNodePos.Y, currentNodePos.X)
        }



        unvisited.push(this.currentNodePos);

        await this.recursiveBacktrack(currentNodePos);

        this.updategrid()
        return Promise;
    }

    async shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
      }
      

    async recursiveBacktrack(node){
        let directions = ["north", "south", "east", "west"]
        directions = await this.shuffle(directions)

        for(var i = 0; i < directions.length; i++){
            switch(directions[i]){
                case "north":
                    if(node.Y > 2 && this.grid[node.Y-2][node.X].cell === "wall"){ //ensure there is a wall 2 nodes from current node
                        for(var j = 0; j < 3; j++){ //collapse 
                            this.grid[node.Y-2 + j][node.X].cell = "empty"
                            await this.timeoutUpdate(this.searchDelay);
                        }
                        await this.recursiveBacktrack({Y: node.Y-2, X: node.X})
                    }
                    break;
                case "south":
                    if((node.Y+2) < (this.gridSize-1) && this.grid[node.Y+2][node.X].cell === "wall"){ //ensure there is a wall 2 nodes from current node
                        for(var j = 0; j < 3; j++){
                            this.grid[node.Y + j][node.X].cell = "empty"
                            await this.timeoutUpdate(this.searchDelay);
                        }
                        await this.recursiveBacktrack({Y: node.Y+2, X: node.X})
                    }
                    break;
                case "east":
                    if((node.X+2) < (this.gridSize-1) && this.grid[node.Y][node.X + 2].cell === "wall"){ //ensure there is a wall 2 nodes from current node
                        for(var j = 0; j < 3; j++){
                            this.grid[node.Y][node.X + j].cell = "empty"
                            await this.timeoutUpdate(this.searchDelay);
                        }
                        await this.recursiveBacktrack({Y: node.Y, X: node.X + 2})
                    }
                    break;
                case "west":
                    if(node.X > 2 && this.grid[node.Y][node.X - 2].cell === "wall"){ //ensure there is a wall 2 nodes from current node
                        for(var j = 0; j < 3; j++){
                            this.grid[node.Y][node.X -2 + j].cell = "empty"
                            await this.timeoutUpdate(this.searchDelay);
                        }
                        await this.recursiveBacktrack({Y: node.Y, X: node.X-2})
                    }
                    break;
            }
        }
    }


    render() {
    return null;
    }

  }









  