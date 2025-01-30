import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { DndContext } from "@dnd-kit/core";

import Position from "./components/Position/Position";
import Draggable from "./components/Draggable/Draggable";
import Droppable from "./components/Droppable/Droppable";
import { MouseSensor, TouchSensor } from "./utils/CustomSensors";

const queryClient = new QueryClient();

interface IPosition {
  id: number;
}

interface ITier {
  tier: number;
  positions: IPosition[];
}

export default function App() {
  const [tiers, setTiers] = useState<ITier[]>([
    { tier: 1, positions: [{ id: 1 }, { id: 2 }] },
    { tier: 2, positions: [{ id: 3 }] },
    { tier: 3, positions: [{ id: 4 }] },
  ]);

  const displayTiers = useMemo(() => tiers.map((t) => t), [tiers]);

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id && event.active && event.active.id) {
      const tierId = Number(
        event.over.id.substr(event.over.id.lastIndexOf("-") + 1)
      );
      const positionId = Number(
        event.active.id.substr(event.active.id.lastIndexOf("-") + 1)
      );

      console.log(`Tier Dropped: ${tierId},  Position Dragged: ${positionId}`);

      const positionPresent = tiers
        .find((tier) => tier.tier === tierId)
        ?.positions.find((position) => position.id === positionId);

      if (!positionPresent) {
        const position = tiers
          .flatMap((t) => t.positions)
          .find((position) => position.id === positionId);

        console.log(position);

        const newTiers = tiers.map((tier) => ({
          tier: tier.tier,
          positions: tier.positions.filter((p) => p.id !== positionId),
        }));

        newTiers
          .find((tier) => tier.tier === tierId)
          ?.positions.push(position as IPosition);

        setTiers(newTiers);
      }
    }
  };

  const sensors: any[] = [
    { sensor: MouseSensor, options: {} },
    { sensor: TouchSensor, options: {} },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-15">
          {displayTiers.map((tier: ITier) => (
            <Droppable key={`tier-${tier.tier}`} id={tier.tier}>
              <div className="flex gap-15">
                {tier.positions.map((position: IPosition) => (
                  <Draggable key={`draggable-${position.id}`} id={position.id}>
                    <Position tier={tier.tier} />
                  </Draggable>
                ))}
              </div>
            </Droppable>
          ))}
        </div>
      </DndContext>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
