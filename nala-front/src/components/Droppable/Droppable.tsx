import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props: { children: any; id: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${props.id}`,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}
