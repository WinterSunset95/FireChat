




/** @type {import('next').NextConfig} */
//const nextConfig = {
//  reactStrictMode: true,
//  swcMinify: true,
//}
//
//module.exports = nextConfig
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // next.js config
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	}
})
