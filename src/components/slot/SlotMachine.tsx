import { Divider, IconButton } from "@mui/material";
import "./SlotMachine.css";

import SpinIcon from "@mui/icons-material/Cached";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDistinctRandomValues } from "../../helper/getDistinctRandomValues";
import { lerp } from "../../helper/lerp";

const icons = ["🍌", "🍆", "🥕", "🥒", "🍒", "🍍", "🫐", "🦴", "🧄"];
const bet = 50;

export const SlotMachine = () => {
  const columns = useRef<{ icon: string; delay: number }[][]>([]);
  const timeouts = useRef<number[]>([]);
  const hasPlayed = useRef(false);
  const [iconsToShow, setIconsToShow] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [balance, setBalance] = useState(1000);
  const [win, setWin] = useState<{ icon: string; win: number }>();

  useEffect(() => {
    columns.current = [
      getDistinctRandomValues(icons, icons.length).map((i) => ({
        icon: i,
        delay: 400,
      })),
      getDistinctRandomValues(icons, icons.length).map((i) => ({
        icon: i,
        delay: 400,
      })),
      getDistinctRandomValues(icons, icons.length).map((i) => ({
        icon: i,
        delay: 400,
      })),
    ];

    setIconsToShow(() => {
      const rndIdx = Math.floor(Math.random() * icons.length);

      return [
        [
          columns.current[0][rndIdx].icon,
          columns.current[0][(rndIdx + 1) % icons.length].icon,
          columns.current[0][(rndIdx + 2) % icons.length].icon,
        ],
        [
          columns.current[1][rndIdx].icon,
          columns.current[1][(rndIdx + 1) % icons.length].icon,
          columns.current[1][(rndIdx + 2) % icons.length].icon,
        ],
        [
          columns.current[2][rndIdx].icon,
          columns.current[2][(rndIdx + 1) % icons.length].icon,
          columns.current[2][(rndIdx + 2) % icons.length].icon,
        ],
      ];
    });
  }, []);

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  useEffect(() => {
    if (spinning.some((s) => s) || !hasPlayed.current) {
      return;
    }
    // row win
    for (let i = 0; i < iconsToShow[0].length; i++) {
      if (
        iconsToShow[0][i] === iconsToShow[1][i] &&
        iconsToShow[0][i] === iconsToShow[2][i]
      ) {
        const win = 10 * bet;
        setWin({ icon: iconsToShow[0][i], win });
        setBalance((b) => b + win);
        return;
      }
    }
    // diagonal win
    if (
      (iconsToShow[0][0] === iconsToShow[1][1] &&
        iconsToShow[0][0] === iconsToShow[2][2]) ||
      (iconsToShow[2][0] === iconsToShow[1][1] &&
        iconsToShow[2][0] === iconsToShow[0][2])
    ) {
      const win = 4 * bet;
      setWin({ icon: iconsToShow[1][1], win });
      setBalance((b) => b + win);
      return;
    }
    // 1 per column win
    for (const icon of iconsToShow[0]) {
      if (iconsToShow[1].includes(icon) && iconsToShow[2].includes(icon)) {
        const win = 1.5 * bet;
        setWin({ icon, win });
        setBalance((b) => b + win);
        return;
      }
    }
  }, [spinning, iconsToShow]);

  const spin = useCallback(() => {
    if (spinning.some((s) => s)) return;
    hasPlayed.current = true;
    setWin(undefined);
    setSpinning([true, true, true]);
    setBalance((b) => b - bet);

    const spinColumn = (
      columnIdx: number,
      duration: number,
      startSpeed: number,
      endSpeed: number
    ) => {
      let elapsed = 0;

      const animate = () => {
        if (elapsed >= duration) {
          timeouts.current.splice(columnIdx, 1);
          setSpinning((prev) => {
            const copy = prev.slice();
            copy[columnIdx] = false;
            return copy;
          });
          return;
        }

        setIconsToShow((prev) => {
          const newIconsToShow = prev.slice();
          const firstIconIdx = columns.current[columnIdx].findIndex(
            (c) => c.icon === prev[columnIdx][0]
          );

          newIconsToShow[columnIdx] = [
            columns.current[columnIdx][(firstIconIdx + 1) % icons.length].icon,
            columns.current[columnIdx][(firstIconIdx + 2) % icons.length].icon,
            columns.current[columnIdx][(firstIconIdx + 3) % icons.length].icon,
          ];

          return newIconsToShow;
        });

        elapsed += 100;
        const progress = elapsed / duration;
        const nextDelay = lerp(startSpeed, endSpeed, progress);

        columns.current[columnIdx][0].delay = nextDelay * 2;
        timeouts.current[columnIdx] = setTimeout(animate, nextDelay);
      };

      animate();
    };

    spinColumn(0, Math.floor(Math.random() * 750) + 500, 50, 200);
    spinColumn(1, Math.floor(Math.random() * 1100) + 850, 50, 350);
    spinColumn(2, Math.floor(Math.random() * 1450) + 1200, 50, 500);
  }, [columns, spinning]);

  return (
    <div className="machine">
      <h1 className="title">Food Fortune</h1>
      <div className="panel">
        {iconsToShow.map((column, i) => (
          <div key={i} style={{ display: "flex" }}>
            <div
              key={i}
              className={`panel-column ${spinning[i] ? "spinning" : ""}`}
              style={{
                animationDuration: `${columns.current[i][0].delay / 1000}s`,
              }}
            >
              {column.map((iconTS) => (
                <p
                  key={iconTS}
                  className={`${win?.icon === iconTS ? "won" : ""}`}
                >
                  {iconTS}
                </p>
              ))}
            </div>
            {i !== iconsToShow.length - 1 && <Divider orientation="vertical" />}
          </div>
        ))}
      </div>
      <IconButton className="spin-btn" onClick={spin} disabled={balance < 50}>
        <SpinIcon />
      </IconButton>
      <span className="balance-text">Guthaben: {balance}</span>
      {win?.win && <span className="win-text">{win.win},00</span>}
    </div>
  );
};
