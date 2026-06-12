import React, { useEffect, useState } from "react";
import { getBoard, addCard, moveCard, deleteCard } from "../services/projectService";
import Column from "./Column";

type Card = { id: string; title: string; description?: string; labels?: { text: string; color?: string }[]; assignee?: { name: string; initials?: string; color?: string }; ticket?: string };
type ColumnType = { id: string; title: string; cards: Card[] };

const Board: React.FC<{ searchTerm?: string }> = ({ searchTerm = "" }) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    getBoard().then(setColumns);
  }, []);

  const handleAdd = async (columnId: string, title: string) => {
    if (!title) return;
    const card = await addCard(columnId, { title });
    setColumns((prev) => prev.map(c => c.id === columnId ? { ...c, cards: [...c.cards, card] } : c));
  };

  const handleMove = async (cardId: string, fromId: string, toId: string) => {
    await moveCard(cardId, toId);
    setColumns((prev) => {
      const from = prev.find(c => c.id === fromId);
      const to = prev.find(c => c.id === toId);
      if (!from || !to) return prev;
      const card = from.cards.find(cd => cd.id === cardId);
      if (!card) return prev;
      return prev.map(c => {
        if (c.id === fromId) return { ...c, cards: c.cards.filter(cd => cd.id !== cardId) };
        if (c.id === toId) return { ...c, cards: [...c.cards, card] };
        return c;
      });
    });
  };

  const handleDelete = async (cardId: string, fromId: string) => {
    await deleteCard(cardId);
    setColumns((prev) => prev.map(c => c.id === fromId ? { ...c, cards: c.cards.filter(cd => cd.id !== cardId) } : c));
  };

  const filteredColumns = columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => {
      const lowerTerm = searchTerm.trim().toLowerCase();
      if (!lowerTerm) return true;
      const byTitle = card.title.toLowerCase().includes(lowerTerm);
      const byTicket = card.ticket?.toLowerCase().includes(lowerTerm);
      const byLabels = card.labels?.some((label) => label.text.toLowerCase().includes(lowerTerm));
      const byAssignee = card.assignee?.name?.toLowerCase().includes(lowerTerm);
      return byTitle || byTicket || byLabels || Boolean(byAssignee);
    }),
  }));

  return (
    <div className="board">
      {filteredColumns.map(col => (
        <Column
          key={col.id}
          column={col}
          onAdd={(title) => handleAdd(col.id, title)}
          onMove={(cardId, toId) => handleMove(cardId, col.id, toId)}
          onDelete={(cardId) => handleDelete(cardId, col.id)}
          allColumns={columns}
        />
      ))}
    </div>
  );
};

export default Board;
