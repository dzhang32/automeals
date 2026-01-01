import { useDroppable } from "@dnd-kit/core";

interface CalendarProps {
  droppableId: string;
  children: React.ReactNode;
  isMobile?: boolean;
  onClick?: () => void;
}

export default function Calendar({
  droppableId,
  children,
  isMobile,
  onClick,
}: CalendarProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: droppableId,
    disabled: isMobile,
  });

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${isOver ? "drop-zone-active" : ""}`}
      onClick={onClick}
      style={{
        cursor: isMobile ? "pointer" : undefined,
      }}
    >
      {children}
    </div>
  );
}
