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
      backgroundColor: isOver ? "rgba(126, 200, 155, 0.15)" : "#1e2433",
      border: isOver ? "1px solid #7ec89b" : "1px solid #2d3548",
      borderRadius: "8px",
      padding: "8px 12px",
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.15s ease, border-color 0.15s ease",
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    );
  }

  return <Day />;
}
