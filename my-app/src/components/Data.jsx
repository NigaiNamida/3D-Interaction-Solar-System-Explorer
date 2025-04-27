
// Solar system related constants
export const SOLAR_SYSTEM = {

  BASE_SCALE: 0.15,

  CAMERA: {
    DEFAULT_POSITION: { x: 0, y: 15, z: 30 },
    DEFAULT_TARGET: { x: 0, y: 0, z: 0 },
    TRANSITION_DURATION: 1.5,
    TRANSITION_EASE: 'power2.inOut',
  },

  SUN: {
    SIZE_MULTIPLIER: 10,
    ROTATIONAL_SCALE: 0.04,
    CAMERA_OFFSET: { y: 2.5, z: 7.5 },
    HIGHLIGHT_RING: {
      SIZE_MULTIPLIER: 1,
      THICKNESS_MULTIPLIER: 0.1,
      SEGMENTS: {
        RADIAL: 2,
        TUBULAR: 64,
      },
    },
    GEOMETRY_SEGMENTS: 64,
  },

  PLANETS: {

    MERCURY: {
      SIZE_MULTIPLIER: 0.38,
      RADIUS_MULTIPLIER: 45,
      ROTATIONAL_SCALE: 0.017,
      ORBITAL_PERIOD: 88, // days
      INFO: {

        ORBITAL_PERIOD: "88 days",
        ROTATION_PERIOD: "59 days",
        DISTANCE: "57.9 million km",
        DIAMETER: "4,880 km",

      },
    },

    VENUS: {
      SIZE_MULTIPLIER: 0.95,
      RADIUS_MULTIPLIER: 84,
      ROTATIONAL_SCALE: -0.0041, // negative indicates retrograde rotation
      ORBITAL_PERIOD: 224, // days
      INFO: {

        ORBITAL_PERIOD: "224.7 days",
        ROTATION_PERIOD: "243 days",
        DISTANCE: "108.2 million km",
        DIAMETER: "12,104 km",

      },
    },

    EARTH: {

      SIZE_MULTIPLIER: 1,
      RADIUS_MULTIPLIER: 117,
      ROTATIONAL_SCALE: 1,
      ORBITAL_PERIOD: 365, // days
      INFO: {

        ORBITAL_PERIOD: "365.2 days",
        ROTATION_PERIOD: "24 hours",
        DISTANCE: "149.6 million km",
        DIAMETER: "12,742 km",

      },
    },

  },
  PLANET_CAMERA: {
    DISTANCE_MULTIPLIER: 1.5,
    HEIGHT_MULTIPLIER: 0.5,
  },

  PLANET_GEOMETRY: {
    SEGMENTS: 64,
    HIGHLIGHT_RING: {
      SIZE_MULTIPLIER: 1,
      THICKNESS_MULTIPLIER: 0.5,
      SEGMENTS: {

        RADIAL: 2,
        TUBULAR: 64,

      },
    },
  },

  ORBITAL_RING: {
    WIDTH: 0.015,
    OPACITY: 0.25,
    SEGMENTS: {

      RADIAL: 16,
      TUBULAR: 256,
      
    },
  },

};

// Camera controls constants
export const CAMERA_SETTINGS = {
  POSITION: { x: 0, y: 5, z: 30 },
  FOV: 60,
  CONTROLS: {
    ZOOM_SPEED: 1,
    ROTATE_SPEED: 0.5,
    PAN_SPEED: 0.5,
  },
};

// Speed presets
export const SPEED_OPTIONS = [-500, -200, -100, -50, -20, -10, -5, -2, -1, 0, 1, 2, 5, 10, 20, 50, 100, 200, 500];
export const DEFAULT_SPEED = 1;

// Sun info for PlanetInfo component
export const INFO = {
  Sun: {
    ORBITAL_PERIOD: "NA",
    ROTATION_PERIOD: "25-35 days",
    DISTANCE: "NA",
    DIAMETER: "1,392,700 km",
  },
  
  Mercury: {
    ORBITAL_PERIOD: "88 days",
    ROTATION_PERIOD: "59 days",
    DISTANCE: "57.9 million km",
    DIAMETER: "4,880 km",
  },

  Venus: {
    ORBITAL_PERIOD: "224.7 days",
    ROTATION_PERIOD: "243 days",
    DISTANCE: "108.2 million km",
    DIAMETER: "12,104 km",
  },

  Earth: {
    ORBITAL_PERIOD: "365.2 days",
    ROTATION_PERIOD: "24 hours",
    DISTANCE: "149.6 million km",
    DIAMETER: "12,742 km",
  }
};