import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { NotifyContext } from "../layout/Notify/NotifyContext";

export interface IPosition {
  id: number;
  tier?: number;
  title?: string;
  division?: string;
}

export interface ITier {
  tier: number;
  positions: IPosition[] & { onSave?: any; onDelete?: any };
}

async function getPositions(): Promise<IPosition[]> {
  const positions = localStorage.getItem("positions");
  if (!positions) {
    localStorage.setItem("positions", JSON.stringify([]));
    return [];
  }
  return JSON.parse(positions);
}

async function postPosition({
  id,
  tier,
  title,
  division,
}: {
  id: number;
  tier: number;
  title: string;
  division: string;
}) {
  const positions = await getPositions();
  const newPosition = { id, tier, title, division };
  positions.push(newPosition);
  localStorage.setItem("positions", JSON.stringify(positions));
  return newPosition;
}

async function putPosition(position: IPosition) {
  const positions = (await getPositions()).map((p) =>
    p.id === position.id ? { ...p, ...position } : p
  );
  localStorage.setItem("positions", JSON.stringify(positions));
  return position;
}

export default function usePositions() {
  const queryClient = useQueryClient();
  const triggerNotification = useContext(NotifyContext);

  const positions = useQuery<any>({
    queryKey: ["positions"],
    queryFn: getPositions,
  });

  const create = useMutation({
    mutationFn: postPosition,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      triggerNotification("Position created", "success");
    },
  });

  const update = useMutation({
    mutationFn: putPosition,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      triggerNotification("Position updated", "success");
    },
  });

  return [positions, create, update];
}
