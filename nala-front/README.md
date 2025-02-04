# Setup

My environment:
`pnpm` (8.15.5)
`node` (20.12)

* I've used `Vite + Typescript + SWC`
* I've implemented MUI with `@mui/styled-engine-sc` as requested [webpack.config.js](./webpack.config.js)
* Tailwindcss to avoid writting css (don't go so far as to unify styles into classes to avoid having long 'classNames')

1. `pnpm add` install deps
2. `pnpm dev` run in hot reload

## Structure

* `components`: each subfolder has visual components (these are in folders in case you had needed to create a context in some)
* `hooks`: custom hooks, also consumption of endpoints and mutations
* `layout`: components to organize the interface using slots or childrens, also for components with contexts such as Notify
* `services` 3th-party vendors or fetch calls (I don't get to move the endpoints of the 'usePositions' hook here)
* `utils`: various utilities (such as the sensors I explain at the end)

# DND Kit

Use the following dependency to manage the drag & drop: https://dndkit.com/

I made use of React Query to manage the obtaining and mutation of the positions.

I didn't have time to implement a backend, but I did it in such a way that to implement the backend on the frontend you only have to modify the specific functions of the file [usePositions](./src/hooks/usePositions.tsx).

I only managed to implement in this way the similarities to: `GET`,`POST`,`PUT`

# Not implemented

* Everything related to employees
* Lines that visually connect positions between tiers
* Tier Name Editing
* Deleting Positions

## Backend

What I was thinking of doing is a server in `NestJS` with `Drizzle` as ORM to have a `SQLite` at the file level and implement it `without Auth` to speed it up.

# Known issues

* When dragging on one position and it passes over another, some elements are superimposed as I would solve: 
    - I would implement a state so that while it is in a dragging state all the elements of the Position have a certain z-index (higher than the others), and when it is dropped, that class is eliminated.

# CustomSensors

To prevent card elements such as inputs and buttons from triggering dragging, implement a data-no-dnd switch in this way to prevent that element from triggering card drag, and apply it to various inputs and other elements. I copied the idea from the following comment:
https://github.com/clauderic/dnd-kit/issues/477#issuecomment-1713536492
