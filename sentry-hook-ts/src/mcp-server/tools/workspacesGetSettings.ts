/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { workspacesGetSettings } from "../../funcs/workspacesGetSettings.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.GetWorkspaceSettingsRequest$inboundSchema,
};

export const tool$workspacesGetSettings: ToolDefinition<typeof args> = {
  name: "workspaces_get-settings",
  description: `Get workspace settings

Get settings about a particular workspace.`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await workspacesGetSettings(
      client,
      args.request,
      { fetchOptions: { signal: ctx.signal } },
    ).$inspect();

    if (!result.ok) {
      return {
        content: [{ type: "text", text: result.error.message }],
        isError: true,
      };
    }

    const value = result.value;

    return formatResult(value, apiCall);
  },
};
