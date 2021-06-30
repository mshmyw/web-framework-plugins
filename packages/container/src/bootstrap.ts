import { kernel } from "@chenshaorui/web-framework-kernel";

import { BootstrapInfo } from "./interfaces";

export async function fetchBootstrapInfo(): Promise<BootstrapInfo> {
  return await fetch("/api/bootstrap").then(async (response) => {
    if (!response.ok) {
      throw new Error("Fetch bootstrap information failed!");
    }

    try {
      return await response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          "The content of bootstrap information response is not JSON serializable!"
        );
      }
      throw error;
    }
  });
}

export function initializeKernel(bootstrapInfo: BootstrapInfo): void {
  bootstrapInfo.plugins.component.forEach((componentPlugin) => {
    try {
      kernel.registerComponentPlugin(
        componentPlugin.name,
        componentPlugin.uri,
        componentPlugin.components
      );
    } catch (error) {
      console.warn(
        `Register component plugin "${componentPlugin.name}" failed: ${error.message}`
      );
    }
  });

  bootstrapInfo.storyboards.forEach((storyboard) => {
    kernel.registerStoryboard(storyboard);
  });
}

export async function bootstrap(): Promise<void> {
  const bootstrapInfo = await fetchBootstrapInfo();
  initializeKernel(bootstrapInfo);

  kernel.start();
}
