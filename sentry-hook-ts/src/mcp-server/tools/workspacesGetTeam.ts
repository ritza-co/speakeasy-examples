/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { workspacesGetTeam } from "../../funcs/workspacesGetTeam.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.GetWorkspaceTeamRequest$inboundSchema,
};

export const tool$workspacesGetTeam: ToolDefinition<typeof args> = {
  name: "workspaces_get-team",
  description: `Get team members for a particular workspace`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await workspacesGetTeam(
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
