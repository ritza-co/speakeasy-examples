/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { lapsUpdateLap } from "../../funcs/lapsUpdateLap.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.UpdateLapRequest$inboundSchema,
};

export const tool$lapsUpdateLap: ToolDefinition<typeof args> = {
  name: "laps-update-lap",
  description: `Update a lap record

Update a specific lap record for a driver`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await lapsUpdateLap(
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
