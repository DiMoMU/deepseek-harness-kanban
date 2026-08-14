// @deepseek-ai/dsh-session-delete — host Remote: permanently delete a session's on-disk log.
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { rm, readdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

//#region TS decorator runtime helpers (same as other typert host plugins)
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
//#endregion

/**
* Remote-only service that removes a session's persisted log directory.
* The companion client archives the session first (hiding it from every view);
* this gateway then removes the on-disk files under `$DSH_HOME/sessions`.
*/
let SessionDeleteGateway = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _deleteSession_decorators;
	return class SessionDeleteGateway extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_deleteSession_decorators = [Remote("deleteSession")];
			__esDecorate(this, null, _deleteSession_decorators, {
				kind: "method",
				name: "deleteSession",
				static: false,
				private: false,
				access: {
					has: (obj) => "deleteSession" in obj,
					get: (obj) => obj.deleteSession
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = [];
		constructor(ctx) {
			super(ctx, "sessionDelete");
			__runInitializers(this, _instanceExtraInitializers);
		}
		/**
		* Permanently delete a session's on-disk log directory. Session ids are
		* UUID-shaped safe path segments; each is matched as an exact directory
		* name under every project directory of the sessions root, then removed
		* with `force: true`. Missing ids are a silent no-op (`deleted: false`).
		* @param args - { sessionId } deserialized by the gateway.
		* @returns { deleted: boolean } — true when at least one directory was removed.
		*/
		async deleteSession(args) {
			const sessionId = args && typeof args === "object" ? args.sessionId : args;
			if (!sessionId || typeof sessionId !== "string" || sessionId.length === 0 || sessionId.includes("..") || sessionId.includes("/") || sessionId.includes("\\")) {
				return { deleted: false };
			}
			const home = process.env.DSH_HOME || join(homedir(), ".dsh");
			const root = join(home, "sessions");
			let deleted = false;
			try {
				const projects = await readdir(root, { withFileTypes: true });
				for (const proj of projects) {
					if (!proj.isDirectory()) continue;
					const target = join(root, proj.name, sessionId);
					try {
						await rm(target, { recursive: true, force: true });
						deleted = true;
					} catch { /* not present under this project — keep scanning */ }
				}
			} catch { /* sessions root missing — nothing to delete */ }
			return { deleted };
		}
	};
})();
export { SessionDeleteGateway, SessionDeleteGateway as default };
