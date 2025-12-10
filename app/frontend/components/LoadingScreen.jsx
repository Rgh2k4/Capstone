"use client";

import { MantineProvider, Loader } from "@mantine/core";

export default function LoadingScreen() {
  return (
    <MantineProvider>
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
        <Loader color="blue" />
      </div>
    </MantineProvider>
  );
}
