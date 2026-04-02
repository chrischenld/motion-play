import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { useState } from "react";

const circleClip = "inset(0px round 100px 100px 100px 100px)";

const shapes = [
    {
        id: "orange",
        fill: "#FF7237",
        fClip: "inset(0px round 0px 100px 100px 0px)",
        collapsed: { x: 200, y: 0 },
        expandedBaseX: 0,
    },
    {
        id: "red",
        fill: "#FF3737",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 0 },
        expandedBaseX: 200,
    },
    {
        id: "purple",
        fill: "#874FFF",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 200 },
        expandedBaseX: 400,
    },
    {
        id: "blue",
        fill: "#00B6FF",
        fClip: circleClip,
        collapsed: { x: 200, y: 200 },
        expandedBaseX: 600,
    },
    {
        id: "green",
        fill: "#24CB71",
        fClip: "inset(0px round 100px 0px 100px 100px)",
        collapsed: { x: 0, y: 400 },
        expandedBaseX: 800,
    },
];

const CURSOR_SPRING = { mass: 0.1, damping: 16, stiffness: 71 };
const MODE_SPRING = { type: "spring" as const, duration: 0.7, bounce: 0.18 };
const SIGMA = 200;
const ATTRACTION = 0.45;
const REST_X = -2000;

function Shape({
    shape,
    cursorX,
    mode,
    expanded,
}: {
    shape: (typeof shapes)[number];
    cursorX: MotionValue<number>;
    mode: MotionValue<number>;
    expanded: boolean;
}) {
    const x = useTransform([cursorX, mode], ([cx, m]: number[]) => {
        const delta = cx - shape.expandedBaseX;
        const gaussian = Math.exp(-(delta * delta) / (2 * SIGMA * SIGMA));
        const expandedX = shape.expandedBaseX + delta * gaussian * ATTRACTION;
        return shape.collapsed.x + (expandedX - shape.collapsed.x) * m;
    });

    const y = useTransform(mode, (m: number) => {
        return shape.collapsed.y * (1 - m);
    });

    return (
        <motion.div
            style={{
                position: "absolute",
                width: 200,
                height: 200,
                backgroundColor: shape.fill,
                x,
                y,
            }}
            animate={{ clipPath: expanded ? circleClip : shape.fClip }}
            transition={MODE_SPRING}
        />
    );
}

export default function Third() {
    const [expanded, setExpanded] = useState(false);
    const rawX = useMotionValue(REST_X);
    const cursorX = useSpring(rawX, CURSOR_SPRING);
    const mode = useSpring(0, { duration: 0.7, bounce: 0.18 });

    const toggle = () => {
        const next = !expanded;
        setExpanded(next);
        mode.set(next ? 1 : 0);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                cursor: "pointer",
            }}
            onClick={toggle}
        >
            <motion.div
                style={{ position: "relative" }}
                animate={{
                    width: expanded ? 1000 : 400,
                    height: expanded ? 200 : 600,
                }}
                transition={MODE_SPRING}
                onPointerMove={(e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    rawX.set(e.clientX - bounds.left);
                }}
                onPointerLeave={() => rawX.set(REST_X)}
            >
                {shapes.map((s) => (
                    <Shape
                        key={s.id}
                        shape={s}
                        cursorX={cursorX}
                        mode={mode}
                        expanded={expanded}
                    />
                ))}
            </motion.div>
        </div>
    );
}
