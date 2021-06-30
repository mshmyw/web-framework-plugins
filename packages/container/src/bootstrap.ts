import { Kernel, kernel } from "@chenshaorui/web-framework-kernel";

import { BootstrapInfo } from "./interfaces";

export async function fetchBootstrapInfo(): Promise<BootstrapInfo> {
  return await fetch("/api/bootstrap").then(async (response) => {
    if (!response.ok) {
      throw new Error("Fetch bootstrap information failed!");
    }

    try {
      // TODO(chenshaorui): Use a JSON schema validation library to validate the schema of bootstrap information.
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

export function initializeKernel(
  kernel: Kernel,
  bootstrapInfo: BootstrapInfo
): void {
  bootstrapInfo.plugins.component.forEach((bootstrapComponentPluginInfo) => {
    try {
      kernel.registerComponentPlugin(
        bootstrapComponentPluginInfo.name,
        bootstrapComponentPluginInfo.uri,
        bootstrapComponentPluginInfo.components
      );
    } catch (error) {
      console.warn(
        `Register component plugin "${bootstrapComponentPluginInfo.name}" failed: ${error.message}`
      );
    }
  });

  bootstrapInfo.storyboards.forEach((storyboardConfig) => {
    kernel.registerStoryboard(storyboardConfig);
  });
}

export function startKernel(kernel: Kernel): void {
  kernel.start();
}

export async function bootstrap(): Promise<void> {
  const bootstrapInfo = await fetchBootstrapInfo();

  initializeKernel(kernel, bootstrapInfo);
  startKernel(kernel);
}
