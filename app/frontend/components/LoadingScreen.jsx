"use client";

import { MantineProvider, Loader, createTheme } from "@mantine/core";
import { RingLoader } from "./RingLoader";

const loadingTheme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, ring: RingLoader },
        type: "ring",
      },
    }),
  },
});

export default function LoadingScreen() {
  return (
    <MantineProvider theme={loadingTheme}>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 247, 255, 0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <Loader />
      </div>
    </MantineProvider>
  );
}
