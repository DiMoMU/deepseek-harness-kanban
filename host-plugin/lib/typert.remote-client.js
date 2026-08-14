/* Generated remote-client typert manifest for @deepseek-ai/dsh-session-delete. */
import { z } from "zod";

const _delete_result$schema = z.object({
	'deleted': z.boolean().readonly()
});

export const TYPERT_REMOTE = {
	package: "@deepseek-ai/dsh-session-delete",
	descriptors: [
		{
			id: "@deepseek-ai/dsh-session-delete#sessionDelete/deleteSession",
			service: "sessionDelete",
			namespace: "sessionDelete",
			method: "deleteSession",
			invocation: { kind: "direct" },
			parameters: [
				{
					name: "sessionId",
					wire: "sessionId",
					source: "json",
					codec: {
						mode: "strict",
						typeSymbol: "@deepseek-ai/dsh-session-delete/types#SessionId",
						schema: z.string()
					}
				}
			],
			result: {
				mode: "strict",
				typeSymbol: "@deepseek-ai/dsh-session-delete/types#SessionDeleteResult",
				schema: _delete_result$schema
			},
			sourceLocation: { "file": "packages/delete/src/index.ts", "line": 1, "column": 1 }
		}
	]
};

export default TYPERT_REMOTE;
