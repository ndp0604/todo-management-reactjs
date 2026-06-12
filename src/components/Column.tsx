import React, { useState } from "react";
import CardComp from "./Card";

type Card = { id: string; title: string; description?: string };
type ColumnType = { id: string; title: string; cards: Card[] };

const Column: React.FC<{
  column: ColumnType;
  onAdd: (title: string) => void;
  onMove: (cardId: string, toId: string) => void;
  onDelete: (cardId: string) => void;
  allColumns: ColumnType[];
}> = ({ column, onAdd, onMove, onDelete, allColumns }) => {
  const [newTitle, setNewTitle] = useState("");

  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="col-badge">{column.cards.length}</span>
      </div>

      {column.title.toUpperCase() === 'TO DO' && (
        <div className="create-placeholder" onClick={() => { const name = prompt('New task title') || ''; if (name) onAdd(name); }}>
          <span className="plus">+</span>
          <span>Create</span>
        </div>
      )}

      <div className="cards">
        {column.cards.map(card => (
          <CardComp
            key={card.id}
            card={card}
            columnId={column.id}
            onMove={(cardId, direction) => {
              const idx = allColumns.findIndex(c => c.id === column.id);
              const targetIdx = direction === "left" ? idx - 1 : idx + 1;
              if (targetIdx < 0 || targetIdx >= allColumns.length) return;
              onMove(cardId, allColumns[targetIdx].id);
            }}
            onDelete={() => onDelete(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
