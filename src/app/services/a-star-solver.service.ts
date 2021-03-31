import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AStarSolverService {
  expCount;
  openNodes;
  closedNodes;
  finalPath;
  id: number;
  acceptableMoves = [
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4, 6],
    [3, 1, 5, 7],
    [4, 2, 8],
    [3, 7],
    [6, 4, 8],
    [7, 5],
  ];
  constructor() {}

  solvePuzzle(initState) {
    this.expCount = 0;
    this.openNodes = [];
    this.closedNodes = [];
    this.id = 0;
    let initialState = initState;
    this.openNodes.push({
      id: this.id,
      prevNode: null,
      state: initialState,
      f: 0,
      g: 0,
    });
    const h = this.getManhattanDistance(initialState);
    if (h === 0) {
      this.finalPath = [initialState];
    } else {
      this.openNodes[0].f = h;
      this.getChildren(this.openNodes[0]);
    }
    return this.finalPath;
  }

  private getChildren(node) {
    let isComplete = false;
    this.closedNodes.push({ ...node });
    this.openNodes = this.openNodes.filter((n) => n.id !== node.id);
    const emptyCell = node.state.indexOf(null);
    this.acceptableMoves[emptyCell].forEach((newPos) => {
      let newNode = { ...node, state: [...node.state] };
      newNode.state[emptyCell] = node.state[newPos];
      newNode.state[newPos] = null;
      let isStateClosed = this.closedNodes.find(
        (node) => node.state == newNode.state
      );
      let isStateOpen = this.openNodes.find(
        (node) => node.state == newNode.state
      );
      if (!isStateClosed && !isStateOpen) {
        const h = this.getManhattanDistance(newNode.state);
        const g = node.g + 1;
        this.id++;
        this.openNodes.push({
          id: this.id,
          prevNode: node.id,
          state: newNode.state,
          f: g + h,
          g: g,
        });
        if (h === 0) {
          isComplete = true;
          return this.getPath(this.openNodes[this.openNodes.length - 1]);
        }
      }
    });
    if (!isComplete) {
      this.selectNextNode();
    }
  }
  private selectNextNode() {
    let minNode = this.openNodes[0];
    this.openNodes.forEach((node) => {
      if (node.f < minNode.f) {
        minNode = node;
      }
    });
    this.expCount += 1;
    if (this.expCount > 3000) {
      this.finalPath = 'failed';
    } else {
      return this.getChildren(minNode);
    }
  }

  private getManhattanDistance(state) {
    let dist = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== null) {
        let correctRow = i % 3;
        let currRow = state[i] % 3;
        dist += Math.abs(correctRow - currRow);
        dist += Math.abs(Math.floor(state[i] / 3) - Math.floor(i / 3));
      }
    }
    return dist;
  }
  private getPath(goalNode) {
    this.finalPath = [goalNode.state];
    let prevNode = this.closedNodes.find(
      (node) => node.id === goalNode.prevNode
    );
    this.finalPath.unshift(prevNode.state);
    while (prevNode.prevNode) {
      prevNode = this.closedNodes.find((node) => node.id === prevNode.prevNode);
      this.finalPath.unshift(prevNode.state);
    }
  }
}
