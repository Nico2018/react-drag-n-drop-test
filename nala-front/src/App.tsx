import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { DndContext } from "@dnd-kit/core";

import Position from "./components/Position/Position";
import Draggable from "./components/Draggable/Draggable";
import Droppable from "./components/Droppable/Droppable";
import { MouseSensor, TouchSensor } from "./utils/CustomSensors";

const queryClient = new QueryClient();

export default function App() {
  const tiers = [
    {
      tier: 1,
      key: `draggable-1`,
      draggable: (
        <Draggable key={`draggable-1`} id="1">
          <Position tier={1} />
        </Draggable>
      ),
    },
    {
      tier: 1,
      key: `draggable-2`,
      draggable: (
        <Draggable key={`draggable-2`} id="2">
          <Position tier={1} />
        </Draggable>
      ),
    },
    {
      tier: 2,
      key: `draggable-3`,
      draggable: (
        <Draggable key={`draggable-3`} id="3">
          <Position tier={2} />
        </Draggable>
      ),
    },
  ];

  const tiersWithDynamicTier = tiers.map((tierObj) => ({
    ...tierObj,
    draggable: (
      <Draggable key={tierObj.key} id={tierObj.tier.toString()}>
        <Position tier={tierObj.tier} />
      </Draggable>
    ),
  }));

  const tier_one = [
    <Draggable key={`draggable-1`} id="1">
      <Position tier={1} />
    </Draggable>,
    <Draggable key={`draggable-2`} id="2">
      <Position tier={1} />
    </Draggable>,
  ];
  const tier_two = [
    <Draggable key={`draggable-3`} id="3">
      <Position tier={2} />
    </Draggable>,
  ];

  const handleDragEnd = (event: any) => {
    console.log(event);

    /* if (event.over && event.over.id) {
    } */
  };

  const sensors: any[] = [
    { sensor: MouseSensor, options: {} },
    { sensor: TouchSensor, options: {} },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-15">
          <Droppable id={"1"}>
            <div className="flex gap-15">{...tier_one}</div>
          </Droppable>
          <Droppable id={"2"}>
            <div className="flex gap-15">{...tier_two}</div>
          </Droppable>
        </div>
      </DndContext>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
