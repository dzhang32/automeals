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
      backgroundColor: isOver ? "#e3f2fd" : "#f5f5f5",
      border: "2px dashed #ccc",
      borderRadius: "8px",
      padding: "20px",
      margin: "20px",
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease",
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    );
  }

  return <Day />;
}
