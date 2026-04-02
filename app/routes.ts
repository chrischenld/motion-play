import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("b&w", "routes/bw.tsx"),
	route("second", "routes/second.tsx"),
	route("third", "routes/third.tsx"),
	route("fourth", "routes/fourth.tsx"),
] satisfies RouteConfig;
