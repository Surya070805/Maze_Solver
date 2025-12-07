# 🤖 Interactive AI Pathfinding Solver

## Project Overview

This project is a web-based, interactive tool demonstrating core **Artificial Intelligence search algorithms** (from NPTEL's "Fundamentals of Artificial Intelligence" course, Weeks 2 & 3). Users can draw custom mazes on a grid, set start and end points, and then visualize how different search algorithms solve the maze.

The primary goal is to provide a clear, visual comparison of **Informed vs. Uninformed Search** methods in terms of efficiency, path length, and computational cost.

## 🌟 Features

* **Custom Maze Drawing:** Users can click and drag on the canvas to draw walls, creating unique mazes.
* **Three Algorithm Modes:** Compare the performance of the following algorithms:
    1.  **A\*** (A-star) Search: An **Informed Search** algorithm using a heuristic (Manhattan Distance) to find the shortest path efficiently.
    2.  **Breadth-First Search (BFS):** An **Uninformed Search** algorithm guaranteed to find the shortest path but typically explores many more nodes.
    3.  **Depth-First Search (DFS):** An **Uninformed Search** algorithm that explores deep branches quickly but does not guarantee the optimal (shortest) path.
* **Performance Metrics:** A detailed table displays crucial performance metrics for each algorithm upon completion:
    * **Time Taken (ms):** Total execution time.
    * **Cells Discovered:** The number of nodes expanded by the algorithm (a measure of efficiency).
    * **Path Length:** The total number of steps in the final path (a measure of optimality).

## ⚙️ Technical Stack

This project is implemented entirely using front-end technologies to ensure easy deployment via GitHub Pages and direct browser interaction.

* **HTML5/CSS3:** For the basic structure and styling.
* **JavaScript (Vanilla JS):** Used for all the core logic, including:
    * Canvas rendering and user drawing interaction.
    * Implementation of the A\*, BFS, and DFS algorithms.
    * Grid-to-graph translation.

## 🛠️ Installation and Running

This project does not require any server-side dependencies (like Python or Node.js).

### Option 1: View Online (Recommended)

Access the live demo hosted on GitHub Pages:

> 🌐 **[INSERT GITHUB PAGES LIVE LINK HERE]**

### Option 2: Run Locally

1.  **Clone the repository:**
    ```bash
    git clone git@github.com-personal:Surya070805/Maze_Solver.git
    ```
    *(Note: The remote address is configured to use the custom SSH host setup.)*

2.  **Navigate to the project directory:**
    ```bash
    cd Maze_Solver
    ```

3.  **Open the file:**
    Double-click the `index.html` file in your browser.

## 🎓 Learning Outcomes

This project demonstrates practical competence in the following AI concepts:

* **Problem Formulation:** Representing the maze as a search graph (nodes and edges).
* **Informed Search:** Implementing the A\* algorithm, including the cost function $f(n) = g(n) + h(n)$ and the Manhattan distance heuristic.
* **Uninformed Search:** Implementing BFS and DFS.
* **Algorithm Analysis:** Empirically measuring and comparing search performance metrics.
