import { kernel } from "@chenshaorui/web-framework-kernel";

import { BootstrapInfo } from "./interfaces";

export function initializeKernel(bootstrapInfo: BootstrapInfo): void {
  bootstrapInfo.components.forEach((componentPlugin) => {
    kernel.registerComponentPlugin(
      componentPlugin.name,
      componentPlugin.components
    );
  });
}

export async function bootstrap(): Promise<void> {
  const bootstrapInfo: BootstrapInfo = await fetch("/api/bootstrap").then(
    (response) => response.json()
  );
  initializeKernel(bootstrapInfo);
}
