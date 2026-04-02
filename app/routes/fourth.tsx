import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { useRef, useState } from "react";

const BASE_SIZE = 200;
const MAX_EXTRA = 40;
const DOCK_INFLUENCE = 300;

const circleClip = "inset(0px round 100px 100px 100px 100px)";

const shapes = [
    {
        id: "orange",
        fill: "#FF7237",
        fClip: "inset(0px round 0px 100px 100px 0px)",
        collapsed: { x: 200, y: 0 },
        expandedIndex: 0,
    },
    {
        id: "red",
        fill: "#FF3737",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 0 },
        expandedIndex: 1,
    },
    {
        id: "purple",
        fill: "#874FFF",
        fClip: "inset(0px round 100px 0px 0px 100px)",
        collapsed: { x: 0, y: 200 },
        expandedIndex: 2,
    },
    {
        id: "blue",
        fill: "#00B6FF",
        fClip: circleClip,
        collapsed: { x: 200, y: 200 },
        expandedIndex: 3,
    },
    {
        id: "green",
        fill: "#24CB71",
        fClip: "inset(0px round 100px 0px 100px 100px)",
        collapsed: { x: 0, y: 400 },
        expandedIndex: 4,
    },
];

function DockCircle({
    shape,
    index,
    expanded,
    mouseX,
    dockHovered,
}: {
    shape: (typeof shapes)[0];
    index: number;
    expanded: boolean;
    mouseX: MotionValue<number>;
    dockHovered: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return DOCK_INFLUENCE;
        return val - (rect.x + rect.width / 2);
    });

    const targetSize = useTransform(distance, (d) => {
        if (!expanded || !dockHovered) return BASE_SIZE;
        const clamped = Math.max(-DOCK_INFLUENCE, Math.min(DOCK_INFLUENCE, d));
        return (
            BASE_SIZE +
            MAX_EXTRA * Math.cos((clamped / DOCK_INFLUENCE) * (Math.PI / 2)) ** 12
        );
    });

    const size = useSpring(targetSize, {
        mass: 0.1,
        stiffness: 320,
        damping: 20,
    });

    const clipRadius = useTransform(size, (s) => `inset(0px round ${s / 2}px)`);
    const yOffset = useTransform(size, (s) => -(s - BASE_SIZE));

    const spring = {
        type: "spring" as const,
        duration: 0.7,
        bounce: 0.18,
        delay: index * 0.06,
    };

    const expandedX = shape.expandedIndex * BASE_SIZE;

    return (
        <motion.div
            ref={ref}
            layout
            animate={{
                x: expanded ? expandedX : shape.collapsed.x,
                y: expanded ? 0 : shape.collapsed.y,
            }}
            transition={spring}
            style={{
                position: "absolute",
                width: expanded ? size : BASE_SIZE,
                height: expanded ? size : BASE_SIZE,
                y: expanded ? yOffset : undefined,
                clipPath: expanded ? clipRadius : shape.fClip,
                backgroundColor: shape.fill,
                willChange: "width, height, clip-path",
            }}
        />
    );
}

export default function Fourth() {
    const [expanded, setExpanded] = useState(false);
    const [dockHovered, setDockHovered] = useState(false);
    const mouseX = useMotionValue(0);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                minHeight: "100vh",
                paddingBottom: "10vh",
                cursor: "pointer",
            }}
            onClick={() => setExpanded((e) => !e)}
        >
            <motion.div
                style={{ position: "relative" }}
                animate={{
                    width: expanded ? shapes.length * BASE_SIZE : 400,
                    height: expanded ? BASE_SIZE : 600,
                }}
                transition={{ type: "spring", duration: 0.7, bounce: 0.18 }}
                onMouseMove={(e) => expanded && mouseX.set(e.clientX)}
                onMouseEnter={() => expanded && setDockHovered(true)}
                onMouseLeave={() => {
                    setDockHovered(false);
                    mouseX.set(0);
                }}
            >
                {shapes.map((s, i) => (
                    <DockCircle
                        key={s.id}
                        shape={s}
                        index={i}
                        expanded={expanded}
                        mouseX={mouseX}
                        dockHovered={dockHovered}
                    />
                ))}
            </motion.div>
        </div>
    );
}
