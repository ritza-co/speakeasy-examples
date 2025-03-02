/*
 * Code generated by Speakeasy (https://speakeasy.com). DO NOT EDIT.
 */

import { deleteCoffeeTypeCoffeeTypesTypeIdDelete } from "../../funcs/deleteCoffeeTypeCoffeeTypesTypeIdDelete.js";
import * as operations from "../../models/operations/index.js";
import { formatResult, ToolDefinition } from "../tools.js";

const args = {
  request:
    operations.DeleteCoffeeTypeCoffeeTypesTypeIdDeleteRequest$inboundSchema,
};

export const tool$deleteCoffeeTypeCoffeeTypesTypeIdDelete: ToolDefinition<
  typeof args
> = {
  name: "delete-coffee-type-coffee-types-type-id-delete",
  description: `Delete Coffee Type

Delete a coffee type.`,
  args,
  tool: async (client, args, ctx) => {
    const [result, apiCall] = await deleteCoffeeTypeCoffeeTypesTypeIdDelete(
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

    return formatResult(void 0, apiCall);
  },
};
