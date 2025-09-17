import { useDroppable } from "@dnd-kit/core";

export default function Calendar(props: any) {
  function Day(props: any) {
    const { isOver, setNodeRef } = useDroppable({
      id: "meal-planner",
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
        {props.children}
      </div>
    );
  }

  return <Day {...props} />;
}
