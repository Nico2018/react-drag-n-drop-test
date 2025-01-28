import {
  Autocomplete,
  Badge,
  Card,
  CardContent,
  FormControl,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Check, Save, Delete } from "@mui/icons-material";
import { useRef, useState } from "react";

const options = [
  { label: "gerencia", id: 1 },
  { label: "marketing", id: 2 },
];

export default function Position(props: {
  tier: number;
  defaultTitle?: string;
  defaultDivision?: string;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [positionTitle, setPositionTitle] = useState(
    props.defaultTitle || "New Position"
  );
  const [editingDivision, setEditingDivision] = useState(
    props.defaultDivision ? false : true
  );
  const [division, setDivision] = useState<string | null>(
    props.defaultDivision || null
  );
  const titleEditRef = useRef<{ children: HTMLInputElement[] } | null>(null);

  const applyChanges = () => {
    console.log("apply");
  };
  const deletePosition = () => {
    console.log("delete");
  };

  return (
    <Card sx={{ minWidth: 275, maxWidth: 325 }}>
      <CardContent>
        <div className="flex w-full h-4 justify-end">
          <Badge
            className="m-2"
            badgeContent={props.tier}
            color="primary"
          ></Badge>
        </div>
        <div className="flex items-center justify-between min-h-20">
          {editingTitle ? (
            <>
              <FormControl
                data-no-dnd
                variant="standard"
                sx={{ m: 1, mt: 3, width: "25ch" }}
              >
                <Input
                  ref={titleEditRef}
                  defaultValue={positionTitle}
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    "aria-label": "weight",
                  }}
                />
              </FormControl>
              <Check
                data-no-dnd
                className="cursor-pointer"
                onClick={() => {
                  setPositionTitle(
                    titleEditRef.current?.children[0].value as string
                  );
                  setEditingTitle(false);
                }}
              />
            </>
          ) : (
            <>
              <Typography
                className="w-full text-center"
                variant="h5"
                component="div"
              >
                {positionTitle}
              </Typography>
              <Edit
                data-no-dnd
                className="cursor-pointer"
                onClick={() => {
                  setEditingTitle(true);
                }}
              />
            </>
          )}
        </div>
        <Typography
          data-no-dnd
          className="underline cursor-pointer max-w-fit"
          variant="subtitle1"
          gutterBottom
        >
          0 employees
        </Typography>
        <div className="flex w-full items-center justify-between">
          {editingDivision || !division ? (
            <>
              <Autocomplete
                data-no-dnd
                disablePortal
                options={options}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setDivision(newValue.label);
                  }
                }}
                sx={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="Division..." />
                )}
              />
              {division && (
                <Check
                  data-no-dnd
                  className="cursor-pointer"
                  onClick={() => {
                    setEditingDivision(false);
                  }}
                />
              )}
            </>
          ) : (
            <>
              <Typography
                className="w-full text-center"
                variant="h6"
                gutterBottom
              >
                {division!}
              </Typography>
              <Edit
                data-no-dnd
                className="cursor-pointer"
                onClick={() => {
                  setDivision(null);
                  setEditingDivision(true);
                }}
              />
            </>
          )}
        </div>

        <div className="w-full flex justify-end gap-5 mt-4">
          <Save data-no-dnd className="cursor-pointer" onClick={applyChanges} />
          <Delete
            data-no-dnd
            className="cursor-pointer"
            onClick={deletePosition}
          />
        </div>
      </CardContent>
    </Card>
  );
}
