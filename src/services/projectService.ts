type Label = { text: string; color?: string };
type Assignee = { name: string; initials?: string; color?: string };
type Card = { id: string; title: string; description?: string; labels?: Label[]; assignee?: Assignee; ticket?: string };
type Column = { id: string; title: string; cards: Card[] };

const STORAGE_KEY = "pm-board-data";

const defaultBoard: Column[] = [
  {
    id: "col-1",
    title: "TO DO",
    cards: [
      { id: "c-1", title: "Create project skeleton", ticket: "ND-10", labels: [{ text: "SETUP", color: "#ef4444" }], assignee: { name: "Anh", initials: "A", color: "#ef4444" } },
    ],
  },
  {
    id: "col-2",
    title: "IN PROGRESS",
    cards: [
      { id: "c-3", title: "Implement auth flow", ticket: "ND-31", labels: [{ text: "AUTH", color: "#f97316" }], assignee: { name: "Linh", initials: "L", color: "#06b6d4" } },
    ],
  },
  {
    id: "col-3",
    title: "CODE REVIEW",
    cards: [
      { id: "c-5", title: "Review search feature", ticket: "ND-18", labels: [{ text: "COURSE MANAGEMENT", color: "#dc2626" }], assignee: { name: "Minh", initials: "M", color: "#0ea5e9" } },
      { id: "c-6", title: "Refactor dashboard", ticket: "ND-19", labels: [{ text: "UI", color: "#10b981" }], assignee: { name: "Trang", initials: "T", color: "#7c3aed" } },
    ],
  },
  {
    id: "col-4",
    title: "TESTING",
    cards: [
      { id: "c-7", title: "E2E notifications", ticket: "ND-31", labels: [{ text: "NOTIFICATION SYSTEM", color: "#16a34a" }], assignee: { name: "Anh", initials: "A", color: "#ef4444" } },
      { id: "c-8", title: "Deploy backend", ticket: "ND-73", labels: [{ text: "TESTING & DEPLOYMENT", color: "#7c3aed" }], assignee: { name: "Linh", initials: "L", color: "#06b6d4" } },
    ],
  },
  {
    id: "col-5",
    title: "DONE",
    cards: [
      { id: "c-9", title: "Project init", ticket: "ND-22", labels: [{ text: "CART & ORDER", color: "#dc2626" }], assignee: { name: "Quy", initials: "Q", color: "#0f172a" } },
    ],
  },
];

let board: Column[] = loadBoard();

const timeout = (ms = 200) => new Promise(res => setTimeout(res, ms));

function saveBoard() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error("Unable to save board to localStorage", error);
  }
}

function loadBoard(): Column[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBoard;
    const parsed = JSON.parse(raw) as Column[];
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.warn("Failed to load board from localStorage", error);
  }
  return defaultBoard;
}

export async function getBoard(): Promise<Column[]> {
  await timeout();
  return JSON.parse(JSON.stringify(board));
}

function genId(prefix = "c") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
}

export async function addCard(columnId: string, card: { title: string; description?: string; labels?: Label[]; assignee?: Assignee; ticket?: string }): Promise<Card> {
  await timeout();
  const newCard: Card = { id: genId('c'), title: card.title, description: card.description, labels: card.labels || [], assignee: card.assignee, ticket: card.ticket };
  const col = board.find(c => c.id === columnId);
  if (col) {
    col.cards.push(newCard);
    saveBoard();
  }
  return JSON.parse(JSON.stringify(newCard));
}

export async function moveCard(cardId: string, toColumnId: string): Promise<void> {
  await timeout();
  let moving: Card | undefined;
  board = board.map(col => ({ ...col, cards: col.cards.filter(c => { if (c.id === cardId) { moving = c; return false } return true }) }));
  if (moving) {
    const to = board.find(c => c.id === toColumnId);
    to?.cards.push(moving);
    saveBoard();
  }
}

export async function deleteCard(cardId: string): Promise<void> {
  await timeout();
  board = board.map(col => ({ ...col, cards: col.cards.filter(c => c.id !== cardId) }));
  saveBoard();
}
