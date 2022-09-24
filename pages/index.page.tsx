import type { NextPage } from "next";
import Head from "next/head";
import { startTransition, useEffect, useState } from "react";
import { classNames } from "../lib/classNames";
import { syncSleep } from "./api/sleep/syncSleep";

let globalState = 0;
let showCommits = false;

const Home: NextPage = () => {
  const [c, setC] = useState(0);
  const [blocksVisible, setBlocksVisible] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center text-white bg-slate-800 h-full">
      <Head>
        <title>Time slicing visualizer</title>
        <meta
          name="description"
          content="Application that showcases different types of errors in concurrent react"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex gap-4 items-center">
        <button className={buttonCss} onClick={() => setC(c + 1)}>
          Rerender
        </button>
        <button
          className={buttonCss}
          onClick={() => startTransition(() => setC(c + 1))}
        >
          Rerender low prio
        </button>
        <button
          className={buttonCss}
          onClick={() => console.log("Change global state to " + ++globalState)}
        >
          Change global state
        </button>

        <button className={buttonCss} onClick={() => setBlocksVisible(true)}>
          Show Blocks
        </button>

        <button
          className={buttonCss}
          onClick={() => startTransition(() => setBlocksVisible(true))}
        >
          Show Blocks low prio
        </button>

        <button className={buttonCss} onClick={() => setBlocksVisible(false)}>
          Hide Blocks
        </button>

        <label>
          <input
            type="checkbox"
            onChange={(e) => {
              showCommits = e.target.checked;
            }}
          />{" "}
          Show commits
        </label>
      </div>

      <div className="flex h-64 w-full gap-12 p-12 pb-0">
        {blocksVisible && (
          <>
            <SlowBlock index={0} />
            <SlowBlock index={1} />
            <SlowBlock index={2} />
          </>
        )}
      </div>
    </div>
  );
};

const buttonCss = classNames(
  "bg-lime-600 hover:bg-lime-700 active:bg-lime-800 cursor-pointer transition-colors py-2 px-4"
);

function SlowBlock(props: { index: number }) {
  const renderedState = globalState;
  showBlockState("RENDER START", props.index, renderedState);
  syncSleep(2000);
  showBlockState("RENDER END", props.index, renderedState);

  useEffect(() => {
    if (showCommits) {
      showBlockState("COMMIT", props.index, renderedState);
      return () => {
        showBlockState("UNMOUNTED", props.index, renderedState);
      };
    }
  });

  return (
    <div className="w-full flex flex-col items-center justify-center bg-lime-800">
      <h2>Block {props.index}</h2>
      <small>State: {globalState}</small>
    </div>
  );
}

function showBlockState(phase: string, index: number, globalState: number) {
  const blockWidth = 30;
  const state = globalState.toString();
  const content = phase + " state " + state;
  const spacesBeforeState = Math.floor((blockWidth - 2 - content.length) / 2);
  const spacesAfterState = Math.ceil((blockWidth - 2 - content.length) / 2);
  const [a, b, c] = Array(3)
    .fill(0)
    .map((_, i) => [
      "#".repeat(blockWidth),
      "#" + " ".repeat(blockWidth - 2) + "#",
      index !== i
        ? "#" + " ".repeat(blockWidth - 2) + "#"
        : "#" +
          " ".repeat(spacesBeforeState) +
          content +
          " ".repeat(spacesAfterState) +
          "#",
      "#" + " ".repeat(blockWidth - 2) + "#",
      "#".repeat(blockWidth),
    ]);
  console.log(
    "\n" +
      a.map((_, row) => [a[row], b[row], c[row]].join("  ")).join("\n") +
      "\n"
  );
}

export default Home;
