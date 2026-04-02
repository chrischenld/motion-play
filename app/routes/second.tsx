import { motion } from "motion/react";
import { useState } from "react";

const circleClip = "inset(0px round 100px 100px 100px 100px)";

const shapes = [
    {
        id: "orange",
        fill: "#FF7237",
        fClip: "inset(0px round 0px 100px 100px 0px)",
        collapsed: { x: 200, y: 0 },
        expanded: { x: 0, y: 0 },
    },
    {
        id: "red",
        fill: "#FF3737",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 0 },
        expanded: { x: 200, y: 0 },
    },
    {
        id: "purple",
        fill: "#874FFF",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 200 },
        expanded: { x: 400, y: 0 },
    },
    {
        id: "blue",
        fill: "#00B6FF",
        fClip: circleClip,
        collapsed: { x: 200, y: 200 },
        expanded: { x: 600, y: 0 },
    },
    {
        id: "green",
        fill: "#24CB71",
        fClip: "inset(0px round 100px 0px 100px 100px)",
        collapsed: { x: 0, y: 400 },
        expanded: { x: 800, y: 0 },
    },
];

export default function Second() {
    const [expanded, setExpanded] = useState(false);
    const stagger = 0.06;
    const spring = (i: number) => ({
        type: "spring" as const,
        duration: 0.7,
        bounce: 0.18,
        delay: i * stagger,
    });

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                cursor: "pointer",
            }}
            onClick={() => setExpanded((e) => !e)}
        >
            <motion.div
                style={{ position: "relative" }}
                animate={{
                    width: expanded ? 1000 : 400,
                    height: expanded ? 200 : 600,
                }}
                transition={{ type: "spring", duration: 0.7, bounce: 0.18 }}
            >
                {shapes.map((s, i) => (
                    <motion.div
                        key={s.id}
                        animate={{
                            x: expanded ? s.expanded.x : s.collapsed.x,
                            y: expanded ? s.expanded.y : s.collapsed.y,
                            clipPath: expanded ? circleClip : s.fClip,
                        }}
                        transition={spring(i)}
                        style={{
                            position: "absolute",
                            width: 200,
                            height: 200,
                            backgroundColor: s.fill,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}
