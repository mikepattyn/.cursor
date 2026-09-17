import type { NextConfig } from 'next';

const deploymentMode = process.env.DEPLOYMENT_MODE ?? 'node-server';

if (deploymentMode !== 'static-export' && deploymentMode !== 'node-server') {
  throw new Error('DEPLOYMENT_MODE must be static-export or node-server');
}

const nextConfig: NextConfig = {
  output: deploymentMode === 'static-export' ? 'export' : undefined,
  trailingSlash: deploymentMode === 'static-export',
};

export default nextConfig;
