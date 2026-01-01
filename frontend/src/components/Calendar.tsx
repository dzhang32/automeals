import { useDroppable } from "@dnd-kit/core";

interface CalendarProps {
  droppableId: string;
  children: React.ReactNode;
}

export default function Calendar({ droppableId, children }: CalendarProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${isOver ? "drop-zone-active" : ""}`}
    >
      {children}
    </div>
  );
}
