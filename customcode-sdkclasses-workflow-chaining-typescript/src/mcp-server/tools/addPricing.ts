/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { addPricing } from "../../funcs/addPricing.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request: operations.AddPricingRequest$inboundSchema,
};

export const tool$addPricing: ToolDefinition<typeof args> = {
  name: "add-pricing",
  description: `Add pricing to a product`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await addPricing(
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
