import React from "react";

type Card = { id: string; title: string; description?: string };

type CardCompProps = {
  card: { id: string; title: string; description?: string; labels?: { text: string; color?: string }[]; assignee?: { name?: string; initials?: string; color?: string }; ticket?: string };
  columnId: string;
  onMove: (cardId: string, direction: "left" | "right") => void;
  onDelete: () => void;
};

const CardComp: React.FC<CardCompProps> = ({ card, onMove, onDelete }) => {
  return (
    <div className="card">
      <div>
        <div className="card-top">
          <div className="chips">
            {card.labels?.map((l, i) => (
              <span key={i} className="chip" style={{ background: l.color || '#eee' }}>{l.text}</span>
            ))}
          </div>
          <div className="ticket">{card.ticket}</div>
        </div>

        <div className="card-title">{card.title}</div>
      </div>

      <div className="card-actions">
        <button onClick={() => onMove(card.id, "left")} aria-label="move left">◀</button>
        <button onClick={() => onMove(card.id, "right")} aria-label="move right">▶</button>
        <button className="del" onClick={onDelete} aria-label="delete">✕</button>
      </div>
    </div>
  );
};

export default CardComp;
