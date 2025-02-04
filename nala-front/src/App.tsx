import "./App.css";
import { useEffect, useMemo, useState } from "react";

import { DndContext } from "@dnd-kit/core";

import Position from "./components/Position/Position";
import Draggable from "./components/Draggable/Draggable";
import Droppable from "./components/Droppable/Droppable";
import { MouseSensor, TouchSensor } from "./utils/CustomSensors";
import { Add } from "@mui/icons-material";
import usePositions, { IPosition, ITier } from "./hooks/usePositions";
import { Typography } from "@mui/material";

export default function App() {
  const [positions, create, update] = usePositions();

  const [tiers, setTiers] = useState<ITier[]>([]);

  useEffect(() => {
    if (positions.data) {
      const existingTiers = positions.data?.map((p: IPosition) => p.tier);

      const cleanTiers: number[] = [];

      existingTiers.forEach((tier: number) => {
        if (!cleanTiers.includes(tier)) {
          cleanTiers.push(tier);
        }
      });

      const newTiers = cleanTiers.map((tier) => ({
        tier,
        positions: positions.data
          ?.filter((p: IPosition) => p.tier === tier)
          .map((p: IPosition) => ({
            ...p,
            onUpdate: update,
            onDelete: () => {
              console.log("pending implementation");
            },
          })),
      }));

      const findMissingTiers = (newTiers: any) => {
        if (newTiers.length === 0) return [];

        const ids = newTiers.map((t: any) => t.tier);

        const maxId = Math.max(...ids);

        const missingIds = [];

        for (let i = 1; i <= maxId; i++) {
          if (!ids.includes(i)) {
            missingIds.push(i);
          }
        }

        return missingIds;
      };

      const missingTiers = findMissingTiers(newTiers);

      missingTiers.forEach((missingTier) => {
        newTiers.push({ tier: missingTier, positions: [] });
      });

      newTiers.sort((tierA, tierB) => tierA.tier - tierB.tier);

      const defaultTier = [
        {
          tier: 1,
          positions: [
            {
              id: 1,
              onSave: create,
              onDelete: () => {
                console.log("pending implementation");
              },
            },
          ],
        },
      ];
      if (newTiers.length) {
        setTiers(newTiers);
      } else {
        setTiers(defaultTier);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions.data]);

  const displayTiers = useMemo(() => tiers.map((t) => t), [tiers]);

  const addPosition = (destinyTier: number) => {
    const positions = tiers.flatMap((tier) => tier.positions);
    let greatestId = 1;
    positions.forEach((position) => {
      if (position.id > greatestId) {
        greatestId = position.id;
      }
    });
    const newPosition = {
      id: greatestId + 1,
      onSave: create,
      onDelete: () => {
        console.log("pending implementation");
      },
    };

    const newTiers = [...tiers];
    newTiers.forEach((tier) => {
      if (tier.tier === destinyTier) {
        tier.positions.push(newPosition);
      }
    });

    setTiers(newTiers);
  };

  const addTier = () => {
    let greatestTierId = 1;
    tiers.forEach((t) => {
      if (t.tier > greatestTierId) {
        greatestTierId = t.tier;
      }
    });
    setTiers((t) => [...t, { tier: greatestTierId + 1, positions: [] }]);
  };

  const handleDragEnd = (event: any) => {
    if (event.over && event.over.id && event.active && event.active.id) {
      const tierId = Number(
        event.over.id.substr(event.over.id.lastIndexOf("-") + 1)
      );
      const positionId = Number(
        event.active.id.substr(event.active.id.lastIndexOf("-") + 1)
      );

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

  const AddPosition = (props: any) => (
    <div className="flex justify-center mt-2">
      <div
        onClick={() => {
          addPosition(props.destinyTier);
        }}
        data-no-dnd
        className="rounded-full w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-sky-500/90"
      >
        <Add className="text-white" />
      </div>
    </div>
  );

  const AddTier = () => (
    <div className="flex justify-center scale-75 cursor-pointer">
      <div
        onClick={() => {
          addTier();
        }}
        className="rounded-full w-[1.75rem] h-[1.75rem] flex justify-center items-center bg-[#1978d8]"
      >
        <Add className="text-white" />
      </div>
    </div>
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col tiers-container">
        {displayTiers.map((tier: ITier) => (
          <Droppable key={`tier-${tier.tier}`} id={tier.tier}>
            <div className="flex gap-15 h-[302px] mt-[1rem] mb-[1rem] tier">
              <div className="bg-[#ababb3] p-[1rem] mt-[-0.75rem] mb-[-0.75rem] flex gap-2 justify-center tier-title">
                <AddTier />
                <Typography
                  className="text-white shadow-2xs"
                  variant="subtitle1"
                  gutterBottom
                >
                  TIER {tier.tier}
                </Typography>
              </div>
              {tier.positions.map((position: any) => (
                <Draggable key={`draggable-${position.id}`} id={position.id}>
                  <Position
                    id={position.id}
                    onSave={position.onSave ? position.onSave : undefined}
                    onUpdate={position.onUpdate ? position.onUpdate : undefined}
                    onDelete={position.onDelete}
                    tier={tier.tier}
                    defaultDivision={
                      position.division ? position.division : undefined
                    }
                    defaultTitle={position.title}
                  />
                  <AddPosition destinyTier={tier.tier} />
                </Draggable>
              ))}
            </div>
          </Droppable>
        ))}
      </div>
    </DndContext>
  );
}
