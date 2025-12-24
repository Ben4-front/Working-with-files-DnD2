import Board from './Board';
import DnD from './DnD';
import State from './storage';
import '../css/style.css';

const state = new State();
const container = document.getElementById('board');
const board = new Board(container, state);
const dnd = new DnD(board);