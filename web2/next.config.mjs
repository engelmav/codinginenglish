
import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

const baseConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async redirects() {
    return [
      {
        source: "/es",
        destination: "/",
        permanent: true,
      },
    ];
  },
};


/** @type {import('next').NextConfig} */
const mdxConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
}


const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})


export default withMDX({ ...baseConfig, ...mdxConfig })

