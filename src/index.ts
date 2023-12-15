import type { AstroIntegration } from "astro";
import { vitePluginSanityClient } from "./vite-plugin-sanity-client";
import type { ClientConfig } from "@sanity/client";

type IntegrationOptions = ClientConfig;

const defaultOptions: IntegrationOptions = {
  apiVersion: "v2023-08-24",
};

export function sanityIntegration(
  options: IntegrationOptions,
): AstroIntegration {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };
  return {
    name: "sanity-astro",
    hooks: {
      "astro:config:setup": ({
        injectScript,
        updateConfig,
        config,
        logger,
      }) => {
        updateConfig({
          vite: {
            plugins: [
              vitePluginSanityClient(resolvedOptions),
            ],
          },
        });
        injectScript(
          "page-ssr",
          `
          import { sanityClient } from "sanity:client";
          globalThis.sanityClient = sanityClient;
          `,
        );
      },
    },
  };
}
