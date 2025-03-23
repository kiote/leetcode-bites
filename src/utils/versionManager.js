/**
 * Version manager utility
 * Implements consistent semantic versioning (major.minor.patch)
 */

// Default starting version - will be used if no other version source is available
const DEFAULT_VERSION = '0.0.3';

// Parse a version string into components
const parseVersion = (versionString) => {
  const parts = versionString.split('.');
  return {
    major: parseInt(parts[0], 10) || 0,
    minor: parseInt(parts[1], 10) || 0,
    patch: parseInt(parts[2], 10) || 0
  };
};

// Format version components back to string
const formatVersion = ({ major, minor, patch }) => {
  return `${major}.${minor}.${patch}`;
};

/**
 * Gets the application version from build-time sources
 * This ensures all users see the same version
 */
export const getAppVersion = () => {
  // Try environment variables first (set during build)
  if (process.env.REACT_APP_VERSION) {
    return process.env.REACT_APP_VERSION;
  }
  
  if (process.env.VITE_APP_VERSION) {
    return process.env.VITE_APP_VERSION;
  }
  
  // For webpack/vite, you can expose the package.json version at build time
  if (process.env.npm_package_version) {
    return process.env.npm_package_version;
  }
  
  // When running in development, you might be able to directly import package.json
  // This may need specific bundler configuration
  try {
    // This is just an example - actual implementation depends on your bundler
    // const packageJson = require('../../../package.json');
    // if (packageJson.version) {
    //   return packageJson.version;
    // }
  } catch (e) {
    console.debug('Could not load version from package.json', e);
  }
  
  // Hard-coded fallback version for development environments
  return DEFAULT_VERSION;
};

/**
 * Version utility functions for build/CI systems
 * These are NOT used in the browser - they're for build scripts only
 */

// Generate version string with incremented major version
export const nextMajorVersion = (currentVersion = DEFAULT_VERSION) => {
  const parsed = parseVersion(currentVersion);
  return formatVersion({
    major: parsed.major + 1,
    minor: 0,
    patch: 0
  });
};

// Generate version string with incremented minor version
export const nextMinorVersion = (currentVersion = DEFAULT_VERSION) => {
  const parsed = parseVersion(currentVersion);
  return formatVersion({
    major: parsed.major,
    minor: parsed.minor + 1,
    patch: 0
  });
};

// Generate version string with incremented patch version
export const nextPatchVersion = (currentVersion = DEFAULT_VERSION) => {
  const parsed = parseVersion(currentVersion);
  return formatVersion({
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch + 1
  });
};
