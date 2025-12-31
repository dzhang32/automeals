import { useDroppable } from "@dnd-kit/core";

interface CalendarProps {
  droppableId: string;
  children: React.ReactNode;
}

export default function Calendar({ droppableId, children }: CalendarProps) {
  function Day() {
    const { isOver, setNodeRef } = useDroppable({
      id: droppableId,
    });

    const style = {
      backgroundColor: isOver ? "#1a3a5c" : "#2d2d2d",
      border: isOver ? "2px solid #4a90d9" : "2px dashed #555",
      borderRadius: "8px",
      padding: "12px",
      minHeight: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    );
  }

  return <Day />;
}
