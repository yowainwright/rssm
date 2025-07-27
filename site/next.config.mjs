import { remarkCodeHike } from "@code-hike/mdx";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      [remarkCodeHike, { theme: "github-dark", lineNumbers: true }],
    ],
  },
});

export default withMDX(nextConfig);