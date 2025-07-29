import { remarkCodeHike } from "@code-hike/mdx";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/rssm" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/rssm" : "",
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      [remarkCodeHike, { theme: "github-dark", lineNumbers: true }],
    ],
  },
});

export default withMDX(nextConfig);