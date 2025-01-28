import { useDraggable } from "@dnd-kit/core";

export default function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${props.id}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <a
      className="cursor-pointer"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </a>
  );
}
