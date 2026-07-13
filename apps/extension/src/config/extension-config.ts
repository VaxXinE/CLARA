export type ExtensionConfig = {
  claraApiBaseUrl: string;
  claraAllowedOrigins: string[];
  minSyncIntervalMs: number;
  maxMessagesPerSnapshot: number;
  maxMessageTextLength: number;
};

export const defaultExtensionConfig: ExtensionConfig = {
  claraApiBaseUrl: "http://127.0.0.1:3000",
  claraAllowedOrigins: ["http://127.0.0.1:3000"],
  minSyncIntervalMs: 1500,
  maxMessagesPerSnapshot: 50,
  maxMessageTextLength: 4000,
};
