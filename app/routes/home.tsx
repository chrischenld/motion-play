import { motion } from "motion/react";
import { useState, useEffect } from "react";

type ShapeId = "red" | "orange" | "purple" | "blue" | "green";

const shapes: {
  id: ShapeId;
  clipD: string;
  xOffset: number;
  origin: string;
  fill: string;
  rectY: number;
  hitBox: [number, number, number, number];
  order: number;
  noScaleX?: boolean;
}[] = [
    { id: "red", clipD: "M0 100C0 155.228 44.772 200 100 200H200V0H100C44.772 0 0 44.772 0 100Z", xOffset: 100, origin: "right center", fill: "#FF3737", rectY: 0, hitBox: [0, 0, 200, 200], order: 0 },
    { id: "orange", clipD: "M200 0V200H300C355.228 200 400 155.228 400 100C400 44.772 355.228 0 300 0H200Z", xOffset: -100, origin: "left center", fill: "#FF7237", rectY: 0, hitBox: [200, 0, 200, 200], order: 1 },
    { id: "purple", clipD: "M0 300C0 355.228 44.772 400 100 400H200V200H100C44.772 200 0 244.772 0 300Z", xOffset: 100, origin: "right center", fill: "#874FFF", rectY: 200, hitBox: [0, 200, 200, 200], order: 2 },
    { id: "blue", clipD: "M299.168 400C354.396 400 399.168 355.228 399.168 300C399.168 244.772 354.396 200 299.168 200C243.94 200 199.168 244.772 199.168 300C199.168 355.228 243.94 400 299.168 400Z", xOffset: -100, origin: "left center", fill: "#00B6FF", rectY: 200, hitBox: [199, 200, 201, 200], order: 3, noScaleX: true },
    { id: "green", clipD: "M0 500C0 444.772 44.772 400 100 400H200V500C200 555.228 155.228 600 100 600C44.772 600 0 555.228 0 500Z", xOffset: 100, origin: "right center", fill: "#24CB71", rectY: 400, hitBox: [0, 400, 200, 200], order: 4 },
  ];

export default function Home() {
  const stagger = 0.1;
  const [hovered, setHovered] = useState<ShapeId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), stagger * 4 * 1000 + 850);
    return () => clearTimeout(timer);
  }, []);

  const enterSpring = (i: number) => ({
    type: "spring" as const, duration: 0.85, bounce: 0.35, delay: i * stagger,
  });
  const hoverSpring = { type: "spring" as const, duration: 0.5, bounce: 0.2 };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", overflow: "visible" }}>
      <svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>
        <defs>
          {shapes.map((s) => (
            <clipPath id={`clip-${s.id}`} key={s.id}>
              <motion.path
                d={s.clipD}
                initial={{ x: s.xOffset, ...(!s.noScaleX && { scaleX: 0 }) }}
                animate={hovered === s.id
                  ? { x: s.xOffset, ...(!s.noScaleX && { scaleX: 0 }) }
                  : { x: 0, ...(!s.noScaleX && { scaleX: 1 }) }}
                transition={mounted ? hoverSpring : enterSpring(s.order)}
                style={{ transformOrigin: s.origin }}
              />
            </clipPath>
          ))}
        </defs>
        {shapes.map((s) => (
          <motion.rect
            key={s.id}
            x="-100" y={s.rectY} width="600" height="200"
            fill={s.fill}
            clipPath={`url(#clip-${s.id})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={mounted ? hoverSpring : enterSpring(s.order)}
          />
        ))}
        {shapes.map((s) => (
          <rect
            key={`hit-${s.id}`}
            x={s.hitBox[0]} y={s.hitBox[1]}
            width={s.hitBox[2]} height={s.hitBox[3]}
            fill="transparent"
            onMouseEnter={() => mounted && setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>
    </div>
  );
}
