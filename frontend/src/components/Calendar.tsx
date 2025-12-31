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
      border: "1px dashed #555",
      borderRadius: "3px",
      padding: "4px",
      margin: "2px",
      minHeight: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease",
      fontSize: "0.7rem",
    };

    return (
      <div ref={setNodeRef} style={style}>
        {children}
      </div>
    );
  }

  return <Day />;
}
