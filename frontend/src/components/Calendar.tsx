import { useDroppable } from "@dnd-kit/core";

export default function Calendar() {
  function Day({ day }: { day: number }) {
    const { setNodeRef, isOver } = useDroppable({ id: day });
    return <div ref={setNodeRef}>{day}</div>;
  }
  return <Day day={1} />;
}
