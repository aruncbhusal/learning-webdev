/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@dfinity/agent/lib/esm/actor.js":
/*!******************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/actor.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActorCallError": () => (/* binding */ ActorCallError),
/* harmony export */   "QueryCallRejectedError": () => (/* binding */ QueryCallRejectedError),
/* harmony export */   "UpdateCallRejectedError": () => (/* binding */ UpdateCallRejectedError),
/* harmony export */   "Actor": () => (/* binding */ Actor),
/* harmony export */   "ACTOR_METHOD_WITH_HTTP_DETAILS": () => (/* binding */ ACTOR_METHOD_WITH_HTTP_DETAILS),
/* harmony export */   "ACTOR_METHOD_WITH_CERTIFICATE": () => (/* binding */ ACTOR_METHOD_WITH_CERTIFICATE),
/* harmony export */   "getManagementCanister": () => (/* binding */ getManagementCanister),
/* harmony export */   "AdvancedActor": () => (/* binding */ AdvancedActor)
/* harmony export */ });
/* harmony import */ var buffer___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer/ */ "./node_modules/buffer/index.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./agent */ "./node_modules/@dfinity/agent/lib/esm/agent/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./errors */ "./node_modules/@dfinity/agent/lib/esm/errors.js");
/* harmony import */ var _dfinity_candid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dfinity/candid */ "./node_modules/@dfinity/candid/lib/esm/index.js");
/* harmony import */ var _polling__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./polling */ "./node_modules/@dfinity/agent/lib/esm/polling/index.js");
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _certificate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./certificate */ "./node_modules/@dfinity/agent/lib/esm/certificate.js");
/* harmony import */ var _canisters_management_idl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./canisters/management_idl */ "./node_modules/@dfinity/agent/lib/esm/canisters/management_idl.js");









class ActorCallError extends _errors__WEBPACK_IMPORTED_MODULE_2__.AgentError {
    constructor(canisterId, methodName, type, props) {
        super([
            `Call failed:`,
            `  Canister: ${canisterId.toText()}`,
            `  Method: ${methodName} (${type})`,
            ...Object.getOwnPropertyNames(props).map(n => `  "${n}": ${JSON.stringify(props[n])}`),
        ].join('\n'));
        this.canisterId = canisterId;
        this.methodName = methodName;
        this.type = type;
        this.props = props;
    }
}
class QueryCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, result) {
        var _a;
        super(canisterId, methodName, 'query', {
            Status: result.status,
            Code: (_a = _agent__WEBPACK_IMPORTED_MODULE_1__.ReplicaRejectCode[result.reject_code]) !== null && _a !== void 0 ? _a : `Unknown Code "${result.reject_code}"`,
            Message: result.reject_message,
        });
        this.result = result;
    }
}
class UpdateCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, requestId, response, reject_code, reject_message, error_code) {
        super(canisterId, methodName, 'update', Object.assign({ 'Request ID': (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_6__.toHex)(requestId) }, (response.body
            ? Object.assign(Object.assign({}, (error_code
                ? {
                    'Error code': error_code,
                }
                : {})), { 'Reject code': String(reject_code), 'Reject message': reject_message }) : {
            'HTTP status code': response.status.toString(),
            'HTTP status text': response.statusText,
        })));
        this.requestId = requestId;
        this.response = response;
        this.reject_code = reject_code;
        this.reject_message = reject_message;
        this.error_code = error_code;
    }
}
const metadataSymbol = Symbol.for('ic-agent-metadata');
/**
 * An actor base class. An actor is an object containing only functions that will
 * return a promise. These functions are derived from the IDL definition.
 */
class Actor {
    constructor(metadata) {
        this[metadataSymbol] = Object.freeze(metadata);
    }
    /**
     * Get the Agent class this Actor would call, or undefined if the Actor would use
     * the default agent (global.ic.agent).
     * @param actor The actor to get the agent of.
     */
    static agentOf(actor) {
        return actor[metadataSymbol].config.agent;
    }
    /**
     * Get the interface of an actor, in the form of an instance of a Service.
     * @param actor The actor to get the interface of.
     */
    static interfaceOf(actor) {
        return actor[metadataSymbol].service;
    }
    static canisterIdOf(actor) {
        return _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(actor[metadataSymbol].config.canisterId);
    }
    static async install(fields, config) {
        const mode = fields.mode === undefined ? { install: null } : fields.mode;
        // Need to transform the arg into a number array.
        const arg = fields.arg ? [...new Uint8Array(fields.arg)] : [];
        // Same for module.
        const wasmModule = [...new Uint8Array(fields.module)];
        const canisterId = typeof config.canisterId === 'string'
            ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.fromText(config.canisterId)
            : config.canisterId;
        await getManagementCanister(config).install_code({
            mode,
            arg,
            wasm_module: wasmModule,
            canister_id: canisterId,
            sender_canister_version: [],
        });
    }
    static async createCanister(config, settings) {
        function settingsToCanisterSettings(settings) {
            return [
                {
                    controllers: settings.controllers ? [settings.controllers] : [],
                    compute_allocation: settings.compute_allocation ? [settings.compute_allocation] : [],
                    freezing_threshold: settings.freezing_threshold ? [settings.freezing_threshold] : [],
                    memory_allocation: settings.memory_allocation ? [settings.memory_allocation] : [],
                    reserved_cycles_limit: [],
                    log_visibility: [],
                    wasm_memory_limit: [],
                },
            ];
        }
        const { canister_id: canisterId } = await getManagementCanister(config || {}).provisional_create_canister_with_cycles({
            amount: [],
            settings: settingsToCanisterSettings(settings || {}),
            specified_id: [],
            sender_canister_version: [],
        });
        return canisterId;
    }
    static async createAndInstallCanister(interfaceFactory, fields, config) {
        const canisterId = await this.createCanister(config);
        await this.install(Object.assign({}, fields), Object.assign(Object.assign({}, config), { canisterId }));
        return this.createActor(interfaceFactory, Object.assign(Object.assign({}, config), { canisterId }));
    }
    static createActorClass(interfaceFactory, options) {
        const service = interfaceFactory({ IDL: _dfinity_candid__WEBPACK_IMPORTED_MODULE_3__.IDL });
        class CanisterActor extends Actor {
            constructor(config) {
                if (!config.canisterId)
                    throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AgentError(`Canister ID is required, but received ${typeof config.canisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`);
                const canisterId = typeof config.canisterId === 'string'
                    ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.fromText(config.canisterId)
                    : config.canisterId;
                super({
                    config: Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), config), { canisterId }),
                    service,
                });
                for (const [methodName, func] of service._fields) {
                    if (options === null || options === void 0 ? void 0 : options.httpDetails) {
                        func.annotations.push(ACTOR_METHOD_WITH_HTTP_DETAILS);
                    }
                    if (options === null || options === void 0 ? void 0 : options.certificate) {
                        func.annotations.push(ACTOR_METHOD_WITH_CERTIFICATE);
                    }
                    this[methodName] = _createActorMethod(this, methodName, func, config.blsVerify);
                }
            }
        }
        return CanisterActor;
    }
    static createActor(interfaceFactory, configuration) {
        if (!configuration.canisterId) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_2__.AgentError(`Canister ID is required, but received ${typeof configuration.canisterId} instead. If you are using automatically generated declarations, this may be because your application is not setting the canister ID in process.env correctly.`);
        }
        return new (this.createActorClass(interfaceFactory))(configuration);
    }
    /**
     * Returns an actor with methods that return the http response details along with the result
     * @param interfaceFactory - the interface factory for the actor
     * @param configuration - the configuration for the actor
     * @deprecated - use createActor with actorClassOptions instead
     */
    static createActorWithHttpDetails(interfaceFactory, configuration) {
        return new (this.createActorClass(interfaceFactory, { httpDetails: true }))(configuration);
    }
    /**
     * Returns an actor with methods that return the http response details along with the result
     * @param interfaceFactory - the interface factory for the actor
     * @param configuration - the configuration for the actor
     * @param actorClassOptions - options for the actor class extended details to return with the result
     */
    static createActorWithExtendedDetails(interfaceFactory, configuration, actorClassOptions = {
        httpDetails: true,
        certificate: true,
    }) {
        return new (this.createActorClass(interfaceFactory, actorClassOptions))(configuration);
    }
}
// IDL functions can have multiple return values, so decoding always
// produces an array. Ensure that functions with single or zero return
// values behave as expected.
function decodeReturnValue(types, msg) {
    const returnValues = _dfinity_candid__WEBPACK_IMPORTED_MODULE_3__.IDL.decode(types, buffer___WEBPACK_IMPORTED_MODULE_0__.Buffer.from(msg));
    switch (returnValues.length) {
        case 0:
            return undefined;
        case 1:
            return returnValues[0];
        default:
            return returnValues;
    }
}
const DEFAULT_ACTOR_CONFIG = {
    pollingStrategyFactory: _polling__WEBPACK_IMPORTED_MODULE_4__.strategy.defaultStrategy,
};
const ACTOR_METHOD_WITH_HTTP_DETAILS = 'http-details';
const ACTOR_METHOD_WITH_CERTIFICATE = 'certificate';
function _createActorMethod(actor, methodName, func, blsVerify) {
    let caller;
    if (func.annotations.includes('query') || func.annotations.includes('composite_query')) {
        caller = async (options, ...args) => {
            var _a, _b;
            // First, if there's a config transformation, call it.
            options = Object.assign(Object.assign({}, options), (_b = (_a = actor[metadataSymbol].config).queryTransform) === null || _b === void 0 ? void 0 : _b.call(_a, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
            const agent = options.agent || actor[metadataSymbol].config.agent || (0,_agent__WEBPACK_IMPORTED_MODULE_1__.getDefaultAgent)();
            const cid = _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(options.canisterId || actor[metadataSymbol].config.canisterId);
            const arg = _dfinity_candid__WEBPACK_IMPORTED_MODULE_3__.IDL.encode(func.argTypes, args);
            const result = await agent.query(cid, {
                methodName,
                arg,
                effectiveCanisterId: options.effectiveCanisterId,
            });
            const httpDetails = Object.assign(Object.assign({}, result.httpDetails), { requestDetails: result.requestDetails });
            switch (result.status) {
                case "rejected" /* QueryResponseStatus.Rejected */:
                    throw new QueryCallRejectedError(cid, methodName, result);
                case "replied" /* QueryResponseStatus.Replied */:
                    return func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS)
                        ? {
                            httpDetails,
                            result: decodeReturnValue(func.retTypes, result.reply.arg),
                        }
                        : decodeReturnValue(func.retTypes, result.reply.arg);
            }
        };
    }
    else {
        caller = async (options, ...args) => {
            var _a, _b;
            // First, if there's a config transformation, call it.
            options = Object.assign(Object.assign({}, options), (_b = (_a = actor[metadataSymbol].config).callTransform) === null || _b === void 0 ? void 0 : _b.call(_a, methodName, args, Object.assign(Object.assign({}, actor[metadataSymbol].config), options)));
            const agent = options.agent || actor[metadataSymbol].config.agent || (0,_agent__WEBPACK_IMPORTED_MODULE_1__.getDefaultAgent)();
            const { canisterId, effectiveCanisterId, pollingStrategyFactory } = Object.assign(Object.assign(Object.assign({}, DEFAULT_ACTOR_CONFIG), actor[metadataSymbol].config), options);
            const cid = _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(canisterId);
            const ecid = effectiveCanisterId !== undefined ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(effectiveCanisterId) : cid;
            const arg = _dfinity_candid__WEBPACK_IMPORTED_MODULE_3__.IDL.encode(func.argTypes, args);
            const { requestId, response, requestDetails } = await agent.call(cid, {
                methodName,
                arg,
                effectiveCanisterId: ecid,
            });
            let reply;
            let certificate;
            if (response.body && response.body.certificate) {
                if (agent.rootKey == null) {
                    throw new Error('Agent is missing root key');
                }
                const cert = response.body.certificate;
                certificate = await _certificate__WEBPACK_IMPORTED_MODULE_7__.Certificate.create({
                    certificate: (0,_dfinity_candid__WEBPACK_IMPORTED_MODULE_3__.bufFromBufLike)(cert),
                    rootKey: agent.rootKey,
                    canisterId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(canisterId),
                    blsVerify,
                });
                const path = [new TextEncoder().encode('request_status'), requestId];
                const status = new TextDecoder().decode((0,_certificate__WEBPACK_IMPORTED_MODULE_7__.lookupResultToBuffer)(certificate.lookup([...path, 'status'])));
                switch (status) {
                    case 'replied':
                        reply = (0,_certificate__WEBPACK_IMPORTED_MODULE_7__.lookupResultToBuffer)(certificate.lookup([...path, 'reply']));
                        break;
                    case 'rejected': {
                        // Find rejection details in the certificate
                        const rejectCode = new Uint8Array((0,_certificate__WEBPACK_IMPORTED_MODULE_7__.lookupResultToBuffer)(certificate.lookup([...path, 'reject_code'])))[0];
                        const rejectMessage = new TextDecoder().decode((0,_certificate__WEBPACK_IMPORTED_MODULE_7__.lookupResultToBuffer)(certificate.lookup([...path, 'reject_message'])));
                        const error_code_buf = (0,_certificate__WEBPACK_IMPORTED_MODULE_7__.lookupResultToBuffer)(certificate.lookup([...path, 'error_code']));
                        const error_code = error_code_buf
                            ? new TextDecoder().decode(error_code_buf)
                            : undefined;
                        throw new UpdateCallRejectedError(cid, methodName, requestId, response, rejectCode, rejectMessage, error_code);
                    }
                }
            }
            else if (response.body && 'reject_message' in response.body) {
                // handle v2 response errors by throwing an UpdateCallRejectedError object
                const { reject_code, reject_message, error_code } = response.body;
                throw new UpdateCallRejectedError(cid, methodName, requestId, response, reject_code, reject_message, error_code);
            }
            // Fall back to polling if we receive an Accepted response code
            if (response.status === 202) {
                const pollStrategy = pollingStrategyFactory();
                // Contains the certificate and the reply from the boundary node
                const response = await (0,_polling__WEBPACK_IMPORTED_MODULE_4__.pollForResponse)(agent, ecid, requestId, pollStrategy, blsVerify);
                certificate = response.certificate;
                reply = response.reply;
            }
            const shouldIncludeHttpDetails = func.annotations.includes(ACTOR_METHOD_WITH_HTTP_DETAILS);
            const shouldIncludeCertificate = func.annotations.includes(ACTOR_METHOD_WITH_CERTIFICATE);
            const httpDetails = Object.assign(Object.assign({}, response), { requestDetails });
            if (reply !== undefined) {
                if (shouldIncludeHttpDetails && shouldIncludeCertificate) {
                    return {
                        httpDetails,
                        certificate,
                        result: decodeReturnValue(func.retTypes, reply),
                    };
                }
                else if (shouldIncludeCertificate) {
                    return {
                        certificate,
                        result: decodeReturnValue(func.retTypes, reply),
                    };
                }
                else if (shouldIncludeHttpDetails) {
                    return {
                        httpDetails,
                        result: decodeReturnValue(func.retTypes, reply),
                    };
                }
                return decodeReturnValue(func.retTypes, reply);
            }
            else if (func.retTypes.length === 0) {
                return shouldIncludeHttpDetails
                    ? {
                        httpDetails: response,
                        result: undefined,
                    }
                    : undefined;
            }
            else {
                throw new Error(`Call was returned undefined, but type [${func.retTypes.join(',')}].`);
            }
        };
    }
    const handler = (...args) => caller({}, ...args);
    handler.withOptions =
        (options) => (...args) => caller(options, ...args);
    return handler;
}
/**
 * Create a management canister actor
 * @param config - a CallConfig
 */
function getManagementCanister(config) {
    function transform(methodName, args) {
        if (config.effectiveCanisterId) {
            return { effectiveCanisterId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(config.effectiveCanisterId) };
        }
        const first = args[0];
        let effectiveCanisterId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.fromHex('');
        if (first && typeof first === 'object' && first.target_canister && methodName === "install_chunked_code") {
            effectiveCanisterId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(first.target_canister);
        }
        if (first && typeof first === 'object' && first.canister_id) {
            effectiveCanisterId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.from(first.canister_id);
        }
        return { effectiveCanisterId };
    }
    return Actor.createActor(_canisters_management_idl__WEBPACK_IMPORTED_MODULE_8__["default"], Object.assign(Object.assign(Object.assign({}, config), { canisterId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_5__.Principal.fromHex('') }), {
        callTransform: transform,
        queryTransform: transform,
    }));
}
class AdvancedActor extends Actor {
    constructor(metadata) {
        super(metadata);
    }
}
//# sourceMappingURL=actor.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/api.js":
/*!**********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/api.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReplicaRejectCode": () => (/* binding */ ReplicaRejectCode)
/* harmony export */ });
/**
 * Codes used by the replica for rejecting a message.
 * See {@link https://sdk.dfinity.org/docs/interface-spec/#reject-codes | the interface spec}.
 */
var ReplicaRejectCode;
(function (ReplicaRejectCode) {
    ReplicaRejectCode[ReplicaRejectCode["SysFatal"] = 1] = "SysFatal";
    ReplicaRejectCode[ReplicaRejectCode["SysTransient"] = 2] = "SysTransient";
    ReplicaRejectCode[ReplicaRejectCode["DestinationInvalid"] = 3] = "DestinationInvalid";
    ReplicaRejectCode[ReplicaRejectCode["CanisterReject"] = 4] = "CanisterReject";
    ReplicaRejectCode[ReplicaRejectCode["CanisterError"] = 5] = "CanisterError";
})(ReplicaRejectCode || (ReplicaRejectCode = {}));
//# sourceMappingURL=api.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/http/errors.js":
/*!******************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/http/errors.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AgentHTTPResponseError": () => (/* binding */ AgentHTTPResponseError),
/* harmony export */   "AgentCallError": () => (/* binding */ AgentCallError),
/* harmony export */   "AgentQueryError": () => (/* binding */ AgentQueryError),
/* harmony export */   "AgentReadStateError": () => (/* binding */ AgentReadStateError)
/* harmony export */ });
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../errors */ "./node_modules/@dfinity/agent/lib/esm/errors.js");

class AgentHTTPResponseError extends _errors__WEBPACK_IMPORTED_MODULE_0__.AgentError {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class AgentCallError extends _errors__WEBPACK_IMPORTED_MODULE_0__.AgentError {
    constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
        super(message);
        this.response = response;
        this.requestId = requestId;
        this.senderPubkey = senderPubkey;
        this.senderSig = senderSig;
        this.ingressExpiry = ingressExpiry;
        this.name = 'AgentCallError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class AgentQueryError extends _errors__WEBPACK_IMPORTED_MODULE_0__.AgentError {
    constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
        super(message);
        this.response = response;
        this.requestId = requestId;
        this.senderPubkey = senderPubkey;
        this.senderSig = senderSig;
        this.ingressExpiry = ingressExpiry;
        this.name = 'AgentQueryError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class AgentReadStateError extends _errors__WEBPACK_IMPORTED_MODULE_0__.AgentError {
    constructor(message, response, requestId, senderPubkey, senderSig, ingressExpiry) {
        super(message);
        this.response = response;
        this.requestId = requestId;
        this.senderPubkey = senderPubkey;
        this.senderSig = senderSig;
        this.ingressExpiry = ingressExpiry;
        this.name = 'AgentReadStateError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/http/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/http/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Expiry": () => (/* reexport safe */ _transforms__WEBPACK_IMPORTED_MODULE_6__.Expiry),
/* harmony export */   "httpHeadersTransform": () => (/* reexport safe */ _transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform),
/* harmony export */   "makeExpiryTransform": () => (/* reexport safe */ _transforms__WEBPACK_IMPORTED_MODULE_6__.makeExpiryTransform),
/* harmony export */   "makeNonceTransform": () => (/* reexport safe */ _transforms__WEBPACK_IMPORTED_MODULE_6__.makeNonceTransform),
/* harmony export */   "AgentCallError": () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_8__.AgentCallError),
/* harmony export */   "AgentHTTPResponseError": () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_8__.AgentHTTPResponseError),
/* harmony export */   "AgentQueryError": () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_8__.AgentQueryError),
/* harmony export */   "AgentReadStateError": () => (/* reexport safe */ _errors__WEBPACK_IMPORTED_MODULE_8__.AgentReadStateError),
/* harmony export */   "makeNonce": () => (/* reexport safe */ _types__WEBPACK_IMPORTED_MODULE_7__.makeNonce),
/* harmony export */   "RequestStatusResponseStatus": () => (/* binding */ RequestStatusResponseStatus),
/* harmony export */   "IC_ROOT_KEY": () => (/* binding */ IC_ROOT_KEY),
/* harmony export */   "MANAGEMENT_CANISTER_ID": () => (/* binding */ MANAGEMENT_CANISTER_ID),
/* harmony export */   "IdentityInvalidError": () => (/* binding */ IdentityInvalidError),
/* harmony export */   "HttpAgent": () => (/* binding */ HttpAgent)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors */ "./node_modules/@dfinity/agent/lib/esm/errors.js");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../auth */ "./node_modules/@dfinity/agent/lib/esm/auth.js");
/* harmony import */ var _cbor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../cbor */ "./node_modules/@dfinity/agent/lib/esm/cbor.js");
/* harmony import */ var _request_id__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../request_id */ "./node_modules/@dfinity/agent/lib/esm/request_id.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _transforms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./transforms */ "./node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./types */ "./node_modules/@dfinity/agent/lib/esm/agent/http/types.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./errors */ "./node_modules/@dfinity/agent/lib/esm/agent/http/errors.js");
/* harmony import */ var _canisterStatus__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../canisterStatus */ "./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js");
/* harmony import */ var _certificate__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../certificate */ "./node_modules/@dfinity/agent/lib/esm/certificate.js");
/* harmony import */ var _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @noble/curves/ed25519 */ "./node_modules/@noble/curves/esm/ed25519.js");
/* harmony import */ var _utils_expirableMap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/expirableMap */ "./node_modules/@dfinity/agent/lib/esm/utils/expirableMap.js");
/* harmony import */ var _public_key__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../public_key */ "./node_modules/@dfinity/agent/lib/esm/public_key.js");
/* harmony import */ var _utils_leb__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../utils/leb */ "./node_modules/@dfinity/agent/lib/esm/utils/leb.js");
/* harmony import */ var _observable__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../observable */ "./node_modules/@dfinity/agent/lib/esm/observable.js");
/* harmony import */ var _polling_backoff__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../polling/backoff */ "./node_modules/@dfinity/agent/lib/esm/polling/backoff.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HttpAgent_instances, _HttpAgent_rootKeyPromise, _HttpAgent_shouldFetchRootKey, _HttpAgent_identity, _HttpAgent_fetch, _HttpAgent_fetchOptions, _HttpAgent_callOptions, _HttpAgent_timeDiffMsecs, _HttpAgent_credentials, _HttpAgent_retryTimes, _HttpAgent_backoffStrategy, _HttpAgent_maxIngressExpiryInMinutes, _HttpAgent_waterMark, _HttpAgent_queryPipeline, _HttpAgent_updatePipeline, _HttpAgent_subnetKeys, _HttpAgent_verifyQuerySignatures, _HttpAgent_requestAndRetryQuery, _HttpAgent_requestAndRetry, _HttpAgent_verifyQueryResponse, _HttpAgent_rootKeyGuard;




















var RequestStatusResponseStatus;
(function (RequestStatusResponseStatus) {
    RequestStatusResponseStatus["Received"] = "received";
    RequestStatusResponseStatus["Processing"] = "processing";
    RequestStatusResponseStatus["Replied"] = "replied";
    RequestStatusResponseStatus["Rejected"] = "rejected";
    RequestStatusResponseStatus["Unknown"] = "unknown";
    RequestStatusResponseStatus["Done"] = "done";
})(RequestStatusResponseStatus || (RequestStatusResponseStatus = {}));
const MINUTE_TO_MSECS = 60 * 1000;
// Root public key for the IC, encoded as hex
const IC_ROOT_KEY = '308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100814' +
    'c0e6ec71fab583b08bd81373c255c3c371b2e84863c98a4f1e08b74235d14fb5d9c0cd546d968' +
    '5f913a0c0b2cc5341583bf4b4392e467db96d65b9bb4cb717112f8472e0d5a4d14505ffd7484' +
    'b01291091c5f87b98883463f98091a0baaae';
const MANAGEMENT_CANISTER_ID = 'aaaaa-aa';
// IC0 domain info
const IC0_DOMAIN = 'ic0.app';
const IC0_SUB_DOMAIN = '.ic0.app';
const ICP0_DOMAIN = 'icp0.io';
const ICP0_SUB_DOMAIN = '.icp0.io';
const ICP_API_DOMAIN = 'icp-api.io';
const ICP_API_SUB_DOMAIN = '.icp-api.io';
class HttpDefaultFetchError extends _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
class IdentityInvalidError extends _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
function getDefaultFetch() {
    let defaultFetch;
    if (typeof window !== 'undefined') {
        // Browser context
        if (window.fetch) {
            defaultFetch = window.fetch.bind(window);
        }
        else {
            throw new HttpDefaultFetchError('Fetch implementation was not available. You appear to be in a browser context, but window.fetch was not present.');
        }
    }
    else if (typeof __webpack_require__.g !== 'undefined') {
        // Node context
        if (__webpack_require__.g.fetch) {
            defaultFetch = __webpack_require__.g.fetch.bind(__webpack_require__.g);
        }
        else {
            throw new HttpDefaultFetchError('Fetch implementation was not available. You appear to be in a Node.js context, but global.fetch was not available.');
        }
    }
    else if (typeof self !== 'undefined') {
        if (self.fetch) {
            defaultFetch = self.fetch.bind(self);
        }
    }
    if (defaultFetch) {
        return defaultFetch;
    }
    throw new HttpDefaultFetchError('Fetch implementation was not available. Please provide fetch to the HttpAgent constructor, or ensure it is available in the window or global context.');
}
function determineHost(configuredHost) {
    let host;
    if (configuredHost !== undefined) {
        if (!configuredHost.match(/^[a-z]+:/) && typeof window !== 'undefined') {
            host = new URL(window.location.protocol + '//' + configuredHost);
        }
        else {
            host = new URL(configuredHost);
        }
    }
    else {
        // Mainnet, local, and remote environments will have the api route available
        const knownHosts = ['ic0.app', 'icp0.io', '127.0.0.1', 'localhost'];
        const remoteHosts = ['.github.dev', '.gitpod.io'];
        const location = typeof window !== 'undefined' ? window.location : undefined;
        const hostname = location === null || location === void 0 ? void 0 : location.hostname;
        let knownHost;
        if (hostname && typeof hostname === 'string') {
            if (remoteHosts.some(host => hostname.endsWith(host))) {
                knownHost = hostname;
            }
            else {
                knownHost = knownHosts.find(host => hostname.endsWith(host));
            }
        }
        if (location && knownHost) {
            // If the user is on a boundary-node provided host, we can use the same host for the agent
            host = new URL(`${location.protocol}//${knownHost}${location.port ? ':' + location.port : ''}`);
        }
        else {
            host = new URL('https://icp-api.io');
        }
    }
    return host.toString();
}
/**
 * A HTTP agent allows users to interact with a client of the internet computer
using the available methods. It exposes an API that closely follows the
public view of the internet computer, and is not intended to be exposed
directly to the majority of users due to its low-level interface.
 * There is a pipeline to apply transformations to the request before sending
it to the client. This is to decouple signature, nonce generation and
other computations so that this class can stay as simple as possible while
allowing extensions.
 */
class HttpAgent {
    /**
     * @param options - Options for the HttpAgent
     * @deprecated Use `HttpAgent.create` or `HttpAgent.createSync` instead
     */
    constructor(options = {}) {
        var _a, _b;
        _HttpAgent_instances.add(this);
        _HttpAgent_rootKeyPromise.set(this, null);
        _HttpAgent_shouldFetchRootKey.set(this, false);
        _HttpAgent_identity.set(this, void 0);
        _HttpAgent_fetch.set(this, void 0);
        _HttpAgent_fetchOptions.set(this, void 0);
        _HttpAgent_callOptions.set(this, void 0);
        _HttpAgent_timeDiffMsecs.set(this, 0);
        _HttpAgent_credentials.set(this, void 0);
        _HttpAgent_retryTimes.set(this, void 0); // Retry requests N times before erroring by default
        _HttpAgent_backoffStrategy.set(this, void 0);
        _HttpAgent_maxIngressExpiryInMinutes.set(this, void 0);
        // Public signature to help with type checking.
        this._isAgent = true;
        this.config = {};
        // The UTC time in milliseconds when the latest request was made
        _HttpAgent_waterMark.set(this, 0);
        this.log = new _observable__WEBPACK_IMPORTED_MODULE_14__.ObservableLog();
        _HttpAgent_queryPipeline.set(this, []);
        _HttpAgent_updatePipeline.set(this, []);
        _HttpAgent_subnetKeys.set(this, new _utils_expirableMap__WEBPACK_IMPORTED_MODULE_11__.ExpirableMap({
            expirationTime: 5 * 60 * 1000, // 5 minutes
        }));
        _HttpAgent_verifyQuerySignatures.set(this, true);
        /**
         * See https://internetcomputer.org/docs/current/references/ic-interface-spec/#http-query for details on validation
         * @param queryResponse - The response from the query
         * @param subnetStatus - The subnet status, including all node keys
         * @returns ApiQueryResponse
         */
        _HttpAgent_verifyQueryResponse.set(this, (queryResponse, subnetStatus) => {
            if (__classPrivateFieldGet(this, _HttpAgent_verifyQuerySignatures, "f") === false) {
                // This should not be called if the user has disabled verification
                return queryResponse;
            }
            if (!subnetStatus) {
                throw new _certificate__WEBPACK_IMPORTED_MODULE_10__.CertificateVerificationError('Invalid signature from replica signed query: no matching node key found.');
            }
            const { status, signatures = [], requestId } = queryResponse;
            const domainSeparator = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufFromBufLike)(new TextEncoder().encode('\x0Bic-response'));
            for (const sig of signatures) {
                const { timestamp, identity } = sig;
                const nodeId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromUint8Array(identity).toText();
                let hash;
                // Hash is constructed differently depending on the status
                if (status === 'replied') {
                    const { reply } = queryResponse;
                    hash = (0,_request_id__WEBPACK_IMPORTED_MODULE_4__.hashOfMap)({
                        status: status,
                        reply: reply,
                        timestamp: BigInt(timestamp),
                        request_id: requestId,
                    });
                }
                else if (status === 'rejected') {
                    const { reject_code, reject_message, error_code } = queryResponse;
                    hash = (0,_request_id__WEBPACK_IMPORTED_MODULE_4__.hashOfMap)({
                        status: status,
                        reject_code: reject_code,
                        reject_message: reject_message,
                        error_code: error_code,
                        timestamp: BigInt(timestamp),
                        request_id: requestId,
                    });
                }
                else {
                    throw new Error(`Unknown status: ${status}`);
                }
                const separatorWithHash = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.concat)(domainSeparator, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufFromBufLike)(new Uint8Array(hash)));
                // FIX: check for match without verifying N times
                const pubKey = subnetStatus === null || subnetStatus === void 0 ? void 0 : subnetStatus.nodeKeys.get(nodeId);
                if (!pubKey) {
                    throw new _certificate__WEBPACK_IMPORTED_MODULE_10__.CertificateVerificationError('Invalid signature from replica signed query: no matching node key found.');
                }
                const rawKey = _public_key__WEBPACK_IMPORTED_MODULE_12__.Ed25519PublicKey.fromDer(pubKey).rawKey;
                const valid = _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_16__.ed25519.verify(sig.signature, new Uint8Array(separatorWithHash), new Uint8Array(rawKey));
                if (valid)
                    return queryResponse;
                throw new _certificate__WEBPACK_IMPORTED_MODULE_10__.CertificateVerificationError(`Invalid signature from replica ${nodeId} signed query.`);
            }
            return queryResponse;
        });
        this.config = options;
        __classPrivateFieldSet(this, _HttpAgent_fetch, options.fetch || getDefaultFetch() || fetch.bind(__webpack_require__.g), "f");
        __classPrivateFieldSet(this, _HttpAgent_fetchOptions, options.fetchOptions, "f");
        __classPrivateFieldSet(this, _HttpAgent_callOptions, options.callOptions, "f");
        __classPrivateFieldSet(this, _HttpAgent_shouldFetchRootKey, (_a = options.shouldFetchRootKey) !== null && _a !== void 0 ? _a : false, "f");
        // Use provided root key, otherwise fall back to IC_ROOT_KEY for mainnet or null if the key needs to be fetched
        if (options.rootKey) {
            this.rootKey = options.rootKey;
        }
        else if (__classPrivateFieldGet(this, _HttpAgent_shouldFetchRootKey, "f")) {
            this.rootKey = null;
        }
        else {
            this.rootKey = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.fromHex)(IC_ROOT_KEY);
        }
        const host = determineHost(options.host);
        this.host = new URL(host);
        if (options.verifyQuerySignatures !== undefined) {
            __classPrivateFieldSet(this, _HttpAgent_verifyQuerySignatures, options.verifyQuerySignatures, "f");
        }
        // Default is 3
        __classPrivateFieldSet(this, _HttpAgent_retryTimes, (_b = options.retryTimes) !== null && _b !== void 0 ? _b : 3, "f");
        // Delay strategy for retries. Default is exponential backoff
        const defaultBackoffFactory = () => new _polling_backoff__WEBPACK_IMPORTED_MODULE_15__.ExponentialBackoff({
            maxIterations: __classPrivateFieldGet(this, _HttpAgent_retryTimes, "f"),
        });
        __classPrivateFieldSet(this, _HttpAgent_backoffStrategy, options.backoffStrategy || defaultBackoffFactory, "f");
        // Rewrite to avoid redirects
        if (this.host.hostname.endsWith(IC0_SUB_DOMAIN)) {
            this.host.hostname = IC0_DOMAIN;
        }
        else if (this.host.hostname.endsWith(ICP0_SUB_DOMAIN)) {
            this.host.hostname = ICP0_DOMAIN;
        }
        else if (this.host.hostname.endsWith(ICP_API_SUB_DOMAIN)) {
            this.host.hostname = ICP_API_DOMAIN;
        }
        if (options.credentials) {
            const { name, password } = options.credentials;
            __classPrivateFieldSet(this, _HttpAgent_credentials, `${name}${password ? ':' + password : ''}`, "f");
        }
        __classPrivateFieldSet(this, _HttpAgent_identity, Promise.resolve(options.identity || new _auth__WEBPACK_IMPORTED_MODULE_2__.AnonymousIdentity()), "f");
        if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes > 5) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`The maximum ingress expiry time is 5 minutes. Provided ingress expiry time is ${options.ingressExpiryInMinutes} minutes.`);
        }
        if (options.ingressExpiryInMinutes && options.ingressExpiryInMinutes <= 0) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`Ingress expiry time must be greater than 0. Provided ingress expiry time is ${options.ingressExpiryInMinutes} minutes.`);
        }
        __classPrivateFieldSet(this, _HttpAgent_maxIngressExpiryInMinutes, options.ingressExpiryInMinutes || 5, "f");
        // Add a nonce transform to ensure calls are unique
        this.addTransform('update', (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.makeNonceTransform)(_types__WEBPACK_IMPORTED_MODULE_7__.makeNonce));
        if (options.useQueryNonces) {
            this.addTransform('query', (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.makeNonceTransform)(_types__WEBPACK_IMPORTED_MODULE_7__.makeNonce));
        }
        if (options.logToConsole) {
            this.log.subscribe(log => {
                if (log.level === 'error') {
                    console.error(log.message);
                }
                else if (log.level === 'warn') {
                    console.warn(log.message);
                }
                else {
                    console.log(log.message);
                }
            });
        }
    }
    get waterMark() {
        return __classPrivateFieldGet(this, _HttpAgent_waterMark, "f");
    }
    static createSync(options = {}) {
        return new this(Object.assign({}, options));
    }
    static async create(options = {
        shouldFetchRootKey: false,
    }) {
        const agent = HttpAgent.createSync(options);
        const initPromises = [agent.syncTime()];
        if (agent.host.toString() !== 'https://icp-api.io' && options.shouldFetchRootKey) {
            initPromises.push(agent.fetchRootKey());
        }
        await Promise.all(initPromises);
        return agent;
    }
    static async from(agent) {
        var _a;
        try {
            if ('config' in agent) {
                return await HttpAgent.create(agent.config);
            }
            return await HttpAgent.create({
                fetch: agent._fetch,
                fetchOptions: agent._fetchOptions,
                callOptions: agent._callOptions,
                host: agent._host.toString(),
                identity: (_a = agent._identity) !== null && _a !== void 0 ? _a : undefined,
            });
        }
        catch (_b) {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError('Failed to create agent from provided agent');
        }
    }
    isLocal() {
        const hostname = this.host.hostname;
        return hostname === '127.0.0.1' || hostname.endsWith('127.0.0.1');
    }
    addTransform(type, fn, priority = fn.priority || 0) {
        if (type === 'update') {
            // Keep the pipeline sorted at all time, by priority.
            const i = __classPrivateFieldGet(this, _HttpAgent_updatePipeline, "f").findIndex(x => (x.priority || 0) < priority);
            __classPrivateFieldGet(this, _HttpAgent_updatePipeline, "f").splice(i >= 0 ? i : __classPrivateFieldGet(this, _HttpAgent_updatePipeline, "f").length, 0, Object.assign(fn, { priority }));
        }
        else if (type === 'query') {
            // Keep the pipeline sorted at all time, by priority.
            const i = __classPrivateFieldGet(this, _HttpAgent_queryPipeline, "f").findIndex(x => (x.priority || 0) < priority);
            __classPrivateFieldGet(this, _HttpAgent_queryPipeline, "f").splice(i >= 0 ? i : __classPrivateFieldGet(this, _HttpAgent_queryPipeline, "f").length, 0, Object.assign(fn, { priority }));
        }
    }
    async getPrincipal() {
        if (!__classPrivateFieldGet(this, _HttpAgent_identity, "f")) {
            throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
        }
        return (await __classPrivateFieldGet(this, _HttpAgent_identity, "f")).getPrincipal();
    }
    /**
     * Makes a call to a canister method.
     * @param canisterId - The ID of the canister to call. Can be a Principal or a string.
     * @param options - Options for the call.
     * @param options.methodName - The name of the method to call.
     * @param options.arg - The argument to pass to the method, as an ArrayBuffer.
     * @param options.effectiveCanisterId - (Optional) The effective canister ID, if different from the target canister ID.
     * @param options.callSync - (Optional) Whether to use synchronous call mode. Defaults to true.
     * @param options.nonce - (Optional) A unique nonce for the request. If provided, it will override any nonce set by transforms.
     * @param identity - (Optional) The identity to use for the call. If not provided, the agent's current identity will be used.
     * @returns A promise that resolves to the response of the call, including the request ID and response details.
     */
    async call(canisterId, options, identity) {
        var _a, _b;
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        // TODO - restore this value
        const callSync = (_a = options.callSync) !== null && _a !== void 0 ? _a : true;
        const id = await (identity !== undefined ? await identity : await __classPrivateFieldGet(this, _HttpAgent_identity, "f"));
        if (!id) {
            throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
        }
        const canister = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        const ecid = options.effectiveCanisterId
            ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(options.effectiveCanisterId)
            : canister;
        const sender = id.getPrincipal() || _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.anonymous();
        let ingress_expiry = new _transforms__WEBPACK_IMPORTED_MODULE_6__.Expiry(__classPrivateFieldGet(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS);
        // If the value is off by more than 30 seconds, reconcile system time with the network
        if (Math.abs(__classPrivateFieldGet(this, _HttpAgent_timeDiffMsecs, "f")) > 1000 * 30) {
            ingress_expiry = new _transforms__WEBPACK_IMPORTED_MODULE_6__.Expiry(__classPrivateFieldGet(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS + __classPrivateFieldGet(this, _HttpAgent_timeDiffMsecs, "f"));
        }
        const submit = {
            request_type: _types__WEBPACK_IMPORTED_MODULE_7__.SubmitRequestType.Call,
            canister_id: canister,
            method_name: options.methodName,
            arg: options.arg,
            sender,
            ingress_expiry,
        };
        let transformedRequest = (await this._transform({
            request: {
                body: null,
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (__classPrivateFieldGet(this, _HttpAgent_credentials, "f") ? { Authorization: 'Basic ' + btoa(__classPrivateFieldGet(this, _HttpAgent_credentials, "f")) } : {})),
            },
            endpoint: "call" /* Endpoint.Call */,
            body: submit,
        }));
        // Determine the nonce to use for the request
        let nonce;
        // Check if a nonce is provided in the options and convert it to the correct type
        if (options === null || options === void 0 ? void 0 : options.nonce) {
            nonce = toNonce(options.nonce);
        }
        // If no nonce is provided in the options, check the transformedRequest body
        else if (transformedRequest.body.nonce) {
            nonce = toNonce(transformedRequest.body.nonce);
        }
        // If no nonce is found, set it to undefined
        else {
            nonce = undefined;
        }
        // Assign the determined nonce to the submit object
        submit.nonce = nonce;
        /**
         * Converts an ArrayBuffer or Uint8Array to a Nonce type.
         * @param buf - The buffer to convert.
         * @returns The buffer as a Nonce.
         */
        function toNonce(buf) {
            return new Uint8Array(buf);
        }
        // Apply transform for identity.
        transformedRequest = (await id.transformRequest(transformedRequest));
        const body = _cbor__WEBPACK_IMPORTED_MODULE_3__.encode(transformedRequest.body);
        const backoff = __classPrivateFieldGet(this, _HttpAgent_backoffStrategy, "f").call(this);
        const requestId = (0,_request_id__WEBPACK_IMPORTED_MODULE_4__.requestIdOf)(submit);
        try {
            // Attempt v3 sync call
            const requestSync = () => {
                this.log.print(`fetching "/api/v3/canister/${ecid.toText()}/call" with request:`, transformedRequest);
                return __classPrivateFieldGet(this, _HttpAgent_fetch, "f").call(this, '' + new URL(`/api/v3/canister/${ecid.toText()}/call`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet(this, _HttpAgent_callOptions, "f")), transformedRequest.request), { body }));
            };
            const requestAsync = () => {
                this.log.print(`fetching "/api/v2/canister/${ecid.toText()}/call" with request:`, transformedRequest);
                return __classPrivateFieldGet(this, _HttpAgent_fetch, "f").call(this, '' + new URL(`/api/v2/canister/${ecid.toText()}/call`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet(this, _HttpAgent_callOptions, "f")), transformedRequest.request), { body }));
            };
            const request = __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
                request: callSync ? requestSync : requestAsync,
                backoff,
                tries: 0,
            });
            const response = await request;
            const responseBuffer = await response.arrayBuffer();
            const responseBody = (response.status === 200 && responseBuffer.byteLength > 0
                ? _cbor__WEBPACK_IMPORTED_MODULE_3__.decode(responseBuffer)
                : null);
            // Update the watermark with the latest time from consensus
            if (responseBody && 'certificate' in responseBody) {
                const time = await this.parseTimeFromResponse({
                    certificate: responseBody.certificate,
                });
                __classPrivateFieldSet(this, _HttpAgent_waterMark, time, "f");
            }
            return {
                requestId,
                response: {
                    ok: response.ok,
                    status: response.status,
                    statusText: response.statusText,
                    body: responseBody,
                    headers: (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform)(response.headers),
                },
                requestDetails: submit,
            };
        }
        catch (error) {
            // If the error is due to the v3 api not being supported, fall back to v2
            if (error.message.includes('v3 api not supported.')) {
                this.log.warn('v3 api not supported. Fall back to v2');
                return this.call(canisterId, Object.assign(Object.assign({}, options), { 
                    // disable v3 api
                    callSync: false }), identity);
            }
            const message = `Error while making call: ${(_b = error.message) !== null && _b !== void 0 ? _b : String(error)}`;
            const callError = new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentCallError(message, error, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)(requestId), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)(transformedRequest.body.sender_pubkey), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)(transformedRequest.body.sender_sig), String(transformedRequest.body.content.ingress_expiry['_value']));
            this.log.error(message, callError);
            throw callError;
        }
    }
    async query(canisterId, fields, identity) {
        var _a, _b, _c, _d;
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        const backoff = __classPrivateFieldGet(this, _HttpAgent_backoffStrategy, "f").call(this);
        const ecid = fields.effectiveCanisterId
            ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(fields.effectiveCanisterId)
            : _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        this.log.print(`ecid ${ecid.toString()}`);
        this.log.print(`canisterId ${canisterId.toString()}`);
        let transformedRequest = undefined;
        let queryResult;
        const id = await (identity !== undefined ? identity : __classPrivateFieldGet(this, _HttpAgent_identity, "f"));
        if (!id) {
            throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
        }
        const canister = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.anonymous();
        const request = {
            request_type: "query" /* ReadRequestType.Query */,
            canister_id: canister,
            method_name: fields.methodName,
            arg: fields.arg,
            sender,
            ingress_expiry: new _transforms__WEBPACK_IMPORTED_MODULE_6__.Expiry(__classPrivateFieldGet(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS),
        };
        const requestId = (0,_request_id__WEBPACK_IMPORTED_MODULE_4__.requestIdOf)(request);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformedRequest = await this._transform({
            request: {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (__classPrivateFieldGet(this, _HttpAgent_credentials, "f") ? { Authorization: 'Basic ' + btoa(__classPrivateFieldGet(this, _HttpAgent_credentials, "f")) } : {})),
            },
            endpoint: "read" /* Endpoint.Query */,
            body: request,
        });
        // Apply transform for identity.
        transformedRequest = (await (id === null || id === void 0 ? void 0 : id.transformRequest(transformedRequest)));
        const body = _cbor__WEBPACK_IMPORTED_MODULE_3__.encode(transformedRequest.body);
        const args = {
            canister: canister.toText(),
            ecid,
            transformedRequest,
            body,
            requestId,
            backoff,
            tries: 0,
        };
        const makeQuery = async () => {
            return {
                requestDetails: request,
                query: await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery).call(this, args),
            };
        };
        const getSubnetStatus = async () => {
            if (!__classPrivateFieldGet(this, _HttpAgent_verifyQuerySignatures, "f")) {
                return undefined;
            }
            const subnetStatus = __classPrivateFieldGet(this, _HttpAgent_subnetKeys, "f").get(ecid.toString());
            if (subnetStatus) {
                return subnetStatus;
            }
            await this.fetchSubnetKeys(ecid.toString());
            return __classPrivateFieldGet(this, _HttpAgent_subnetKeys, "f").get(ecid.toString());
        };
        // Attempt to make the query i=retryTimes times
        // Make query and fetch subnet keys in parallel
        try {
            const [_queryResult, subnetStatus] = await Promise.all([makeQuery(), getSubnetStatus()]);
            queryResult = _queryResult;
            const { requestDetails, query } = queryResult;
            const queryWithDetails = Object.assign(Object.assign({}, query), { requestDetails });
            this.log.print('Query response:', queryWithDetails);
            // Skip verification if the user has disabled it
            if (!__classPrivateFieldGet(this, _HttpAgent_verifyQuerySignatures, "f")) {
                return queryWithDetails;
            }
            try {
                return __classPrivateFieldGet(this, _HttpAgent_verifyQueryResponse, "f").call(this, queryWithDetails, subnetStatus);
            }
            catch (_e) {
                // In case the node signatures have changed, refresh the subnet keys and try again
                this.log.warn('Query response verification failed. Retrying with fresh subnet keys.');
                __classPrivateFieldGet(this, _HttpAgent_subnetKeys, "f").delete(canisterId.toString());
                await this.fetchSubnetKeys(ecid.toString());
                const updatedSubnetStatus = __classPrivateFieldGet(this, _HttpAgent_subnetKeys, "f").get(canisterId.toString());
                if (!updatedSubnetStatus) {
                    throw new _certificate__WEBPACK_IMPORTED_MODULE_10__.CertificateVerificationError('Invalid signature from replica signed query: no matching node key found.');
                }
                return __classPrivateFieldGet(this, _HttpAgent_verifyQueryResponse, "f").call(this, queryWithDetails, updatedSubnetStatus);
            }
        }
        catch (error) {
            const message = `Error while making call: ${(_a = error.message) !== null && _a !== void 0 ? _a : String(error)}`;
            const queryError = new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentQueryError(message, error, String(requestId), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)((_b = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _b === void 0 ? void 0 : _b.sender_pubkey), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)((_c = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _c === void 0 ? void 0 : _c.sender_sig), String((_d = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _d === void 0 ? void 0 : _d.content.ingress_expiry['_value']));
            this.log.error(message, queryError);
            throw queryError;
        }
    }
    async createReadStateRequest(fields, identity) {
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        const id = await (identity !== undefined ? await identity : await __classPrivateFieldGet(this, _HttpAgent_identity, "f"));
        if (!id) {
            throw new IdentityInvalidError("This identity has expired due this application's security policy. Please refresh your authentication.");
        }
        const sender = (id === null || id === void 0 ? void 0 : id.getPrincipal()) || _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.anonymous();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transformedRequest = await this._transform({
            request: {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/cbor' }, (__classPrivateFieldGet(this, _HttpAgent_credentials, "f") ? { Authorization: 'Basic ' + btoa(__classPrivateFieldGet(this, _HttpAgent_credentials, "f")) } : {})),
            },
            endpoint: "read_state" /* Endpoint.ReadState */,
            body: {
                request_type: "read_state" /* ReadRequestType.ReadState */,
                paths: fields.paths,
                sender,
                ingress_expiry: new _transforms__WEBPACK_IMPORTED_MODULE_6__.Expiry(__classPrivateFieldGet(this, _HttpAgent_maxIngressExpiryInMinutes, "f") * MINUTE_TO_MSECS),
            },
        });
        // Apply transform for identity.
        return id === null || id === void 0 ? void 0 : id.transformRequest(transformedRequest);
    }
    async readState(canisterId, fields, identity, 
    // eslint-disable-next-line
    request) {
        var _a, _b, _c, _d;
        function getRequestId(fields) {
            for (const path of fields.paths) {
                const [pathName, value] = path;
                const request_status = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufFromBufLike)(new TextEncoder().encode('request_status'));
                if ((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufEquals)(pathName, request_status)) {
                    return value;
                }
            }
        }
        const requestId = getRequestId(fields);
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        const canister = typeof canisterId === 'string' ? _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromText(canisterId) : canisterId;
        const transformedRequest = request !== null && request !== void 0 ? request : (await this.createReadStateRequest(fields, identity));
        const body = _cbor__WEBPACK_IMPORTED_MODULE_3__.encode(transformedRequest.body);
        this.log.print(`fetching "/api/v2/canister/${canister}/read_state" with request:`, transformedRequest);
        // TODO - https://dfinity.atlassian.net/browse/SDK-1092
        const backoff = __classPrivateFieldGet(this, _HttpAgent_backoffStrategy, "f").call(this);
        try {
            const response = await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
                request: () => __classPrivateFieldGet(this, _HttpAgent_fetch, "f").call(this, '' + new URL(`/api/v2/canister/${canister.toString()}/read_state`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet(this, _HttpAgent_fetchOptions, "f")), transformedRequest.request), { body })),
                backoff,
                tries: 0,
            });
            if (!response.ok) {
                throw new Error(`Server returned an error:\n` +
                    `  Code: ${response.status} (${response.statusText})\n` +
                    `  Body: ${await response.text()}\n`);
            }
            const decodedResponse = _cbor__WEBPACK_IMPORTED_MODULE_3__.decode(await response.arrayBuffer());
            this.log.print('Read state response:', decodedResponse);
            const parsedTime = await this.parseTimeFromResponse(decodedResponse);
            if (parsedTime > 0) {
                this.log.print('Read state response time:', parsedTime);
                __classPrivateFieldSet(this, _HttpAgent_waterMark, parsedTime, "f");
            }
            return decodedResponse;
        }
        catch (error) {
            const message = `Caught exception while attempting to read state: ${(_a = error.message) !== null && _a !== void 0 ? _a : String(error)}`;
            const readStateError = new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentReadStateError(message, error, String(requestId), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)((_b = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _b === void 0 ? void 0 : _b.sender_pubkey), (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHex)((_c = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _c === void 0 ? void 0 : _c.sender_sig), String((_d = transformedRequest === null || transformedRequest === void 0 ? void 0 : transformedRequest.body) === null || _d === void 0 ? void 0 : _d.content.ingress_expiry['_value']));
            this.log.error(message, readStateError);
            throw readStateError;
        }
    }
    async parseTimeFromResponse(response) {
        let tree;
        if (response.certificate) {
            const decoded = _cbor__WEBPACK_IMPORTED_MODULE_3__.decode(response.certificate);
            if (decoded && 'tree' in decoded) {
                tree = decoded.tree;
            }
            else {
                throw new Error('Could not decode time from response');
            }
            const timeLookup = (0,_certificate__WEBPACK_IMPORTED_MODULE_10__.lookup_path)(['time'], tree);
            if (timeLookup.status !== _certificate__WEBPACK_IMPORTED_MODULE_10__.LookupStatus.Found) {
                throw new Error('Time was not found in the response or was not in its expected format.');
            }
            if (!(timeLookup.value instanceof ArrayBuffer) && !ArrayBuffer.isView(timeLookup)) {
                throw new Error('Time was not found in the response or was not in its expected format.');
            }
            const date = (0,_utils_leb__WEBPACK_IMPORTED_MODULE_13__.decodeTime)((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufFromBufLike)(timeLookup.value));
            this.log.print('Time from response:', date);
            this.log.print('Time from response in milliseconds:', Number(date));
            return Number(date);
        }
        else {
            this.log.warn('No certificate found in response');
        }
        return 0;
    }
    /**
     * Allows agent to sync its time with the network. Can be called during intialization or mid-lifecycle if the device's clock has drifted away from the network time. This is necessary to set the Expiry for a request
     * @param {Principal} canisterId - Pass a canister ID if you need to sync the time with a particular replica. Uses the management canister by default
     */
    async syncTime(canisterId) {
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        const CanisterStatus = await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../../canisterStatus */ "./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js"));
        const callTime = Date.now();
        try {
            if (!canisterId) {
                this.log.print('Syncing time with the IC. No canisterId provided, so falling back to ryjl3-tyaaa-aaaaa-aaaba-cai');
            }
            const anonymousAgent = HttpAgent.createSync({
                identity: new _auth__WEBPACK_IMPORTED_MODULE_2__.AnonymousIdentity(),
                host: this.host.toString(),
                fetch: __classPrivateFieldGet(this, _HttpAgent_fetch, "f"),
                retryTimes: 0,
            });
            const status = await CanisterStatus.request({
                // Fall back with canisterId of the ICP Ledger
                canisterId: canisterId !== null && canisterId !== void 0 ? canisterId : _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from('ryjl3-tyaaa-aaaaa-aaaba-cai'),
                agent: anonymousAgent,
                paths: ['time'],
            });
            const replicaTime = status.get('time');
            if (replicaTime) {
                __classPrivateFieldSet(this, _HttpAgent_timeDiffMsecs, Number(replicaTime) - Number(callTime), "f");
                this.log.notify({
                    message: `Syncing time: offset of ${__classPrivateFieldGet(this, _HttpAgent_timeDiffMsecs, "f")}`,
                    level: 'info',
                });
            }
        }
        catch (error) {
            this.log.error('Caught exception while attempting to sync time', error);
        }
    }
    async status() {
        const headers = __classPrivateFieldGet(this, _HttpAgent_credentials, "f")
            ? {
                Authorization: 'Basic ' + btoa(__classPrivateFieldGet(this, _HttpAgent_credentials, "f")),
            }
            : {};
        this.log.print(`fetching "/api/v2/status"`);
        const backoff = __classPrivateFieldGet(this, _HttpAgent_backoffStrategy, "f").call(this);
        const response = await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, {
            backoff,
            request: () => __classPrivateFieldGet(this, _HttpAgent_fetch, "f").call(this, '' + new URL(`/api/v2/status`, this.host), Object.assign({ headers }, __classPrivateFieldGet(this, _HttpAgent_fetchOptions, "f"))),
            tries: 0,
        });
        return _cbor__WEBPACK_IMPORTED_MODULE_3__.decode(await response.arrayBuffer());
    }
    async fetchRootKey() {
        let result;
        // Wait for already pending promise to avoid duplicate calls
        if (__classPrivateFieldGet(this, _HttpAgent_rootKeyPromise, "f")) {
            result = await __classPrivateFieldGet(this, _HttpAgent_rootKeyPromise, "f");
        }
        else {
            // construct promise
            __classPrivateFieldSet(this, _HttpAgent_rootKeyPromise, new Promise((resolve, reject) => {
                this.status()
                    .then(value => {
                    // Hex-encoded version of the replica root key
                    const rootKey = value.root_key;
                    this.rootKey = rootKey;
                    resolve(rootKey);
                })
                    .catch(reject);
            }), "f");
            result = await __classPrivateFieldGet(this, _HttpAgent_rootKeyPromise, "f");
        }
        // clear rootkey promise and return result
        __classPrivateFieldSet(this, _HttpAgent_rootKeyPromise, null, "f");
        return result;
    }
    invalidateIdentity() {
        __classPrivateFieldSet(this, _HttpAgent_identity, null, "f");
    }
    replaceIdentity(identity) {
        __classPrivateFieldSet(this, _HttpAgent_identity, Promise.resolve(identity), "f");
    }
    async fetchSubnetKeys(canisterId) {
        await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_rootKeyGuard).call(this);
        const effectiveCanisterId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        const response = await (0,_canisterStatus__WEBPACK_IMPORTED_MODULE_9__.request)({
            canisterId: effectiveCanisterId,
            paths: ['subnet'],
            agent: this,
        });
        const subnetResponse = response.get('subnet');
        if (subnetResponse && typeof subnetResponse === 'object' && 'nodeKeys' in subnetResponse) {
            __classPrivateFieldGet(this, _HttpAgent_subnetKeys, "f").set(effectiveCanisterId.toText(), subnetResponse);
            return subnetResponse;
        }
        // If the subnet status is not returned, return undefined
        return undefined;
    }
    _transform(request) {
        let p = Promise.resolve(request);
        if (request.endpoint === "call" /* Endpoint.Call */) {
            for (const fn of __classPrivateFieldGet(this, _HttpAgent_updatePipeline, "f")) {
                p = p.then(r => fn(r).then(r2 => r2 || r));
            }
        }
        else {
            for (const fn of __classPrivateFieldGet(this, _HttpAgent_queryPipeline, "f")) {
                p = p.then(r => fn(r).then(r2 => r2 || r));
            }
        }
        return p;
    }
}
_HttpAgent_rootKeyPromise = new WeakMap(), _HttpAgent_shouldFetchRootKey = new WeakMap(), _HttpAgent_identity = new WeakMap(), _HttpAgent_fetch = new WeakMap(), _HttpAgent_fetchOptions = new WeakMap(), _HttpAgent_callOptions = new WeakMap(), _HttpAgent_timeDiffMsecs = new WeakMap(), _HttpAgent_credentials = new WeakMap(), _HttpAgent_retryTimes = new WeakMap(), _HttpAgent_backoffStrategy = new WeakMap(), _HttpAgent_maxIngressExpiryInMinutes = new WeakMap(), _HttpAgent_waterMark = new WeakMap(), _HttpAgent_queryPipeline = new WeakMap(), _HttpAgent_updatePipeline = new WeakMap(), _HttpAgent_subnetKeys = new WeakMap(), _HttpAgent_verifyQuerySignatures = new WeakMap(), _HttpAgent_verifyQueryResponse = new WeakMap(), _HttpAgent_instances = new WeakSet(), _HttpAgent_requestAndRetryQuery = async function _HttpAgent_requestAndRetryQuery(args) {
    var _a, _b;
    const { ecid, transformedRequest, body, requestId, backoff, tries } = args;
    const delay = tries === 0 ? 0 : backoff.next();
    this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with tries:`, {
        tries,
        backoff,
        delay,
    });
    // If delay is null, the backoff strategy is exhausted due to a maximum number of retries, duration, or other reason
    if (delay === null) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
    }
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    let response;
    // Make the request and retry if it throws an error
    try {
        this.log.print(`fetching "/api/v2/canister/${ecid.toString()}/query" with request:`, transformedRequest);
        const fetchResponse = await __classPrivateFieldGet(this, _HttpAgent_fetch, "f").call(this, '' + new URL(`/api/v2/canister/${ecid.toString()}/query`, this.host), Object.assign(Object.assign(Object.assign({}, __classPrivateFieldGet(this, _HttpAgent_fetchOptions, "f")), transformedRequest.request), { body }));
        if (fetchResponse.status === 200) {
            const queryResponse = _cbor__WEBPACK_IMPORTED_MODULE_3__.decode(await fetchResponse.arrayBuffer());
            response = Object.assign(Object.assign({}, queryResponse), { httpDetails: {
                    ok: fetchResponse.ok,
                    status: fetchResponse.status,
                    statusText: fetchResponse.statusText,
                    headers: (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform)(fetchResponse.headers),
                }, requestId });
        }
        else {
            throw new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentHTTPResponseError(`Gateway returned an error:\n` +
                `  Code: ${fetchResponse.status} (${fetchResponse.statusText})\n` +
                `  Body: ${await fetchResponse.text()}\n`, {
                ok: fetchResponse.ok,
                status: fetchResponse.status,
                statusText: fetchResponse.statusText,
                headers: (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform)(fetchResponse.headers),
            });
        }
    }
    catch (error) {
        if (tries < __classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")) {
            this.log.warn(`Caught exception while attempting to make query:\n` +
                `  ${error}\n` +
                `  Retrying query.`);
            return await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery).call(this, Object.assign(Object.assign({}, args), { tries: tries + 1 }));
        }
        throw error;
    }
    const timestamp = (_b = (_a = response.signatures) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.timestamp;
    // Skip watermark verification if the user has set verifyQuerySignatures to false
    if (!__classPrivateFieldGet(this, _HttpAgent_verifyQuerySignatures, "f")) {
        return response;
    }
    if (!timestamp) {
        throw new Error('Timestamp not found in query response. This suggests a malformed or malicious response.');
    }
    // Convert the timestamp to milliseconds
    const timeStampInMs = Number(BigInt(timestamp) / BigInt(1000000));
    this.log.print('watermark and timestamp', {
        waterMark: this.waterMark,
        timestamp: timeStampInMs,
    });
    // If the timestamp is less than the watermark, retry the request up to the retry limit
    if (Number(this.waterMark) > timeStampInMs) {
        const error = new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError('Timestamp is below the watermark. Retrying query.');
        this.log.error('Timestamp is below', error, {
            timestamp,
            waterMark: this.waterMark,
        });
        if (tries < __classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")) {
            return await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetryQuery).call(this, Object.assign(Object.assign({}, args), { tries: tries + 1 }));
        }
        {
            throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
        }
    }
    return response;
}, _HttpAgent_requestAndRetry = async function _HttpAgent_requestAndRetry(args) {
    const { request, backoff, tries } = args;
    const delay = tries === 0 ? 0 : backoff.next();
    // If delay is null, the backoff strategy is exhausted due to a maximum number of retries, duration, or other reason
    if (delay === null) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`Timestamp failed to pass the watermark after retrying the configured ${__classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")} times. We cannot guarantee the integrity of the response since it could be a replay attack.`);
    }
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    let response;
    try {
        response = await request();
    }
    catch (error) {
        if (__classPrivateFieldGet(this, _HttpAgent_retryTimes, "f") > tries) {
            this.log.warn(`Caught exception while attempting to make request:\n` +
                `  ${error}\n` +
                `  Retrying request.`);
            // Delay the request by the configured backoff strategy
            return await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, { request, backoff, tries: tries + 1 });
        }
        throw error;
    }
    if (response.ok) {
        return response;
    }
    const responseText = await response.clone().text();
    const errorMessage = `Server returned an error:\n` +
        `  Code: ${response.status} (${response.statusText})\n` +
        `  Body: ${responseText}\n`;
    if (response.status === 404 && response.url.includes('api/v3')) {
        throw new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentHTTPResponseError('v3 api not supported. Fall back to v2', {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform)(response.headers),
        });
    }
    if (tries < __classPrivateFieldGet(this, _HttpAgent_retryTimes, "f")) {
        return await __classPrivateFieldGet(this, _HttpAgent_instances, "m", _HttpAgent_requestAndRetry).call(this, { request, backoff, tries: tries + 1 });
    }
    throw new _errors__WEBPACK_IMPORTED_MODULE_8__.AgentHTTPResponseError(errorMessage, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: (0,_transforms__WEBPACK_IMPORTED_MODULE_6__.httpHeadersTransform)(response.headers),
    });
}, _HttpAgent_rootKeyGuard = async function _HttpAgent_rootKeyGuard() {
    if (this.rootKey) {
        return;
    }
    else if (this.rootKey === null && __classPrivateFieldGet(this, _HttpAgent_shouldFetchRootKey, "f")) {
        await this.fetchRootKey();
    }
    else {
        throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(`Invalid root key detected. The root key for this agent is ${this.rootKey} and the shouldFetchRootKey value is set to ${__classPrivateFieldGet(this, _HttpAgent_shouldFetchRootKey, "f")}. The root key should only be unknown if you are in local development. Otherwise you should avoid fetching and use the default IC Root Key or the known root key of your environment.`);
    }
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Expiry": () => (/* binding */ Expiry),
/* harmony export */   "makeNonceTransform": () => (/* binding */ makeNonceTransform),
/* harmony export */   "makeExpiryTransform": () => (/* binding */ makeExpiryTransform),
/* harmony export */   "httpHeadersTransform": () => (/* binding */ httpHeadersTransform)
/* harmony export */ });
/* harmony import */ var _dfinity_candid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/candid */ "./node_modules/@dfinity/candid/lib/esm/index.js");
/* harmony import */ var simple_cbor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! simple-cbor */ "./node_modules/simple-cbor/src/index.js");
/* harmony import */ var simple_cbor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(simple_cbor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types */ "./node_modules/@dfinity/agent/lib/esm/agent/http/types.js");



const NANOSECONDS_PER_MILLISECONDS = BigInt(1000000);
const REPLICA_PERMITTED_DRIFT_MILLISECONDS = 60 * 1000;
class Expiry {
    constructor(deltaInMSec) {
        // if ingress as seconds is less than 90, round to nearest second
        if (deltaInMSec < 90 * 1000) {
            // Raw value without subtraction of REPLICA_PERMITTED_DRIFT_MILLISECONDS
            const raw_value = BigInt(Date.now() + deltaInMSec) * NANOSECONDS_PER_MILLISECONDS;
            const ingress_as_seconds = raw_value / BigInt(1000000000);
            this._value = ingress_as_seconds * BigInt(1000000000);
            return;
        }
        // Use bigint because it can overflow the maximum number allowed in a double float.
        const raw_value = BigInt(Math.floor(Date.now() + deltaInMSec - REPLICA_PERMITTED_DRIFT_MILLISECONDS)) *
            NANOSECONDS_PER_MILLISECONDS;
        // round down to the nearest second (since )
        const ingress_as_seconds = raw_value / BigInt(1000000000);
        // round down to nearest minute
        const ingress_as_minutes = ingress_as_seconds / BigInt(60);
        const rounded_down_nanos = ingress_as_minutes * BigInt(60) * BigInt(1000000000);
        this._value = rounded_down_nanos;
    }
    toCBOR() {
        // TODO: change this to take the minimum amount of space (it always takes 8 bytes now).
        return simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.u64(this._value.toString(16), 16);
    }
    toHash() {
        return (0,_dfinity_candid__WEBPACK_IMPORTED_MODULE_0__.lebEncode)(this._value);
    }
}
/**
 * Create a Nonce transform, which takes a function that returns a Buffer, and adds it
 * as the nonce to every call requests.
 * @param nonceFn A function that returns a buffer. By default uses a semi-random method.
 */
function makeNonceTransform(nonceFn = _types__WEBPACK_IMPORTED_MODULE_2__.makeNonce) {
    return async (request) => {
        // Nonce needs to be inserted into the header for all requests, to enable logs to be correlated with requests.
        const headers = request.request.headers;
        // TODO: uncomment this when the http proxy supports it.
        // headers.set('X-IC-Request-ID', toHex(new Uint8Array(nonce)));
        request.request.headers = headers;
        // Nonce only needs to be inserted into the body for async calls, to prevent replay attacks.
        if (request.endpoint === "call" /* Endpoint.Call */) {
            request.body.nonce = nonceFn();
        }
    };
}
/**
 * Create a transform that adds a delay (by default 5 minutes) to the expiry.
 *
 * @param delayInMilliseconds The delay to add to the call time, in milliseconds.
 */
function makeExpiryTransform(delayInMilliseconds) {
    return async (request) => {
        request.body.ingress_expiry = new Expiry(delayInMilliseconds);
    };
}
/**
 * Maps the default fetch headers field to the serializable HttpHeaderField.
 *
 * @param headers Fetch definition of the headers type
 * @returns array of header fields
 */
function httpHeadersTransform(headers) {
    const headerFields = [];
    headers.forEach((value, key) => {
        headerFields.push([key, value]);
    });
    return headerFields;
}
//# sourceMappingURL=transforms.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/http/types.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/http/types.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SubmitRequestType": () => (/* binding */ SubmitRequestType),
/* harmony export */   "makeNonce": () => (/* binding */ makeNonce)
/* harmony export */ });
/* harmony import */ var _utils_random__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/random */ "./node_modules/@dfinity/agent/lib/esm/utils/random.js");

// The types of values allowed in the `request_type` field for submit requests.
var SubmitRequestType;
(function (SubmitRequestType) {
    SubmitRequestType["Call"] = "call";
})(SubmitRequestType || (SubmitRequestType = {}));
/**
 * Create a random Nonce, based on random values
 */
function makeNonce() {
    // Encode 128 bits.
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    const rand1 = (0,_utils_random__WEBPACK_IMPORTED_MODULE_0__.randomNumber)();
    const rand2 = (0,_utils_random__WEBPACK_IMPORTED_MODULE_0__.randomNumber)();
    const rand3 = (0,_utils_random__WEBPACK_IMPORTED_MODULE_0__.randomNumber)();
    const rand4 = (0,_utils_random__WEBPACK_IMPORTED_MODULE_0__.randomNumber)();
    view.setUint32(0, rand1);
    view.setUint32(4, rand2);
    view.setUint32(8, rand3);
    view.setUint32(12, rand4);
    return buffer;
}
//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ReplicaRejectCode": () => (/* reexport safe */ _api__WEBPACK_IMPORTED_MODULE_0__.ReplicaRejectCode),
/* harmony export */   "AgentCallError": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.AgentCallError),
/* harmony export */   "AgentHTTPResponseError": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.AgentHTTPResponseError),
/* harmony export */   "AgentQueryError": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.AgentQueryError),
/* harmony export */   "AgentReadStateError": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.AgentReadStateError),
/* harmony export */   "Expiry": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.Expiry),
/* harmony export */   "HttpAgent": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.HttpAgent),
/* harmony export */   "IC_ROOT_KEY": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.IC_ROOT_KEY),
/* harmony export */   "IdentityInvalidError": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.IdentityInvalidError),
/* harmony export */   "MANAGEMENT_CANISTER_ID": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.MANAGEMENT_CANISTER_ID),
/* harmony export */   "RequestStatusResponseStatus": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.RequestStatusResponseStatus),
/* harmony export */   "httpHeadersTransform": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.httpHeadersTransform),
/* harmony export */   "makeExpiryTransform": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.makeExpiryTransform),
/* harmony export */   "makeNonce": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.makeNonce),
/* harmony export */   "makeNonceTransform": () => (/* reexport safe */ _http__WEBPACK_IMPORTED_MODULE_1__.makeNonceTransform),
/* harmony export */   "ProxyAgent": () => (/* reexport safe */ _proxy__WEBPACK_IMPORTED_MODULE_3__.ProxyAgent),
/* harmony export */   "ProxyMessageKind": () => (/* reexport safe */ _proxy__WEBPACK_IMPORTED_MODULE_3__.ProxyMessageKind),
/* harmony export */   "ProxyStubAgent": () => (/* reexport safe */ _proxy__WEBPACK_IMPORTED_MODULE_3__.ProxyStubAgent),
/* harmony export */   "getDefaultAgent": () => (/* binding */ getDefaultAgent)
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./node_modules/@dfinity/agent/lib/esm/agent/api.js");
/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./http */ "./node_modules/@dfinity/agent/lib/esm/agent/http/index.js");
/* harmony import */ var _http_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http/errors */ "./node_modules/@dfinity/agent/lib/esm/agent/http/errors.js");
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./proxy */ "./node_modules/@dfinity/agent/lib/esm/agent/proxy.js");




function getDefaultAgent() {
    const agent = typeof window === 'undefined'
        ? typeof __webpack_require__.g === 'undefined'
            ? typeof self === 'undefined'
                ? undefined
                : self.ic.agent
            : __webpack_require__.g.ic.agent
        : window.ic.agent;
    if (!agent) {
        throw new Error('No Agent could be found.');
    }
    return agent;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/agent/proxy.js":
/*!************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/agent/proxy.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProxyMessageKind": () => (/* binding */ ProxyMessageKind),
/* harmony export */   "ProxyStubAgent": () => (/* binding */ ProxyStubAgent),
/* harmony export */   "ProxyAgent": () => (/* binding */ ProxyAgent)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");

var ProxyMessageKind;
(function (ProxyMessageKind) {
    ProxyMessageKind["Error"] = "err";
    ProxyMessageKind["GetPrincipal"] = "gp";
    ProxyMessageKind["GetPrincipalResponse"] = "gpr";
    ProxyMessageKind["Query"] = "q";
    ProxyMessageKind["QueryResponse"] = "qr";
    ProxyMessageKind["Call"] = "c";
    ProxyMessageKind["CallResponse"] = "cr";
    ProxyMessageKind["ReadState"] = "rs";
    ProxyMessageKind["ReadStateResponse"] = "rsr";
    ProxyMessageKind["Status"] = "s";
    ProxyMessageKind["StatusResponse"] = "sr";
})(ProxyMessageKind || (ProxyMessageKind = {}));
// A Stub Agent that forwards calls to another Agent implementation.
class ProxyStubAgent {
    constructor(_frontend, _agent) {
        this._frontend = _frontend;
        this._agent = _agent;
    }
    onmessage(msg) {
        switch (msg.type) {
            case ProxyMessageKind.GetPrincipal:
                this._agent.getPrincipal().then(response => {
                    this._frontend({
                        id: msg.id,
                        type: ProxyMessageKind.GetPrincipalResponse,
                        response: response.toText(),
                    });
                });
                break;
            case ProxyMessageKind.Query:
                this._agent.query(...msg.args).then(response => {
                    this._frontend({
                        id: msg.id,
                        type: ProxyMessageKind.QueryResponse,
                        response,
                    });
                });
                break;
            case ProxyMessageKind.Call:
                this._agent.call(...msg.args).then(response => {
                    this._frontend({
                        id: msg.id,
                        type: ProxyMessageKind.CallResponse,
                        response,
                    });
                });
                break;
            case ProxyMessageKind.ReadState:
                this._agent.readState(...msg.args).then(response => {
                    this._frontend({
                        id: msg.id,
                        type: ProxyMessageKind.ReadStateResponse,
                        response,
                    });
                });
                break;
            case ProxyMessageKind.Status:
                this._agent.status().then(response => {
                    this._frontend({
                        id: msg.id,
                        type: ProxyMessageKind.StatusResponse,
                        response,
                    });
                });
                break;
            default:
                throw new Error(`Invalid message received: ${JSON.stringify(msg)}`);
        }
    }
}
// An Agent that forwards calls to a backend. The calls are serialized
class ProxyAgent {
    constructor(_backend) {
        this._backend = _backend;
        this._nextId = 0;
        this._pendingCalls = new Map();
        this.rootKey = null;
    }
    onmessage(msg) {
        const id = msg.id;
        const maybePromise = this._pendingCalls.get(id);
        if (!maybePromise) {
            throw new Error('A proxy get the same message twice...');
        }
        this._pendingCalls.delete(id);
        const [resolve, reject] = maybePromise;
        switch (msg.type) {
            case ProxyMessageKind.Error:
                return reject(msg.error);
            case ProxyMessageKind.GetPrincipalResponse:
            case ProxyMessageKind.CallResponse:
            case ProxyMessageKind.QueryResponse:
            case ProxyMessageKind.ReadStateResponse:
            case ProxyMessageKind.StatusResponse:
                return resolve(msg.response);
            default:
                throw new Error(`Invalid message being sent to ProxyAgent: ${JSON.stringify(msg)}`);
        }
    }
    async getPrincipal() {
        return this._sendAndWait({
            id: this._nextId++,
            type: ProxyMessageKind.GetPrincipal,
        }).then(principal => {
            if (typeof principal !== 'string') {
                throw new Error('Invalid principal received.');
            }
            return _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromText(principal);
        });
    }
    readState(canisterId, fields) {
        return this._sendAndWait({
            id: this._nextId++,
            type: ProxyMessageKind.ReadState,
            args: [canisterId.toString(), fields],
        });
    }
    call(canisterId, fields) {
        return this._sendAndWait({
            id: this._nextId++,
            type: ProxyMessageKind.Call,
            args: [canisterId.toString(), fields],
        });
    }
    status() {
        return this._sendAndWait({
            id: this._nextId++,
            type: ProxyMessageKind.Status,
        });
    }
    query(canisterId, fields) {
        return this._sendAndWait({
            id: this._nextId++,
            type: ProxyMessageKind.Query,
            args: [canisterId.toString(), fields],
        });
    }
    async _sendAndWait(msg) {
        return new Promise((resolve, reject) => {
            this._pendingCalls.set(msg.id, [resolve, reject]);
            this._backend(msg);
        });
    }
    async fetchRootKey() {
        // Hex-encoded version of the replica root key
        const rootKey = (await this.status()).root_key;
        this.rootKey = rootKey;
        return rootKey;
    }
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/auth.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/auth.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SignIdentity": () => (/* binding */ SignIdentity),
/* harmony export */   "AnonymousIdentity": () => (/* binding */ AnonymousIdentity),
/* harmony export */   "createIdentityDescriptor": () => (/* binding */ createIdentityDescriptor)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _request_id__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./request_id */ "./node_modules/@dfinity/agent/lib/esm/request_id.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};



const domainSeparator = new TextEncoder().encode('\x0Aic-request');
/**
 * An Identity that can sign blobs.
 */
class SignIdentity {
    /**
     * Get the principal represented by this identity. Normally should be a
     * `Principal.selfAuthenticating()`.
     */
    getPrincipal() {
        if (!this._principal) {
            this._principal = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.selfAuthenticating(new Uint8Array(this.getPublicKey().toDer()));
        }
        return this._principal;
    }
    /**
     * Transform a request into a signed version of the request. This is done last
     * after the transforms on the body of a request. The returned object can be
     * anything, but must be serializable to CBOR.
     * @param request - internet computer request to transform
     */
    async transformRequest(request) {
        const { body } = request, fields = __rest(request, ["body"]);
        const requestId = (0,_request_id__WEBPACK_IMPORTED_MODULE_1__.requestIdOf)(body);
        return Object.assign(Object.assign({}, fields), { body: {
                content: body,
                sender_pubkey: this.getPublicKey().toDer(),
                sender_sig: await this.sign((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.concat)(domainSeparator, requestId)),
            } });
    }
}
class AnonymousIdentity {
    getPrincipal() {
        return _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.anonymous();
    }
    async transformRequest(request) {
        return Object.assign(Object.assign({}, request), { body: { content: request.body } });
    }
}
/**
 * Create an IdentityDescriptor from a @dfinity/identity Identity
 * @param identity - identity describe in returned descriptor
 */
function createIdentityDescriptor(identity) {
    const identityIndicator = 'getPublicKey' in identity
        ? { type: 'PublicKeyIdentity', publicKey: (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.toHex)(identity.getPublicKey().toDer()) }
        : { type: 'AnonymousIdentity' };
    return identityIndicator;
}
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CustomPath": () => (/* binding */ CustomPath),
/* harmony export */   "request": () => (/* binding */ request),
/* harmony export */   "fetchNodeKeys": () => (/* binding */ fetchNodeKeys),
/* harmony export */   "encodePath": () => (/* binding */ encodePath)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../errors */ "./node_modules/@dfinity/agent/lib/esm/errors.js");
/* harmony import */ var _certificate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../certificate */ "./node_modules/@dfinity/agent/lib/esm/certificate.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _cbor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../cbor */ "./node_modules/@dfinity/agent/lib/esm/cbor.js");
/* harmony import */ var _utils_leb__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/leb */ "./node_modules/@dfinity/agent/lib/esm/utils/leb.js");
/** @module CanisterStatus */






/**
 * Interface to define a custom path. Nested paths will be represented as individual buffers, and can be created from text using TextEncoder.
 * @param {string} key the key to use to access the returned value in the canisterStatus map
 * @param {ArrayBuffer[]} path the path to the desired value, represented as an array of buffers
 * @param {string} decodeStrategy the strategy to use to decode the returned value
 */
class CustomPath {
    constructor(key, path, decodeStrategy) {
        this.key = key;
        this.path = path;
        this.decodeStrategy = decodeStrategy;
    }
}
/**
 * Request information in the request_status state tree for a given canister.
 * Can be used to request information about the canister's controllers, time, module hash, candid interface, and more.
 * @param {CanisterStatusOptions} options {@link CanisterStatusOptions}
 * @param {CanisterStatusOptions['canisterId']} options.canisterId {@link Principal}
 * @param {CanisterStatusOptions['agent']} options.agent {@link HttpAgent} optional authenticated agent to use to make the canister request. Useful for accessing private metadata under icp:private
 * @param {CanisterStatusOptions['paths']} options.paths {@link Path[]}
 * @returns {Status} object populated with data from the requested paths
 * @example
 * const status = await canisterStatus({
 *   paths: ['controllers', 'candid'],
 *   ...options
 * });
 *
 * const controllers = status.get('controllers');
 */
const request = async (options) => {
    const { agent, paths } = options;
    const canisterId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(options.canisterId);
    const uniquePaths = [...new Set(paths)];
    // Map path options to their correct formats
    const encodedPaths = uniquePaths.map(path => {
        return encodePath(path, canisterId);
    });
    const status = new Map();
    const promises = uniquePaths.map((path, index) => {
        return (async () => {
            var _a;
            try {
                const response = await agent.readState(canisterId, {
                    paths: [encodedPaths[index]],
                });
                if (agent.rootKey == null) {
                    throw new Error('Agent is missing root key');
                }
                const cert = await _certificate__WEBPACK_IMPORTED_MODULE_2__.Certificate.create({
                    certificate: response.certificate,
                    rootKey: agent.rootKey,
                    canisterId: canisterId,
                    disableTimeVerification: true,
                });
                const lookup = (cert, path) => {
                    if (path === 'subnet') {
                        if (agent.rootKey == null) {
                            throw new Error('Agent is missing root key');
                        }
                        const data = fetchNodeKeys(response.certificate, canisterId, agent.rootKey);
                        return {
                            path: path,
                            data,
                        };
                    }
                    else {
                        return {
                            path: path,
                            data: (0,_certificate__WEBPACK_IMPORTED_MODULE_2__.lookupResultToBuffer)(cert.lookup(encodePath(path, canisterId))),
                        };
                    }
                };
                // must pass in the rootKey if we have no delegation
                const { path, data } = lookup(cert, uniquePaths[index]);
                if (!data) {
                    // Typically, the cert lookup will throw
                    console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
                    if (typeof path === 'string') {
                        status.set(path, null);
                    }
                    else {
                        status.set(path.key, null);
                    }
                }
                else {
                    switch (path) {
                        case 'time': {
                            status.set(path, (0,_utils_leb__WEBPACK_IMPORTED_MODULE_5__.decodeTime)(data));
                            break;
                        }
                        case 'controllers': {
                            status.set(path, decodeControllers(data));
                            break;
                        }
                        case 'module_hash': {
                            status.set(path, decodeHex(data));
                            break;
                        }
                        case 'subnet': {
                            status.set(path, data);
                            break;
                        }
                        case 'candid': {
                            status.set(path, new TextDecoder().decode(data));
                            break;
                        }
                        default: {
                            // Check for CustomPath signature
                            if (typeof path !== 'string' && 'key' in path && 'path' in path) {
                                switch (path.decodeStrategy) {
                                    case 'raw':
                                        status.set(path.key, data);
                                        break;
                                    case 'leb128': {
                                        status.set(path.key, (0,_utils_leb__WEBPACK_IMPORTED_MODULE_5__.decodeLeb128)(data));
                                        break;
                                    }
                                    case 'cbor': {
                                        status.set(path.key, decodeCbor(data));
                                        break;
                                    }
                                    case 'hex': {
                                        status.set(path.key, decodeHex(data));
                                        break;
                                    }
                                    case 'utf-8': {
                                        status.set(path.key, decodeUtf8(data));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (error) {
                // Break on signature verification errors
                if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes('Invalid certificate')) {
                    throw new _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError(error.message);
                }
                if (typeof path !== 'string' && 'key' in path && 'path' in path) {
                    status.set(path.key, null);
                }
                else {
                    status.set(path, null);
                }
                console.group();
                console.warn(`Expected to find result for path ${path}, but instead found nothing.`);
                console.warn(error);
                console.groupEnd();
            }
        })();
    });
    // Fetch all values separately, as each option can fail
    await Promise.all(promises);
    return status;
};
const fetchNodeKeys = (certificate, canisterId, root_key) => {
    if (!canisterId._isPrincipal) {
        throw new Error('Invalid canisterId');
    }
    const cert = _cbor__WEBPACK_IMPORTED_MODULE_4__.decode(new Uint8Array(certificate));
    const tree = cert.tree;
    let delegation = cert.delegation;
    let subnetId;
    if (delegation && delegation.subnet_id) {
        subnetId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromUint8Array(new Uint8Array(delegation.subnet_id));
    }
    // On local replica, with System type subnet, there is no delegation
    else if (!delegation && typeof root_key !== 'undefined') {
        subnetId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.selfAuthenticating(new Uint8Array(root_key));
        delegation = {
            subnet_id: subnetId.toUint8Array(),
            certificate: new ArrayBuffer(0),
        };
    }
    // otherwise use default NNS subnet id
    else {
        subnetId = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.selfAuthenticating(_dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromText('tdb26-jop6k-aogll-7ltgs-eruif-6kk7m-qpktf-gdiqx-mxtrf-vb5e6-eqe').toUint8Array());
        delegation = {
            subnet_id: subnetId.toUint8Array(),
            certificate: new ArrayBuffer(0),
        };
    }
    const canisterInRange = (0,_certificate__WEBPACK_IMPORTED_MODULE_2__.check_canister_ranges)({ canisterId, subnetId, tree });
    if (!canisterInRange) {
        throw new Error('Canister not in range');
    }
    const subnetLookupResult = (0,_certificate__WEBPACK_IMPORTED_MODULE_2__.lookup_path)(['subnet', delegation.subnet_id, 'node'], tree);
    if (subnetLookupResult.status !== _certificate__WEBPACK_IMPORTED_MODULE_2__.LookupStatus.Found) {
        throw new Error('Node not found');
    }
    if (subnetLookupResult.value instanceof ArrayBuffer) {
        throw new Error('Invalid node tree');
    }
    const nodeForks = (0,_certificate__WEBPACK_IMPORTED_MODULE_2__.flatten_forks)(subnetLookupResult.value);
    const nodeKeys = new Map();
    nodeForks.forEach(fork => {
        const node_id = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(new Uint8Array(fork[1])).toText();
        const publicKeyLookupResult = (0,_certificate__WEBPACK_IMPORTED_MODULE_2__.lookup_path)(['public_key'], fork[2]);
        if (publicKeyLookupResult.status !== _certificate__WEBPACK_IMPORTED_MODULE_2__.LookupStatus.Found) {
            throw new Error('Public key not found');
        }
        const derEncodedPublicKey = publicKeyLookupResult.value;
        if (derEncodedPublicKey.byteLength !== 44) {
            throw new Error('Invalid public key length');
        }
        else {
            nodeKeys.set(node_id, derEncodedPublicKey);
        }
    });
    return {
        subnetId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromUint8Array(new Uint8Array(delegation.subnet_id)).toText(),
        nodeKeys,
    };
};
const encodePath = (path, canisterId) => {
    const encoder = new TextEncoder();
    const encode = (arg) => {
        return new DataView(encoder.encode(arg).buffer).buffer;
    };
    const canisterBuffer = new DataView(canisterId.toUint8Array().buffer).buffer;
    switch (path) {
        case 'time':
            return [encode('time')];
        case 'controllers':
            return [encode('canister'), canisterBuffer, encode('controllers')];
        case 'module_hash':
            return [encode('canister'), canisterBuffer, encode('module_hash')];
        case 'subnet':
            return [encode('subnet')];
        case 'candid':
            return [encode('canister'), canisterBuffer, encode('metadata'), encode('candid:service')];
        default: {
            // Check for CustomPath signature
            if ('key' in path && 'path' in path) {
                // For simplified metadata queries
                if (typeof path['path'] === 'string' || path['path'] instanceof ArrayBuffer) {
                    const metaPath = path.path;
                    const encoded = typeof metaPath === 'string' ? encode(metaPath) : metaPath;
                    return [encode('canister'), canisterBuffer, encode('metadata'), encoded];
                    // For non-metadata, return the provided custompath
                }
                else {
                    return path['path'];
                }
            }
        }
    }
    throw new Error(`An unexpeected error was encountered while encoding your path for canister status. Please ensure that your path, ${path} was formatted correctly.`);
};
const decodeHex = (buf) => {
    return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.toHex)(buf);
};
const decodeCbor = (buf) => {
    return _cbor__WEBPACK_IMPORTED_MODULE_4__.decode(buf);
};
const decodeUtf8 = (buf) => {
    return new TextDecoder().decode(buf);
};
// Controllers are CBOR-encoded buffers
const decodeControllers = (buf) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const controllersRaw = decodeCbor(buf);
    return controllersRaw.map((buf) => {
        return _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromUint8Array(new Uint8Array(buf));
    });
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/canisters/asset.js":
/*!****************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/canisters/asset.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAssetCanisterActor": () => (/* binding */ createAssetCanisterActor)
/* harmony export */ });
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../actor */ "./node_modules/@dfinity/agent/lib/esm/actor.js");
/* harmony import */ var _asset_idl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asset_idl */ "./node_modules/@dfinity/agent/lib/esm/canisters/asset_idl.js");


/**
 * Create a management canister actor.
 * @param config
 */
function createAssetCanisterActor(config) {
    return _actor__WEBPACK_IMPORTED_MODULE_0__.Actor.createActor(_asset_idl__WEBPACK_IMPORTED_MODULE_1__["default"], config);
}
//# sourceMappingURL=asset.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/canisters/asset_idl.js":
/*!********************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/canisters/asset_idl.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * This file is generated from the candid for asset management.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (({ IDL }) => {
    return IDL.Service({
        retrieve: IDL.Func([IDL.Text], [IDL.Vec(IDL.Nat8)], ['query']),
        store: IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [], []),
    });
});
//# sourceMappingURL=asset_idl.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/canisters/management_idl.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/canisters/management_idl.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 * This file is generated from the candid for asset management.
 * didc version: 0.4.0
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (({ IDL }) => {
    const bitcoin_network = IDL.Variant({
        mainnet: IDL.Null,
        testnet: IDL.Null,
    });
    const bitcoin_address = IDL.Text;
    const bitcoin_get_balance_args = IDL.Record({
        network: bitcoin_network,
        address: bitcoin_address,
        min_confirmations: IDL.Opt(IDL.Nat32),
    });
    const satoshi = IDL.Nat64;
    const bitcoin_get_balance_result = satoshi;
    const bitcoin_block_height = IDL.Nat32;
    const bitcoin_get_block_headers_args = IDL.Record({
        start_height: bitcoin_block_height,
        end_height: IDL.Opt(bitcoin_block_height),
        network: bitcoin_network,
    });
    const bitcoin_block_header = IDL.Vec(IDL.Nat8);
    const bitcoin_get_block_headers_result = IDL.Record({
        tip_height: bitcoin_block_height,
        block_headers: IDL.Vec(bitcoin_block_header),
    });
    const bitcoin_get_current_fee_percentiles_args = IDL.Record({
        network: bitcoin_network,
    });
    const millisatoshi_per_byte = IDL.Nat64;
    const bitcoin_get_current_fee_percentiles_result = IDL.Vec(millisatoshi_per_byte);
    const bitcoin_get_utxos_args = IDL.Record({
        network: bitcoin_network,
        filter: IDL.Opt(IDL.Variant({
            page: IDL.Vec(IDL.Nat8),
            min_confirmations: IDL.Nat32,
        })),
        address: bitcoin_address,
    });
    const bitcoin_block_hash = IDL.Vec(IDL.Nat8);
    const outpoint = IDL.Record({
        txid: IDL.Vec(IDL.Nat8),
        vout: IDL.Nat32,
    });
    const utxo = IDL.Record({
        height: IDL.Nat32,
        value: satoshi,
        outpoint: outpoint,
    });
    const bitcoin_get_utxos_result = IDL.Record({
        next_page: IDL.Opt(IDL.Vec(IDL.Nat8)),
        tip_height: bitcoin_block_height,
        tip_block_hash: bitcoin_block_hash,
        utxos: IDL.Vec(utxo),
    });
    const bitcoin_send_transaction_args = IDL.Record({
        transaction: IDL.Vec(IDL.Nat8),
        network: bitcoin_network,
    });
    const canister_id = IDL.Principal;
    const canister_info_args = IDL.Record({
        canister_id: canister_id,
        num_requested_changes: IDL.Opt(IDL.Nat64),
    });
    const change_origin = IDL.Variant({
        from_user: IDL.Record({ user_id: IDL.Principal }),
        from_canister: IDL.Record({
            canister_version: IDL.Opt(IDL.Nat64),
            canister_id: IDL.Principal,
        }),
    });
    const snapshot_id = IDL.Vec(IDL.Nat8);
    const change_details = IDL.Variant({
        creation: IDL.Record({ controllers: IDL.Vec(IDL.Principal) }),
        code_deployment: IDL.Record({
            mode: IDL.Variant({
                reinstall: IDL.Null,
                upgrade: IDL.Null,
                install: IDL.Null,
            }),
            module_hash: IDL.Vec(IDL.Nat8),
        }),
        load_snapshot: IDL.Record({
            canister_version: IDL.Nat64,
            taken_at_timestamp: IDL.Nat64,
            snapshot_id: snapshot_id,
        }),
        controllers_change: IDL.Record({
            controllers: IDL.Vec(IDL.Principal),
        }),
        code_uninstall: IDL.Null,
    });
    const change = IDL.Record({
        timestamp_nanos: IDL.Nat64,
        canister_version: IDL.Nat64,
        origin: change_origin,
        details: change_details,
    });
    const canister_info_result = IDL.Record({
        controllers: IDL.Vec(IDL.Principal),
        module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
        recent_changes: IDL.Vec(change),
        total_num_changes: IDL.Nat64,
    });
    const canister_status_args = IDL.Record({ canister_id: canister_id });
    const log_visibility = IDL.Variant({
        controllers: IDL.Null,
        public: IDL.Null,
        allowed_viewers: IDL.Vec(IDL.Principal),
    });
    const definite_canister_settings = IDL.Record({
        freezing_threshold: IDL.Nat,
        controllers: IDL.Vec(IDL.Principal),
        reserved_cycles_limit: IDL.Nat,
        log_visibility: log_visibility,
        wasm_memory_limit: IDL.Nat,
        memory_allocation: IDL.Nat,
        compute_allocation: IDL.Nat,
    });
    const canister_status_result = IDL.Record({
        status: IDL.Variant({
            stopped: IDL.Null,
            stopping: IDL.Null,
            running: IDL.Null,
        }),
        memory_size: IDL.Nat,
        cycles: IDL.Nat,
        settings: definite_canister_settings,
        query_stats: IDL.Record({
            response_payload_bytes_total: IDL.Nat,
            num_instructions_total: IDL.Nat,
            num_calls_total: IDL.Nat,
            request_payload_bytes_total: IDL.Nat,
        }),
        idle_cycles_burned_per_day: IDL.Nat,
        module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
        reserved_cycles: IDL.Nat,
    });
    const clear_chunk_store_args = IDL.Record({ canister_id: canister_id });
    const canister_settings = IDL.Record({
        freezing_threshold: IDL.Opt(IDL.Nat),
        controllers: IDL.Opt(IDL.Vec(IDL.Principal)),
        reserved_cycles_limit: IDL.Opt(IDL.Nat),
        log_visibility: IDL.Opt(log_visibility),
        wasm_memory_limit: IDL.Opt(IDL.Nat),
        memory_allocation: IDL.Opt(IDL.Nat),
        compute_allocation: IDL.Opt(IDL.Nat),
    });
    const create_canister_args = IDL.Record({
        settings: IDL.Opt(canister_settings),
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const create_canister_result = IDL.Record({ canister_id: canister_id });
    const delete_canister_args = IDL.Record({ canister_id: canister_id });
    const delete_canister_snapshot_args = IDL.Record({
        canister_id: canister_id,
        snapshot_id: snapshot_id,
    });
    const deposit_cycles_args = IDL.Record({ canister_id: canister_id });
    const ecdsa_curve = IDL.Variant({ secp256k1: IDL.Null });
    const ecdsa_public_key_args = IDL.Record({
        key_id: IDL.Record({ name: IDL.Text, curve: ecdsa_curve }),
        canister_id: IDL.Opt(canister_id),
        derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8)),
    });
    const ecdsa_public_key_result = IDL.Record({
        public_key: IDL.Vec(IDL.Nat8),
        chain_code: IDL.Vec(IDL.Nat8),
    });
    const fetch_canister_logs_args = IDL.Record({ canister_id: canister_id });
    const canister_log_record = IDL.Record({
        idx: IDL.Nat64,
        timestamp_nanos: IDL.Nat64,
        content: IDL.Vec(IDL.Nat8),
    });
    const fetch_canister_logs_result = IDL.Record({
        canister_log_records: IDL.Vec(canister_log_record),
    });
    const http_header = IDL.Record({ value: IDL.Text, name: IDL.Text });
    const http_request_result = IDL.Record({
        status: IDL.Nat,
        body: IDL.Vec(IDL.Nat8),
        headers: IDL.Vec(http_header),
    });
    const http_request_args = IDL.Record({
        url: IDL.Text,
        method: IDL.Variant({
            get: IDL.Null,
            head: IDL.Null,
            post: IDL.Null,
        }),
        max_response_bytes: IDL.Opt(IDL.Nat64),
        body: IDL.Opt(IDL.Vec(IDL.Nat8)),
        transform: IDL.Opt(IDL.Record({
            function: IDL.Func([
                IDL.Record({
                    context: IDL.Vec(IDL.Nat8),
                    response: http_request_result,
                }),
            ], [http_request_result], ['query']),
            context: IDL.Vec(IDL.Nat8),
        })),
        headers: IDL.Vec(http_header),
    });
    const canister_install_mode = IDL.Variant({
        reinstall: IDL.Null,
        upgrade: IDL.Opt(IDL.Record({
            wasm_memory_persistence: IDL.Opt(IDL.Variant({ keep: IDL.Null, replace: IDL.Null })),
            skip_pre_upgrade: IDL.Opt(IDL.Bool),
        })),
        install: IDL.Null,
    });
    const chunk_hash = IDL.Record({ hash: IDL.Vec(IDL.Nat8) });
    const install_chunked_code_args = IDL.Record({
        arg: IDL.Vec(IDL.Nat8),
        wasm_module_hash: IDL.Vec(IDL.Nat8),
        mode: canister_install_mode,
        chunk_hashes_list: IDL.Vec(chunk_hash),
        target_canister: canister_id,
        store_canister: IDL.Opt(canister_id),
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const wasm_module = IDL.Vec(IDL.Nat8);
    const install_code_args = IDL.Record({
        arg: IDL.Vec(IDL.Nat8),
        wasm_module: wasm_module,
        mode: canister_install_mode,
        canister_id: canister_id,
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const list_canister_snapshots_args = IDL.Record({
        canister_id: canister_id,
    });
    const snapshot = IDL.Record({
        id: snapshot_id,
        total_size: IDL.Nat64,
        taken_at_timestamp: IDL.Nat64,
    });
    const list_canister_snapshots_result = IDL.Vec(snapshot);
    const load_canister_snapshot_args = IDL.Record({
        canister_id: canister_id,
        sender_canister_version: IDL.Opt(IDL.Nat64),
        snapshot_id: snapshot_id,
    });
    const node_metrics_history_args = IDL.Record({
        start_at_timestamp_nanos: IDL.Nat64,
        subnet_id: IDL.Principal,
    });
    const node_metrics = IDL.Record({
        num_block_failures_total: IDL.Nat64,
        node_id: IDL.Principal,
        num_blocks_proposed_total: IDL.Nat64,
    });
    const node_metrics_history_result = IDL.Vec(IDL.Record({
        timestamp_nanos: IDL.Nat64,
        node_metrics: IDL.Vec(node_metrics),
    }));
    const provisional_create_canister_with_cycles_args = IDL.Record({
        settings: IDL.Opt(canister_settings),
        specified_id: IDL.Opt(canister_id),
        amount: IDL.Opt(IDL.Nat),
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const provisional_create_canister_with_cycles_result = IDL.Record({
        canister_id: canister_id,
    });
    const provisional_top_up_canister_args = IDL.Record({
        canister_id: canister_id,
        amount: IDL.Nat,
    });
    const raw_rand_result = IDL.Vec(IDL.Nat8);
    const schnorr_algorithm = IDL.Variant({
        ed25519: IDL.Null,
        bip340secp256k1: IDL.Null,
    });
    const schnorr_public_key_args = IDL.Record({
        key_id: IDL.Record({
            algorithm: schnorr_algorithm,
            name: IDL.Text,
        }),
        canister_id: IDL.Opt(canister_id),
        derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8)),
    });
    const schnorr_public_key_result = IDL.Record({
        public_key: IDL.Vec(IDL.Nat8),
        chain_code: IDL.Vec(IDL.Nat8),
    });
    const sign_with_ecdsa_args = IDL.Record({
        key_id: IDL.Record({ name: IDL.Text, curve: ecdsa_curve }),
        derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8)),
        message_hash: IDL.Vec(IDL.Nat8),
    });
    const sign_with_ecdsa_result = IDL.Record({
        signature: IDL.Vec(IDL.Nat8),
    });
    const schnorr_aux = IDL.Variant({
        bip341: IDL.Record({ merkle_root_hash: IDL.Vec(IDL.Nat8) }),
    });
    const sign_with_schnorr_args = IDL.Record({
        aux: IDL.Opt(schnorr_aux),
        key_id: IDL.Record({
            algorithm: schnorr_algorithm,
            name: IDL.Text,
        }),
        derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8)),
        message: IDL.Vec(IDL.Nat8),
    });
    const sign_with_schnorr_result = IDL.Record({
        signature: IDL.Vec(IDL.Nat8),
    });
    const start_canister_args = IDL.Record({ canister_id: canister_id });
    const stop_canister_args = IDL.Record({ canister_id: canister_id });
    const stored_chunks_args = IDL.Record({ canister_id: canister_id });
    const stored_chunks_result = IDL.Vec(chunk_hash);
    const subnet_info_args = IDL.Record({ subnet_id: IDL.Principal });
    const subnet_info_result = IDL.Record({ replica_version: IDL.Text });
    const take_canister_snapshot_args = IDL.Record({
        replace_snapshot: IDL.Opt(snapshot_id),
        canister_id: canister_id,
    });
    const take_canister_snapshot_result = snapshot;
    const uninstall_code_args = IDL.Record({
        canister_id: canister_id,
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const update_settings_args = IDL.Record({
        canister_id: IDL.Principal,
        settings: canister_settings,
        sender_canister_version: IDL.Opt(IDL.Nat64),
    });
    const upload_chunk_args = IDL.Record({
        chunk: IDL.Vec(IDL.Nat8),
        canister_id: IDL.Principal,
    });
    const upload_chunk_result = chunk_hash;
    return IDL.Service({
        bitcoin_get_balance: IDL.Func([bitcoin_get_balance_args], [bitcoin_get_balance_result], []),
        bitcoin_get_block_headers: IDL.Func([bitcoin_get_block_headers_args], [bitcoin_get_block_headers_result], []),
        bitcoin_get_current_fee_percentiles: IDL.Func([bitcoin_get_current_fee_percentiles_args], [bitcoin_get_current_fee_percentiles_result], []),
        bitcoin_get_utxos: IDL.Func([bitcoin_get_utxos_args], [bitcoin_get_utxos_result], []),
        bitcoin_send_transaction: IDL.Func([bitcoin_send_transaction_args], [], []),
        canister_info: IDL.Func([canister_info_args], [canister_info_result], []),
        canister_status: IDL.Func([canister_status_args], [canister_status_result], []),
        clear_chunk_store: IDL.Func([clear_chunk_store_args], [], []),
        create_canister: IDL.Func([create_canister_args], [create_canister_result], []),
        delete_canister: IDL.Func([delete_canister_args], [], []),
        delete_canister_snapshot: IDL.Func([delete_canister_snapshot_args], [], []),
        deposit_cycles: IDL.Func([deposit_cycles_args], [], []),
        ecdsa_public_key: IDL.Func([ecdsa_public_key_args], [ecdsa_public_key_result], []),
        fetch_canister_logs: IDL.Func([fetch_canister_logs_args], [fetch_canister_logs_result], ['query']),
        http_request: IDL.Func([http_request_args], [http_request_result], []),
        install_chunked_code: IDL.Func([install_chunked_code_args], [], []),
        install_code: IDL.Func([install_code_args], [], []),
        list_canister_snapshots: IDL.Func([list_canister_snapshots_args], [list_canister_snapshots_result], []),
        load_canister_snapshot: IDL.Func([load_canister_snapshot_args], [], []),
        node_metrics_history: IDL.Func([node_metrics_history_args], [node_metrics_history_result], []),
        provisional_create_canister_with_cycles: IDL.Func([provisional_create_canister_with_cycles_args], [provisional_create_canister_with_cycles_result], []),
        provisional_top_up_canister: IDL.Func([provisional_top_up_canister_args], [], []),
        raw_rand: IDL.Func([], [raw_rand_result], []),
        schnorr_public_key: IDL.Func([schnorr_public_key_args], [schnorr_public_key_result], []),
        sign_with_ecdsa: IDL.Func([sign_with_ecdsa_args], [sign_with_ecdsa_result], []),
        sign_with_schnorr: IDL.Func([sign_with_schnorr_args], [sign_with_schnorr_result], []),
        start_canister: IDL.Func([start_canister_args], [], []),
        stop_canister: IDL.Func([stop_canister_args], [], []),
        stored_chunks: IDL.Func([stored_chunks_args], [stored_chunks_result], []),
        subnet_info: IDL.Func([subnet_info_args], [subnet_info_result], []),
        take_canister_snapshot: IDL.Func([take_canister_snapshot_args], [take_canister_snapshot_result], []),
        uninstall_code: IDL.Func([uninstall_code_args], [], []),
        update_settings: IDL.Func([update_settings_args], [], []),
        upload_chunk: IDL.Func([upload_chunk_args], [upload_chunk_result], []),
    });
});
//# sourceMappingURL=management_idl.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/cbor.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/cbor.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CborTag": () => (/* binding */ CborTag),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "decode": () => (/* binding */ decode)
/* harmony export */ });
/* harmony import */ var borc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! borc */ "./node_modules/borc/src/index.js");
/* harmony import */ var simple_cbor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! simple-cbor */ "./node_modules/simple-cbor/src/index.js");
/* harmony import */ var simple_cbor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(simple_cbor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
// This file is based on:
// https://github.com/dfinity-lab/dfinity/blob/9bca65f8edd65701ea6bdb00e0752f9186bbc893/docs/spec/public/index.adoc#cbor-encoding-of-requests-and-responses




// We are using hansl/simple-cbor for CBOR serialization, to avoid issues with
// encoding the uint64 values that the HTTP handler of the client expects for
// canister IDs. However, simple-cbor does not yet provide deserialization so
// we are using `Uint8Array` so that we can use the dignifiedquire/borc CBOR
// decoder.
class PrincipalEncoder {
    get name() {
        return 'Principal';
    }
    get priority() {
        return 0;
    }
    match(value) {
        return value && value._isPrincipal === true;
    }
    encode(v) {
        return simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.bytes(v.toUint8Array());
    }
}
class BufferEncoder {
    get name() {
        return 'Buffer';
    }
    get priority() {
        return 1;
    }
    match(value) {
        return value instanceof ArrayBuffer || ArrayBuffer.isView(value);
    }
    encode(v) {
        return simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.bytes(new Uint8Array(v));
    }
}
class BigIntEncoder {
    get name() {
        return 'BigInt';
    }
    get priority() {
        return 1;
    }
    match(value) {
        return typeof value === `bigint`;
    }
    encode(v) {
        // Always use a bigint encoding.
        if (v > BigInt(0)) {
            return simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.tagged(2, simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.bytes((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.fromHex)(v.toString(16))));
        }
        else {
            return simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.tagged(3, simple_cbor__WEBPACK_IMPORTED_MODULE_1__.value.bytes((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.fromHex)((BigInt('-1') * v).toString(16))));
        }
    }
}
const serializer = simple_cbor__WEBPACK_IMPORTED_MODULE_1__.SelfDescribeCborSerializer.withDefaultEncoders(true);
serializer.addEncoder(new PrincipalEncoder());
serializer.addEncoder(new BufferEncoder());
serializer.addEncoder(new BigIntEncoder());
var CborTag;
(function (CborTag) {
    CborTag[CborTag["Uint64LittleEndian"] = 71] = "Uint64LittleEndian";
    CborTag[CborTag["Semantic"] = 55799] = "Semantic";
})(CborTag || (CborTag = {}));
/**
 * Encode a JavaScript value into CBOR.
 */
function encode(value) {
    return serializer.serialize(value);
}
function decodePositiveBigInt(buf) {
    const len = buf.byteLength;
    let res = BigInt(0);
    for (let i = 0; i < len; i++) {
        res = res * BigInt(0x100) + BigInt(buf[i]);
    }
    return res;
}
// A BORC subclass that decodes byte strings to ArrayBuffer instead of the Buffer class.
class Uint8ArrayDecoder extends borc__WEBPACK_IMPORTED_MODULE_0__.Decoder {
    createByteString(raw) {
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.concat)(...raw);
    }
    createByteStringFromHeap(start, end) {
        if (start === end) {
            return new ArrayBuffer(0);
        }
        return new Uint8Array(this._heap.slice(start, end));
    }
}
function decode(input) {
    const buffer = new Uint8Array(input);
    const decoder = new Uint8ArrayDecoder({
        size: buffer.byteLength,
        tags: {
            // Override tags 2 and 3 for BigInt support (borc supports only BigNumber).
            2: val => decodePositiveBigInt(val),
            3: val => -decodePositiveBigInt(val),
            [CborTag.Semantic]: (value) => value,
        },
    });
    try {
        return decoder.decodeFirst(buffer);
    }
    catch (e) {
        throw new Error(`Failed to decode CBOR: ${e}, input: ${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.toHex)(buffer)}`);
    }
}
//# sourceMappingURL=cbor.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/certificate.js":
/*!************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/certificate.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CertificateVerificationError": () => (/* binding */ CertificateVerificationError),
/* harmony export */   "NodeType": () => (/* binding */ NodeType),
/* harmony export */   "hashTreeToString": () => (/* binding */ hashTreeToString),
/* harmony export */   "Certificate": () => (/* binding */ Certificate),
/* harmony export */   "lookupResultToBuffer": () => (/* binding */ lookupResultToBuffer),
/* harmony export */   "reconstruct": () => (/* binding */ reconstruct),
/* harmony export */   "LookupStatus": () => (/* binding */ LookupStatus),
/* harmony export */   "lookup_path": () => (/* binding */ lookup_path),
/* harmony export */   "flatten_forks": () => (/* binding */ flatten_forks),
/* harmony export */   "find_label": () => (/* binding */ find_label),
/* harmony export */   "check_canister_ranges": () => (/* binding */ check_canister_ranges)
/* harmony export */ });
/* harmony import */ var _cbor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cbor */ "./node_modules/@dfinity/agent/lib/esm/cbor.js");
/* harmony import */ var _errors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./errors */ "./node_modules/@dfinity/agent/lib/esm/errors.js");
/* harmony import */ var _request_id__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request_id */ "./node_modules/@dfinity/agent/lib/esm/request_id.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _utils_bls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/bls */ "./node_modules/@dfinity/agent/lib/esm/utils/bls.js");
/* harmony import */ var _utils_leb__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/leb */ "./node_modules/@dfinity/agent/lib/esm/utils/leb.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./agent */ "./node_modules/@dfinity/agent/lib/esm/agent/index.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Certificate_disableTimeVerification;








/**
 * A certificate may fail verification with respect to the provided public key
 */
class CertificateVerificationError extends _errors__WEBPACK_IMPORTED_MODULE_1__.AgentError {
    constructor(reason) {
        super(`Invalid certificate: ${reason}`);
    }
}
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Empty"] = 0] = "Empty";
    NodeType[NodeType["Fork"] = 1] = "Fork";
    NodeType[NodeType["Labeled"] = 2] = "Labeled";
    NodeType[NodeType["Leaf"] = 3] = "Leaf";
    NodeType[NodeType["Pruned"] = 4] = "Pruned";
})(NodeType || (NodeType = {}));
/**
 * Make a human readable string out of a hash tree.
 * @param tree
 */
function hashTreeToString(tree) {
    const indent = (s) => s
        .split('\n')
        .map(x => '  ' + x)
        .join('\n');
    function labelToString(label) {
        const decoder = new TextDecoder(undefined, { fatal: true });
        try {
            return JSON.stringify(decoder.decode(label));
        }
        catch (e) {
            return `data(...${label.byteLength} bytes)`;
        }
    }
    switch (tree[0]) {
        case NodeType.Empty:
            return '()';
        case NodeType.Fork: {
            if (tree[1] instanceof Array && tree[2] instanceof ArrayBuffer) {
                const left = hashTreeToString(tree[1]);
                const right = hashTreeToString(tree[2]);
                return `sub(\n left:\n${indent(left)}\n---\n right:\n${indent(right)}\n)`;
            }
            else {
                throw new Error('Invalid tree structure for fork');
            }
        }
        case NodeType.Labeled: {
            if (tree[1] instanceof ArrayBuffer && tree[2] instanceof ArrayBuffer) {
                const label = labelToString(tree[1]);
                const sub = hashTreeToString(tree[2]);
                return `label(\n label:\n${indent(label)}\n sub:\n${indent(sub)}\n)`;
            }
            else {
                throw new Error('Invalid tree structure for labeled');
            }
        }
        case NodeType.Leaf: {
            if (!tree[1]) {
                throw new Error('Invalid tree structure for leaf');
            }
            else if (Array.isArray(tree[1])) {
                return JSON.stringify(tree[1]);
            }
            return `leaf(...${tree[1].byteLength} bytes)`;
        }
        case NodeType.Pruned: {
            if (!tree[1]) {
                throw new Error('Invalid tree structure for pruned');
            }
            else if (Array.isArray(tree[1])) {
                return JSON.stringify(tree[1]);
            }
            return `pruned(${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.toHex)(new Uint8Array(tree[1]))}`;
        }
        default: {
            return `unknown(${JSON.stringify(tree[0])})`;
        }
    }
}
function isBufferGreaterThan(a, b) {
    const a8 = new Uint8Array(a);
    const b8 = new Uint8Array(b);
    for (let i = 0; i < a8.length; i++) {
        if (a8[i] > b8[i]) {
            return true;
        }
    }
    return false;
}
class Certificate {
    constructor(certificate, _rootKey, _canisterId, _blsVerify, 
    // Default to 5 minutes
    _maxAgeInMinutes = 5, disableTimeVerification = false) {
        this._rootKey = _rootKey;
        this._canisterId = _canisterId;
        this._blsVerify = _blsVerify;
        this._maxAgeInMinutes = _maxAgeInMinutes;
        _Certificate_disableTimeVerification.set(this, false);
        __classPrivateFieldSet(this, _Certificate_disableTimeVerification, disableTimeVerification, "f");
        this.cert = _cbor__WEBPACK_IMPORTED_MODULE_0__.decode(new Uint8Array(certificate));
    }
    /**
     * Create a new instance of a certificate, automatically verifying it. Throws a
     * CertificateVerificationError if the certificate cannot be verified.
     * @constructs  Certificate
     * @param {CreateCertificateOptions} options {@link CreateCertificateOptions}
     * @param {ArrayBuffer} options.certificate The bytes of the certificate
     * @param {ArrayBuffer} options.rootKey The root key to verify against
     * @param {Principal} options.canisterId The effective or signing canister ID
     * @param {number} options.maxAgeInMinutes The maximum age of the certificate in minutes. Default is 5 minutes.
     * @throws {CertificateVerificationError}
     */
    static async create(options) {
        const cert = Certificate.createUnverified(options);
        await cert.verify();
        return cert;
    }
    static createUnverified(options) {
        let blsVerify = options.blsVerify;
        if (!blsVerify) {
            blsVerify = _utils_bls__WEBPACK_IMPORTED_MODULE_5__.blsVerify;
        }
        return new Certificate(options.certificate, options.rootKey, options.canisterId, blsVerify, options.maxAgeInMinutes, options.disableTimeVerification);
    }
    lookup(path) {
        // constrain the type of the result, so that empty HashTree is undefined
        return lookup_path(path, this.cert.tree);
    }
    lookup_label(label) {
        return this.lookup([label]);
    }
    async verify() {
        const rootHash = await reconstruct(this.cert.tree);
        const derKey = await this._checkDelegationAndGetKey(this.cert.delegation);
        const sig = this.cert.signature;
        const key = extractDER(derKey);
        const msg = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.concat)(domain_sep('ic-state-root'), rootHash);
        let sigVer = false;
        const lookupTime = lookupResultToBuffer(this.lookup(['time']));
        if (!lookupTime) {
            // Should never happen - time is always present in IC certificates
            throw new CertificateVerificationError('Certificate does not contain a time');
        }
        // Certificate time verification checks
        if (!__classPrivateFieldGet(this, _Certificate_disableTimeVerification, "f")) {
            const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
            const MAX_AGE_IN_MSEC = this._maxAgeInMinutes * 60 * 1000;
            const now = Date.now();
            const earliestCertificateTime = now - MAX_AGE_IN_MSEC;
            const fiveMinutesFromNow = now + FIVE_MINUTES_IN_MSEC;
            const certTime = (0,_utils_leb__WEBPACK_IMPORTED_MODULE_6__.decodeTime)(lookupTime);
            if (certTime.getTime() < earliestCertificateTime) {
                throw new CertificateVerificationError(`Certificate is signed more than ${this._maxAgeInMinutes} minutes in the past. Certificate time: ` +
                    certTime.toISOString() +
                    ' Current time: ' +
                    new Date(now).toISOString());
            }
            else if (certTime.getTime() > fiveMinutesFromNow) {
                throw new CertificateVerificationError('Certificate is signed more than 5 minutes in the future. Certificate time: ' +
                    certTime.toISOString() +
                    ' Current time: ' +
                    new Date(now).toISOString());
            }
        }
        try {
            sigVer = await this._blsVerify(new Uint8Array(key), new Uint8Array(sig), new Uint8Array(msg));
        }
        catch (err) {
            sigVer = false;
        }
        if (!sigVer) {
            throw new CertificateVerificationError('Signature verification failed');
        }
    }
    async _checkDelegationAndGetKey(d) {
        if (!d) {
            return this._rootKey;
        }
        const cert = await Certificate.createUnverified({
            certificate: d.certificate,
            rootKey: this._rootKey,
            canisterId: this._canisterId,
            blsVerify: this._blsVerify,
            // Do not check max age for delegation certificates
            maxAgeInMinutes: Infinity,
        });
        if (cert.cert.delegation) {
            throw new CertificateVerificationError('Delegation certificates cannot be nested');
        }
        await cert.verify();
        if (this._canisterId.toString() !== _agent__WEBPACK_IMPORTED_MODULE_7__.MANAGEMENT_CANISTER_ID) {
            const canisterInRange = check_canister_ranges({
                canisterId: this._canisterId,
                subnetId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_4__.Principal.fromUint8Array(new Uint8Array(d.subnet_id)),
                tree: cert.cert.tree,
            });
            if (!canisterInRange) {
                throw new CertificateVerificationError(`Canister ${this._canisterId} not in range of delegations for subnet 0x${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.toHex)(d.subnet_id)}`);
            }
        }
        const publicKeyLookup = lookupResultToBuffer(cert.lookup(['subnet', d.subnet_id, 'public_key']));
        if (!publicKeyLookup) {
            throw new Error(`Could not find subnet key for subnet 0x${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.toHex)(d.subnet_id)}`);
        }
        return publicKeyLookup;
    }
}
_Certificate_disableTimeVerification = new WeakMap();
const DER_PREFIX = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.fromHex)('308182301d060d2b0601040182dc7c0503010201060c2b0601040182dc7c05030201036100');
const KEY_LENGTH = 96;
function extractDER(buf) {
    const expectedLength = DER_PREFIX.byteLength + KEY_LENGTH;
    if (buf.byteLength !== expectedLength) {
        throw new TypeError(`BLS DER-encoded public key must be ${expectedLength} bytes long`);
    }
    const prefix = buf.slice(0, DER_PREFIX.byteLength);
    if (!(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.bufEquals)(prefix, DER_PREFIX)) {
        throw new TypeError(`BLS DER-encoded public key is invalid. Expect the following prefix: ${DER_PREFIX}, but get ${prefix}`);
    }
    return buf.slice(DER_PREFIX.byteLength);
}
/**
 * utility function to constrain the type of a path
 * @param {ArrayBuffer | HashTree | undefined} result - the result of a lookup
 * @returns ArrayBuffer or Undefined
 */
function lookupResultToBuffer(result) {
    if (result.status !== LookupStatus.Found) {
        return undefined;
    }
    if (result.value instanceof ArrayBuffer) {
        return result.value;
    }
    if (result.value instanceof Uint8Array) {
        return result.value.buffer;
    }
    return undefined;
}
/**
 * @param t
 */
async function reconstruct(t) {
    switch (t[0]) {
        case NodeType.Empty:
            return (0,_request_id__WEBPACK_IMPORTED_MODULE_2__.hash)(domain_sep('ic-hashtree-empty'));
        case NodeType.Pruned:
            return t[1];
        case NodeType.Leaf:
            return (0,_request_id__WEBPACK_IMPORTED_MODULE_2__.hash)((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.concat)(domain_sep('ic-hashtree-leaf'), t[1]));
        case NodeType.Labeled:
            return (0,_request_id__WEBPACK_IMPORTED_MODULE_2__.hash)((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.concat)(domain_sep('ic-hashtree-labeled'), t[1], await reconstruct(t[2])));
        case NodeType.Fork:
            return (0,_request_id__WEBPACK_IMPORTED_MODULE_2__.hash)((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.concat)(domain_sep('ic-hashtree-fork'), await reconstruct(t[1]), await reconstruct(t[2])));
        default:
            throw new Error('unreachable');
    }
}
function domain_sep(s) {
    const len = new Uint8Array([s.length]);
    const str = new TextEncoder().encode(s);
    return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.concat)(len, str);
}
var LookupStatus;
(function (LookupStatus) {
    LookupStatus["Unknown"] = "unknown";
    LookupStatus["Absent"] = "absent";
    LookupStatus["Found"] = "found";
})(LookupStatus || (LookupStatus = {}));
var LabelLookupStatus;
(function (LabelLookupStatus) {
    LabelLookupStatus["Less"] = "less";
    LabelLookupStatus["Greater"] = "greater";
})(LabelLookupStatus || (LabelLookupStatus = {}));
function lookup_path(path, tree) {
    if (path.length === 0) {
        switch (tree[0]) {
            case NodeType.Leaf: {
                if (!tree[1]) {
                    throw new Error('Invalid tree structure for leaf');
                }
                if (tree[1] instanceof ArrayBuffer) {
                    return {
                        status: LookupStatus.Found,
                        value: tree[1],
                    };
                }
                if (tree[1] instanceof Uint8Array) {
                    return {
                        status: LookupStatus.Found,
                        value: tree[1].buffer,
                    };
                }
                return {
                    status: LookupStatus.Found,
                    value: tree[1],
                };
            }
            default: {
                return {
                    status: LookupStatus.Found,
                    value: tree,
                };
            }
        }
    }
    const label = typeof path[0] === 'string' ? new TextEncoder().encode(path[0]) : path[0];
    const lookupResult = find_label(label, tree);
    switch (lookupResult.status) {
        case LookupStatus.Found: {
            return lookup_path(path.slice(1), lookupResult.value);
        }
        case LabelLookupStatus.Greater:
        case LabelLookupStatus.Less: {
            return {
                status: LookupStatus.Absent,
            };
        }
        default: {
            return lookupResult;
        }
    }
}
/**
 * If the tree is a fork, flatten it into an array of trees
 * @param t - the tree to flatten
 * @returns HashTree[] - the flattened tree
 */
function flatten_forks(t) {
    switch (t[0]) {
        case NodeType.Empty:
            return [];
        case NodeType.Fork:
            return flatten_forks(t[1]).concat(flatten_forks(t[2]));
        default:
            return [t];
    }
}
function find_label(label, tree) {
    switch (tree[0]) {
        // if we have a labelled node, compare the node's label to the one we are
        // looking for
        case NodeType.Labeled:
            // if the label we're searching for is greater than this node's label,
            // we need to keep searching
            if (isBufferGreaterThan(label, tree[1])) {
                return {
                    status: LabelLookupStatus.Greater,
                };
            }
            // if the label we're searching for is equal this node's label, we can
            // stop searching and return the found node
            if ((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_3__.bufEquals)(label, tree[1])) {
                return {
                    status: LookupStatus.Found,
                    value: tree[2],
                };
            }
            // if the label we're searching for is not greater than or equal to this
            // node's label, then it's less than this node's label, and we can stop
            // searching because we've looked too far
            return {
                status: LabelLookupStatus.Less,
            };
        // if we have a fork node, we need to search both sides, starting with the left
        case NodeType.Fork:
            // search in the left node
            const leftLookupResult = find_label(label, tree[1]);
            switch (leftLookupResult.status) {
                // if the label we're searching for is greater than the left node lookup,
                // we need to search the right node
                case LabelLookupStatus.Greater: {
                    const rightLookupResult = find_label(label, tree[2]);
                    // if the label we're searching for is less than the right node lookup,
                    // then we can stop searching and say that the label is provably Absent
                    if (rightLookupResult.status === LabelLookupStatus.Less) {
                        return {
                            status: LookupStatus.Absent,
                        };
                    }
                    // if the label we're searching for is less than or equal to the right
                    // node lookup, then we let the caller handle it
                    return rightLookupResult;
                }
                // if the left node returns an uncertain result, we need to search the
                // right node
                case LookupStatus.Unknown: {
                    let rightLookupResult = find_label(label, tree[2]);
                    // if the label we're searching for is less than the right node lookup,
                    // then we also need to return an uncertain result
                    if (rightLookupResult.status === LabelLookupStatus.Less) {
                        return {
                            status: LookupStatus.Unknown,
                        };
                    }
                    // if the label we're searching for is less than or equal to the right
                    // node lookup, then we let the caller handle it
                    return rightLookupResult;
                }
                // if the label we're searching for is not greater than the left node
                // lookup, or the result is not uncertain, we stop searching and return
                // whatever the result of the left node lookup was, which can be either
                // Found or Absent
                default: {
                    return leftLookupResult;
                }
            }
        // if we encounter a Pruned node, we can't know for certain if the label
        // we're searching for is present or not
        case NodeType.Pruned:
            return {
                status: LookupStatus.Unknown,
            };
        // if the current node is Empty, or a Leaf, we can stop searching because
        // we know for sure that the label we're searching for is not present
        default:
            return {
                status: LookupStatus.Absent,
            };
    }
}
/**
 * Check if a canister falls within a range of canisters
 * @param canisterId Principal
 * @param ranges [Principal, Principal][]
 * @returns
 */
function check_canister_ranges(params) {
    const { canisterId, subnetId, tree } = params;
    const rangeLookup = lookup_path(['subnet', subnetId.toUint8Array(), 'canister_ranges'], tree);
    if (rangeLookup.status !== LookupStatus.Found || !(rangeLookup.value instanceof ArrayBuffer)) {
        throw new Error(`Could not find canister ranges for subnet ${subnetId}`);
    }
    const ranges_arr = _cbor__WEBPACK_IMPORTED_MODULE_0__.decode(rangeLookup.value);
    const ranges = ranges_arr.map(v => [
        _dfinity_principal__WEBPACK_IMPORTED_MODULE_4__.Principal.fromUint8Array(v[0]),
        _dfinity_principal__WEBPACK_IMPORTED_MODULE_4__.Principal.fromUint8Array(v[1]),
    ]);
    const canisterInRange = ranges.some(r => r[0].ltEq(canisterId) && r[1].gtEq(canisterId));
    return canisterInRange;
}
//# sourceMappingURL=certificate.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/der.js":
/*!****************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/der.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "encodeLenBytes": () => (/* binding */ encodeLenBytes),
/* harmony export */   "encodeLen": () => (/* binding */ encodeLen),
/* harmony export */   "decodeLenBytes": () => (/* binding */ decodeLenBytes),
/* harmony export */   "decodeLen": () => (/* binding */ decodeLen),
/* harmony export */   "DER_COSE_OID": () => (/* binding */ DER_COSE_OID),
/* harmony export */   "ED25519_OID": () => (/* binding */ ED25519_OID),
/* harmony export */   "SECP256K1_OID": () => (/* binding */ SECP256K1_OID),
/* harmony export */   "wrapDER": () => (/* binding */ wrapDER),
/* harmony export */   "unwrapDER": () => (/* binding */ unwrapDER)
/* harmony export */ });
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");

const encodeLenBytes = (len) => {
    if (len <= 0x7f) {
        return 1;
    }
    else if (len <= 0xff) {
        return 2;
    }
    else if (len <= 0xffff) {
        return 3;
    }
    else if (len <= 0xffffff) {
        return 4;
    }
    else {
        throw new Error('Length too long (> 4 bytes)');
    }
};
const encodeLen = (buf, offset, len) => {
    if (len <= 0x7f) {
        buf[offset] = len;
        return 1;
    }
    else if (len <= 0xff) {
        buf[offset] = 0x81;
        buf[offset + 1] = len;
        return 2;
    }
    else if (len <= 0xffff) {
        buf[offset] = 0x82;
        buf[offset + 1] = len >> 8;
        buf[offset + 2] = len;
        return 3;
    }
    else if (len <= 0xffffff) {
        buf[offset] = 0x83;
        buf[offset + 1] = len >> 16;
        buf[offset + 2] = len >> 8;
        buf[offset + 3] = len;
        return 4;
    }
    else {
        throw new Error('Length too long (> 4 bytes)');
    }
};
const decodeLenBytes = (buf, offset) => {
    if (buf[offset] < 0x80)
        return 1;
    if (buf[offset] === 0x80)
        throw new Error('Invalid length 0');
    if (buf[offset] === 0x81)
        return 2;
    if (buf[offset] === 0x82)
        return 3;
    if (buf[offset] === 0x83)
        return 4;
    throw new Error('Length too long (> 4 bytes)');
};
const decodeLen = (buf, offset) => {
    const lenBytes = decodeLenBytes(buf, offset);
    if (lenBytes === 1)
        return buf[offset];
    else if (lenBytes === 2)
        return buf[offset + 1];
    else if (lenBytes === 3)
        return (buf[offset + 1] << 8) + buf[offset + 2];
    else if (lenBytes === 4)
        return (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3];
    throw new Error('Length too long (> 4 bytes)');
};
/**
 * A DER encoded `SEQUENCE(OID)` for DER-encoded-COSE
 */
const DER_COSE_OID = Uint8Array.from([
    ...[0x30, 0x0c],
    ...[0x06, 0x0a],
    ...[0x2b, 0x06, 0x01, 0x04, 0x01, 0x83, 0xb8, 0x43, 0x01, 0x01], // DER encoded COSE
]);
/**
 * A DER encoded `SEQUENCE(OID)` for the Ed25519 algorithm
 */
const ED25519_OID = Uint8Array.from([
    ...[0x30, 0x05],
    ...[0x06, 0x03],
    ...[0x2b, 0x65, 0x70], // id-Ed25519 OID
]);
/**
 * A DER encoded `SEQUENCE(OID)` for secp256k1 with the ECDSA algorithm
 */
const SECP256K1_OID = Uint8Array.from([
    ...[0x30, 0x10],
    ...[0x06, 0x07],
    ...[0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01],
    ...[0x06, 0x05],
    ...[0x2b, 0x81, 0x04, 0x00, 0x0a], // OID secp256k1
]);
/**
 * Wraps the given `payload` in a DER encoding tagged with the given encoded `oid` like so:
 * `SEQUENCE(oid, BITSTRING(payload))`
 *
 * @param payload The payload to encode as the bit string
 * @param oid The DER encoded (and SEQUENCE wrapped!) OID to tag the payload with
 */
function wrapDER(payload, oid) {
    // The Bit String header needs to include the unused bit count byte in its length
    const bitStringHeaderLength = 2 + encodeLenBytes(payload.byteLength + 1);
    const len = oid.byteLength + bitStringHeaderLength + payload.byteLength;
    let offset = 0;
    const buf = new Uint8Array(1 + encodeLenBytes(len) + len);
    // Sequence
    buf[offset++] = 0x30;
    // Sequence Length
    offset += encodeLen(buf, offset, len);
    // OID
    buf.set(oid, offset);
    offset += oid.byteLength;
    // Bit String Header
    buf[offset++] = 0x03;
    offset += encodeLen(buf, offset, payload.byteLength + 1);
    // 0 padding
    buf[offset++] = 0x00;
    buf.set(new Uint8Array(payload), offset);
    return buf;
}
/**
 * Extracts a payload from the given `derEncoded` data, and checks that it was tagged with the given `oid`.
 *
 * `derEncoded = SEQUENCE(oid, BITSTRING(payload))`
 *
 * @param derEncoded The DER encoded and tagged data
 * @param oid The DER encoded (and SEQUENCE wrapped!) expected OID
 * @returns The unwrapped payload
 */
const unwrapDER = (derEncoded, oid) => {
    let offset = 0;
    const expect = (n, msg) => {
        if (buf[offset++] !== n) {
            throw new Error('Expected: ' + msg);
        }
    };
    const buf = new Uint8Array(derEncoded);
    expect(0x30, 'sequence');
    offset += decodeLenBytes(buf, offset);
    if (!(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.bufEquals)(buf.slice(offset, offset + oid.byteLength), oid)) {
        throw new Error('Not the expected OID.');
    }
    offset += oid.byteLength;
    expect(0x03, 'bit string');
    const payloadLen = decodeLen(buf, offset) - 1; // Subtracting 1 to account for the 0 padding
    offset += decodeLenBytes(buf, offset);
    expect(0x00, '0 padding');
    const result = buf.slice(offset);
    if (payloadLen !== result.length) {
        throw new Error(`DER payload mismatch: Expected length ${payloadLen} actual length ${result.length}`);
    }
    return result;
};
//# sourceMappingURL=der.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/errors.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/errors.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AgentError": () => (/* binding */ AgentError),
/* harmony export */   "ActorCallError": () => (/* binding */ ActorCallError),
/* harmony export */   "QueryCallRejectedError": () => (/* binding */ QueryCallRejectedError),
/* harmony export */   "UpdateCallRejectedError": () => (/* binding */ UpdateCallRejectedError)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _agent_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./agent/api */ "./node_modules/@dfinity/agent/lib/esm/agent/api.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");



/**
 * An error that happens in the Agent. This is the root of all errors and should be used
 * everywhere in the Agent code (this package).
 * @todo https://github.com/dfinity/agent-js/issues/420
 */
class AgentError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'AgentError';
        this.__proto__ = AgentError.prototype;
        Object.setPrototypeOf(this, AgentError.prototype);
    }
}
class ActorCallError extends AgentError {
    constructor(canisterId, methodName, type, props) {
        const cid = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        super([
            `Call failed:`,
            `  Canister: ${cid.toText()}`,
            `  Method: ${methodName} (${type})`,
            ...Object.getOwnPropertyNames(props).map(n => `  "${n}": ${JSON.stringify(props[n])}`),
        ].join('\n'));
        this.canisterId = canisterId;
        this.methodName = methodName;
        this.type = type;
        this.props = props;
        this.name = 'ActorCallError';
        this.__proto__ = ActorCallError.prototype;
        Object.setPrototypeOf(this, ActorCallError.prototype);
    }
}
class QueryCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, result) {
        var _a;
        const cid = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        super(cid, methodName, 'query', {
            Status: result.status,
            Code: (_a = _agent_api__WEBPACK_IMPORTED_MODULE_1__.ReplicaRejectCode[result.reject_code]) !== null && _a !== void 0 ? _a : `Unknown Code "${result.reject_code}"`,
            Message: result.reject_message,
        });
        this.result = result;
        this.name = 'QueryCallRejectedError';
        this.__proto__ = QueryCallRejectedError.prototype;
        Object.setPrototypeOf(this, QueryCallRejectedError.prototype);
    }
}
class UpdateCallRejectedError extends ActorCallError {
    constructor(canisterId, methodName, requestId, response) {
        const cid = _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.from(canisterId);
        super(cid, methodName, 'update', Object.assign({ 'Request ID': (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.toHex)(requestId) }, (response.body
            ? Object.assign(Object.assign({}, (response.body.error_code
                ? {
                    'Error code': response.body.error_code,
                }
                : {})), { 'Reject code': String(response.body.reject_code), 'Reject message': response.body.reject_message }) : {
            'HTTP status code': response.status.toString(),
            'HTTP status text': response.statusText,
        })));
        this.requestId = requestId;
        this.response = response;
        this.name = 'UpdateCallRejectedError';
        this.__proto__ = UpdateCallRejectedError.prototype;
        Object.setPrototypeOf(this, UpdateCallRejectedError.prototype);
    }
}
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/fetch_candid.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/fetch_candid.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchCandid": () => (/* binding */ fetchCandid)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _canisterStatus_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canisterStatus/index */ "./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js");
/* harmony import */ var _agent_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./agent/http */ "./node_modules/@dfinity/agent/lib/esm/agent/http/index.js");
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actor */ "./node_modules/@dfinity/agent/lib/esm/actor.js");




/**
 * Retrieves the Candid interface for the specified canister.
 *
 * @param agent The agent to use for the request (usually an `HttpAgent`)
 * @param canisterId A string corresponding to the canister ID
 * @returns Candid source code
 */
async function fetchCandid(canisterId, agent) {
    if (!agent) {
        // Create an anonymous `HttpAgent` (adapted from Candid UI)
        agent = await _agent_http__WEBPACK_IMPORTED_MODULE_2__.HttpAgent.create();
    }
    // Attempt to use canister metadata
    const status = await _canisterStatus_index__WEBPACK_IMPORTED_MODULE_1__.request({
        agent,
        canisterId: _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromText(canisterId),
        paths: ['candid'],
    });
    const candid = status.get('candid');
    if (candid) {
        return candid;
    }
    // Use `__get_candid_interface_tmp_hack` for canisters without Candid metadata
    const tmpHackInterface = ({ IDL }) => IDL.Service({
        __get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
    });
    const actor = _actor__WEBPACK_IMPORTED_MODULE_3__.Actor.createActor(tmpHackInterface, { agent, canisterId });
    return (await actor.__get_candid_interface_tmp_hack());
}
//# sourceMappingURL=fetch_candid.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ACTOR_METHOD_WITH_CERTIFICATE": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.ACTOR_METHOD_WITH_CERTIFICATE),
/* harmony export */   "ACTOR_METHOD_WITH_HTTP_DETAILS": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.ACTOR_METHOD_WITH_HTTP_DETAILS),
/* harmony export */   "Actor": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.Actor),
/* harmony export */   "ActorCallError": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.ActorCallError),
/* harmony export */   "AdvancedActor": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.AdvancedActor),
/* harmony export */   "QueryCallRejectedError": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.QueryCallRejectedError),
/* harmony export */   "UpdateCallRejectedError": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.UpdateCallRejectedError),
/* harmony export */   "getManagementCanister": () => (/* reexport safe */ _actor__WEBPACK_IMPORTED_MODULE_0__.getManagementCanister),
/* harmony export */   "AgentCallError": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.AgentCallError),
/* harmony export */   "AgentHTTPResponseError": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.AgentHTTPResponseError),
/* harmony export */   "AgentQueryError": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.AgentQueryError),
/* harmony export */   "AgentReadStateError": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.AgentReadStateError),
/* harmony export */   "Expiry": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.Expiry),
/* harmony export */   "HttpAgent": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.HttpAgent),
/* harmony export */   "IC_ROOT_KEY": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.IC_ROOT_KEY),
/* harmony export */   "IdentityInvalidError": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.IdentityInvalidError),
/* harmony export */   "MANAGEMENT_CANISTER_ID": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.MANAGEMENT_CANISTER_ID),
/* harmony export */   "ProxyAgent": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.ProxyAgent),
/* harmony export */   "ProxyMessageKind": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.ProxyMessageKind),
/* harmony export */   "ProxyStubAgent": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.ProxyStubAgent),
/* harmony export */   "ReplicaRejectCode": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.ReplicaRejectCode),
/* harmony export */   "RequestStatusResponseStatus": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.RequestStatusResponseStatus),
/* harmony export */   "getDefaultAgent": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.getDefaultAgent),
/* harmony export */   "httpHeadersTransform": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.httpHeadersTransform),
/* harmony export */   "makeExpiryTransform": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.makeExpiryTransform),
/* harmony export */   "makeNonce": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.makeNonce),
/* harmony export */   "makeNonceTransform": () => (/* reexport safe */ _agent__WEBPACK_IMPORTED_MODULE_1__.makeNonceTransform),
/* harmony export */   "SubmitRequestType": () => (/* reexport safe */ _agent_http_types__WEBPACK_IMPORTED_MODULE_3__.SubmitRequestType),
/* harmony export */   "AnonymousIdentity": () => (/* reexport safe */ _auth__WEBPACK_IMPORTED_MODULE_4__.AnonymousIdentity),
/* harmony export */   "SignIdentity": () => (/* reexport safe */ _auth__WEBPACK_IMPORTED_MODULE_4__.SignIdentity),
/* harmony export */   "createIdentityDescriptor": () => (/* reexport safe */ _auth__WEBPACK_IMPORTED_MODULE_4__.createIdentityDescriptor),
/* harmony export */   "createAssetCanisterActor": () => (/* reexport safe */ _canisters_asset__WEBPACK_IMPORTED_MODULE_5__.createAssetCanisterActor),
/* harmony export */   "Certificate": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.Certificate),
/* harmony export */   "CertificateVerificationError": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.CertificateVerificationError),
/* harmony export */   "LookupStatus": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.LookupStatus),
/* harmony export */   "NodeType": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.NodeType),
/* harmony export */   "check_canister_ranges": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.check_canister_ranges),
/* harmony export */   "find_label": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.find_label),
/* harmony export */   "flatten_forks": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.flatten_forks),
/* harmony export */   "hashTreeToString": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.hashTreeToString),
/* harmony export */   "lookupResultToBuffer": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.lookupResultToBuffer),
/* harmony export */   "lookup_path": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.lookup_path),
/* harmony export */   "reconstruct": () => (/* reexport safe */ _certificate__WEBPACK_IMPORTED_MODULE_6__.reconstruct),
/* harmony export */   "DER_COSE_OID": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.DER_COSE_OID),
/* harmony export */   "ED25519_OID": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.ED25519_OID),
/* harmony export */   "SECP256K1_OID": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.SECP256K1_OID),
/* harmony export */   "decodeLen": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.decodeLen),
/* harmony export */   "decodeLenBytes": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.decodeLenBytes),
/* harmony export */   "encodeLen": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.encodeLen),
/* harmony export */   "encodeLenBytes": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.encodeLenBytes),
/* harmony export */   "unwrapDER": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.unwrapDER),
/* harmony export */   "wrapDER": () => (/* reexport safe */ _der__WEBPACK_IMPORTED_MODULE_7__.wrapDER),
/* harmony export */   "fetchCandid": () => (/* reexport safe */ _fetch_candid__WEBPACK_IMPORTED_MODULE_8__.fetchCandid),
/* harmony export */   "Observable": () => (/* reexport safe */ _observable__WEBPACK_IMPORTED_MODULE_9__.Observable),
/* harmony export */   "ObservableLog": () => (/* reexport safe */ _observable__WEBPACK_IMPORTED_MODULE_9__.ObservableLog),
/* harmony export */   "Ed25519PublicKey": () => (/* reexport safe */ _public_key__WEBPACK_IMPORTED_MODULE_10__.Ed25519PublicKey),
/* harmony export */   "hash": () => (/* reexport safe */ _request_id__WEBPACK_IMPORTED_MODULE_11__.hash),
/* harmony export */   "hashOfMap": () => (/* reexport safe */ _request_id__WEBPACK_IMPORTED_MODULE_11__.hashOfMap),
/* harmony export */   "hashValue": () => (/* reexport safe */ _request_id__WEBPACK_IMPORTED_MODULE_11__.hashValue),
/* harmony export */   "requestIdOf": () => (/* reexport safe */ _request_id__WEBPACK_IMPORTED_MODULE_11__.requestIdOf),
/* harmony export */   "blsVerify": () => (/* reexport safe */ _utils_bls__WEBPACK_IMPORTED_MODULE_12__.blsVerify),
/* harmony export */   "verify": () => (/* reexport safe */ _utils_bls__WEBPACK_IMPORTED_MODULE_12__.verify),
/* harmony export */   "bufEquals": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.bufEquals),
/* harmony export */   "bufFromBufLike": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.bufFromBufLike),
/* harmony export */   "compare": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.compare),
/* harmony export */   "concat": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.concat),
/* harmony export */   "fromHex": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.fromHex),
/* harmony export */   "toHex": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.toHex),
/* harmony export */   "uint8ToBuf": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_13__.uint8ToBuf),
/* harmony export */   "randomNumber": () => (/* reexport safe */ _utils_random__WEBPACK_IMPORTED_MODULE_14__.randomNumber),
/* harmony export */   "polling": () => (/* reexport module object */ _polling__WEBPACK_IMPORTED_MODULE_15__),
/* harmony export */   "CanisterStatus": () => (/* reexport module object */ _canisterStatus__WEBPACK_IMPORTED_MODULE_16__),
/* harmony export */   "Cbor": () => (/* reexport module object */ _cbor__WEBPACK_IMPORTED_MODULE_17__),
/* harmony export */   "defaultStrategy": () => (/* reexport safe */ _polling__WEBPACK_IMPORTED_MODULE_15__.defaultStrategy),
/* harmony export */   "pollForResponse": () => (/* reexport safe */ _polling__WEBPACK_IMPORTED_MODULE_15__.pollForResponse),
/* harmony export */   "strategy": () => (/* reexport safe */ _polling__WEBPACK_IMPORTED_MODULE_15__.strategy)
/* harmony export */ });
/* harmony import */ var _actor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actor */ "./node_modules/@dfinity/agent/lib/esm/actor.js");
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./agent */ "./node_modules/@dfinity/agent/lib/esm/agent/index.js");
/* harmony import */ var _agent_http_transforms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./agent/http/transforms */ "./node_modules/@dfinity/agent/lib/esm/agent/http/transforms.js");
/* harmony import */ var _agent_http_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./agent/http/types */ "./node_modules/@dfinity/agent/lib/esm/agent/http/types.js");
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth */ "./node_modules/@dfinity/agent/lib/esm/auth.js");
/* harmony import */ var _canisters_asset__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./canisters/asset */ "./node_modules/@dfinity/agent/lib/esm/canisters/asset.js");
/* harmony import */ var _certificate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./certificate */ "./node_modules/@dfinity/agent/lib/esm/certificate.js");
/* harmony import */ var _der__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./der */ "./node_modules/@dfinity/agent/lib/esm/der.js");
/* harmony import */ var _fetch_candid__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./fetch_candid */ "./node_modules/@dfinity/agent/lib/esm/fetch_candid.js");
/* harmony import */ var _observable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./observable */ "./node_modules/@dfinity/agent/lib/esm/observable.js");
/* harmony import */ var _public_key__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./public_key */ "./node_modules/@dfinity/agent/lib/esm/public_key.js");
/* harmony import */ var _request_id__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./request_id */ "./node_modules/@dfinity/agent/lib/esm/request_id.js");
/* harmony import */ var _utils_bls__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/bls */ "./node_modules/@dfinity/agent/lib/esm/utils/bls.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _utils_random__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./utils/random */ "./node_modules/@dfinity/agent/lib/esm/utils/random.js");
/* harmony import */ var _polling__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./polling */ "./node_modules/@dfinity/agent/lib/esm/polling/index.js");
/* harmony import */ var _canisterStatus__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./canisterStatus */ "./node_modules/@dfinity/agent/lib/esm/canisterStatus/index.js");
/* harmony import */ var _cbor__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./cbor */ "./node_modules/@dfinity/agent/lib/esm/cbor.js");



















//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/observable.js":
/*!***********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/observable.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observable": () => (/* binding */ Observable),
/* harmony export */   "ObservableLog": () => (/* binding */ ObservableLog)
/* harmony export */ });
class Observable {
    constructor() {
        this.observers = [];
    }
    subscribe(func) {
        this.observers.push(func);
    }
    unsubscribe(func) {
        this.observers = this.observers.filter(observer => observer !== func);
    }
    notify(data, ...rest) {
        this.observers.forEach(observer => observer(data, ...rest));
    }
}
class ObservableLog extends Observable {
    constructor() {
        super();
    }
    print(message, ...rest) {
        this.notify({ message, level: 'info' }, ...rest);
    }
    warn(message, ...rest) {
        this.notify({ message, level: 'warn' }, ...rest);
    }
    error(message, error, ...rest) {
        this.notify({ message, level: 'error', error }, ...rest);
    }
}
//# sourceMappingURL=observable.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/polling/backoff.js":
/*!****************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/polling/backoff.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExponentialBackoff": () => (/* binding */ ExponentialBackoff),
/* harmony export */   "exponentialBackoff": () => (/* binding */ exponentialBackoff)
/* harmony export */ });
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExponentialBackoff_currentInterval, _ExponentialBackoff_randomizationFactor, _ExponentialBackoff_multiplier, _ExponentialBackoff_maxInterval, _ExponentialBackoff_startTime, _ExponentialBackoff_maxElapsedTime, _ExponentialBackoff_maxIterations, _ExponentialBackoff_date, _ExponentialBackoff_count;
const RANDOMIZATION_FACTOR = 0.5;
const MULTIPLIER = 1.5;
const INITIAL_INTERVAL_MSEC = 500;
const MAX_INTERVAL_MSEC = 60000;
const MAX_ELAPSED_TIME_MSEC = 900000;
const MAX_ITERATIONS = 10;
/**
 * Exponential backoff strategy.
 */
class ExponentialBackoff {
    constructor(options = ExponentialBackoff.default) {
        _ExponentialBackoff_currentInterval.set(this, void 0);
        _ExponentialBackoff_randomizationFactor.set(this, void 0);
        _ExponentialBackoff_multiplier.set(this, void 0);
        _ExponentialBackoff_maxInterval.set(this, void 0);
        _ExponentialBackoff_startTime.set(this, void 0);
        _ExponentialBackoff_maxElapsedTime.set(this, void 0);
        _ExponentialBackoff_maxIterations.set(this, void 0);
        _ExponentialBackoff_date.set(this, void 0);
        _ExponentialBackoff_count.set(this, 0);
        const { initialInterval = INITIAL_INTERVAL_MSEC, randomizationFactor = RANDOMIZATION_FACTOR, multiplier = MULTIPLIER, maxInterval = MAX_INTERVAL_MSEC, maxElapsedTime = MAX_ELAPSED_TIME_MSEC, maxIterations = MAX_ITERATIONS, date = Date, } = options;
        __classPrivateFieldSet(this, _ExponentialBackoff_currentInterval, initialInterval, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_randomizationFactor, randomizationFactor, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_multiplier, multiplier, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxInterval, maxInterval, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_date, date, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_startTime, date.now(), "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxElapsedTime, maxElapsedTime, "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_maxIterations, maxIterations, "f");
    }
    get ellapsedTimeInMsec() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_date, "f").now() - __classPrivateFieldGet(this, _ExponentialBackoff_startTime, "f");
    }
    get currentInterval() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
    }
    get count() {
        return __classPrivateFieldGet(this, _ExponentialBackoff_count, "f");
    }
    get randomValueFromInterval() {
        const delta = __classPrivateFieldGet(this, _ExponentialBackoff_randomizationFactor, "f") * __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
        const min = __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") - delta;
        const max = __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") + delta;
        return Math.random() * (max - min) + min;
    }
    incrementCurrentInterval() {
        var _a;
        __classPrivateFieldSet(this, _ExponentialBackoff_currentInterval, Math.min(__classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f") * __classPrivateFieldGet(this, _ExponentialBackoff_multiplier, "f"), __classPrivateFieldGet(this, _ExponentialBackoff_maxInterval, "f")), "f");
        __classPrivateFieldSet(this, _ExponentialBackoff_count, (_a = __classPrivateFieldGet(this, _ExponentialBackoff_count, "f"), _a++, _a), "f");
        return __classPrivateFieldGet(this, _ExponentialBackoff_currentInterval, "f");
    }
    next() {
        if (this.ellapsedTimeInMsec >= __classPrivateFieldGet(this, _ExponentialBackoff_maxElapsedTime, "f") || __classPrivateFieldGet(this, _ExponentialBackoff_count, "f") >= __classPrivateFieldGet(this, _ExponentialBackoff_maxIterations, "f")) {
            return null;
        }
        else {
            this.incrementCurrentInterval();
            return this.randomValueFromInterval;
        }
    }
}
_ExponentialBackoff_currentInterval = new WeakMap(), _ExponentialBackoff_randomizationFactor = new WeakMap(), _ExponentialBackoff_multiplier = new WeakMap(), _ExponentialBackoff_maxInterval = new WeakMap(), _ExponentialBackoff_startTime = new WeakMap(), _ExponentialBackoff_maxElapsedTime = new WeakMap(), _ExponentialBackoff_maxIterations = new WeakMap(), _ExponentialBackoff_date = new WeakMap(), _ExponentialBackoff_count = new WeakMap();
ExponentialBackoff.default = {
    initialInterval: INITIAL_INTERVAL_MSEC,
    randomizationFactor: RANDOMIZATION_FACTOR,
    multiplier: MULTIPLIER,
    maxInterval: MAX_INTERVAL_MSEC,
    // 1 minute
    maxElapsedTime: MAX_ELAPSED_TIME_MSEC,
    maxIterations: MAX_ITERATIONS,
    date: Date,
};
/**
 * Utility function to create an exponential backoff iterator.
 * @param options - for the exponential backoff
 * @returns an iterator that yields the next delay in the exponential backoff
 * @yields the next delay in the exponential backoff
 */
function* exponentialBackoff(options = ExponentialBackoff.default) {
    const backoff = new ExponentialBackoff(options);
    let next = backoff.next();
    while (next) {
        yield next;
        next = backoff.next();
    }
}
//# sourceMappingURL=backoff.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/polling/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/polling/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "strategy": () => (/* reexport module object */ _strategy__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   "defaultStrategy": () => (/* reexport safe */ _strategy__WEBPACK_IMPORTED_MODULE_3__.defaultStrategy),
/* harmony export */   "pollForResponse": () => (/* binding */ pollForResponse)
/* harmony export */ });
/* harmony import */ var _agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../agent */ "./node_modules/@dfinity/agent/lib/esm/agent/index.js");
/* harmony import */ var _certificate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../certificate */ "./node_modules/@dfinity/agent/lib/esm/certificate.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");
/* harmony import */ var _strategy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./strategy */ "./node_modules/@dfinity/agent/lib/esm/polling/strategy.js");






/**
 * Check if an object has a property
 * @param value the object that might have the property
 * @param property the key of property we're looking for
 */
function hasProperty(value, property) {
    return Object.prototype.hasOwnProperty.call(value, property);
}
/**
 * Check if value is a signed read state request with expiry
 * @param value to check
 */
function isSignedReadStateRequestWithExpiry(value) {
    return (value !== null &&
        typeof value === 'object' &&
        hasProperty(value, 'body') &&
        value.body !== null &&
        typeof value.body === 'object' &&
        hasProperty(value.body, 'content') &&
        value.body.content !== null &&
        typeof value.body.content === 'object' &&
        hasProperty(value.body.content, 'request_type') &&
        value.body.content.request_type === "read_state" /* ReadRequestType.ReadState */ &&
        hasProperty(value.body.content, 'ingress_expiry') &&
        typeof value.body.content.ingress_expiry === 'object' &&
        value.body.content.ingress_expiry !== null &&
        hasProperty(value.body.content.ingress_expiry, 'toCBOR') &&
        typeof value.body.content.ingress_expiry.toCBOR === 'function' &&
        hasProperty(value.body.content.ingress_expiry, 'toHash') &&
        typeof value.body.content.ingress_expiry.toHash === 'function');
}
/**
 * Polls the IC to check the status of the given request then
 * returns the response bytes once the request has been processed.
 * @param agent The agent to use to poll read_state.
 * @param canisterId The effective canister ID.
 * @param requestId The Request ID to poll status for.
 * @param strategy A polling strategy.
 * @param request Request for the repeated readState call.
 * @param blsVerify - optional replacement function that verifies the BLS signature of a certificate.
 */
async function pollForResponse(agent, canisterId, requestId, strategy = (0,_strategy__WEBPACK_IMPORTED_MODULE_3__.defaultStrategy)(), request, blsVerify) {
    var _a;
    const path = [new TextEncoder().encode('request_status'), requestId];
    const currentRequest = request !== null && request !== void 0 ? request : (await ((_a = agent.createReadStateRequest) === null || _a === void 0 ? void 0 : _a.call(agent, { paths: [path] })));
    const state = await agent.readState(canisterId, { paths: [path] }, undefined, currentRequest);
    if (agent.rootKey == null)
        throw new Error('Agent root key not initialized before polling');
    const cert = await _certificate__WEBPACK_IMPORTED_MODULE_1__.Certificate.create({
        certificate: state.certificate,
        rootKey: agent.rootKey,
        canisterId: canisterId,
        blsVerify,
    });
    const maybeBuf = (0,_certificate__WEBPACK_IMPORTED_MODULE_1__.lookupResultToBuffer)(cert.lookup([...path, new TextEncoder().encode('status')]));
    let status;
    if (typeof maybeBuf === 'undefined') {
        // Missing requestId means we need to wait
        status = _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Unknown;
    }
    else {
        status = new TextDecoder().decode(maybeBuf);
    }
    switch (status) {
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Replied: {
            return {
                reply: (0,_certificate__WEBPACK_IMPORTED_MODULE_1__.lookupResultToBuffer)(cert.lookup([...path, 'reply'])),
                certificate: cert,
            };
        }
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Received:
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Unknown:
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Processing:
            // Execute the polling strategy, then retry.
            await strategy(canisterId, requestId, status);
            return pollForResponse(agent, canisterId, requestId, strategy, currentRequest, blsVerify);
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Rejected: {
            const rejectCode = new Uint8Array((0,_certificate__WEBPACK_IMPORTED_MODULE_1__.lookupResultToBuffer)(cert.lookup([...path, 'reject_code'])))[0];
            const rejectMessage = new TextDecoder().decode((0,_certificate__WEBPACK_IMPORTED_MODULE_1__.lookupResultToBuffer)(cert.lookup([...path, 'reject_message'])));
            throw new Error(`Call was rejected:\n` +
                `  Request ID: ${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.toHex)(requestId)}\n` +
                `  Reject code: ${rejectCode}\n` +
                `  Reject text: ${rejectMessage}\n`);
        }
        case _agent__WEBPACK_IMPORTED_MODULE_0__.RequestStatusResponseStatus.Done:
            // This is _technically_ not an error, but we still didn't see the `Replied` status so
            // we don't know the result and cannot decode it.
            throw new Error(`Call was marked as done but we never saw the reply:\n` +
                `  Request ID: ${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.toHex)(requestId)}\n`);
    }
    throw new Error('unreachable');
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/polling/strategy.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/polling/strategy.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaultStrategy": () => (/* binding */ defaultStrategy),
/* harmony export */   "once": () => (/* binding */ once),
/* harmony export */   "conditionalDelay": () => (/* binding */ conditionalDelay),
/* harmony export */   "maxAttempts": () => (/* binding */ maxAttempts),
/* harmony export */   "throttle": () => (/* binding */ throttle),
/* harmony export */   "timeout": () => (/* binding */ timeout),
/* harmony export */   "backoff": () => (/* binding */ backoff),
/* harmony export */   "chain": () => (/* binding */ chain)
/* harmony export */ });
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");

const FIVE_MINUTES_IN_MSEC = 5 * 60 * 1000;
/**
 * A best practices polling strategy: wait 2 seconds before the first poll, then 1 second
 * with an exponential backoff factor of 1.2. Timeout after 5 minutes.
 */
function defaultStrategy() {
    return chain(conditionalDelay(once(), 1000), backoff(1000, 1.2), timeout(FIVE_MINUTES_IN_MSEC));
}
/**
 * Predicate that returns true once.
 */
function once() {
    let first = true;
    return async () => {
        if (first) {
            first = false;
            return true;
        }
        return false;
    };
}
/**
 * Delay the polling once.
 * @param condition A predicate that indicates when to delay.
 * @param timeInMsec The amount of time to delay.
 */
function conditionalDelay(condition, timeInMsec) {
    return async (canisterId, requestId, status) => {
        if (await condition(canisterId, requestId, status)) {
            return new Promise(resolve => setTimeout(resolve, timeInMsec));
        }
    };
}
/**
 * Error out after a maximum number of polling has been done.
 * @param count The maximum attempts to poll.
 */
function maxAttempts(count) {
    let attempts = count;
    return async (canisterId, requestId, status) => {
        if (--attempts <= 0) {
            throw new Error(`Failed to retrieve a reply for request after ${count} attempts:\n` +
                `  Request ID: ${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.toHex)(requestId)}\n` +
                `  Request status: ${status}\n`);
        }
    };
}
/**
 * Throttle polling.
 * @param throttleInMsec Amount in millisecond to wait between each polling.
 */
function throttle(throttleInMsec) {
    return () => new Promise(resolve => setTimeout(resolve, throttleInMsec));
}
/**
 * Reject a call after a certain amount of time.
 * @param timeInMsec Time in milliseconds before the polling should be rejected.
 */
function timeout(timeInMsec) {
    const end = Date.now() + timeInMsec;
    return async (canisterId, requestId, status) => {
        if (Date.now() > end) {
            throw new Error(`Request timed out after ${timeInMsec} msec:\n` +
                `  Request ID: ${(0,_utils_buffer__WEBPACK_IMPORTED_MODULE_0__.toHex)(requestId)}\n` +
                `  Request status: ${status}\n`);
        }
    };
}
/**
 * A strategy that throttle, but using an exponential backoff strategy.
 * @param startingThrottleInMsec The throttle in milliseconds to start with.
 * @param backoffFactor The factor to multiple the throttle time between every poll. For
 *   example if using 2, the throttle will double between every run.
 */
function backoff(startingThrottleInMsec, backoffFactor) {
    let currentThrottling = startingThrottleInMsec;
    return () => new Promise(resolve => setTimeout(() => {
        currentThrottling *= backoffFactor;
        resolve();
    }, currentThrottling));
}
/**
 * Chain multiple polling strategy. This _chains_ the strategies, so if you pass in,
 * say, two throttling strategy of 1 second, it will result in a throttle of 2 seconds.
 * @param strategies A strategy list to chain.
 */
function chain(...strategies) {
    return async (canisterId, requestId, status) => {
        for (const a of strategies) {
            await a(canisterId, requestId, status);
        }
    };
}
//# sourceMappingURL=strategy.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/public_key.js":
/*!***********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/public_key.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ed25519PublicKey": () => (/* binding */ Ed25519PublicKey)
/* harmony export */ });
/* harmony import */ var _der__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./der */ "./node_modules/@dfinity/agent/lib/esm/der.js");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Ed25519PublicKey_rawKey, _Ed25519PublicKey_derKey;

class Ed25519PublicKey {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(key) {
        _Ed25519PublicKey_rawKey.set(this, void 0);
        _Ed25519PublicKey_derKey.set(this, void 0);
        if (key.byteLength !== Ed25519PublicKey.RAW_KEY_LENGTH) {
            throw new Error('An Ed25519 public key must be exactly 32bytes long');
        }
        __classPrivateFieldSet(this, _Ed25519PublicKey_rawKey, key, "f");
        __classPrivateFieldSet(this, _Ed25519PublicKey_derKey, Ed25519PublicKey.derEncode(key), "f");
    }
    static from(key) {
        return this.fromDer(key.toDer());
    }
    static fromRaw(rawKey) {
        return new Ed25519PublicKey(rawKey);
    }
    static fromDer(derKey) {
        return new Ed25519PublicKey(this.derDecode(derKey));
    }
    static derEncode(publicKey) {
        return (0,_der__WEBPACK_IMPORTED_MODULE_0__.wrapDER)(publicKey, _der__WEBPACK_IMPORTED_MODULE_0__.ED25519_OID).buffer;
    }
    static derDecode(key) {
        const unwrapped = (0,_der__WEBPACK_IMPORTED_MODULE_0__.unwrapDER)(key, _der__WEBPACK_IMPORTED_MODULE_0__.ED25519_OID);
        if (unwrapped.length !== this.RAW_KEY_LENGTH) {
            throw new Error('An Ed25519 public key must be exactly 32bytes long');
        }
        return unwrapped;
    }
    get rawKey() {
        return __classPrivateFieldGet(this, _Ed25519PublicKey_rawKey, "f");
    }
    get derKey() {
        return __classPrivateFieldGet(this, _Ed25519PublicKey_derKey, "f");
    }
    toDer() {
        return this.derKey;
    }
    toRaw() {
        return this.rawKey;
    }
}
_Ed25519PublicKey_rawKey = new WeakMap(), _Ed25519PublicKey_derKey = new WeakMap();
// The length of Ed25519 public keys is always 32 bytes.
Ed25519PublicKey.RAW_KEY_LENGTH = 32;
//# sourceMappingURL=public_key.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/request_id.js":
/*!***********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/request_id.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hash": () => (/* binding */ hash),
/* harmony export */   "hashValue": () => (/* binding */ hashValue),
/* harmony export */   "requestIdOf": () => (/* binding */ requestIdOf),
/* harmony export */   "hashOfMap": () => (/* binding */ hashOfMap)
/* harmony export */ });
/* harmony import */ var _dfinity_candid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/candid */ "./node_modules/@dfinity/candid/lib/esm/index.js");
/* harmony import */ var borc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! borc */ "./node_modules/borc/src/index.js");
/* harmony import */ var _noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @noble/hashes/sha256 */ "./node_modules/@noble/hashes/esm/sha256.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");




/**
 * sha256 hash the provided Buffer
 * @param data - input to hash function
 */
function hash(data) {
    return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.uint8ToBuf)(_noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_3__.sha256.create().update(new Uint8Array(data)).digest());
}
/**
 *
 * @param value unknown value
 * @returns ArrayBuffer
 */
function hashValue(value) {
    if (value instanceof borc__WEBPACK_IMPORTED_MODULE_1__.Tagged) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return hashValue(value.value);
    }
    else if (typeof value === 'string') {
        return hashString(value);
    }
    else if (typeof value === 'number') {
        return hash((0,_dfinity_candid__WEBPACK_IMPORTED_MODULE_0__.lebEncode)(value));
    }
    else if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
        return hash(value);
    }
    else if (Array.isArray(value)) {
        const vals = value.map(hashValue);
        return hash((0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.concat)(...vals));
    }
    else if (value && typeof value === 'object' && value._isPrincipal) {
        return hash(value.toUint8Array());
    }
    else if (typeof value === 'object' &&
        value !== null &&
        typeof value.toHash === 'function') {
        return hashValue(value.toHash());
        // TODO This should be move to a specific async method as the webauthn flow required
        // the flow to be synchronous to ensure Safari touch id works.
        // } else if (value instanceof Promise) {
        //   return value.then(x => hashValue(x));
    }
    else if (typeof value === 'object') {
        return hashOfMap(value);
    }
    else if (typeof value === 'bigint') {
        // Do this check much later than the other bigint check because this one is much less
        // type-safe.
        // So we want to try all the high-assurance type guards before this 'probable' one.
        return hash((0,_dfinity_candid__WEBPACK_IMPORTED_MODULE_0__.lebEncode)(value));
    }
    throw Object.assign(new Error(`Attempt to hash a value of unsupported type: ${value}`), {
        // include so logs/callers can understand the confusing value.
        // (when stringified in error message, prototype info is lost)
        value,
    });
}
const hashString = (value) => {
    const encoded = new TextEncoder().encode(value);
    return hash(encoded);
};
/**
 * Get the RequestId of the provided ic-ref request.
 * RequestId is the result of the representation-independent-hash function.
 * https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
 * @param request - ic-ref request to hash into RequestId
 */
function requestIdOf(request) {
    return hashOfMap(request);
}
/**
 * Hash a map into an ArrayBuffer using the representation-independent-hash function.
 * https://sdk.dfinity.org/docs/interface-spec/index.html#hash-of-map
 * @param map - Any non-nested object
 * @returns ArrayBuffer
 */
function hashOfMap(map) {
    const hashed = Object.entries(map)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => {
        const hashedKey = hashString(key);
        const hashedValue = hashValue(value);
        return [hashedKey, hashedValue];
    });
    const traversed = hashed;
    const sorted = traversed.sort(([k1], [k2]) => {
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.compare)(k1, k2);
    });
    const concatenated = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.concat)(...sorted.map(x => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_2__.concat)(...x)));
    const result = hash(concatenated);
    return result;
}
//# sourceMappingURL=request_id.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/utils/bls.js":
/*!**********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/utils/bls.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "verify": () => (/* binding */ verify),
/* harmony export */   "blsVerify": () => (/* binding */ blsVerify)
/* harmony export */ });
/* harmony import */ var _noble_curves_bls12_381__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/curves/bls12-381 */ "./node_modules/@noble/curves/esm/bls12-381.js");
/* harmony import */ var _buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer */ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js");


let verify;
/**
 *
 * @param pk primary key: Uint8Array
 * @param sig signature: Uint8Array
 * @param msg message: Uint8Array
 * @returns boolean
 */
function blsVerify(pk, sig, msg) {
    const primaryKey = typeof pk === 'string' ? pk : (0,_buffer__WEBPACK_IMPORTED_MODULE_0__.toHex)(pk);
    const signature = typeof sig === 'string' ? sig : (0,_buffer__WEBPACK_IMPORTED_MODULE_0__.toHex)(sig);
    const message = typeof msg === 'string' ? msg : (0,_buffer__WEBPACK_IMPORTED_MODULE_0__.toHex)(msg);
    return _noble_curves_bls12_381__WEBPACK_IMPORTED_MODULE_1__.bls12_381.verifyShortSignature(signature, message, primaryKey);
}
//# sourceMappingURL=bls.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/utils/buffer.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/utils/buffer.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "toHex": () => (/* binding */ toHex),
/* harmony export */   "fromHex": () => (/* binding */ fromHex),
/* harmony export */   "compare": () => (/* binding */ compare),
/* harmony export */   "bufEquals": () => (/* binding */ bufEquals),
/* harmony export */   "uint8ToBuf": () => (/* binding */ uint8ToBuf),
/* harmony export */   "bufFromBufLike": () => (/* binding */ bufFromBufLike)
/* harmony export */ });
/**
 * Concatenate multiple array buffers.
 * @param buffers The buffers to concatenate.
 */
function concat(...buffers) {
    const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
    let index = 0;
    for (const b of buffers) {
        result.set(new Uint8Array(b), index);
        index += b.byteLength;
    }
    return result.buffer;
}
/**
 * Transforms a buffer to an hexadecimal string. This will use the buffer as an Uint8Array.
 * @param buffer The buffer to return the hexadecimal string of.
 */
function toHex(buffer) {
    return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const hexRe = new RegExp(/^[0-9a-fA-F]+$/);
/**
 * Transforms a hexadecimal string into an array buffer.
 * @param hex The hexadecimal string to use.
 */
function fromHex(hex) {
    if (!hexRe.test(hex)) {
        throw new Error('Invalid hexadecimal string.');
    }
    const buffer = [...hex]
        .reduce((acc, curr, i) => {
        acc[(i / 2) | 0] = (acc[(i / 2) | 0] || '') + curr;
        return acc;
    }, [])
        .map(x => Number.parseInt(x, 16));
    return new Uint8Array(buffer).buffer;
}
/**
 *
 * @param b1 array buffer 1
 * @param b2 array buffer 2
 * @returns number - negative if b1 < b2, positive if b1 > b2, 0 if b1 === b2
 */
function compare(b1, b2) {
    if (b1.byteLength !== b2.byteLength) {
        return b1.byteLength - b2.byteLength;
    }
    const u1 = new Uint8Array(b1);
    const u2 = new Uint8Array(b2);
    for (let i = 0; i < u1.length; i++) {
        if (u1[i] !== u2[i]) {
            return u1[i] - u2[i];
        }
    }
    return 0;
}
/**
 * Checks two array buffers for equality.
 * @param b1 array buffer 1
 * @param b2 array buffer 2
 * @returns boolean
 */
function bufEquals(b1, b2) {
    return compare(b1, b2) === 0;
}
/**
 * Returns a true ArrayBuffer from a Uint8Array, as Uint8Array.buffer is unsafe.
 * @param {Uint8Array} arr Uint8Array to convert
 * @returns ArrayBuffer
 */
function uint8ToBuf(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).buffer;
}
/**
 * Returns a true ArrayBuffer from an ArrayBufferLike object.
 * @param bufLike a buffer-like object
 * @returns ArrayBuffer
 */
function bufFromBufLike(bufLike) {
    if (bufLike instanceof Uint8Array) {
        return uint8ToBuf(bufLike);
    }
    if (bufLike instanceof ArrayBuffer) {
        return bufLike;
    }
    if (Array.isArray(bufLike)) {
        return uint8ToBuf(new Uint8Array(bufLike));
    }
    if ('buffer' in bufLike) {
        return bufFromBufLike(bufLike.buffer);
    }
    return uint8ToBuf(new Uint8Array(bufLike));
}
//# sourceMappingURL=buffer.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/utils/expirableMap.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/utils/expirableMap.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ExpirableMap": () => (/* binding */ ExpirableMap)
/* harmony export */ });
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExpirableMap_inner, _ExpirableMap_expirationTime, _a, _b;
/**
 * A map that expires entries after a given time.
 * Defaults to 10 minutes.
 */
class ExpirableMap {
    /**
     * Create a new ExpirableMap.
     * @param {ExpirableMapOptions<any, any>} options - options for the map.
     * @param {Iterable<[any, any]>} options.source - an optional source of entries to initialize the map with.
     * @param {number} options.expirationTime - the time in milliseconds after which entries will expire.
     */
    constructor(options = {}) {
        // Internals
        _ExpirableMap_inner.set(this, void 0);
        _ExpirableMap_expirationTime.set(this, void 0);
        this[_a] = this.entries.bind(this);
        this[_b] = 'ExpirableMap';
        const { source = [], expirationTime = 10 * 60 * 1000 } = options;
        const currentTime = Date.now();
        __classPrivateFieldSet(this, _ExpirableMap_inner, new Map([...source].map(([key, value]) => [key, { value, timestamp: currentTime }])), "f");
        __classPrivateFieldSet(this, _ExpirableMap_expirationTime, expirationTime, "f");
    }
    /**
     * Prune removes all expired entries.
     */
    prune() {
        const currentTime = Date.now();
        for (const [key, entry] of __classPrivateFieldGet(this, _ExpirableMap_inner, "f").entries()) {
            if (currentTime - entry.timestamp > __classPrivateFieldGet(this, _ExpirableMap_expirationTime, "f")) {
                __classPrivateFieldGet(this, _ExpirableMap_inner, "f").delete(key);
            }
        }
        return this;
    }
    // Implementing the Map interface
    /**
     * Set the value for the given key. Prunes expired entries.
     * @param key for the entry
     * @param value of the entry
     * @returns this
     */
    set(key, value) {
        this.prune();
        const entry = {
            value,
            timestamp: Date.now(),
        };
        __classPrivateFieldGet(this, _ExpirableMap_inner, "f").set(key, entry);
        return this;
    }
    /**
     * Get the value associated with the key, if it exists and has not expired.
     * @param key K
     * @returns the value associated with the key, or undefined if the key is not present or has expired.
     */
    get(key) {
        const entry = __classPrivateFieldGet(this, _ExpirableMap_inner, "f").get(key);
        if (entry === undefined) {
            return undefined;
        }
        if (Date.now() - entry.timestamp > __classPrivateFieldGet(this, _ExpirableMap_expirationTime, "f")) {
            __classPrivateFieldGet(this, _ExpirableMap_inner, "f").delete(key);
            return undefined;
        }
        return entry.value;
    }
    /**
     * Clear all entries.
     */
    clear() {
        __classPrivateFieldGet(this, _ExpirableMap_inner, "f").clear();
    }
    /**
     * Entries returns the entries of the map, without the expiration time.
     * @returns an iterator over the entries of the map.
     */
    entries() {
        const iterator = __classPrivateFieldGet(this, _ExpirableMap_inner, "f").entries();
        const generator = function* () {
            for (const [key, value] of iterator) {
                yield [key, value.value];
            }
        };
        return generator();
    }
    /**
     * Values returns the values of the map, without the expiration time.
     * @returns an iterator over the values of the map.
     */
    values() {
        const iterator = __classPrivateFieldGet(this, _ExpirableMap_inner, "f").values();
        const generator = function* () {
            for (const value of iterator) {
                yield value.value;
            }
        };
        return generator();
    }
    /**
     * Keys returns the keys of the map
     * @returns an iterator over the keys of the map.
     */
    keys() {
        return __classPrivateFieldGet(this, _ExpirableMap_inner, "f").keys();
    }
    /**
     * forEach calls the callbackfn on each entry of the map.
     * @param callbackfn to call on each entry
     * @param thisArg to use as this when calling the callbackfn
     */
    forEach(callbackfn, thisArg) {
        for (const [key, value] of __classPrivateFieldGet(this, _ExpirableMap_inner, "f").entries()) {
            callbackfn.call(thisArg, value.value, key, this);
        }
    }
    /**
     * has returns true if the key exists and has not expired.
     * @param key K
     * @returns true if the key exists and has not expired.
     */
    has(key) {
        return __classPrivateFieldGet(this, _ExpirableMap_inner, "f").has(key);
    }
    /**
     * delete the entry for the given key.
     * @param key K
     * @returns true if the key existed and has been deleted.
     */
    delete(key) {
        return __classPrivateFieldGet(this, _ExpirableMap_inner, "f").delete(key);
    }
    /**
     * get size of the map.
     * @returns the size of the map.
     */
    get size() {
        return __classPrivateFieldGet(this, _ExpirableMap_inner, "f").size;
    }
}
_ExpirableMap_inner = new WeakMap(), _ExpirableMap_expirationTime = new WeakMap(), _a = Symbol.iterator, _b = Symbol.toStringTag;
//# sourceMappingURL=expirableMap.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/utils/leb.js":
/*!**********************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/utils/leb.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decodeLeb128": () => (/* binding */ decodeLeb128),
/* harmony export */   "decodeTime": () => (/* binding */ decodeTime)
/* harmony export */ });
/* harmony import */ var _dfinity_candid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/candid */ "./node_modules/@dfinity/candid/lib/esm/index.js");

const decodeLeb128 = (buf) => {
    return (0,_dfinity_candid__WEBPACK_IMPORTED_MODULE_0__.lebDecode)(new _dfinity_candid__WEBPACK_IMPORTED_MODULE_0__.PipeArrayBuffer(buf));
};
// time is a LEB128-encoded Nat
const decodeTime = (buf) => {
    const decoded = decodeLeb128(buf);
    // nanoseconds to milliseconds
    return new Date(Number(decoded) / 1000000);
};
//# sourceMappingURL=leb.js.map

/***/ }),

/***/ "./node_modules/@dfinity/agent/lib/esm/utils/random.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dfinity/agent/lib/esm/utils/random.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "randomNumber": () => (/* binding */ randomNumber)
/* harmony export */ });
/**
 * Generates a random unsigned 32-bit integer between 0 and 0xffffffff
 * @returns {number} a random number
 */
const randomNumber = () => {
    // determine whether browser crypto is available
    if (typeof window !== 'undefined' && !!window.crypto && !!window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0];
    }
    // A second check for webcrypto, in case it is loaded under global instead of window
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return array[0];
    }
    // determine whether node crypto is available
    if (typeof crypto !== 'undefined' && crypto.randomInt) {
        return crypto.randomInt(0, 0xffffffff);
    }
    // fall back to Math.random
    return Math.floor(Math.random() * 0xffffffff);
};
//# sourceMappingURL=random.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/candid-core.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/candid-core.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputBox": () => (/* binding */ InputBox),
/* harmony export */   "InputForm": () => (/* binding */ InputForm),
/* harmony export */   "RecordForm": () => (/* binding */ RecordForm),
/* harmony export */   "TupleForm": () => (/* binding */ TupleForm),
/* harmony export */   "VariantForm": () => (/* binding */ VariantForm),
/* harmony export */   "OptionForm": () => (/* binding */ OptionForm),
/* harmony export */   "VecForm": () => (/* binding */ VecForm)
/* harmony export */ });
class InputBox {
    constructor(idl, ui) {
        this.idl = idl;
        this.ui = ui;
        this.label = null;
        this.value = undefined;
        const status = document.createElement('span');
        status.className = 'status';
        this.status = status;
        if (ui.input) {
            ui.input.addEventListener('blur', () => {
                if (ui.input.value === '') {
                    return;
                }
                this.parse();
            });
            ui.input.addEventListener('input', () => {
                status.style.display = 'none';
                ui.input.classList.remove('reject');
            });
        }
    }
    isRejected() {
        return this.value === undefined;
    }
    parse(config = {}) {
        if (this.ui.form) {
            const value = this.ui.form.parse(config);
            this.value = value;
            return value;
        }
        if (this.ui.input) {
            const input = this.ui.input;
            try {
                const value = this.ui.parse(this.idl, config, input.value);
                if (!this.idl.covariant(value)) {
                    throw new Error(`${input.value} is not of type ${this.idl.display()}`);
                }
                this.status.style.display = 'none';
                this.value = value;
                return value;
            }
            catch (err) {
                input.classList.add('reject');
                this.status.style.display = 'block';
                this.status.innerHTML = 'InputError: ' + err.message;
                this.value = undefined;
                return undefined;
            }
        }
        return null;
    }
    render(dom) {
        const container = document.createElement('span');
        if (this.label) {
            const label = document.createElement('label');
            label.innerText = this.label;
            container.appendChild(label);
        }
        if (this.ui.input) {
            container.appendChild(this.ui.input);
            container.appendChild(this.status);
        }
        if (this.ui.form) {
            this.ui.form.render(container);
        }
        dom.appendChild(container);
    }
}
class InputForm {
    constructor(ui) {
        this.ui = ui;
        this.form = [];
    }
    renderForm(dom) {
        if (this.ui.container) {
            this.form.forEach(e => e.render(this.ui.container));
            dom.appendChild(this.ui.container);
        }
        else {
            this.form.forEach(e => e.render(dom));
        }
    }
    render(dom) {
        if (this.ui.open && this.ui.event) {
            dom.appendChild(this.ui.open);
            const form = this;
            // eslint-disable-next-line
            form.ui.open.addEventListener(form.ui.event, () => {
                // Remove old form
                if (form.ui.container) {
                    form.ui.container.innerHTML = '';
                }
                else {
                    const oldContainer = form.ui.open.nextElementSibling;
                    if (oldContainer) {
                        oldContainer.parentNode.removeChild(oldContainer);
                    }
                }
                // Render form
                form.generateForm();
                form.renderForm(dom);
            });
        }
        else {
            this.generateForm();
            this.renderForm(dom);
        }
    }
}
class RecordForm extends InputForm {
    constructor(fields, ui) {
        super(ui);
        this.fields = fields;
        this.ui = ui;
    }
    generateForm() {
        this.form = this.fields.map(([key, type]) => {
            const input = this.ui.render(type);
            // eslint-disable-next-line
            if (this.ui.labelMap && this.ui.labelMap.hasOwnProperty(key)) {
                input.label = this.ui.labelMap[key] + ' ';
            }
            else {
                input.label = key + ' ';
            }
            return input;
        });
    }
    parse(config) {
        const v = {};
        this.fields.forEach(([key, _], i) => {
            const value = this.form[i].parse(config);
            v[key] = value;
        });
        if (this.form.some(input => input.isRejected())) {
            return undefined;
        }
        return v;
    }
}
class TupleForm extends InputForm {
    constructor(components, ui) {
        super(ui);
        this.components = components;
        this.ui = ui;
    }
    generateForm() {
        this.form = this.components.map(type => {
            const input = this.ui.render(type);
            return input;
        });
    }
    parse(config) {
        const v = [];
        this.components.forEach((_, i) => {
            const value = this.form[i].parse(config);
            v.push(value);
        });
        if (this.form.some(input => input.isRejected())) {
            return undefined;
        }
        return v;
    }
}
class VariantForm extends InputForm {
    constructor(fields, ui) {
        super(ui);
        this.fields = fields;
        this.ui = ui;
    }
    generateForm() {
        const index = this.ui.open.selectedIndex;
        const [_, type] = this.fields[index];
        const variant = this.ui.render(type);
        this.form = [variant];
    }
    parse(config) {
        const select = this.ui.open;
        const selected = select.options[select.selectedIndex].value;
        const value = this.form[0].parse(config);
        if (value === undefined) {
            return undefined;
        }
        const v = {};
        v[selected] = value;
        return v;
    }
}
class OptionForm extends InputForm {
    constructor(ty, ui) {
        super(ui);
        this.ty = ty;
        this.ui = ui;
    }
    generateForm() {
        if (this.ui.open.checked) {
            const opt = this.ui.render(this.ty);
            this.form = [opt];
        }
        else {
            this.form = [];
        }
    }
    parse(config) {
        if (this.form.length === 0) {
            return [];
        }
        else {
            const value = this.form[0].parse(config);
            if (value === undefined) {
                return undefined;
            }
            return [value];
        }
    }
}
class VecForm extends InputForm {
    constructor(ty, ui) {
        super(ui);
        this.ty = ty;
        this.ui = ui;
    }
    generateForm() {
        const len = +this.ui.open.value;
        this.form = [];
        for (let i = 0; i < len; i++) {
            const t = this.ui.render(this.ty);
            this.form.push(t);
        }
    }
    parse(config) {
        const value = this.form.map(input => {
            return input.parse(config);
        });
        if (this.form.some(input => input.isRejected())) {
            return undefined;
        }
        return value;
    }
}
//# sourceMappingURL=candid-core.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/candid-ui.js":
/*!***********************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/candid-ui.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "inputBox": () => (/* binding */ inputBox),
/* harmony export */   "recordForm": () => (/* binding */ recordForm),
/* harmony export */   "tupleForm": () => (/* binding */ tupleForm),
/* harmony export */   "variantForm": () => (/* binding */ variantForm),
/* harmony export */   "optForm": () => (/* binding */ optForm),
/* harmony export */   "vecForm": () => (/* binding */ vecForm),
/* harmony export */   "Render": () => (/* binding */ Render),
/* harmony export */   "renderInput": () => (/* binding */ renderInput),
/* harmony export */   "renderValue": () => (/* binding */ renderValue)
/* harmony export */ });
/* harmony import */ var _idl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idl */ "./node_modules/@dfinity/candid/lib/esm/idl.js");
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _candid_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./candid-core */ "./node_modules/@dfinity/candid/lib/esm/candid-core.js");
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */



const InputConfig = { parse: parsePrimitive };
const FormConfig = { render: renderInput };
const inputBox = (t, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.InputBox(t, Object.assign(Object.assign({}, InputConfig), config));
};
const recordForm = (fields, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.RecordForm(fields, Object.assign(Object.assign({}, FormConfig), config));
};
const tupleForm = (components, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.TupleForm(components, Object.assign(Object.assign({}, FormConfig), config));
};
const variantForm = (fields, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.VariantForm(fields, Object.assign(Object.assign({}, FormConfig), config));
};
const optForm = (ty, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.OptionForm(ty, Object.assign(Object.assign({}, FormConfig), config));
};
const vecForm = (ty, config) => {
    return new _candid_core__WEBPACK_IMPORTED_MODULE_2__.VecForm(ty, Object.assign(Object.assign({}, FormConfig), config));
};
class Render extends _idl__WEBPACK_IMPORTED_MODULE_0__.Visitor {
    visitType(t, d) {
        const input = document.createElement('input');
        input.classList.add('argument');
        input.placeholder = t.display();
        return inputBox(t, { input });
    }
    visitNull(t, d) {
        return inputBox(t, {});
    }
    visitRecord(t, fields, d) {
        let config = {};
        if (fields.length > 1) {
            const container = document.createElement('div');
            container.classList.add('popup-form');
            config = { container };
        }
        const form = recordForm(fields, config);
        return inputBox(t, { form });
    }
    visitTuple(t, components, d) {
        let config = {};
        if (components.length > 1) {
            const container = document.createElement('div');
            container.classList.add('popup-form');
            config = { container };
        }
        const form = tupleForm(components, config);
        return inputBox(t, { form });
    }
    visitVariant(t, fields, d) {
        const select = document.createElement('select');
        for (const [key, type] of fields) {
            const option = new Option(key);
            select.add(option);
        }
        select.selectedIndex = -1;
        select.classList.add('open');
        const config = { open: select, event: 'change' };
        const form = variantForm(fields, config);
        return inputBox(t, { form });
    }
    visitOpt(t, ty, d) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('open');
        const form = optForm(ty, { open: checkbox, event: 'change' });
        return inputBox(t, { form });
    }
    visitVec(t, ty, d) {
        const len = document.createElement('input');
        len.type = 'number';
        len.min = '0';
        len.max = '100';
        len.style.width = '8rem';
        len.placeholder = 'len';
        len.classList.add('open');
        const container = document.createElement('div');
        container.classList.add('popup-form');
        const form = vecForm(ty, { open: len, event: 'change', container });
        return inputBox(t, { form });
    }
    visitRec(t, ty, d) {
        return renderInput(ty);
    }
}
class Parse extends _idl__WEBPACK_IMPORTED_MODULE_0__.Visitor {
    visitNull(t, v) {
        return null;
    }
    visitBool(t, v) {
        if (v === 'true') {
            return true;
        }
        if (v === 'false') {
            return false;
        }
        throw new Error(`Cannot parse ${v} as boolean`);
    }
    visitText(t, v) {
        return v;
    }
    visitFloat(t, v) {
        return parseFloat(v);
    }
    visitFixedInt(t, v) {
        if (t._bits <= 32) {
            return parseInt(v, 10);
        }
        else {
            return BigInt(v);
        }
    }
    visitFixedNat(t, v) {
        if (t._bits <= 32) {
            return parseInt(v, 10);
        }
        else {
            return BigInt(v);
        }
    }
    visitNumber(t, v) {
        return BigInt(v);
    }
    visitPrincipal(t, v) {
        return _dfinity_principal__WEBPACK_IMPORTED_MODULE_1__.Principal.fromText(v);
    }
    visitService(t, v) {
        return _dfinity_principal__WEBPACK_IMPORTED_MODULE_1__.Principal.fromText(v);
    }
    visitFunc(t, v) {
        const x = v.split('.', 2);
        return [_dfinity_principal__WEBPACK_IMPORTED_MODULE_1__.Principal.fromText(x[0]), x[1]];
    }
}
class Random extends _idl__WEBPACK_IMPORTED_MODULE_0__.Visitor {
    visitNull(t, v) {
        return null;
    }
    visitBool(t, v) {
        return Math.random() < 0.5;
    }
    visitText(t, v) {
        return Math.random().toString(36).substring(6);
    }
    visitFloat(t, v) {
        return Math.random();
    }
    visitInt(t, v) {
        return BigInt(this.generateNumber(true));
    }
    visitNat(t, v) {
        return BigInt(this.generateNumber(false));
    }
    visitFixedInt(t, v) {
        const x = this.generateNumber(true);
        if (t._bits <= 32) {
            return x;
        }
        else {
            return BigInt(v);
        }
    }
    visitFixedNat(t, v) {
        const x = this.generateNumber(false);
        if (t._bits <= 32) {
            return x;
        }
        else {
            return BigInt(v);
        }
    }
    generateNumber(signed) {
        const num = Math.floor(Math.random() * 100);
        if (signed && Math.random() < 0.5) {
            return -num;
        }
        else {
            return num;
        }
    }
}
function parsePrimitive(t, config, d) {
    if (config.random && d === '') {
        return t.accept(new Random(), d);
    }
    else {
        return t.accept(new Parse(), d);
    }
}
/**
 *
 * @param t an IDL type
 * @returns an input for that type
 */
function renderInput(t) {
    return t.accept(new Render(), null);
}
/**
 *
 * @param t an IDL Type
 * @param input an InputBox
 * @param value any
 * @returns rendering that value to the provided input
 */
function renderValue(t, input, value) {
    return t.accept(new RenderValue(), { input, value });
}
class RenderValue extends _idl__WEBPACK_IMPORTED_MODULE_0__.Visitor {
    visitType(t, d) {
        d.input.ui.input.value = t.valueToString(d.value);
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    visitNull(t, d) { }
    visitText(t, d) {
        d.input.ui.input.value = d.value;
    }
    visitRec(t, ty, d) {
        renderValue(ty, d.input, d.value);
    }
    visitOpt(t, ty, d) {
        if (d.value.length === 0) {
            return;
        }
        else {
            const form = d.input.ui.form;
            const open = form.ui.open;
            open.checked = true;
            open.dispatchEvent(new Event(form.ui.event));
            renderValue(ty, form.form[0], d.value[0]);
        }
    }
    visitRecord(t, fields, d) {
        const form = d.input.ui.form;
        fields.forEach(([key, type], i) => {
            renderValue(type, form.form[i], d.value[key]);
        });
    }
    visitTuple(t, components, d) {
        const form = d.input.ui.form;
        components.forEach((type, i) => {
            renderValue(type, form.form[i], d.value[i]);
        });
    }
    visitVariant(t, fields, d) {
        const form = d.input.ui.form;
        const selected = Object.entries(d.value)[0];
        fields.forEach(([key, type], i) => {
            if (key === selected[0]) {
                const open = form.ui.open;
                open.selectedIndex = i;
                open.dispatchEvent(new Event(form.ui.event));
                renderValue(type, form.form[0], selected[1]);
            }
        });
    }
    visitVec(t, ty, d) {
        const form = d.input.ui.form;
        const len = d.value.length;
        const open = form.ui.open;
        open.value = len;
        open.dispatchEvent(new Event(form.ui.event));
        d.value.forEach((v, i) => {
            renderValue(ty, form.form[i], v);
        });
    }
}
//# sourceMappingURL=candid-ui.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/idl.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/idl.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Visitor": () => (/* binding */ Visitor),
/* harmony export */   "Type": () => (/* binding */ Type),
/* harmony export */   "PrimitiveType": () => (/* binding */ PrimitiveType),
/* harmony export */   "ConstructType": () => (/* binding */ ConstructType),
/* harmony export */   "EmptyClass": () => (/* binding */ EmptyClass),
/* harmony export */   "UnknownClass": () => (/* binding */ UnknownClass),
/* harmony export */   "BoolClass": () => (/* binding */ BoolClass),
/* harmony export */   "NullClass": () => (/* binding */ NullClass),
/* harmony export */   "ReservedClass": () => (/* binding */ ReservedClass),
/* harmony export */   "TextClass": () => (/* binding */ TextClass),
/* harmony export */   "IntClass": () => (/* binding */ IntClass),
/* harmony export */   "NatClass": () => (/* binding */ NatClass),
/* harmony export */   "FloatClass": () => (/* binding */ FloatClass),
/* harmony export */   "FixedIntClass": () => (/* binding */ FixedIntClass),
/* harmony export */   "FixedNatClass": () => (/* binding */ FixedNatClass),
/* harmony export */   "VecClass": () => (/* binding */ VecClass),
/* harmony export */   "OptClass": () => (/* binding */ OptClass),
/* harmony export */   "RecordClass": () => (/* binding */ RecordClass),
/* harmony export */   "TupleClass": () => (/* binding */ TupleClass),
/* harmony export */   "VariantClass": () => (/* binding */ VariantClass),
/* harmony export */   "RecClass": () => (/* binding */ RecClass),
/* harmony export */   "PrincipalClass": () => (/* binding */ PrincipalClass),
/* harmony export */   "FuncClass": () => (/* binding */ FuncClass),
/* harmony export */   "ServiceClass": () => (/* binding */ ServiceClass),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "Empty": () => (/* binding */ Empty),
/* harmony export */   "Reserved": () => (/* binding */ Reserved),
/* harmony export */   "Unknown": () => (/* binding */ Unknown),
/* harmony export */   "Bool": () => (/* binding */ Bool),
/* harmony export */   "Null": () => (/* binding */ Null),
/* harmony export */   "Text": () => (/* binding */ Text),
/* harmony export */   "Int": () => (/* binding */ Int),
/* harmony export */   "Nat": () => (/* binding */ Nat),
/* harmony export */   "Float32": () => (/* binding */ Float32),
/* harmony export */   "Float64": () => (/* binding */ Float64),
/* harmony export */   "Int8": () => (/* binding */ Int8),
/* harmony export */   "Int16": () => (/* binding */ Int16),
/* harmony export */   "Int32": () => (/* binding */ Int32),
/* harmony export */   "Int64": () => (/* binding */ Int64),
/* harmony export */   "Nat8": () => (/* binding */ Nat8),
/* harmony export */   "Nat16": () => (/* binding */ Nat16),
/* harmony export */   "Nat32": () => (/* binding */ Nat32),
/* harmony export */   "Nat64": () => (/* binding */ Nat64),
/* harmony export */   "Principal": () => (/* binding */ Principal),
/* harmony export */   "Tuple": () => (/* binding */ Tuple),
/* harmony export */   "Vec": () => (/* binding */ Vec),
/* harmony export */   "Opt": () => (/* binding */ Opt),
/* harmony export */   "Record": () => (/* binding */ Record),
/* harmony export */   "Variant": () => (/* binding */ Variant),
/* harmony export */   "Rec": () => (/* binding */ Rec),
/* harmony export */   "Func": () => (/* binding */ Func),
/* harmony export */   "Service": () => (/* binding */ Service)
/* harmony export */ });
/* harmony import */ var _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/principal */ "./node_modules/@dfinity/principal/lib/esm/index.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/candid/lib/esm/utils/buffer.js");
/* harmony import */ var _utils_hash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/hash */ "./node_modules/@dfinity/candid/lib/esm/utils/hash.js");
/* harmony import */ var _utils_leb128__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/leb128 */ "./node_modules/@dfinity/candid/lib/esm/utils/leb128.js");
/* harmony import */ var _utils_bigint_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/bigint-math */ "./node_modules/@dfinity/candid/lib/esm/utils/bigint-math.js");
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */





const magicNumber = 'DIDL';
const toReadableString_max = 400; // will not display arguments after 400chars. Makes sure 2mb blobs don't get inside the error
function zipWith(xs, ys, f) {
    return xs.map((x, i) => f(x, ys[i]));
}
/**
 * An IDL Type Table, which precedes the data in the stream.
 */
class TypeTable {
    constructor() {
        // List of types. Needs to be an array as the index needs to be stable.
        this._typs = [];
        this._idx = new Map();
    }
    has(obj) {
        return this._idx.has(obj.name);
    }
    add(type, buf) {
        const idx = this._typs.length;
        this._idx.set(type.name, idx);
        this._typs.push(buf);
    }
    merge(obj, knot) {
        const idx = this._idx.get(obj.name);
        const knotIdx = this._idx.get(knot);
        if (idx === undefined) {
            throw new Error('Missing type index for ' + obj);
        }
        if (knotIdx === undefined) {
            throw new Error('Missing type index for ' + knot);
        }
        this._typs[idx] = this._typs[knotIdx];
        // Delete the type.
        this._typs.splice(knotIdx, 1);
        this._idx.delete(knot);
    }
    encode() {
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this._typs.length);
        const buf = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...this._typs);
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(len, buf);
    }
    indexOf(typeName) {
        if (!this._idx.has(typeName)) {
            throw new Error('Missing type index for ' + typeName);
        }
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(this._idx.get(typeName) || 0);
    }
}
class Visitor {
    visitType(t, data) {
        throw new Error('Not implemented');
    }
    visitPrimitive(t, data) {
        return this.visitType(t, data);
    }
    visitEmpty(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitBool(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitNull(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitReserved(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitText(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitNumber(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitInt(t, data) {
        return this.visitNumber(t, data);
    }
    visitNat(t, data) {
        return this.visitNumber(t, data);
    }
    visitFloat(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitFixedInt(t, data) {
        return this.visitNumber(t, data);
    }
    visitFixedNat(t, data) {
        return this.visitNumber(t, data);
    }
    visitPrincipal(t, data) {
        return this.visitPrimitive(t, data);
    }
    visitConstruct(t, data) {
        return this.visitType(t, data);
    }
    visitVec(t, ty, data) {
        return this.visitConstruct(t, data);
    }
    visitOpt(t, ty, data) {
        return this.visitConstruct(t, data);
    }
    visitRecord(t, fields, data) {
        return this.visitConstruct(t, data);
    }
    visitTuple(t, components, data) {
        const fields = components.map((ty, i) => [`_${i}_`, ty]);
        return this.visitRecord(t, fields, data);
    }
    visitVariant(t, fields, data) {
        return this.visitConstruct(t, data);
    }
    visitRec(t, ty, data) {
        return this.visitConstruct(ty, data);
    }
    visitFunc(t, data) {
        return this.visitConstruct(t, data);
    }
    visitService(t, data) {
        return this.visitConstruct(t, data);
    }
}
/**
 * Represents an IDL type.
 */
class Type {
    /* Display type name */
    display() {
        return this.name;
    }
    valueToString(x) {
        return toReadableString(x);
    }
    /* Implement `T` in the IDL spec, only needed for non-primitive types */
    buildTypeTable(typeTable) {
        if (!typeTable.has(this)) {
            this._buildTypeTableImpl(typeTable);
        }
    }
}
class PrimitiveType extends Type {
    checkType(t) {
        if (this.name !== t.name) {
            throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
        }
        return t;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _buildTypeTableImpl(typeTable) {
        // No type table encoding for Primitive types.
        return;
    }
}
class ConstructType extends Type {
    checkType(t) {
        if (t instanceof RecClass) {
            const ty = t.getType();
            if (typeof ty === 'undefined') {
                throw new Error('type mismatch with uninitialized type');
            }
            return ty;
        }
        throw new Error(`type mismatch: type on the wire ${t.name}, expect type ${this.name}`);
    }
    encodeType(typeTable) {
        return typeTable.indexOf(this.name);
    }
}
/**
 * Represents an IDL Empty, a type which has no inhabitants.
 * Since no values exist for this type, it cannot be serialised or deserialised.
 * Result types like `Result<Text, Empty>` should always succeed.
 */
class EmptyClass extends PrimitiveType {
    accept(v, d) {
        return v.visitEmpty(this, d);
    }
    covariant(x) {
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue() {
        throw new Error('Empty cannot appear as a function argument');
    }
    valueToString() {
        throw new Error('Empty cannot appear as a value');
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-17 /* IDLTypeIds.Empty */);
    }
    decodeValue() {
        throw new Error('Empty cannot appear as an output');
    }
    get name() {
        return 'empty';
    }
}
/**
 * Represents an IDL Unknown, a placeholder type for deserialization only.
 * When decoding a value as Unknown, all fields will be retained but the names are only available in
 * hashed form.
 * A deserialized unknown will offer it's actual type by calling the `type()` function.
 * Unknown cannot be serialized and attempting to do so will throw an error.
 */
class UnknownClass extends Type {
    checkType(t) {
        throw new Error('Method not implemented for unknown.');
    }
    accept(v, d) {
        throw v.visitType(this, d);
    }
    covariant(x) {
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue() {
        throw new Error('Unknown cannot appear as a function argument');
    }
    valueToString() {
        throw new Error('Unknown cannot appear as a value');
    }
    encodeType() {
        throw new Error('Unknown cannot be serialized');
    }
    decodeValue(b, t) {
        let decodedValue = t.decodeValue(b, t);
        if (Object(decodedValue) !== decodedValue) {
            // decodedValue is primitive. Box it, otherwise we cannot add the type() function.
            // The type() function is important for primitives because otherwise we cannot tell apart the
            // different number types.
            decodedValue = Object(decodedValue);
        }
        let typeFunc;
        if (t instanceof RecClass) {
            typeFunc = () => t.getType();
        }
        else {
            typeFunc = () => t;
        }
        // Do not use 'decodedValue.type = typeFunc' because this would lead to an enumerable property
        // 'type' which means it would be serialized if the value would be candid encoded again.
        // This in turn leads to problems if the decoded value is a variant because these values are
        // only allowed to have a single property.
        Object.defineProperty(decodedValue, 'type', {
            value: typeFunc,
            writable: true,
            enumerable: false,
            configurable: true,
        });
        return decodedValue;
    }
    _buildTypeTableImpl() {
        throw new Error('Unknown cannot be serialized');
    }
    get name() {
        return 'Unknown';
    }
}
/**
 * Represents an IDL Bool
 */
class BoolClass extends PrimitiveType {
    accept(v, d) {
        return v.visitBool(this, d);
    }
    covariant(x) {
        if (typeof x === 'boolean')
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        return new Uint8Array([x ? 1 : 0]);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-2 /* IDLTypeIds.Bool */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        switch ((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeReadUint8)(b)) {
            case 0:
                return false;
            case 1:
                return true;
            default:
                throw new Error('Boolean value out of range');
        }
    }
    get name() {
        return 'bool';
    }
}
/**
 * Represents an IDL Null
 */
class NullClass extends PrimitiveType {
    accept(v, d) {
        return v.visitNull(this, d);
    }
    covariant(x) {
        if (x === null)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue() {
        return new ArrayBuffer(0);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-1 /* IDLTypeIds.Null */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return null;
    }
    get name() {
        return 'null';
    }
}
/**
 * Represents an IDL Reserved
 */
class ReservedClass extends PrimitiveType {
    accept(v, d) {
        return v.visitReserved(this, d);
    }
    covariant(x) {
        return true;
    }
    encodeValue() {
        return new ArrayBuffer(0);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-16 /* IDLTypeIds.Reserved */);
    }
    decodeValue(b, t) {
        if (t.name !== this.name) {
            t.decodeValue(b, t);
        }
        return null;
    }
    get name() {
        return 'reserved';
    }
}
/**
 * Represents an IDL Text
 */
class TextClass extends PrimitiveType {
    accept(v, d) {
        return v.visitText(this, d);
    }
    covariant(x) {
        if (typeof x === 'string')
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const buf = new TextEncoder().encode(x);
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(buf.byteLength);
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(len, buf);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-15 /* IDLTypeIds.Text */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b);
        const buf = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(b, Number(len));
        const decoder = new TextDecoder('utf8', { fatal: true });
        return decoder.decode(buf);
    }
    get name() {
        return 'text';
    }
    valueToString(x) {
        return '"' + x + '"';
    }
}
/**
 * Represents an IDL Int
 */
class IntClass extends PrimitiveType {
    accept(v, d) {
        return v.visitInt(this, d);
    }
    covariant(x) {
        // We allow encoding of JavaScript plain numbers.
        // But we will always decode to bigint.
        if (typeof x === 'bigint' || Number.isInteger(x))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(x);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-4 /* IDLTypeIds.Int */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(b);
    }
    get name() {
        return 'int';
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Nat
 */
class NatClass extends PrimitiveType {
    accept(v, d) {
        return v.visitNat(this, d);
    }
    covariant(x) {
        // We allow encoding of JavaScript plain numbers.
        // But we will always decode to bigint.
        if ((typeof x === 'bigint' && x >= BigInt(0)) || (Number.isInteger(x) && x >= 0))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(x);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-3 /* IDLTypeIds.Nat */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b);
    }
    get name() {
        return 'nat';
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Float
 */
class FloatClass extends PrimitiveType {
    constructor(_bits) {
        super();
        this._bits = _bits;
        if (_bits !== 32 && _bits !== 64) {
            throw new Error('not a valid float type');
        }
    }
    accept(v, d) {
        return v.visitFloat(this, d);
    }
    covariant(x) {
        if (typeof x === 'number' || x instanceof Number)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const buf = new ArrayBuffer(this._bits / 8);
        const view = new DataView(buf);
        if (this._bits === 32) {
            view.setFloat32(0, x, true);
        }
        else {
            view.setFloat64(0, x, true);
        }
        return buf;
    }
    encodeType() {
        const opcode = this._bits === 32 ? -13 /* IDLTypeIds.Float32 */ : -14 /* IDLTypeIds.Float64 */;
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(opcode);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const bytes = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(b, this._bits / 8);
        const view = new DataView(bytes);
        if (this._bits === 32) {
            return view.getFloat32(0, true);
        }
        else {
            return view.getFloat64(0, true);
        }
    }
    get name() {
        return 'float' + this._bits;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL fixed-width Int(n)
 */
class FixedIntClass extends PrimitiveType {
    constructor(_bits) {
        super();
        this._bits = _bits;
    }
    accept(v, d) {
        return v.visitFixedInt(this, d);
    }
    covariant(x) {
        const min = (0,_utils_bigint_math__WEBPACK_IMPORTED_MODULE_4__.iexp2)(this._bits - 1) * BigInt(-1);
        const max = (0,_utils_bigint_math__WEBPACK_IMPORTED_MODULE_4__.iexp2)(this._bits - 1) - BigInt(1);
        let ok = false;
        if (typeof x === 'bigint') {
            ok = x >= min && x <= max;
        }
        else if (Number.isInteger(x)) {
            const v = BigInt(x);
            ok = v >= min && v <= max;
        }
        else {
            ok = false;
        }
        if (ok)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.writeIntLE)(x, this._bits / 8);
    }
    encodeType() {
        const offset = Math.log2(this._bits) - 3;
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-9 - offset);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const num = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.readIntLE)(b, this._bits / 8);
        if (this._bits <= 32) {
            return Number(num);
        }
        else {
            return num;
        }
    }
    get name() {
        return `int${this._bits}`;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL fixed-width Nat(n)
 */
class FixedNatClass extends PrimitiveType {
    constructor(_bits) {
        super();
        this._bits = _bits;
    }
    accept(v, d) {
        return v.visitFixedNat(this, d);
    }
    covariant(x) {
        const max = (0,_utils_bigint_math__WEBPACK_IMPORTED_MODULE_4__.iexp2)(this._bits);
        let ok = false;
        if (typeof x === 'bigint' && x >= BigInt(0)) {
            ok = x < max;
        }
        else if (Number.isInteger(x) && x >= 0) {
            const v = BigInt(x);
            ok = v < max;
        }
        else {
            ok = false;
        }
        if (ok)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.writeUIntLE)(x, this._bits / 8);
    }
    encodeType() {
        const offset = Math.log2(this._bits) - 3;
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-5 - offset);
    }
    decodeValue(b, t) {
        this.checkType(t);
        const num = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.readUIntLE)(b, this._bits / 8);
        if (this._bits <= 32) {
            return Number(num);
        }
        else {
            return num;
        }
    }
    get name() {
        return `nat${this._bits}`;
    }
    valueToString(x) {
        return x.toString();
    }
}
/**
 * Represents an IDL Array
 *
 * Arrays of fixed-sized nat/int type (e.g. nat8), are encoded from and decoded to TypedArrays (e.g. Uint8Array).
 * Arrays of float or other non-primitive types are encoded/decoded as untyped array in Javascript.
 * @param {Type} t
 */
class VecClass extends ConstructType {
    constructor(_type) {
        super();
        this._type = _type;
        // If true, this vector is really a blob and we can just use memcpy.
        //
        // NOTE:
        // With support of encoding/dencoding of TypedArrays, this optimization is
        // only used when plain array of bytes are passed as encoding input in order
        // to be backward compatible.
        this._blobOptimization = false;
        if (_type instanceof FixedNatClass && _type._bits === 8) {
            this._blobOptimization = true;
        }
    }
    accept(v, d) {
        return v.visitVec(this, this._type, d);
    }
    covariant(x) {
        // Special case for ArrayBuffer
        const bits = this._type instanceof FixedNatClass
            ? this._type._bits
            : this._type instanceof FixedIntClass
                ? this._type._bits
                : 0;
        if ((ArrayBuffer.isView(x) && bits == x.BYTES_PER_ELEMENT * 8) ||
            (Array.isArray(x) &&
                x.every((v, idx) => {
                    try {
                        return this._type.covariant(v);
                    }
                    catch (e) {
                        throw new Error(`Invalid ${this.display()} argument: \n\nindex ${idx} -> ${e.message}`);
                    }
                })))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(x.length);
        if (this._blobOptimization) {
            return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(len, new Uint8Array(x));
        }
        if (ArrayBuffer.isView(x)) {
            return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(len, new Uint8Array(x.buffer));
        }
        const buf = new _utils_buffer__WEBPACK_IMPORTED_MODULE_1__.PipeArrayBuffer(new ArrayBuffer(len.byteLength + x.length), 0);
        buf.write(len);
        for (const d of x) {
            const encoded = this._type.encodeValue(d);
            buf.write(new Uint8Array(encoded));
        }
        return buf.buffer;
    }
    _buildTypeTableImpl(typeTable) {
        this._type.buildTypeTable(typeTable);
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-19 /* IDLTypeIds.Vector */);
        const buffer = this._type.encodeType(typeTable);
        typeTable.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, buffer));
    }
    decodeValue(b, t) {
        const vec = this.checkType(t);
        if (!(vec instanceof VecClass)) {
            throw new Error('Not a vector type');
        }
        const len = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b));
        if (this._type instanceof FixedNatClass) {
            if (this._type._bits == 8) {
                return new Uint8Array(b.read(len));
            }
            if (this._type._bits == 16) {
                return new Uint16Array(b.read(len * 2));
            }
            if (this._type._bits == 32) {
                return new Uint32Array(b.read(len * 4));
            }
            if (this._type._bits == 64) {
                return new BigUint64Array(b.read(len * 8));
            }
        }
        if (this._type instanceof FixedIntClass) {
            if (this._type._bits == 8) {
                return new Int8Array(b.read(len));
            }
            if (this._type._bits == 16) {
                return new Int16Array(b.read(len * 2));
            }
            if (this._type._bits == 32) {
                return new Int32Array(b.read(len * 4));
            }
            if (this._type._bits == 64) {
                return new BigInt64Array(b.read(len * 8));
            }
        }
        const rets = [];
        for (let i = 0; i < len; i++) {
            rets.push(this._type.decodeValue(b, vec._type));
        }
        return rets;
    }
    get name() {
        return `vec ${this._type.name}`;
    }
    display() {
        return `vec ${this._type.display()}`;
    }
    valueToString(x) {
        const elements = x.map(e => this._type.valueToString(e));
        return 'vec {' + elements.join('; ') + '}';
    }
}
/**
 * Represents an IDL Option
 * @param {Type} t
 */
class OptClass extends ConstructType {
    constructor(_type) {
        super();
        this._type = _type;
    }
    accept(v, d) {
        return v.visitOpt(this, this._type, d);
    }
    covariant(x) {
        try {
            if (Array.isArray(x) && (x.length === 0 || (x.length === 1 && this._type.covariant(x[0]))))
                return true;
        }
        catch (e) {
            throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)} \n\n-> ${e.message}`);
        }
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        if (x.length === 0) {
            return new Uint8Array([0]);
        }
        else {
            return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(new Uint8Array([1]), this._type.encodeValue(x[0]));
        }
    }
    _buildTypeTableImpl(typeTable) {
        this._type.buildTypeTable(typeTable);
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-18 /* IDLTypeIds.Opt */);
        const buffer = this._type.encodeType(typeTable);
        typeTable.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, buffer));
    }
    decodeValue(b, t) {
        if (t instanceof NullClass) {
            return [];
        }
        if (t instanceof ReservedClass) {
            return [];
        }
        let wireType = t;
        // unfold wireType, if needed
        if (t instanceof RecClass) {
            const ty = t.getType();
            if (typeof ty === 'undefined') {
                throw new Error('type mismatch with uninitialized type');
            }
            else
                wireType = ty;
        }
        if (wireType instanceof OptClass) {
            switch ((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeReadUint8)(b)) {
                case 0:
                    return [];
                case 1: {
                    // Save the current state of the Pipe `b` to allow rollback in case of an error
                    const checkpoint = b.save();
                    try {
                        // Attempt to decode a value using the `_type` of the current instance
                        const v = this._type.decodeValue(b, wireType._type);
                        return [v];
                    }
                    catch (e) {
                        // If an error occurs during decoding, restore the Pipe `b` to its previous state
                        b.restore(checkpoint);
                        // Skip the value at the current wire type to advance the Pipe `b` position
                        const skipped = wireType._type.decodeValue(b, wireType._type);
                        // Return an empty array to indicate a `none` value
                        return [];
                    }
                }
                default:
                    throw new Error('Not an option value');
            }
        }
        else if 
        // this check corresponds to `not (null <: <t>)` in the spec
        (this._type instanceof NullClass || this._type instanceof OptClass || this._type instanceof ReservedClass) {
            // null <: <t> :
            // skip value at wire type (to advance b) and return "null", i.e. []
            const skipped = wireType.decodeValue(b, wireType);
            return [];
        }
        else {
            // not (null <: t) :
            // try constituent type
            const checkpoint = b.save();
            try {
                const v = this._type.decodeValue(b, t);
                return [v];
            }
            catch (e) {
                // decoding failed, but this is opt, so return "null", i.e. []
                b.restore(checkpoint);
                // skip value at wire type (to advance b)
                const skipped = wireType.decodeValue(b, t);
                // return "null"
                return [];
            }
        }
    }
    get name() {
        return `opt ${this._type.name}`;
    }
    display() {
        return `opt ${this._type.display()}`;
    }
    valueToString(x) {
        if (x.length === 0) {
            return 'null';
        }
        else {
            return `opt ${this._type.valueToString(x[0])}`;
        }
    }
}
/**
 * Represents an IDL Record
 * @param {object} [fields] - mapping of function name to Type
 */
class RecordClass extends ConstructType {
    constructor(fields = {}) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(a[0]) - (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(b[0]));
    }
    accept(v, d) {
        return v.visitRecord(this, this._fields, d);
    }
    tryAsTuple() {
        const res = [];
        for (let i = 0; i < this._fields.length; i++) {
            const [key, type] = this._fields[i];
            if (key !== `_${i}_`) {
                return null;
            }
            res.push(type);
        }
        return res;
    }
    covariant(x) {
        if (typeof x === 'object' &&
            this._fields.every(([k, t]) => {
                // eslint-disable-next-line
                if (!x.hasOwnProperty(k)) {
                    throw new Error(`Record is missing key "${k}".`);
                }
                try {
                    return t.covariant(x[k]);
                }
                catch (e) {
                    throw new Error(`Invalid ${this.display()} argument: \n\nfield ${k} -> ${e.message}`);
                }
            }))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const values = this._fields.map(([key]) => x[key]);
        const bufs = zipWith(this._fields, values, ([, c], d) => c.encodeValue(d));
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...bufs);
    }
    _buildTypeTableImpl(T) {
        this._fields.forEach(([_, value]) => value.buildTypeTable(T));
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-20 /* IDLTypeIds.Record */);
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this._fields.length);
        const fields = this._fields.map(([key, value]) => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)((0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(key)), value.encodeType(T)));
        T.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, len, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...fields)));
    }
    decodeValue(b, t) {
        const record = this.checkType(t);
        if (!(record instanceof RecordClass)) {
            throw new Error('Not a record type');
        }
        const x = {};
        let expectedRecordIdx = 0;
        let actualRecordIdx = 0;
        while (actualRecordIdx < record._fields.length) {
            const [hash, type] = record._fields[actualRecordIdx];
            if (expectedRecordIdx >= this._fields.length) {
                // skip unexpected left over fields present on the wire
                type.decodeValue(b, type);
                actualRecordIdx++;
                continue;
            }
            const [expectKey, expectType] = this._fields[expectedRecordIdx];
            const expectedId = (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(this._fields[expectedRecordIdx][0]);
            const actualId = (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(hash);
            if (expectedId === actualId) {
                // the current field on the wire matches the expected field
                x[expectKey] = expectType.decodeValue(b, type);
                expectedRecordIdx++;
                actualRecordIdx++;
            }
            else if (actualId > expectedId) {
                // The expected field does not exist on the wire
                if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
                    x[expectKey] = [];
                    expectedRecordIdx++;
                }
                else {
                    throw new Error('Cannot find required field ' + expectKey);
                }
            }
            else {
                // The field on the wire does not exist in the output type, so we can skip it
                type.decodeValue(b, type);
                actualRecordIdx++;
            }
        }
        // initialize left over expected optional fields
        for (const [expectKey, expectType] of this._fields.slice(expectedRecordIdx)) {
            if (expectType instanceof OptClass || expectType instanceof ReservedClass) {
                // TODO this assumes null value in opt is represented as []
                x[expectKey] = [];
            }
            else {
                throw new Error('Cannot find required field ' + expectKey);
            }
        }
        return x;
    }
    get name() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.name);
        return `record {${fields.join('; ')}}`;
    }
    display() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.display());
        return `record {${fields.join('; ')}}`;
    }
    valueToString(x) {
        const values = this._fields.map(([key]) => x[key]);
        const fields = zipWith(this._fields, values, ([k, c], d) => k + '=' + c.valueToString(d));
        return `record {${fields.join('; ')}}`;
    }
}
/**
 * Represents Tuple, a syntactic sugar for Record.
 * @param {Type} components
 */
class TupleClass extends RecordClass {
    constructor(_components) {
        const x = {};
        _components.forEach((e, i) => (x['_' + i + '_'] = e));
        super(x);
        this._components = _components;
    }
    accept(v, d) {
        return v.visitTuple(this, this._components, d);
    }
    covariant(x) {
        // `>=` because tuples can be covariant when encoded.
        if (Array.isArray(x) &&
            x.length >= this._fields.length &&
            this._components.every((t, i) => {
                try {
                    return t.covariant(x[i]);
                }
                catch (e) {
                    throw new Error(`Invalid ${this.display()} argument: \n\nindex ${i} -> ${e.message}`);
                }
            }))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const bufs = zipWith(this._components, x, (c, d) => c.encodeValue(d));
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...bufs);
    }
    decodeValue(b, t) {
        const tuple = this.checkType(t);
        if (!(tuple instanceof TupleClass)) {
            throw new Error('not a tuple type');
        }
        if (tuple._components.length < this._components.length) {
            throw new Error('tuple mismatch');
        }
        const res = [];
        for (const [i, wireType] of tuple._components.entries()) {
            if (i >= this._components.length) {
                // skip value
                wireType.decodeValue(b, wireType);
            }
            else {
                res.push(this._components[i].decodeValue(b, wireType));
            }
        }
        return res;
    }
    display() {
        const fields = this._components.map(value => value.display());
        return `record {${fields.join('; ')}}`;
    }
    valueToString(values) {
        const fields = zipWith(this._components, values, (c, d) => c.valueToString(d));
        return `record {${fields.join('; ')}}`;
    }
}
/**
 * Represents an IDL Variant
 * @param {object} [fields] - mapping of function name to Type
 */
class VariantClass extends ConstructType {
    constructor(fields = {}) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(a[0]) - (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(b[0]));
    }
    accept(v, d) {
        return v.visitVariant(this, this._fields, d);
    }
    covariant(x) {
        if (typeof x === 'object' &&
            Object.entries(x).length === 1 &&
            this._fields.every(([k, v]) => {
                try {
                    // eslint-disable-next-line
                    return !x.hasOwnProperty(k) || v.covariant(x[k]);
                }
                catch (e) {
                    throw new Error(`Invalid ${this.display()} argument: \n\nvariant ${k} -> ${e.message}`);
                }
            }))
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        for (let i = 0; i < this._fields.length; i++) {
            const [name, type] = this._fields[i];
            // eslint-disable-next-line
            if (x.hasOwnProperty(name)) {
                const idx = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(i);
                const buf = type.encodeValue(x[name]);
                return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(idx, buf);
            }
        }
        throw Error('Variant has no data: ' + x);
    }
    _buildTypeTableImpl(typeTable) {
        this._fields.forEach(([, type]) => {
            type.buildTypeTable(typeTable);
        });
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-21 /* IDLTypeIds.Variant */);
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this._fields.length);
        const fields = this._fields.map(([key, value]) => (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)((0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(key)), value.encodeType(typeTable)));
        typeTable.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, len, ...fields));
    }
    decodeValue(b, t) {
        const variant = this.checkType(t);
        if (!(variant instanceof VariantClass)) {
            throw new Error('Not a variant type');
        }
        const idx = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b));
        if (idx >= variant._fields.length) {
            throw Error('Invalid variant index: ' + idx);
        }
        const [wireHash, wireType] = variant._fields[idx];
        for (const [key, expectType] of this._fields) {
            if ((0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(wireHash) === (0,_utils_hash__WEBPACK_IMPORTED_MODULE_2__.idlLabelToId)(key)) {
                const value = expectType.decodeValue(b, wireType);
                return { [key]: value };
            }
        }
        throw new Error('Cannot find field hash ' + wireHash);
    }
    get name() {
        const fields = this._fields.map(([key, type]) => key + ':' + type.name);
        return `variant {${fields.join('; ')}}`;
    }
    display() {
        const fields = this._fields.map(([key, type]) => key + (type.name === 'null' ? '' : `:${type.display()}`));
        return `variant {${fields.join('; ')}}`;
    }
    valueToString(x) {
        for (const [name, type] of this._fields) {
            // eslint-disable-next-line
            if (x.hasOwnProperty(name)) {
                const value = type.valueToString(x[name]);
                if (value === 'null') {
                    return `variant {${name}}`;
                }
                else {
                    return `variant {${name}=${value}}`;
                }
            }
        }
        throw new Error('Variant has no data: ' + x);
    }
}
/**
 * Represents a reference to an IDL type, used for defining recursive data
 * types.
 */
class RecClass extends ConstructType {
    constructor() {
        super(...arguments);
        this._id = RecClass._counter++;
        this._type = undefined;
    }
    accept(v, d) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return v.visitRec(this, this._type, d);
    }
    fill(t) {
        this._type = t;
    }
    getType() {
        return this._type;
    }
    covariant(x) {
        if (this._type ? this._type.covariant(x) : false)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.encodeValue(x);
    }
    _buildTypeTableImpl(typeTable) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        typeTable.add(this, new Uint8Array([]));
        this._type.buildTypeTable(typeTable);
        typeTable.merge(this, this._type.name);
    }
    decodeValue(b, t) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.decodeValue(b, t);
    }
    get name() {
        return `rec_${this._id}`;
    }
    display() {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return `μ${this.name}.${this._type.name}`;
    }
    valueToString(x) {
        if (!this._type) {
            throw Error('Recursive type uninitialized.');
        }
        return this._type.valueToString(x);
    }
}
RecClass._counter = 0;
function decodePrincipalId(b) {
    const x = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeReadUint8)(b);
    if (x !== 1) {
        throw new Error('Cannot decode principal');
    }
    const len = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b));
    return _dfinity_principal__WEBPACK_IMPORTED_MODULE_0__.Principal.fromUint8Array(new Uint8Array((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(b, len)));
}
/**
 * Represents an IDL principal reference
 */
class PrincipalClass extends PrimitiveType {
    accept(v, d) {
        return v.visitPrincipal(this, d);
    }
    covariant(x) {
        if (x && x._isPrincipal)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const buf = x.toUint8Array();
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(buf.byteLength);
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(new Uint8Array([1]), len, buf);
    }
    encodeType() {
        return (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-24 /* IDLTypeIds.Principal */);
    }
    decodeValue(b, t) {
        this.checkType(t);
        return decodePrincipalId(b);
    }
    get name() {
        return 'principal';
    }
    valueToString(x) {
        return `${this.name} "${x.toText()}"`;
    }
}
/**
 * Represents an IDL function reference.
 * @param argTypes Argument types.
 * @param retTypes Return types.
 * @param annotations Function annotations.
 */
class FuncClass extends ConstructType {
    constructor(argTypes, retTypes, annotations = []) {
        super();
        this.argTypes = argTypes;
        this.retTypes = retTypes;
        this.annotations = annotations;
    }
    static argsToString(types, v) {
        if (types.length !== v.length) {
            throw new Error('arity mismatch');
        }
        return '(' + types.map((t, i) => t.valueToString(v[i])).join(', ') + ')';
    }
    accept(v, d) {
        return v.visitFunc(this, d);
    }
    covariant(x) {
        if (Array.isArray(x) && x.length === 2 && x[0] && x[0]._isPrincipal && typeof x[1] === 'string')
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue([principal, methodName]) {
        const buf = principal.toUint8Array();
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(buf.byteLength);
        const canister = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(new Uint8Array([1]), len, buf);
        const method = new TextEncoder().encode(methodName);
        const methodLen = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(method.byteLength);
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(new Uint8Array([1]), canister, methodLen, method);
    }
    _buildTypeTableImpl(T) {
        this.argTypes.forEach(arg => arg.buildTypeTable(T));
        this.retTypes.forEach(arg => arg.buildTypeTable(T));
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-22 /* IDLTypeIds.Func */);
        const argLen = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this.argTypes.length);
        const args = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...this.argTypes.map(arg => arg.encodeType(T)));
        const retLen = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this.retTypes.length);
        const rets = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...this.retTypes.map(arg => arg.encodeType(T)));
        const annLen = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this.annotations.length);
        const anns = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...this.annotations.map(a => this.encodeAnnotation(a)));
        T.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, argLen, args, retLen, rets, annLen, anns));
    }
    decodeValue(b) {
        const x = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeReadUint8)(b);
        if (x !== 1) {
            throw new Error('Cannot decode function reference');
        }
        const canister = decodePrincipalId(b);
        const mLen = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(b));
        const buf = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(b, mLen);
        const decoder = new TextDecoder('utf8', { fatal: true });
        const method = decoder.decode(buf);
        return [canister, method];
    }
    get name() {
        const args = this.argTypes.map(arg => arg.name).join(', ');
        const rets = this.retTypes.map(arg => arg.name).join(', ');
        const annon = ' ' + this.annotations.join(' ');
        return `(${args}) -> (${rets})${annon}`;
    }
    valueToString([principal, str]) {
        return `func "${principal.toText()}".${str}`;
    }
    display() {
        const args = this.argTypes.map(arg => arg.display()).join(', ');
        const rets = this.retTypes.map(arg => arg.display()).join(', ');
        const annon = ' ' + this.annotations.join(' ');
        return `(${args}) → (${rets})${annon}`;
    }
    encodeAnnotation(ann) {
        if (ann === 'query') {
            return new Uint8Array([1]);
        }
        else if (ann === 'oneway') {
            return new Uint8Array([2]);
        }
        else if (ann === 'composite_query') {
            return new Uint8Array([3]);
        }
        else {
            throw new Error('Illegal function annotation');
        }
    }
}
class ServiceClass extends ConstructType {
    constructor(fields) {
        super();
        this._fields = Object.entries(fields).sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
    }
    accept(v, d) {
        return v.visitService(this, d);
    }
    covariant(x) {
        if (x && x._isPrincipal)
            return true;
        throw new Error(`Invalid ${this.display()} argument: ${toReadableString(x)}`);
    }
    encodeValue(x) {
        const buf = x.toUint8Array();
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(buf.length);
        return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(new Uint8Array([1]), len, buf);
    }
    _buildTypeTableImpl(T) {
        this._fields.forEach(([_, func]) => func.buildTypeTable(T));
        const opCode = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebEncode)(-23 /* IDLTypeIds.Service */);
        const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(this._fields.length);
        const meths = this._fields.map(([label, func]) => {
            const labelBuf = new TextEncoder().encode(label);
            const labelLen = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(labelBuf.length);
            return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(labelLen, labelBuf, func.encodeType(T));
        });
        T.add(this, (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(opCode, len, ...meths));
    }
    decodeValue(b) {
        return decodePrincipalId(b);
    }
    get name() {
        const fields = this._fields.map(([key, value]) => key + ':' + value.name);
        return `service {${fields.join('; ')}}`;
    }
    valueToString(x) {
        return `service "${x.toText()}"`;
    }
}
/**
 * Takes an unknown value and returns a string representation of it.
 * @param x - unknown value
 * @returns {string} string representation of the value
 */
function toReadableString(x) {
    const str = JSON.stringify(x, (_key, value) => typeof value === 'bigint' ? `BigInt(${value})` : value);
    return str && str.length > toReadableString_max
        ? str.substring(0, toReadableString_max - 3) + '...'
        : str;
}
/**
 * Encode a array of values
 * @param argTypes - array of Types
 * @param args - array of values
 * @returns {ArrayBuffer} serialised value
 */
function encode(argTypes, args) {
    if (args.length < argTypes.length) {
        throw Error('Wrong number of message arguments');
    }
    const typeTable = new TypeTable();
    argTypes.forEach(t => t.buildTypeTable(typeTable));
    const magic = new TextEncoder().encode(magicNumber);
    const table = typeTable.encode();
    const len = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebEncode)(args.length);
    const typs = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...argTypes.map(t => t.encodeType(typeTable)));
    const vals = (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(...zipWith(argTypes, args, (t, x) => {
        try {
            t.covariant(x);
        }
        catch (e) {
            const err = new Error(e.message + '\n\n');
            throw err;
        }
        return t.encodeValue(x);
    }));
    return (0,_utils_buffer__WEBPACK_IMPORTED_MODULE_1__.concat)(magic, table, len, typs, vals);
}
/**
 * Decode a binary value
 * @param retTypes - Types expected in the buffer.
 * @param bytes - hex-encoded string, or buffer.
 * @returns Value deserialised to JS type
 */
function decode(retTypes, bytes) {
    const b = new _utils_buffer__WEBPACK_IMPORTED_MODULE_1__.PipeArrayBuffer(bytes);
    if (bytes.byteLength < magicNumber.length) {
        throw new Error('Message length smaller than magic number');
    }
    const magicBuffer = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(b, magicNumber.length);
    const magic = new TextDecoder().decode(magicBuffer);
    if (magic !== magicNumber) {
        throw new Error('Wrong magic number: ' + JSON.stringify(magic));
    }
    function readTypeTable(pipe) {
        const typeTable = [];
        const len = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
        for (let i = 0; i < len; i++) {
            const ty = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe));
            switch (ty) {
                case -18 /* IDLTypeIds.Opt */:
                case -19 /* IDLTypeIds.Vector */: {
                    const t = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe));
                    typeTable.push([ty, t]);
                    break;
                }
                case -20 /* IDLTypeIds.Record */:
                case -21 /* IDLTypeIds.Variant */: {
                    const fields = [];
                    let objectLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                    let prevHash;
                    while (objectLength--) {
                        const hash = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                        if (hash >= Math.pow(2, 32)) {
                            throw new Error('field id out of 32-bit range');
                        }
                        if (typeof prevHash === 'number' && prevHash >= hash) {
                            throw new Error('field id collision or not sorted');
                        }
                        prevHash = hash;
                        const t = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe));
                        fields.push([hash, t]);
                    }
                    typeTable.push([ty, fields]);
                    break;
                }
                case -22 /* IDLTypeIds.Func */: {
                    const args = [];
                    let argLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                    while (argLength--) {
                        args.push(Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe)));
                    }
                    const returnValues = [];
                    let returnValuesLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                    while (returnValuesLength--) {
                        returnValues.push(Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe)));
                    }
                    const annotations = [];
                    let annotationLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                    while (annotationLength--) {
                        const annotation = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                        switch (annotation) {
                            case 1: {
                                annotations.push('query');
                                break;
                            }
                            case 2: {
                                annotations.push('oneway');
                                break;
                            }
                            case 3: {
                                annotations.push('composite_query');
                                break;
                            }
                            default:
                                throw new Error('unknown annotation');
                        }
                    }
                    typeTable.push([ty, [args, returnValues, annotations]]);
                    break;
                }
                case -23 /* IDLTypeIds.Service */: {
                    let servLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                    const methods = [];
                    while (servLength--) {
                        const nameLength = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
                        const funcName = new TextDecoder().decode((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.safeRead)(pipe, nameLength));
                        const funcType = (0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe);
                        methods.push([funcName, funcType]);
                    }
                    typeTable.push([ty, methods]);
                    break;
                }
                default:
                    throw new Error('Illegal op_code: ' + ty);
            }
        }
        const rawList = [];
        const length = Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.lebDecode)(pipe));
        for (let i = 0; i < length; i++) {
            rawList.push(Number((0,_utils_leb128__WEBPACK_IMPORTED_MODULE_3__.slebDecode)(pipe)));
        }
        return [typeTable, rawList];
    }
    const [rawTable, rawTypes] = readTypeTable(b);
    if (rawTypes.length < retTypes.length) {
        throw new Error('Wrong number of return values');
    }
    const table = rawTable.map(_ => Rec());
    function getType(t) {
        if (t < -24) {
            throw new Error('future value not supported');
        }
        if (t < 0) {
            switch (t) {
                case -1:
                    return Null;
                case -2:
                    return Bool;
                case -3:
                    return Nat;
                case -4:
                    return Int;
                case -5:
                    return Nat8;
                case -6:
                    return Nat16;
                case -7:
                    return Nat32;
                case -8:
                    return Nat64;
                case -9:
                    return Int8;
                case -10:
                    return Int16;
                case -11:
                    return Int32;
                case -12:
                    return Int64;
                case -13:
                    return Float32;
                case -14:
                    return Float64;
                case -15:
                    return Text;
                case -16:
                    return Reserved;
                case -17:
                    return Empty;
                case -24:
                    return Principal;
                default:
                    throw new Error('Illegal op_code: ' + t);
            }
        }
        if (t >= rawTable.length) {
            throw new Error('type index out of range');
        }
        return table[t];
    }
    function buildType(entry) {
        switch (entry[0]) {
            case -19 /* IDLTypeIds.Vector */: {
                const ty = getType(entry[1]);
                return Vec(ty);
            }
            case -18 /* IDLTypeIds.Opt */: {
                const ty = getType(entry[1]);
                return Opt(ty);
            }
            case -20 /* IDLTypeIds.Record */: {
                const fields = {};
                for (const [hash, ty] of entry[1]) {
                    const name = `_${hash}_`;
                    fields[name] = getType(ty);
                }
                const record = Record(fields);
                const tuple = record.tryAsTuple();
                if (Array.isArray(tuple)) {
                    return Tuple(...tuple);
                }
                else {
                    return record;
                }
            }
            case -21 /* IDLTypeIds.Variant */: {
                const fields = {};
                for (const [hash, ty] of entry[1]) {
                    const name = `_${hash}_`;
                    fields[name] = getType(ty);
                }
                return Variant(fields);
            }
            case -22 /* IDLTypeIds.Func */: {
                const [args, returnValues, annotations] = entry[1];
                return Func(args.map((t) => getType(t)), returnValues.map((t) => getType(t)), annotations);
            }
            case -23 /* IDLTypeIds.Service */: {
                const rec = {};
                const methods = entry[1];
                for (const [name, typeRef] of methods) {
                    let type = getType(typeRef);
                    if (type instanceof RecClass) {
                        // unpack reference type
                        type = type.getType();
                    }
                    if (!(type instanceof FuncClass)) {
                        throw new Error('Illegal service definition: services can only contain functions');
                    }
                    rec[name] = type;
                }
                return Service(rec);
            }
            default:
                throw new Error('Illegal op_code: ' + entry[0]);
        }
    }
    rawTable.forEach((entry, i) => {
        // Process function type first, so that we can construct the correct service type
        if (entry[0] === -22 /* IDLTypeIds.Func */) {
            const t = buildType(entry);
            table[i].fill(t);
        }
    });
    rawTable.forEach((entry, i) => {
        if (entry[0] !== -22 /* IDLTypeIds.Func */) {
            const t = buildType(entry);
            table[i].fill(t);
        }
    });
    const types = rawTypes.map(t => getType(t));
    const output = retTypes.map((t, i) => {
        return t.decodeValue(b, types[i]);
    });
    // skip unused values
    for (let ind = retTypes.length; ind < types.length; ind++) {
        types[ind].decodeValue(b, types[ind]);
    }
    if (b.byteLength > 0) {
        throw new Error('decode: Left-over bytes');
    }
    return output;
}
// Export Types instances.
const Empty = new EmptyClass();
const Reserved = new ReservedClass();
/**
 * Client-only type for deserializing unknown data. Not supported by Candid, and its use is discouraged.
 */
const Unknown = new UnknownClass();
const Bool = new BoolClass();
const Null = new NullClass();
const Text = new TextClass();
const Int = new IntClass();
const Nat = new NatClass();
const Float32 = new FloatClass(32);
const Float64 = new FloatClass(64);
const Int8 = new FixedIntClass(8);
const Int16 = new FixedIntClass(16);
const Int32 = new FixedIntClass(32);
const Int64 = new FixedIntClass(64);
const Nat8 = new FixedNatClass(8);
const Nat16 = new FixedNatClass(16);
const Nat32 = new FixedNatClass(32);
const Nat64 = new FixedNatClass(64);
const Principal = new PrincipalClass();
/**
 *
 * @param types array of any types
 * @returns TupleClass from those types
 */
function Tuple(...types) {
    return new TupleClass(types);
}
/**
 *
 * @param t IDL Type
 * @returns VecClass from that type
 */
function Vec(t) {
    return new VecClass(t);
}
/**
 *
 * @param t IDL Type
 * @returns OptClass of Type
 */
function Opt(t) {
    return new OptClass(t);
}
/**
 *
 * @param t Record of string and IDL Type
 * @returns RecordClass of string and Type
 */
function Record(t) {
    return new RecordClass(t);
}
/**
 *
 * @param fields Record of string and IDL Type
 * @returns VariantClass
 */
function Variant(fields) {
    return new VariantClass(fields);
}
/**
 *
 * @returns new RecClass
 */
function Rec() {
    return new RecClass();
}
/**
 *
 * @param args array of IDL Types
 * @param ret array of IDL Types
 * @param annotations array of strings, [] by default
 * @returns new FuncClass
 */
function Func(args, ret, annotations = []) {
    return new FuncClass(args, ret, annotations);
}
/**
 *
 * @param t Record of string and FuncClass
 * @returns ServiceClass
 */
function Service(t) {
    return new ServiceClass(t);
}
//# sourceMappingURL=idl.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/index.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Render": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.Render),
/* harmony export */   "inputBox": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.inputBox),
/* harmony export */   "optForm": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.optForm),
/* harmony export */   "recordForm": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.recordForm),
/* harmony export */   "renderInput": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.renderInput),
/* harmony export */   "renderValue": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.renderValue),
/* harmony export */   "tupleForm": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.tupleForm),
/* harmony export */   "variantForm": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.variantForm),
/* harmony export */   "vecForm": () => (/* reexport safe */ _candid_ui__WEBPACK_IMPORTED_MODULE_0__.vecForm),
/* harmony export */   "InputBox": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.InputBox),
/* harmony export */   "InputForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.InputForm),
/* harmony export */   "OptionForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.OptionForm),
/* harmony export */   "RecordForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.RecordForm),
/* harmony export */   "TupleForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.TupleForm),
/* harmony export */   "VariantForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.VariantForm),
/* harmony export */   "VecForm": () => (/* reexport safe */ _candid_core__WEBPACK_IMPORTED_MODULE_1__.VecForm),
/* harmony export */   "IDL": () => (/* reexport module object */ _idl__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "idlLabelToId": () => (/* reexport safe */ _utils_hash__WEBPACK_IMPORTED_MODULE_3__.idlLabelToId),
/* harmony export */   "lebDecode": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.lebDecode),
/* harmony export */   "lebEncode": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.lebEncode),
/* harmony export */   "readIntLE": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.readIntLE),
/* harmony export */   "readUIntLE": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.readUIntLE),
/* harmony export */   "safeRead": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.safeRead),
/* harmony export */   "safeReadUint8": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.safeReadUint8),
/* harmony export */   "slebDecode": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.slebDecode),
/* harmony export */   "slebEncode": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.slebEncode),
/* harmony export */   "writeIntLE": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.writeIntLE),
/* harmony export */   "writeUIntLE": () => (/* reexport safe */ _utils_leb128__WEBPACK_IMPORTED_MODULE_4__.writeUIntLE),
/* harmony export */   "PipeArrayBuffer": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.PipeArrayBuffer),
/* harmony export */   "bufFromBufLike": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.bufFromBufLike),
/* harmony export */   "concat": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.concat),
/* harmony export */   "fromHexString": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.fromHexString),
/* harmony export */   "toHexString": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.toHexString),
/* harmony export */   "uint8ToBuf": () => (/* reexport safe */ _utils_buffer__WEBPACK_IMPORTED_MODULE_5__.uint8ToBuf)
/* harmony export */ });
/* harmony import */ var _candid_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./candid-ui */ "./node_modules/@dfinity/candid/lib/esm/candid-ui.js");
/* harmony import */ var _candid_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./candid-core */ "./node_modules/@dfinity/candid/lib/esm/candid-core.js");
/* harmony import */ var _idl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./idl */ "./node_modules/@dfinity/candid/lib/esm/idl.js");
/* harmony import */ var _utils_hash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/hash */ "./node_modules/@dfinity/candid/lib/esm/utils/hash.js");
/* harmony import */ var _utils_leb128__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/leb128 */ "./node_modules/@dfinity/candid/lib/esm/utils/leb128.js");
/* harmony import */ var _utils_buffer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/buffer */ "./node_modules/@dfinity/candid/lib/esm/utils/buffer.js");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types */ "./node_modules/@dfinity/candid/lib/esm/types.js");







//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/types.js":
/*!*******************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/types.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);

//# sourceMappingURL=types.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/utils/bigint-math.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/utils/bigint-math.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ilog2": () => (/* binding */ ilog2),
/* harmony export */   "iexp2": () => (/* binding */ iexp2)
/* harmony export */ });
/**
 * Equivalent to `Math.log2(n)` with support for `BigInt` values
 * @param n bigint or integer
 * @returns integer
 */
function ilog2(n) {
    const nBig = BigInt(n);
    if (n <= 0) {
        throw new RangeError('Input must be positive');
    }
    return nBig.toString(2).length - 1;
}
/**
 * Equivalent to `2 ** n` with support for `BigInt` values
 * (necessary for browser preprocessors which replace the `**` operator with `Math.pow`)
 * @param n bigint or integer
 * @returns bigint
 */
function iexp2(n) {
    const nBig = BigInt(n);
    if (n < 0) {
        throw new RangeError('Input must be non-negative');
    }
    return BigInt(1) << nBig;
}
//# sourceMappingURL=bigint-math.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/utils/buffer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/utils/buffer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "concat": () => (/* binding */ concat),
/* harmony export */   "toHexString": () => (/* binding */ toHexString),
/* harmony export */   "fromHexString": () => (/* binding */ fromHexString),
/* harmony export */   "PipeArrayBuffer": () => (/* binding */ PipeArrayBuffer),
/* harmony export */   "uint8ToBuf": () => (/* binding */ uint8ToBuf),
/* harmony export */   "bufFromBufLike": () => (/* binding */ bufFromBufLike)
/* harmony export */ });
/**
 * Concatenate multiple array buffers.
 * @param buffers The buffers to concatenate.
 */
function concat(...buffers) {
    const result = new Uint8Array(buffers.reduce((acc, curr) => acc + curr.byteLength, 0));
    let index = 0;
    for (const b of buffers) {
        result.set(new Uint8Array(b), index);
        index += b.byteLength;
    }
    return result;
}
/**
 * Returns an hexadecimal representation of an array buffer.
 * @param bytes The array buffer.
 */
function toHexString(bytes) {
    return new Uint8Array(bytes).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}
/**
 * Return an array buffer from its hexadecimal representation.
 * @param hexString The hexadecimal string.
 */
function fromHexString(hexString) {
    var _a;
    return new Uint8Array(((_a = hexString.match(/.{1,2}/g)) !== null && _a !== void 0 ? _a : []).map(byte => parseInt(byte, 16)));
}
/**
 * A class that abstracts a pipe-like ArrayBuffer.
 */
class PipeArrayBuffer {
    /**
     * Creates a new instance of a pipe
     * @param buffer an optional buffer to start with
     * @param length an optional amount of bytes to use for the length.
     */
    constructor(buffer, length = (buffer === null || buffer === void 0 ? void 0 : buffer.byteLength) || 0) {
        this._buffer = bufFromBufLike(buffer || new ArrayBuffer(0));
        this._view = new Uint8Array(this._buffer, 0, length);
    }
    /**
     * Save a checkpoint of the reading view (for backtracking)
     */
    save() {
        return this._view;
    }
    /**
     * Restore a checkpoint of the reading view (for backtracking)
     * @param checkPoint a previously saved checkpoint
     */
    restore(checkPoint) {
        this._view = checkPoint;
    }
    get buffer() {
        // Return a copy of the buffer.
        return bufFromBufLike(this._view.slice());
    }
    get byteLength() {
        return this._view.byteLength;
    }
    /**
     * Read `num` number of bytes from the front of the pipe.
     * @param num The number of bytes to read.
     */
    read(num) {
        const result = this._view.subarray(0, num);
        this._view = this._view.subarray(num);
        return result.slice().buffer;
    }
    readUint8() {
        const result = this._view[0];
        this._view = this._view.subarray(1);
        return result;
    }
    /**
     * Write a buffer to the end of the pipe.
     * @param buf The bytes to write.
     */
    write(buf) {
        const b = new Uint8Array(buf);
        const offset = this._view.byteLength;
        if (this._view.byteOffset + this._view.byteLength + b.byteLength >= this._buffer.byteLength) {
            // Alloc grow the view to include the new bytes.
            this.alloc(b.byteLength);
        }
        else {
            // Update the view to include the new bytes.
            this._view = new Uint8Array(this._buffer, this._view.byteOffset, this._view.byteLength + b.byteLength);
        }
        this._view.set(b, offset);
    }
    /**
     * Whether or not there is more data to read from the buffer
     */
    get end() {
        return this._view.byteLength === 0;
    }
    /**
     * Allocate a fixed amount of memory in the buffer. This does not affect the view.
     * @param amount A number of bytes to add to the buffer.
     */
    alloc(amount) {
        // Add a little bit of exponential growth.
        const b = new ArrayBuffer(((this._buffer.byteLength + amount) * 1.2) | 0);
        const v = new Uint8Array(b, 0, this._view.byteLength + amount);
        v.set(this._view);
        this._buffer = b;
        this._view = v;
    }
}
/**
 * Returns a true ArrayBuffer from a Uint8Array, as Uint8Array.buffer is unsafe.
 * @param {Uint8Array} arr Uint8Array to convert
 * @returns ArrayBuffer
 */
function uint8ToBuf(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).buffer;
}
/**
 * Returns a true ArrayBuffer from an ArrayBufferLike object.
 * @param bufLike a buffer-like object
 * @returns ArrayBuffer
 */
function bufFromBufLike(bufLike) {
    if (bufLike instanceof Uint8Array) {
        return uint8ToBuf(bufLike);
    }
    if (bufLike instanceof ArrayBuffer) {
        return bufLike;
    }
    if (Array.isArray(bufLike)) {
        return uint8ToBuf(new Uint8Array(bufLike));
    }
    if ('buffer' in bufLike) {
        return bufFromBufLike(bufLike.buffer);
    }
    return uint8ToBuf(new Uint8Array(bufLike));
}
//# sourceMappingURL=buffer.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/utils/hash.js":
/*!************************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/utils/hash.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "idlLabelToId": () => (/* binding */ idlLabelToId)
/* harmony export */ });
/**
 * Hashes a string to a number. Algorithm can be found here:
 * https://caml.inria.fr/pub/papers/garrigue-polymorphic_variants-ml98.pdf
 * @param s - string to hash
 * @returns number representing hashed string
 */
function idlHash(s) {
    const utf8encoder = new TextEncoder();
    const array = utf8encoder.encode(s);
    let h = 0;
    for (const c of array) {
        h = (h * 223 + c) % 2 ** 32;
    }
    return h;
}
/**
 *
 * @param label string
 * @returns number representing hashed label
 */
function idlLabelToId(label) {
    if (/^_\d+_$/.test(label) || /^_0x[0-9a-fA-F]+_$/.test(label)) {
        const num = +label.slice(1, -1);
        if (Number.isSafeInteger(num) && num >= 0 && num < 2 ** 32) {
            return num;
        }
    }
    return idlHash(label);
}
//# sourceMappingURL=hash.js.map

/***/ }),

/***/ "./node_modules/@dfinity/candid/lib/esm/utils/leb128.js":
/*!**************************************************************!*\
  !*** ./node_modules/@dfinity/candid/lib/esm/utils/leb128.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "safeRead": () => (/* binding */ safeRead),
/* harmony export */   "safeReadUint8": () => (/* binding */ safeReadUint8),
/* harmony export */   "lebEncode": () => (/* binding */ lebEncode),
/* harmony export */   "lebDecode": () => (/* binding */ lebDecode),
/* harmony export */   "slebEncode": () => (/* binding */ slebEncode),
/* harmony export */   "slebDecode": () => (/* binding */ slebDecode),
/* harmony export */   "writeUIntLE": () => (/* binding */ writeUIntLE),
/* harmony export */   "writeIntLE": () => (/* binding */ writeIntLE),
/* harmony export */   "readUIntLE": () => (/* binding */ readUIntLE),
/* harmony export */   "readIntLE": () => (/* binding */ readIntLE)
/* harmony export */ });
/* harmony import */ var _buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer */ "./node_modules/@dfinity/candid/lib/esm/utils/buffer.js");
/* eslint-disable no-constant-condition */
// Note: this file uses buffer-pipe, which on Node only, uses the Node Buffer
//       implementation, which isn't compatible with the NPM buffer package
//       which we use everywhere else. This means that we have to transform
//       one into the other, hence why every function that returns a Buffer
//       actually return `new Buffer(pipe.buffer)`.
// TODO: The best solution would be to have our own buffer type around
//       Uint8Array which is standard.

function eob() {
    throw new Error('unexpected end of buffer');
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param num number
 * @returns Buffer
 */
function safeRead(pipe, num) {
    if (pipe.byteLength < num) {
        eob();
    }
    return pipe.read(num);
}
/**
 * @param pipe - PipeArrayBuffer simulating buffer-pipe api
 */
function safeReadUint8(pipe) {
    const byte = pipe.readUint8();
    if (byte === undefined) {
        eob();
    }
    return byte;
}
/**
 * Encode a positive number (or bigint) into a Buffer. The number will be floored to the
 * nearest integer.
 * @param value The number to encode.
 */
function lebEncode(value) {
    if (typeof value === 'number') {
        value = BigInt(value);
    }
    if (value < BigInt(0)) {
        throw new Error('Cannot leb encode negative values.');
    }
    const byteLength = (value === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value)))) + 1;
    const pipe = new _buffer__WEBPACK_IMPORTED_MODULE_0__.PipeArrayBuffer(new ArrayBuffer(byteLength), 0);
    while (true) {
        const i = Number(value & BigInt(0x7f));
        value /= BigInt(0x80);
        if (value === BigInt(0)) {
            pipe.write(new Uint8Array([i]));
            break;
        }
        else {
            pipe.write(new Uint8Array([i | 0x80]));
        }
    }
    return pipe.buffer;
}
/**
 * Decode a leb encoded buffer into a bigint. The number will always be positive (does not
 * support signed leb encoding).
 * @param pipe A Buffer containing the leb encoded bits.
 */
function lebDecode(pipe) {
    let weight = BigInt(1);
    let value = BigInt(0);
    let byte;
    do {
        byte = safeReadUint8(pipe);
        value += BigInt(byte & 0x7f).valueOf() * weight;
        weight *= BigInt(128);
    } while (byte >= 0x80);
    return value;
}
/**
 * Encode a number (or bigint) into a Buffer, with support for negative numbers. The number
 * will be floored to the nearest integer.
 * @param value The number to encode.
 */
function slebEncode(value) {
    if (typeof value === 'number') {
        value = BigInt(value);
    }
    const isNeg = value < BigInt(0);
    if (isNeg) {
        value = -value - BigInt(1);
    }
    const byteLength = (value === BigInt(0) ? 0 : Math.ceil(Math.log2(Number(value)))) + 1;
    const pipe = new _buffer__WEBPACK_IMPORTED_MODULE_0__.PipeArrayBuffer(new ArrayBuffer(byteLength), 0);
    while (true) {
        const i = getLowerBytes(value);
        value /= BigInt(0x80);
        // prettier-ignore
        if ((isNeg && value === BigInt(0) && (i & 0x40) !== 0)
            || (!isNeg && value === BigInt(0) && (i & 0x40) === 0)) {
            pipe.write(new Uint8Array([i]));
            break;
        }
        else {
            pipe.write(new Uint8Array([i | 0x80]));
        }
    }
    function getLowerBytes(num) {
        const bytes = num % BigInt(0x80);
        if (isNeg) {
            // We swap the bits here again, and remove 1 to do two's complement.
            return Number(BigInt(0x80) - bytes - BigInt(1));
        }
        else {
            return Number(bytes);
        }
    }
    return pipe.buffer;
}
/**
 * Decode a leb encoded buffer into a bigint. The number is decoded with support for negative
 * signed-leb encoding.
 * @param pipe A Buffer containing the signed leb encoded bits.
 */
function slebDecode(pipe) {
    // Get the size of the buffer, then cut a buffer of that size.
    const pipeView = new Uint8Array(pipe.buffer);
    let len = 0;
    for (; len < pipeView.byteLength; len++) {
        if (pipeView[len] < 0x80) {
            // If it's a positive number, we reuse lebDecode.
            if ((pipeView[len] & 0x40) === 0) {
                return lebDecode(pipe);
            }
            break;
        }
    }
    const bytes = new Uint8Array(safeRead(pipe, len + 1));
    let value = BigInt(0);
    for (let i = bytes.byteLength - 1; i >= 0; i--) {
        value = value * BigInt(0x80) + BigInt(0x80 - (bytes[i] & 0x7f) - 1);
    }
    return -value - BigInt(1);
}
/**
 *
 * @param value bigint or number
 * @param byteLength number
 * @returns Buffer
 */
function writeUIntLE(value, byteLength) {
    if (BigInt(value) < BigInt(0)) {
        throw new Error('Cannot write negative values.');
    }
    return writeIntLE(value, byteLength);
}
/**
 *
 * @param value - bigint or number
 * @param byteLength - number
 * @returns ArrayBuffer
 */
function writeIntLE(value, byteLength) {
    value = BigInt(value);
    const pipe = new _buffer__WEBPACK_IMPORTED_MODULE_0__.PipeArrayBuffer(new ArrayBuffer(Math.min(1, byteLength)), 0);
    let i = 0;
    let mul = BigInt(256);
    let sub = BigInt(0);
    let byte = Number(value % mul);
    pipe.write(new Uint8Array([byte]));
    while (++i < byteLength) {
        if (value < 0 && sub === BigInt(0) && byte !== 0) {
            sub = BigInt(1);
        }
        byte = Number((value / mul - sub) % BigInt(256));
        pipe.write(new Uint8Array([byte]));
        mul *= BigInt(256);
    }
    return pipe.buffer;
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param byteLength number
 * @returns bigint
 */
function readUIntLE(pipe, byteLength) {
    let val = BigInt(safeReadUint8(pipe));
    let mul = BigInt(1);
    let i = 0;
    while (++i < byteLength) {
        mul *= BigInt(256);
        const byte = BigInt(safeReadUint8(pipe));
        val = val + mul * byte;
    }
    return val;
}
/**
 *
 * @param pipe Pipe from buffer-pipe
 * @param byteLength number
 * @returns bigint
 */
function readIntLE(pipe, byteLength) {
    let val = readUIntLE(pipe, byteLength);
    const mul = BigInt(2) ** (BigInt(8) * BigInt(byteLength - 1) + BigInt(7));
    if (val >= mul) {
        val -= mul * BigInt(2);
    }
    return val;
}
//# sourceMappingURL=leb128.js.map

/***/ }),

/***/ "./node_modules/@dfinity/principal/lib/esm/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@dfinity/principal/lib/esm/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "JSON_KEY_PRINCIPAL": () => (/* binding */ JSON_KEY_PRINCIPAL),
/* harmony export */   "Principal": () => (/* binding */ Principal)
/* harmony export */ });
/* harmony import */ var _utils_base32__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/base32 */ "./node_modules/@dfinity/principal/lib/esm/utils/base32.js");
/* harmony import */ var _utils_getCrc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getCrc */ "./node_modules/@dfinity/principal/lib/esm/utils/getCrc.js");
/* harmony import */ var _utils_sha224__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/sha224 */ "./node_modules/@dfinity/principal/lib/esm/utils/sha224.js");



const JSON_KEY_PRINCIPAL = '__principal__';
const SELF_AUTHENTICATING_SUFFIX = 2;
const ANONYMOUS_SUFFIX = 4;
const MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR = 'aaaaa-aa';
const fromHexString = (hexString) => { var _a; return new Uint8Array(((_a = hexString.match(/.{1,2}/g)) !== null && _a !== void 0 ? _a : []).map(byte => parseInt(byte, 16))); };
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
class Principal {
    constructor(_arr) {
        this._arr = _arr;
        this._isPrincipal = true;
    }
    static anonymous() {
        return new this(new Uint8Array([ANONYMOUS_SUFFIX]));
    }
    /**
     * Utility method, returning the principal representing the management canister, decoded from the hex string `'aaaaa-aa'`
     * @returns {Principal} principal of the management canister
     */
    static managementCanister() {
        return this.fromText(MANAGEMENT_CANISTER_PRINCIPAL_TEXT_STR);
    }
    static selfAuthenticating(publicKey) {
        const sha = (0,_utils_sha224__WEBPACK_IMPORTED_MODULE_2__.sha224)(publicKey);
        return new this(new Uint8Array([...sha, SELF_AUTHENTICATING_SUFFIX]));
    }
    static from(other) {
        if (typeof other === 'string') {
            return Principal.fromText(other);
        }
        else if (Object.getPrototypeOf(other) === Uint8Array.prototype) {
            return new Principal(other);
        }
        else if (typeof other === 'object' &&
            other !== null &&
            other._isPrincipal === true) {
            return new Principal(other._arr);
        }
        throw new Error(`Impossible to convert ${JSON.stringify(other)} to Principal.`);
    }
    static fromHex(hex) {
        return new this(fromHexString(hex));
    }
    static fromText(text) {
        let maybePrincipal = text;
        // If formatted as JSON string, parse it first
        if (text.includes(JSON_KEY_PRINCIPAL)) {
            const obj = JSON.parse(text);
            if (JSON_KEY_PRINCIPAL in obj) {
                maybePrincipal = obj[JSON_KEY_PRINCIPAL];
            }
        }
        const canisterIdNoDash = maybePrincipal.toLowerCase().replace(/-/g, '');
        let arr = (0,_utils_base32__WEBPACK_IMPORTED_MODULE_0__.decode)(canisterIdNoDash);
        arr = arr.slice(4, arr.length);
        const principal = new this(arr);
        if (principal.toText() !== maybePrincipal) {
            throw new Error(`Principal "${principal.toText()}" does not have a valid checksum (original value "${maybePrincipal}" may not be a valid Principal ID).`);
        }
        return principal;
    }
    static fromUint8Array(arr) {
        return new this(arr);
    }
    isAnonymous() {
        return this._arr.byteLength === 1 && this._arr[0] === ANONYMOUS_SUFFIX;
    }
    toUint8Array() {
        return this._arr;
    }
    toHex() {
        return toHexString(this._arr).toUpperCase();
    }
    toText() {
        const checksumArrayBuf = new ArrayBuffer(4);
        const view = new DataView(checksumArrayBuf);
        view.setUint32(0, (0,_utils_getCrc__WEBPACK_IMPORTED_MODULE_1__.getCrc32)(this._arr));
        const checksum = new Uint8Array(checksumArrayBuf);
        const bytes = Uint8Array.from(this._arr);
        const array = new Uint8Array([...checksum, ...bytes]);
        const result = (0,_utils_base32__WEBPACK_IMPORTED_MODULE_0__.encode)(array);
        const matches = result.match(/.{1,5}/g);
        if (!matches) {
            // This should only happen if there's no character, which is unreachable.
            throw new Error();
        }
        return matches.join('-');
    }
    toString() {
        return this.toText();
    }
    /**
     * Serializes to JSON
     * @returns {JsonnablePrincipal} a JSON object with a single key, {@link JSON_KEY_PRINCIPAL}, whose value is the principal as a string
     */
    toJSON() {
        return { [JSON_KEY_PRINCIPAL]: this.toText() };
    }
    /**
     * Utility method taking a Principal to compare against. Used for determining canister ranges in certificate verification
     * @param {Principal} other - a {@link Principal} to compare
     * @returns {'lt' | 'eq' | 'gt'} `'lt' | 'eq' | 'gt'` a string, representing less than, equal to, or greater than
     */
    compareTo(other) {
        for (let i = 0; i < Math.min(this._arr.length, other._arr.length); i++) {
            if (this._arr[i] < other._arr[i])
                return 'lt';
            else if (this._arr[i] > other._arr[i])
                return 'gt';
        }
        // Here, at least one principal is a prefix of the other principal (they could be the same)
        if (this._arr.length < other._arr.length)
            return 'lt';
        if (this._arr.length > other._arr.length)
            return 'gt';
        return 'eq';
    }
    /**
     * Utility method checking whether a provided Principal is less than or equal to the current one using the {@link Principal.compareTo} method
     * @param other a {@link Principal} to compare
     * @returns {boolean} boolean
     */
    ltEq(other) {
        const cmp = this.compareTo(other);
        return cmp == 'lt' || cmp == 'eq';
    }
    /**
     * Utility method checking whether a provided Principal is greater than or equal to the current one using the {@link Principal.compareTo} method
     * @param other a {@link Principal} to compare
     * @returns {boolean} boolean
     */
    gtEq(other) {
        const cmp = this.compareTo(other);
        return cmp == 'gt' || cmp == 'eq';
    }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@dfinity/principal/lib/esm/utils/base32.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/principal/lib/esm/utils/base32.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "decode": () => (/* binding */ decode)
/* harmony export */ });
const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
// Build a lookup table for decoding.
const lookupTable = Object.create(null);
for (let i = 0; i < alphabet.length; i++) {
    lookupTable[alphabet[i]] = i;
}
// Add aliases for rfc4648.
lookupTable['0'] = lookupTable.o;
lookupTable['1'] = lookupTable.i;
/**
 * @param input The input array to encode.
 * @returns A Base32 string encoding the input.
 */
function encode(input) {
    // How many bits will we skip from the first byte.
    let skip = 0;
    // 5 high bits, carry from one byte to the next.
    let bits = 0;
    // The output string in base32.
    let output = '';
    function encodeByte(byte) {
        if (skip < 0) {
            // we have a carry from the previous byte
            bits |= byte >> -skip;
        }
        else {
            // no carry
            bits = (byte << skip) & 248;
        }
        if (skip > 3) {
            // Not enough data to produce a character, get us another one
            skip -= 8;
            return 1;
        }
        if (skip < 4) {
            // produce a character
            output += alphabet[bits >> 3];
            skip += 5;
        }
        return 0;
    }
    for (let i = 0; i < input.length;) {
        i += encodeByte(input[i]);
    }
    return output + (skip < 0 ? alphabet[bits >> 3] : '');
}
/**
 * @param input The base32 encoded string to decode.
 */
function decode(input) {
    // how many bits we have from the previous character.
    let skip = 0;
    // current byte we're producing.
    let byte = 0;
    const output = new Uint8Array(((input.length * 4) / 3) | 0);
    let o = 0;
    function decodeChar(char) {
        // Consume a character from the stream, store
        // the output in this.output. As before, better
        // to use update().
        let val = lookupTable[char.toLowerCase()];
        if (val === undefined) {
            throw new Error(`Invalid character: ${JSON.stringify(char)}`);
        }
        // move to the high bits
        val <<= 3;
        byte |= val >>> skip;
        skip += 5;
        if (skip >= 8) {
            // We have enough bytes to produce an output
            output[o++] = byte;
            skip -= 8;
            if (skip > 0) {
                byte = (val << (5 - skip)) & 255;
            }
            else {
                byte = 0;
            }
        }
    }
    for (const c of input) {
        decodeChar(c);
    }
    return output.slice(0, o);
}
//# sourceMappingURL=base32.js.map

/***/ }),

/***/ "./node_modules/@dfinity/principal/lib/esm/utils/getCrc.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/principal/lib/esm/utils/getCrc.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCrc32": () => (/* binding */ getCrc32)
/* harmony export */ });
// This file is translated to JavaScript from
// https://lxp32.github.io/docs/a-simple-example-crc32-calculation/
const lookUpTable = new Uint32Array([
    0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3,
    0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
    0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7,
    0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
    0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b,
    0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
    0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f,
    0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
    0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433,
    0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
    0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457,
    0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
    0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb,
    0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
    0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f,
    0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
    0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683,
    0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
    0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7,
    0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
    0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b,
    0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
    0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f,
    0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
    0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713,
    0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
    0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777,
    0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
    0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db,
    0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
    0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf,
    0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d,
]);
/**
 * Calculate the CRC32 of an ArrayBufferLike.
 * @param buf The BufferLike to calculate the CRC32 of.
 */
function getCrc32(buf) {
    const b = new Uint8Array(buf);
    let crc = -1;
    for (let i = 0; i < b.length; i++) {
        const byte = b[i];
        const t = (byte ^ crc) & 0xff;
        crc = lookUpTable[t] ^ (crc >>> 8);
    }
    return (crc ^ -1) >>> 0;
}
//# sourceMappingURL=getCrc.js.map

/***/ }),

/***/ "./node_modules/@dfinity/principal/lib/esm/utils/sha224.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@dfinity/principal/lib/esm/utils/sha224.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sha224": () => (/* binding */ sha224)
/* harmony export */ });
/* harmony import */ var _noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/hashes/sha256 */ "./node_modules/@noble/hashes/esm/sha256.js");

/**
 * Returns the SHA224 hash of the buffer.
 * @param data Arraybuffer to encode
 */
function sha224(data) {
    return _noble_hashes_sha256__WEBPACK_IMPORTED_MODULE_0__.sha224.create().update(new Uint8Array(data)).digest();
}
//# sourceMappingURL=sha224.js.map

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/bignumber.js/bignumber.js":
/*!************************************************!*\
  !*** ./node_modules/bignumber.js/bignumber.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;;(function (globalObject) {
  'use strict';

/*
 *      bignumber.js v9.3.0
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


  var BigNumber,
    isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
    mathceil = Math.ceil,
    mathfloor = Math.floor,

    bignumberError = '[BigNumber Error] ',
    tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

    BASE = 1e14,
    LOG_BASE = 14,
    MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
    // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
    POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
    SQRT_BASE = 1e7,

    // EDITABLE
    // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
    // the arguments to toExponential, toFixed, toFormat, and toPrecision.
    MAX = 1E9;                                   // 0 to MAX_INT32


  /*
   * Create and return a BigNumber constructor.
   */
  function clone(configObject) {
    var div, convertBase, parseNumeric,
      P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
      ONE = new BigNumber(1),


      //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


      // The default values below must be integers within the inclusive ranges stated.
      // The values can also be changed at run-time using BigNumber.set.

      // The maximum number of decimal places for operations involving division.
      DECIMAL_PLACES = 20,                     // 0 to MAX

      // The rounding mode used when rounding to the above decimal places, and when using
      // toExponential, toFixed, toFormat and toPrecision, and round (default value).
      // UP         0 Away from zero.
      // DOWN       1 Towards zero.
      // CEIL       2 Towards +Infinity.
      // FLOOR      3 Towards -Infinity.
      // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
      // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
      // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
      // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
      // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
      ROUNDING_MODE = 4,                       // 0 to 8

      // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

      // The exponent value at and beneath which toString returns exponential notation.
      // Number type: -7
      TO_EXP_NEG = -7,                         // 0 to -MAX

      // The exponent value at and above which toString returns exponential notation.
      // Number type: 21
      TO_EXP_POS = 21,                         // 0 to MAX

      // RANGE : [MIN_EXP, MAX_EXP]

      // The minimum exponent value, beneath which underflow to zero occurs.
      // Number type: -324  (5e-324)
      MIN_EXP = -1e7,                          // -1 to -MAX

      // The maximum exponent value, above which overflow to Infinity occurs.
      // Number type:  308  (1.7976931348623157e+308)
      // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
      MAX_EXP = 1e7,                           // 1 to MAX

      // Whether to use cryptographically-secure random number generation, if available.
      CRYPTO = false,                          // true or false

      // The modulo mode used when calculating the modulus: a mod n.
      // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
      // The remainder (r) is calculated as: r = a - n * q.
      //
      // UP        0 The remainder is positive if the dividend is negative, else is negative.
      // DOWN      1 The remainder has the same sign as the dividend.
      //             This modulo mode is commonly known as 'truncated division' and is
      //             equivalent to (a % n) in JavaScript.
      // FLOOR     3 The remainder has the same sign as the divisor (Python %).
      // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
      // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
      //             The remainder is always positive.
      //
      // The truncated division, floored division, Euclidian division and IEEE 754 remainder
      // modes are commonly used for the modulus operation.
      // Although the other rounding modes can also be used, they may not give useful results.
      MODULO_MODE = 1,                         // 0 to 9

      // The maximum number of significant digits of the result of the exponentiatedBy operation.
      // If POW_PRECISION is 0, there will be unlimited significant digits.
      POW_PRECISION = 0,                       // 0 to MAX

      // The format specification used by the BigNumber.prototype.toFormat method.
      FORMAT = {
        prefix: '',
        groupSize: 3,
        secondaryGroupSize: 0,
        groupSeparator: ',',
        decimalSeparator: '.',
        fractionGroupSize: 0,
        fractionGroupSeparator: '\xA0',        // non-breaking space
        suffix: ''
      },

      // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
      // '-', '.', whitespace, or repeated character.
      // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
      ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
      alphabetHasNormalDecimalDigits = true;


    //------------------------------------------------------------------------------------------


    // CONSTRUCTOR


    /*
     * The BigNumber constructor and exported function.
     * Create and return a new instance of a BigNumber object.
     *
     * v {number|string|BigNumber} A numeric value.
     * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
     */
    function BigNumber(v, b) {
      var alphabet, c, caseChanged, e, i, isNum, len, str,
        x = this;

      // Enable constructor call without `new`.
      if (!(x instanceof BigNumber)) return new BigNumber(v, b);

      if (b == null) {

        if (v && v._isBigNumber === true) {
          x.s = v.s;

          if (!v.c || v.e > MAX_EXP) {
            x.c = x.e = null;
          } else if (v.e < MIN_EXP) {
            x.c = [x.e = 0];
          } else {
            x.e = v.e;
            x.c = v.c.slice();
          }

          return;
        }

        if ((isNum = typeof v == 'number') && v * 0 == 0) {

          // Use `1 / n` to handle minus zero also.
          x.s = 1 / v < 0 ? (v = -v, -1) : 1;

          // Fast path for integers, where n < 2147483648 (2**31).
          if (v === ~~v) {
            for (e = 0, i = v; i >= 10; i /= 10, e++);

            if (e > MAX_EXP) {
              x.c = x.e = null;
            } else {
              x.e = e;
              x.c = [v];
            }

            return;
          }

          str = String(v);
        } else {

          if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

          x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
        }

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

        // Exponential form?
        if ((i = str.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +str.slice(i + 1);
          str = str.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = str.length;
        }

      } else {

        // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
        intCheck(b, 2, ALPHABET.length, 'Base');

        // Allow exponential notation to be used with base 10 argument, while
        // also rounding to DECIMAL_PLACES as with other bases.
        if (b == 10 && alphabetHasNormalDecimalDigits) {
          x = new BigNumber(v);
          return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
        }

        str = String(v);

        if (isNum = typeof v == 'number') {

          // Avoid potential interpretation of Infinity and NaN as base 44+ values.
          if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

          x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

          // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
          if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
            throw Error
             (tooManyDigits + v);
          }
        } else {
          x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
        }

        alphabet = ALPHABET.slice(0, b);
        e = i = 0;

        // Check that str is a valid base b number.
        // Don't use RegExp, so alphabet can contain special characters.
        for (len = str.length; i < len; i++) {
          if (alphabet.indexOf(c = str.charAt(i)) < 0) {
            if (c == '.') {

              // If '.' is not the first character and it has not be found before.
              if (i > e) {
                e = len;
                continue;
              }
            } else if (!caseChanged) {

              // Allow e.g. hexadecimal 'FF' as well as 'ff'.
              if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                  str == str.toLowerCase() && (str = str.toUpperCase())) {
                caseChanged = true;
                i = -1;
                e = 0;
                continue;
              }
            }

            return parseNumeric(x, String(v), isNum, b);
          }
        }

        // Prevent later check for length on converted number.
        isNum = false;
        str = convertBase(str, b, 10, x.s);

        // Decimal point?
        if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
        else e = str.length;
      }

      // Determine leading zeros.
      for (i = 0; str.charCodeAt(i) === 48; i++);

      // Determine trailing zeros.
      for (len = str.length; str.charCodeAt(--len) === 48;);

      if (str = str.slice(i, ++len)) {
        len -= i;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (isNum && BigNumber.DEBUG &&
          len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
            throw Error
             (tooManyDigits + (x.s * v));
        }

         // Overflow?
        if ((e = e - i - 1) > MAX_EXP) {

          // Infinity.
          x.c = x.e = null;

        // Underflow?
        } else if (e < MIN_EXP) {

          // Zero.
          x.c = [x.e = 0];
        } else {
          x.e = e;
          x.c = [];

          // Transform base

          // e is the base 10 exponent.
          // i is where to slice str to get the first element of the coefficient array.
          i = (e + 1) % LOG_BASE;
          if (e < 0) i += LOG_BASE;  // i < 1

          if (i < len) {
            if (i) x.c.push(+str.slice(0, i));

            for (len -= LOG_BASE; i < len;) {
              x.c.push(+str.slice(i, i += LOG_BASE));
            }

            i = LOG_BASE - (str = str.slice(i)).length;
          } else {
            i -= len;
          }

          for (; i--; str += '0');
          x.c.push(+str);
        }
      } else {

        // Zero.
        x.c = [x.e = 0];
      }
    }


    // CONSTRUCTOR PROPERTIES


    BigNumber.clone = clone;

    BigNumber.ROUND_UP = 0;
    BigNumber.ROUND_DOWN = 1;
    BigNumber.ROUND_CEIL = 2;
    BigNumber.ROUND_FLOOR = 3;
    BigNumber.ROUND_HALF_UP = 4;
    BigNumber.ROUND_HALF_DOWN = 5;
    BigNumber.ROUND_HALF_EVEN = 6;
    BigNumber.ROUND_HALF_CEIL = 7;
    BigNumber.ROUND_HALF_FLOOR = 8;
    BigNumber.EUCLID = 9;


    /*
     * Configure infrequently-changing library-wide settings.
     *
     * Accept an object with the following optional properties (if the value of a property is
     * a number, it must be an integer within the inclusive range stated):
     *
     *   DECIMAL_PLACES   {number}           0 to MAX
     *   ROUNDING_MODE    {number}           0 to 8
     *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
     *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
     *   CRYPTO           {boolean}          true or false
     *   MODULO_MODE      {number}           0 to 9
     *   POW_PRECISION       {number}           0 to MAX
     *   ALPHABET         {string}           A string of two or more unique characters which does
     *                                       not contain '.'.
     *   FORMAT           {object}           An object with some of the following properties:
     *     prefix                 {string}
     *     groupSize              {number}
     *     secondaryGroupSize     {number}
     *     groupSeparator         {string}
     *     decimalSeparator       {string}
     *     fractionGroupSize      {number}
     *     fractionGroupSeparator {string}
     *     suffix                 {string}
     *
     * (The values assigned to the above FORMAT object properties are not checked for validity.)
     *
     * E.g.
     * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
     *
     * Ignore properties/parameters set to null or undefined, except for ALPHABET.
     *
     * Return an object with the properties current values.
     */
    BigNumber.config = BigNumber.set = function (obj) {
      var p, v;

      if (obj != null) {

        if (typeof obj == 'object') {

          // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            DECIMAL_PLACES = v;
          }

          // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
          // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
            v = obj[p];
            intCheck(v, 0, 8, p);
            ROUNDING_MODE = v;
          }

          // EXPONENTIAL_AT {number|number[]}
          // Integer, -MAX to MAX inclusive or
          // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
          // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, 0, p);
              intCheck(v[1], 0, MAX, p);
              TO_EXP_NEG = v[0];
              TO_EXP_POS = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
            }
          }

          // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
          // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
          // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
          if (obj.hasOwnProperty(p = 'RANGE')) {
            v = obj[p];
            if (v && v.pop) {
              intCheck(v[0], -MAX, -1, p);
              intCheck(v[1], 1, MAX, p);
              MIN_EXP = v[0];
              MAX_EXP = v[1];
            } else {
              intCheck(v, -MAX, MAX, p);
              if (v) {
                MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
              } else {
                throw Error
                 (bignumberError + p + ' cannot be zero: ' + v);
              }
            }
          }

          // CRYPTO {boolean} true or false.
          // '[BigNumber Error] CRYPTO not true or false: {v}'
          // '[BigNumber Error] crypto unavailable'
          if (obj.hasOwnProperty(p = 'CRYPTO')) {
            v = obj[p];
            if (v === !!v) {
              if (v) {
                if (typeof crypto != 'undefined' && crypto &&
                 (crypto.getRandomValues || crypto.randomBytes)) {
                  CRYPTO = v;
                } else {
                  CRYPTO = !v;
                  throw Error
                   (bignumberError + 'crypto unavailable');
                }
              } else {
                CRYPTO = v;
              }
            } else {
              throw Error
               (bignumberError + p + ' not true or false: ' + v);
            }
          }

          // MODULO_MODE {number} Integer, 0 to 9 inclusive.
          // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
            v = obj[p];
            intCheck(v, 0, 9, p);
            MODULO_MODE = v;
          }

          // POW_PRECISION {number} Integer, 0 to MAX inclusive.
          // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
          if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
            v = obj[p];
            intCheck(v, 0, MAX, p);
            POW_PRECISION = v;
          }

          // FORMAT {object}
          // '[BigNumber Error] FORMAT not an object: {v}'
          if (obj.hasOwnProperty(p = 'FORMAT')) {
            v = obj[p];
            if (typeof v == 'object') FORMAT = v;
            else throw Error
             (bignumberError + p + ' not an object: ' + v);
          }

          // ALPHABET {string}
          // '[BigNumber Error] ALPHABET invalid: {v}'
          if (obj.hasOwnProperty(p = 'ALPHABET')) {
            v = obj[p];

            // Disallow if less than two characters,
            // or if it contains '+', '-', '.', whitespace, or a repeated character.
            if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
              alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
              ALPHABET = v;
            } else {
              throw Error
               (bignumberError + p + ' invalid: ' + v);
            }
          }

        } else {

          // '[BigNumber Error] Object expected: {v}'
          throw Error
           (bignumberError + 'Object expected: ' + obj);
        }
      }

      return {
        DECIMAL_PLACES: DECIMAL_PLACES,
        ROUNDING_MODE: ROUNDING_MODE,
        EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
        RANGE: [MIN_EXP, MAX_EXP],
        CRYPTO: CRYPTO,
        MODULO_MODE: MODULO_MODE,
        POW_PRECISION: POW_PRECISION,
        FORMAT: FORMAT,
        ALPHABET: ALPHABET
      };
    };


    /*
     * Return true if v is a BigNumber instance, otherwise return false.
     *
     * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
     *
     * v {any}
     *
     * '[BigNumber Error] Invalid BigNumber: {v}'
     */
    BigNumber.isBigNumber = function (v) {
      if (!v || v._isBigNumber !== true) return false;
      if (!BigNumber.DEBUG) return true;

      var i, n,
        c = v.c,
        e = v.e,
        s = v.s;

      out: if ({}.toString.call(c) == '[object Array]') {

        if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

          // If the first element is zero, the BigNumber value must be zero.
          if (c[0] === 0) {
            if (e === 0 && c.length === 1) return true;
            break out;
          }

          // Calculate number of digits that c[0] should have, based on the exponent.
          i = (e + 1) % LOG_BASE;
          if (i < 1) i += LOG_BASE;

          // Calculate number of digits of c[0].
          //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
          if (String(c[0]).length == i) {

            for (i = 0; i < c.length; i++) {
              n = c[i];
              if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
            }

            // Last element cannot be zero, unless it is the only element.
            if (n !== 0) return true;
          }
        }

      // Infinity/NaN
      } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
        return true;
      }

      throw Error
        (bignumberError + 'Invalid BigNumber: ' + v);
    };


    /*
     * Return a new BigNumber whose value is the maximum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.maximum = BigNumber.max = function () {
      return maxOrMin(arguments, -1);
    };


    /*
     * Return a new BigNumber whose value is the minimum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.minimum = BigNumber.min = function () {
      return maxOrMin(arguments, 1);
    };


    /*
     * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
     * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
     * zeros are produced).
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
     * '[BigNumber Error] crypto unavailable'
     */
    BigNumber.random = (function () {
      var pow2_53 = 0x20000000000000;

      // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
      // Check if Math.random() produces more than 32 bits of randomness.
      // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
      // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
      var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
       ? function () { return mathfloor(Math.random() * pow2_53); }
       : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
         (Math.random() * 0x800000 | 0); };

      return function (dp) {
        var a, b, e, k, v,
          i = 0,
          c = [],
          rand = new BigNumber(ONE);

        if (dp == null) dp = DECIMAL_PLACES;
        else intCheck(dp, 0, MAX);

        k = mathceil(dp / LOG_BASE);

        if (CRYPTO) {

          // Browsers supporting crypto.getRandomValues.
          if (crypto.getRandomValues) {

            a = crypto.getRandomValues(new Uint32Array(k *= 2));

            for (; i < k;) {

              // 53 bits:
              // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
              // 11111 11111111 11111111 11111111 11100000 00000000 00000000
              // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
              //                                     11111 11111111 11111111
              // 0x20000 is 2^21.
              v = a[i] * 0x20000 + (a[i + 1] >>> 11);

              // Rejection sampling:
              // 0 <= v < 9007199254740992
              // Probability that v >= 9e15, is
              // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
              if (v >= 9e15) {
                b = crypto.getRandomValues(new Uint32Array(2));
                a[i] = b[0];
                a[i + 1] = b[1];
              } else {

                // 0 <= v <= 8999999999999999
                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 2;
              }
            }
            i = k / 2;

          // Node.js supporting crypto.randomBytes.
          } else if (crypto.randomBytes) {

            // buffer
            a = crypto.randomBytes(k *= 7);

            for (; i < k;) {

              // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
              // 0x100000000 is 2^32, 0x1000000 is 2^24
              // 11111 11111111 11111111 11111111 11111111 11111111 11111111
              // 0 <= v < 9007199254740992
              v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
                 (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
                 (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

              if (v >= 9e15) {
                crypto.randomBytes(7).copy(a, i);
              } else {

                // 0 <= (v % 1e14) <= 99999999999999
                c.push(v % 1e14);
                i += 7;
              }
            }
            i = k / 7;
          } else {
            CRYPTO = false;
            throw Error
             (bignumberError + 'crypto unavailable');
          }
        }

        // Use Math.random.
        if (!CRYPTO) {

          for (; i < k;) {
            v = random53bitInt();
            if (v < 9e15) c[i++] = v % 1e14;
          }
        }

        k = c[--i];
        dp %= LOG_BASE;

        // Convert trailing digits to zeros according to dp.
        if (k && dp) {
          v = POWS_TEN[LOG_BASE - dp];
          c[i] = mathfloor(k / v) * v;
        }

        // Remove trailing elements which are zero.
        for (; c[i] === 0; c.pop(), i--);

        // Zero?
        if (i < 0) {
          c = [e = 0];
        } else {

          // Remove leading elements which are zero and adjust exponent accordingly.
          for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

          // Count the digits of the first element of c to determine leading zeros, and...
          for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

          // adjust the exponent accordingly.
          if (i < LOG_BASE) e -= LOG_BASE - i;
        }

        rand.e = e;
        rand.c = c;
        return rand;
      };
    })();


    /*
     * Return a BigNumber whose value is the sum of the arguments.
     *
     * arguments {number|string|BigNumber}
     */
    BigNumber.sum = function () {
      var i = 1,
        args = arguments,
        sum = new BigNumber(args[0]);
      for (; i < args.length;) sum = sum.plus(args[i++]);
      return sum;
    };


    // PRIVATE FUNCTIONS


    // Called by BigNumber and BigNumber.prototype.toString.
    convertBase = (function () {
      var decimal = '0123456789';

      /*
       * Convert string of baseIn to an array of numbers of baseOut.
       * Eg. toBaseOut('255', 10, 16) returns [15, 15].
       * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
       */
      function toBaseOut(str, baseIn, baseOut, alphabet) {
        var j,
          arr = [0],
          arrL,
          i = 0,
          len = str.length;

        for (; i < len;) {
          for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

          arr[0] += alphabet.indexOf(str.charAt(i++));

          for (j = 0; j < arr.length; j++) {

            if (arr[j] > baseOut - 1) {
              if (arr[j + 1] == null) arr[j + 1] = 0;
              arr[j + 1] += arr[j] / baseOut | 0;
              arr[j] %= baseOut;
            }
          }
        }

        return arr.reverse();
      }

      // Convert a numeric string of baseIn to a numeric string of baseOut.
      // If the caller is toString, we are converting from base 10 to baseOut.
      // If the caller is BigNumber, we are converting from baseIn to base 10.
      return function (str, baseIn, baseOut, sign, callerIsToString) {
        var alphabet, d, e, k, r, x, xc, y,
          i = str.indexOf('.'),
          dp = DECIMAL_PLACES,
          rm = ROUNDING_MODE;

        // Non-integer.
        if (i >= 0) {
          k = POW_PRECISION;

          // Unlimited precision.
          POW_PRECISION = 0;
          str = str.replace('.', '');
          y = new BigNumber(baseIn);
          x = y.pow(str.length - i);
          POW_PRECISION = k;

          // Convert str as if an integer, then restore the fraction part by dividing the
          // result by its base raised to a power.

          y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
           10, baseOut, decimal);
          y.e = y.c.length;
        }

        // Convert the number as integer.

        xc = toBaseOut(str, baseIn, baseOut, callerIsToString
         ? (alphabet = ALPHABET, decimal)
         : (alphabet = decimal, ALPHABET));

        // xc now represents str as an integer and converted to baseOut. e is the exponent.
        e = k = xc.length;

        // Remove trailing zeros.
        for (; xc[--k] == 0; xc.pop());

        // Zero?
        if (!xc[0]) return alphabet.charAt(0);

        // Does str represent an integer? If so, no need for the division.
        if (i < 0) {
          --e;
        } else {
          x.c = xc;
          x.e = e;

          // The sign is needed for correct rounding.
          x.s = sign;
          x = div(x, y, dp, rm, baseOut);
          xc = x.c;
          r = x.r;
          e = x.e;
        }

        // xc now represents str converted to baseOut.

        // The index of the rounding digit.
        d = e + dp + 1;

        // The rounding digit: the digit to the right of the digit that may be rounded up.
        i = xc[d];

        // Look at the rounding digits and mode to determine whether to round up.

        k = baseOut / 2;
        r = r || d < 0 || xc[d + 1] != null;

        r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
              : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
               rm == (x.s < 0 ? 8 : 7));

        // If the index of the rounding digit is not greater than zero, or xc represents
        // zero, then the result of the base conversion is zero or, if rounding up, a value
        // such as 0.00001.
        if (d < 1 || !xc[0]) {

          // 1^-dp or 0
          str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
        } else {

          // Truncate xc to the required number of decimal places.
          xc.length = d;

          // Round up?
          if (r) {

            // Rounding up may mean the previous digit has to be rounded up and so on.
            for (--baseOut; ++xc[--d] > baseOut;) {
              xc[d] = 0;

              if (!d) {
                ++e;
                xc = [1].concat(xc);
              }
            }
          }

          // Determine trailing zeros.
          for (k = xc.length; !xc[--k];);

          // E.g. [4, 11, 15] becomes 4bf.
          for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

          // Add leading zeros, decimal point and trailing zeros as required.
          str = toFixedPoint(str, e, alphabet.charAt(0));
        }

        // The caller will add the sign.
        return str;
      };
    })();


    // Perform division in the specified base. Called by div and convertBase.
    div = (function () {

      // Assume non-zero x and k.
      function multiply(x, k, base) {
        var m, temp, xlo, xhi,
          carry = 0,
          i = x.length,
          klo = k % SQRT_BASE,
          khi = k / SQRT_BASE | 0;

        for (x = x.slice(); i--;) {
          xlo = x[i] % SQRT_BASE;
          xhi = x[i] / SQRT_BASE | 0;
          m = khi * xlo + xhi * klo;
          temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
          carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
          x[i] = temp % base;
        }

        if (carry) x = [carry].concat(x);

        return x;
      }

      function compare(a, b, aL, bL) {
        var i, cmp;

        if (aL != bL) {
          cmp = aL > bL ? 1 : -1;
        } else {

          for (i = cmp = 0; i < aL; i++) {

            if (a[i] != b[i]) {
              cmp = a[i] > b[i] ? 1 : -1;
              break;
            }
          }
        }

        return cmp;
      }

      function subtract(a, b, aL, base) {
        var i = 0;

        // Subtract b from a.
        for (; aL--;) {
          a[aL] -= i;
          i = a[aL] < b[aL] ? 1 : 0;
          a[aL] = i * base + a[aL] - b[aL];
        }

        // Remove leading zeros.
        for (; !a[0] && a.length > 1; a.splice(0, 1));
      }

      // x: dividend, y: divisor.
      return function (x, y, dp, rm, base) {
        var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
          yL, yz,
          s = x.s == y.s ? 1 : -1,
          xc = x.c,
          yc = y.c;

        // Either NaN, Infinity or 0?
        if (!xc || !xc[0] || !yc || !yc[0]) {

          return new BigNumber(

           // Return NaN if either NaN, or both Infinity or 0.
           !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

            // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
            xc && xc[0] == 0 || !yc ? s * 0 : s / 0
         );
        }

        q = new BigNumber(s);
        qc = q.c = [];
        e = x.e - y.e;
        s = dp + e + 1;

        if (!base) {
          base = BASE;
          e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
          s = s / LOG_BASE | 0;
        }

        // Result exponent may be one less then the current value of e.
        // The coefficients of the BigNumbers from convertBase may have trailing zeros.
        for (i = 0; yc[i] == (xc[i] || 0); i++);

        if (yc[i] > (xc[i] || 0)) e--;

        if (s < 0) {
          qc.push(1);
          more = true;
        } else {
          xL = xc.length;
          yL = yc.length;
          i = 0;
          s += 2;

          // Normalise xc and yc so highest order digit of yc is >= base / 2.

          n = mathfloor(base / (yc[0] + 1));

          // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
          // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
          if (n > 1) {
            yc = multiply(yc, n, base);
            xc = multiply(xc, n, base);
            yL = yc.length;
            xL = xc.length;
          }

          xi = yL;
          rem = xc.slice(0, yL);
          remL = rem.length;

          // Add zeros to make remainder as long as divisor.
          for (; remL < yL; rem[remL++] = 0);
          yz = yc.slice();
          yz = [0].concat(yz);
          yc0 = yc[0];
          if (yc[1] >= base / 2) yc0++;
          // Not necessary, but to prevent trial digit n > base, when using base 3.
          // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

          do {
            n = 0;

            // Compare divisor and remainder.
            cmp = compare(yc, rem, yL, remL);

            // If divisor < remainder.
            if (cmp < 0) {

              // Calculate trial digit, n.

              rem0 = rem[0];
              if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

              // n is how many times the divisor goes into the current remainder.
              n = mathfloor(rem0 / yc0);

              //  Algorithm:
              //  product = divisor multiplied by trial digit (n).
              //  Compare product and remainder.
              //  If product is greater than remainder:
              //    Subtract divisor from product, decrement trial digit.
              //  Subtract product from remainder.
              //  If product was less than remainder at the last compare:
              //    Compare new remainder and divisor.
              //    If remainder is greater than divisor:
              //      Subtract divisor from remainder, increment trial digit.

              if (n > 1) {

                // n may be > base only when base is 3.
                if (n >= base) n = base - 1;

                // product = divisor * trial digit.
                prod = multiply(yc, n, base);
                prodL = prod.length;
                remL = rem.length;

                // Compare product and remainder.
                // If product > remainder then trial digit n too high.
                // n is 1 too high about 5% of the time, and is not known to have
                // ever been more than 1 too high.
                while (compare(prod, rem, prodL, remL) == 1) {
                  n--;

                  // Subtract divisor from product.
                  subtract(prod, yL < prodL ? yz : yc, prodL, base);
                  prodL = prod.length;
                  cmp = 1;
                }
              } else {

                // n is 0 or 1, cmp is -1.
                // If n is 0, there is no need to compare yc and rem again below,
                // so change cmp to 1 to avoid it.
                // If n is 1, leave cmp as -1, so yc and rem are compared again.
                if (n == 0) {

                  // divisor < remainder, so n must be at least 1.
                  cmp = n = 1;
                }

                // product = divisor
                prod = yc.slice();
                prodL = prod.length;
              }

              if (prodL < remL) prod = [0].concat(prod);

              // Subtract product from remainder.
              subtract(rem, prod, remL, base);
              remL = rem.length;

               // If product was < remainder.
              if (cmp == -1) {

                // Compare divisor and new remainder.
                // If divisor < new remainder, subtract divisor from remainder.
                // Trial digit n too low.
                // n is 1 too low about 5% of the time, and very rarely 2 too low.
                while (compare(yc, rem, yL, remL) < 1) {
                  n++;

                  // Subtract divisor from remainder.
                  subtract(rem, yL < remL ? yz : yc, remL, base);
                  remL = rem.length;
                }
              }
            } else if (cmp === 0) {
              n++;
              rem = [0];
            } // else cmp === 1 and n will be 0

            // Add the next digit, n, to the result array.
            qc[i++] = n;

            // Update the remainder.
            if (rem[0]) {
              rem[remL++] = xc[xi] || 0;
            } else {
              rem = [xc[xi]];
              remL = 1;
            }
          } while ((xi++ < xL || rem[0] != null) && s--);

          more = rem[0] != null;

          // Leading zero?
          if (!qc[0]) qc.splice(0, 1);
        }

        if (base == BASE) {

          // To calculate q.e, first get the number of digits of qc[0].
          for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

          round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
        } else {
          q.e = e;
          q.r = +more;
        }

        return q;
      };
    })();


    /*
     * Return a string representing the value of BigNumber n in fixed-point or exponential
     * notation rounded to the specified decimal places or significant digits.
     *
     * n: a BigNumber.
     * i: the index of the last digit required (i.e. the digit that may be rounded up).
     * rm: the rounding mode.
     * id: 1 (toExponential) or 2 (toPrecision).
     */
    function format(n, i, rm, id) {
      var c0, e, ne, len, str;

      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      if (!n.c) return n.toString();

      c0 = n.c[0];
      ne = n.e;

      if (i == null) {
        str = coeffToString(n.c);
        str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
         ? toExponential(str, ne)
         : toFixedPoint(str, ne, '0');
      } else {
        n = round(new BigNumber(n), i, rm);

        // n.e may have changed if the value was rounded up.
        e = n.e;

        str = coeffToString(n.c);
        len = str.length;

        // toPrecision returns exponential notation if the number of significant digits
        // specified is less than the number of digits necessary to represent the integer
        // part of the value in fixed-point notation.

        // Exponential notation.
        if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

          // Append zeros?
          for (; len < i; str += '0', len++);
          str = toExponential(str, e);

        // Fixed-point notation.
        } else {
          i -= ne;
          str = toFixedPoint(str, e, '0');

          // Append zeros?
          if (e + 1 > len) {
            if (--i > 0) for (str += '.'; i--; str += '0');
          } else {
            i += e - len;
            if (i > 0) {
              if (e + 1 == len) str += '.';
              for (; i--; str += '0');
            }
          }
        }
      }

      return n.s < 0 && c0 ? '-' + str : str;
    }


    // Handle BigNumber.max and BigNumber.min.
    // If any number is NaN, return NaN.
    function maxOrMin(args, n) {
      var k, y,
        i = 1,
        x = new BigNumber(args[0]);

      for (; i < args.length; i++) {
        y = new BigNumber(args[i]);
        if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
          x = y;
        }
      }

      return x;
    }


    /*
     * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
     * Called by minus, plus and times.
     */
    function normalise(n, c, e) {
      var i = 1,
        j = c.length;

       // Remove trailing zeros.
      for (; !c[--j]; c.pop());

      // Calculate the base 10 exponent. First get the number of digits of c[0].
      for (j = c[0]; j >= 10; j /= 10, i++);

      // Overflow?
      if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

        // Infinity.
        n.c = n.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        n.c = [n.e = 0];
      } else {
        n.e = e;
        n.c = c;
      }

      return n;
    }


    // Handle values that fail the validity test in BigNumber.
    parseNumeric = (function () {
      var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
        dotAfter = /^([^.]+)\.$/,
        dotBefore = /^\.([^.]+)$/,
        isInfinityOrNaN = /^-?(Infinity|NaN)$/,
        whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

      return function (x, str, isNum, b) {
        var base,
          s = isNum ? str : str.replace(whitespaceOrPlus, '');

        // No exception on ±Infinity or NaN.
        if (isInfinityOrNaN.test(s)) {
          x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
        } else {
          if (!isNum) {

            // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
            s = s.replace(basePrefix, function (m, p1, p2) {
              base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
              return !b || b == base ? p1 : m;
            });

            if (b) {
              base = b;

              // E.g. '1.' to '1', '.1' to '0.1'
              s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
            }

            if (str != s) return new BigNumber(s, base);
          }

          // '[BigNumber Error] Not a number: {n}'
          // '[BigNumber Error] Not a base {b} number: {n}'
          if (BigNumber.DEBUG) {
            throw Error
              (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
          }

          // NaN
          x.s = null;
        }

        x.c = x.e = null;
      }
    })();


    /*
     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
     * If r is truthy, it is known that there are more digits after the rounding digit.
     */
    function round(x, sd, rm, r) {
      var d, i, j, k, n, ni, rd,
        xc = x.c,
        pows10 = POWS_TEN;

      // if x is not Infinity or NaN...
      if (xc) {

        // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
        // n is a base 1e14 number, the value of the element of array x.c containing rd.
        // ni is the index of n within x.c.
        // d is the number of digits of n.
        // i is the index of rd within n including leading zeros.
        // j is the actual index of rd within n (if < 0, rd is a leading zero).
        out: {

          // Get the number of digits of the first element of xc.
          for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
          i = sd - d;

          // If the rounding digit is in the first element of xc...
          if (i < 0) {
            i += LOG_BASE;
            j = sd;
            n = xc[ni = 0];

            // Get the rounding digit at index j of n.
            rd = mathfloor(n / pows10[d - j - 1] % 10);
          } else {
            ni = mathceil((i + 1) / LOG_BASE);

            if (ni >= xc.length) {

              if (r) {

                // Needed by sqrt.
                for (; xc.length <= ni; xc.push(0));
                n = rd = 0;
                d = 1;
                i %= LOG_BASE;
                j = i - LOG_BASE + 1;
              } else {
                break out;
              }
            } else {
              n = k = xc[ni];

              // Get the number of digits of n.
              for (d = 1; k >= 10; k /= 10, d++);

              // Get the index of rd within n.
              i %= LOG_BASE;

              // Get the index of rd within n, adjusted for leading zeros.
              // The number of leading zeros of n is given by LOG_BASE - d.
              j = i - LOG_BASE + d;

              // Get the rounding digit at index j of n.
              rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
            }
          }

          r = r || sd < 0 ||

          // Are there any non-zero digits after the rounding digit?
          // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
          // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
           xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

          r = rm < 4
           ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
           : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

            // Check whether the digit to the left of the rounding digit is odd.
            ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
             rm == (x.s < 0 ? 8 : 7));

          if (sd < 1 || !xc[0]) {
            xc.length = 0;

            if (r) {

              // Convert sd to decimal places.
              sd -= x.e + 1;

              // 1, 0.1, 0.01, 0.001, 0.0001 etc.
              xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
              x.e = -sd || 0;
            } else {

              // Zero.
              xc[0] = x.e = 0;
            }

            return x;
          }

          // Remove excess digits.
          if (i == 0) {
            xc.length = ni;
            k = 1;
            ni--;
          } else {
            xc.length = ni + 1;
            k = pows10[LOG_BASE - i];

            // E.g. 56700 becomes 56000 if 7 is the rounding digit.
            // j > 0 means i > number of leading zeros of n.
            xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
          }

          // Round up?
          if (r) {

            for (; ;) {

              // If the digit to be rounded up is in the first element of xc...
              if (ni == 0) {

                // i will be the length of xc[0] before k is added.
                for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
                j = xc[0] += k;
                for (k = 1; j >= 10; j /= 10, k++);

                // if i != k the length has increased.
                if (i != k) {
                  x.e++;
                  if (xc[0] == BASE) xc[0] = 1;
                }

                break;
              } else {
                xc[ni] += k;
                if (xc[ni] != BASE) break;
                xc[ni--] = 0;
                k = 1;
              }
            }
          }

          // Remove trailing zeros.
          for (i = xc.length; xc[--i] === 0; xc.pop());
        }

        // Overflow? Infinity.
        if (x.e > MAX_EXP) {
          x.c = x.e = null;

        // Underflow? Zero.
        } else if (x.e < MIN_EXP) {
          x.c = [x.e = 0];
        }
      }

      return x;
    }


    function valueOf(n) {
      var str,
        e = n.e;

      if (e === null) return n.toString();

      str = coeffToString(n.c);

      str = e <= TO_EXP_NEG || e >= TO_EXP_POS
        ? toExponential(str, e)
        : toFixedPoint(str, e, '0');

      return n.s < 0 ? '-' + str : str;
    }


    // PROTOTYPE/INSTANCE METHODS


    /*
     * Return a new BigNumber whose value is the absolute value of this BigNumber.
     */
    P.absoluteValue = P.abs = function () {
      var x = new BigNumber(this);
      if (x.s < 0) x.s = 1;
      return x;
    };


    /*
     * Return
     *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
     *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
     *   0 if they have the same value,
     *   or null if the value of either is NaN.
     */
    P.comparedTo = function (y, b) {
      return compare(this, new BigNumber(y, b));
    };


    /*
     * If dp is undefined or null or true or false, return the number of decimal places of the
     * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     *
     * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.decimalPlaces = P.dp = function (dp, rm) {
      var c, n, v,
        x = this;

      if (dp != null) {
        intCheck(dp, 0, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), dp + x.e + 1, rm);
      }

      if (!(c = x.c)) return null;
      n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

      // Subtract the number of trailing zeros of the last number.
      if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
      if (n < 0) n = 0;

      return n;
    };


    /*
     *  n / 0 = I
     *  n / N = N
     *  n / I = 0
     *  0 / n = 0
     *  0 / 0 = N
     *  0 / N = N
     *  0 / I = 0
     *  N / n = N
     *  N / 0 = N
     *  N / N = N
     *  N / I = N
     *  I / n = I
     *  I / 0 = I
     *  I / N = N
     *  I / I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
     * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.dividedBy = P.div = function (y, b) {
      return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
    };


    /*
     * Return a new BigNumber whose value is the integer part of dividing the value of this
     * BigNumber by the value of BigNumber(y, b).
     */
    P.dividedToIntegerBy = P.idiv = function (y, b) {
      return div(this, new BigNumber(y, b), 0, 1);
    };


    /*
     * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
     *
     * If m is present, return the result modulo m.
     * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
     * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
     *
     * The modular power operation works efficiently when x, n, and m are integers, otherwise it
     * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
     *
     * n {number|string|BigNumber} The exponent. An integer.
     * [m] {number|string|BigNumber} The modulus.
     *
     * '[BigNumber Error] Exponent not an integer: {n}'
     */
    P.exponentiatedBy = P.pow = function (n, m) {
      var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
        x = this;

      n = new BigNumber(n);

      // Allow NaN and ±Infinity, but not other non-integers.
      if (n.c && !n.isInteger()) {
        throw Error
          (bignumberError + 'Exponent not an integer: ' + valueOf(n));
      }

      if (m != null) m = new BigNumber(m);

      // Exponent of MAX_SAFE_INTEGER is 15.
      nIsBig = n.e > 14;

      // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
      if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

        // The sign of the result of pow when x is negative depends on the evenness of n.
        // If +n overflows to ±Infinity, the evenness of n would be not be known.
        y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
        return m ? y.mod(m) : y;
      }

      nIsNeg = n.s < 0;

      if (m) {

        // x % m returns NaN if abs(m) is zero, or m is NaN.
        if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

        isModExp = !nIsNeg && x.isInteger() && m.isInteger();

        if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
      } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
        // [1, 240000000]
        ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
        // [80000000000000]  [99999750000000]
        : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

        // If x is negative and n is odd, k = -0, else k = 0.
        k = x.s < 0 && isOdd(n) ? -0 : 0;

        // If x >= 1, k = ±Infinity.
        if (x.e > -1) k = 1 / k;

        // If n is negative return ±0, else return ±Infinity.
        return new BigNumber(nIsNeg ? 1 / k : k);

      } else if (POW_PRECISION) {

        // Truncating each coefficient array to a length of k after each multiplication
        // equates to truncating significant digits to POW_PRECISION + [28, 41],
        // i.e. there will be a minimum of 28 guard digits retained.
        k = mathceil(POW_PRECISION / LOG_BASE + 2);
      }

      if (nIsBig) {
        half = new BigNumber(0.5);
        if (nIsNeg) n.s = 1;
        nIsOdd = isOdd(n);
      } else {
        i = Math.abs(+valueOf(n));
        nIsOdd = i % 2;
      }

      y = new BigNumber(ONE);

      // Performs 54 loop iterations for n of 9007199254740991.
      for (; ;) {

        if (nIsOdd) {
          y = y.times(x);
          if (!y.c) break;

          if (k) {
            if (y.c.length > k) y.c.length = k;
          } else if (isModExp) {
            y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
          }
        }

        if (i) {
          i = mathfloor(i / 2);
          if (i === 0) break;
          nIsOdd = i % 2;
        } else {
          n = n.times(half);
          round(n, n.e + 1, 1);

          if (n.e > 14) {
            nIsOdd = isOdd(n);
          } else {
            i = +valueOf(n);
            if (i === 0) break;
            nIsOdd = i % 2;
          }
        }

        x = x.times(x);

        if (k) {
          if (x.c && x.c.length > k) x.c.length = k;
        } else if (isModExp) {
          x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
        }
      }

      if (isModExp) return y;
      if (nIsNeg) y = ONE.div(y);

      return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
     * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
     */
    P.integerValue = function (rm) {
      var n = new BigNumber(this);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);
      return round(n, n.e + 1, rm);
    };


    /*
     * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isEqualTo = P.eq = function (y, b) {
      return compare(this, new BigNumber(y, b)) === 0;
    };


    /*
     * Return true if the value of this BigNumber is a finite number, otherwise return false.
     */
    P.isFinite = function () {
      return !!this.c;
    };


    /*
     * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isGreaterThan = P.gt = function (y, b) {
      return compare(this, new BigNumber(y, b)) > 0;
    };


    /*
     * Return true if the value of this BigNumber is greater than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

    };


    /*
     * Return true if the value of this BigNumber is an integer, otherwise return false.
     */
    P.isInteger = function () {
      return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
    };


    /*
     * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
     * otherwise return false.
     */
    P.isLessThan = P.lt = function (y, b) {
      return compare(this, new BigNumber(y, b)) < 0;
    };


    /*
     * Return true if the value of this BigNumber is less than or equal to the value of
     * BigNumber(y, b), otherwise return false.
     */
    P.isLessThanOrEqualTo = P.lte = function (y, b) {
      return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
    };


    /*
     * Return true if the value of this BigNumber is NaN, otherwise return false.
     */
    P.isNaN = function () {
      return !this.s;
    };


    /*
     * Return true if the value of this BigNumber is negative, otherwise return false.
     */
    P.isNegative = function () {
      return this.s < 0;
    };


    /*
     * Return true if the value of this BigNumber is positive, otherwise return false.
     */
    P.isPositive = function () {
      return this.s > 0;
    };


    /*
     * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
     */
    P.isZero = function () {
      return !!this.c && this.c[0] == 0;
    };


    /*
     *  n - 0 = n
     *  n - N = N
     *  n - I = -I
     *  0 - n = -n
     *  0 - 0 = 0
     *  0 - N = N
     *  0 - I = -I
     *  N - n = N
     *  N - 0 = N
     *  N - N = N
     *  N - I = N
     *  I - n = I
     *  I - 0 = I
     *  I - N = N
     *  I - I = N
     *
     * Return a new BigNumber whose value is the value of this BigNumber minus the value of
     * BigNumber(y, b).
     */
    P.minus = function (y, b) {
      var i, j, t, xLTy,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
      if (a != b) {
        y.s = -b;
        return x.plus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Either Infinity?
        if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

        // Either zero?
        if (!xc[0] || !yc[0]) {

          // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
          return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

           // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
           ROUNDING_MODE == 3 ? -0 : 0);
        }
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Determine which is the bigger number.
      if (a = xe - ye) {

        if (xLTy = a < 0) {
          a = -a;
          t = xc;
        } else {
          ye = xe;
          t = yc;
        }

        t.reverse();

        // Prepend zeros to equalise exponents.
        for (b = a; b--; t.push(0));
        t.reverse();
      } else {

        // Exponents equal. Check digit by digit.
        j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

        for (a = b = 0; b < j; b++) {

          if (xc[b] != yc[b]) {
            xLTy = xc[b] < yc[b];
            break;
          }
        }
      }

      // x < y? Point xc to the array of the bigger number.
      if (xLTy) {
        t = xc;
        xc = yc;
        yc = t;
        y.s = -y.s;
      }

      b = (j = yc.length) - (i = xc.length);

      // Append zeros to xc if shorter.
      // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
      if (b > 0) for (; b--; xc[i++] = 0);
      b = BASE - 1;

      // Subtract yc from xc.
      for (; j > a;) {

        if (xc[--j] < yc[j]) {
          for (i = j; i && !xc[--i]; xc[i] = b);
          --xc[i];
          xc[j] += BASE;
        }

        xc[j] -= yc[j];
      }

      // Remove leading zeros and adjust exponent accordingly.
      for (; xc[0] == 0; xc.splice(0, 1), --ye);

      // Zero?
      if (!xc[0]) {

        // Following IEEE 754 (2008) 6.3,
        // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
        y.s = ROUNDING_MODE == 3 ? -1 : 1;
        y.c = [y.e = 0];
        return y;
      }

      // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
      // for finite x and y.
      return normalise(y, xc, ye);
    };


    /*
     *   n % 0 =  N
     *   n % N =  N
     *   n % I =  n
     *   0 % n =  0
     *  -0 % n = -0
     *   0 % 0 =  N
     *   0 % N =  N
     *   0 % I =  0
     *   N % n =  N
     *   N % 0 =  N
     *   N % N =  N
     *   N % I =  N
     *   I % n =  N
     *   I % 0 =  N
     *   I % N =  N
     *   I % I =  N
     *
     * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
     * BigNumber(y, b). The result depends on the value of MODULO_MODE.
     */
    P.modulo = P.mod = function (y, b) {
      var q, s,
        x = this;

      y = new BigNumber(y, b);

      // Return NaN if x is Infinity or NaN, or y is NaN or zero.
      if (!x.c || !y.s || y.c && !y.c[0]) {
        return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
      } else if (!y.c || x.c && !x.c[0]) {
        return new BigNumber(x);
      }

      if (MODULO_MODE == 9) {

        // Euclidian division: q = sign(y) * floor(x / abs(y))
        // r = x - qy    where  0 <= r < abs(y)
        s = y.s;
        y.s = 1;
        q = div(x, y, 0, 3);
        y.s = s;
        q.s *= s;
      } else {
        q = div(x, y, 0, MODULO_MODE);
      }

      y = x.minus(q.times(y));

      // To match JavaScript %, ensure sign of zero is sign of dividend.
      if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

      return y;
    };


    /*
     *  n * 0 = 0
     *  n * N = N
     *  n * I = I
     *  0 * n = 0
     *  0 * 0 = 0
     *  0 * N = N
     *  0 * I = N
     *  N * n = N
     *  N * 0 = N
     *  N * N = N
     *  N * I = N
     *  I * n = I
     *  I * 0 = N
     *  I * N = N
     *  I * I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
     * of BigNumber(y, b).
     */
    P.multipliedBy = P.times = function (y, b) {
      var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
        base, sqrtBase,
        x = this,
        xc = x.c,
        yc = (y = new BigNumber(y, b)).c;

      // Either NaN, ±Infinity or ±0?
      if (!xc || !yc || !xc[0] || !yc[0]) {

        // Return NaN if either is NaN, or one is 0 and the other is Infinity.
        if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
          y.c = y.e = y.s = null;
        } else {
          y.s *= x.s;

          // Return ±Infinity if either is ±Infinity.
          if (!xc || !yc) {
            y.c = y.e = null;

          // Return ±0 if either is ±0.
          } else {
            y.c = [0];
            y.e = 0;
          }
        }

        return y;
      }

      e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
      y.s *= x.s;
      xcL = xc.length;
      ycL = yc.length;

      // Ensure xc points to longer array and xcL to its length.
      if (xcL < ycL) {
        zc = xc;
        xc = yc;
        yc = zc;
        i = xcL;
        xcL = ycL;
        ycL = i;
      }

      // Initialise the result array with zeros.
      for (i = xcL + ycL, zc = []; i--; zc.push(0));

      base = BASE;
      sqrtBase = SQRT_BASE;

      for (i = ycL; --i >= 0;) {
        c = 0;
        ylo = yc[i] % sqrtBase;
        yhi = yc[i] / sqrtBase | 0;

        for (k = xcL, j = i + k; j > i;) {
          xlo = xc[--k] % sqrtBase;
          xhi = xc[k] / sqrtBase | 0;
          m = yhi * xlo + xhi * ylo;
          xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
          c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
          zc[j--] = xlo % base;
        }

        zc[j] = c;
      }

      if (c) {
        ++e;
      } else {
        zc.splice(0, 1);
      }

      return normalise(y, zc, e);
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber negated,
     * i.e. multiplied by -1.
     */
    P.negated = function () {
      var x = new BigNumber(this);
      x.s = -x.s || null;
      return x;
    };


    /*
     *  n + 0 = n
     *  n + N = N
     *  n + I = I
     *  0 + n = n
     *  0 + 0 = 0
     *  0 + N = N
     *  0 + I = I
     *  N + n = N
     *  N + 0 = N
     *  N + N = N
     *  N + I = N
     *  I + n = I
     *  I + 0 = I
     *  I + N = N
     *  I + I = I
     *
     * Return a new BigNumber whose value is the value of this BigNumber plus the value of
     * BigNumber(y, b).
     */
    P.plus = function (y, b) {
      var t,
        x = this,
        a = x.s;

      y = new BigNumber(y, b);
      b = y.s;

      // Either NaN?
      if (!a || !b) return new BigNumber(NaN);

      // Signs differ?
       if (a != b) {
        y.s = -b;
        return x.minus(y);
      }

      var xe = x.e / LOG_BASE,
        ye = y.e / LOG_BASE,
        xc = x.c,
        yc = y.c;

      if (!xe || !ye) {

        // Return ±Infinity if either ±Infinity.
        if (!xc || !yc) return new BigNumber(a / 0);

        // Either zero?
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
      }

      xe = bitFloor(xe);
      ye = bitFloor(ye);
      xc = xc.slice();

      // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
      if (a = xe - ye) {
        if (a > 0) {
          ye = xe;
          t = yc;
        } else {
          a = -a;
          t = xc;
        }

        t.reverse();
        for (; a--; t.push(0));
        t.reverse();
      }

      a = xc.length;
      b = yc.length;

      // Point xc to the longer array, and b to the shorter length.
      if (a - b < 0) {
        t = yc;
        yc = xc;
        xc = t;
        b = a;
      }

      // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
      for (a = 0; b;) {
        a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
        xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
      }

      if (a) {
        xc = [a].concat(xc);
        ++ye;
      }

      // No need to check for zero, as +x + +y != 0 && -x + -y != 0
      // ye = MAX_EXP + 1 possible
      return normalise(y, xc, ye);
    };


    /*
     * If sd is undefined or null or true or false, return the number of significant digits of
     * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
     * If sd is true include integer-part trailing zeros in the count.
     *
     * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
     * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
     * ROUNDING_MODE if rm is omitted.
     *
     * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
     *                     boolean: whether to count integer-part trailing zeros: true or false.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.precision = P.sd = function (sd, rm) {
      var c, n, v,
        x = this;

      if (sd != null && sd !== !!sd) {
        intCheck(sd, 1, MAX);
        if (rm == null) rm = ROUNDING_MODE;
        else intCheck(rm, 0, 8);

        return round(new BigNumber(x), sd, rm);
      }

      if (!(c = x.c)) return null;
      v = c.length - 1;
      n = v * LOG_BASE + 1;

      if (v = c[v]) {

        // Subtract the number of trailing zeros of the last element.
        for (; v % 10 == 0; v /= 10, n--);

        // Add the number of digits of the first element.
        for (v = c[0]; v >= 10; v /= 10, n++);
      }

      if (sd && x.e + 1 > n) n = x.e + 1;

      return n;
    };


    /*
     * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
     * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
     *
     * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
     */
    P.shiftedBy = function (k) {
      intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
      return this.times('1e' + k);
    };


    /*
     *  sqrt(-n) =  N
     *  sqrt(N) =  N
     *  sqrt(-I) =  N
     *  sqrt(I) =  I
     *  sqrt(0) =  0
     *  sqrt(-0) = -0
     *
     * Return a new BigNumber whose value is the square root of the value of this BigNumber,
     * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
     */
    P.squareRoot = P.sqrt = function () {
      var m, n, r, rep, t,
        x = this,
        c = x.c,
        s = x.s,
        e = x.e,
        dp = DECIMAL_PLACES + 4,
        half = new BigNumber('0.5');

      // Negative/NaN/Infinity/zero?
      if (s !== 1 || !c || !c[0]) {
        return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
      }

      // Initial estimate.
      s = Math.sqrt(+valueOf(x));

      // Math.sqrt underflow/overflow?
      // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
      if (s == 0 || s == 1 / 0) {
        n = coeffToString(c);
        if ((n.length + e) % 2 == 0) n += '0';
        s = Math.sqrt(+n);
        e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

        if (s == 1 / 0) {
          n = '5e' + e;
        } else {
          n = s.toExponential();
          n = n.slice(0, n.indexOf('e') + 1) + e;
        }

        r = new BigNumber(n);
      } else {
        r = new BigNumber(s + '');
      }

      // Check for zero.
      // r could be zero if MIN_EXP is changed after the this value was created.
      // This would cause a division by zero (x/t) and hence Infinity below, which would cause
      // coeffToString to throw.
      if (r.c[0]) {
        e = r.e;
        s = e + dp;
        if (s < 3) s = 0;

        // Newton-Raphson iteration.
        for (; ;) {
          t = r;
          r = half.times(t.plus(div(x, t, dp, 1)));

          if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

            // The exponent of r may here be one less than the final result exponent,
            // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
            // are indexed correctly.
            if (r.e < e) --s;
            n = n.slice(s - 3, s + 1);

            // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
            // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
            // iteration.
            if (n == '9999' || !rep && n == '4999') {

              // On the first iteration only, check to see if rounding up gives the
              // exact result as the nines may infinitely repeat.
              if (!rep) {
                round(t, t.e + DECIMAL_PLACES + 2, 0);

                if (t.times(t).eq(x)) {
                  r = t;
                  break;
                }
              }

              dp += 4;
              s += 4;
              rep = 1;
            } else {

              // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
              // result. If not, then there are further digits and m will be truthy.
              if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

                // Truncate to the first rounding digit.
                round(r, r.e + DECIMAL_PLACES + 2, 1);
                m = !r.times(r).eq(x);
              }

              break;
            }
          }
        }
      }

      return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
    };


    /*
     * Return a string representing the value of this BigNumber in exponential notation and
     * rounded using ROUNDING_MODE to dp fixed decimal places.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toExponential = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp++;
      }
      return format(this, dp, rm, 1);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounding
     * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
     *
     * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
     * but e.g. (-0.00001).toFixed(0) is '-0'.
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     */
    P.toFixed = function (dp, rm) {
      if (dp != null) {
        intCheck(dp, 0, MAX);
        dp = dp + this.e + 1;
      }
      return format(this, dp, rm);
    };


    /*
     * Return a string representing the value of this BigNumber in fixed-point notation rounded
     * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
     * of the format or FORMAT object (see BigNumber.set).
     *
     * The formatting object may contain some or all of the properties shown below.
     *
     * FORMAT = {
     *   prefix: '',
     *   groupSize: 3,
     *   secondaryGroupSize: 0,
     *   groupSeparator: ',',
     *   decimalSeparator: '.',
     *   fractionGroupSize: 0,
     *   fractionGroupSeparator: '\xA0',      // non-breaking space
     *   suffix: ''
     * };
     *
     * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     * [format] {object} Formatting options. See FORMAT pbject above.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
     * '[BigNumber Error] Argument not an object: {format}'
     */
    P.toFormat = function (dp, rm, format) {
      var str,
        x = this;

      if (format == null) {
        if (dp != null && rm && typeof rm == 'object') {
          format = rm;
          rm = null;
        } else if (dp && typeof dp == 'object') {
          format = dp;
          dp = rm = null;
        } else {
          format = FORMAT;
        }
      } else if (typeof format != 'object') {
        throw Error
          (bignumberError + 'Argument not an object: ' + format);
      }

      str = x.toFixed(dp, rm);

      if (x.c) {
        var i,
          arr = str.split('.'),
          g1 = +format.groupSize,
          g2 = +format.secondaryGroupSize,
          groupSeparator = format.groupSeparator || '',
          intPart = arr[0],
          fractionPart = arr[1],
          isNeg = x.s < 0,
          intDigits = isNeg ? intPart.slice(1) : intPart,
          len = intDigits.length;

        if (g2) {
          i = g1;
          g1 = g2;
          g2 = i;
          len -= i;
        }

        if (g1 > 0 && len > 0) {
          i = len % g1 || g1;
          intPart = intDigits.substr(0, i);
          for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
          if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
          if (isNeg) intPart = '-' + intPart;
        }

        str = fractionPart
         ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
          ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
           '$&' + (format.fractionGroupSeparator || ''))
          : fractionPart)
         : intPart;
      }

      return (format.prefix || '') + str + (format.suffix || '');
    };


    /*
     * Return an array of two BigNumbers representing the value of this BigNumber as a simple
     * fraction with an integer numerator and an integer denominator.
     * The denominator will be a positive non-zero value less than or equal to the specified
     * maximum denominator. If a maximum denominator is not specified, the denominator will be
     * the lowest value necessary to represent the number exactly.
     *
     * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
     *
     * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
     */
    P.toFraction = function (md) {
      var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
        x = this,
        xc = x.c;

      if (md != null) {
        n = new BigNumber(md);

        // Throw if md is less than one or is not an integer, unless it is Infinity.
        if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
          throw Error
            (bignumberError + 'Argument ' +
              (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
        }
      }

      if (!xc) return new BigNumber(x);

      d = new BigNumber(ONE);
      n1 = d0 = new BigNumber(ONE);
      d1 = n0 = new BigNumber(ONE);
      s = coeffToString(xc);

      // Determine initial denominator.
      // d is a power of 10 and the minimum max denominator that specifies the value exactly.
      e = d.e = s.length - x.e - 1;
      d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
      md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

      exp = MAX_EXP;
      MAX_EXP = 1 / 0;
      n = new BigNumber(s);

      // n0 = d1 = 0
      n0.c[0] = 0;

      for (; ;)  {
        q = div(n, d, 0, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.comparedTo(md) == 1) break;
        d0 = d1;
        d1 = d2;
        n1 = n0.plus(q.times(d2 = n1));
        n0 = d2;
        d = n.minus(q.times(d2 = d));
        n = d2;
      }

      d2 = div(md.minus(d0), d1, 0, 1);
      n0 = n0.plus(d2.times(n1));
      d0 = d0.plus(d2.times(d1));
      n0.s = n1.s = x.s;
      e = e * 2;

      // Determine which fraction is closer to x, n0/d0 or n1/d1
      r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
          div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

      MAX_EXP = exp;

      return r;
    };


    /*
     * Return the value of this BigNumber converted to a number primitive.
     */
    P.toNumber = function () {
      return +valueOf(this);
    };


    /*
     * Return a string representing the value of this BigNumber rounded to sd significant digits
     * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
     * necessary to represent the integer part of the value in fixed-point notation, then use
     * exponential notation.
     *
     * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
     *
     * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
     */
    P.toPrecision = function (sd, rm) {
      if (sd != null) intCheck(sd, 1, MAX);
      return format(this, sd, rm, 2);
    };


    /*
     * Return a string representing the value of this BigNumber in base b, or base 10 if b is
     * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
     * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
     * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
     * TO_EXP_NEG, return exponential notation.
     *
     * [b] {number} Integer, 2 to ALPHABET.length inclusive.
     *
     * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
     */
    P.toString = function (b) {
      var str,
        n = this,
        s = n.s,
        e = n.e;

      // Infinity or NaN?
      if (e === null) {
        if (s) {
          str = 'Infinity';
          if (s < 0) str = '-' + str;
        } else {
          str = 'NaN';
        }
      } else {
        if (b == null) {
          str = e <= TO_EXP_NEG || e >= TO_EXP_POS
           ? toExponential(coeffToString(n.c), e)
           : toFixedPoint(coeffToString(n.c), e, '0');
        } else if (b === 10 && alphabetHasNormalDecimalDigits) {
          n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
          str = toFixedPoint(coeffToString(n.c), n.e, '0');
        } else {
          intCheck(b, 2, ALPHABET.length, 'Base');
          str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
        }

        if (s < 0 && n.c[0]) str = '-' + str;
      }

      return str;
    };


    /*
     * Return as toString, but do not accept a base argument, and include the minus sign for
     * negative zero.
     */
    P.valueOf = P.toJSON = function () {
      return valueOf(this);
    };


    P._isBigNumber = true;

    if (configObject != null) BigNumber.set(configObject);

    return BigNumber;
  }


  // PRIVATE HELPER FUNCTIONS

  // These functions don't need access to variables,
  // e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


  function bitFloor(n) {
    var i = n | 0;
    return n > 0 || n === i ? i : i - 1;
  }


  // Return a coefficient array as a string of base 10 digits.
  function coeffToString(a) {
    var s, z,
      i = 1,
      j = a.length,
      r = a[0] + '';

    for (; i < j;) {
      s = a[i++] + '';
      z = LOG_BASE - s.length;
      for (; z--; s = '0' + s);
      r += s;
    }

    // Determine trailing zeros.
    for (j = r.length; r.charCodeAt(--j) === 48;);

    return r.slice(0, j + 1 || 1);
  }


  // Compare the value of BigNumbers x and y.
  function compare(x, y) {
    var a, b,
      xc = x.c,
      yc = y.c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    // Either NaN?
    if (!i || !j) return null;

    a = xc && !xc[0];
    b = yc && !yc[0];

    // Either zero?
    if (a || b) return a ? b ? 0 : -j : i;

    // Signs differ?
    if (i != j) return i;

    a = i < 0;
    b = k == l;

    // Either Infinity?
    if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

    // Compare exponents.
    if (!b) return k > l ^ a ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    // Compare digit by digit.
    for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

    // Compare lengths.
    return k == l ? 0 : k > l ^ a ? 1 : -1;
  }


  /*
   * Check that n is a primitive number, an integer, and in range, otherwise throw.
   */
  function intCheck(n, min, max, name) {
    if (n < min || n > max || n !== mathfloor(n)) {
      throw Error
       (bignumberError + (name || 'Argument') + (typeof n == 'number'
         ? n < min || n > max ? ' out of range: ' : ' not an integer: '
         : ' not a primitive number: ') + String(n));
    }
  }


  // Assumes finite n.
  function isOdd(n) {
    var k = n.c.length - 1;
    return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
  }


  function toExponential(str, e) {
    return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
     (e < 0 ? 'e' : 'e+') + e;
  }


  function toFixedPoint(str, e, z) {
    var len, zs;

    // Negative exponent?
    if (e < 0) {

      // Prepend zeros.
      for (zs = z + '.'; ++e; zs += z);
      str = zs + str;

    // Positive exponent
    } else {
      len = str.length;

      // Append zeros.
      if (++e > len) {
        for (zs = z, e -= len; --e; zs += z);
        str += zs;
      } else if (e < len) {
        str = str.slice(0, e) + '.' + str.slice(e);
      }
    }

    return str;
  }


  // EXPORT


  BigNumber = clone();
  BigNumber['default'] = BigNumber.BigNumber = BigNumber;

  // AMD.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return BigNumber; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

  // Node.js and other environments that support module.exports.
  } else {}
})(this);


/***/ }),

/***/ "./node_modules/borc/node_modules/buffer/index.js":
/*!********************************************************!*\
  !*** ./node_modules/borc/node_modules/buffer/index.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()


/***/ }),

/***/ "./node_modules/borc/src/constants.js":
/*!********************************************!*\
  !*** ./node_modules/borc/src/constants.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const Bignumber = (__webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js").BigNumber)

exports.MT = {
  POS_INT: 0,
  NEG_INT: 1,
  BYTE_STRING: 2,
  UTF8_STRING: 3,
  ARRAY: 4,
  MAP: 5,
  TAG: 6,
  SIMPLE_FLOAT: 7
}

exports.TAG = {
  DATE_STRING: 0,
  DATE_EPOCH: 1,
  POS_BIGINT: 2,
  NEG_BIGINT: 3,
  DECIMAL_FRAC: 4,
  BIGFLOAT: 5,
  BASE64URL_EXPECTED: 21,
  BASE64_EXPECTED: 22,
  BASE16_EXPECTED: 23,
  CBOR: 24,
  URI: 32,
  BASE64URL: 33,
  BASE64: 34,
  REGEXP: 35,
  MIME: 36
}

exports.NUMBYTES = {
  ZERO: 0,
  ONE: 24,
  TWO: 25,
  FOUR: 26,
  EIGHT: 27,
  INDEFINITE: 31
}

exports.SIMPLE = {
  FALSE: 20,
  TRUE: 21,
  NULL: 22,
  UNDEFINED: 23
}

exports.SYMS = {
  NULL: Symbol('null'),
  UNDEFINED: Symbol('undef'),
  PARENT: Symbol('parent'),
  BREAK: Symbol('break'),
  STREAM: Symbol('stream')
}

exports.SHIFT32 = Math.pow(2, 32)
exports.SHIFT16 = Math.pow(2, 16)

exports.MAX_SAFE_HIGH = 0x1fffff
exports.NEG_ONE = new Bignumber(-1)
exports.TEN = new Bignumber(10)
exports.TWO = new Bignumber(2)

exports.PARENT = {
  ARRAY: 0,
  OBJECT: 1,
  MAP: 2,
  TAG: 3,
  BYTE_STRING: 4,
  UTF8_STRING: 5
}


/***/ }),

/***/ "./node_modules/borc/src/decoder.asm.js":
/*!**********************************************!*\
  !*** ./node_modules/borc/src/decoder.asm.js ***!
  \**********************************************/
/***/ ((module) => {

/* eslint-disable */

module.exports = function decodeAsm (stdlib, foreign, buffer) {
  'use asm'

  // -- Imports

  var heap = new stdlib.Uint8Array(buffer)
  // var log = foreign.log
  var pushInt = foreign.pushInt
  var pushInt32 = foreign.pushInt32
  var pushInt32Neg = foreign.pushInt32Neg
  var pushInt64 = foreign.pushInt64
  var pushInt64Neg = foreign.pushInt64Neg
  var pushFloat = foreign.pushFloat
  var pushFloatSingle = foreign.pushFloatSingle
  var pushFloatDouble = foreign.pushFloatDouble
  var pushTrue = foreign.pushTrue
  var pushFalse = foreign.pushFalse
  var pushUndefined = foreign.pushUndefined
  var pushNull = foreign.pushNull
  var pushInfinity = foreign.pushInfinity
  var pushInfinityNeg = foreign.pushInfinityNeg
  var pushNaN = foreign.pushNaN
  var pushNaNNeg = foreign.pushNaNNeg

  var pushArrayStart = foreign.pushArrayStart
  var pushArrayStartFixed = foreign.pushArrayStartFixed
  var pushArrayStartFixed32 = foreign.pushArrayStartFixed32
  var pushArrayStartFixed64 = foreign.pushArrayStartFixed64
  var pushObjectStart = foreign.pushObjectStart
  var pushObjectStartFixed = foreign.pushObjectStartFixed
  var pushObjectStartFixed32 = foreign.pushObjectStartFixed32
  var pushObjectStartFixed64 = foreign.pushObjectStartFixed64

  var pushByteString = foreign.pushByteString
  var pushByteStringStart = foreign.pushByteStringStart
  var pushUtf8String = foreign.pushUtf8String
  var pushUtf8StringStart = foreign.pushUtf8StringStart

  var pushSimpleUnassigned = foreign.pushSimpleUnassigned

  var pushTagStart = foreign.pushTagStart
  var pushTagStart4 = foreign.pushTagStart4
  var pushTagStart8 = foreign.pushTagStart8
  var pushTagUnassigned = foreign.pushTagUnassigned

  var pushBreak = foreign.pushBreak

  var pow = stdlib.Math.pow

  // -- Constants


  // -- Mutable Variables

  var offset = 0
  var inputLength = 0
  var code = 0

  // Decode a cbor string represented as Uint8Array
  // which is allocated on the heap from 0 to inputLength
  //
  // input - Int
  //
  // Returns Code - Int,
  // Success = 0
  // Error > 0
  function parse (input) {
    input = input | 0

    offset = 0
    inputLength = input

    while ((offset | 0) < (inputLength | 0)) {
      code = jumpTable[heap[offset] & 255](heap[offset] | 0) | 0

      if ((code | 0) > 0) {
        break
      }
    }

    return code | 0
  }

  // -- Helper Function

  function checkOffset (n) {
    n = n | 0

    if ((((offset | 0) + (n | 0)) | 0) < (inputLength | 0)) {
      return 0
    }

    return 1
  }

  function readUInt16 (n) {
    n = n | 0

    return (
      (heap[n | 0] << 8) | heap[(n + 1) | 0]
    ) | 0
  }

  function readUInt32 (n) {
    n = n | 0

    return (
      (heap[n | 0] << 24) | (heap[(n + 1) | 0] << 16) | (heap[(n + 2) | 0] << 8) | heap[(n + 3) | 0]
    ) | 0
  }

  // -- Initial Byte Handlers

  function INT_P (octet) {
    octet = octet | 0

    pushInt(octet | 0)

    offset = (offset + 1) | 0

    return 0
  }

  function UINT_P_8 (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushInt(heap[(offset + 1) | 0] | 0)

    offset = (offset + 2) | 0

    return 0
  }

  function UINT_P_16 (octet) {
    octet = octet | 0

    if (checkOffset(2) | 0) {
      return 1
    }

    pushInt(
      readUInt16((offset + 1) | 0) | 0
    )

    offset = (offset + 3) | 0

    return 0
  }

  function UINT_P_32 (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushInt32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    )

    offset = (offset + 5) | 0

    return 0
  }

  function UINT_P_64 (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushInt64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    )

    offset = (offset + 9) | 0

    return 0
  }

  function INT_N (octet) {
    octet = octet | 0

    pushInt((-1 - ((octet - 32) | 0)) | 0)

    offset = (offset + 1) | 0

    return 0
  }

  function UINT_N_8 (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushInt(
      (-1 - (heap[(offset + 1) | 0] | 0)) | 0
    )

    offset = (offset + 2) | 0

    return 0
  }

  function UINT_N_16 (octet) {
    octet = octet | 0

    var val = 0

    if (checkOffset(2) | 0) {
      return 1
    }

    val = readUInt16((offset + 1) | 0) | 0
    pushInt((-1 - (val | 0)) | 0)

    offset = (offset + 3) | 0

    return 0
  }

  function UINT_N_32 (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushInt32Neg(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    )

    offset = (offset + 5) | 0

    return 0
  }

  function UINT_N_64 (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushInt64Neg(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    )

    offset = (offset + 9) | 0

    return 0
  }

  function BYTE_STRING (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var step = 0

    step = (octet - 64) | 0
    if (checkOffset(step | 0) | 0) {
      return 1
    }

    start = (offset + 1) | 0
    end = (((offset + 1) | 0) + (step | 0)) | 0

    pushByteString(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function BYTE_STRING_8 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(1) | 0) {
      return 1
    }

    length = heap[(offset + 1) | 0] | 0
    start = (offset + 2) | 0
    end = (((offset + 2) | 0) + (length | 0)) | 0

    if (checkOffset((length + 1) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function BYTE_STRING_16 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(2) | 0) {
      return 1
    }

    length = readUInt16((offset + 1) | 0) | 0
    start = (offset + 3) | 0
    end = (((offset + 3) | 0) + (length | 0)) | 0


    if (checkOffset((length + 2) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function BYTE_STRING_32 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(4) | 0) {
      return 1
    }

    length = readUInt32((offset + 1) | 0) | 0
    start = (offset + 5) | 0
    end = (((offset + 5) | 0) + (length | 0)) | 0


    if (checkOffset((length + 4) | 0) | 0) {
      return 1
    }

    pushByteString(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function BYTE_STRING_64 (octet) {
    // NOT IMPLEMENTED
    octet = octet | 0

    return 1
  }

  function BYTE_STRING_BREAK (octet) {
    octet = octet | 0

    pushByteStringStart()

    offset = (offset + 1) | 0

    return 0
  }

  function UTF8_STRING (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var step = 0

    step = (octet - 96) | 0

    if (checkOffset(step | 0) | 0) {
      return 1
    }

    start = (offset + 1) | 0
    end = (((offset + 1) | 0) + (step | 0)) | 0

    pushUtf8String(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function UTF8_STRING_8 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(1) | 0) {
      return 1
    }

    length = heap[(offset + 1) | 0] | 0
    start = (offset + 2) | 0
    end = (((offset + 2) | 0) + (length | 0)) | 0

    if (checkOffset((length + 1) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function UTF8_STRING_16 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(2) | 0) {
      return 1
    }

    length = readUInt16((offset + 1) | 0) | 0
    start = (offset + 3) | 0
    end = (((offset + 3) | 0) + (length | 0)) | 0

    if (checkOffset((length + 2) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function UTF8_STRING_32 (octet) {
    octet = octet | 0

    var start = 0
    var end = 0
    var length = 0

    if (checkOffset(4) | 0) {
      return 1
    }

    length = readUInt32((offset + 1) | 0) | 0
    start = (offset + 5) | 0
    end = (((offset + 5) | 0) + (length | 0)) | 0

    if (checkOffset((length + 4) | 0) | 0) {
      return 1
    }

    pushUtf8String(start | 0, end | 0)

    offset = end | 0

    return 0
  }

  function UTF8_STRING_64 (octet) {
    // NOT IMPLEMENTED
    octet = octet | 0

    return 1
  }

  function UTF8_STRING_BREAK (octet) {
    octet = octet | 0

    pushUtf8StringStart()

    offset = (offset + 1) | 0

    return 0
  }

  function ARRAY (octet) {
    octet = octet | 0

    pushArrayStartFixed((octet - 128) | 0)

    offset = (offset + 1) | 0

    return 0
  }

  function ARRAY_8 (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushArrayStartFixed(heap[(offset + 1) | 0] | 0)

    offset = (offset + 2) | 0

    return 0
  }

  function ARRAY_16 (octet) {
    octet = octet | 0

    if (checkOffset(2) | 0) {
      return 1
    }

    pushArrayStartFixed(
      readUInt16((offset + 1) | 0) | 0
    )

    offset = (offset + 3) | 0

    return 0
  }

  function ARRAY_32 (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushArrayStartFixed32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    )

    offset = (offset + 5) | 0

    return 0
  }

  function ARRAY_64 (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushArrayStartFixed64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    )

    offset = (offset + 9) | 0

    return 0
  }

  function ARRAY_BREAK (octet) {
    octet = octet | 0

    pushArrayStart()

    offset = (offset + 1) | 0

    return 0
  }

  function MAP (octet) {
    octet = octet | 0

    var step = 0

    step = (octet - 160) | 0

    if (checkOffset(step | 0) | 0) {
      return 1
    }

    pushObjectStartFixed(step | 0)

    offset = (offset + 1) | 0

    return 0
  }

  function MAP_8 (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushObjectStartFixed(heap[(offset + 1) | 0] | 0)

    offset = (offset + 2) | 0

    return 0
  }

  function MAP_16 (octet) {
    octet = octet | 0

    if (checkOffset(2) | 0) {
      return 1
    }

    pushObjectStartFixed(
      readUInt16((offset + 1) | 0) | 0
    )

    offset = (offset + 3) | 0

    return 0
  }

  function MAP_32 (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushObjectStartFixed32(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    )

    offset = (offset + 5) | 0

    return 0
  }

  function MAP_64 (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushObjectStartFixed64(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    )

    offset = (offset + 9) | 0

    return 0
  }

  function MAP_BREAK (octet) {
    octet = octet | 0

    pushObjectStart()

    offset = (offset + 1) | 0

    return 0
  }

  function TAG_KNOWN (octet) {
    octet = octet | 0

    pushTagStart((octet - 192| 0) | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BIGNUM_POS (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BIGNUM_NEG (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_FRAC (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BIGNUM_FLOAT (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_UNASSIGNED (octet) {
    octet = octet | 0

    pushTagStart((octet - 192| 0) | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BASE64_URL (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BASE64 (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_BASE16 (octet) {
    octet = octet | 0

    pushTagStart(octet | 0)

    offset = (offset + 1 | 0)

    return 0
  }

  function TAG_MORE_1 (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushTagStart(heap[(offset + 1) | 0] | 0)

    offset = (offset + 2 | 0)

    return 0
  }

  function TAG_MORE_2 (octet) {
    octet = octet | 0

    if (checkOffset(2) | 0) {
      return 1
    }

    pushTagStart(
      readUInt16((offset + 1) | 0) | 0
    )

    offset = (offset + 3 | 0)

    return 0
  }

  function TAG_MORE_4 (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushTagStart4(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0
    )

    offset = (offset + 5 | 0)

    return 0
  }

  function TAG_MORE_8 (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushTagStart8(
      readUInt16((offset + 1) | 0) | 0,
      readUInt16((offset + 3) | 0) | 0,
      readUInt16((offset + 5) | 0) | 0,
      readUInt16((offset + 7) | 0) | 0
    )

    offset = (offset + 9 | 0)

    return 0
  }

  function SIMPLE_UNASSIGNED (octet) {
    octet = octet | 0

    pushSimpleUnassigned(((octet | 0) - 224) | 0)

    offset = (offset + 1) | 0

    return 0
  }

  function SIMPLE_FALSE (octet) {
    octet = octet | 0

    pushFalse()

    offset = (offset + 1) | 0

    return 0
  }

  function SIMPLE_TRUE (octet) {
    octet = octet | 0

    pushTrue()

    offset = (offset + 1) | 0

    return 0
  }

  function SIMPLE_NULL (octet) {
    octet = octet | 0

    pushNull()

    offset = (offset + 1) | 0

    return 0
  }

  function SIMPLE_UNDEFINED (octet) {
    octet = octet | 0

    pushUndefined()

    offset = (offset + 1) | 0

    return 0
  }

  function SIMPLE_BYTE (octet) {
    octet = octet | 0

    if (checkOffset(1) | 0) {
      return 1
    }

    pushSimpleUnassigned(heap[(offset + 1) | 0] | 0)

    offset = (offset + 2)  | 0

    return 0
  }

  function SIMPLE_FLOAT_HALF (octet) {
    octet = octet | 0

    var f = 0
    var g = 0
    var sign = 1.0
    var exp = 0.0
    var mant = 0.0
    var r = 0.0
    if (checkOffset(2) | 0) {
      return 1
    }

    f = heap[(offset + 1) | 0] | 0
    g = heap[(offset + 2) | 0] | 0

    if ((f | 0) & 0x80) {
      sign = -1.0
    }

    exp = +(((f | 0) & 0x7C) >> 2)
    mant = +((((f | 0) & 0x03) << 8) | g)

    if (+exp == 0.0) {
      pushFloat(+(
        (+sign) * +5.9604644775390625e-8 * (+mant)
      ))
    } else if (+exp == 31.0) {
      if (+sign == 1.0) {
        if (+mant > 0.0) {
          pushNaN()
        } else {
          pushInfinity()
        }
      } else {
        if (+mant > 0.0) {
          pushNaNNeg()
        } else {
          pushInfinityNeg()
        }
      }
    } else {
      pushFloat(+(
        +sign * pow(+2, +(+exp - 25.0)) * +(1024.0 + mant)
      ))
    }

    offset = (offset + 3) | 0

    return 0
  }

  function SIMPLE_FLOAT_SINGLE (octet) {
    octet = octet | 0

    if (checkOffset(4) | 0) {
      return 1
    }

    pushFloatSingle(
      heap[(offset + 1) | 0] | 0,
      heap[(offset + 2) | 0] | 0,
      heap[(offset + 3) | 0] | 0,
      heap[(offset + 4) | 0] | 0
    )

    offset = (offset + 5) | 0

    return 0
  }

  function SIMPLE_FLOAT_DOUBLE (octet) {
    octet = octet | 0

    if (checkOffset(8) | 0) {
      return 1
    }

    pushFloatDouble(
      heap[(offset + 1) | 0] | 0,
      heap[(offset + 2) | 0] | 0,
      heap[(offset + 3) | 0] | 0,
      heap[(offset + 4) | 0] | 0,
      heap[(offset + 5) | 0] | 0,
      heap[(offset + 6) | 0] | 0,
      heap[(offset + 7) | 0] | 0,
      heap[(offset + 8) | 0] | 0
    )

    offset = (offset + 9) | 0

    return 0
  }

  function ERROR (octet) {
    octet = octet | 0

    return 1
  }

  function BREAK (octet) {
    octet = octet | 0

    pushBreak()

    offset = (offset + 1) | 0

    return 0
  }

  // -- Jump Table

  var jumpTable = [
    // Integer 0x00..0x17 (0..23)
    INT_P, // 0x00
    INT_P, // 0x01
    INT_P, // 0x02
    INT_P, // 0x03
    INT_P, // 0x04
    INT_P, // 0x05
    INT_P, // 0x06
    INT_P, // 0x07
    INT_P, // 0x08
    INT_P, // 0x09
    INT_P, // 0x0A
    INT_P, // 0x0B
    INT_P, // 0x0C
    INT_P, // 0x0D
    INT_P, // 0x0E
    INT_P, // 0x0F
    INT_P, // 0x10
    INT_P, // 0x11
    INT_P, // 0x12
    INT_P, // 0x13
    INT_P, // 0x14
    INT_P, // 0x15
    INT_P, // 0x16
    INT_P, // 0x17
    // Unsigned integer (one-byte uint8_t follows)
    UINT_P_8, // 0x18
    // Unsigned integer (two-byte uint16_t follows)
    UINT_P_16, // 0x19
    // Unsigned integer (four-byte uint32_t follows)
    UINT_P_32, // 0x1a
    // Unsigned integer (eight-byte uint64_t follows)
    UINT_P_64, // 0x1b
    ERROR, // 0x1c
    ERROR, // 0x1d
    ERROR, // 0x1e
    ERROR, // 0x1f
    // Negative integer -1-0x00..-1-0x17 (-1..-24)
    INT_N, // 0x20
    INT_N, // 0x21
    INT_N, // 0x22
    INT_N, // 0x23
    INT_N, // 0x24
    INT_N, // 0x25
    INT_N, // 0x26
    INT_N, // 0x27
    INT_N, // 0x28
    INT_N, // 0x29
    INT_N, // 0x2A
    INT_N, // 0x2B
    INT_N, // 0x2C
    INT_N, // 0x2D
    INT_N, // 0x2E
    INT_N, // 0x2F
    INT_N, // 0x30
    INT_N, // 0x31
    INT_N, // 0x32
    INT_N, // 0x33
    INT_N, // 0x34
    INT_N, // 0x35
    INT_N, // 0x36
    INT_N, // 0x37
    // Negative integer -1-n (one-byte uint8_t for n follows)
    UINT_N_8, // 0x38
    // Negative integer -1-n (two-byte uint16_t for n follows)
    UINT_N_16, // 0x39
    // Negative integer -1-n (four-byte uint32_t for nfollows)
    UINT_N_32, // 0x3a
    // Negative integer -1-n (eight-byte uint64_t for n follows)
    UINT_N_64, // 0x3b
    ERROR, // 0x3c
    ERROR, // 0x3d
    ERROR, // 0x3e
    ERROR, // 0x3f
    // byte string (0x00..0x17 bytes follow)
    BYTE_STRING, // 0x40
    BYTE_STRING, // 0x41
    BYTE_STRING, // 0x42
    BYTE_STRING, // 0x43
    BYTE_STRING, // 0x44
    BYTE_STRING, // 0x45
    BYTE_STRING, // 0x46
    BYTE_STRING, // 0x47
    BYTE_STRING, // 0x48
    BYTE_STRING, // 0x49
    BYTE_STRING, // 0x4A
    BYTE_STRING, // 0x4B
    BYTE_STRING, // 0x4C
    BYTE_STRING, // 0x4D
    BYTE_STRING, // 0x4E
    BYTE_STRING, // 0x4F
    BYTE_STRING, // 0x50
    BYTE_STRING, // 0x51
    BYTE_STRING, // 0x52
    BYTE_STRING, // 0x53
    BYTE_STRING, // 0x54
    BYTE_STRING, // 0x55
    BYTE_STRING, // 0x56
    BYTE_STRING, // 0x57
    // byte string (one-byte uint8_t for n, and then n bytes follow)
    BYTE_STRING_8, // 0x58
    // byte string (two-byte uint16_t for n, and then n bytes follow)
    BYTE_STRING_16, // 0x59
    // byte string (four-byte uint32_t for n, and then n bytes follow)
    BYTE_STRING_32, // 0x5a
    // byte string (eight-byte uint64_t for n, and then n bytes follow)
    BYTE_STRING_64, // 0x5b
    ERROR, // 0x5c
    ERROR, // 0x5d
    ERROR, // 0x5e
    // byte string, byte strings follow, terminated by "break"
    BYTE_STRING_BREAK, // 0x5f
    // UTF-8 string (0x00..0x17 bytes follow)
    UTF8_STRING, // 0x60
    UTF8_STRING, // 0x61
    UTF8_STRING, // 0x62
    UTF8_STRING, // 0x63
    UTF8_STRING, // 0x64
    UTF8_STRING, // 0x65
    UTF8_STRING, // 0x66
    UTF8_STRING, // 0x67
    UTF8_STRING, // 0x68
    UTF8_STRING, // 0x69
    UTF8_STRING, // 0x6A
    UTF8_STRING, // 0x6B
    UTF8_STRING, // 0x6C
    UTF8_STRING, // 0x6D
    UTF8_STRING, // 0x6E
    UTF8_STRING, // 0x6F
    UTF8_STRING, // 0x70
    UTF8_STRING, // 0x71
    UTF8_STRING, // 0x72
    UTF8_STRING, // 0x73
    UTF8_STRING, // 0x74
    UTF8_STRING, // 0x75
    UTF8_STRING, // 0x76
    UTF8_STRING, // 0x77
    // UTF-8 string (one-byte uint8_t for n, and then n bytes follow)
    UTF8_STRING_8, // 0x78
    // UTF-8 string (two-byte uint16_t for n, and then n bytes follow)
    UTF8_STRING_16, // 0x79
    // UTF-8 string (four-byte uint32_t for n, and then n bytes follow)
    UTF8_STRING_32, // 0x7a
    // UTF-8 string (eight-byte uint64_t for n, and then n bytes follow)
    UTF8_STRING_64, // 0x7b
    // UTF-8 string, UTF-8 strings follow, terminated by "break"
    ERROR, // 0x7c
    ERROR, // 0x7d
    ERROR, // 0x7e
    UTF8_STRING_BREAK, // 0x7f
    // array (0x00..0x17 data items follow)
    ARRAY, // 0x80
    ARRAY, // 0x81
    ARRAY, // 0x82
    ARRAY, // 0x83
    ARRAY, // 0x84
    ARRAY, // 0x85
    ARRAY, // 0x86
    ARRAY, // 0x87
    ARRAY, // 0x88
    ARRAY, // 0x89
    ARRAY, // 0x8A
    ARRAY, // 0x8B
    ARRAY, // 0x8C
    ARRAY, // 0x8D
    ARRAY, // 0x8E
    ARRAY, // 0x8F
    ARRAY, // 0x90
    ARRAY, // 0x91
    ARRAY, // 0x92
    ARRAY, // 0x93
    ARRAY, // 0x94
    ARRAY, // 0x95
    ARRAY, // 0x96
    ARRAY, // 0x97
    // array (one-byte uint8_t fo, and then n data items follow)
    ARRAY_8, // 0x98
    // array (two-byte uint16_t for n, and then n data items follow)
    ARRAY_16, // 0x99
    // array (four-byte uint32_t for n, and then n data items follow)
    ARRAY_32, // 0x9a
    // array (eight-byte uint64_t for n, and then n data items follow)
    ARRAY_64, // 0x9b
    // array, data items follow, terminated by "break"
    ERROR, // 0x9c
    ERROR, // 0x9d
    ERROR, // 0x9e
    ARRAY_BREAK, // 0x9f
    // map (0x00..0x17 pairs of data items follow)
    MAP, // 0xa0
    MAP, // 0xa1
    MAP, // 0xa2
    MAP, // 0xa3
    MAP, // 0xa4
    MAP, // 0xa5
    MAP, // 0xa6
    MAP, // 0xa7
    MAP, // 0xa8
    MAP, // 0xa9
    MAP, // 0xaA
    MAP, // 0xaB
    MAP, // 0xaC
    MAP, // 0xaD
    MAP, // 0xaE
    MAP, // 0xaF
    MAP, // 0xb0
    MAP, // 0xb1
    MAP, // 0xb2
    MAP, // 0xb3
    MAP, // 0xb4
    MAP, // 0xb5
    MAP, // 0xb6
    MAP, // 0xb7
    // map (one-byte uint8_t for n, and then n pairs of data items follow)
    MAP_8, // 0xb8
    // map (two-byte uint16_t for n, and then n pairs of data items follow)
    MAP_16, // 0xb9
    // map (four-byte uint32_t for n, and then n pairs of data items follow)
    MAP_32, // 0xba
    // map (eight-byte uint64_t for n, and then n pairs of data items follow)
    MAP_64, // 0xbb
    ERROR, // 0xbc
    ERROR, // 0xbd
    ERROR, // 0xbe
    // map, pairs of data items follow, terminated by "break"
    MAP_BREAK, // 0xbf
    // Text-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN, // 0xc0
    // Epoch-based date/time (data item follows; see Section 2.4.1)
    TAG_KNOWN, // 0xc1
    // Positive bignum (data item "byte string" follows)
    TAG_KNOWN, // 0xc2
    // Negative bignum (data item "byte string" follows)
    TAG_KNOWN, // 0xc3
    // Decimal Fraction (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN, // 0xc4
    // Bigfloat (data item "array" follows; see Section 2.4.3)
    TAG_KNOWN, // 0xc5
    // (tagged item)
    TAG_UNASSIGNED, // 0xc6
    TAG_UNASSIGNED, // 0xc7
    TAG_UNASSIGNED, // 0xc8
    TAG_UNASSIGNED, // 0xc9
    TAG_UNASSIGNED, // 0xca
    TAG_UNASSIGNED, // 0xcb
    TAG_UNASSIGNED, // 0xcc
    TAG_UNASSIGNED, // 0xcd
    TAG_UNASSIGNED, // 0xce
    TAG_UNASSIGNED, // 0xcf
    TAG_UNASSIGNED, // 0xd0
    TAG_UNASSIGNED, // 0xd1
    TAG_UNASSIGNED, // 0xd2
    TAG_UNASSIGNED, // 0xd3
    TAG_UNASSIGNED, // 0xd4
    // Expected Conversion (data item follows; see Section 2.4.4.2)
    TAG_UNASSIGNED, // 0xd5
    TAG_UNASSIGNED, // 0xd6
    TAG_UNASSIGNED, // 0xd7
    // (more tagged items, 1/2/4/8 bytes and then a data item follow)
    TAG_MORE_1, // 0xd8
    TAG_MORE_2, // 0xd9
    TAG_MORE_4, // 0xda
    TAG_MORE_8, // 0xdb
    ERROR, // 0xdc
    ERROR, // 0xdd
    ERROR, // 0xde
    ERROR, // 0xdf
    // (simple value)
    SIMPLE_UNASSIGNED, // 0xe0
    SIMPLE_UNASSIGNED, // 0xe1
    SIMPLE_UNASSIGNED, // 0xe2
    SIMPLE_UNASSIGNED, // 0xe3
    SIMPLE_UNASSIGNED, // 0xe4
    SIMPLE_UNASSIGNED, // 0xe5
    SIMPLE_UNASSIGNED, // 0xe6
    SIMPLE_UNASSIGNED, // 0xe7
    SIMPLE_UNASSIGNED, // 0xe8
    SIMPLE_UNASSIGNED, // 0xe9
    SIMPLE_UNASSIGNED, // 0xea
    SIMPLE_UNASSIGNED, // 0xeb
    SIMPLE_UNASSIGNED, // 0xec
    SIMPLE_UNASSIGNED, // 0xed
    SIMPLE_UNASSIGNED, // 0xee
    SIMPLE_UNASSIGNED, // 0xef
    SIMPLE_UNASSIGNED, // 0xf0
    SIMPLE_UNASSIGNED, // 0xf1
    SIMPLE_UNASSIGNED, // 0xf2
    SIMPLE_UNASSIGNED, // 0xf3
    // False
    SIMPLE_FALSE, // 0xf4
    // True
    SIMPLE_TRUE, // 0xf5
    // Null
    SIMPLE_NULL, // 0xf6
    // Undefined
    SIMPLE_UNDEFINED, // 0xf7
    // (simple value, one byte follows)
    SIMPLE_BYTE, // 0xf8
    // Half-Precision Float (two-byte IEEE 754)
    SIMPLE_FLOAT_HALF, // 0xf9
    // Single-Precision Float (four-byte IEEE 754)
    SIMPLE_FLOAT_SINGLE, // 0xfa
    // Double-Precision Float (eight-byte IEEE 754)
    SIMPLE_FLOAT_DOUBLE, // 0xfb
    ERROR, // 0xfc
    ERROR, // 0xfd
    ERROR, // 0xfe
    // "break" stop code
    BREAK // 0xff
  ]

  // --

  return {
    parse: parse
  }
}


/***/ }),

/***/ "./node_modules/borc/src/decoder.js":
/*!******************************************!*\
  !*** ./node_modules/borc/src/decoder.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Buffer } = __webpack_require__(/*! buffer */ "./node_modules/borc/node_modules/buffer/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const Bignumber = (__webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js").BigNumber)

const parser = __webpack_require__(/*! ./decoder.asm */ "./node_modules/borc/src/decoder.asm.js")
const utils = __webpack_require__(/*! ./utils */ "./node_modules/borc/src/utils.js")
const c = __webpack_require__(/*! ./constants */ "./node_modules/borc/src/constants.js")
const Simple = __webpack_require__(/*! ./simple */ "./node_modules/borc/src/simple.js")
const Tagged = __webpack_require__(/*! ./tagged */ "./node_modules/borc/src/tagged.js")
const { URL } = __webpack_require__(/*! iso-url */ "./node_modules/iso-url/index.js")

/**
 * Transform binary cbor data into JavaScript objects.
 */
class Decoder {
  /**
   * @param {Object} [opts={}]
   * @param {number} [opts.size=65536] - Size of the allocated heap.
   */
  constructor (opts) {
    opts = opts || {}

    if (!opts.size || opts.size < 0x10000) {
      opts.size = 0x10000
    } else {
      // Ensure the size is a power of 2
      opts.size = utils.nextPowerOf2(opts.size)
    }

    // Heap use to share the input with the parser
    this._heap = new ArrayBuffer(opts.size)
    this._heap8 = new Uint8Array(this._heap)
    this._buffer = Buffer.from(this._heap)

    this._reset()

    // Known tags
    this._knownTags = Object.assign({
      0: (val) => new Date(val),
      1: (val) => new Date(val * 1000),
      2: (val) => utils.arrayBufferToBignumber(val),
      3: (val) => c.NEG_ONE.minus(utils.arrayBufferToBignumber(val)),
      4: (v) => {
        // const v = new Uint8Array(val)
        return c.TEN.pow(v[0]).times(v[1])
      },
      5: (v) => {
        // const v = new Uint8Array(val)
        return c.TWO.pow(v[0]).times(v[1])
      },
      32: (val) => new URL(val),
      35: (val) => new RegExp(val)
    }, opts.tags)

    // Initialize asm based parser
    this.parser = parser(__webpack_require__.g, {
      // eslint-disable-next-line no-console
      log: console.log.bind(console),
      pushInt: this.pushInt.bind(this),
      pushInt32: this.pushInt32.bind(this),
      pushInt32Neg: this.pushInt32Neg.bind(this),
      pushInt64: this.pushInt64.bind(this),
      pushInt64Neg: this.pushInt64Neg.bind(this),
      pushFloat: this.pushFloat.bind(this),
      pushFloatSingle: this.pushFloatSingle.bind(this),
      pushFloatDouble: this.pushFloatDouble.bind(this),
      pushTrue: this.pushTrue.bind(this),
      pushFalse: this.pushFalse.bind(this),
      pushUndefined: this.pushUndefined.bind(this),
      pushNull: this.pushNull.bind(this),
      pushInfinity: this.pushInfinity.bind(this),
      pushInfinityNeg: this.pushInfinityNeg.bind(this),
      pushNaN: this.pushNaN.bind(this),
      pushNaNNeg: this.pushNaNNeg.bind(this),
      pushArrayStart: this.pushArrayStart.bind(this),
      pushArrayStartFixed: this.pushArrayStartFixed.bind(this),
      pushArrayStartFixed32: this.pushArrayStartFixed32.bind(this),
      pushArrayStartFixed64: this.pushArrayStartFixed64.bind(this),
      pushObjectStart: this.pushObjectStart.bind(this),
      pushObjectStartFixed: this.pushObjectStartFixed.bind(this),
      pushObjectStartFixed32: this.pushObjectStartFixed32.bind(this),
      pushObjectStartFixed64: this.pushObjectStartFixed64.bind(this),
      pushByteString: this.pushByteString.bind(this),
      pushByteStringStart: this.pushByteStringStart.bind(this),
      pushUtf8String: this.pushUtf8String.bind(this),
      pushUtf8StringStart: this.pushUtf8StringStart.bind(this),
      pushSimpleUnassigned: this.pushSimpleUnassigned.bind(this),
      pushTagUnassigned: this.pushTagUnassigned.bind(this),
      pushTagStart: this.pushTagStart.bind(this),
      pushTagStart4: this.pushTagStart4.bind(this),
      pushTagStart8: this.pushTagStart8.bind(this),
      pushBreak: this.pushBreak.bind(this)
    }, this._heap)
  }

  get _depth () {
    return this._parents.length
  }

  get _currentParent () {
    return this._parents[this._depth - 1]
  }

  get _ref () {
    return this._currentParent.ref
  }

  // Finish the current parent
  _closeParent () {
    var p = this._parents.pop()

    if (p.length > 0) {
      throw new Error(`Missing ${p.length} elements`)
    }

    switch (p.type) {
      case c.PARENT.TAG:
        this._push(
          this.createTag(p.ref[0], p.ref[1])
        )
        break
      case c.PARENT.BYTE_STRING:
        this._push(this.createByteString(p.ref, p.length))
        break
      case c.PARENT.UTF8_STRING:
        this._push(this.createUtf8String(p.ref, p.length))
        break
      case c.PARENT.MAP:
        if (p.values % 2 > 0) {
          throw new Error('Odd number of elements in the map')
        }
        this._push(this.createMap(p.ref, p.length))
        break
      case c.PARENT.OBJECT:
        if (p.values % 2 > 0) {
          throw new Error('Odd number of elements in the map')
        }
        this._push(this.createObject(p.ref, p.length))
        break
      case c.PARENT.ARRAY:
        this._push(this.createArray(p.ref, p.length))
        break
      default:
        break
    }

    if (this._currentParent && this._currentParent.type === c.PARENT.TAG) {
      this._dec()
    }
  }

  // Reduce the expected length of the current parent by one
  _dec () {
    const p = this._currentParent
    // The current parent does not know the epxected child length

    if (p.length < 0) {
      return
    }

    p.length--

    // All children were seen, we can close the current parent
    if (p.length === 0) {
      this._closeParent()
    }
  }

  // Push any value to the current parent
  _push (val, hasChildren) {
    const p = this._currentParent
    p.values++

    switch (p.type) {
      case c.PARENT.ARRAY:
      case c.PARENT.BYTE_STRING:
      case c.PARENT.UTF8_STRING:
        if (p.length > -1) {
          this._ref[this._ref.length - p.length] = val
        } else {
          this._ref.push(val)
        }
        this._dec()
        break
      case c.PARENT.OBJECT:
        if (p.tmpKey != null) {
          this._ref[p.tmpKey] = val
          p.tmpKey = null
          this._dec()
        } else {
          p.tmpKey = val

          if (typeof p.tmpKey !== 'string') {
            // too bad, convert to a Map
            p.type = c.PARENT.MAP
            p.ref = utils.buildMap(p.ref)
          }
        }
        break
      case c.PARENT.MAP:
        if (p.tmpKey != null) {
          this._ref.set(p.tmpKey, val)
          p.tmpKey = null
          this._dec()
        } else {
          p.tmpKey = val
        }
        break
      case c.PARENT.TAG:
        this._ref.push(val)
        if (!hasChildren) {
          this._dec()
        }
        break
      default:
        throw new Error('Unknown parent type')
    }
  }

  // Create a new parent in the parents list
  _createParent (obj, type, len) {
    this._parents[this._depth] = {
      type: type,
      length: len,
      ref: obj,
      values: 0,
      tmpKey: null
    }
  }

  // Reset all state back to the beginning, also used for initiatlization
  _reset () {
    this._res = []
    this._parents = [{
      type: c.PARENT.ARRAY,
      length: -1,
      ref: this._res,
      values: 0,
      tmpKey: null
    }]
  }

  // -- Interface to customize deoding behaviour
  createTag (tagNumber, value) {
    const typ = this._knownTags[tagNumber]

    if (!typ) {
      return new Tagged(tagNumber, value)
    }

    return typ(value)
  }

  createMap (obj, len) {
    return obj
  }

  createObject (obj, len) {
    return obj
  }

  createArray (arr, len) {
    return arr
  }

  createByteString (raw, len) {
    return Buffer.concat(raw)
  }

  createByteStringFromHeap (start, end) {
    if (start === end) {
      return Buffer.alloc(0)
    }

    return Buffer.from(this._heap.slice(start, end))
  }

  createInt (val) {
    return val
  }

  createInt32 (f, g) {
    return utils.buildInt32(f, g)
  }

  createInt64 (f1, f2, g1, g2) {
    return utils.buildInt64(f1, f2, g1, g2)
  }

  createFloat (val) {
    return val
  }

  createFloatSingle (a, b, c, d) {
    return ieee754.read([a, b, c, d], 0, false, 23, 4)
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    return ieee754.read([a, b, c, d, e, f, g, h], 0, false, 52, 8)
  }

  createInt32Neg (f, g) {
    return -1 - utils.buildInt32(f, g)
  }

  createInt64Neg (f1, f2, g1, g2) {
    const f = utils.buildInt32(f1, f2)
    const g = utils.buildInt32(g1, g2)

    if (f > c.MAX_SAFE_HIGH) {
      return c.NEG_ONE.minus(new Bignumber(f).times(c.SHIFT32).plus(g))
    }

    return -1 - ((f * c.SHIFT32) + g)
  }

  createTrue () {
    return true
  }

  createFalse () {
    return false
  }

  createNull () {
    return null
  }

  createUndefined () {
    return undefined
  }

  createInfinity () {
    return Infinity
  }

  createInfinityNeg () {
    return -Infinity
  }

  createNaN () {
    return NaN
  }

  createNaNNeg () {
    return -NaN
  }

  createUtf8String (raw, len) {
    return raw.join('')
  }

  createUtf8StringFromHeap (start, end) {
    if (start === end) {
      return ''
    }

    return this._buffer.toString('utf8', start, end)
  }

  createSimpleUnassigned (val) {
    return new Simple(val)
  }

  // -- Interface for decoder.asm.js

  pushInt (val) {
    this._push(this.createInt(val))
  }

  pushInt32 (f, g) {
    this._push(this.createInt32(f, g))
  }

  pushInt64 (f1, f2, g1, g2) {
    this._push(this.createInt64(f1, f2, g1, g2))
  }

  pushFloat (val) {
    this._push(this.createFloat(val))
  }

  pushFloatSingle (a, b, c, d) {
    this._push(this.createFloatSingle(a, b, c, d))
  }

  pushFloatDouble (a, b, c, d, e, f, g, h) {
    this._push(this.createFloatDouble(a, b, c, d, e, f, g, h))
  }

  pushInt32Neg (f, g) {
    this._push(this.createInt32Neg(f, g))
  }

  pushInt64Neg (f1, f2, g1, g2) {
    this._push(this.createInt64Neg(f1, f2, g1, g2))
  }

  pushTrue () {
    this._push(this.createTrue())
  }

  pushFalse () {
    this._push(this.createFalse())
  }

  pushNull () {
    this._push(this.createNull())
  }

  pushUndefined () {
    this._push(this.createUndefined())
  }

  pushInfinity () {
    this._push(this.createInfinity())
  }

  pushInfinityNeg () {
    this._push(this.createInfinityNeg())
  }

  pushNaN () {
    this._push(this.createNaN())
  }

  pushNaNNeg () {
    this._push(this.createNaNNeg())
  }

  pushArrayStart () {
    this._createParent([], c.PARENT.ARRAY, -1)
  }

  pushArrayStartFixed (len) {
    this._createArrayStartFixed(len)
  }

  pushArrayStartFixed32 (len1, len2) {
    const len = utils.buildInt32(len1, len2)
    this._createArrayStartFixed(len)
  }

  pushArrayStartFixed64 (len1, len2, len3, len4) {
    const len = utils.buildInt64(len1, len2, len3, len4)
    this._createArrayStartFixed(len)
  }

  pushObjectStart () {
    this._createObjectStartFixed(-1)
  }

  pushObjectStartFixed (len) {
    this._createObjectStartFixed(len)
  }

  pushObjectStartFixed32 (len1, len2) {
    const len = utils.buildInt32(len1, len2)
    this._createObjectStartFixed(len)
  }

  pushObjectStartFixed64 (len1, len2, len3, len4) {
    const len = utils.buildInt64(len1, len2, len3, len4)
    this._createObjectStartFixed(len)
  }

  pushByteStringStart () {
    this._parents[this._depth] = {
      type: c.PARENT.BYTE_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    }
  }

  pushByteString (start, end) {
    this._push(this.createByteStringFromHeap(start, end))
  }

  pushUtf8StringStart () {
    this._parents[this._depth] = {
      type: c.PARENT.UTF8_STRING,
      length: -1,
      ref: [],
      values: 0,
      tmpKey: null
    }
  }

  pushUtf8String (start, end) {
    this._push(this.createUtf8StringFromHeap(start, end))
  }

  pushSimpleUnassigned (val) {
    this._push(this.createSimpleUnassigned(val))
  }

  pushTagStart (tag) {
    this._parents[this._depth] = {
      type: c.PARENT.TAG,
      length: 1,
      ref: [tag]
    }
  }

  pushTagStart4 (f, g) {
    this.pushTagStart(utils.buildInt32(f, g))
  }

  pushTagStart8 (f1, f2, g1, g2) {
    this.pushTagStart(utils.buildInt64(f1, f2, g1, g2))
  }

  pushTagUnassigned (tagNumber) {
    this._push(this.createTag(tagNumber))
  }

  pushBreak () {
    if (this._currentParent.length > -1) {
      throw new Error('Unexpected break')
    }

    this._closeParent()
  }

  _createObjectStartFixed (len) {
    if (len === 0) {
      this._push(this.createObject({}))
      return
    }

    this._createParent({}, c.PARENT.OBJECT, len)
  }

  _createArrayStartFixed (len) {
    if (len === 0) {
      this._push(this.createArray([]))
      return
    }

    this._createParent(new Array(len), c.PARENT.ARRAY, len)
  }

  _decode (input) {
    if (input.byteLength === 0) {
      throw new Error('Input too short')
    }

    this._reset()
    this._heap8.set(input)
    const code = this.parser.parse(input.byteLength)

    if (this._depth > 1) {
      while (this._currentParent.length === 0) {
        this._closeParent()
      }
      if (this._depth > 1) {
        throw new Error('Undeterminated nesting')
      }
    }

    if (code > 0) {
      throw new Error('Failed to parse')
    }

    if (this._res.length === 0) {
      throw new Error('No valid result')
    }
  }

  // -- Public Interface

  decodeFirst (input) {
    this._decode(input)

    return this._res[0]
  }

  decodeAll (input) {
    this._decode(input)

    return this._res
  }

  /**
   * Decode the first cbor object.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {*}
   */
  static decode (input, enc) {
    if (typeof input === 'string') {
      input = Buffer.from(input, enc || 'hex')
    }

    const dec = new Decoder({ size: input.length })
    return dec.decodeFirst(input)
  }

  /**
   * Decode all cbor objects.
   *
   * @param {Buffer|string} input
   * @param {string} [enc='hex'] - Encoding used if a string is passed.
   * @returns {Array<*>}
   */
  static decodeAll (input, enc) {
    if (typeof input === 'string') {
      input = Buffer.from(input, enc || 'hex')
    }

    const dec = new Decoder({ size: input.length })
    return dec.decodeAll(input)
  }
}

Decoder.decodeFirst = Decoder.decode

module.exports = Decoder


/***/ }),

/***/ "./node_modules/borc/src/diagnose.js":
/*!*******************************************!*\
  !*** ./node_modules/borc/src/diagnose.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Buffer } = __webpack_require__(/*! buffer */ "./node_modules/borc/node_modules/buffer/index.js")
const Decoder = __webpack_require__(/*! ./decoder */ "./node_modules/borc/src/decoder.js")
const utils = __webpack_require__(/*! ./utils */ "./node_modules/borc/src/utils.js")

/**
 * Output the diagnostic format from a stream of CBOR bytes.
 *
 */
class Diagnose extends Decoder {
  createTag (tagNumber, value) {
    return `${tagNumber}(${value})`
  }

  createInt (val) {
    return super.createInt(val).toString()
  }

  createInt32 (f, g) {
    return super.createInt32(f, g).toString()
  }

  createInt64 (f1, f2, g1, g2) {
    return super.createInt64(f1, f2, g1, g2).toString()
  }

  createInt32Neg (f, g) {
    return super.createInt32Neg(f, g).toString()
  }

  createInt64Neg (f1, f2, g1, g2) {
    return super.createInt64Neg(f1, f2, g1, g2).toString()
  }

  createTrue () {
    return 'true'
  }

  createFalse () {
    return 'false'
  }

  createFloat (val) {
    const fl = super.createFloat(val)
    if (utils.isNegativeZero(val)) {
      return '-0_1'
    }

    return `${fl}_1`
  }

  createFloatSingle (a, b, c, d) {
    const fl = super.createFloatSingle(a, b, c, d)
    return `${fl}_2`
  }

  createFloatDouble (a, b, c, d, e, f, g, h) {
    const fl = super.createFloatDouble(a, b, c, d, e, f, g, h)
    return `${fl}_3`
  }

  createByteString (raw, len) {
    const val = raw.join(', ')

    if (len === -1) {
      return `(_ ${val})`
    }
    return `h'${val}`
  }

  createByteStringFromHeap (start, end) {
    const val = (Buffer.from(
      super.createByteStringFromHeap(start, end)
    )).toString('hex')

    return `h'${val}'`
  }

  createInfinity () {
    return 'Infinity_1'
  }

  createInfinityNeg () {
    return '-Infinity_1'
  }

  createNaN () {
    return 'NaN_1'
  }

  createNaNNeg () {
    return '-NaN_1'
  }

  createNull () {
    return 'null'
  }

  createUndefined () {
    return 'undefined'
  }

  createSimpleUnassigned (val) {
    return `simple(${val})`
  }

  createArray (arr, len) {
    const val = super.createArray(arr, len)

    if (len === -1) {
      // indefinite
      return `[_ ${val.join(', ')}]`
    }

    return `[${val.join(', ')}]`
  }

  createMap (map, len) {
    const val = super.createMap(map)
    const list = Array.from(val.keys())
      .reduce(collectObject(val), '')

    if (len === -1) {
      return `{_ ${list}}`
    }

    return `{${list}}`
  }

  createObject (obj, len) {
    const val = super.createObject(obj)
    const map = Object.keys(val)
      .reduce(collectObject(val), '')

    if (len === -1) {
      return `{_ ${map}}`
    }

    return `{${map}}`
  }

  createUtf8String (raw, len) {
    const val = raw.join(', ')

    if (len === -1) {
      return `(_ ${val})`
    }

    return `"${val}"`
  }

  createUtf8StringFromHeap (start, end) {
    const val = (Buffer.from(
      super.createUtf8StringFromHeap(start, end)
    )).toString('utf8')

    return `"${val}"`
  }

  static diagnose (input, enc) {
    if (typeof input === 'string') {
      input = Buffer.from(input, enc || 'hex')
    }

    const dec = new Diagnose()
    return dec.decodeFirst(input)
  }
}

module.exports = Diagnose

function collectObject (val) {
  return (acc, key) => {
    if (acc) {
      return `${acc}, ${key}: ${val[key]}`
    }
    return `${key}: ${val[key]}`
  }
}


/***/ }),

/***/ "./node_modules/borc/src/encoder.js":
/*!******************************************!*\
  !*** ./node_modules/borc/src/encoder.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { Buffer } = __webpack_require__(/*! buffer */ "./node_modules/borc/node_modules/buffer/index.js")
const { URL } = __webpack_require__(/*! iso-url */ "./node_modules/iso-url/index.js")
const Bignumber = (__webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js").BigNumber)

const utils = __webpack_require__(/*! ./utils */ "./node_modules/borc/src/utils.js")
const constants = __webpack_require__(/*! ./constants */ "./node_modules/borc/src/constants.js")
const MT = constants.MT
const NUMBYTES = constants.NUMBYTES
const SHIFT32 = constants.SHIFT32
const SYMS = constants.SYMS
const TAG = constants.TAG
const HALF = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.TWO
const FLOAT = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.FOUR
const DOUBLE = (constants.MT.SIMPLE_FLOAT << 5) | constants.NUMBYTES.EIGHT
const TRUE = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.TRUE
const FALSE = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.FALSE
const UNDEFINED = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.UNDEFINED
const NULL = (constants.MT.SIMPLE_FLOAT << 5) | constants.SIMPLE.NULL

const MAXINT_BN = new Bignumber('0x20000000000000')
const BUF_NAN = Buffer.from('f97e00', 'hex')
const BUF_INF_NEG = Buffer.from('f9fc00', 'hex')
const BUF_INF_POS = Buffer.from('f97c00', 'hex')

function toType (obj) {
  // [object Type]
  // --------8---1
  return ({}).toString.call(obj).slice(8, -1)
}

/**
 * Transform JavaScript values into CBOR bytes
 *
 */
class Encoder {
  /**
   * @param {Object} [options={}]
   * @param {function(Buffer)} options.stream
   */
  constructor (options) {
    options = options || {}

    this.streaming = typeof options.stream === 'function'
    this.onData = options.stream

    this.semanticTypes = [
      [URL, this._pushUrl],
      [Bignumber, this._pushBigNumber]
    ]

    const addTypes = options.genTypes || []
    const len = addTypes.length
    for (let i = 0; i < len; i++) {
      this.addSemanticType(
        addTypes[i][0],
        addTypes[i][1]
      )
    }

    this._reset()
  }

  addSemanticType (type, fun) {
    const len = this.semanticTypes.length
    for (let i = 0; i < len; i++) {
      const typ = this.semanticTypes[i][0]
      if (typ === type) {
        const old = this.semanticTypes[i][1]
        this.semanticTypes[i][1] = fun
        return old
      }
    }
    this.semanticTypes.push([type, fun])
    return null
  }

  push (val) {
    if (!val) {
      return true
    }

    this.result[this.offset] = val
    this.resultMethod[this.offset] = 0
    this.resultLength[this.offset] = val.length
    this.offset++

    if (this.streaming) {
      this.onData(this.finalize())
    }

    return true
  }

  pushWrite (val, method, len) {
    this.result[this.offset] = val
    this.resultMethod[this.offset] = method
    this.resultLength[this.offset] = len
    this.offset++

    if (this.streaming) {
      this.onData(this.finalize())
    }

    return true
  }

  _pushUInt8 (val) {
    return this.pushWrite(val, 1, 1)
  }

  _pushUInt16BE (val) {
    return this.pushWrite(val, 2, 2)
  }

  _pushUInt32BE (val) {
    return this.pushWrite(val, 3, 4)
  }

  _pushDoubleBE (val) {
    return this.pushWrite(val, 4, 8)
  }

  _pushNaN () {
    return this.push(BUF_NAN)
  }

  _pushInfinity (obj) {
    const half = (obj < 0) ? BUF_INF_NEG : BUF_INF_POS
    return this.push(half)
  }

  _pushFloat (obj) {
    const b2 = Buffer.allocUnsafe(2)

    if (utils.writeHalf(b2, obj)) {
      if (utils.parseHalf(b2) === obj) {
        return this._pushUInt8(HALF) && this.push(b2)
      }
    }

    const b4 = Buffer.allocUnsafe(4)
    b4.writeFloatBE(obj, 0)
    if (b4.readFloatBE(0) === obj) {
      return this._pushUInt8(FLOAT) && this.push(b4)
    }

    return this._pushUInt8(DOUBLE) && this._pushDoubleBE(obj)
  }

  _pushInt (obj, mt, orig) {
    const m = mt << 5
    if (obj < 24) {
      return this._pushUInt8(m | obj)
    }

    if (obj <= 0xff) {
      return this._pushUInt8(m | NUMBYTES.ONE) && this._pushUInt8(obj)
    }

    if (obj <= 0xffff) {
      return this._pushUInt8(m | NUMBYTES.TWO) && this._pushUInt16BE(obj)
    }

    if (obj <= 0xffffffff) {
      return this._pushUInt8(m | NUMBYTES.FOUR) && this._pushUInt32BE(obj)
    }

    if (obj <= Number.MAX_SAFE_INTEGER) {
      return this._pushUInt8(m | NUMBYTES.EIGHT) &&
        this._pushUInt32BE(Math.floor(obj / SHIFT32)) &&
        this._pushUInt32BE(obj % SHIFT32)
    }

    if (mt === MT.NEG_INT) {
      return this._pushFloat(orig)
    }

    return this._pushFloat(obj)
  }

  _pushIntNum (obj) {
    if (obj < 0) {
      return this._pushInt(-obj - 1, MT.NEG_INT, obj)
    } else {
      return this._pushInt(obj, MT.POS_INT)
    }
  }

  _pushNumber (obj) {
    switch (false) {
      case (obj === obj): // eslint-disable-line
        return this._pushNaN(obj)
      case isFinite(obj):
        return this._pushInfinity(obj)
      case ((obj % 1) !== 0):
        return this._pushIntNum(obj)
      default:
        return this._pushFloat(obj)
    }
  }

  _pushString (obj) {
    const len = Buffer.byteLength(obj, 'utf8')
    return this._pushInt(len, MT.UTF8_STRING) && this.pushWrite(obj, 5, len)
  }

  _pushBoolean (obj) {
    return this._pushUInt8(obj ? TRUE : FALSE)
  }

  _pushUndefined (obj) {
    return this._pushUInt8(UNDEFINED)
  }

  _pushArray (gen, obj) {
    const len = obj.length
    if (!gen._pushInt(len, MT.ARRAY)) {
      return false
    }
    for (let j = 0; j < len; j++) {
      if (!gen.pushAny(obj[j])) {
        return false
      }
    }
    return true
  }

  _pushTag (tag) {
    return this._pushInt(tag, MT.TAG)
  }

  _pushDate (gen, obj) {
    // Round date, to get seconds since 1970-01-01 00:00:00 as defined in
    // Sec. 2.4.1 and get a possibly more compact encoding. Note that it is
    // still allowed to encode fractions of seconds which can be achieved by
    // changing overwriting the encode function for Date objects.
    return gen._pushTag(TAG.DATE_EPOCH) && gen.pushAny(Math.round(obj / 1000))
  }

  _pushBuffer (gen, obj) {
    return gen._pushInt(obj.length, MT.BYTE_STRING) && gen.push(obj)
  }

  _pushNoFilter (gen, obj) {
    return gen._pushBuffer(gen, obj.slice())
  }

  _pushRegexp (gen, obj) {
    return gen._pushTag(TAG.REGEXP) && gen.pushAny(obj.source)
  }

  _pushSet (gen, obj) {
    if (!gen._pushInt(obj.size, MT.ARRAY)) {
      return false
    }
    for (const x of obj) {
      if (!gen.pushAny(x)) {
        return false
      }
    }
    return true
  }

  _pushUrl (gen, obj) {
    return gen._pushTag(TAG.URI) && gen.pushAny(obj.format())
  }

  _pushBigint (obj) {
    let tag = TAG.POS_BIGINT
    if (obj.isNegative()) {
      obj = obj.negated().minus(1)
      tag = TAG.NEG_BIGINT
    }
    let str = obj.toString(16)
    if (str.length % 2) {
      str = '0' + str
    }
    const buf = Buffer.from(str, 'hex')
    return this._pushTag(tag) && this._pushBuffer(this, buf)
  }

  _pushBigNumber (gen, obj) {
    if (obj.isNaN()) {
      return gen._pushNaN()
    }
    if (!obj.isFinite()) {
      return gen._pushInfinity(obj.isNegative() ? -Infinity : Infinity)
    }
    if (obj.isInteger()) {
      return gen._pushBigint(obj)
    }
    if (!(gen._pushTag(TAG.DECIMAL_FRAC) &&
      gen._pushInt(2, MT.ARRAY))) {
      return false
    }

    const dec = obj.decimalPlaces()
    const slide = obj.multipliedBy(new Bignumber(10).pow(dec))
    if (!gen._pushIntNum(-dec)) {
      return false
    }
    if (slide.abs().isLessThan(MAXINT_BN)) {
      return gen._pushIntNum(slide.toNumber())
    } else {
      return gen._pushBigint(slide)
    }
  }

  _pushMap (gen, obj) {
    if (!gen._pushInt(obj.size, MT.MAP)) {
      return false
    }

    return this._pushRawMap(
      obj.size,
      Array.from(obj)
    )
  }

  _pushObject (obj) {
    if (!obj) {
      return this._pushUInt8(NULL)
    }

    var len = this.semanticTypes.length
    for (var i = 0; i < len; i++) {
      if (obj instanceof this.semanticTypes[i][0]) {
        return this.semanticTypes[i][1].call(obj, this, obj)
      }
    }

    var f = obj.encodeCBOR
    if (typeof f === 'function') {
      return f.call(obj, this)
    }

    var keys = Object.keys(obj)
    var keyLength = keys.length
    if (!this._pushInt(keyLength, MT.MAP)) {
      return false
    }

    return this._pushRawMap(
      keyLength,
      keys.map((k) => [k, obj[k]])
    )
  }

  _pushRawMap (len, map) {
    // Sort keys for canoncialization
    // 1. encode key
    // 2. shorter key comes before longer key
    // 3. same length keys are sorted with lower
    //    byte value before higher

    map = map.map(function (a) {
      a[0] = Encoder.encode(a[0])
      return a
    }).sort(utils.keySorter)

    for (var j = 0; j < len; j++) {
      if (!this.push(map[j][0])) {
        return false
      }

      if (!this.pushAny(map[j][1])) {
        return false
      }
    }

    return true
  }

  /**
   * Alias for `.pushAny`
   *
   * @param {*} obj
   * @returns {boolean} true on success
   */
  write (obj) {
    return this.pushAny(obj)
  }

  /**
   * Push any supported type onto the encoded stream
   *
   * @param {any} obj
   * @returns {boolean} true on success
   */
  pushAny (obj) {
    var typ = toType(obj)

    switch (typ) {
      case 'Number':
        return this._pushNumber(obj)
      case 'String':
        return this._pushString(obj)
      case 'Boolean':
        return this._pushBoolean(obj)
      case 'Object':
        return this._pushObject(obj)
      case 'Array':
        return this._pushArray(this, obj)
      case 'Uint8Array':
        return this._pushBuffer(this, Buffer.isBuffer(obj) ? obj : Buffer.from(obj))
      case 'Null':
        return this._pushUInt8(NULL)
      case 'Undefined':
        return this._pushUndefined(obj)
      case 'Map':
        return this._pushMap(this, obj)
      case 'Set':
        return this._pushSet(this, obj)
      case 'URL':
        return this._pushUrl(this, obj)
      case 'BigNumber':
        return this._pushBigNumber(this, obj)
      case 'Date':
        return this._pushDate(this, obj)
      case 'RegExp':
        return this._pushRegexp(this, obj)
      case 'Symbol':
        switch (obj) {
          case SYMS.NULL:
            return this._pushObject(null)
          case SYMS.UNDEFINED:
            return this._pushUndefined(undefined)
          // TODO: Add pluggable support for other symbols
          default:
            throw new Error('Unknown symbol: ' + obj.toString())
        }
      default:
        throw new Error('Unknown type: ' + typeof obj + ', ' + (obj ? obj.toString() : ''))
    }
  }

  finalize () {
    if (this.offset === 0) {
      return null
    }

    var result = this.result
    var resultLength = this.resultLength
    var resultMethod = this.resultMethod
    var offset = this.offset

    // Determine the size of the buffer
    var size = 0
    var i = 0

    for (; i < offset; i++) {
      size += resultLength[i]
    }

    var res = Buffer.allocUnsafe(size)
    var index = 0
    var length = 0

    // Write the content into the result buffer
    for (i = 0; i < offset; i++) {
      length = resultLength[i]

      switch (resultMethod[i]) {
        case 0:
          result[i].copy(res, index)
          break
        case 1:
          res.writeUInt8(result[i], index, true)
          break
        case 2:
          res.writeUInt16BE(result[i], index, true)
          break
        case 3:
          res.writeUInt32BE(result[i], index, true)
          break
        case 4:
          res.writeDoubleBE(result[i], index, true)
          break
        case 5:
          res.write(result[i], index, length, 'utf8')
          break
        default:
          throw new Error('unkown method')
      }

      index += length
    }

    var tmp = res

    this._reset()

    return tmp
  }

  _reset () {
    this.result = []
    this.resultMethod = []
    this.resultLength = []
    this.offset = 0
  }

  /**
   * Encode the given value
   * @param {*} o
   * @returns {Buffer}
   */
  static encode (o) {
    const enc = new Encoder()
    const ret = enc.pushAny(o)
    if (!ret) {
      throw new Error('Failed to encode input')
    }

    return enc.finalize()
  }
}

module.exports = Encoder


/***/ }),

/***/ "./node_modules/borc/src/index.js":
/*!****************************************!*\
  !*** ./node_modules/borc/src/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


// exports.Commented = require('./commented')
exports.Diagnose = __webpack_require__(/*! ./diagnose */ "./node_modules/borc/src/diagnose.js")
exports.Decoder = __webpack_require__(/*! ./decoder */ "./node_modules/borc/src/decoder.js")
exports.Encoder = __webpack_require__(/*! ./encoder */ "./node_modules/borc/src/encoder.js")
exports.Simple = __webpack_require__(/*! ./simple */ "./node_modules/borc/src/simple.js")
exports.Tagged = __webpack_require__(/*! ./tagged */ "./node_modules/borc/src/tagged.js")

// exports.comment = exports.Commented.comment
exports.decodeAll = exports.Decoder.decodeAll
exports.decodeFirst = exports.Decoder.decodeFirst
exports.diagnose = exports.Diagnose.diagnose
exports.encode = exports.Encoder.encode
exports.decode = exports.Decoder.decode

exports.leveldb = {
  decode: exports.Decoder.decodeAll,
  encode: exports.Encoder.encode,
  buffer: true,
  name: 'cbor'
}


/***/ }),

/***/ "./node_modules/borc/src/simple.js":
/*!*****************************************!*\
  !*** ./node_modules/borc/src/simple.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const constants = __webpack_require__(/*! ./constants */ "./node_modules/borc/src/constants.js")
const MT = constants.MT
const SIMPLE = constants.SIMPLE
const SYMS = constants.SYMS

/**
 * A CBOR Simple Value that does not map onto a known constant.
 */
class Simple {
  /**
   * Creates an instance of Simple.
   *
   * @param {integer} value - the simple value's integer value
   */
  constructor (value) {
    if (typeof value !== 'number') {
      throw new Error('Invalid Simple type: ' + (typeof value))
    }
    if ((value < 0) || (value > 255) || ((value | 0) !== value)) {
      throw new Error('value must be a small positive integer: ' + value)
    }
    this.value = value
  }

  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  toString () {
    return 'simple(' + this.value + ')'
  }

  /**
   * Debug string for simple value
   *
   * @returns {string} simple(value)
   */
  inspect () {
    return 'simple(' + this.value + ')'
  }

  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR (gen) {
    return gen._pushInt(this.value, MT.SIMPLE_FLOAT)
  }

  /**
   * Is the given object a Simple?
   *
   * @param {any} obj - object to test
   * @returns {bool} - is it Simple?
   */
  static isSimple (obj) {
    return obj instanceof Simple
  }

  /**
   * Decode from the CBOR additional information into a JavaScript value.
   * If the CBOR item has no parent, return a "safe" symbol instead of
   * `null` or `undefined`, so that the value can be passed through a
   * stream in object mode.
   *
   * @param {Number} val - the CBOR additional info to convert
   * @param {bool} hasParent - Does the CBOR item have a parent?
   * @returns {(null|undefined|Boolean|Symbol)} - the decoded value
   */
  static decode (val, hasParent) {
    if (hasParent == null) {
      hasParent = true
    }
    switch (val) {
      case SIMPLE.FALSE:
        return false
      case SIMPLE.TRUE:
        return true
      case SIMPLE.NULL:
        if (hasParent) {
          return null
        } else {
          return SYMS.NULL
        }
      case SIMPLE.UNDEFINED:
        if (hasParent) {
          return undefined
        } else {
          return SYMS.UNDEFINED
        }
      case -1:
        if (!hasParent) {
          throw new Error('Invalid BREAK')
        }
        return SYMS.BREAK
      default:
        return new Simple(val)
    }
  }
}

module.exports = Simple


/***/ }),

/***/ "./node_modules/borc/src/tagged.js":
/*!*****************************************!*\
  !*** ./node_modules/borc/src/tagged.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";


/**
 * A CBOR tagged item, where the tag does not have semantics specified at the
 * moment, or those semantics threw an error during parsing. Typically this will
 * be an extension point you're not yet expecting.
 */
class Tagged {
  /**
   * Creates an instance of Tagged.
   *
   * @param {Number} tag - the number of the tag
   * @param {any} value - the value inside the tag
   * @param {Error} err - the error that was thrown parsing the tag, or null
   */
  constructor (tag, value, err) {
    this.tag = tag
    this.value = value
    this.err = err
    if (typeof this.tag !== 'number') {
      throw new Error('Invalid tag type (' + (typeof this.tag) + ')')
    }
    if ((this.tag < 0) || ((this.tag | 0) !== this.tag)) {
      throw new Error('Tag must be a positive integer: ' + this.tag)
    }
  }

  /**
   * Convert to a String
   *
   * @returns {String} string of the form '1(2)'
   */
  toString () {
    return `${this.tag}(${JSON.stringify(this.value)})`
  }

  /**
   * Push the simple value onto the CBOR stream
   *
   * @param {cbor.Encoder} gen The generator to push onto
   * @returns {number}
   */
  encodeCBOR (gen) {
    gen._pushTag(this.tag)
    return gen.pushAny(this.value)
  }

  /**
   * If we have a converter for this type, do the conversion.  Some converters
   * are built-in.  Additional ones can be passed in.  If you want to remove
   * a built-in converter, pass a converter in whose value is 'null' instead
   * of a function.
   *
   * @param {Object} converters - keys in the object are a tag number, the value
   *   is a function that takes the decoded CBOR and returns a JavaScript value
   *   of the appropriate type.  Throw an exception in the function on errors.
   * @returns {any} - the converted item
   */
  convert (converters) {
    var er, f
    f = converters != null ? converters[this.tag] : undefined
    if (typeof f !== 'function') {
      f = Tagged['_tag' + this.tag]
      if (typeof f !== 'function') {
        return this
      }
    }
    try {
      return f.call(Tagged, this.value)
    } catch (error) {
      er = error
      this.err = er
      return this
    }
  }
}

module.exports = Tagged


/***/ }),

/***/ "./node_modules/borc/src/utils.js":
/*!****************************************!*\
  !*** ./node_modules/borc/src/utils.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const { Buffer } = __webpack_require__(/*! buffer */ "./node_modules/borc/node_modules/buffer/index.js")
const Bignumber = (__webpack_require__(/*! bignumber.js */ "./node_modules/bignumber.js/bignumber.js").BigNumber)

const constants = __webpack_require__(/*! ./constants */ "./node_modules/borc/src/constants.js")
const SHIFT32 = constants.SHIFT32
const SHIFT16 = constants.SHIFT16
const MAX_SAFE_HIGH = 0x1fffff

exports.parseHalf = function parseHalf (buf) {
  var exp, mant, sign
  sign = buf[0] & 0x80 ? -1 : 1
  exp = (buf[0] & 0x7C) >> 2
  mant = ((buf[0] & 0x03) << 8) | buf[1]
  if (!exp) {
    return sign * 5.9604644775390625e-8 * mant
  } else if (exp === 0x1f) {
    return sign * (mant ? 0 / 0 : 2e308)
  } else {
    return sign * Math.pow(2, exp - 25) * (1024 + mant)
  }
}

function toHex (n) {
  if (n < 16) {
    return '0' + n.toString(16)
  }

  return n.toString(16)
}

exports.arrayBufferToBignumber = function (buf) {
  const len = buf.byteLength
  let res = ''
  for (let i = 0; i < len; i++) {
    res += toHex(buf[i])
  }

  return new Bignumber(res, 16)
}

// convert an Object into a Map
exports.buildMap = (obj) => {
  const res = new Map()
  const keys = Object.keys(obj)
  const length = keys.length
  for (let i = 0; i < length; i++) {
    res.set(keys[i], obj[keys[i]])
  }
  return res
}

exports.buildInt32 = (f, g) => {
  return f * SHIFT16 + g
}

exports.buildInt64 = (f1, f2, g1, g2) => {
  const f = exports.buildInt32(f1, f2)
  const g = exports.buildInt32(g1, g2)

  if (f > MAX_SAFE_HIGH) {
    return new Bignumber(f).times(SHIFT32).plus(g)
  } else {
    return (f * SHIFT32) + g
  }
}

exports.writeHalf = function writeHalf (buf, half) {
  // assume 0, -0, NaN, Infinity, and -Infinity have already been caught

  // HACK: everyone settle in.  This isn't going to be pretty.
  // Translate cn-cbor's C code (from Carsten Borman):

  // uint32_t be32;
  // uint16_t be16, u16;
  // union {
  //   float f;
  //   uint32_t u;
  // } u32;
  // u32.f = float_val;

  const u32 = Buffer.allocUnsafe(4)
  u32.writeFloatBE(half, 0)
  const u = u32.readUInt32BE(0)

  // if ((u32.u & 0x1FFF) == 0) { /* worth trying half */

  // hildjj: If the lower 13 bits are 0, we won't lose anything in the conversion
  if ((u & 0x1FFF) !== 0) {
    return false
  }

  //   int s16 = (u32.u >> 16) & 0x8000;
  //   int exp = (u32.u >> 23) & 0xff;
  //   int mant = u32.u & 0x7fffff;

  var s16 = (u >> 16) & 0x8000 // top bit is sign
  const exp = (u >> 23) & 0xff // then 5 bits of exponent
  const mant = u & 0x7fffff

  //   if (exp == 0 && mant == 0)
  //     ;              /* 0.0, -0.0 */

  // hildjj: zeros already handled.  Assert if you don't believe me.

  //   else if (exp >= 113 && exp <= 142) /* normalized */
  //     s16 += ((exp - 112) << 10) + (mant >> 13);
  if ((exp >= 113) && (exp <= 142)) {
    s16 += ((exp - 112) << 10) + (mant >> 13)

  //   else if (exp >= 103 && exp < 113) { /* denorm, exp16 = 0 */
  //     if (mant & ((1 << (126 - exp)) - 1))
  //       goto float32;         /* loss of precision */
  //     s16 += ((mant + 0x800000) >> (126 - exp));
  } else if ((exp >= 103) && (exp < 113)) {
    if (mant & ((1 << (126 - exp)) - 1)) {
      return false
    }
    s16 += ((mant + 0x800000) >> (126 - exp))

    //   } else if (exp == 255 && mant == 0) { /* Inf */
    //     s16 += 0x7c00;

    // hildjj: Infinity already handled

  //   } else
  //     goto float32;           /* loss of range */
  } else {
    return false
  }

  //   ensure_writable(3);
  //   u16 = s16;
  //   be16 = hton16p((const uint8_t*)&u16);
  buf.writeUInt16BE(s16, 0)
  return true
}

exports.keySorter = function (a, b) {
  var lenA = a[0].byteLength
  var lenB = b[0].byteLength

  if (lenA > lenB) {
    return 1
  }

  if (lenB > lenA) {
    return -1
  }

  return a[0].compare(b[0])
}

// Adapted from http://www.2ality.com/2012/03/signedzero.html
exports.isNegativeZero = (x) => {
  return x === 0 && (1 / x < 0)
}

exports.nextPowerOf2 = (n) => {
  let count = 0
  // First n in the below condition is for
  // the case where n is 0
  if (n && !(n & (n - 1))) {
    return n
  }

  while (n !== 0) {
    n >>= 1
    count += 1
  }

  return 1 << count
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/iso-url/index.js":
/*!***************************************!*\
  !*** ./node_modules/iso-url/index.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
    URLWithLegacySupport,
    format,
    URLSearchParams,
    defaultBase
} = __webpack_require__(/*! ./src/url */ "./node_modules/iso-url/src/url-browser.js");
const relative = __webpack_require__(/*! ./src/relative */ "./node_modules/iso-url/src/relative.js");

module.exports = {
    URL: URLWithLegacySupport,
    URLSearchParams,
    format,
    relative,
    defaultBase
};


/***/ }),

/***/ "./node_modules/iso-url/src/relative.js":
/*!**********************************************!*\
  !*** ./node_modules/iso-url/src/relative.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const { URLWithLegacySupport, format } = __webpack_require__(/*! ./url */ "./node_modules/iso-url/src/url-browser.js");

module.exports = (url, location = {}, protocolMap = {}, defaultProtocol) => {
    let protocol = location.protocol ?
        location.protocol.replace(':', '') :
        'http';

    // Check protocol map
    protocol = (protocolMap[protocol] || defaultProtocol || protocol) + ':';
    let urlParsed;

    try {
        urlParsed = new URLWithLegacySupport(url);
    } catch (err) {
        urlParsed = {};
    }

    const base = Object.assign({}, location, {
        protocol: protocol || urlParsed.protocol,
        host: location.host || urlParsed.host
    });

    return new URLWithLegacySupport(url, format(base)).toString();
};


/***/ }),

/***/ "./node_modules/iso-url/src/url-browser.js":
/*!*************************************************!*\
  !*** ./node_modules/iso-url/src/url-browser.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


const defaultBase = self.location ?
    self.location.protocol + '//' + self.location.host :
    '';
const URL = self.URL;

class URLWithLegacySupport {
    constructor(url = '', base = defaultBase) {
        this.super = new URL(url, base);
        this.path = this.pathname + this.search;
        this.auth =
            this.username && this.password ?
                this.username + ':' + this.password :
                null;

        this.query =
            this.search && this.search.startsWith('?') ?
                this.search.slice(1) :
                null;
    }

    get hash() {
        return this.super.hash;
    }
    get host() {
        return this.super.host;
    }
    get hostname() {
        return this.super.hostname;
    }
    get href() {
        return this.super.href;
    }
    get origin() {
        return this.super.origin;
    }
    get password() {
        return this.super.password;
    }
    get pathname() {
        return this.super.pathname;
    }
    get port() {
        return this.super.port;
    }
    get protocol() {
        return this.super.protocol;
    }
    get search() {
        return this.super.search;
    }
    get searchParams() {
        return this.super.searchParams;
    }
    get username() {
        return this.super.username;
    }

    set hash(hash) {
        this.super.hash = hash;
    }
    set host(host) {
        this.super.host = host;
    }
    set hostname(hostname) {
        this.super.hostname = hostname;
    }
    set href(href) {
        this.super.href = href;
    }
    set origin(origin) {
        this.super.origin = origin;
    }
    set password(password) {
        this.super.password = password;
    }
    set pathname(pathname) {
        this.super.pathname = pathname;
    }
    set port(port) {
        this.super.port = port;
    }
    set protocol(protocol) {
        this.super.protocol = protocol;
    }
    set search(search) {
        this.super.search = search;
    }
    set searchParams(searchParams) {
        this.super.searchParams = searchParams;
    }
    set username(username) {
        this.super.username = username;
    }

    createObjectURL(o) {
        return this.super.createObjectURL(o);
    }
    revokeObjectURL(o) {
        this.super.revokeObjectURL(o);
    }
    toJSON() {
        return this.super.toJSON();
    }
    toString() {
        return this.super.toString();
    }
    format() {
        return this.toString();
    }
}

function format(obj) {
    if (typeof obj === 'string') {
        const url = new URL(obj);

        return url.toString();
    }

    if (!(obj instanceof URL)) {
        const userPass =
            obj.username && obj.password ?
                `${obj.username}:${obj.password}@` :
                '';
        const auth = obj.auth ? obj.auth + '@' : '';
        const port = obj.port ? ':' + obj.port : '';
        const protocol = obj.protocol ? obj.protocol + '//' : '';
        const host = obj.host || '';
        const hostname = obj.hostname || '';
        const search = obj.search || (obj.query ? '?' + obj.query : '');
        const hash = obj.hash || '';
        const pathname = obj.pathname || '';
        const path = obj.path || pathname + search;

        return `${protocol}${userPass || auth}${host ||
            hostname + port}${path}${hash}`;
    }
}

module.exports = {
    URLWithLegacySupport,
    URLSearchParams: self.URLSearchParams,
    defaultBase,
    format
};


/***/ }),

/***/ "./node_modules/simple-cbor/src/index.js":
/*!***********************************************!*\
  !*** ./node_modules/simple-cbor/src/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__export(__webpack_require__(/*! ./serializer */ "./node_modules/simple-cbor/src/serializer.js"));
const value = __importStar(__webpack_require__(/*! ./value */ "./node_modules/simple-cbor/src/value.js"));
exports.value = value;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/simple-cbor/src/serializer.js":
/*!****************************************************!*\
  !*** ./node_modules/simple-cbor/src/serializer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const cbor = __importStar(__webpack_require__(/*! ./value */ "./node_modules/simple-cbor/src/value.js"));
const BufferClasses = [
    ArrayBuffer,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
];
class JsonDefaultCborEncoder {
    // @param _serializer The CBOR Serializer to use.
    // @param _stable Whether or not keys from objects should be sorted (stable). This is
    //     particularly useful when testing encodings between JSON objects.
    constructor(_serializer, _stable = false) {
        this._serializer = _serializer;
        this._stable = _stable;
        this.name = "jsonDefault";
        this.priority = -100;
    }
    match(value) {
        return ["undefined", "boolean", "number", "string", "object"].indexOf(typeof value) != -1;
    }
    encode(value) {
        switch (typeof value) {
            case "undefined":
                return cbor.undefined_();
            case "boolean":
                return cbor.bool(value);
            case "number":
                if (Math.floor(value) === value) {
                    return cbor.number(value);
                }
                else {
                    return cbor.doubleFloat(value);
                }
            case "string":
                return cbor.string(value);
            case "object":
                if (value === null) {
                    return cbor.null_();
                }
                else if (Array.isArray(value)) {
                    return cbor.array(value.map((x) => this._serializer.serializeValue(x)));
                }
                else if (BufferClasses.find((x) => value instanceof x)) {
                    return cbor.bytes(value.buffer);
                }
                else if (Object.getOwnPropertyNames(value).indexOf("toJSON") !== -1) {
                    return this.encode(value.toJSON());
                }
                else if (value instanceof Map) {
                    const m = new Map();
                    for (const [key, item] of value.entries()) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
                else {
                    const m = new Map();
                    for (const [key, item] of Object.entries(value)) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
            default:
                throw new Error("Invalid value.");
        }
    }
}
exports.JsonDefaultCborEncoder = JsonDefaultCborEncoder;
class ToCborEncoder {
    constructor() {
        this.name = "cborEncoder";
        this.priority = -90;
    }
    match(value) {
        return typeof value == "object" && typeof value["toCBOR"] == "function";
    }
    encode(value) {
        return value.toCBOR();
    }
}
exports.ToCborEncoder = ToCborEncoder;
class CborSerializer {
    constructor() {
        this._encoders = new Set();
    }
    static withDefaultEncoders(stable = false) {
        const s = new this();
        s.addEncoder(new JsonDefaultCborEncoder(s, stable));
        s.addEncoder(new ToCborEncoder());
        return s;
    }
    removeEncoder(name) {
        // Has to make an extra call to values() to ensure it doesn't break on iteration.
        for (const encoder of this._encoders.values()) {
            if (encoder.name == name) {
                this._encoders.delete(encoder);
            }
        }
    }
    addEncoder(encoder) {
        this._encoders.add(encoder);
    }
    getEncoderFor(value) {
        let chosenEncoder = null;
        for (const encoder of this._encoders) {
            if (!chosenEncoder || encoder.priority > chosenEncoder.priority) {
                if (encoder.match(value)) {
                    chosenEncoder = encoder;
                }
            }
        }
        if (chosenEncoder === null) {
            throw new Error("Could not find an encoder for value.");
        }
        return chosenEncoder;
    }
    serializeValue(value) {
        return this.getEncoderFor(value).encode(value);
    }
    serialize(value) {
        return this.serializeValue(value);
    }
}
exports.CborSerializer = CborSerializer;
class SelfDescribeCborSerializer extends CborSerializer {
    serialize(value) {
        return cbor.raw(new Uint8Array([
            // Self describe CBOR.
            ...new Uint8Array([0xd9, 0xd9, 0xf7]),
            ...new Uint8Array(super.serializeValue(value)),
        ]));
    }
}
exports.SelfDescribeCborSerializer = SelfDescribeCborSerializer;
//# sourceMappingURL=serializer.js.map

/***/ }),

/***/ "./node_modules/simple-cbor/src/value.js":
/*!***********************************************!*\
  !*** ./node_modules/simple-cbor/src/value.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const MAX_U64_NUMBER = 0x20000000000000;
function _concat(a, ...args) {
    const newBuffer = new Uint8Array(a.byteLength + args.reduce((acc, b) => acc + b.byteLength, 0));
    newBuffer.set(new Uint8Array(a), 0);
    let i = a.byteLength;
    for (const b of args) {
        newBuffer.set(new Uint8Array(b), i);
        i += b.byteLength;
    }
    return newBuffer.buffer;
}
function _serializeValue(major, minor, value) {
    // Remove everything that's not an hexadecimal character. These are not
    // considered errors since the value was already validated and they might
    // be number decimals or sign.
    value = value.replace(/[^0-9a-fA-F]/g, "");
    // Create the buffer from the value with left padding with 0.
    const length = 2 ** (minor - 24 /* Int8 */);
    value = value.slice(-length * 2).padStart(length * 2, "0");
    const bytes = [(major << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
    return new Uint8Array(bytes).buffer;
}
function _serializeNumber(major, value) {
    if (value < 24) {
        return new Uint8Array([(major << 5) + value]).buffer;
    }
    else {
        const minor = value <= 0xff
            ? 24 /* Int8 */
            : value <= 0xffff
                ? 25 /* Int16 */
                : value <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        return _serializeValue(major, minor, value.toString(16));
    }
}
function _serializeString(str) {
    const utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) {
            utf8.push(charcode);
        }
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        else {
            // Surrogate pair
            i++;
            charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff);
            utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
    }
    return _concat(new Uint8Array(_serializeNumber(3 /* TextString */, str.length)), new Uint8Array(utf8));
}
/**
 * Tag a value.
 */
function tagged(tag, value) {
    if (tag == 0xd9d9f7) {
        return _concat(new Uint8Array([0xd9, 0xd9, 0xf7]), value);
    }
    if (tag < 24) {
        return _concat(new Uint8Array([(6 /* Tag */ << 5) + tag]), value);
    }
    else {
        const minor = tag <= 0xff
            ? 24 /* Int8 */
            : tag <= 0xffff
                ? 25 /* Int16 */
                : tag <= 0xffffffff
                    ? 26 /* Int32 */
                    : 27 /* Int64 */;
        const length = 2 ** (minor - 24 /* Int8 */);
        const value = tag
            .toString(16)
            .slice(-length * 2)
            .padStart(length * 2, "0");
        const bytes = [(6 /* Tag */ << 5) + minor].concat(value.match(/../g).map((byte) => parseInt(byte, 16)));
        return new Uint8Array(bytes).buffer;
    }
}
exports.tagged = tagged;
/**
 * Set the raw bytes contained by this value. This should only be used with another
 * CborValue, or if you are implementing extensions to CBOR.
 * @param bytes A buffer containing the value.
 */
function raw(bytes) {
    return new Uint8Array(bytes).buffer;
}
exports.raw = raw;
/**
 * Encode a number that is between [0, 23].
 * @param n
 */
function uSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    n = Math.min(Math.max(0, n), 23); // Clamp it.
    const bytes = [(0 /* UnsignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.uSmall = uSmall;
function u8(u8, radix) {
    // Force u8 into a number, and validate it.
    u8 = parseInt("" + u8, radix);
    if (isNaN(u8)) {
        throw new RangeError("Invalid number.");
    }
    u8 = Math.min(Math.max(0, u8), 0xff); // Clamp it.
    u8 = u8.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 24 /* Int8 */, u8);
}
exports.u8 = u8;
function u16(u16, radix) {
    // Force u16 into a number, and validate it.
    u16 = parseInt("" + u16, radix);
    if (isNaN(u16)) {
        throw new RangeError("Invalid number.");
    }
    u16 = Math.min(Math.max(0, u16), 0xffff); // Clamp it.
    u16 = u16.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 25 /* Int16 */, u16);
}
exports.u16 = u16;
function u32(u32, radix) {
    // Force u32 into a number, and validate it.
    u32 = parseInt("" + u32, radix);
    if (isNaN(u32)) {
        throw new RangeError("Invalid number.");
    }
    u32 = Math.min(Math.max(0, u32), 0xffffffff); // Clamp it.
    u32 = u32.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 26 /* Int32 */, u32);
}
exports.u32 = u32;
function u64(u64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof u64 == "string" && radix == 16) {
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (u64.match(/[^0-9a-fA-F]/)) {
            throw new RangeError("Invalid number.");
        }
        return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
    }
    // Force u64 into a number, and validate it.
    u64 = parseInt("" + u64, radix);
    if (isNaN(u64)) {
        throw new RangeError("Invalid number.");
    }
    u64 = Math.min(Math.max(0, u64), MAX_U64_NUMBER); // Clamp it to actual limit.
    u64 = u64.toString(16);
    return _serializeValue(0 /* UnsignedInteger */, 27 /* Int64 */, u64);
}
exports.u64 = u64;
/**
 * Encode a negative number that is between [-24, -1].
 */
function iSmall(n) {
    if (isNaN(n)) {
        throw new RangeError("Invalid number.");
    }
    if (n === 0) {
        return uSmall(0);
    }
    // Negative n, clamped to [1, 24], minus 1 (there's no negative 0).
    n = Math.min(Math.max(0, -n), 24) - 1;
    const bytes = [(1 /* SignedInteger */ << 5) + n];
    return new Uint8Array(bytes).buffer;
}
exports.iSmall = iSmall;
function i8(i8, radix) {
    // Force i8 into a number, and validate it.
    i8 = parseInt("" + i8, radix);
    if (isNaN(i8)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i8 = Math.min(Math.max(0, -i8 - 1), 0xff);
    i8 = i8.toString(16);
    return _serializeValue(1 /* SignedInteger */, 24 /* Int8 */, i8);
}
exports.i8 = i8;
function i16(i16, radix) {
    // Force i16 into a number, and validate it.
    i16 = parseInt("" + i16, radix);
    if (isNaN(i16)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i16 = Math.min(Math.max(0, -i16 - 1), 0xffff);
    i16 = i16.toString(16);
    return _serializeValue(1 /* SignedInteger */, 25 /* Int16 */, i16);
}
exports.i16 = i16;
function i32(i32, radix) {
    // Force i32 into a number, and validate it.
    i32 = parseInt("" + i32, radix);
    if (isNaN(i32)) {
        throw new RangeError("Invalid number.");
    }
    // Negative n, clamped, minus 1 (there's no negative 0).
    i32 = Math.min(Math.max(0, -i32 - 1), 0xffffffff);
    i32 = i32.toString(16);
    return _serializeValue(1 /* SignedInteger */, 26 /* Int32 */, i32);
}
exports.i32 = i32;
function i64(i64, radix) {
    // Special consideration for numbers that might be larger than expected.
    if (typeof i64 == "string" && radix == 16) {
        if (i64.startsWith("-")) {
            i64 = i64.slice(1);
        }
        else {
            // Clamp it.
            i64 = "0";
        }
        // This is the only case where we guarantee we'll encode the number directly.
        // Validate it's all hexadecimal first.
        if (i64.match(/[^0-9a-fA-F]/) || i64.length > 16) {
            throw new RangeError("Invalid number.");
        }
        // We need to do -1 to the number.
        let done = false;
        let newI64 = i64.split("").reduceRight((acc, x) => {
            if (done) {
                return x + acc;
            }
            let n = parseInt(x, 16) - 1;
            if (n >= 0) {
                done = true;
                return n.toString(16) + acc;
            }
            else {
                return "f" + acc;
            }
        }, "");
        if (!done) {
            // This number was 0.
            return u64(0);
        }
        return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, newI64);
    }
    // Force i64 into a number, and validate it.
    i64 = parseInt("" + i64, radix);
    if (isNaN(i64)) {
        throw new RangeError("Invalid number.");
    }
    i64 = Math.min(Math.max(0, -i64 - 1), 0x20000000000000); // Clamp it to actual.
    i64 = i64.toString(16);
    return _serializeValue(1 /* SignedInteger */, 27 /* Int64 */, i64);
}
exports.i64 = i64;
/**
 * Encode a number using the smallest amount of bytes, by calling the methods
 * above. e.g. If the number fits in a u8, it will use that.
 */
function number(n) {
    if (n >= 0) {
        if (n < 24) {
            return uSmall(n);
        }
        else if (n <= 0xff) {
            return u8(n);
        }
        else if (n <= 0xffff) {
            return u16(n);
        }
        else if (n <= 0xffffffff) {
            return u32(n);
        }
        else {
            return u64(n);
        }
    }
    else {
        if (n >= -24) {
            return iSmall(n);
        }
        else if (n >= -0xff) {
            return i8(n);
        }
        else if (n >= -0xffff) {
            return i16(n);
        }
        else if (n >= -0xffffffff) {
            return i32(n);
        }
        else {
            return i64(n);
        }
    }
}
exports.number = number;
/**
 * Encode a byte array. This is different than the `raw()` method.
 */
function bytes(bytes) {
    return _concat(_serializeNumber(2 /* ByteString */, bytes.byteLength), bytes);
}
exports.bytes = bytes;
/**
 * Encode a JavaScript string.
 */
function string(str) {
    return _serializeString(str);
}
exports.string = string;
/**
 * Encode an array of cbor values.
 */
function array(items) {
    return _concat(_serializeNumber(4 /* Array */, items.length), ...items);
}
exports.array = array;
/**
 * Encode a map of key-value pairs. The keys are string, and the values are CBOR
 * encoded.
 */
function map(items, stable = false) {
    if (!(items instanceof Map)) {
        items = new Map(Object.entries(items));
    }
    let entries = Array.from(items.entries());
    if (stable) {
        entries = entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    }
    return _concat(_serializeNumber(5 /* Map */, items.size), ...entries.map(([k, v]) => _concat(_serializeString(k), v)));
}
exports.map = map;
/**
 * Encode a single (32 bits) precision floating point number.
 */
function singleFloat(f) {
    const single = new Float32Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 26]), new Uint8Array(single.buffer));
}
exports.singleFloat = singleFloat;
/**
 * Encode a double (64 bits) precision floating point number.
 */
function doubleFloat(f) {
    const single = new Float64Array([f]);
    return _concat(new Uint8Array([(7 /* SimpleValue */ << 5) + 27]), new Uint8Array(single.buffer));
}
exports.doubleFloat = doubleFloat;
function bool(v) {
    return v ? true_() : false_();
}
exports.bool = bool;
/**
 * Encode the boolean true.
 */
function true_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 21]));
}
exports.true_ = true_;
/**
 * Encode the boolean false.
 */
function false_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 20]));
}
exports.false_ = false_;
/**
 * Encode the constant null.
 */
function null_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 22]));
}
exports.null_ = null_;
/**
 * Encode the constant undefined.
 */
function undefined_() {
    return raw(new Uint8Array([(7 /* SimpleValue */ << 5) + 23]));
}
exports.undefined_ = undefined_;
//# sourceMappingURL=value.js.map

/***/ }),

/***/ "./src/declarations/hello/hello.did.js":
/*!*********************************************!*\
  !*** ./src/declarations/hello/hello.did.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "idlFactory": () => (/* binding */ idlFactory),
/* harmony export */   "init": () => (/* binding */ init)
/* harmony export */ });
const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'greet' : IDL.Func([IDL.Text], [IDL.Text], []) });
};
const init = ({ IDL }) => { return []; };


/***/ }),

/***/ "./src/declarations/hello/index.js":
/*!*****************************************!*\
  !*** ./src/declarations/hello/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "idlFactory": () => (/* reexport safe */ _hello_did_js__WEBPACK_IMPORTED_MODULE_1__.idlFactory),
/* harmony export */   "canisterId": () => (/* binding */ canisterId),
/* harmony export */   "createActor": () => (/* binding */ createActor),
/* harmony export */   "hello": () => (/* binding */ hello)
/* harmony export */ });
/* harmony import */ var _dfinity_agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @dfinity/agent */ "./node_modules/@dfinity/agent/lib/esm/index.js");
/* harmony import */ var _hello_did_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hello.did.js */ "./src/declarations/hello/hello.did.js");


// Imports and re-exports candid interface


// CANISTER_ID is replaced by webpack based on node environment
const canisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";

/**
 * 
 * @param {string | import("@dfinity/principal").Principal} canisterId Canister ID of Agent
 * @param {{agentOptions?: import("@dfinity/agent").HttpAgentOptions; actorOptions?: import("@dfinity/agent").ActorConfig}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./hello.did.js")._SERVICE>}
 */
 const createActor = (canisterId, options) => {
  const agent = new _dfinity_agent__WEBPACK_IMPORTED_MODULE_0__.HttpAgent({ ...options?.agentOptions });
  
  // Fetch root key for certificate validation during development
  if(true) {
    agent.fetchRootKey().catch(err=>{
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return _dfinity_agent__WEBPACK_IMPORTED_MODULE_0__.Actor.createActor(_hello_did_js__WEBPACK_IMPORTED_MODULE_1__.idlFactory, {
    agent,
    canisterId,
    ...options?.actorOptions,
  });
};
  
/**
 * A ready-to-use agent for the hello canister
 * @type {import("@dfinity/agent").ActorSubclass<import("./hello.did.js")._SERVICE>}
 */
 const hello = createActor(canisterId);


/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/bls.js":
/*!********************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/bls.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bls": () => (/* binding */ bls)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _curve_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./curve.js */ "./node_modules/@noble/curves/esm/abstract/curve.js");
/* harmony import */ var _hash_to_curve_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hash-to-curve.js */ "./node_modules/@noble/curves/esm/abstract/hash-to-curve.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/* harmony import */ var _weierstrass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weierstrass.js */ "./node_modules/@noble/curves/esm/abstract/weierstrass.js");
/**
 * BLS != BLS.
 * The file implements BLS (Boneh-Lynn-Shacham) signatures.
 * Used in both BLS (Barreto-Lynn-Scott) and BN (Barreto-Naehrig)
 * families of pairing-friendly curves.
 * Consists of two curves: G1 and G2:
 * - G1 is a subgroup of (x, y) E(Fq) over y² = x³ + 4.
 * - G2 is a subgroup of ((x₁, x₂+i), (y₁, y₂+i)) E(Fq²) over y² = x³ + 4(1 + i) where i is √-1
 * - Gt, created by bilinear (ate) pairing e(G1, G2), consists of p-th roots of unity in
 *   Fq^k where k is embedding degree. Only degree 12 is currently supported, 24 is not.
 * Pairing is used to aggregate and verify signatures.
 * There are two modes of operation:
 * - Long signatures:  X-byte keys + 2X-byte sigs (G1 keys + G2 sigs).
 * - Short signatures: 2X-byte keys + X-byte sigs (G2 keys + G1 sigs).
 * @module
 **/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */





// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
// Not used with BLS12-381 (no sequential `11` in X). Useful for other curves.
function NAfDecomposition(a) {
    const res = [];
    // a>1 because of marker bit
    for (; a > _1n; a >>= _1n) {
        if ((a & _1n) === _0n)
            res.unshift(0);
        else if ((a & _3n) === _3n) {
            res.unshift(-1);
            a += _1n;
        }
        else
            res.unshift(1);
    }
    return res;
}
// G1_Point: ProjConstructor<bigint>, G2_Point: ProjConstructor<Fp2>,
function bls(CURVE) {
    // Fields are specific for curve, so for now we'll need to pass them with opts
    const { Fp, Fr, Fp2, Fp6, Fp12 } = CURVE.fields;
    const BLS_X_IS_NEGATIVE = CURVE.params.xNegative;
    const TWIST = CURVE.params.twistType;
    // Point on G1 curve: (x, y)
    const G1_ = (0,_weierstrass_js__WEBPACK_IMPORTED_MODULE_0__.weierstrassPoints)(CURVE.G1);
    const G1 = Object.assign(G1_, (0,_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(G1_.Point, CURVE.G1.mapToCurve, {
        ...CURVE.htfDefaults,
        ...CURVE.G1.htfDefaults,
    }));
    // Point on G2 curve (complex numbers): (x₁, x₂+i), (y₁, y₂+i)
    const G2_ = (0,_weierstrass_js__WEBPACK_IMPORTED_MODULE_0__.weierstrassPoints)(CURVE.G2);
    const G2 = Object.assign(G2_, (0,_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(G2_.Point, CURVE.G2.mapToCurve, {
        ...CURVE.htfDefaults,
        ...CURVE.G2.htfDefaults,
    }));
    // Applies sparse multiplication as line function
    let lineFunction;
    if (TWIST === 'multiplicative') {
        lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul014(f, c0, Fp2.mul(c1, Px), Fp2.mul(c2, Py));
    }
    else if (TWIST === 'divisive') {
        // NOTE: it should be [c0, c1, c2], but we use different order here to reduce complexity of
        // precompute calculations.
        lineFunction = (c0, c1, c2, f, Px, Py) => Fp12.mul034(f, Fp2.mul(c2, Py), Fp2.mul(c1, Px), c0);
    }
    else
        throw new Error('bls: unknown twist type');
    const Fp2div2 = Fp2.div(Fp2.ONE, Fp2.mul(Fp2.ONE, _2n));
    function pointDouble(ell, Rx, Ry, Rz) {
        const t0 = Fp2.sqr(Ry); // Ry²
        const t1 = Fp2.sqr(Rz); // Rz²
        const t2 = Fp2.mulByB(Fp2.mul(t1, _3n)); // 3 * T1 * B
        const t3 = Fp2.mul(t2, _3n); // 3 * T2
        const t4 = Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(Ry, Rz)), t1), t0); // (Ry + Rz)² - T1 - T0
        const c0 = Fp2.sub(t2, t0); // T2 - T0 (i)
        const c1 = Fp2.mul(Fp2.sqr(Rx), _3n); // 3 * Rx²
        const c2 = Fp2.neg(t4); // -T4 (-h)
        ell.push([c0, c1, c2]);
        Rx = Fp2.mul(Fp2.mul(Fp2.mul(Fp2.sub(t0, t3), Rx), Ry), Fp2div2); // ((T0 - T3) * Rx * Ry) / 2
        Ry = Fp2.sub(Fp2.sqr(Fp2.mul(Fp2.add(t0, t3), Fp2div2)), Fp2.mul(Fp2.sqr(t2), _3n)); // ((T0 + T3) / 2)² - 3 * T2²
        Rz = Fp2.mul(t0, t4); // T0 * T4
        return { Rx, Ry, Rz };
    }
    function pointAdd(ell, Rx, Ry, Rz, Qx, Qy) {
        // Addition
        const t0 = Fp2.sub(Ry, Fp2.mul(Qy, Rz)); // Ry - Qy * Rz
        const t1 = Fp2.sub(Rx, Fp2.mul(Qx, Rz)); // Rx - Qx * Rz
        const c0 = Fp2.sub(Fp2.mul(t0, Qx), Fp2.mul(t1, Qy)); // T0 * Qx - T1 * Qy == Ry * Qx  - Rx * Qy
        const c1 = Fp2.neg(t0); // -T0 == Qy * Rz - Ry
        const c2 = t1; // == Rx - Qx * Rz
        ell.push([c0, c1, c2]);
        const t2 = Fp2.sqr(t1); // T1²
        const t3 = Fp2.mul(t2, t1); // T2 * T1
        const t4 = Fp2.mul(t2, Rx); // T2 * Rx
        const t5 = Fp2.add(Fp2.sub(t3, Fp2.mul(t4, _2n)), Fp2.mul(Fp2.sqr(t0), Rz)); // T3 - 2 * T4 + T0² * Rz
        Rx = Fp2.mul(t1, t5); // T1 * T5
        Ry = Fp2.sub(Fp2.mul(Fp2.sub(t4, t5), t0), Fp2.mul(t3, Ry)); // (T4 - T5) * T0 - T3 * Ry
        Rz = Fp2.mul(Rz, t3); // Rz * T3
        return { Rx, Ry, Rz };
    }
    // Pre-compute coefficients for sparse multiplication
    // Point addition and point double calculations is reused for coefficients
    // pointAdd happens only if bit set, so wNAF is reasonable. Unfortunately we cannot combine
    // add + double in windowed precomputes here, otherwise it would be single op (since X is static)
    const ATE_NAF = NAfDecomposition(CURVE.params.ateLoopSize);
    const calcPairingPrecomputes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.memoized)((point) => {
        const p = point;
        const { x, y } = p.toAffine();
        // prettier-ignore
        const Qx = x, Qy = y, negQy = Fp2.neg(y);
        // prettier-ignore
        let Rx = Qx, Ry = Qy, Rz = Fp2.ONE;
        const ell = [];
        for (const bit of ATE_NAF) {
            const cur = [];
            ({ Rx, Ry, Rz } = pointDouble(cur, Rx, Ry, Rz));
            if (bit)
                ({ Rx, Ry, Rz } = pointAdd(cur, Rx, Ry, Rz, Qx, bit === -1 ? negQy : Qy));
            ell.push(cur);
        }
        if (CURVE.postPrecompute) {
            const last = ell[ell.length - 1];
            CURVE.postPrecompute(Rx, Ry, Rz, Qx, Qy, pointAdd.bind(null, last));
        }
        return ell;
    });
    function millerLoopBatch(pairs, withFinalExponent = false) {
        let f12 = Fp12.ONE;
        if (pairs.length) {
            const ellLen = pairs[0][0].length;
            for (let i = 0; i < ellLen; i++) {
                f12 = Fp12.sqr(f12); // This allows us to do sqr only one time for all pairings
                // NOTE: we apply multiple pairings in parallel here
                for (const [ell, Px, Py] of pairs) {
                    for (const [c0, c1, c2] of ell[i])
                        f12 = lineFunction(c0, c1, c2, f12, Px, Py);
                }
            }
        }
        if (BLS_X_IS_NEGATIVE)
            f12 = Fp12.conjugate(f12);
        return withFinalExponent ? Fp12.finalExponentiate(f12) : f12;
    }
    // Calculates product of multiple pairings
    // This up to x2 faster than just `map(({g1, g2})=>pairing({g1,g2}))`
    function pairingBatch(pairs, withFinalExponent = true) {
        const res = [];
        // Cache precomputed toAffine for all points
        (0,_curve_js__WEBPACK_IMPORTED_MODULE_3__.normalizeZ)(G1.Point, 'pz', pairs.map(({ g1 }) => g1));
        (0,_curve_js__WEBPACK_IMPORTED_MODULE_3__.normalizeZ)(G2.Point, 'pz', pairs.map(({ g2 }) => g2));
        for (const { g1, g2 } of pairs) {
            if (g1.is0() || g2.is0())
                throw new Error('pairing is not available for ZERO point');
            // This uses toAffine inside
            g1.assertValidity();
            g2.assertValidity();
            const Qa = g1.toAffine();
            res.push([calcPairingPrecomputes(g2), Qa.x, Qa.y]);
        }
        return millerLoopBatch(res, withFinalExponent);
    }
    // Calculates bilinear pairing
    function pairing(Q, P, withFinalExponent = true) {
        return pairingBatch([{ g1: Q, g2: P }], withFinalExponent);
    }
    const rand = CURVE.randomBytes || _utils_js__WEBPACK_IMPORTED_MODULE_4__.randomBytes;
    const utils = {
        randomPrivateKey: () => {
            const length = (0,_modular_js__WEBPACK_IMPORTED_MODULE_5__.getMinHashLength)(Fr.ORDER);
            return (0,_modular_js__WEBPACK_IMPORTED_MODULE_5__.mapHashToField)(rand(length), Fr.ORDER);
        },
        calcPairingPrecomputes,
    };
    function aNonEmpty(arr) {
        if (!Array.isArray(arr) || arr.length === 0)
            throw new Error('expected non-empty array');
    }
    function normP1(point) {
        return point instanceof G1.Point ? point : G1.Point.fromHex(point);
    }
    function normP2(point) {
        return point instanceof G2.Point ? point : Signature.fromHex(point);
    }
    // TODO: add verifyBatch, fix types, Export Signature property,
    // actually expose the generated APIs
    function createBls(PubCurve, SigCurve) {
        function normPub(point) {
            return point instanceof PubCurve.Point ? point : PubCurve.Point.fromHex(point);
        }
        function normSig(point) {
            return point instanceof SigCurve.Point ? point : SigCurve.Point.fromHex(point);
        }
        function amsg(m) {
            if (!(m instanceof SigCurve.Point))
                throw new Error(`expected valid message hashed to ${isLongSigs ? 'G2' : 'G1'} curve`);
            return m;
        }
        // TODO: is this always ok?
        const isLongSigs = SigCurve.Point.Fp.BYTES > PubCurve.Point.Fp.BYTES;
        return {
            // P = pk x G
            getPublicKey(privateKey) {
                return PubCurve.Point.fromPrivateKey(privateKey);
            },
            // S = pk x H(m)
            sign(message, privateKey, unusedArg) {
                if (unusedArg != null)
                    throw new Error('sign() expects 2 arguments');
                amsg(message).assertValidity();
                return message.multiply(PubCurve.normPrivateKeyToScalar(privateKey));
            },
            // Checks if pairing of public key & hash is equal to pairing of generator & signature.
            // e(P, H(m)) == e(G, S)
            // e(S, G) == e(H(m), P)
            verify(signature, message, publicKey, unusedArg) {
                if (unusedArg != null)
                    throw new Error('verify() expects 3 arguments');
                signature = normSig(signature);
                publicKey = normPub(publicKey);
                const P = publicKey.negate();
                const G = PubCurve.Point.BASE;
                const Hm = amsg(message);
                const S = signature;
                // This code was changed in 1.9.x:
                // Before it was G.negate() in G2, now it's always pubKey.negate
                // TODO: understand if this is OK?
                // prettier-ignore
                const exp_ = isLongSigs ? [
                    { g1: P, g2: Hm },
                    { g1: G, g2: S }
                ] : [
                    { g1: Hm, g2: P },
                    { g1: S, g2: G }
                ];
                // TODO
                // @ts-ignore
                const exp = pairingBatch(exp_);
                return Fp12.eql(exp, Fp12.ONE);
            },
            // Adds a bunch of public key points together.
            // pk1 + pk2 + pk3 = pkA
            aggregatePublicKeys(publicKeys) {
                aNonEmpty(publicKeys);
                publicKeys = publicKeys.map((pub) => normPub(pub));
                const agg = publicKeys.reduce((sum, p) => sum.add(p), PubCurve.Point.ZERO);
                agg.assertValidity();
                return agg;
            },
            // Adds a bunch of signature points together.
            // pk1 + pk2 + pk3 = pkA
            aggregateSignatures(signatures) {
                aNonEmpty(signatures);
                signatures = signatures.map((sig) => normSig(sig));
                const agg = signatures.reduce((sum, s) => sum.add(s), SigCurve.Point.ZERO);
                agg.assertValidity();
                return agg;
            },
            hash(messageBytes, DST) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.abytes)(messageBytes);
                const opts = DST ? { DST } : undefined;
                return SigCurve.hashToCurve(messageBytes, opts);
            },
            // @ts-ignore
            Signature: isLongSigs ? CURVE.G2.Signature : CURVE.G1.ShortSignature,
        };
    }
    const longSignatures = createBls(G1, G2);
    const shortSignatures = createBls(G2, G1);
    // LEGACY code
    const { ShortSignature } = CURVE.G1;
    const { Signature } = CURVE.G2;
    function normP1Hash(point, htfOpts) {
        return point instanceof G1.Point
            ? point
            : shortSignatures.hash((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.ensureBytes)('point', point), htfOpts?.DST);
    }
    function normP2Hash(point, htfOpts) {
        return point instanceof G2.Point
            ? point
            : longSignatures.hash((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.ensureBytes)('point', point), htfOpts?.DST);
    }
    function getPublicKey(privateKey) {
        return longSignatures.getPublicKey(privateKey).toBytes(true);
    }
    function getPublicKeyForShortSignatures(privateKey) {
        return shortSignatures.getPublicKey(privateKey).toBytes(true);
    }
    function sign(message, privateKey, htfOpts) {
        const Hm = normP2Hash(message, htfOpts);
        const S = longSignatures.sign(Hm, privateKey);
        return message instanceof G2.Point ? S : Signature.toBytes(S);
    }
    function signShortSignature(message, privateKey, htfOpts) {
        const Hm = normP1Hash(message, htfOpts);
        const S = shortSignatures.sign(Hm, privateKey);
        return message instanceof G1.Point ? S : ShortSignature.toBytes(S);
    }
    function verify(signature, message, publicKey, htfOpts) {
        const Hm = normP2Hash(message, htfOpts);
        return longSignatures.verify(signature, Hm, publicKey);
    }
    function verifyShortSignature(signature, message, publicKey, htfOpts) {
        const Hm = normP1Hash(message, htfOpts);
        return shortSignatures.verify(signature, Hm, publicKey);
    }
    function aggregatePublicKeys(publicKeys) {
        const agg = longSignatures.aggregatePublicKeys(publicKeys);
        return publicKeys[0] instanceof G1.Point ? agg : agg.toBytes(true);
    }
    function aggregateSignatures(signatures) {
        const agg = longSignatures.aggregateSignatures(signatures);
        return signatures[0] instanceof G2.Point ? agg : Signature.toBytes(agg);
    }
    function aggregateShortSignatures(signatures) {
        const agg = shortSignatures.aggregateSignatures(signatures);
        return signatures[0] instanceof G1.Point ? agg : ShortSignature.toBytes(agg);
    }
    // https://ethresear.ch/t/fast-verification-of-multiple-bls-signatures/5407
    // e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))
    // TODO: maybe `{message: G2Hex, publicKey: G1Hex}[]` instead?
    function verifyBatch(signature, messages, publicKeys, htfOpts) {
        aNonEmpty(messages);
        if (publicKeys.length !== messages.length)
            throw new Error('amount of public keys and messages should be equal');
        const sig = normP2(signature);
        const nMessages = messages.map((i) => normP2Hash(i, htfOpts));
        const nPublicKeys = publicKeys.map(normP1);
        // NOTE: this works only for exact same object
        const messagePubKeyMap = new Map();
        for (let i = 0; i < nPublicKeys.length; i++) {
            const pub = nPublicKeys[i];
            const msg = nMessages[i];
            let keys = messagePubKeyMap.get(msg);
            if (keys === undefined) {
                keys = [];
                messagePubKeyMap.set(msg, keys);
            }
            keys.push(pub);
        }
        const paired = [];
        try {
            for (const [msg, keys] of messagePubKeyMap) {
                const groupPublicKey = keys.reduce((acc, msg) => acc.add(msg));
                paired.push({ g1: groupPublicKey, g2: msg });
            }
            paired.push({ g1: G1.Point.BASE.negate(), g2: sig });
            return Fp12.eql(pairingBatch(paired), Fp12.ONE);
        }
        catch {
            return false;
        }
    }
    G1.Point.BASE.precompute(4);
    return {
        longSignatures,
        shortSignatures,
        millerLoopBatch,
        pairing,
        pairingBatch,
        // TODO!!!
        verifyBatch,
        curves: {
            G1: G1_.Point,
            G2: G2_.Point,
        },
        fields: {
            Fr,
            Fp,
            Fp2,
            Fp6,
            Fp12,
        },
        params: {
            ateLoopSize: CURVE.params.ateLoopSize,
            twistType: CURVE.params.twistType,
            // deprecated
            r: CURVE.params.r,
            G1b: CURVE.G1.b,
            G2b: CURVE.G2.b,
        },
        utils,
        // deprecated
        getPublicKey,
        getPublicKeyForShortSignatures,
        sign,
        signShortSignature,
        verify,
        verifyShortSignature,
        aggregatePublicKeys,
        aggregateSignatures,
        aggregateShortSignatures,
        G1,
        G2,
        Signature,
        ShortSignature,
    };
}
//# sourceMappingURL=bls.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/curve.js":
/*!**********************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/curve.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "negateCt": () => (/* binding */ negateCt),
/* harmony export */   "normalizeZ": () => (/* binding */ normalizeZ),
/* harmony export */   "wNAF": () => (/* binding */ wNAF),
/* harmony export */   "mulEndoUnsafe": () => (/* binding */ mulEndoUnsafe),
/* harmony export */   "pippenger": () => (/* binding */ pippenger),
/* harmony export */   "precomputeMSMUnsafe": () => (/* binding */ precomputeMSMUnsafe),
/* harmony export */   "validateBasic": () => (/* binding */ validateBasic),
/* harmony export */   "_createCurveFields": () => (/* binding */ _createCurveFields)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/**
 * Methods for elliptic curve multiplication by scalars.
 * Contains wNAF, pippenger
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */


const _0n = BigInt(0);
const _1n = BigInt(1);
function negateCt(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
}
/**
 * Takes a bunch of Projective Points but executes only one
 * inversion on all of them. Inversion is very slow operation,
 * so this improves performance massively.
 * Optimization: converts a list of projective points to a list of identical points with Z=1.
 */
function normalizeZ(c, property, points) {
    const getz = property === 'pz' ? (p) => p.pz : (p) => p.ez;
    const toInv = (0,_modular_js__WEBPACK_IMPORTED_MODULE_0__.FpInvertBatch)(c.Fp, points.map(getz));
    // @ts-ignore
    const affined = points.map((p, i) => p.toAffine(toInv[i]));
    return affined.map(c.fromAffine);
}
function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
        throw new Error('invalid window size, expected [1..' + bits + '], got W=' + W);
}
function calcWOpts(W, scalarBits) {
    validateW(W, scalarBits);
    const windows = Math.ceil(scalarBits / W) + 1; // W=8 33. Not 32, because we skip zero
    const windowSize = 2 ** (W - 1); // W=8 128. Not 256, because we skip zero
    const maxNumber = 2 ** W; // W=8 256
    const mask = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)(W); // W=8 255 == mask 0b11111111
    const shiftBy = BigInt(W); // W=8 8
    return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window, wOpts) {
    const { windowSize, mask, maxNumber, shiftBy } = wOpts;
    let wbits = Number(n & mask); // extract W bits.
    let nextN = n >> shiftBy; // shift number by W bits.
    // What actually happens here:
    // const highestBit = Number(mask ^ (mask >> 1n));
    // let wbits2 = wbits - 1; // skip zero
    // if (wbits2 & highestBit) { wbits2 ^= Number(mask); // (~);
    // split if bits > max: +224 => 256-32
    if (wbits > windowSize) {
        // we skip zero, which means instead of `>= size-1`, we do `> size`
        wbits -= maxNumber; // -32, can be maxNumber - wbits, but then we need to set isNeg here.
        nextN += _1n; // +256 (carry)
    }
    const offsetStart = window * windowSize;
    const offset = offsetStart + Math.abs(wbits) - 1; // -1 because we skip zero
    const isZero = wbits === 0; // is current window slice a 0?
    const isNeg = wbits < 0; // is current window slice negative?
    const isNegF = window % 2 !== 0; // fake random statement for noise
    const offsetF = offsetStart; // fake offset for noise
    return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
        throw new Error('array expected');
    points.forEach((p, i) => {
        if (!(p instanceof c))
            throw new Error('invalid point at index ' + i);
    });
}
function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
        throw new Error('array of scalars expected');
    scalars.forEach((s, i) => {
        if (!field.isValid(s))
            throw new Error('invalid scalar at index ' + i);
    });
}
// Since points in different groups cannot be equal (different object constructor),
// we can have single place to store precomputes.
// Allows to make points frozen / immutable.
const pointPrecomputes = new WeakMap();
const pointWindowSizes = new WeakMap();
function getW(P) {
    return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
    if (n !== _0n)
        throw new Error('invalid wNAF');
}
/**
 * Elliptic curve multiplication of Point by scalar. Fragile.
 * Scalars should always be less than curve order: this should be checked inside of a curve itself.
 * Creates precomputation tables for fast multiplication:
 * - private scalar is split by fixed size windows of W bits
 * - every window point is collected from window's table & added to accumulator
 * - since windows are different, same point inside tables won't be accessed more than once per calc
 * - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
 * - +1 window is neccessary for wNAF
 * - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
 *
 * @todo Research returning 2d JS array of windows, instead of a single window.
 * This would allow windows to be in different memory locations
 */
function wNAF(c, bits) {
    return {
        constTimeNegate: negateCt,
        hasPrecomputes(elm) {
            return getW(elm) !== 1;
        },
        // non-const time multiplication ladder
        unsafeLadder(elm, n, p = c.ZERO) {
            let d = elm;
            while (n > _0n) {
                if (n & _1n)
                    p = p.add(d);
                d = d.double();
                n >>= _1n;
            }
            return p;
        },
        /**
         * Creates a wNAF precomputation window. Used for caching.
         * Default window size is set by `utils.precompute()` and is equal to 8.
         * Number of precomputed points depends on the curve size:
         * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
         * - 𝑊 is the window size
         * - 𝑛 is the bitlength of the curve order.
         * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
         * @param elm Point instance
         * @param W window size
         * @returns precomputed point tables flattened to a single array
         */
        precomputeWindow(elm, W) {
            const { windows, windowSize } = calcWOpts(W, bits);
            const points = [];
            let p = elm;
            let base = p;
            for (let window = 0; window < windows; window++) {
                base = p;
                points.push(base);
                // i=1, bc we skip 0
                for (let i = 1; i < windowSize; i++) {
                    base = base.add(p);
                    points.push(base);
                }
                p = base.double();
            }
            return points;
        },
        /**
         * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @returns real and fake (for const-time) points
         */
        wNAF(W, precomputes, n) {
            // Smaller version:
            // https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
            // TODO: check the scalar is less than group order?
            // wNAF behavior is undefined otherwise. But have to carefully remove
            // other checks before wNAF. ORDER == bits here.
            // Accumulators
            let p = c.ZERO;
            let f = c.BASE;
            // This code was first written with assumption that 'f' and 'p' will never be infinity point:
            // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
            // there is negate now: it is possible that negated element from low value
            // would be the same as high element, which will create carry into next window.
            // It's not obvious how this can fail, but still worth investigating later.
            const wo = calcWOpts(W, bits);
            for (let window = 0; window < wo.windows; window++) {
                // (n === _0n) is handled and not early-exited. isEven and offsetF are used for noise
                const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
                n = nextN;
                if (isZero) {
                    // bits are 0: add garbage to fake point
                    // Important part for const-time getPublicKey: add random "noise" point to f.
                    f = f.add(negateCt(isNegF, precomputes[offsetF]));
                }
                else {
                    // bits are 1: add to result point
                    p = p.add(negateCt(isNeg, precomputes[offset]));
                }
            }
            assert0(n);
            // Return both real and fake points: JIT won't eliminate f.
            // At this point there is a way to F be infinity-point even if p is not,
            // which makes it less const-time: around 1 bigint multiply.
            return { p, f };
        },
        /**
         * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
         * @param W window size
         * @param precomputes precomputed tables
         * @param n scalar (we don't check here, but should be less than curve order)
         * @param acc accumulator point to add result of multiplication
         * @returns point
         */
        wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
            const wo = calcWOpts(W, bits);
            for (let window = 0; window < wo.windows; window++) {
                if (n === _0n)
                    break; // Early-exit, skip 0 value
                const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
                n = nextN;
                if (isZero) {
                    // Window bits are 0: skip processing.
                    // Move to next window.
                    continue;
                }
                else {
                    const item = precomputes[offset];
                    acc = acc.add(isNeg ? item.negate() : item); // Re-using acc allows to save adds in MSM
                }
            }
            assert0(n);
            return acc;
        },
        getPrecomputes(W, P, transform) {
            // Calculate precomputes on a first run, reuse them after
            let comp = pointPrecomputes.get(P);
            if (!comp) {
                comp = this.precomputeWindow(P, W);
                if (W !== 1) {
                    // Doing transform outside of if brings 15% perf hit
                    if (typeof transform === 'function')
                        comp = transform(comp);
                    pointPrecomputes.set(P, comp);
                }
            }
            return comp;
        },
        wNAFCached(P, n, transform) {
            const W = getW(P);
            return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
        },
        wNAFCachedUnsafe(P, n, transform, prev) {
            const W = getW(P);
            if (W === 1)
                return this.unsafeLadder(P, n, prev); // For W=1 ladder is ~x2 faster
            return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
        },
        // We calculate precomputes for elliptic curve point multiplication
        // using windowed method. This specifies window size and
        // stores precomputed values. Usually only base point would be precomputed.
        setWindowSize(P, W) {
            validateW(W, bits);
            pointWindowSizes.set(P, W);
            pointPrecomputes.delete(P);
        },
    };
}
/**
 * Endomorphism-specific multiplication for Koblitz curves.
 * Cost: 128 dbl, 0-256 adds.
 */
function mulEndoUnsafe(c, point, k1, k2) {
    let acc = point;
    let p1 = c.ZERO;
    let p2 = c.ZERO;
    while (k1 > _0n || k2 > _0n) {
        if (k1 & _1n)
            p1 = p1.add(acc);
        if (k2 & _1n)
            p2 = p2.add(acc);
        acc = acc.double();
        k1 >>= _1n;
        k2 >>= _1n;
    }
    return { p1, p2 };
}
/**
 * Pippenger algorithm for multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
 * 30x faster vs naive addition on L=4096, 10x faster than precomputes.
 * For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
 * Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
 * @param c Curve Point constructor
 * @param fieldN field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @param scalars array of L scalars (aka private keys / bigints)
 */
function pippenger(c, fieldN, points, scalars) {
    // If we split scalars by some window (let's say 8 bits), every chunk will only
    // take 256 buckets even if there are 4096 scalars, also re-uses double.
    // TODO:
    // - https://eprint.iacr.org/2024/750.pdf
    // - https://tches.iacr.org/index.php/TCHES/article/view/10287
    // 0 is accepted in scalars
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    const plength = points.length;
    const slength = scalars.length;
    if (plength !== slength)
        throw new Error('arrays of points and scalars must have equal length');
    // if (plength === 0) throw new Error('array must be of length >= 2');
    const zero = c.ZERO;
    const wbits = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitLen)(BigInt(plength));
    let windowSize = 1; // bits
    if (wbits > 12)
        windowSize = wbits - 3;
    else if (wbits > 4)
        windowSize = wbits - 2;
    else if (wbits > 0)
        windowSize = 2;
    const MASK = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)(windowSize);
    const buckets = new Array(Number(MASK) + 1).fill(zero); // +1 for zero array
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero;
    for (let i = lastBits; i >= 0; i -= windowSize) {
        buckets.fill(zero);
        for (let j = 0; j < slength; j++) {
            const scalar = scalars[j];
            const wbits = Number((scalar >> BigInt(i)) & MASK);
            buckets[wbits] = buckets[wbits].add(points[j]);
        }
        let resI = zero; // not using this will do small speed-up, but will lose ct
        // Skip first bucket, because it is zero
        for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
            sumI = sumI.add(buckets[j]);
            resI = resI.add(sumI);
        }
        sum = sum.add(resI);
        if (i !== 0)
            for (let j = 0; j < windowSize; j++)
                sum = sum.double();
    }
    return sum;
}
/**
 * Precomputed multi-scalar multiplication (MSM, Pa + Qb + Rc + ...).
 * @param c Curve Point constructor
 * @param fieldN field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @returns function which multiplies points with scaars
 */
function precomputeMSMUnsafe(c, fieldN, points, windowSize) {
    /**
     * Performance Analysis of Window-based Precomputation
     *
     * Base Case (256-bit scalar, 8-bit window):
     * - Standard precomputation requires:
     *   - 31 additions per scalar × 256 scalars = 7,936 ops
     *   - Plus 255 summary additions = 8,191 total ops
     *   Note: Summary additions can be optimized via accumulator
     *
     * Chunked Precomputation Analysis:
     * - Using 32 chunks requires:
     *   - 255 additions per chunk
     *   - 256 doublings
     *   - Total: (255 × 32) + 256 = 8,416 ops
     *
     * Memory Usage Comparison:
     * Window Size | Standard Points | Chunked Points
     * ------------|-----------------|---------------
     *     4-bit   |     520         |      15
     *     8-bit   |    4,224        |     255
     *    10-bit   |   13,824        |   1,023
     *    16-bit   |  557,056        |  65,535
     *
     * Key Advantages:
     * 1. Enables larger window sizes due to reduced memory overhead
     * 2. More efficient for smaller scalar counts:
     *    - 16 chunks: (16 × 255) + 256 = 4,336 ops
     *    - ~2x faster than standard 8,191 ops
     *
     * Limitations:
     * - Not suitable for plain precomputes (requires 256 constant doublings)
     * - Performance degrades with larger scalar counts:
     *   - Optimal for ~256 scalars
     *   - Less efficient for 4096+ scalars (Pippenger preferred)
     */
    validateW(windowSize, fieldN.BITS);
    validateMSMPoints(points, c);
    const zero = c.ZERO;
    const tableSize = 2 ** windowSize - 1; // table size (without zero)
    const chunks = Math.ceil(fieldN.BITS / windowSize); // chunks of item
    const MASK = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)(windowSize);
    const tables = points.map((p) => {
        const res = [];
        for (let i = 0, acc = p; i < tableSize; i++) {
            res.push(acc);
            acc = acc.add(p);
        }
        return res;
    });
    return (scalars) => {
        validateMSMScalars(scalars, fieldN);
        if (scalars.length > points.length)
            throw new Error('array of scalars must be smaller than array of points');
        let res = zero;
        for (let i = 0; i < chunks; i++) {
            // No need to double if accumulator is still zero.
            if (res !== zero)
                for (let j = 0; j < windowSize; j++)
                    res = res.double();
            const shiftBy = BigInt(chunks * windowSize - (i + 1) * windowSize);
            for (let j = 0; j < scalars.length; j++) {
                const n = scalars[j];
                const curr = Number((n >> shiftBy) & MASK);
                if (!curr)
                    continue; // skip zero scalars chunks
                res = res.add(tables[j][curr - 1]);
            }
        }
        return res;
    };
}
// TODO: remove
/** @deprecated */
function validateBasic(curve) {
    (0,_modular_js__WEBPACK_IMPORTED_MODULE_0__.validateField)(curve.Fp);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.validateObject)(curve, {
        n: 'bigint',
        h: 'bigint',
        Gx: 'field',
        Gy: 'field',
    }, {
        nBitLength: 'isSafeInteger',
        nByteLength: 'isSafeInteger',
    });
    // Set defaults
    return Object.freeze({
        ...(0,_modular_js__WEBPACK_IMPORTED_MODULE_0__.nLength)(curve.n, curve.nBitLength),
        ...curve,
        ...{ p: curve.Fp.ORDER },
    });
}
function createField(order, field) {
    if (field) {
        if (field.ORDER !== order)
            throw new Error('Field.ORDER must match order: Fp == p, Fn == n');
        (0,_modular_js__WEBPACK_IMPORTED_MODULE_0__.validateField)(field);
        return field;
    }
    else {
        return (0,_modular_js__WEBPACK_IMPORTED_MODULE_0__.Field)(order);
    }
}
/** Validates CURVE opts and creates fields */
function _createCurveFields(type, CURVE, curveOpts = {}) {
    if (!CURVE || typeof CURVE !== 'object')
        throw new Error(`expected valid ${type} CURVE object`);
    for (const p of ['p', 'n', 'h']) {
        const val = CURVE[p];
        if (!(typeof val === 'bigint' && val > _0n))
            throw new Error(`CURVE.${p} must be positive bigint`);
    }
    const Fp = createField(CURVE.p, curveOpts.Fp);
    const Fn = createField(CURVE.n, curveOpts.Fn);
    const _b = type === 'weierstrass' ? 'b' : 'd';
    const params = ['Gx', 'Gy', 'a', _b];
    for (const p of params) {
        // @ts-ignore
        if (!Fp.isValid(CURVE[p]))
            throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
    }
    return { Fp, Fn };
}
//# sourceMappingURL=curve.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/edwards.js":
/*!************************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/edwards.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "edwards": () => (/* binding */ edwards),
/* harmony export */   "eddsa": () => (/* binding */ eddsa),
/* harmony export */   "twistedEdwards": () => (/* binding */ twistedEdwards)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _curve_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./curve.js */ "./node_modules/@noble/curves/esm/abstract/curve.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/**
 * Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
 * For design rationale of types / exports, see weierstrass module documentation.
 * Untwisted Edwards curves exist, but they aren't used in real-world protocols.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */



// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _8n = BigInt(8);
// verification rule is either zip215 or rfc8032 / nist186-5. Consult fromHex:
const VERIFY_DEFAULT = { zip215: true };
function isEdValidXY(Fp, CURVE, x, y) {
    const x2 = Fp.sqr(x);
    const y2 = Fp.sqr(y);
    const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
    const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
    return Fp.eql(left, right);
}
function edwards(CURVE, curveOpts = {}) {
    const { Fp, Fn } = (0,_curve_js__WEBPACK_IMPORTED_MODULE_0__._createCurveFields)('edwards', CURVE, curveOpts);
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__._validateObject)(curveOpts, {}, { uvRatio: 'function' });
    // Important:
    // There are some places where Fp.BYTES is used instead of nByteLength.
    // So far, everything has been tested with curves of Fp.BYTES == nByteLength.
    // TODO: test and find curves which behave otherwise.
    const MASK = _2n << (BigInt(Fn.BYTES * 8) - _1n);
    const modP = (n) => Fp.create(n); // Function overrides
    // sqrt(u/v)
    const uvRatio = curveOpts.uvRatio ||
        ((u, v) => {
            try {
                return { isValid: true, value: Fp.sqrt(Fp.div(u, v)) };
            }
            catch (e) {
                return { isValid: false, value: _0n };
            }
        });
    // Validate whether the passed curve params are valid.
    // equation ax² + y² = 1 + dx²y² should work for generator point.
    if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy))
        throw new Error('bad curve params: generator point');
    /**
     * Asserts coordinate is valid: 0 <= n < MASK.
     * Coordinates >= Fp.ORDER are allowed for zip215.
     */
    function acoord(title, n, banZero = false) {
        const min = banZero ? _1n : _0n;
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.aInRange)('coordinate ' + title, n, min, MASK);
        return n;
    }
    function aextpoint(other) {
        if (!(other instanceof Point))
            throw new Error('ExtendedPoint expected');
    }
    // Converts Extended point to default (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    const toAffineMemo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.memoized)((p, iz) => {
        const { ex: x, ey: y, ez: z } = p;
        const is0 = p.is0();
        if (iz == null)
            iz = is0 ? _8n : Fp.inv(z); // 8 was chosen arbitrarily
        const ax = modP(x * iz);
        const ay = modP(y * iz);
        const zz = modP(z * iz);
        if (is0)
            return { x: _0n, y: _1n };
        if (zz !== _1n)
            throw new Error('invZ was invalid');
        return { x: ax, y: ay };
    });
    const assertValidMemo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.memoized)((p) => {
        const { a, d } = CURVE;
        if (p.is0())
            throw new Error('bad point: ZERO'); // TODO: optimize, with vars below?
        // Equation in affine coordinates: ax² + y² = 1 + dx²y²
        // Equation in projective coordinates (X/Z, Y/Z, Z):  (aX² + Y²)Z² = Z⁴ + dX²Y²
        const { ex: X, ey: Y, ez: Z, et: T } = p;
        const X2 = modP(X * X); // X²
        const Y2 = modP(Y * Y); // Y²
        const Z2 = modP(Z * Z); // Z²
        const Z4 = modP(Z2 * Z2); // Z⁴
        const aX2 = modP(X2 * a); // aX²
        const left = modP(Z2 * modP(aX2 + Y2)); // (aX² + Y²)Z²
        const right = modP(Z4 + modP(d * modP(X2 * Y2))); // Z⁴ + dX²Y²
        if (left !== right)
            throw new Error('bad point: equation left != right (1)');
        // In Extended coordinates we also have T, which is x*y=T/Z: check X*Y == Z*T
        const XY = modP(X * Y);
        const ZT = modP(Z * T);
        if (XY !== ZT)
            throw new Error('bad point: equation left != right (2)');
        return true;
    });
    // Extended Point works in extended coordinates: (X, Y, Z, T) ∋ (x=X/Z, y=Y/Z, T=xy).
    // https://en.wikipedia.org/wiki/Twisted_Edwards_curve#Extended_coordinates
    class Point {
        constructor(ex, ey, ez, et) {
            this.ex = acoord('x', ex);
            this.ey = acoord('y', ey);
            this.ez = acoord('z', ez, true);
            this.et = acoord('t', et);
            Object.freeze(this);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        static fromAffine(p) {
            if (p instanceof Point)
                throw new Error('extended point not allowed');
            const { x, y } = p || {};
            acoord('x', x);
            acoord('y', y);
            return new Point(x, y, _1n, modP(x * y));
        }
        static normalizeZ(points) {
            return (0,_curve_js__WEBPACK_IMPORTED_MODULE_0__.normalizeZ)(Point, 'ez', points);
        }
        // Multiscalar Multiplication
        static msm(points, scalars) {
            return (0,_curve_js__WEBPACK_IMPORTED_MODULE_0__.pippenger)(Point, Fn, points, scalars);
        }
        // "Private method", don't use it directly
        _setWindowSize(windowSize) {
            this.precompute(windowSize);
        }
        precompute(windowSize = 8, isLazy = true) {
            wnaf.setWindowSize(this, windowSize);
            if (!isLazy)
                this.multiply(_2n); // random number
            return this;
        }
        // Not required for fromHex(), which always creates valid points.
        // Could be useful for fromAffine().
        assertValidity() {
            assertValidMemo(this);
        }
        // Compare one point to another.
        equals(other) {
            aextpoint(other);
            const { ex: X1, ey: Y1, ez: Z1 } = this;
            const { ex: X2, ey: Y2, ez: Z2 } = other;
            const X1Z2 = modP(X1 * Z2);
            const X2Z1 = modP(X2 * Z1);
            const Y1Z2 = modP(Y1 * Z2);
            const Y2Z1 = modP(Y2 * Z1);
            return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        negate() {
            // Flips point sign to a negative one (-x, y in affine coords)
            return new Point(modP(-this.ex), this.ey, this.ez, modP(-this.et));
        }
        // Fast algo for doubling Extended Point.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#doubling-dbl-2008-hwcd
        // Cost: 4M + 4S + 1*a + 6add + 1*2.
        double() {
            const { a } = CURVE;
            const { ex: X1, ey: Y1, ez: Z1 } = this;
            const A = modP(X1 * X1); // A = X12
            const B = modP(Y1 * Y1); // B = Y12
            const C = modP(_2n * modP(Z1 * Z1)); // C = 2*Z12
            const D = modP(a * A); // D = a*A
            const x1y1 = X1 + Y1;
            const E = modP(modP(x1y1 * x1y1) - A - B); // E = (X1+Y1)2-A-B
            const G = D + B; // G = D+B
            const F = G - C; // F = G-C
            const H = D - B; // H = D-B
            const X3 = modP(E * F); // X3 = E*F
            const Y3 = modP(G * H); // Y3 = G*H
            const T3 = modP(E * H); // T3 = E*H
            const Z3 = modP(F * G); // Z3 = F*G
            return new Point(X3, Y3, Z3, T3);
        }
        // Fast algo for adding 2 Extended Points.
        // https://hyperelliptic.org/EFD/g1p/auto-twisted-extended.html#addition-add-2008-hwcd
        // Cost: 9M + 1*a + 1*d + 7add.
        add(other) {
            aextpoint(other);
            const { a, d } = CURVE;
            const { ex: X1, ey: Y1, ez: Z1, et: T1 } = this;
            const { ex: X2, ey: Y2, ez: Z2, et: T2 } = other;
            const A = modP(X1 * X2); // A = X1*X2
            const B = modP(Y1 * Y2); // B = Y1*Y2
            const C = modP(T1 * d * T2); // C = T1*d*T2
            const D = modP(Z1 * Z2); // D = Z1*Z2
            const E = modP((X1 + Y1) * (X2 + Y2) - A - B); // E = (X1+Y1)*(X2+Y2)-A-B
            const F = D - C; // F = D-C
            const G = D + C; // G = D+C
            const H = modP(B - a * A); // H = B-a*A
            const X3 = modP(E * F); // X3 = E*F
            const Y3 = modP(G * H); // Y3 = G*H
            const T3 = modP(E * H); // T3 = E*H
            const Z3 = modP(F * G); // Z3 = F*G
            return new Point(X3, Y3, Z3, T3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        // Constant-time multiplication.
        multiply(scalar) {
            const n = scalar;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.aInRange)('scalar', n, _1n, CURVE_ORDER); // 1 <= scalar < L
            const { p, f } = wnaf.wNAFCached(this, n, Point.normalizeZ);
            return Point.normalizeZ([p, f])[0];
        }
        // Non-constant-time multiplication. Uses double-and-add algorithm.
        // It's faster, but should only be used when you don't care about
        // an exposed private key e.g. sig verification.
        // Does NOT allow scalars higher than CURVE.n.
        // Accepts optional accumulator to merge with multiply (important for sparse scalars)
        multiplyUnsafe(scalar, acc = Point.ZERO) {
            const n = scalar;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.aInRange)('scalar', n, _0n, CURVE_ORDER); // 0 <= scalar < L
            if (n === _0n)
                return Point.ZERO;
            if (this.is0() || n === _1n)
                return this;
            return wnaf.wNAFCachedUnsafe(this, n, Point.normalizeZ, acc);
        }
        // Checks if point is of small order.
        // If you add something to small order point, you will have "dirty"
        // point with torsion component.
        // Multiplies point by cofactor and checks if the result is 0.
        isSmallOrder() {
            return this.multiplyUnsafe(cofactor).is0();
        }
        // Multiplies point by curve order and checks if the result is 0.
        // Returns `false` is the point is dirty.
        isTorsionFree() {
            return wnaf.wNAFCachedUnsafe(this, CURVE_ORDER).is0();
        }
        // Converts Extended point to default (x, y) coordinates.
        // Can accept precomputed Z^-1 - for example, from invertBatch.
        toAffine(invertedZ) {
            return toAffineMemo(this, invertedZ);
        }
        clearCofactor() {
            if (cofactor === _1n)
                return this;
            return this.multiplyUnsafe(cofactor);
        }
        static fromBytes(bytes, zip215 = false) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.abytes)(bytes);
            return this.fromHex(bytes, zip215);
        }
        // Converts hash string or Uint8Array to Point.
        // Uses algo from RFC8032 5.1.3.
        static fromHex(hex, zip215 = false) {
            const { d, a } = CURVE;
            const len = Fp.BYTES;
            hex = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('pointHex', hex, len); // copy hex to a new array
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abool)('zip215', zip215);
            const normed = hex.slice(); // copy again, we'll manipulate it
            const lastByte = hex[len - 1]; // select last byte
            normed[len - 1] = lastByte & ~0x80; // clear last bit
            const y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bytesToNumberLE)(normed);
            // zip215=true is good for consensus-critical apps. =false follows RFC8032 / NIST186-5.
            // RFC8032 prohibits >= p, but ZIP215 doesn't
            // zip215=true:  0 <= y < MASK (2^256 for ed25519)
            // zip215=false: 0 <= y < P (2^255-19 for ed25519)
            const max = zip215 ? MASK : Fp.ORDER;
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.aInRange)('pointHex.y', y, _0n, max);
            // Ed25519: x² = (y²-1)/(dy²+1) mod p. Ed448: x² = (y²-1)/(dy²-1) mod p. Generic case:
            // ax²+y²=1+dx²y² => y²-1=dx²y²-ax² => y²-1=x²(dy²-a) => x²=(y²-1)/(dy²-a)
            const y2 = modP(y * y); // denominator is always non-0 mod p.
            const u = modP(y2 - _1n); // u = y² - 1
            const v = modP(d * y2 - a); // v = d y² + 1.
            let { isValid, value: x } = uvRatio(u, v); // √(u/v)
            if (!isValid)
                throw new Error('Point.fromHex: invalid y coordinate');
            const isXOdd = (x & _1n) === _1n; // There are 2 square roots. Use x_0 bit to select proper
            const isLastByteOdd = (lastByte & 0x80) !== 0; // x_0, last bit
            if (!zip215 && x === _0n && isLastByteOdd)
                // if x=0 and x_0 = 1, fail
                throw new Error('Point.fromHex: x=0 and x_0=1');
            if (isLastByteOdd !== isXOdd)
                x = modP(-x); // if x_0 != x mod 2, set x = p-x
            return Point.fromAffine({ x, y });
        }
        static fromPrivateScalar(scalar) {
            return Point.BASE.multiply(scalar);
        }
        toBytes() {
            const { x, y } = this.toAffine();
            const bytes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.numberToBytesLE)(y, Fp.BYTES); // each y has 2 x values (x, -y)
            bytes[bytes.length - 1] |= x & _1n ? 0x80 : 0; // when compressing, it's enough to store y
            return bytes; // and use the last byte to encode sign of x
        }
        /** @deprecated use `toBytes` */
        toRawBytes() {
            return this.toBytes();
        }
        toHex() {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.bytesToHex)(this.toBytes());
        }
        toString() {
            return `<Point ${this.is0() ? 'ZERO' : this.toHex()}>`;
        }
    }
    // base / generator point
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, _1n, modP(CURVE.Gx * CURVE.Gy));
    // zero / infinity / identity point
    Point.ZERO = new Point(_0n, _1n, _1n, _0n); // 0, 1, 1, 0
    // fields
    Point.Fp = Fp;
    Point.Fn = Fn;
    const wnaf = (0,_curve_js__WEBPACK_IMPORTED_MODULE_0__.wNAF)(Point, Fn.BYTES * 8); // Fn.BITS?
    return Point;
}
/**
 * Initializes EdDSA signatures over given Edwards curve.
 */
function eddsa(Point, eddsaOpts) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__._validateObject)(eddsaOpts, {
        hash: 'function',
    }, {
        adjustScalarBytes: 'function',
        randomBytes: 'function',
        domain: 'function',
        prehash: 'function',
        mapToCurve: 'function',
    });
    const { prehash, hash: cHash } = eddsaOpts;
    const { BASE: G, Fp, Fn } = Point;
    const CURVE_ORDER = Fn.ORDER;
    const randomBytes_ = eddsaOpts.randomBytes || _utils_js__WEBPACK_IMPORTED_MODULE_2__.randomBytes;
    const adjustScalarBytes = eddsaOpts.adjustScalarBytes || ((bytes) => bytes); // NOOP
    const domain = eddsaOpts.domain ||
        ((data, ctx, phflag) => {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abool)('phflag', phflag);
            if (ctx.length || phflag)
                throw new Error('Contexts/pre-hash are not supported');
            return data;
        }); // NOOP
    function modN(a) {
        return Fn.create(a);
    }
    // Little-endian SHA512 with modulo n
    function modN_LE(hash) {
        // Not using Fn.fromBytes: hash can be 2*Fn.BYTES
        return modN((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bytesToNumberLE)(hash));
    }
    // Get the hashed private scalar per RFC8032 5.1.5
    function getPrivateScalar(key) {
        const len = Fp.BYTES;
        key = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('private key', key, len);
        // Hash private key with curve's hash function to produce uniformingly random input
        // Check byte lengths: ensure(64, h(ensure(32, key)))
        const hashed = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('hashed private key', cHash(key), 2 * len);
        const head = adjustScalarBytes(hashed.slice(0, len)); // clear first half bits, produce FE
        const prefix = hashed.slice(len, 2 * len); // second half is called key prefix (5.1.6)
        const scalar = modN_LE(head); // The actual private scalar
        return { head, prefix, scalar };
    }
    // Convenience method that creates public key from scalar. RFC8032 5.1.5
    function getExtendedPublicKey(key) {
        const { head, prefix, scalar } = getPrivateScalar(key);
        const point = G.multiply(scalar); // Point on Edwards curve aka public key
        const pointBytes = point.toBytes();
        return { head, prefix, scalar, point, pointBytes };
    }
    // Calculates EdDSA pub key. RFC8032 5.1.5. Privkey is hashed. Use first half with 3 bits cleared
    function getPublicKey(privKey) {
        return getExtendedPublicKey(privKey).pointBytes;
    }
    // int('LE', SHA512(dom2(F, C) || msgs)) mod N
    function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
        const msg = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(...msgs);
        return modN_LE(cHash(domain(msg, (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('context', context), !!prehash)));
    }
    /** Signs message with privateKey. RFC8032 5.1.6 */
    function sign(msg, privKey, options = {}) {
        msg = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('message', msg);
        if (prehash)
            msg = prehash(msg); // for ed25519ph etc.
        const { prefix, scalar, pointBytes } = getExtendedPublicKey(privKey);
        const r = hashDomainToScalar(options.context, prefix, msg); // r = dom2(F, C) || prefix || PH(M)
        const R = G.multiply(r).toBytes(); // R = rG
        const k = hashDomainToScalar(options.context, R, pointBytes, msg); // R || A || PH(M)
        const s = modN(r + k * scalar); // S = (r + k * s) mod L
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.aInRange)('signature.s', s, _0n, CURVE_ORDER); // 0 <= s < l
        const L = Fp.BYTES;
        const res = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(R, (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.numberToBytesLE)(s, L));
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('result', res, L * 2); // 64-byte signature
    }
    const verifyOpts = VERIFY_DEFAULT;
    /**
     * Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
     * An extended group equation is checked.
     */
    function verify(sig, msg, publicKey, options = verifyOpts) {
        const { context, zip215 } = options;
        const len = Fp.BYTES; // Verifies EdDSA signature against message and public key. RFC8032 5.1.7.
        sig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('signature', sig, 2 * len); // An extended group equation is checked.
        msg = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('message', msg);
        publicKey = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.ensureBytes)('publicKey', publicKey, len);
        if (zip215 !== undefined)
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abool)('zip215', zip215);
        if (prehash)
            msg = prehash(msg); // for ed25519ph, etc
        const s = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bytesToNumberLE)(sig.slice(len, 2 * len));
        let A, R, SB;
        try {
            // zip215=true is good for consensus-critical apps. =false follows RFC8032 / NIST186-5.
            // zip215=true:  0 <= y < MASK (2^256 for ed25519)
            // zip215=false: 0 <= y < P (2^255-19 for ed25519)
            A = Point.fromHex(publicKey, zip215);
            R = Point.fromHex(sig.slice(0, len), zip215);
            SB = G.multiplyUnsafe(s); // 0 <= s < l is done inside
        }
        catch (error) {
            return false;
        }
        if (!zip215 && A.isSmallOrder())
            return false;
        const k = hashDomainToScalar(context, R.toBytes(), A.toBytes(), msg);
        const RkA = R.add(A.multiplyUnsafe(k));
        // Extended group equation
        // [8][S]B = [8]R + [8][k]A'
        return RkA.subtract(SB).clearCofactor().is0();
    }
    G.precompute(8); // Enable precomputes. Slows down first publicKey computation by 20ms.
    const utils = {
        getExtendedPublicKey,
        /** ed25519 priv keys are uniform 32b. No need to check for modulo bias, like in secp256k1. */
        randomPrivateKey: () => randomBytes_(Fp.BYTES),
        /**
         * We're doing scalar multiplication (used in getPublicKey etc) with precomputed BASE_POINT
         * values. This slows down first getPublicKey() by milliseconds (see Speed section),
         * but allows to speed-up subsequent getPublicKey() calls up to 20x.
         * @param windowSize 2, 4, 8, 16
         */
        precompute(windowSize = 8, point = Point.BASE) {
            return point.precompute(windowSize, false);
        },
    };
    return { getPublicKey, sign, verify, utils, Point };
}
function _eddsa_legacy_opts_to_new(c) {
    const CURVE = {
        a: c.a,
        d: c.d,
        p: c.Fp.ORDER,
        n: c.n,
        h: c.h,
        Gx: c.Gx,
        Gy: c.Gy,
    };
    const Fp = c.Fp;
    const Fn = (0,_modular_js__WEBPACK_IMPORTED_MODULE_3__.Field)(CURVE.n, c.nBitLength, true);
    const curveOpts = { Fp, Fn, uvRatio: c.uvRatio };
    const eddsaOpts = {
        hash: c.hash,
        randomBytes: c.randomBytes,
        adjustScalarBytes: c.adjustScalarBytes,
        domain: c.domain,
        prehash: c.prehash,
        mapToCurve: c.mapToCurve,
    };
    return { CURVE, curveOpts, eddsaOpts };
}
function _eddsa_new_output_to_legacy(c, eddsa) {
    const legacy = Object.assign({}, eddsa, { ExtendedPoint: eddsa.Point, CURVE: c });
    return legacy;
}
// TODO: remove. Use eddsa
function twistedEdwards(c) {
    const { CURVE, curveOpts, eddsaOpts } = _eddsa_legacy_opts_to_new(c);
    const Point = edwards(CURVE, curveOpts);
    const EDDSA = eddsa(Point, eddsaOpts);
    return _eddsa_new_output_to_legacy(c, EDDSA);
}
//# sourceMappingURL=edwards.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/hash-to-curve.js":
/*!******************************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/hash-to-curve.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "expand_message_xmd": () => (/* binding */ expand_message_xmd),
/* harmony export */   "expand_message_xof": () => (/* binding */ expand_message_xof),
/* harmony export */   "hash_to_field": () => (/* binding */ hash_to_field),
/* harmony export */   "isogenyMap": () => (/* binding */ isogenyMap),
/* harmony export */   "createHasher": () => (/* binding */ createHasher)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");


// Octet Stream to Integer. "spec" implementation of os2ip is 2.5x slower vs bytesToNumberBE.
const os2ip = _utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE;
// Integer to Octet Stream (numberToBytesBE)
function i2osp(value, length) {
    anum(value);
    anum(length);
    if (value < 0 || value >= 1 << (8 * length))
        throw new Error('invalid I2OSP input: ' + value);
    const res = Array.from({ length }).fill(0);
    for (let i = length - 1; i >= 0; i--) {
        res[i] = value & 0xff;
        value >>>= 8;
    }
    return new Uint8Array(res);
}
function strxor(a, b) {
    const arr = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
        arr[i] = a[i] ^ b[i];
    }
    return arr;
}
function anum(item) {
    if (!Number.isSafeInteger(item))
        throw new Error('number expected');
}
/**
 * Produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
 * [RFC 9380 5.3.1](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.1).
 */
function expand_message_xmd(msg, DST, lenInBytes, H) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abytes)(msg);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abytes)(DST);
    anum(lenInBytes);
    // https://www.rfc-editor.org/rfc/rfc9380#section-5.3.3
    if (DST.length > 255)
        DST = H((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.utf8ToBytes)('H2C-OVERSIZE-DST-'), DST));
    const { outputLen: b_in_bytes, blockLen: r_in_bytes } = H;
    const ell = Math.ceil(lenInBytes / b_in_bytes);
    if (lenInBytes > 65535 || ell > 255)
        throw new Error('expand_message_xmd: invalid lenInBytes');
    const DST_prime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)(DST, i2osp(DST.length, 1));
    const Z_pad = i2osp(0, r_in_bytes);
    const l_i_b_str = i2osp(lenInBytes, 2); // len_in_bytes_str
    const b = new Array(ell);
    const b_0 = H((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)(Z_pad, msg, l_i_b_str, i2osp(0, 1), DST_prime));
    b[0] = H((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)(b_0, i2osp(1, 1), DST_prime));
    for (let i = 1; i <= ell; i++) {
        const args = [strxor(b_0, b[i - 1]), i2osp(i + 1, 1), DST_prime];
        b[i] = H((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)(...args));
    }
    const pseudo_random_bytes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.concatBytes)(...b);
    return pseudo_random_bytes.slice(0, lenInBytes);
}
/**
 * Produces a uniformly random byte string using an extendable-output function (XOF) H.
 * 1. The collision resistance of H MUST be at least k bits.
 * 2. H MUST be an XOF that has been proved indifferentiable from
 *    a random oracle under a reasonable cryptographic assumption.
 * [RFC 9380 5.3.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.3.2).
 */
function expand_message_xof(msg, DST, lenInBytes, k, H) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abytes)(msg);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abytes)(DST);
    anum(lenInBytes);
    // https://www.rfc-editor.org/rfc/rfc9380#section-5.3.3
    // DST = H('H2C-OVERSIZE-DST-' || a_very_long_DST, Math.ceil((lenInBytes * k) / 8));
    if (DST.length > 255) {
        const dkLen = Math.ceil((2 * k) / 8);
        DST = H.create({ dkLen }).update((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.utf8ToBytes)('H2C-OVERSIZE-DST-')).update(DST).digest();
    }
    if (lenInBytes > 65535 || DST.length > 255)
        throw new Error('expand_message_xof: invalid lenInBytes');
    return (H.create({ dkLen: lenInBytes })
        .update(msg)
        .update(i2osp(lenInBytes, 2))
        // 2. DST_prime = DST || I2OSP(len(DST), 1)
        .update(DST)
        .update(i2osp(DST.length, 1))
        .digest());
}
/**
 * Hashes arbitrary-length byte strings to a list of one or more elements of a finite field F.
 * [RFC 9380 5.2](https://www.rfc-editor.org/rfc/rfc9380#section-5.2).
 * @param msg a byte string containing the message to hash
 * @param count the number of elements of F to output
 * @param options `{DST: string, p: bigint, m: number, k: number, expand: 'xmd' | 'xof', hash: H}`, see above
 * @returns [u_0, ..., u_(count - 1)], a list of field elements.
 */
function hash_to_field(msg, count, options) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__._validateObject)(options, {
        p: 'bigint',
        m: 'number',
        k: 'number',
        hash: 'function',
    });
    const { p, k, m, hash, expand, DST: _DST } = options;
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isBytes)(_DST) && typeof _DST !== 'string')
        throw new Error('DST must be string or uint8array');
    if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isHash)(options.hash))
        throw new Error('expected valid hash');
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.abytes)(msg);
    anum(count);
    const DST = typeof _DST === 'string' ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.utf8ToBytes)(_DST) : _DST;
    const log2p = p.toString(2).length;
    const L = Math.ceil((log2p + k) / 8); // section 5.1 of ietf draft link above
    const len_in_bytes = count * m * L;
    let prb; // pseudo_random_bytes
    if (expand === 'xmd') {
        prb = expand_message_xmd(msg, DST, len_in_bytes, hash);
    }
    else if (expand === 'xof') {
        prb = expand_message_xof(msg, DST, len_in_bytes, k, hash);
    }
    else if (expand === '_internal_pass') {
        // for internal tests only
        prb = msg;
    }
    else {
        throw new Error('expand must be "xmd" or "xof"');
    }
    const u = new Array(count);
    for (let i = 0; i < count; i++) {
        const e = new Array(m);
        for (let j = 0; j < m; j++) {
            const elm_offset = L * (j + i * m);
            const tv = prb.subarray(elm_offset, elm_offset + L);
            e[j] = (0,_modular_js__WEBPACK_IMPORTED_MODULE_2__.mod)(os2ip(tv), p);
        }
        u[i] = e;
    }
    return u;
}
function isogenyMap(field, map) {
    // Make same order as in spec
    const coeff = map.map((i) => Array.from(i).reverse());
    return (x, y) => {
        const [xn, xd, yn, yd] = coeff.map((val) => val.reduce((acc, i) => field.add(field.mul(acc, x), i)));
        // 6.6.3
        // Exceptional cases of iso_map are inputs that cause the denominator of
        // either rational function to evaluate to zero; such cases MUST return
        // the identity point on E.
        const [xd_inv, yd_inv] = (0,_modular_js__WEBPACK_IMPORTED_MODULE_2__.FpInvertBatch)(field, [xd, yd], true);
        x = field.mul(xn, xd_inv); // xNum / xDen
        y = field.mul(y, field.mul(yn, yd_inv)); // y * (yNum / yDev)
        return { x, y };
    };
}
/** Creates hash-to-curve methods from EC Point and mapToCurve function. See {@link H2CHasher}. */
function createHasher(Point, mapToCurve, defaults) {
    if (typeof mapToCurve !== 'function')
        throw new Error('mapToCurve() must be defined');
    function map(num) {
        return Point.fromAffine(mapToCurve(num));
    }
    function clear(initial) {
        const P = initial.clearCofactor();
        if (P.equals(Point.ZERO))
            return Point.ZERO; // zero will throw in assert
        P.assertValidity();
        return P;
    }
    return {
        defaults,
        hashToCurve(msg, options) {
            const dst = defaults.DST ? defaults.DST : {};
            const opts = Object.assign({}, defaults, dst, options);
            const u = hash_to_field(msg, 2, opts);
            const u0 = map(u[0]);
            const u1 = map(u[1]);
            return clear(u0.add(u1));
        },
        encodeToCurve(msg, options) {
            const dst = defaults.encodeDST ? defaults.encodeDST : {};
            const opts = Object.assign({}, defaults, dst, options);
            const u = hash_to_field(msg, 1, opts);
            return clear(map(u[0]));
        },
        /** See {@link H2CHasher} */
        mapToCurve(scalars) {
            if (!Array.isArray(scalars))
                throw new Error('expected array of bigints');
            for (const i of scalars)
                if (typeof i !== 'bigint')
                    throw new Error('expected array of bigints');
            return clear(map(scalars));
        },
    };
}
//# sourceMappingURL=hash-to-curve.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/modular.js":
/*!************************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/modular.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mod": () => (/* binding */ mod),
/* harmony export */   "pow": () => (/* binding */ pow),
/* harmony export */   "pow2": () => (/* binding */ pow2),
/* harmony export */   "invert": () => (/* binding */ invert),
/* harmony export */   "tonelliShanks": () => (/* binding */ tonelliShanks),
/* harmony export */   "FpSqrt": () => (/* binding */ FpSqrt),
/* harmony export */   "isNegativeLE": () => (/* binding */ isNegativeLE),
/* harmony export */   "validateField": () => (/* binding */ validateField),
/* harmony export */   "FpPow": () => (/* binding */ FpPow),
/* harmony export */   "FpInvertBatch": () => (/* binding */ FpInvertBatch),
/* harmony export */   "FpDiv": () => (/* binding */ FpDiv),
/* harmony export */   "FpLegendre": () => (/* binding */ FpLegendre),
/* harmony export */   "FpIsSquare": () => (/* binding */ FpIsSquare),
/* harmony export */   "nLength": () => (/* binding */ nLength),
/* harmony export */   "Field": () => (/* binding */ Field),
/* harmony export */   "FpSqrtOdd": () => (/* binding */ FpSqrtOdd),
/* harmony export */   "FpSqrtEven": () => (/* binding */ FpSqrtEven),
/* harmony export */   "hashToPrivateScalar": () => (/* binding */ hashToPrivateScalar),
/* harmony export */   "getFieldBytesLength": () => (/* binding */ getFieldBytesLength),
/* harmony export */   "getMinHashLength": () => (/* binding */ getMinHashLength),
/* harmony export */   "mapHashToField": () => (/* binding */ mapHashToField)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * Utils for modular division and fields.
 * Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
 * There is no division: it is replaced by modular multiplicative inverse.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */

// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = /* @__PURE__ */ BigInt(2), _3n = /* @__PURE__ */ BigInt(3);
// prettier-ignore
const _4n = /* @__PURE__ */ BigInt(4), _5n = /* @__PURE__ */ BigInt(5);
const _8n = /* @__PURE__ */ BigInt(8);
// Calculates a modulo b
function mod(a, b) {
    const result = a % b;
    return result >= _0n ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
function pow(num, power, modulo) {
    return FpPow(Field(modulo), num, power);
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
    let res = x;
    while (power-- > _0n) {
        res *= res;
        res %= modulo;
    }
    return res;
}
/**
 * Inverses number over modulo.
 * Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
 */
function invert(number, modulo) {
    if (number === _0n)
        throw new Error('invert: expected non-zero number');
    if (modulo <= _0n)
        throw new Error('invert: expected positive modulus, got ' + modulo);
    // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
    let a = mod(number, modulo);
    let b = modulo;
    // prettier-ignore
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while (a !== _0n) {
        // JIT applies optimization if those two lines follow each other
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        // prettier-ignore
        b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}
// Not all roots are possible! Example which will throw:
// const NUM =
// n = 72057594037927816n;
// Fp = Field(BigInt('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab'));
function sqrt3mod4(Fp, n) {
    const p1div4 = (Fp.ORDER + _1n) / _4n;
    const root = Fp.pow(n, p1div4);
    // Throw if root^2 != n
    if (!Fp.eql(Fp.sqr(root), n))
        throw new Error('Cannot find square root');
    return root;
}
function sqrt5mod8(Fp, n) {
    const p5div8 = (Fp.ORDER - _5n) / _8n;
    const n2 = Fp.mul(n, _2n);
    const v = Fp.pow(n2, p5div8);
    const nv = Fp.mul(n, v);
    const i = Fp.mul(Fp.mul(nv, _2n), v);
    const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
    if (!Fp.eql(Fp.sqr(root), n))
        throw new Error('Cannot find square root');
    return root;
}
// TODO: Commented-out for now. Provide test vectors.
// Tonelli is too slow for extension fields Fp2.
// That means we can't use sqrt (c1, c2...) even for initialization constants.
// if (P % _16n === _9n) return sqrt9mod16;
// // prettier-ignore
// function sqrt9mod16<T>(Fp: IField<T>, n: T, p7div16?: bigint) {
//   if (p7div16 === undefined) p7div16 = (Fp.ORDER + BigInt(7)) / _16n;
//   const c1 = Fp.sqrt(Fp.neg(Fp.ONE)); //  1. c1 = sqrt(-1) in F, i.e., (c1^2) == -1 in F
//   const c2 = Fp.sqrt(c1);             //  2. c2 = sqrt(c1) in F, i.e., (c2^2) == c1 in F
//   const c3 = Fp.sqrt(Fp.neg(c1));     //  3. c3 = sqrt(-c1) in F, i.e., (c3^2) == -c1 in F
//   const c4 = p7div16;                 //  4. c4 = (q + 7) / 16        # Integer arithmetic
//   let tv1 = Fp.pow(n, c4);            //  1. tv1 = x^c4
//   let tv2 = Fp.mul(c1, tv1);          //  2. tv2 = c1 * tv1
//   const tv3 = Fp.mul(c2, tv1);        //  3. tv3 = c2 * tv1
//   let tv4 = Fp.mul(c3, tv1);          //  4. tv4 = c3 * tv1
//   const e1 = Fp.eql(Fp.sqr(tv2), n);  //  5.  e1 = (tv2^2) == x
//   const e2 = Fp.eql(Fp.sqr(tv3), n);  //  6.  e2 = (tv3^2) == x
//   tv1 = Fp.cmov(tv1, tv2, e1); //  7. tv1 = CMOV(tv1, tv2, e1)  # Select tv2 if (tv2^2) == x
//   tv2 = Fp.cmov(tv4, tv3, e2); //  8. tv2 = CMOV(tv4, tv3, e2)  # Select tv3 if (tv3^2) == x
//   const e3 = Fp.eql(Fp.sqr(tv2), n);  //  9.  e3 = (tv2^2) == x
//   return Fp.cmov(tv1, tv2, e3); // 10.  z = CMOV(tv1, tv2, e3) # Select the sqrt from tv1 and tv2
// }
/**
 * Tonelli-Shanks square root search algorithm.
 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
 * @param P field order
 * @returns function that takes field Fp (created from P) and number n
 */
function tonelliShanks(P) {
    // Initialization (precomputation).
    // Caching initialization could boost perf by 7%.
    if (P < BigInt(3))
        throw new Error('sqrt is not defined for small field');
    // Factor P - 1 = Q * 2^S, where Q is odd
    let Q = P - _1n;
    let S = 0;
    while (Q % _2n === _0n) {
        Q /= _2n;
        S++;
    }
    // Find the first quadratic non-residue Z >= 2
    let Z = _2n;
    const _Fp = Field(P);
    while (FpLegendre(_Fp, Z) === 1) {
        // Basic primality test for P. After x iterations, chance of
        // not finding quadratic non-residue is 2^x, so 2^1000.
        if (Z++ > 1000)
            throw new Error('Cannot find square root: probably non-prime P');
    }
    // Fast-path; usually done before Z, but we do "primality test".
    if (S === 1)
        return sqrt3mod4;
    // Slow-path
    // TODO: test on Fp2 and others
    let cc = _Fp.pow(Z, Q); // c = z^Q
    const Q1div2 = (Q + _1n) / _2n;
    return function tonelliSlow(Fp, n) {
        if (Fp.is0(n))
            return n;
        // Check if n is a quadratic residue using Legendre symbol
        if (FpLegendre(Fp, n) !== 1)
            throw new Error('Cannot find square root');
        // Initialize variables for the main loop
        let M = S;
        let c = Fp.mul(Fp.ONE, cc); // c = z^Q, move cc from field _Fp into field Fp
        let t = Fp.pow(n, Q); // t = n^Q, first guess at the fudge factor
        let R = Fp.pow(n, Q1div2); // R = n^((Q+1)/2), first guess at the square root
        // Main loop
        // while t != 1
        while (!Fp.eql(t, Fp.ONE)) {
            if (Fp.is0(t))
                return Fp.ZERO; // if t=0 return R=0
            let i = 1;
            // Find the smallest i >= 1 such that t^(2^i) ≡ 1 (mod P)
            let t_tmp = Fp.sqr(t); // t^(2^1)
            while (!Fp.eql(t_tmp, Fp.ONE)) {
                i++;
                t_tmp = Fp.sqr(t_tmp); // t^(2^2)...
                if (i === M)
                    throw new Error('Cannot find square root');
            }
            // Calculate the exponent for b: 2^(M - i - 1)
            const exponent = _1n << BigInt(M - i - 1); // bigint is important
            const b = Fp.pow(c, exponent); // b = 2^(M - i - 1)
            // Update variables
            M = i;
            c = Fp.sqr(b); // c = b^2
            t = Fp.mul(t, c); // t = (t * b^2)
            R = Fp.mul(R, b); // R = R*b
        }
        return R;
    };
}
/**
 * Square root for a finite field. Will try optimized versions first:
 *
 * 1. P ≡ 3 (mod 4)
 * 2. P ≡ 5 (mod 8)
 * 3. Tonelli-Shanks algorithm
 *
 * Different algorithms can give different roots, it is up to user to decide which one they want.
 * For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
 */
function FpSqrt(P) {
    // P ≡ 3 (mod 4) => √n = n^((P+1)/4)
    if (P % _4n === _3n)
        return sqrt3mod4;
    // P ≡ 5 (mod 8) => Atkin algorithm, page 10 of https://eprint.iacr.org/2012/685.pdf
    if (P % _8n === _5n)
        return sqrt5mod8;
    // P ≡ 9 (mod 16) not implemented, see above
    // Tonelli-Shanks algorithm
    return tonelliShanks(P);
}
// Little-endian check for first LE bit (last BE bit);
const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n) === _1n;
// prettier-ignore
const FIELD_FIELDS = [
    'create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr',
    'eql', 'add', 'sub', 'mul', 'pow', 'div',
    'addN', 'subN', 'mulN', 'sqrN'
];
function validateField(field) {
    const initial = {
        ORDER: 'bigint',
        MASK: 'bigint',
        BYTES: 'number',
        BITS: 'number',
    };
    const opts = FIELD_FIELDS.reduce((map, val) => {
        map[val] = 'function';
        return map;
    }, initial);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__._validateObject)(field, opts);
    // const max = 16384;
    // if (field.BYTES < 1 || field.BYTES > max) throw new Error('invalid field');
    // if (field.BITS < 1 || field.BITS > 8 * max) throw new Error('invalid field');
    return field;
}
// Generic field functions
/**
 * Same as `pow` but for Fp: non-constant-time.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 */
function FpPow(Fp, num, power) {
    if (power < _0n)
        throw new Error('invalid exponent, negatives unsupported');
    if (power === _0n)
        return Fp.ONE;
    if (power === _1n)
        return num;
    let p = Fp.ONE;
    let d = num;
    while (power > _0n) {
        if (power & _1n)
            p = Fp.mul(p, d);
        d = Fp.sqr(d);
        power >>= _1n;
    }
    return p;
}
/**
 * Efficiently invert an array of Field elements.
 * Exception-free. Will return `undefined` for 0 elements.
 * @param passZero map 0 to 0 (instead of undefined)
 */
function FpInvertBatch(Fp, nums, passZero = false) {
    const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : undefined);
    // Walk from first to last, multiply them by each other MOD p
    const multipliedAcc = nums.reduce((acc, num, i) => {
        if (Fp.is0(num))
            return acc;
        inverted[i] = acc;
        return Fp.mul(acc, num);
    }, Fp.ONE);
    // Invert last element
    const invertedAcc = Fp.inv(multipliedAcc);
    // Walk from last to first, multiply them by inverted each other MOD p
    nums.reduceRight((acc, num, i) => {
        if (Fp.is0(num))
            return acc;
        inverted[i] = Fp.mul(acc, inverted[i]);
        return Fp.mul(acc, num);
    }, invertedAcc);
    return inverted;
}
// TODO: remove
function FpDiv(Fp, lhs, rhs) {
    return Fp.mul(lhs, typeof rhs === 'bigint' ? invert(rhs, Fp.ORDER) : Fp.inv(rhs));
}
/**
 * Legendre symbol.
 * Legendre constant is used to calculate Legendre symbol (a | p)
 * which denotes the value of a^((p-1)/2) (mod p).
 *
 * * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
 * * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
 * * (a | p) ≡ 0    if a ≡ 0 (mod p)
 */
function FpLegendre(Fp, n) {
    // We can use 3rd argument as optional cache of this value
    // but seems unneeded for now. The operation is very fast.
    const p1mod2 = (Fp.ORDER - _1n) / _2n;
    const powered = Fp.pow(n, p1mod2);
    const yes = Fp.eql(powered, Fp.ONE);
    const zero = Fp.eql(powered, Fp.ZERO);
    const no = Fp.eql(powered, Fp.neg(Fp.ONE));
    if (!yes && !zero && !no)
        throw new Error('invalid Legendre symbol result');
    return yes ? 1 : zero ? 0 : -1;
}
// This function returns True whenever the value x is a square in the field F.
function FpIsSquare(Fp, n) {
    const l = FpLegendre(Fp, n);
    return l === 1;
}
// CURVE.n lengths
function nLength(n, nBitLength) {
    // Bit size, byte size of CURVE.n
    if (nBitLength !== undefined)
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.anumber)(nBitLength);
    const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
}
/**
 * Creates a finite field. Major performance optimizations:
 * * 1. Denormalized operations like mulN instead of mul.
 * * 2. Identical object shape: never add or remove keys.
 * * 3. `Object.freeze`.
 * Fragile: always run a benchmark on a change.
 * Security note: operations don't check 'isValid' for all elements for performance reasons,
 * it is caller responsibility to check this.
 * This is low-level code, please make sure you know what you're doing.
 *
 * Note about field properties:
 * * CHARACTERISTIC p = prime number, number of elements in main subgroup.
 * * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
 *
 * @param ORDER field order, probably prime, or could be composite
 * @param bitLen how many bits the field consumes
 * @param isLE (default: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field(ORDER, bitLenOrOpts, isLE = false, opts = {}) {
    if (ORDER <= _0n)
        throw new Error('invalid field: expected ORDER > 0, got ' + ORDER);
    let _nbitLength = undefined;
    let _sqrt = undefined;
    if (typeof bitLenOrOpts === 'object' && bitLenOrOpts != null) {
        if (opts.sqrt || isLE)
            throw new Error('cannot specify opts in two arguments');
        const _opts = bitLenOrOpts;
        if (_opts.BITS)
            _nbitLength = _opts.BITS;
        if (_opts.sqrt)
            _sqrt = _opts.sqrt;
        if (typeof _opts.isLE === 'boolean')
            isLE = _opts.isLE;
    }
    else {
        if (typeof bitLenOrOpts === 'number')
            _nbitLength = bitLenOrOpts;
        if (opts.sqrt)
            _sqrt = opts.sqrt;
    }
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, _nbitLength);
    if (BYTES > 2048)
        throw new Error('invalid field: expected ORDER of <= 2048 bytes');
    let sqrtP; // cached sqrtP
    const f = Object.freeze({
        ORDER,
        isLE,
        BITS,
        BYTES,
        MASK: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bitMask)(BITS),
        ZERO: _0n,
        ONE: _1n,
        create: (num) => mod(num, ORDER),
        isValid: (num) => {
            if (typeof num !== 'bigint')
                throw new Error('invalid field element: expected bigint, got ' + typeof num);
            return _0n <= num && num < ORDER; // 0 is valid element, but it's not invertible
        },
        is0: (num) => num === _0n,
        // is valid and invertible
        isValidNot0: (num) => !f.is0(num) && f.isValid(num),
        isOdd: (num) => (num & _1n) === _1n,
        neg: (num) => mod(-num, ORDER),
        eql: (lhs, rhs) => lhs === rhs,
        sqr: (num) => mod(num * num, ORDER),
        add: (lhs, rhs) => mod(lhs + rhs, ORDER),
        sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
        mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
        pow: (num, power) => FpPow(f, num, power),
        div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
        // Same as above, but doesn't normalize
        sqrN: (num) => num * num,
        addN: (lhs, rhs) => lhs + rhs,
        subN: (lhs, rhs) => lhs - rhs,
        mulN: (lhs, rhs) => lhs * rhs,
        inv: (num) => invert(num, ORDER),
        sqrt: _sqrt ||
            ((n) => {
                if (!sqrtP)
                    sqrtP = FpSqrt(ORDER);
                return sqrtP(f, n);
            }),
        toBytes: (num) => (isLE ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesLE)(num, BYTES) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(num, BYTES)),
        fromBytes: (bytes) => {
            if (bytes.length !== BYTES)
                throw new Error('Field.fromBytes: expected ' + BYTES + ' bytes, got ' + bytes.length);
            return isLE ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberLE)(bytes) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(bytes);
        },
        // TODO: we don't need it here, move out to separate fn
        invertBatch: (lst) => FpInvertBatch(f, lst),
        // We can't move this out because Fp6, Fp12 implement it
        // and it's unclear what to return in there.
        cmov: (a, b, c) => (c ? b : a),
    });
    return Object.freeze(f);
}
function FpSqrtOdd(Fp, elm) {
    if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? root : Fp.neg(root);
}
function FpSqrtEven(Fp, elm) {
    if (!Fp.isOdd)
        throw new Error("Field doesn't have isOdd");
    const root = Fp.sqrt(elm);
    return Fp.isOdd(root) ? Fp.neg(root) : root;
}
/**
 * "Constant-time" private key generation utility.
 * Same as mapKeyToField, but accepts less bytes (40 instead of 48 for 32-byte field).
 * Which makes it slightly more biased, less secure.
 * @deprecated use `mapKeyToField` instead
 */
function hashToPrivateScalar(hash, groupOrder, isLE = false) {
    hash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('privateHash', hash);
    const hashLen = hash.length;
    const minLen = nLength(groupOrder).nByteLength + 8;
    if (minLen < 24 || hashLen < minLen || hashLen > 1024)
        throw new Error('hashToPrivateScalar: expected ' + minLen + '-1024 bytes of input, got ' + hashLen);
    const num = isLE ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberLE)(hash) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(hash);
    return mod(num, groupOrder - _1n) + _1n;
}
/**
 * Returns total number of bytes consumed by the field element.
 * For example, 32 bytes for usual 256-bit weierstrass curve.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of field
 */
function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== 'bigint')
        throw new Error('field order must be bigint');
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
}
/**
 * Returns minimal amount of bytes that can be safely reduced
 * by field order.
 * Should be 2^-128 for 128-bit curve such as P256.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of target hash
 */
function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
}
/**
 * "Constant-time" private key generation utility.
 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 48 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function mapHashToField(key, fieldOrder, isLE = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
    if (len < 16 || len < minLen || len > 1024)
        throw new Error('expected ' + minLen + '-1024 bytes of input, got ' + len);
    const num = isLE ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberLE)(key) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(key);
    // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
    const reduced = mod(num, fieldOrder - _1n) + _1n;
    return isLE ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesLE)(reduced, fieldLen) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(reduced, fieldLen);
}
//# sourceMappingURL=modular.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/montgomery.js":
/*!***************************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/montgomery.js ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "montgomery": () => (/* binding */ montgomery)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/**
 * Montgomery curve methods. It's not really whole montgomery curve,
 * just bunch of very specific methods for X25519 / X448 from
 * [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748)
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */


const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
function validateOpts(curve) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__._validateObject)(curve, {
        adjustScalarBytes: 'function',
        powPminus2: 'function',
    });
    return Object.freeze({ ...curve });
}
function montgomery(curveDef) {
    const CURVE = validateOpts(curveDef);
    const { P, type, adjustScalarBytes, powPminus2, randomBytes: rand } = CURVE;
    const is25519 = type === 'x25519';
    if (!is25519 && type !== 'x448')
        throw new Error('invalid type');
    const randomBytes_ = rand || _utils_js__WEBPACK_IMPORTED_MODULE_1__.randomBytes;
    const montgomeryBits = is25519 ? 255 : 448;
    const fieldLen = is25519 ? 32 : 56;
    const Gu = is25519 ? BigInt(9) : BigInt(5);
    // RFC 7748 #5:
    // The constant a24 is (486662 - 2) / 4 = 121665 for curve25519/X25519 and
    // (156326 - 2) / 4 = 39081 for curve448/X448
    // const a = is25519 ? 156326n : 486662n;
    const a24 = is25519 ? BigInt(121665) : BigInt(39081);
    // RFC: x25519 "the resulting integer is of the form 2^254 plus
    // eight times a value between 0 and 2^251 - 1 (inclusive)"
    // x448: "2^447 plus four times a value between 0 and 2^445 - 1 (inclusive)"
    const minScalar = is25519 ? _2n ** BigInt(254) : _2n ** BigInt(447);
    const maxAdded = is25519
        ? BigInt(8) * _2n ** BigInt(251) - _1n
        : BigInt(4) * _2n ** BigInt(445) - _1n;
    const maxScalar = minScalar + maxAdded + _1n; // (inclusive)
    const modP = (n) => (0,_modular_js__WEBPACK_IMPORTED_MODULE_2__.mod)(n, P);
    const GuBytes = encodeU(Gu);
    function encodeU(u) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesLE)(modP(u), fieldLen);
    }
    function decodeU(u) {
        const _u = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('u coordinate', u, fieldLen);
        // RFC: When receiving such an array, implementations of X25519
        // (but not X448) MUST mask the most significant bit in the final byte.
        if (is25519)
            _u[31] &= 127; // 0b0111_1111
        // RFC: Implementations MUST accept non-canonical values and process them as
        // if they had been reduced modulo the field prime.  The non-canonical
        // values are 2^255 - 19 through 2^255 - 1 for X25519 and 2^448 - 2^224
        // - 1 through 2^448 - 1 for X448.
        return modP((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberLE)(_u));
    }
    function decodeScalar(scalar) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberLE)(adjustScalarBytes((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('scalar', scalar, fieldLen)));
    }
    function scalarMult(scalar, u) {
        const pu = montgomeryLadder(decodeU(u), decodeScalar(scalar));
        // Some public keys are useless, of low-order. Curve author doesn't think
        // it needs to be validated, but we do it nonetheless.
        // https://cr.yp.to/ecdh.html#validate
        if (pu === _0n)
            throw new Error('invalid private or public key received');
        return encodeU(pu);
    }
    // Computes public key from private. By doing scalar multiplication of base point.
    function scalarMultBase(scalar) {
        return scalarMult(scalar, GuBytes);
    }
    // cswap from RFC7748 "example code"
    function cswap(swap, x_2, x_3) {
        // dummy = mask(swap) AND (x_2 XOR x_3)
        // Where mask(swap) is the all-1 or all-0 word of the same length as x_2
        // and x_3, computed, e.g., as mask(swap) = 0 - swap.
        const dummy = modP(swap * (x_2 - x_3));
        x_2 = modP(x_2 - dummy); // x_2 = x_2 XOR dummy
        x_3 = modP(x_3 + dummy); // x_3 = x_3 XOR dummy
        return { x_2, x_3 };
    }
    /**
     * Montgomery x-only multiplication ladder.
     * @param pointU u coordinate (x) on Montgomery Curve 25519
     * @param scalar by which the point would be multiplied
     * @returns new Point on Montgomery curve
     */
    function montgomeryLadder(u, scalar) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aInRange)('u', u, _0n, P);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aInRange)('scalar', scalar, minScalar, maxScalar);
        const k = scalar;
        const x_1 = u;
        let x_2 = _1n;
        let z_2 = _0n;
        let x_3 = u;
        let z_3 = _1n;
        let swap = _0n;
        for (let t = BigInt(montgomeryBits - 1); t >= _0n; t--) {
            const k_t = (k >> t) & _1n;
            swap ^= k_t;
            ({ x_2, x_3 } = cswap(swap, x_2, x_3));
            ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
            swap = k_t;
            const A = x_2 + z_2;
            const AA = modP(A * A);
            const B = x_2 - z_2;
            const BB = modP(B * B);
            const E = AA - BB;
            const C = x_3 + z_3;
            const D = x_3 - z_3;
            const DA = modP(D * A);
            const CB = modP(C * B);
            const dacb = DA + CB;
            const da_cb = DA - CB;
            x_3 = modP(dacb * dacb);
            z_3 = modP(x_1 * modP(da_cb * da_cb));
            x_2 = modP(AA * BB);
            z_2 = modP(E * (AA + modP(a24 * E)));
        }
        ({ x_2, x_3 } = cswap(swap, x_2, x_3));
        ({ x_2: z_2, x_3: z_3 } = cswap(swap, z_2, z_3));
        const z2 = powPminus2(z_2); // `Fp.pow(x, P - _2n)` is much slower equivalent
        return modP(x_2 * z2); // Return x_2 * (z_2^(p - 2))
    }
    return {
        scalarMult,
        scalarMultBase,
        getSharedSecret: (privateKey, publicKey) => scalarMult(privateKey, publicKey),
        getPublicKey: (privateKey) => scalarMultBase(privateKey),
        utils: { randomPrivateKey: () => randomBytes_(fieldLen) },
        GuBytes: GuBytes.slice(),
    };
}
//# sourceMappingURL=montgomery.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/tower.js":
/*!**********************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/tower.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "psiFrobenius": () => (/* binding */ psiFrobenius),
/* harmony export */   "tower12": () => (/* binding */ tower12)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/**
 * Towered extension fields.
 * Rather than implementing a massive 12th-degree extension directly, it is more efficient
 * to build it up from smaller extensions: a tower of extensions.
 *
 * For BLS12-381, the Fp12 field is implemented as a quadratic (degree two) extension,
 * on top of a cubic (degree three) extension, on top of a quadratic extension of Fp.
 *
 * For more info: "Pairings for beginners" by Costello, section 7.3.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */


// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
function calcFrobeniusCoefficients(Fp, nonResidue, modulus, degree, num = 1, divisor) {
    const _divisor = BigInt(divisor === undefined ? degree : divisor);
    const towerModulus = modulus ** BigInt(degree);
    const res = [];
    for (let i = 0; i < num; i++) {
        const a = BigInt(i + 1);
        const powers = [];
        for (let j = 0, qPower = _1n; j < degree; j++) {
            const power = ((a * qPower - a) / _divisor) % towerModulus;
            powers.push(Fp.pow(nonResidue, power));
            qPower *= modulus;
        }
        res.push(powers);
    }
    return res;
}
// This works same at least for bls12-381, bn254 and bls12-377
function psiFrobenius(Fp, Fp2, base) {
    // GLV endomorphism Ψ(P)
    const PSI_X = Fp2.pow(base, (Fp.ORDER - _1n) / _3n); // u^((p-1)/3)
    const PSI_Y = Fp2.pow(base, (Fp.ORDER - _1n) / _2n); // u^((p-1)/2)
    function psi(x, y) {
        // This x10 faster than previous version in bls12-381
        const x2 = Fp2.mul(Fp2.frobeniusMap(x, 1), PSI_X);
        const y2 = Fp2.mul(Fp2.frobeniusMap(y, 1), PSI_Y);
        return [x2, y2];
    }
    // Ψ²(P) endomorphism (psi2(x) = psi(psi(x)))
    const PSI2_X = Fp2.pow(base, (Fp.ORDER ** _2n - _1n) / _3n); // u^((p^2 - 1)/3)
    // This equals -1, which causes y to be Fp2.neg(y).
    // But not sure if there are case when this is not true?
    const PSI2_Y = Fp2.pow(base, (Fp.ORDER ** _2n - _1n) / _2n); // u^((p^2 - 1)/3)
    if (!Fp2.eql(PSI2_Y, Fp2.neg(Fp2.ONE)))
        throw new Error('psiFrobenius: PSI2_Y!==-1');
    function psi2(x, y) {
        return [Fp2.mul(x, PSI2_X), Fp2.neg(y)];
    }
    // Map points
    const mapAffine = (fn) => (c, P) => {
        const affine = P.toAffine();
        const p = fn(affine.x, affine.y);
        return c.fromAffine({ x: p[0], y: p[1] });
    };
    const G2psi = mapAffine(psi);
    const G2psi2 = mapAffine(psi2);
    return { psi, psi2, G2psi, G2psi2, PSI_X, PSI_Y, PSI2_X, PSI2_Y };
}
function tower12(opts) {
    const { ORDER } = opts;
    // Fp
    const Fp = _modular_js__WEBPACK_IMPORTED_MODULE_0__.Field(ORDER);
    const FpNONRESIDUE = Fp.create(opts.NONRESIDUE || BigInt(-1));
    const Fpdiv2 = Fp.div(Fp.ONE, _2n); // 1/2
    // Fp2
    const FP2_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp, FpNONRESIDUE, Fp.ORDER, 2)[0];
    const Fp2Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
        c0: Fp.add(c0, r0),
        c1: Fp.add(c1, r1),
    });
    const Fp2Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
        c0: Fp.sub(c0, r0),
        c1: Fp.sub(c1, r1),
    });
    const Fp2Multiply = ({ c0, c1 }, rhs) => {
        if (typeof rhs === 'bigint')
            return { c0: Fp.mul(c0, rhs), c1: Fp.mul(c1, rhs) };
        // (a+bi)(c+di) = (ac−bd) + (ad+bc)i
        const { c0: r0, c1: r1 } = rhs;
        let t1 = Fp.mul(c0, r0); // c0 * o0
        let t2 = Fp.mul(c1, r1); // c1 * o1
        // (T1 - T2) + ((c0 + c1) * (r0 + r1) - (T1 + T2))*i
        const o0 = Fp.sub(t1, t2);
        const o1 = Fp.sub(Fp.mul(Fp.add(c0, c1), Fp.add(r0, r1)), Fp.add(t1, t2));
        return { c0: o0, c1: o1 };
    };
    const Fp2Square = ({ c0, c1 }) => {
        const a = Fp.add(c0, c1);
        const b = Fp.sub(c0, c1);
        const c = Fp.add(c0, c0);
        return { c0: Fp.mul(a, b), c1: Fp.mul(c, c1) };
    };
    const Fp2fromBigTuple = (tuple) => {
        if (tuple.length !== 2)
            throw new Error('invalid tuple');
        const fps = tuple.map((n) => Fp.create(n));
        return { c0: fps[0], c1: fps[1] };
    };
    function isValidC(num, ORDER) {
        return typeof num === 'bigint' && _0n <= num && num < ORDER;
    }
    const FP2_ORDER = ORDER * ORDER;
    const Fp2Nonresidue = Fp2fromBigTuple(opts.FP2_NONRESIDUE);
    const Fp2 = {
        ORDER: FP2_ORDER,
        isLE: Fp.isLE,
        NONRESIDUE: Fp2Nonresidue,
        BITS: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitLen)(FP2_ORDER),
        BYTES: Math.ceil((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitLen)(FP2_ORDER) / 8),
        MASK: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitLen)(FP2_ORDER)),
        ZERO: { c0: Fp.ZERO, c1: Fp.ZERO },
        ONE: { c0: Fp.ONE, c1: Fp.ZERO },
        create: (num) => num,
        isValid: ({ c0, c1 }) => isValidC(c0, FP2_ORDER) && isValidC(c1, FP2_ORDER),
        is0: ({ c0, c1 }) => Fp.is0(c0) && Fp.is0(c1),
        isValidNot0: (num) => !Fp2.is0(num) && Fp2.isValid(num),
        eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp.eql(c0, r0) && Fp.eql(c1, r1),
        neg: ({ c0, c1 }) => ({ c0: Fp.neg(c0), c1: Fp.neg(c1) }),
        pow: (num, power) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpPow(Fp2, num, power),
        invertBatch: (nums) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpInvertBatch(Fp2, nums),
        // Normalized
        add: Fp2Add,
        sub: Fp2Subtract,
        mul: Fp2Multiply,
        sqr: Fp2Square,
        // NonNormalized stuff
        addN: Fp2Add,
        subN: Fp2Subtract,
        mulN: Fp2Multiply,
        sqrN: Fp2Square,
        // Why inversion for bigint inside Fp instead of Fp2? it is even used in that context?
        div: (lhs, rhs) => Fp2.mul(lhs, typeof rhs === 'bigint' ? Fp.inv(Fp.create(rhs)) : Fp2.inv(rhs)),
        inv: ({ c0: a, c1: b }) => {
            // We wish to find the multiplicative inverse of a nonzero
            // element a + bu in Fp2. We leverage an identity
            //
            // (a + bu)(a - bu) = a² + b²
            //
            // which holds because u² = -1. This can be rewritten as
            //
            // (a + bu)(a - bu)/(a² + b²) = 1
            //
            // because a² + b² = 0 has no nonzero solutions for (a, b).
            // This gives that (a - bu)/(a² + b²) is the inverse
            // of (a + bu). Importantly, this can be computing using
            // only a single inversion in Fp.
            const factor = Fp.inv(Fp.create(a * a + b * b));
            return { c0: Fp.mul(factor, Fp.create(a)), c1: Fp.mul(factor, Fp.create(-b)) };
        },
        sqrt: (num) => {
            if (opts.Fp2sqrt)
                return opts.Fp2sqrt(num);
            // This is generic for all quadratic extensions (Fp2)
            const { c0, c1 } = num;
            if (Fp.is0(c1)) {
                // if c0 is quadratic residue
                if (_modular_js__WEBPACK_IMPORTED_MODULE_0__.FpLegendre(Fp, c0) === 1)
                    return Fp2.create({ c0: Fp.sqrt(c0), c1: Fp.ZERO });
                else
                    return Fp2.create({ c0: Fp.ZERO, c1: Fp.sqrt(Fp.div(c0, FpNONRESIDUE)) });
            }
            const a = Fp.sqrt(Fp.sub(Fp.sqr(c0), Fp.mul(Fp.sqr(c1), FpNONRESIDUE)));
            let d = Fp.mul(Fp.add(a, c0), Fpdiv2);
            const legendre = _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpLegendre(Fp, d);
            // -1, Quadratic non residue
            if (legendre === -1)
                d = Fp.sub(d, a);
            const a0 = Fp.sqrt(d);
            const candidateSqrt = Fp2.create({ c0: a0, c1: Fp.div(Fp.mul(c1, Fpdiv2), a0) });
            if (!Fp2.eql(Fp2.sqr(candidateSqrt), num))
                throw new Error('Cannot find square root');
            // Normalize root: at this point candidateSqrt ** 2 = num, but also -candidateSqrt ** 2 = num
            const x1 = candidateSqrt;
            const x2 = Fp2.neg(x1);
            const { re: re1, im: im1 } = Fp2.reim(x1);
            const { re: re2, im: im2 } = Fp2.reim(x2);
            if (im1 > im2 || (im1 === im2 && re1 > re2))
                return x1;
            return x2;
        },
        // Same as sgn0_m_eq_2 in RFC 9380
        isOdd: (x) => {
            const { re: x0, im: x1 } = Fp2.reim(x);
            const sign_0 = x0 % _2n;
            const zero_0 = x0 === _0n;
            const sign_1 = x1 % _2n;
            return BigInt(sign_0 || (zero_0 && sign_1)) == _1n;
        },
        // Bytes util
        fromBytes(b) {
            if (b.length !== Fp2.BYTES)
                throw new Error('fromBytes invalid length=' + b.length);
            return { c0: Fp.fromBytes(b.subarray(0, Fp.BYTES)), c1: Fp.fromBytes(b.subarray(Fp.BYTES)) };
        },
        toBytes: ({ c0, c1 }) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(Fp.toBytes(c0), Fp.toBytes(c1)),
        cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
            c0: Fp.cmov(c0, r0, c),
            c1: Fp.cmov(c1, r1, c),
        }),
        reim: ({ c0, c1 }) => ({ re: c0, im: c1 }),
        // multiply by u + 1
        mulByNonresidue: ({ c0, c1 }) => Fp2.mul({ c0, c1 }, Fp2Nonresidue),
        mulByB: opts.Fp2mulByB,
        fromBigTuple: Fp2fromBigTuple,
        frobeniusMap: ({ c0, c1 }, power) => ({
            c0,
            c1: Fp.mul(c1, FP2_FROBENIUS_COEFFICIENTS[power % 2]),
        }),
    };
    // Fp6
    const Fp6Add = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
        c0: Fp2.add(c0, r0),
        c1: Fp2.add(c1, r1),
        c2: Fp2.add(c2, r2),
    });
    const Fp6Subtract = ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => ({
        c0: Fp2.sub(c0, r0),
        c1: Fp2.sub(c1, r1),
        c2: Fp2.sub(c2, r2),
    });
    const Fp6Multiply = ({ c0, c1, c2 }, rhs) => {
        if (typeof rhs === 'bigint') {
            return {
                c0: Fp2.mul(c0, rhs),
                c1: Fp2.mul(c1, rhs),
                c2: Fp2.mul(c2, rhs),
            };
        }
        const { c0: r0, c1: r1, c2: r2 } = rhs;
        const t0 = Fp2.mul(c0, r0); // c0 * o0
        const t1 = Fp2.mul(c1, r1); // c1 * o1
        const t2 = Fp2.mul(c2, r2); // c2 * o2
        return {
            // t0 + (c1 + c2) * (r1 * r2) - (T1 + T2) * (u + 1)
            c0: Fp2.add(t0, Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), Fp2.add(r1, r2)), Fp2.add(t1, t2)))),
            // (c0 + c1) * (r0 + r1) - (T0 + T1) + T2 * (u + 1)
            c1: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c1), Fp2.add(r0, r1)), Fp2.add(t0, t1)), Fp2.mulByNonresidue(t2)),
            // T1 + (c0 + c2) * (r0 + r2) - T0 + T2
            c2: Fp2.sub(Fp2.add(t1, Fp2.mul(Fp2.add(c0, c2), Fp2.add(r0, r2))), Fp2.add(t0, t2)),
        };
    };
    const Fp6Square = ({ c0, c1, c2 }) => {
        let t0 = Fp2.sqr(c0); // c0²
        let t1 = Fp2.mul(Fp2.mul(c0, c1), _2n); // 2 * c0 * c1
        let t3 = Fp2.mul(Fp2.mul(c1, c2), _2n); // 2 * c1 * c2
        let t4 = Fp2.sqr(c2); // c2²
        return {
            c0: Fp2.add(Fp2.mulByNonresidue(t3), t0), // T3 * (u + 1) + T0
            c1: Fp2.add(Fp2.mulByNonresidue(t4), t1), // T4 * (u + 1) + T1
            // T1 + (c0 - c1 + c2)² + T3 - T0 - T4
            c2: Fp2.sub(Fp2.sub(Fp2.add(Fp2.add(t1, Fp2.sqr(Fp2.add(Fp2.sub(c0, c1), c2))), t3), t0), t4),
        };
    };
    const [FP6_FROBENIUS_COEFFICIENTS_1, FP6_FROBENIUS_COEFFICIENTS_2] = calcFrobeniusCoefficients(Fp2, Fp2Nonresidue, Fp.ORDER, 6, 2, 3);
    const Fp6 = {
        ORDER: Fp2.ORDER, // TODO: unused, but need to verify
        isLE: Fp2.isLE,
        BITS: 3 * Fp2.BITS,
        BYTES: 3 * Fp2.BYTES,
        MASK: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)(3 * Fp2.BITS),
        ZERO: { c0: Fp2.ZERO, c1: Fp2.ZERO, c2: Fp2.ZERO },
        ONE: { c0: Fp2.ONE, c1: Fp2.ZERO, c2: Fp2.ZERO },
        create: (num) => num,
        isValid: ({ c0, c1, c2 }) => Fp2.isValid(c0) && Fp2.isValid(c1) && Fp2.isValid(c2),
        is0: ({ c0, c1, c2 }) => Fp2.is0(c0) && Fp2.is0(c1) && Fp2.is0(c2),
        isValidNot0: (num) => !Fp6.is0(num) && Fp6.isValid(num),
        neg: ({ c0, c1, c2 }) => ({ c0: Fp2.neg(c0), c1: Fp2.neg(c1), c2: Fp2.neg(c2) }),
        eql: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }) => Fp2.eql(c0, r0) && Fp2.eql(c1, r1) && Fp2.eql(c2, r2),
        sqrt: _utils_js__WEBPACK_IMPORTED_MODULE_1__.notImplemented,
        // Do we need division by bigint at all? Should be done via order:
        div: (lhs, rhs) => Fp6.mul(lhs, typeof rhs === 'bigint' ? Fp.inv(Fp.create(rhs)) : Fp6.inv(rhs)),
        pow: (num, power) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpPow(Fp6, num, power),
        invertBatch: (nums) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpInvertBatch(Fp6, nums),
        // Normalized
        add: Fp6Add,
        sub: Fp6Subtract,
        mul: Fp6Multiply,
        sqr: Fp6Square,
        // NonNormalized stuff
        addN: Fp6Add,
        subN: Fp6Subtract,
        mulN: Fp6Multiply,
        sqrN: Fp6Square,
        inv: ({ c0, c1, c2 }) => {
            let t0 = Fp2.sub(Fp2.sqr(c0), Fp2.mulByNonresidue(Fp2.mul(c2, c1))); // c0² - c2 * c1 * (u + 1)
            let t1 = Fp2.sub(Fp2.mulByNonresidue(Fp2.sqr(c2)), Fp2.mul(c0, c1)); // c2² * (u + 1) - c0 * c1
            let t2 = Fp2.sub(Fp2.sqr(c1), Fp2.mul(c0, c2)); // c1² - c0 * c2
            // 1/(((c2 * T1 + c1 * T2) * v) + c0 * T0)
            let t4 = Fp2.inv(Fp2.add(Fp2.mulByNonresidue(Fp2.add(Fp2.mul(c2, t1), Fp2.mul(c1, t2))), Fp2.mul(c0, t0)));
            return { c0: Fp2.mul(t4, t0), c1: Fp2.mul(t4, t1), c2: Fp2.mul(t4, t2) };
        },
        // Bytes utils
        fromBytes: (b) => {
            if (b.length !== Fp6.BYTES)
                throw new Error('fromBytes invalid length=' + b.length);
            return {
                c0: Fp2.fromBytes(b.subarray(0, Fp2.BYTES)),
                c1: Fp2.fromBytes(b.subarray(Fp2.BYTES, 2 * Fp2.BYTES)),
                c2: Fp2.fromBytes(b.subarray(2 * Fp2.BYTES)),
            };
        },
        toBytes: ({ c0, c1, c2 }) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(Fp2.toBytes(c0), Fp2.toBytes(c1), Fp2.toBytes(c2)),
        cmov: ({ c0, c1, c2 }, { c0: r0, c1: r1, c2: r2 }, c) => ({
            c0: Fp2.cmov(c0, r0, c),
            c1: Fp2.cmov(c1, r1, c),
            c2: Fp2.cmov(c2, r2, c),
        }),
        fromBigSix: (t) => {
            if (!Array.isArray(t) || t.length !== 6)
                throw new Error('invalid Fp6 usage');
            return {
                c0: Fp2.fromBigTuple(t.slice(0, 2)),
                c1: Fp2.fromBigTuple(t.slice(2, 4)),
                c2: Fp2.fromBigTuple(t.slice(4, 6)),
            };
        },
        frobeniusMap: ({ c0, c1, c2 }, power) => ({
            c0: Fp2.frobeniusMap(c0, power),
            c1: Fp2.mul(Fp2.frobeniusMap(c1, power), FP6_FROBENIUS_COEFFICIENTS_1[power % 6]),
            c2: Fp2.mul(Fp2.frobeniusMap(c2, power), FP6_FROBENIUS_COEFFICIENTS_2[power % 6]),
        }),
        mulByFp2: ({ c0, c1, c2 }, rhs) => ({
            c0: Fp2.mul(c0, rhs),
            c1: Fp2.mul(c1, rhs),
            c2: Fp2.mul(c2, rhs),
        }),
        mulByNonresidue: ({ c0, c1, c2 }) => ({ c0: Fp2.mulByNonresidue(c2), c1: c0, c2: c1 }),
        // Sparse multiplication
        mul1: ({ c0, c1, c2 }, b1) => ({
            c0: Fp2.mulByNonresidue(Fp2.mul(c2, b1)),
            c1: Fp2.mul(c0, b1),
            c2: Fp2.mul(c1, b1),
        }),
        // Sparse multiplication
        mul01({ c0, c1, c2 }, b0, b1) {
            let t0 = Fp2.mul(c0, b0); // c0 * b0
            let t1 = Fp2.mul(c1, b1); // c1 * b1
            return {
                // ((c1 + c2) * b1 - T1) * (u + 1) + T0
                c0: Fp2.add(Fp2.mulByNonresidue(Fp2.sub(Fp2.mul(Fp2.add(c1, c2), b1), t1)), t0),
                // (b0 + b1) * (c0 + c1) - T0 - T1
                c1: Fp2.sub(Fp2.sub(Fp2.mul(Fp2.add(b0, b1), Fp2.add(c0, c1)), t0), t1),
                // (c0 + c2) * b0 - T0 + T1
                c2: Fp2.add(Fp2.sub(Fp2.mul(Fp2.add(c0, c2), b0), t0), t1),
            };
        },
    };
    // Fp12
    const FP12_FROBENIUS_COEFFICIENTS = calcFrobeniusCoefficients(Fp2, Fp2Nonresidue, Fp.ORDER, 12, 1, 6)[0];
    const Fp12Add = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
        c0: Fp6.add(c0, r0),
        c1: Fp6.add(c1, r1),
    });
    const Fp12Subtract = ({ c0, c1 }, { c0: r0, c1: r1 }) => ({
        c0: Fp6.sub(c0, r0),
        c1: Fp6.sub(c1, r1),
    });
    const Fp12Multiply = ({ c0, c1 }, rhs) => {
        if (typeof rhs === 'bigint')
            return { c0: Fp6.mul(c0, rhs), c1: Fp6.mul(c1, rhs) };
        let { c0: r0, c1: r1 } = rhs;
        let t1 = Fp6.mul(c0, r0); // c0 * r0
        let t2 = Fp6.mul(c1, r1); // c1 * r1
        return {
            c0: Fp6.add(t1, Fp6.mulByNonresidue(t2)), // T1 + T2 * v
            // (c0 + c1) * (r0 + r1) - (T1 + T2)
            c1: Fp6.sub(Fp6.mul(Fp6.add(c0, c1), Fp6.add(r0, r1)), Fp6.add(t1, t2)),
        };
    };
    const Fp12Square = ({ c0, c1 }) => {
        let ab = Fp6.mul(c0, c1); // c0 * c1
        return {
            // (c1 * v + c0) * (c0 + c1) - AB - AB * v
            c0: Fp6.sub(Fp6.sub(Fp6.mul(Fp6.add(Fp6.mulByNonresidue(c1), c0), Fp6.add(c0, c1)), ab), Fp6.mulByNonresidue(ab)),
            c1: Fp6.add(ab, ab),
        }; // AB + AB
    };
    function Fp4Square(a, b) {
        const a2 = Fp2.sqr(a);
        const b2 = Fp2.sqr(b);
        return {
            first: Fp2.add(Fp2.mulByNonresidue(b2), a2), // b² * Nonresidue + a²
            second: Fp2.sub(Fp2.sub(Fp2.sqr(Fp2.add(a, b)), a2), b2), // (a + b)² - a² - b²
        };
    }
    const Fp12 = {
        ORDER: Fp2.ORDER, // TODO: unused, but need to verify
        isLE: Fp6.isLE,
        BITS: 2 * Fp6.BITS,
        BYTES: 2 * Fp6.BYTES,
        MASK: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.bitMask)(2 * Fp6.BITS),
        ZERO: { c0: Fp6.ZERO, c1: Fp6.ZERO },
        ONE: { c0: Fp6.ONE, c1: Fp6.ZERO },
        create: (num) => num,
        isValid: ({ c0, c1 }) => Fp6.isValid(c0) && Fp6.isValid(c1),
        is0: ({ c0, c1 }) => Fp6.is0(c0) && Fp6.is0(c1),
        isValidNot0: (num) => !Fp12.is0(num) && Fp12.isValid(num),
        neg: ({ c0, c1 }) => ({ c0: Fp6.neg(c0), c1: Fp6.neg(c1) }),
        eql: ({ c0, c1 }, { c0: r0, c1: r1 }) => Fp6.eql(c0, r0) && Fp6.eql(c1, r1),
        sqrt: _utils_js__WEBPACK_IMPORTED_MODULE_1__.notImplemented,
        inv: ({ c0, c1 }) => {
            let t = Fp6.inv(Fp6.sub(Fp6.sqr(c0), Fp6.mulByNonresidue(Fp6.sqr(c1)))); // 1 / (c0² - c1² * v)
            return { c0: Fp6.mul(c0, t), c1: Fp6.neg(Fp6.mul(c1, t)) }; // ((C0 * T) * T) + (-C1 * T) * w
        },
        div: (lhs, rhs) => Fp12.mul(lhs, typeof rhs === 'bigint' ? Fp.inv(Fp.create(rhs)) : Fp12.inv(rhs)),
        pow: (num, power) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpPow(Fp12, num, power),
        invertBatch: (nums) => _modular_js__WEBPACK_IMPORTED_MODULE_0__.FpInvertBatch(Fp12, nums),
        // Normalized
        add: Fp12Add,
        sub: Fp12Subtract,
        mul: Fp12Multiply,
        sqr: Fp12Square,
        // NonNormalized stuff
        addN: Fp12Add,
        subN: Fp12Subtract,
        mulN: Fp12Multiply,
        sqrN: Fp12Square,
        // Bytes utils
        fromBytes: (b) => {
            if (b.length !== Fp12.BYTES)
                throw new Error('fromBytes invalid length=' + b.length);
            return {
                c0: Fp6.fromBytes(b.subarray(0, Fp6.BYTES)),
                c1: Fp6.fromBytes(b.subarray(Fp6.BYTES)),
            };
        },
        toBytes: ({ c0, c1 }) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(Fp6.toBytes(c0), Fp6.toBytes(c1)),
        cmov: ({ c0, c1 }, { c0: r0, c1: r1 }, c) => ({
            c0: Fp6.cmov(c0, r0, c),
            c1: Fp6.cmov(c1, r1, c),
        }),
        // Utils
        // toString() {
        //   return '' + 'Fp12(' + this.c0 + this.c1 + '* w');
        // },
        // fromTuple(c: [Fp6, Fp6]) {
        //   return new Fp12(...c);
        // }
        fromBigTwelve: (t) => ({
            c0: Fp6.fromBigSix(t.slice(0, 6)),
            c1: Fp6.fromBigSix(t.slice(6, 12)),
        }),
        // Raises to q**i -th power
        frobeniusMap(lhs, power) {
            const { c0, c1, c2 } = Fp6.frobeniusMap(lhs.c1, power);
            const coeff = FP12_FROBENIUS_COEFFICIENTS[power % 12];
            return {
                c0: Fp6.frobeniusMap(lhs.c0, power),
                c1: Fp6.create({
                    c0: Fp2.mul(c0, coeff),
                    c1: Fp2.mul(c1, coeff),
                    c2: Fp2.mul(c2, coeff),
                }),
            };
        },
        mulByFp2: ({ c0, c1 }, rhs) => ({
            c0: Fp6.mulByFp2(c0, rhs),
            c1: Fp6.mulByFp2(c1, rhs),
        }),
        conjugate: ({ c0, c1 }) => ({ c0, c1: Fp6.neg(c1) }),
        // Sparse multiplication
        mul014: ({ c0, c1 }, o0, o1, o4) => {
            let t0 = Fp6.mul01(c0, o0, o1);
            let t1 = Fp6.mul1(c1, o4);
            return {
                c0: Fp6.add(Fp6.mulByNonresidue(t1), t0), // T1 * v + T0
                // (c1 + c0) * [o0, o1+o4] - T0 - T1
                c1: Fp6.sub(Fp6.sub(Fp6.mul01(Fp6.add(c1, c0), o0, Fp2.add(o1, o4)), t0), t1),
            };
        },
        mul034: ({ c0, c1 }, o0, o3, o4) => {
            const a = Fp6.create({
                c0: Fp2.mul(c0.c0, o0),
                c1: Fp2.mul(c0.c1, o0),
                c2: Fp2.mul(c0.c2, o0),
            });
            const b = Fp6.mul01(c1, o3, o4);
            const e = Fp6.mul01(Fp6.add(c0, c1), Fp2.add(o0, o3), o4);
            return {
                c0: Fp6.add(Fp6.mulByNonresidue(b), a),
                c1: Fp6.sub(e, Fp6.add(a, b)),
            };
        },
        // A cyclotomic group is a subgroup of Fp^n defined by
        //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
        // The result of any pairing is in a cyclotomic subgroup
        // https://eprint.iacr.org/2009/565.pdf
        _cyclotomicSquare: opts.Fp12cyclotomicSquare,
        _cyclotomicExp: opts.Fp12cyclotomicExp,
        // https://eprint.iacr.org/2010/354.pdf
        // https://eprint.iacr.org/2009/565.pdf
        finalExponentiate: opts.Fp12finalExponentiate,
    };
    return { Fp, Fp2, Fp6, Fp12, Fp4Square };
}
//# sourceMappingURL=tower.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/abstract/weierstrass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@noble/curves/esm/abstract/weierstrass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DERErr": () => (/* binding */ DERErr),
/* harmony export */   "DER": () => (/* binding */ DER),
/* harmony export */   "_legacyHelperEquat": () => (/* binding */ _legacyHelperEquat),
/* harmony export */   "_legacyHelperNormPriv": () => (/* binding */ _legacyHelperNormPriv),
/* harmony export */   "weierstrassN": () => (/* binding */ weierstrassN),
/* harmony export */   "weierstrassPoints": () => (/* binding */ weierstrassPoints),
/* harmony export */   "ecdsa": () => (/* binding */ ecdsa),
/* harmony export */   "weierstrass": () => (/* binding */ weierstrass),
/* harmony export */   "SWUFpSqrtRatio": () => (/* binding */ SWUFpSqrtRatio),
/* harmony export */   "mapToCurveSimpleSWU": () => (/* binding */ mapToCurveSimpleSWU)
/* harmony export */ });
/* harmony import */ var _noble_hashes_hmac_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @noble/hashes/hmac.js */ "./node_modules/@noble/hashes/esm/hmac.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _curve_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./curve.js */ "./node_modules/@noble/curves/esm/abstract/curve.js");
/* harmony import */ var _modular_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/**
 * Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
 *
 * ### Design rationale for types
 *
 * * Interaction between classes from different curves should fail:
 *   `k256.Point.BASE.add(p256.Point.BASE)`
 * * For this purpose we want to use `instanceof` operator, which is fast and works during runtime
 * * Different calls of `curve()` would return different classes -
 *   `curve(params) !== curve(params)`: if somebody decided to monkey-patch their curve,
 *   it won't affect others
 *
 * TypeScript can't infer types for classes created inside a function. Classes is one instance
 * of nominative types in TypeScript and interfaces only check for shape, so it's hard to create
 * unique type for every function call.
 *
 * We can use generic types via some param, like curve opts, but that would:
 *     1. Enable interaction between `curve(params)` and `curve(params)` (curves of same params)
 *     which is hard to debug.
 *     2. Params can be generic and we can't enforce them to be constant value:
 *     if somebody creates curve from non-constant params,
 *     it would be allowed to interact with other curves with non-constant params
 *
 * @todo https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */




function validateSigVerOpts(opts) {
    if (opts.lowS !== undefined)
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abool)('lowS', opts.lowS);
    if (opts.prehash !== undefined)
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abool)('prehash', opts.prehash);
}
class DERErr extends Error {
    constructor(m = '') {
        super(m);
    }
}
/**
 * ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
 *
 *     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
 *
 * Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
 */
const DER = {
    // asn.1 DER encoding utils
    Err: DERErr,
    // Basic building block is TLV (Tag-Length-Value)
    _tlv: {
        encode: (tag, data) => {
            const { Err: E } = DER;
            if (tag < 0 || tag > 256)
                throw new E('tlv.encode: wrong tag');
            if (data.length & 1)
                throw new E('tlv.encode: unpadded data');
            const dataLen = data.length / 2;
            const len = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToHexUnpadded)(dataLen);
            if ((len.length / 2) & 128)
                throw new E('tlv.encode: long form length too big');
            // length of length with long form flag
            const lenLen = dataLen > 127 ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToHexUnpadded)((len.length / 2) | 128) : '';
            const t = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToHexUnpadded)(tag);
            return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
            const { Err: E } = DER;
            let pos = 0;
            if (tag < 0 || tag > 256)
                throw new E('tlv.encode: wrong tag');
            if (data.length < 2 || data[pos++] !== tag)
                throw new E('tlv.decode: wrong tlv');
            const first = data[pos++];
            const isLong = !!(first & 128); // First bit of first length byte is flag for short/long form
            let length = 0;
            if (!isLong)
                length = first;
            else {
                // Long form: [longFlag(1bit), lengthLength(7bit), length (BE)]
                const lenLen = first & 127;
                if (!lenLen)
                    throw new E('tlv.decode(long): indefinite length not supported');
                if (lenLen > 4)
                    throw new E('tlv.decode(long): byte length is too big'); // this will overflow u32 in js
                const lengthBytes = data.subarray(pos, pos + lenLen);
                if (lengthBytes.length !== lenLen)
                    throw new E('tlv.decode: length bytes not complete');
                if (lengthBytes[0] === 0)
                    throw new E('tlv.decode(long): zero leftmost byte');
                for (const b of lengthBytes)
                    length = (length << 8) | b;
                pos += lenLen;
                if (length < 128)
                    throw new E('tlv.decode(long): not minimal encoding');
            }
            const v = data.subarray(pos, pos + length);
            if (v.length !== length)
                throw new E('tlv.decode: wrong value length');
            return { v, l: data.subarray(pos + length) };
        },
    },
    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
    // since we always use positive integers here. It must always be empty:
    // - add zero byte if exists
    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
    _int: {
        encode(num) {
            const { Err: E } = DER;
            if (num < _0n)
                throw new E('integer: negative integers are not allowed');
            let hex = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToHexUnpadded)(num);
            // Pad with zero byte if negative flag is present
            if (Number.parseInt(hex[0], 16) & 0b1000)
                hex = '00' + hex;
            if (hex.length & 1)
                throw new E('unexpected DER parsing assertion: unpadded hex');
            return hex;
        },
        decode(data) {
            const { Err: E } = DER;
            if (data[0] & 128)
                throw new E('invalid signature integer: negative');
            if (data[0] === 0x00 && !(data[1] & 128))
                throw new E('invalid signature integer: unnecessary leading zero');
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(data);
        },
    },
    toSig(hex) {
        // parse DER signature
        const { Err: E, _int: int, _tlv: tlv } = DER;
        const data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('signature', hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(0x30, data);
        if (seqLeftBytes.length)
            throw new E('invalid signature: left bytes after parsing');
        const { v: rBytes, l: rLeftBytes } = tlv.decode(0x02, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(0x02, rLeftBytes);
        if (sLeftBytes.length)
            throw new E('invalid signature: left bytes after parsing');
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
    },
    hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = DER;
        const rs = tlv.encode(0x02, int.encode(sig.r));
        const ss = tlv.encode(0x02, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(0x30, seq);
    },
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
// TODO: remove
function _legacyHelperEquat(Fp, a, b) {
    /**
     * y² = x³ + ax + b: Short weierstrass curve formula. Takes x, returns y².
     * @returns y²
     */
    function weierstrassEquation(x) {
        const x2 = Fp.sqr(x); // x * x
        const x3 = Fp.mul(x2, x); // x² * x
        return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x³ + a * x + b
    }
    return weierstrassEquation;
}
function _legacyHelperNormPriv(Fn, allowedPrivateKeyLengths, wrapPrivateKey) {
    const { BYTES: expected } = Fn;
    // Validates if priv key is valid and converts it to bigint.
    function normPrivateKeyToScalar(key) {
        let num;
        if (typeof key === 'bigint') {
            num = key;
        }
        else {
            let bytes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('private key', key);
            if (allowedPrivateKeyLengths) {
                if (!allowedPrivateKeyLengths.includes(bytes.length * 2))
                    throw new Error('invalid private key');
                const padded = new Uint8Array(expected);
                padded.set(bytes, padded.length - bytes.length);
                bytes = padded;
            }
            try {
                num = Fn.fromBytes(bytes);
            }
            catch (error) {
                throw new Error(`invalid private key: expected ui8a of size ${expected}, got ${typeof key}`);
            }
        }
        if (wrapPrivateKey)
            num = Fn.create(num); // disabled by default, enabled for BLS
        if (!Fn.isValidNot0(num))
            throw new Error('invalid private key: out of range [1..N-1]');
        return num;
    }
    return normPrivateKeyToScalar;
}
function weierstrassN(CURVE, curveOpts = {}) {
    const { Fp, Fn } = (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__._createCurveFields)('weierstrass', CURVE, curveOpts);
    const { h: cofactor, n: CURVE_ORDER } = CURVE;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__._validateObject)(curveOpts, {}, {
        allowInfinityPoint: 'boolean',
        clearCofactor: 'function',
        isTorsionFree: 'function',
        fromBytes: 'function',
        toBytes: 'function',
        endo: 'object',
        wrapPrivateKey: 'boolean',
    });
    const { endo } = curveOpts;
    if (endo) {
        // validateObject(endo, { beta: 'bigint', splitScalar: 'function' });
        if (!Fp.is0(CURVE.a) ||
            typeof endo.beta !== 'bigint' ||
            typeof endo.splitScalar !== 'function') {
            throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
        }
    }
    function assertCompressionIsSupported() {
        if (!Fp.isOdd)
            throw new Error('compression is not supported: Field does not have .isOdd()');
    }
    // Implements IEEE P1363 point encoding
    function pointToBytes(_c, point, isCompressed) {
        const { x, y } = point.toAffine();
        const bx = Fp.toBytes(x);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abool)('isCompressed', isCompressed);
        if (isCompressed) {
            assertCompressionIsSupported();
            const hasEvenY = !Fp.isOdd(y);
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(pprefix(hasEvenY), bx);
        }
        else {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(Uint8Array.of(0x04), bx, Fp.toBytes(y));
        }
    }
    function pointFromBytes(bytes) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.abytes)(bytes);
        const L = Fp.BYTES;
        const LC = L + 1; // length compressed, e.g. 33 for 32-byte field
        const LU = 2 * L + 1; // length uncompressed, e.g. 65 for 32-byte field
        const length = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        // No actual validation is done here: use .assertValidity()
        if (length === LC && (head === 0x02 || head === 0x03)) {
            const x = Fp.fromBytes(tail);
            if (!Fp.isValid(x))
                throw new Error('bad point: is not on curve, wrong x');
            const y2 = weierstrassEquation(x); // y² = x³ + ax + b
            let y;
            try {
                y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
            }
            catch (sqrtError) {
                const err = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
                throw new Error('bad point: is not on curve, sqrt error' + err);
            }
            assertCompressionIsSupported();
            const isYOdd = Fp.isOdd(y); // (y & _1n) === _1n;
            const isHeadOdd = (head & 1) === 1; // ECDSA-specific
            if (isHeadOdd !== isYOdd)
                y = Fp.neg(y);
            return { x, y };
        }
        else if (length === LU && head === 0x04) {
            // TODO: more checks
            const x = Fp.fromBytes(tail.subarray(L * 0, L * 1));
            const y = Fp.fromBytes(tail.subarray(L * 1, L * 2));
            if (!isValidXY(x, y))
                throw new Error('bad point: is not on curve');
            return { x, y };
        }
        else {
            throw new Error(`bad point: got length ${length}, expected compressed=${LC} or uncompressed=${LU}`);
        }
    }
    const toBytes = curveOpts.toBytes || pointToBytes;
    const fromBytes = curveOpts.fromBytes || pointFromBytes;
    const weierstrassEquation = _legacyHelperEquat(Fp, CURVE.a, CURVE.b);
    // TODO: move top-level
    /** Checks whether equation holds for given x, y: y² == x³ + ax + b */
    function isValidXY(x, y) {
        const left = Fp.sqr(y); // y²
        const right = weierstrassEquation(x); // x³ + ax + b
        return Fp.eql(left, right);
    }
    // Validate whether the passed curve params are valid.
    // Test 1: equation y² = x³ + ax + b should work for generator point.
    if (!isValidXY(CURVE.Gx, CURVE.Gy))
        throw new Error('bad curve params: generator point');
    // Test 2: discriminant Δ part should be non-zero: 4a³ + 27b² != 0.
    // Guarantees curve is genus-1, smooth (non-singular).
    const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
    const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
    if (Fp.is0(Fp.add(_4a3, _27b2)))
        throw new Error('bad curve params: a or b');
    /** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
    function acoord(title, n, banZero = false) {
        if (!Fp.isValid(n) || (banZero && Fp.is0(n)))
            throw new Error(`bad point coordinate ${title}`);
        return n;
    }
    function aprjpoint(other) {
        if (!(other instanceof Point))
            throw new Error('ProjectivePoint expected');
    }
    // Memoized toAffine / validity check. They are heavy. Points are immutable.
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (X, Y, Z) ∋ (x=X/Z, y=Y/Z)
    const toAffineMemo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.memoized)((p, iz) => {
        const { px: x, py: y, pz: z } = p;
        // Fast-path for normalized points
        if (Fp.eql(z, Fp.ONE))
            return { x, y };
        const is0 = p.is0();
        // If invZ was 0, we return zero point. However we still want to execute
        // all operations, so we replace invZ with a random number, 1.
        if (iz == null)
            iz = is0 ? Fp.ONE : Fp.inv(z);
        const ax = Fp.mul(x, iz);
        const ay = Fp.mul(y, iz);
        const zz = Fp.mul(z, iz);
        if (is0)
            return { x: Fp.ZERO, y: Fp.ZERO };
        if (!Fp.eql(zz, Fp.ONE))
            throw new Error('invZ was invalid');
        return { x: ax, y: ay };
    });
    // NOTE: on exception this will crash 'cached' and no value will be set.
    // Otherwise true will be return
    const assertValidMemo = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.memoized)((p) => {
        if (p.is0()) {
            // (0, 1, 0) aka ZERO is invalid in most contexts.
            // In BLS, ZERO can be serialized, so we allow it.
            // (0, 0, 0) is invalid representation of ZERO.
            if (curveOpts.allowInfinityPoint && !Fp.is0(p.py))
                return;
            throw new Error('bad point: ZERO');
        }
        // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
        const { x, y } = p.toAffine();
        if (!Fp.isValid(x) || !Fp.isValid(y))
            throw new Error('bad point: x or y not field elements');
        if (!isValidXY(x, y))
            throw new Error('bad point: equation left != right');
        if (!p.isTorsionFree())
            throw new Error('bad point: not in prime-order subgroup');
        return true;
    });
    function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
        k2p = new Point(Fp.mul(k2p.px, endoBeta), k2p.py, k2p.pz);
        k1p = (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.negateCt)(k1neg, k1p);
        k2p = (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.negateCt)(k2neg, k2p);
        return k1p.add(k2p);
    }
    /**
     * Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
     * Default Point works in 2d / affine coordinates: (x, y).
     * We're doing calculations in projective, because its operations don't require costly inversion.
     */
    class Point {
        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
        constructor(px, py, pz) {
            this.px = acoord('x', px);
            this.py = acoord('y', py, true);
            this.pz = acoord('z', pz);
            Object.freeze(this);
        }
        /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
        static fromAffine(p) {
            const { x, y } = p || {};
            if (!p || !Fp.isValid(x) || !Fp.isValid(y))
                throw new Error('invalid affine point');
            if (p instanceof Point)
                throw new Error('projective point not allowed');
            // (0, 0) would've produced (0, 0, 1) - instead, we need (0, 1, 0)
            if (Fp.is0(x) && Fp.is0(y))
                return Point.ZERO;
            return new Point(x, y, Fp.ONE);
        }
        get x() {
            return this.toAffine().x;
        }
        get y() {
            return this.toAffine().y;
        }
        static normalizeZ(points) {
            return (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.normalizeZ)(Point, 'pz', points);
        }
        static fromBytes(bytes) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.abytes)(bytes);
            return Point.fromHex(bytes);
        }
        /** Converts hash string or Uint8Array to Point. */
        static fromHex(hex) {
            const P = Point.fromAffine(fromBytes((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('pointHex', hex)));
            P.assertValidity();
            return P;
        }
        /** Multiplies generator point by privateKey. */
        static fromPrivateKey(privateKey) {
            const normPrivateKeyToScalar = _legacyHelperNormPriv(Fn, curveOpts.allowedPrivateKeyLengths, curveOpts.wrapPrivateKey);
            return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
        }
        /** Multiscalar Multiplication */
        static msm(points, scalars) {
            return (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.pippenger)(Point, Fn, points, scalars);
        }
        /**
         *
         * @param windowSize
         * @param isLazy true will defer table computation until the first multiplication
         * @returns
         */
        precompute(windowSize = 8, isLazy = true) {
            wnaf.setWindowSize(this, windowSize);
            if (!isLazy)
                this.multiply(_3n); // random number
            return this;
        }
        /** "Private method", don't use it directly */
        _setWindowSize(windowSize) {
            this.precompute(windowSize);
        }
        // TODO: return `this`
        /** A point on curve is valid if it conforms to equation. */
        assertValidity() {
            assertValidMemo(this);
        }
        hasEvenY() {
            const { y } = this.toAffine();
            if (!Fp.isOdd)
                throw new Error("Field doesn't support isOdd");
            return !Fp.isOdd(y);
        }
        /** Compare one point to another. */
        equals(other) {
            aprjpoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
            const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
            return U1 && U2;
        }
        /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
        negate() {
            return new Point(this.px, Fp.neg(this.py), this.pz);
        }
        // Renes-Costello-Batina exception-free doubling formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 3
        // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
        double() {
            const { a, b } = CURVE;
            const b3 = Fp.mul(b, _3n);
            const { px: X1, py: Y1, pz: Z1 } = this;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            let t0 = Fp.mul(X1, X1); // step 1
            let t1 = Fp.mul(Y1, Y1);
            let t2 = Fp.mul(Z1, Z1);
            let t3 = Fp.mul(X1, Y1);
            t3 = Fp.add(t3, t3); // step 5
            Z3 = Fp.mul(X1, Z1);
            Z3 = Fp.add(Z3, Z3);
            X3 = Fp.mul(a, Z3);
            Y3 = Fp.mul(b3, t2);
            Y3 = Fp.add(X3, Y3); // step 10
            X3 = Fp.sub(t1, Y3);
            Y3 = Fp.add(t1, Y3);
            Y3 = Fp.mul(X3, Y3);
            X3 = Fp.mul(t3, X3);
            Z3 = Fp.mul(b3, Z3); // step 15
            t2 = Fp.mul(a, t2);
            t3 = Fp.sub(t0, t2);
            t3 = Fp.mul(a, t3);
            t3 = Fp.add(t3, Z3);
            Z3 = Fp.add(t0, t0); // step 20
            t0 = Fp.add(Z3, t0);
            t0 = Fp.add(t0, t2);
            t0 = Fp.mul(t0, t3);
            Y3 = Fp.add(Y3, t0);
            t2 = Fp.mul(Y1, Z1); // step 25
            t2 = Fp.add(t2, t2);
            t0 = Fp.mul(t2, t3);
            X3 = Fp.sub(X3, t0);
            Z3 = Fp.mul(t2, t1);
            Z3 = Fp.add(Z3, Z3); // step 30
            Z3 = Fp.add(Z3, Z3);
            return new Point(X3, Y3, Z3);
        }
        // Renes-Costello-Batina exception-free addition formula.
        // There is 30% faster Jacobian formula, but it is not complete.
        // https://eprint.iacr.org/2015/1060, algorithm 1
        // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
        add(other) {
            aprjpoint(other);
            const { px: X1, py: Y1, pz: Z1 } = this;
            const { px: X2, py: Y2, pz: Z2 } = other;
            let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO; // prettier-ignore
            const a = CURVE.a;
            const b3 = Fp.mul(CURVE.b, _3n);
            let t0 = Fp.mul(X1, X2); // step 1
            let t1 = Fp.mul(Y1, Y2);
            let t2 = Fp.mul(Z1, Z2);
            let t3 = Fp.add(X1, Y1);
            let t4 = Fp.add(X2, Y2); // step 5
            t3 = Fp.mul(t3, t4);
            t4 = Fp.add(t0, t1);
            t3 = Fp.sub(t3, t4);
            t4 = Fp.add(X1, Z1);
            let t5 = Fp.add(X2, Z2); // step 10
            t4 = Fp.mul(t4, t5);
            t5 = Fp.add(t0, t2);
            t4 = Fp.sub(t4, t5);
            t5 = Fp.add(Y1, Z1);
            X3 = Fp.add(Y2, Z2); // step 15
            t5 = Fp.mul(t5, X3);
            X3 = Fp.add(t1, t2);
            t5 = Fp.sub(t5, X3);
            Z3 = Fp.mul(a, t4);
            X3 = Fp.mul(b3, t2); // step 20
            Z3 = Fp.add(X3, Z3);
            X3 = Fp.sub(t1, Z3);
            Z3 = Fp.add(t1, Z3);
            Y3 = Fp.mul(X3, Z3);
            t1 = Fp.add(t0, t0); // step 25
            t1 = Fp.add(t1, t0);
            t2 = Fp.mul(a, t2);
            t4 = Fp.mul(b3, t4);
            t1 = Fp.add(t1, t2);
            t2 = Fp.sub(t0, t2); // step 30
            t2 = Fp.mul(a, t2);
            t4 = Fp.add(t4, t2);
            t0 = Fp.mul(t1, t4);
            Y3 = Fp.add(Y3, t0);
            t0 = Fp.mul(t5, t4); // step 35
            X3 = Fp.mul(t3, X3);
            X3 = Fp.sub(X3, t0);
            t0 = Fp.mul(t3, t1);
            Z3 = Fp.mul(t5, Z3);
            Z3 = Fp.add(Z3, t0); // step 40
            return new Point(X3, Y3, Z3);
        }
        subtract(other) {
            return this.add(other.negate());
        }
        is0() {
            return this.equals(Point.ZERO);
        }
        /**
         * Constant time multiplication.
         * Uses wNAF method. Windowed method may be 10% faster,
         * but takes 2x longer to generate and consumes 2x memory.
         * Uses precomputes when available.
         * Uses endomorphism for Koblitz curves.
         * @param scalar by which the point would be multiplied
         * @returns New point
         */
        multiply(scalar) {
            const { endo } = curveOpts;
            if (!Fn.isValidNot0(scalar))
                throw new Error('invalid scalar: out of range'); // 0 is invalid
            let point, fake; // Fake point is used to const-time mult
            const mul = (n) => wnaf.wNAFCached(this, n, Point.normalizeZ);
            /** See docs for {@link EndomorphismOpts} */
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
                const { p: k1p, f: k1f } = mul(k1);
                const { p: k2p, f: k2f } = mul(k2);
                fake = k1f.add(k2f);
                point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
            }
            else {
                const { p, f } = mul(scalar);
                point = p;
                fake = f;
            }
            // Normalize `z` for both points, but return only real one
            return Point.normalizeZ([point, fake])[0];
        }
        /**
         * Non-constant-time multiplication. Uses double-and-add algorithm.
         * It's faster, but should only be used when you don't care about
         * an exposed private key e.g. sig verification, which works over *public* keys.
         */
        multiplyUnsafe(sc) {
            const { endo } = curveOpts;
            const p = this;
            if (!Fn.isValid(sc))
                throw new Error('invalid scalar: out of range'); // 0 is valid
            if (sc === _0n || p.is0())
                return Point.ZERO;
            if (sc === _1n)
                return p; // fast-path
            if (wnaf.hasPrecomputes(this))
                return this.multiply(sc);
            if (endo) {
                const { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
                // `wNAFCachedUnsafe` is 30% slower
                const { p1, p2 } = (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.mulEndoUnsafe)(Point, p, k1, k2);
                return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
            }
            else {
                return wnaf.wNAFCachedUnsafe(p, sc);
            }
        }
        multiplyAndAddUnsafe(Q, a, b) {
            const sum = this.multiplyUnsafe(a).add(Q.multiplyUnsafe(b));
            return sum.is0() ? undefined : sum;
        }
        /**
         * Converts Projective point to affine (x, y) coordinates.
         * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
         */
        toAffine(invertedZ) {
            return toAffineMemo(this, invertedZ);
        }
        /**
         * Checks whether Point is free of torsion elements (is in prime subgroup).
         * Always torsion-free for cofactor=1 curves.
         */
        isTorsionFree() {
            const { isTorsionFree } = curveOpts;
            if (cofactor === _1n)
                return true;
            if (isTorsionFree)
                return isTorsionFree(Point, this);
            return wnaf.wNAFCachedUnsafe(this, CURVE_ORDER).is0();
        }
        clearCofactor() {
            const { clearCofactor } = curveOpts;
            if (cofactor === _1n)
                return this; // Fast-path
            if (clearCofactor)
                return clearCofactor(Point, this);
            return this.multiplyUnsafe(cofactor);
        }
        toBytes(isCompressed = true) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abool)('isCompressed', isCompressed);
            this.assertValidity();
            return toBytes(Point, this, isCompressed);
        }
        /** @deprecated use `toBytes` */
        toRawBytes(isCompressed = true) {
            return this.toBytes(isCompressed);
        }
        toHex(isCompressed = true) {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.bytesToHex)(this.toBytes(isCompressed));
        }
        toString() {
            return `<Point ${this.is0() ? 'ZERO' : this.toHex()}>`;
        }
    }
    // base / generator point
    Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    // zero / infinity / identity point
    Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO); // 0, 1, 0
    // fields
    Point.Fp = Fp;
    Point.Fn = Fn;
    const bits = Fn.BITS;
    const wnaf = (0,_curve_js__WEBPACK_IMPORTED_MODULE_1__.wNAF)(Point, curveOpts.endo ? Math.ceil(bits / 2) : bits);
    return Point;
}
// _legacyWeierstrass
/** @deprecated use `weierstrassN` */
function weierstrassPoints(c) {
    const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
    const Point = weierstrassN(CURVE, curveOpts);
    return _weierstrass_new_output_to_legacy(c, Point);
}
// Points start with byte 0x02 when y is even; otherwise 0x03
function pprefix(hasEvenY) {
    return Uint8Array.of(hasEvenY ? 0x02 : 0x03);
}
function ecdsa(Point, ecdsaOpts, curveOpts = {}) {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__._validateObject)(ecdsaOpts, { hash: 'function' }, {
        hmac: 'function',
        lowS: 'boolean',
        randomBytes: 'function',
        bits2int: 'function',
        bits2int_modN: 'function',
    });
    const randomBytes_ = ecdsaOpts.randomBytes || _utils_js__WEBPACK_IMPORTED_MODULE_2__.randomBytes;
    const hmac_ = ecdsaOpts.hmac ||
        ((key, ...msgs) => (0,_noble_hashes_hmac_js__WEBPACK_IMPORTED_MODULE_3__.hmac)(ecdsaOpts.hash, key, (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(...msgs)));
    const { Fp, Fn } = Point;
    const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
    function isBiggerThanHalfOrder(number) {
        const HALF = CURVE_ORDER >> _1n;
        return number > HALF;
    }
    function normalizeS(s) {
        return isBiggerThanHalfOrder(s) ? Fn.neg(s) : s;
    }
    function aValidRS(title, num) {
        if (!Fn.isValidNot0(num))
            throw new Error(`invalid signature ${title}: out of range 1..CURVE.n`);
    }
    /**
     * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
     */
    class Signature {
        constructor(r, s, recovery) {
            aValidRS('r', r); // r in [1..N-1]
            aValidRS('s', s); // s in [1..N-1]
            this.r = r;
            this.s = s;
            if (recovery != null)
                this.recovery = recovery;
            Object.freeze(this);
        }
        // pair (bytes of r, bytes of s)
        static fromCompact(hex) {
            const L = Fn.BYTES;
            const b = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('compactSignature', hex, L * 2);
            return new Signature(Fn.fromBytes(b.subarray(0, L)), Fn.fromBytes(b.subarray(L, L * 2)));
        }
        // DER encoded ECDSA signature
        // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
        static fromDER(hex) {
            const { r, s } = DER.toSig((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('DER', hex));
            return new Signature(r, s);
        }
        /**
         * @todo remove
         * @deprecated
         */
        assertValidity() { }
        addRecoveryBit(recovery) {
            return new Signature(this.r, this.s, recovery);
        }
        // ProjPointType<bigint>
        recoverPublicKey(msgHash) {
            const FIELD_ORDER = Fp.ORDER;
            const { r, s, recovery: rec } = this;
            if (rec == null || ![0, 1, 2, 3].includes(rec))
                throw new Error('recovery id invalid');
            // ECDSA recovery is hard for cofactor > 1 curves.
            // In sign, `r = q.x mod n`, and here we recover q.x from r.
            // While recovering q.x >= n, we need to add r+n for cofactor=1 curves.
            // However, for cofactor>1, r+n may not get q.x:
            // r+n*i would need to be done instead where i is unknown.
            // To easily get i, we either need to:
            // a. increase amount of valid recid values (4, 5...); OR
            // b. prohibit non-prime-order signatures (recid > 1).
            const hasCofactor = CURVE_ORDER * _2n < FIELD_ORDER;
            if (hasCofactor && rec > 1)
                throw new Error('recovery id is ambiguous for h>1 curve');
            const radj = rec === 2 || rec === 3 ? r + CURVE_ORDER : r;
            if (!Fp.isValid(radj))
                throw new Error('recovery id 2 or 3 invalid');
            const x = Fp.toBytes(radj);
            const R = Point.fromHex((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(pprefix((rec & 1) === 0), x));
            const ir = Fn.inv(radj); // r^-1
            const h = bits2int_modN((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('msgHash', msgHash)); // Truncate hash
            const u1 = Fn.create(-h * ir); // -hr^-1
            const u2 = Fn.create(s * ir); // sr^-1
            // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1). unsafe is fine: there is no private data.
            const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
            if (Q.is0())
                throw new Error('point at infinify');
            Q.assertValidity();
            return Q;
        }
        // Signatures should be low-s, to prevent malleability.
        hasHighS() {
            return isBiggerThanHalfOrder(this.s);
        }
        normalizeS() {
            return this.hasHighS() ? new Signature(this.r, Fn.neg(this.s), this.recovery) : this;
        }
        toBytes(format) {
            if (format === 'compact')
                return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(Fn.toBytes(this.r), Fn.toBytes(this.s));
            if (format === 'der')
                return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.hexToBytes)(DER.hexFromSig(this));
            throw new Error('invalid format');
        }
        // DER-encoded
        toDERRawBytes() {
            return this.toBytes('der');
        }
        toDERHex() {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.bytesToHex)(this.toBytes('der'));
        }
        // padded bytes of r, then padded bytes of s
        toCompactRawBytes() {
            return this.toBytes('compact');
        }
        toCompactHex() {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.bytesToHex)(this.toBytes('compact'));
        }
    }
    const normPrivateKeyToScalar = _legacyHelperNormPriv(Fn, curveOpts.allowedPrivateKeyLengths, curveOpts.wrapPrivateKey);
    const utils = {
        isValidPrivateKey(privateKey) {
            try {
                normPrivateKeyToScalar(privateKey);
                return true;
            }
            catch (error) {
                return false;
            }
        },
        normPrivateKeyToScalar: normPrivateKeyToScalar,
        /**
         * Produces cryptographically secure private key from random of size
         * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
         */
        randomPrivateKey: () => {
            const n = CURVE_ORDER;
            return (0,_modular_js__WEBPACK_IMPORTED_MODULE_4__.mapHashToField)(randomBytes_((0,_modular_js__WEBPACK_IMPORTED_MODULE_4__.getMinHashLength)(n)), n);
        },
        precompute(windowSize = 8, point = Point.BASE) {
            return point.precompute(windowSize, false);
        },
    };
    /**
     * Computes public key for a private key. Checks for validity of the private key.
     * @param privateKey private key
     * @param isCompressed whether to return compact (default), or full key
     * @returns Public key, full when isCompressed=false; short when isCompressed=true
     */
    function getPublicKey(privateKey, isCompressed = true) {
        return Point.fromPrivateKey(privateKey).toBytes(isCompressed);
    }
    /**
     * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
     */
    function isProbPub(item) {
        if (typeof item === 'bigint')
            return false;
        if (item instanceof Point)
            return true;
        const arr = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('key', item);
        const length = arr.length;
        const L = Fp.BYTES;
        const LC = L + 1; // e.g. 33 for 32
        const LU = 2 * L + 1; // e.g. 65 for 32
        if (curveOpts.allowedPrivateKeyLengths || Fn.BYTES === LC) {
            return undefined;
        }
        else {
            return length === LC || length === LU;
        }
    }
    /**
     * ECDH (Elliptic Curve Diffie Hellman).
     * Computes shared public key from private key and public key.
     * Checks: 1) private key validity 2) shared key is on-curve.
     * Does NOT hash the result.
     * @param privateA private key
     * @param publicB different public key
     * @param isCompressed whether to return compact (default), or full key
     * @returns shared public key
     */
    function getSharedSecret(privateA, publicB, isCompressed = true) {
        if (isProbPub(privateA) === true)
            throw new Error('first arg must be private key');
        if (isProbPub(publicB) === false)
            throw new Error('second arg must be public key');
        const b = Point.fromHex(publicB); // check for being on-curve
        return b.multiply(normPrivateKeyToScalar(privateA)).toBytes(isCompressed);
    }
    // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
    // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
    // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
    // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
    const bits2int = ecdsaOpts.bits2int ||
        function (bytes) {
            // Our custom check "just in case", for protection against DoS
            if (bytes.length > 8192)
                throw new Error('input is too large');
            // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
            // for some cases, since bytes.length * 8 is not actual bitLength.
            const num = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(bytes); // check for == u8 done here
            const delta = bytes.length * 8 - fnBits; // truncate to nBitLength leftmost bits
            return delta > 0 ? num >> BigInt(delta) : num;
        };
    const bits2int_modN = ecdsaOpts.bits2int_modN ||
        function (bytes) {
            return Fn.create(bits2int(bytes)); // can't use bytesToNumberBE here
        };
    // NOTE: pads output with zero as per spec
    const ORDER_MASK = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bitMask)(fnBits);
    /**
     * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
     */
    function int2octets(num) {
        // IMPORTANT: the check ensures working for case `Fn.BYTES != Fn.BITS * 8`
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aInRange)('num < 2^' + fnBits, num, _0n, ORDER_MASK);
        return Fn.toBytes(num);
    }
    // Steps A, D of RFC6979 3.2
    // Creates RFC6979 seed; converts msg/privKey to numbers.
    // Used only in sign, not in verify.
    // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order,
    // this will be invalid at least for P521. Also it can be bigger for P224 + SHA256
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
        if (['recovered', 'canonical'].some((k) => k in opts))
            throw new Error('sign() legacy options not supported');
        const { hash } = ecdsaOpts;
        let { lowS, prehash, extraEntropy: ent } = opts; // generates low-s sigs by default
        if (lowS == null)
            lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
        msgHash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('msgHash', msgHash);
        validateSigVerOpts(opts);
        if (prehash)
            msgHash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('prehashed msgHash', hash(msgHash));
        // We can't later call bits2octets, since nested bits2int is broken for curves
        // with fnBits % 8 !== 0. Because of that, we unwrap it here as int2octets call.
        // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
        const h1int = bits2int_modN(msgHash);
        const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
        const seedArgs = [int2octets(d), int2octets(h1int)];
        // extraEntropy. RFC6979 3.6: additional k' (optional).
        if (ent != null && ent !== false) {
            // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
            const e = ent === true ? randomBytes_(Fp.BYTES) : ent; // generate random bytes OR pass as-is
            seedArgs.push((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('extraEntropy', e)); // check for being bytes
        }
        const seed = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.concatBytes)(...seedArgs); // Step D of RFC6979 3.2
        const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
        // Converts signature params into point w r/s, checks result for validity.
        // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
        // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
        // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
        function k2sig(kBytes) {
            // RFC 6979 Section 3.2, step 3: k = bits2int(T)
            // Important: all mod() calls here must be done over N
            const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
            if (!Fn.isValidNot0(k))
                return; // Valid scalars (including k) must be in 1..N-1
            const ik = Fn.inv(k); // k^-1 mod n
            const q = Point.BASE.multiply(k).toAffine(); // q = Gk
            const r = Fn.create(q.x); // r = q.x mod n
            if (r === _0n)
                return;
            const s = Fn.create(ik * Fn.create(m + r * d)); // Not using blinding here, see comment above
            if (s === _0n)
                return;
            let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n); // recovery bit (2 or 3, when q.x > n)
            let normS = s;
            if (lowS && isBiggerThanHalfOrder(s)) {
                normS = normalizeS(s); // if lowS was passed, ensure s is always
                recovery ^= 1; // // in the bottom half of N
            }
            return new Signature(r, normS, recovery); // use normS, not s
        }
        return { seed, k2sig };
    }
    const defaultSigOpts = { lowS: ecdsaOpts.lowS, prehash: false };
    const defaultVerOpts = { lowS: ecdsaOpts.lowS, prehash: false };
    /**
     * Signs message hash with a private key.
     * ```
     * sign(m, d, k) where
     *   (x, y) = G × k
     *   r = x mod n
     *   s = (m + dr)/k mod n
     * ```
     * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
     * @param privKey private key
     * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
     * @returns signature with recovery param
     */
    function sign(msgHash, privKey, opts = defaultSigOpts) {
        const { seed, k2sig } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
        const drbg = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createHmacDrbg)(ecdsaOpts.hash.outputLen, Fn.BYTES, hmac_);
        return drbg(seed, k2sig); // Steps B, C, D, E, F, G
    }
    // Enable precomputes. Slows down first publicKey computation by 20ms.
    Point.BASE.precompute(8);
    /**
     * Verifies a signature against message hash and public key.
     * Rejects lowS signatures by default: to override,
     * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
     *
     * ```
     * verify(r, s, h, P) where
     *   U1 = hs^-1 mod n
     *   U2 = rs^-1 mod n
     *   R = U1⋅G - U2⋅P
     *   mod(R.x, n) == r
     * ```
     */
    function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
        const sg = signature;
        msgHash = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('msgHash', msgHash);
        publicKey = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('publicKey', publicKey);
        // Verify opts
        validateSigVerOpts(opts);
        const { lowS, prehash, format } = opts;
        // TODO: remove
        if ('strict' in opts)
            throw new Error('options.strict was renamed to lowS');
        if (format !== undefined && !['compact', 'der', 'js'].includes(format))
            throw new Error('format must be "compact", "der" or "js"');
        const isHex = typeof sg === 'string' || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isBytes)(sg);
        const isObj = !isHex &&
            !format &&
            typeof sg === 'object' &&
            sg !== null &&
            typeof sg.r === 'bigint' &&
            typeof sg.s === 'bigint';
        if (!isHex && !isObj)
            throw new Error('invalid signature, expected Uint8Array, hex string or Signature instance');
        let _sig = undefined;
        let P;
        // deduce signature format
        try {
            // if (format === 'js') {
            //   if (sg != null && !isBytes(sg)) _sig = new Signature(sg.r, sg.s);
            // } else if (format === 'compact') {
            //   _sig = Signature.fromCompact(sg);
            // } else if (format === 'der') {
            //   _sig = Signature.fromDER(sg);
            // } else {
            //   throw new Error('invalid format');
            // }
            if (isObj) {
                if (format === undefined || format === 'js') {
                    _sig = new Signature(sg.r, sg.s);
                }
                else {
                    throw new Error('invalid format');
                }
            }
            if (isHex) {
                // TODO: remove this malleable check
                // Signature can be represented in 2 ways: compact (2*Fn.BYTES) & DER (variable-length).
                // Since DER can also be 2*Fn.BYTES bytes, we check for it first.
                try {
                    if (format !== 'compact')
                        _sig = Signature.fromDER(sg);
                }
                catch (derError) {
                    if (!(derError instanceof DER.Err))
                        throw derError;
                }
                if (!_sig && format !== 'der')
                    _sig = Signature.fromCompact(sg);
            }
            P = Point.fromHex(publicKey);
        }
        catch (error) {
            return false;
        }
        if (!_sig)
            return false;
        if (lowS && _sig.hasHighS())
            return false;
        // todo: optional.hash => hash
        if (prehash)
            msgHash = ecdsaOpts.hash(msgHash);
        const { r, s } = _sig;
        const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
        const is = Fn.inv(s); // s^-1
        const u1 = Fn.create(h * is); // u1 = hs^-1 mod n
        const u2 = Fn.create(r * is); // u2 = rs^-1 mod n
        const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
        if (R.is0())
            return false;
        const v = Fn.create(R.x); // v = r.x mod n
        return v === r;
    }
    // TODO: clarify API for cloning .clone({hash: sha512}) ? .createWith({hash: sha512})?
    // const clone = (hash: CHash): ECDSA => ecdsa(Point, { ...ecdsaOpts, ...getHash(hash) }, curveOpts);
    return Object.freeze({
        getPublicKey,
        getSharedSecret,
        sign,
        verify,
        utils,
        Point,
        Signature,
    });
}
function _weierstrass_legacy_opts_to_new(c) {
    const CURVE = {
        a: c.a,
        b: c.b,
        p: c.Fp.ORDER,
        n: c.n,
        h: c.h,
        Gx: c.Gx,
        Gy: c.Gy,
    };
    const Fp = c.Fp;
    const Fn = (0,_modular_js__WEBPACK_IMPORTED_MODULE_4__.Field)(CURVE.n, c.nBitLength);
    const curveOpts = {
        Fp,
        Fn,
        allowedPrivateKeyLengths: c.allowedPrivateKeyLengths,
        allowInfinityPoint: c.allowInfinityPoint,
        endo: c.endo,
        wrapPrivateKey: c.wrapPrivateKey,
        isTorsionFree: c.isTorsionFree,
        clearCofactor: c.clearCofactor,
        fromBytes: c.fromBytes,
        toBytes: c.toBytes,
    };
    return { CURVE, curveOpts };
}
function _ecdsa_legacy_opts_to_new(c) {
    const { CURVE, curveOpts } = _weierstrass_legacy_opts_to_new(c);
    const ecdsaOpts = {
        hash: c.hash,
        hmac: c.hmac,
        randomBytes: c.randomBytes,
        lowS: c.lowS,
        bits2int: c.bits2int,
        bits2int_modN: c.bits2int_modN,
    };
    return { CURVE, curveOpts, ecdsaOpts };
}
function _weierstrass_new_output_to_legacy(c, Point) {
    const { Fp, Fn } = Point;
    // TODO: remove
    function isWithinCurveOrder(num) {
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.inRange)(num, _1n, Fn.ORDER);
    }
    const weierstrassEquation = _legacyHelperEquat(Fp, c.a, c.b);
    const normPrivateKeyToScalar = _legacyHelperNormPriv(Fn, c.allowedPrivateKeyLengths, c.wrapPrivateKey);
    return Object.assign({}, {
        CURVE: c,
        Point: Point,
        ProjectivePoint: Point,
        normPrivateKeyToScalar,
        weierstrassEquation,
        isWithinCurveOrder,
    });
}
function _ecdsa_new_output_to_legacy(c, ecdsa) {
    return Object.assign({}, ecdsa, {
        ProjectivePoint: ecdsa.Point,
        CURVE: c,
    });
}
// _ecdsa_legacy
function weierstrass(c) {
    const { CURVE, curveOpts, ecdsaOpts } = _ecdsa_legacy_opts_to_new(c);
    const Point = weierstrassN(CURVE, curveOpts);
    const signs = ecdsa(Point, ecdsaOpts, curveOpts);
    return _ecdsa_new_output_to_legacy(c, signs);
}
/**
 * Implementation of the Shallue and van de Woestijne method for any weierstrass curve.
 * TODO: check if there is a way to merge this with uvRatio in Edwards; move to modular.
 * b = True and y = sqrt(u / v) if (u / v) is square in F, and
 * b = False and y = sqrt(Z * (u / v)) otherwise.
 * @param Fp
 * @param Z
 * @returns
 */
function SWUFpSqrtRatio(Fp, Z) {
    // Generic implementation
    const q = Fp.ORDER;
    let l = _0n;
    for (let o = q - _1n; o % _2n === _0n; o /= _2n)
        l += _1n;
    const c1 = l; // 1. c1, the largest integer such that 2^c1 divides q - 1.
    // We need 2n ** c1 and 2n ** (c1-1). We can't use **; but we can use <<.
    // 2n ** c1 == 2n << (c1-1)
    const _2n_pow_c1_1 = _2n << (c1 - _1n - _1n);
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n;
    const c2 = (q - _1n) / _2n_pow_c1; // 2. c2 = (q - 1) / (2^c1)  # Integer arithmetic
    const c3 = (c2 - _1n) / _2n; // 3. c3 = (c2 - 1) / 2            # Integer arithmetic
    const c4 = _2n_pow_c1 - _1n; // 4. c4 = 2^c1 - 1                # Integer arithmetic
    const c5 = _2n_pow_c1_1; // 5. c5 = 2^(c1 - 1)                  # Integer arithmetic
    const c6 = Fp.pow(Z, c2); // 6. c6 = Z^c2
    const c7 = Fp.pow(Z, (c2 + _1n) / _2n); // 7. c7 = Z^((c2 + 1) / 2)
    let sqrtRatio = (u, v) => {
        let tv1 = c6; // 1. tv1 = c6
        let tv2 = Fp.pow(v, c4); // 2. tv2 = v^c4
        let tv3 = Fp.sqr(tv2); // 3. tv3 = tv2^2
        tv3 = Fp.mul(tv3, v); // 4. tv3 = tv3 * v
        let tv5 = Fp.mul(u, tv3); // 5. tv5 = u * tv3
        tv5 = Fp.pow(tv5, c3); // 6. tv5 = tv5^c3
        tv5 = Fp.mul(tv5, tv2); // 7. tv5 = tv5 * tv2
        tv2 = Fp.mul(tv5, v); // 8. tv2 = tv5 * v
        tv3 = Fp.mul(tv5, u); // 9. tv3 = tv5 * u
        let tv4 = Fp.mul(tv3, tv2); // 10. tv4 = tv3 * tv2
        tv5 = Fp.pow(tv4, c5); // 11. tv5 = tv4^c5
        let isQR = Fp.eql(tv5, Fp.ONE); // 12. isQR = tv5 == 1
        tv2 = Fp.mul(tv3, c7); // 13. tv2 = tv3 * c7
        tv5 = Fp.mul(tv4, tv1); // 14. tv5 = tv4 * tv1
        tv3 = Fp.cmov(tv2, tv3, isQR); // 15. tv3 = CMOV(tv2, tv3, isQR)
        tv4 = Fp.cmov(tv5, tv4, isQR); // 16. tv4 = CMOV(tv5, tv4, isQR)
        // 17. for i in (c1, c1 - 1, ..., 2):
        for (let i = c1; i > _1n; i--) {
            let tv5 = i - _2n; // 18.    tv5 = i - 2
            tv5 = _2n << (tv5 - _1n); // 19.    tv5 = 2^tv5
            let tvv5 = Fp.pow(tv4, tv5); // 20.    tv5 = tv4^tv5
            const e1 = Fp.eql(tvv5, Fp.ONE); // 21.    e1 = tv5 == 1
            tv2 = Fp.mul(tv3, tv1); // 22.    tv2 = tv3 * tv1
            tv1 = Fp.mul(tv1, tv1); // 23.    tv1 = tv1 * tv1
            tvv5 = Fp.mul(tv4, tv1); // 24.    tv5 = tv4 * tv1
            tv3 = Fp.cmov(tv2, tv3, e1); // 25.    tv3 = CMOV(tv2, tv3, e1)
            tv4 = Fp.cmov(tvv5, tv4, e1); // 26.    tv4 = CMOV(tv5, tv4, e1)
        }
        return { isValid: isQR, value: tv3 };
    };
    if (Fp.ORDER % _4n === _3n) {
        // sqrt_ratio_3mod4(u, v)
        const c1 = (Fp.ORDER - _3n) / _4n; // 1. c1 = (q - 3) / 4     # Integer arithmetic
        const c2 = Fp.sqrt(Fp.neg(Z)); // 2. c2 = sqrt(-Z)
        sqrtRatio = (u, v) => {
            let tv1 = Fp.sqr(v); // 1. tv1 = v^2
            const tv2 = Fp.mul(u, v); // 2. tv2 = u * v
            tv1 = Fp.mul(tv1, tv2); // 3. tv1 = tv1 * tv2
            let y1 = Fp.pow(tv1, c1); // 4. y1 = tv1^c1
            y1 = Fp.mul(y1, tv2); // 5. y1 = y1 * tv2
            const y2 = Fp.mul(y1, c2); // 6. y2 = y1 * c2
            const tv3 = Fp.mul(Fp.sqr(y1), v); // 7. tv3 = y1^2; 8. tv3 = tv3 * v
            const isQR = Fp.eql(tv3, u); // 9. isQR = tv3 == u
            let y = Fp.cmov(y2, y1, isQR); // 10. y = CMOV(y2, y1, isQR)
            return { isValid: isQR, value: y }; // 11. return (isQR, y) isQR ? y : y*c2
        };
    }
    // No curves uses that
    // if (Fp.ORDER % _8n === _5n) // sqrt_ratio_5mod8
    return sqrtRatio;
}
/**
 * Simplified Shallue-van de Woestijne-Ulas Method
 * https://www.rfc-editor.org/rfc/rfc9380#section-6.6.2
 */
function mapToCurveSimpleSWU(Fp, opts) {
    (0,_modular_js__WEBPACK_IMPORTED_MODULE_4__.validateField)(Fp);
    const { A, B, Z } = opts;
    if (!Fp.isValid(A) || !Fp.isValid(B) || !Fp.isValid(Z))
        throw new Error('mapToCurveSimpleSWU: invalid opts');
    const sqrtRatio = SWUFpSqrtRatio(Fp, Z);
    if (!Fp.isOdd)
        throw new Error('Field does not have .isOdd()');
    // Input: u, an element of F.
    // Output: (x, y), a point on E.
    return (u) => {
        // prettier-ignore
        let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
        tv1 = Fp.sqr(u); // 1.  tv1 = u^2
        tv1 = Fp.mul(tv1, Z); // 2.  tv1 = Z * tv1
        tv2 = Fp.sqr(tv1); // 3.  tv2 = tv1^2
        tv2 = Fp.add(tv2, tv1); // 4.  tv2 = tv2 + tv1
        tv3 = Fp.add(tv2, Fp.ONE); // 5.  tv3 = tv2 + 1
        tv3 = Fp.mul(tv3, B); // 6.  tv3 = B * tv3
        tv4 = Fp.cmov(Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO)); // 7.  tv4 = CMOV(Z, -tv2, tv2 != 0)
        tv4 = Fp.mul(tv4, A); // 8.  tv4 = A * tv4
        tv2 = Fp.sqr(tv3); // 9.  tv2 = tv3^2
        tv6 = Fp.sqr(tv4); // 10. tv6 = tv4^2
        tv5 = Fp.mul(tv6, A); // 11. tv5 = A * tv6
        tv2 = Fp.add(tv2, tv5); // 12. tv2 = tv2 + tv5
        tv2 = Fp.mul(tv2, tv3); // 13. tv2 = tv2 * tv3
        tv6 = Fp.mul(tv6, tv4); // 14. tv6 = tv6 * tv4
        tv5 = Fp.mul(tv6, B); // 15. tv5 = B * tv6
        tv2 = Fp.add(tv2, tv5); // 16. tv2 = tv2 + tv5
        x = Fp.mul(tv1, tv3); // 17.   x = tv1 * tv3
        const { isValid, value } = sqrtRatio(tv2, tv6); // 18. (is_gx1_square, y1) = sqrt_ratio(tv2, tv6)
        y = Fp.mul(tv1, u); // 19.   y = tv1 * u  -> Z * u^3 * y1
        y = Fp.mul(y, value); // 20.   y = y * y1
        x = Fp.cmov(x, tv3, isValid); // 21.   x = CMOV(x, tv3, is_gx1_square)
        y = Fp.cmov(y, value, isValid); // 22.   y = CMOV(y, y1, is_gx1_square)
        const e1 = Fp.isOdd(u) === Fp.isOdd(y); // 23.  e1 = sgn0(u) == sgn0(y)
        y = Fp.cmov(Fp.neg(y), y, e1); // 24.   y = CMOV(-y, y, e1)
        const tv4_inv = (0,_modular_js__WEBPACK_IMPORTED_MODULE_4__.FpInvertBatch)(Fp, [tv4], true)[0];
        x = Fp.mul(x, tv4_inv); // 25.   x = x / tv4
        return { x, y };
    };
}
//# sourceMappingURL=weierstrass.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/bls12-381.js":
/*!*****************************************************!*\
  !*** ./node_modules/@noble/curves/esm/bls12-381.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bls12_381_Fr": () => (/* binding */ bls12_381_Fr),
/* harmony export */   "bls12_381": () => (/* binding */ bls12_381)
/* harmony export */ });
/* harmony import */ var _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @noble/hashes/sha2.js */ "./node_modules/@noble/hashes/esm/sha2.js");
/* harmony import */ var _abstract_bls_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./abstract/bls.js */ "./node_modules/@noble/curves/esm/abstract/bls.js");
/* harmony import */ var _abstract_modular_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abstract/modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./abstract/hash-to-curve.js */ "./node_modules/@noble/curves/esm/abstract/hash-to-curve.js");
/* harmony import */ var _abstract_tower_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./abstract/tower.js */ "./node_modules/@noble/curves/esm/abstract/tower.js");
/* harmony import */ var _abstract_weierstrass_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./abstract/weierstrass.js */ "./node_modules/@noble/curves/esm/abstract/weierstrass.js");
/**
 * bls12-381 is pairing-friendly Barreto-Lynn-Scott elliptic curve construction allowing to:

* Construct zk-SNARKs at the ~120-bit security, as per [Barbulescu-Duquesne 2017](https://hal.science/hal-01534101/file/main.pdf)
* Efficiently verify N aggregate signatures with 1 pairing and N ec additions:
the Boneh-Lynn-Shacham signature scheme is orders of magnitude more efficient than Schnorr

BLS can mean 2 different things:

* Barreto-Lynn-Scott: BLS12, a Pairing Friendly Elliptic Curve
* Boneh-Lynn-Shacham: A Signature Scheme.

### Summary

1. BLS Relies on expensive bilinear pairing
2. Private Keys: 32 bytes
3. Public Keys: 48 OR 96 bytes - big-endian x coordinate of point on G1 OR G2 curve
4. Signatures: 96 OR 48 bytes - big-endian x coordinate of point on G2 OR G1 curve
5. The 12 stands for the Embedding degree.

Modes of operation:

* Long signatures:  48-byte keys + 96-byte sigs (G1 keys + G2 sigs).
* Short signatures: 96-byte keys + 48-byte sigs (G2 keys + G1 sigs).

### Formulas

- `P = pk x G` - public keys
- `S = pk x H(m)` - signing, uses hash-to-curve on m
- `e(P, H(m)) == e(G, S)` - verification using pairings
- `e(G, S) = e(G, SUM(n)(Si)) = MUL(n)(e(G, Si))` - signature aggregation

### Curves

G1 is ordinary elliptic curve. G2 is extension field curve, think "over complex numbers".

- G1: y² = x³ + 4
- G2: y² = x³ + 4(u + 1) where u = √−1; r-order subgroup of E'(Fp²), M-type twist

### Towers

Pairing G1 + G2 produces element in Fp₁₂, 12-degree polynomial.
Fp₁₂ is usually implemented using tower of lower-degree polynomials for speed.

- Fp₁₂ = Fp₆² => Fp₂³
- Fp(u) / (u² - β) where β = -1
- Fp₂(v) / (v³ - ξ) where ξ = u + 1
- Fp₆(w) / (w² - γ) where γ = v
- Fp²[u] = Fp/u²+1
- Fp⁶[v] = Fp²/v³-1-u
- Fp¹²[w] = Fp⁶/w²-v

### Params

* Embedding degree (k): 12
* Seed is sometimes named x or t
* t = -15132376222941642752
* p = (t-1)² * (t⁴-t²+1)/3 + t
* r = t⁴-t²+1
* Ate loop size: X

To verify curve parameters, see
[pairing-friendly-curves spec](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11).
Basic math is done over finite fields over p.
More complicated math is done over polynominal extension fields.

### Compatibility and notes
1. It is compatible with Algorand, Chia, Dfinity, Ethereum, Filecoin, ZEC.
Filecoin uses little endian byte arrays for private keys - make sure to reverse byte order.
2. Make sure to correctly select mode: "long signature" or "short signature".
3. Compatible with specs:
   RFC 9380,
   [cfrg-pairing-friendly-curves-11](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-pairing-friendly-curves-11),
   [cfrg-bls-signature-05](https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/).

 *
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */




// Types



// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3), _4n = BigInt(4);
// To verify math:
// https://tools.ietf.org/html/draft-irtf-cfrg-pairing-friendly-curves-11
// The BLS parameter x (seed) for BLS12-381. NOTE: it is negative!
// x = -2^63 - 2^62 - 2^60 - 2^57 - 2^48 - 2^16
const BLS_X = BigInt('0xd201000000010000');
// t = x (called differently in different places)
// const t = -BLS_X;
const BLS_X_LEN = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bitLen)(BLS_X);
// a=0, b=4
// P is characteristic of field Fp, in which curve calculations are done.
// p = (t-1)² * (t⁴-t²+1)/3 + t
// bls12_381_Fp = (t-1n)**2n * (t**4n - t**2n + 1n) / 3n + t
// r*h is curve order, amount of points on curve,
// where r is order of prime subgroup and h is cofactor.
// r = t⁴-t²+1
// r = (t**4n - t**2n + 1n)
// cofactor h of G1: (t - 1)²/3
// cofactorG1 = (t-1n)**2n/3n
// x = 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507
// y = 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569
const bls12_381_CURVE_G1 = {
    p: BigInt('0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab'),
    n: BigInt('0x73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001'),
    h: BigInt('0x396c8c005555e1568c00aaab0000aaab'),
    a: _0n,
    b: _4n,
    Gx: BigInt('0x17f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb'),
    Gy: BigInt('0x08b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1'),
};
// CURVE FIELDS
const bls12_381_Fr = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_1__.Field)(bls12_381_CURVE_G1.n);
const { Fp, Fp2, Fp6, Fp4Square, Fp12 } = (0,_abstract_tower_js__WEBPACK_IMPORTED_MODULE_2__.tower12)({
    // Order of Fp
    ORDER: bls12_381_CURVE_G1.p,
    // Finite extension field over irreducible polynominal.
    // Fp(u) / (u² - β) where β = -1
    FP2_NONRESIDUE: [_1n, _1n],
    Fp2mulByB: ({ c0, c1 }) => {
        const t0 = Fp.mul(c0, _4n); // 4 * c0
        const t1 = Fp.mul(c1, _4n); // 4 * c1
        // (T0-T1) + (T0+T1)*i
        return { c0: Fp.sub(t0, t1), c1: Fp.add(t0, t1) };
    },
    // Fp12
    // A cyclotomic group is a subgroup of Fp^n defined by
    //   GΦₙ(p) = {α ∈ Fpⁿ : α^Φₙ(p) = 1}
    // The result of any pairing is in a cyclotomic subgroup
    // https://eprint.iacr.org/2009/565.pdf
    Fp12cyclotomicSquare: ({ c0, c1 }) => {
        const { c0: c0c0, c1: c0c1, c2: c0c2 } = c0;
        const { c0: c1c0, c1: c1c1, c2: c1c2 } = c1;
        const { first: t3, second: t4 } = Fp4Square(c0c0, c1c1);
        const { first: t5, second: t6 } = Fp4Square(c1c0, c0c2);
        const { first: t7, second: t8 } = Fp4Square(c0c1, c1c2);
        const t9 = Fp2.mulByNonresidue(t8); // T8 * (u + 1)
        return {
            c0: Fp6.create({
                c0: Fp2.add(Fp2.mul(Fp2.sub(t3, c0c0), _2n), t3), // 2 * (T3 - c0c0)  + T3
                c1: Fp2.add(Fp2.mul(Fp2.sub(t5, c0c1), _2n), t5), // 2 * (T5 - c0c1)  + T5
                c2: Fp2.add(Fp2.mul(Fp2.sub(t7, c0c2), _2n), t7),
            }), // 2 * (T7 - c0c2)  + T7
            c1: Fp6.create({
                c0: Fp2.add(Fp2.mul(Fp2.add(t9, c1c0), _2n), t9), // 2 * (T9 + c1c0) + T9
                c1: Fp2.add(Fp2.mul(Fp2.add(t4, c1c1), _2n), t4), // 2 * (T4 + c1c1) + T4
                c2: Fp2.add(Fp2.mul(Fp2.add(t6, c1c2), _2n), t6),
            }),
        }; // 2 * (T6 + c1c2) + T6
    },
    Fp12cyclotomicExp(num, n) {
        let z = Fp12.ONE;
        for (let i = BLS_X_LEN - 1; i >= 0; i--) {
            z = Fp12._cyclotomicSquare(z);
            if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bitGet)(n, i))
                z = Fp12.mul(z, num);
        }
        return z;
    },
    // https://eprint.iacr.org/2010/354.pdf
    // https://eprint.iacr.org/2009/565.pdf
    Fp12finalExponentiate: (num) => {
        const x = BLS_X;
        // this^(q⁶) / this
        const t0 = Fp12.div(Fp12.frobeniusMap(num, 6), num);
        // t0^(q²) * t0
        const t1 = Fp12.mul(Fp12.frobeniusMap(t0, 2), t0);
        const t2 = Fp12.conjugate(Fp12._cyclotomicExp(t1, x));
        const t3 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicSquare(t1)), t2);
        const t4 = Fp12.conjugate(Fp12._cyclotomicExp(t3, x));
        const t5 = Fp12.conjugate(Fp12._cyclotomicExp(t4, x));
        const t6 = Fp12.mul(Fp12.conjugate(Fp12._cyclotomicExp(t5, x)), Fp12._cyclotomicSquare(t2));
        const t7 = Fp12.conjugate(Fp12._cyclotomicExp(t6, x));
        const t2_t5_pow_q2 = Fp12.frobeniusMap(Fp12.mul(t2, t5), 2);
        const t4_t1_pow_q3 = Fp12.frobeniusMap(Fp12.mul(t4, t1), 3);
        const t6_t1c_pow_q1 = Fp12.frobeniusMap(Fp12.mul(t6, Fp12.conjugate(t1)), 1);
        const t7_t3c_t1 = Fp12.mul(Fp12.mul(t7, Fp12.conjugate(t3)), t1);
        // (t2 * t5)^(q²) * (t4 * t1)^(q³) * (t6 * t1.conj)^(q^1) * t7 * t3.conj * t1
        return Fp12.mul(Fp12.mul(Fp12.mul(t2_t5_pow_q2, t4_t1_pow_q3), t6_t1c_pow_q1), t7_t3c_t1);
    },
});
// GLV endomorphism Ψ(P), for fast cofactor clearing
const { G2psi, G2psi2 } = (0,_abstract_tower_js__WEBPACK_IMPORTED_MODULE_2__.psiFrobenius)(Fp, Fp2, Fp2.div(Fp2.ONE, Fp2.NONRESIDUE)); // 1/(u+1)
/**
 * Default hash_to_field / hash-to-curve for BLS.
 * m: 1 for G1, 2 for G2
 * k: target security level in bits
 * hash: any function, e.g. BBS+ uses BLAKE2: see [github](https://github.com/hyperledger/aries-framework-go/issues/2247).
 * Parameter values come from [section 8.8.2 of RFC 9380](https://www.rfc-editor.org/rfc/rfc9380#section-8.8.2).
 */
const htfDefaults = Object.freeze({
    DST: 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_',
    encodeDST: 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_',
    p: Fp.ORDER,
    m: 2,
    k: 128,
    expand: 'xmd',
    hash: _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_3__.sha256,
});
// a=0, b=4
// cofactor h of G2
// (t^8 - 4t^7 + 5t^6 - 4t^4 + 6t^3 - 4t^2 - 4t + 13)/9
// cofactorG2 = (t**8n - 4n*t**7n + 5n*t**6n - 4n*t**4n + 6n*t**3n - 4n*t**2n - 4n*t+13n)/9n
// x = 3059144344244213709971259814753781636986470325476647558659373206291635324768958432433509563104347017837885763365758*u + 352701069587466618187139116011060144890029952792775240219908644239793785735715026873347600343865175952761926303160
// y = 927553665492332455747201965776037880757740193453592970025027978793976877002675564980949289727957565575433344219582*u + 1985150602287291935568054521177171638300868978215655730859378665066344726373823718423869104263333984641494340347905
const bls12_381_CURVE_G2 = {
    p: Fp2.ORDER,
    n: bls12_381_CURVE_G1.n,
    h: BigInt('0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5'),
    a: Fp2.ZERO,
    b: Fp2.fromBigTuple([_4n, _4n]),
    Gx: Fp2.fromBigTuple([
        BigInt('0x024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8'),
        BigInt('0x13e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e'),
    ]),
    Gy: Fp2.fromBigTuple([
        BigInt('0x0ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801'),
        BigInt('0x0606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be'),
    ]),
};
// Encoding utils
// Compressed point of infinity
// Set compressed & point-at-infinity bits
const COMPZERO = setMask(Fp.toBytes(_0n), { infinity: true, compressed: true });
function parseMask(bytes) {
    // Copy, so we can remove mask data. It will be removed also later, when Fp.create will call modulo.
    bytes = bytes.slice();
    const mask = bytes[0] & 224;
    const compressed = !!((mask >> 7) & 1); // compression bit (0b1000_0000)
    const infinity = !!((mask >> 6) & 1); // point at infinity bit (0b0100_0000)
    const sort = !!((mask >> 5) & 1); // sort bit (0b0010_0000)
    bytes[0] &= 31; // clear mask (zero first 3 bits)
    return { compressed, infinity, sort, value: bytes };
}
function setMask(bytes, mask) {
    if (bytes[0] & 224)
        throw new Error('setMask: non-empty mask');
    if (mask.compressed)
        bytes[0] |= 128;
    if (mask.infinity)
        bytes[0] |= 64;
    if (mask.sort)
        bytes[0] |= 32;
    return bytes;
}
function pointG1ToBytes(_c, point, isComp) {
    const { BYTES: L, ORDER: P } = Fp;
    const is0 = point.is0();
    const { x, y } = point.toAffine();
    if (isComp) {
        if (is0)
            return COMPZERO.slice();
        const sort = Boolean((y * _2n) / P);
        return setMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x, L), { compressed: true, sort });
    }
    else {
        if (is0) {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(Uint8Array.of(0x40), new Uint8Array(2 * L - 1));
        }
        else {
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x, L), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(y, L));
        }
    }
}
function signatureG1ToBytes(point) {
    point.assertValidity();
    const { BYTES: L, ORDER: P } = Fp;
    const { x, y } = point.toAffine();
    if (point.is0())
        return COMPZERO.slice();
    const sort = Boolean((y * _2n) / P);
    return setMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x, L), { compressed: true, sort });
}
function pointG1FromBytes(bytes) {
    const { compressed, infinity, sort, value } = parseMask(bytes);
    const { BYTES: L, ORDER: P } = Fp;
    if (value.length === 48 && compressed) {
        const compressedValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value);
        // Zero
        const x = Fp.create(compressedValue & Fp.MASK);
        if (infinity) {
            if (x !== _0n)
                throw new Error('invalid G1 point: non-empty, at infinity, with compression');
            return { x: _0n, y: _0n };
        }
        const right = Fp.add(Fp.pow(x, _3n), Fp.create(bls12_381_CURVE_G1.b)); // y² = x³ + b
        let y = Fp.sqrt(right);
        if (!y)
            throw new Error('invalid G1 point: compressed point');
        if ((y * _2n) / P !== BigInt(sort))
            y = Fp.neg(y);
        return { x: Fp.create(x), y: Fp.create(y) };
    }
    else if (value.length === 96 && !compressed) {
        // Check if the infinity flag is set
        const x = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value.subarray(0, L));
        const y = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value.subarray(L));
        if (infinity) {
            if (x !== _0n || y !== _0n)
                throw new Error('G1: non-empty point at infinity');
            return bls12_381.G1.Point.ZERO.toAffine();
        }
        return { x: Fp.create(x), y: Fp.create(y) };
    }
    else {
        throw new Error('invalid G1 point: expected 48/96 bytes');
    }
}
function signatureG1FromBytes(hex) {
    const { infinity, sort, value } = parseMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('signatureHex', hex, 48));
    const P = Fp.ORDER;
    const Point = bls12_381.G1.Point;
    const compressedValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value);
    // Zero
    if (infinity)
        return Point.ZERO;
    const x = Fp.create(compressedValue & Fp.MASK);
    const right = Fp.add(Fp.pow(x, _3n), Fp.create(bls12_381_CURVE_G1.b)); // y² = x³ + b
    let y = Fp.sqrt(right);
    if (!y)
        throw new Error('invalid G1 point: compressed');
    const aflag = BigInt(sort);
    if ((y * _2n) / P !== aflag)
        y = Fp.neg(y);
    const point = Point.fromAffine({ x, y });
    point.assertValidity();
    return point;
}
function pointG2ToBytes(_c, point, isComp) {
    const { BYTES: L, ORDER: P } = Fp;
    const is0 = point.is0();
    const { x, y } = point.toAffine();
    if (isComp) {
        if (is0)
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(COMPZERO, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(_0n, L));
        const flag = Boolean(y.c1 === _0n ? (y.c0 * _2n) / P : (y.c1 * _2n) / P);
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(setMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x.c1, L), { compressed: true, sort: flag }), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x.c0, L));
    }
    else {
        if (is0)
            return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(Uint8Array.of(0x40), new Uint8Array(4 * L - 1));
        const { re: x0, im: x1 } = Fp2.reim(x);
        const { re: y0, im: y1 } = Fp2.reim(y);
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x1, L), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x0, L), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(y1, L), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(y0, L));
    }
}
function signatureG2ToBytes(point) {
    point.assertValidity();
    const { BYTES: L } = Fp;
    if (point.is0())
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(COMPZERO, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(_0n, L));
    const { x, y } = point.toAffine();
    const { re: x0, im: x1 } = Fp2.reim(x);
    const { re: y0, im: y1 } = Fp2.reim(y);
    const tmp = y1 > _0n ? y1 * _2n : y0 * _2n;
    const sort = Boolean((tmp / Fp.ORDER) & _1n);
    const z2 = x0;
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.concatBytes)(setMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(x1, L), { sort, compressed: true }), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.numberToBytesBE)(z2, L));
}
function pointG2FromBytes(bytes) {
    const { BYTES: L, ORDER: P } = Fp;
    const { compressed, infinity, sort, value } = parseMask(bytes);
    if ((!compressed && !infinity && sort) || // 00100000
        (!compressed && infinity && sort) || // 01100000
        (sort && infinity && compressed) // 11100000
    ) {
        throw new Error('invalid encoding flag: ' + (bytes[0] & 224));
    }
    const slc = (b, from, to) => (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(b.slice(from, to));
    if (value.length === 96 && compressed) {
        if (infinity) {
            // check that all bytes are 0
            if (value.reduce((p, c) => (p !== 0 ? c + 1 : c), 0) > 0) {
                throw new Error('invalid G2 point: compressed');
            }
            return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x_1 = slc(value, 0, L);
        const x_0 = slc(value, L, 2 * L);
        const x = Fp2.create({ c0: Fp.create(x_0), c1: Fp.create(x_1) });
        const right = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b); // y² = x³ + 4 * (u+1) = x³ + b
        let y = Fp2.sqrt(right);
        const Y_bit = y.c1 === _0n ? (y.c0 * _2n) / P : (y.c1 * _2n) / P ? _1n : _0n;
        y = sort && Y_bit > 0 ? y : Fp2.neg(y);
        return { x, y };
    }
    else if (value.length === 192 && !compressed) {
        if (infinity) {
            if (value.reduce((p, c) => (p !== 0 ? c + 1 : c), 0) > 0) {
                throw new Error('invalid G2 point: uncompressed');
            }
            return { x: Fp2.ZERO, y: Fp2.ZERO };
        }
        const x1 = slc(value, 0 * L, 1 * L);
        const x0 = slc(value, 1 * L, 2 * L);
        const y1 = slc(value, 2 * L, 3 * L);
        const y0 = slc(value, 3 * L, 4 * L);
        return { x: Fp2.fromBigTuple([x0, x1]), y: Fp2.fromBigTuple([y0, y1]) };
    }
    else {
        throw new Error('invalid G2 point: expected 96/192 bytes');
    }
}
function signatureG2FromBytes(hex) {
    const { ORDER: P } = Fp;
    // TODO: Optimize, it's very slow because of sqrt.
    const { infinity, sort, value } = parseMask((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ensureBytes)('signatureHex', hex));
    const Point = bls12_381.G2.Point;
    const half = value.length / 2;
    if (half !== 48 && half !== 96)
        throw new Error('invalid compressed signature length, expected 96/192 bytes');
    const z1 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value.slice(0, half));
    const z2 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToNumberBE)(value.slice(half));
    // Indicates the infinity point
    if (infinity)
        return Point.ZERO;
    const x1 = Fp.create(z1 & Fp.MASK);
    const x2 = Fp.create(z2);
    const x = Fp2.create({ c0: x2, c1: x1 });
    const y2 = Fp2.add(Fp2.pow(x, _3n), bls12_381_CURVE_G2.b); // y² = x³ + 4
    // The slow part
    let y = Fp2.sqrt(y2);
    if (!y)
        throw new Error('Failed to find a square root');
    // Choose the y whose leftmost bit of the imaginary part is equal to the a_flag1
    // If y1 happens to be zero, then use the bit of y0
    const { re: y0, im: y1 } = Fp2.reim(y);
    const aflag1 = BigInt(sort);
    const isGreater = y1 > _0n && (y1 * _2n) / P !== aflag1;
    const is0 = y1 === _0n && (y0 * _2n) / P !== aflag1;
    if (isGreater || is0)
        y = Fp2.neg(y);
    const point = Point.fromAffine({ x, y });
    point.assertValidity();
    return point;
}
/**
 * bls12-381 pairing-friendly curve.
 * @example
 * import { bls12_381 as bls } from '@noble/curves/bls12-381';
 * // G1 keys, G2 signatures
 * const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
 * const message = '64726e3da8';
 * const publicKey = bls.getPublicKey(privateKey);
 * const signature = bls.sign(message, privateKey);
 * const isValid = bls.verify(signature, message, publicKey);
 */
const bls12_381 = (0,_abstract_bls_js__WEBPACK_IMPORTED_MODULE_5__.bls)({
    // Fields
    fields: {
        Fp,
        Fp2,
        Fp6,
        Fp12,
        Fr: bls12_381_Fr,
    },
    // G1: y² = x³ + 4
    G1: {
        ...bls12_381_CURVE_G1,
        Fp,
        htfDefaults: { ...htfDefaults, m: 1, DST: 'BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_' },
        wrapPrivateKey: true,
        allowInfinityPoint: true,
        // Checks is the point resides in prime-order subgroup.
        // point.isTorsionFree() should return true for valid points
        // It returns false for shitty points.
        // https://eprint.iacr.org/2021/1130.pdf
        isTorsionFree: (c, point) => {
            // GLV endomorphism ψ(P)
            const beta = BigInt('0x5f19672fdf76ce51ba69c6076a0f77eaddb3a93be6f89688de17d813620a00022e01fffffffefffe');
            const phi = new c(Fp.mul(point.px, beta), point.py, point.pz);
            // TODO: unroll
            const xP = point.multiplyUnsafe(BLS_X).negate(); // [x]P
            const u2P = xP.multiplyUnsafe(BLS_X); // [u2]P
            return u2P.equals(phi);
        },
        // Clear cofactor of G1
        // https://eprint.iacr.org/2019/403
        clearCofactor: (_c, point) => {
            // return this.multiplyUnsafe(CURVE.h);
            return point.multiplyUnsafe(BLS_X).add(point); // x*P + P
        },
        mapToCurve: mapToG1,
        fromBytes: pointG1FromBytes,
        toBytes: pointG1ToBytes,
        ShortSignature: {
            fromBytes(bytes) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.abytes)(bytes);
                return signatureG1FromBytes(bytes);
            },
            fromHex(hex) {
                return signatureG1FromBytes(hex);
            },
            toBytes(point) {
                return signatureG1ToBytes(point);
            },
            toRawBytes(point) {
                return signatureG1ToBytes(point);
            },
            toHex(point) {
                return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.bytesToHex)(signatureG1ToBytes(point));
            },
        },
    },
    G2: {
        ...bls12_381_CURVE_G2,
        Fp: Fp2,
        // https://datatracker.ietf.org/doc/html/rfc9380#name-clearing-the-cofactor
        // https://datatracker.ietf.org/doc/html/rfc9380#name-cofactor-clearing-for-bls12
        hEff: BigInt('0xbc69f08f2ee75b3584c6a0ea91b352888e2a8e9145ad7689986ff031508ffe1329c2f178731db956d82bf015d1212b02ec0ec69d7477c1ae954cbc06689f6a359894c0adebbf6b4e8020005aaa95551'),
        htfDefaults: { ...htfDefaults },
        wrapPrivateKey: true,
        allowInfinityPoint: true,
        mapToCurve: mapToG2,
        // Checks is the point resides in prime-order subgroup.
        // point.isTorsionFree() should return true for valid points
        // It returns false for shitty points.
        // https://eprint.iacr.org/2021/1130.pdf
        // Older version: https://eprint.iacr.org/2019/814.pdf
        isTorsionFree: (c, P) => {
            return P.multiplyUnsafe(BLS_X).negate().equals(G2psi(c, P)); // ψ(P) == [u](P)
        },
        // Maps the point into the prime-order subgroup G2.
        // clear_cofactor_bls12381_g2 from RFC 9380.
        // https://eprint.iacr.org/2017/419.pdf
        // prettier-ignore
        clearCofactor: (c, P) => {
            const x = BLS_X;
            let t1 = P.multiplyUnsafe(x).negate(); // [-x]P
            let t2 = G2psi(c, P); // Ψ(P)
            let t3 = P.double(); // 2P
            t3 = G2psi2(c, t3); // Ψ²(2P)
            t3 = t3.subtract(t2); // Ψ²(2P) - Ψ(P)
            t2 = t1.add(t2); // [-x]P + Ψ(P)
            t2 = t2.multiplyUnsafe(x).negate(); // [x²]P - [x]Ψ(P)
            t3 = t3.add(t2); // Ψ²(2P) - Ψ(P) + [x²]P - [x]Ψ(P)
            t3 = t3.subtract(t1); // Ψ²(2P) - Ψ(P) + [x²]P - [x]Ψ(P) + [x]P
            const Q = t3.subtract(P); // Ψ²(2P) - Ψ(P) + [x²]P - [x]Ψ(P) + [x]P - 1P
            return Q; // [x²-x-1]P + [x-1]Ψ(P) + Ψ²(2P)
        },
        fromBytes: pointG2FromBytes,
        toBytes: pointG2ToBytes,
        Signature: {
            fromBytes(bytes) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.abytes)(bytes);
                return signatureG2FromBytes(bytes);
            },
            fromHex(hex) {
                return signatureG2FromBytes(hex);
            },
            toBytes(point) {
                return signatureG2ToBytes(point);
            },
            toRawBytes(point) {
                return signatureG2ToBytes(point);
            },
            toHex(point) {
                return (0,_utils_js__WEBPACK_IMPORTED_MODULE_4__.bytesToHex)(signatureG2ToBytes(point));
            },
        },
    },
    params: {
        ateLoopSize: BLS_X, // The BLS parameter x for BLS12-381
        r: bls12_381_CURVE_G1.n, // order; z⁴ − z² + 1; CURVE.n from other curves
        xNegative: true,
        twistType: 'multiplicative',
    },
    htfDefaults,
    hash: _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_3__.sha256,
});
// 3-isogeny map from E' to E https://www.rfc-editor.org/rfc/rfc9380#appendix-E.3
const isogenyMapG2 = (0,_abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__.isogenyMap)(Fp2, [
    // xNum
    [
        [
            '0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6',
            '0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97d6',
        ],
        [
            '0x0',
            '0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71a',
        ],
        [
            '0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71e',
            '0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38d',
        ],
        [
            '0x171d6541fa38ccfaed6dea691f5fb614cb14b4e7f4e810aa22d6108f142b85757098e38d0f671c7188e2aaaaaaaa5ed1',
            '0x0',
        ],
    ],
    // xDen
    [
        [
            '0x0',
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa63',
        ],
        [
            '0xc',
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa9f',
        ],
        ['0x1', '0x0'], // LAST 1
    ],
    // yNum
    [
        [
            '0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706',
            '0x1530477c7ab4113b59a4c18b076d11930f7da5d4a07f649bf54439d87d27e500fc8c25ebf8c92f6812cfc71c71c6d706',
        ],
        [
            '0x0',
            '0x5c759507e8e333ebb5b7a9a47d7ed8532c52d39fd3a042a88b58423c50ae15d5c2638e343d9c71c6238aaaaaaaa97be',
        ],
        [
            '0x11560bf17baa99bc32126fced787c88f984f87adf7ae0c7f9a208c6b4f20a4181472aaa9cb8d555526a9ffffffffc71c',
            '0x8ab05f8bdd54cde190937e76bc3e447cc27c3d6fbd7063fcd104635a790520c0a395554e5c6aaaa9354ffffffffe38f',
        ],
        [
            '0x124c9ad43b6cf79bfbf7043de3811ad0761b0f37a1e26286b0e977c69aa274524e79097a56dc4bd9e1b371c71c718b10',
            '0x0',
        ],
    ],
    // yDen
    [
        [
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb',
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa8fb',
        ],
        [
            '0x0',
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffa9d3',
        ],
        [
            '0x12',
            '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaa99',
        ],
        ['0x1', '0x0'], // LAST 1
    ],
].map((i) => i.map((pair) => Fp2.fromBigTuple(pair.map(BigInt)))));
// 11-isogeny map from E' to E
const isogenyMapG1 = (0,_abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__.isogenyMap)(Fp, [
    // xNum
    [
        '0x11a05f2b1e833340b809101dd99815856b303e88a2d7005ff2627b56cdb4e2c85610c2d5f2e62d6eaeac1662734649b7',
        '0x17294ed3e943ab2f0588bab22147a81c7c17e75b2f6a8417f565e33c70d1e86b4838f2a6f318c356e834eef1b3cb83bb',
        '0xd54005db97678ec1d1048c5d10a9a1bce032473295983e56878e501ec68e25c958c3e3d2a09729fe0179f9dac9edcb0',
        '0x1778e7166fcc6db74e0609d307e55412d7f5e4656a8dbf25f1b33289f1b330835336e25ce3107193c5b388641d9b6861',
        '0xe99726a3199f4436642b4b3e4118e5499db995a1257fb3f086eeb65982fac18985a286f301e77c451154ce9ac8895d9',
        '0x1630c3250d7313ff01d1201bf7a74ab5db3cb17dd952799b9ed3ab9097e68f90a0870d2dcae73d19cd13c1c66f652983',
        '0xd6ed6553fe44d296a3726c38ae652bfb11586264f0f8ce19008e218f9c86b2a8da25128c1052ecaddd7f225a139ed84',
        '0x17b81e7701abdbe2e8743884d1117e53356de5ab275b4db1a682c62ef0f2753339b7c8f8c8f475af9ccb5618e3f0c88e',
        '0x80d3cf1f9a78fc47b90b33563be990dc43b756ce79f5574a2c596c928c5d1de4fa295f296b74e956d71986a8497e317',
        '0x169b1f8e1bcfa7c42e0c37515d138f22dd2ecb803a0c5c99676314baf4bb1b7fa3190b2edc0327797f241067be390c9e',
        '0x10321da079ce07e272d8ec09d2565b0dfa7dccdde6787f96d50af36003b14866f69b771f8c285decca67df3f1605fb7b',
        '0x6e08c248e260e70bd1e962381edee3d31d79d7e22c837bc23c0bf1bc24c6b68c24b1b80b64d391fa9c8ba2e8ba2d229',
    ],
    // xDen
    [
        '0x8ca8d548cff19ae18b2e62f4bd3fa6f01d5ef4ba35b48ba9c9588617fc8ac62b558d681be343df8993cf9fa40d21b1c',
        '0x12561a5deb559c4348b4711298e536367041e8ca0cf0800c0126c2588c48bf5713daa8846cb026e9e5c8276ec82b3bff',
        '0xb2962fe57a3225e8137e629bff2991f6f89416f5a718cd1fca64e00b11aceacd6a3d0967c94fedcfcc239ba5cb83e19',
        '0x3425581a58ae2fec83aafef7c40eb545b08243f16b1655154cca8abc28d6fd04976d5243eecf5c4130de8938dc62cd8',
        '0x13a8e162022914a80a6f1d5f43e7a07dffdfc759a12062bb8d6b44e833b306da9bd29ba81f35781d539d395b3532a21e',
        '0xe7355f8e4e667b955390f7f0506c6e9395735e9ce9cad4d0a43bcef24b8982f7400d24bc4228f11c02df9a29f6304a5',
        '0x772caacf16936190f3e0c63e0596721570f5799af53a1894e2e073062aede9cea73b3538f0de06cec2574496ee84a3a',
        '0x14a7ac2a9d64a8b230b3f5b074cf01996e7f63c21bca68a81996e1cdf9822c580fa5b9489d11e2d311f7d99bbdcc5a5e',
        '0xa10ecf6ada54f825e920b3dafc7a3cce07f8d1d7161366b74100da67f39883503826692abba43704776ec3a79a1d641',
        '0x95fc13ab9e92ad4476d6e3eb3a56680f682b4ee96f7d03776df533978f31c1593174e4b4b7865002d6384d168ecdd0a',
        '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', // LAST 1
    ],
    // yNum
    [
        '0x90d97c81ba24ee0259d1f094980dcfa11ad138e48a869522b52af6c956543d3cd0c7aee9b3ba3c2be9845719707bb33',
        '0x134996a104ee5811d51036d776fb46831223e96c254f383d0f906343eb67ad34d6c56711962fa8bfe097e75a2e41c696',
        '0xcc786baa966e66f4a384c86a3b49942552e2d658a31ce2c344be4b91400da7d26d521628b00523b8dfe240c72de1f6',
        '0x1f86376e8981c217898751ad8746757d42aa7b90eeb791c09e4a3ec03251cf9de405aba9ec61deca6355c77b0e5f4cb',
        '0x8cc03fdefe0ff135caf4fe2a21529c4195536fbe3ce50b879833fd221351adc2ee7f8dc099040a841b6daecf2e8fedb',
        '0x16603fca40634b6a2211e11db8f0a6a074a7d0d4afadb7bd76505c3d3ad5544e203f6326c95a807299b23ab13633a5f0',
        '0x4ab0b9bcfac1bbcb2c977d027796b3ce75bb8ca2be184cb5231413c4d634f3747a87ac2460f415ec961f8855fe9d6f2',
        '0x987c8d5333ab86fde9926bd2ca6c674170a05bfe3bdd81ffd038da6c26c842642f64550fedfe935a15e4ca31870fb29',
        '0x9fc4018bd96684be88c9e221e4da1bb8f3abd16679dc26c1e8b6e6a1f20cabe69d65201c78607a360370e577bdba587',
        '0xe1bba7a1186bdb5223abde7ada14a23c42a0ca7915af6fe06985e7ed1e4d43b9b3f7055dd4eba6f2bafaaebca731c30',
        '0x19713e47937cd1be0dfd0b8f1d43fb93cd2fcbcb6caf493fd1183e416389e61031bf3a5cce3fbafce813711ad011c132',
        '0x18b46a908f36f6deb918c143fed2edcc523559b8aaf0c2462e6bfe7f911f643249d9cdf41b44d606ce07c8a4d0074d8e',
        '0xb182cac101b9399d155096004f53f447aa7b12a3426b08ec02710e807b4633f06c851c1919211f20d4c04f00b971ef8',
        '0x245a394ad1eca9b72fc00ae7be315dc757b3b080d4c158013e6632d3c40659cc6cf90ad1c232a6442d9d3f5db980133',
        '0x5c129645e44cf1102a159f748c4a3fc5e673d81d7e86568d9ab0f5d396a7ce46ba1049b6579afb7866b1e715475224b',
        '0x15e6be4e990f03ce4ea50b3b42df2eb5cb181d8f84965a3957add4fa95af01b2b665027efec01c7704b456be69c8b604',
    ],
    // yDen
    [
        '0x16112c4c3a9c98b252181140fad0eae9601a6de578980be6eec3232b5be72e7a07f3688ef60c206d01479253b03663c1',
        '0x1962d75c2381201e1a0cbd6c43c348b885c84ff731c4d59ca4a10356f453e01f78a4260763529e3532f6102c2e49a03d',
        '0x58df3306640da276faaae7d6e8eb15778c4855551ae7f310c35a5dd279cd2eca6757cd636f96f891e2538b53dbf67f2',
        '0x16b7d288798e5395f20d23bf89edb4d1d115c5dbddbcd30e123da489e726af41727364f2c28297ada8d26d98445f5416',
        '0xbe0e079545f43e4b00cc912f8228ddcc6d19c9f0f69bbb0542eda0fc9dec916a20b15dc0fd2ededda39142311a5001d',
        '0x8d9e5297186db2d9fb266eaac783182b70152c65550d881c5ecd87b6f0f5a6449f38db9dfa9cce202c6477faaf9b7ac',
        '0x166007c08a99db2fc3ba8734ace9824b5eecfdfa8d0cf8ef5dd365bc400a0051d5fa9c01a58b1fb93d1a1399126a775c',
        '0x16a3ef08be3ea7ea03bcddfabba6ff6ee5a4375efa1f4fd7feb34fd206357132b920f5b00801dee460ee415a15812ed9',
        '0x1866c8ed336c61231a1be54fd1d74cc4f9fb0ce4c6af5920abc5750c4bf39b4852cfe2f7bb9248836b233d9d55535d4a',
        '0x167a55cda70a6e1cea820597d94a84903216f763e13d87bb5308592e7ea7d4fbc7385ea3d529b35e346ef48bb8913f55',
        '0x4d2f259eea405bd48f010a01ad2911d9c6dd039bb61a6290e591b36e636a5c871a5c29f4f83060400f8b49cba8f6aa8',
        '0xaccbb67481d033ff5852c1e48c50c477f94ff8aefce42d28c0f9a88cea7913516f968986f7ebbea9684b529e2561092',
        '0xad6b9514c767fe3c3613144b45f1496543346d98adf02267d5ceef9a00d9b8693000763e3b90ac11e99b138573345cc',
        '0x2660400eb2e4f3b628bdd0d53cd76f2bf565b94e72927c1cb748df27942480e420517bd8714cc80d1fadc1326ed06f7',
        '0xe0fa1d816ddc03e6b24255e0d7819c171c40f65e273b853324efcd6356caa205ca2f570f13497804415473a1d634b8f',
        '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001', // LAST 1
    ],
].map((i) => i.map((j) => BigInt(j))));
// Optimized SWU Map - Fp to G1
const G1_SWU = (0,_abstract_weierstrass_js__WEBPACK_IMPORTED_MODULE_7__.mapToCurveSimpleSWU)(Fp, {
    A: Fp.create(BigInt('0x144698a3b8e9433d693a02c96d4982b0ea985383ee66a8d8e8981aefd881ac98936f8da0e0f97f5cf428082d584c1d')),
    B: Fp.create(BigInt('0x12e2908d11688030018b12e8753eee3b2016c1f0f24f4070a0b9c14fcef35ef55a23215a316ceaa5d1cc48e98e172be0')),
    Z: Fp.create(BigInt(11)),
});
// SWU Map - Fp2 to G2': y² = x³ + 240i * x + 1012 + 1012i
const G2_SWU = (0,_abstract_weierstrass_js__WEBPACK_IMPORTED_MODULE_7__.mapToCurveSimpleSWU)(Fp2, {
    A: Fp2.create({ c0: Fp.create(_0n), c1: Fp.create(BigInt(240)) }), // A' = 240 * I
    B: Fp2.create({ c0: Fp.create(BigInt(1012)), c1: Fp.create(BigInt(1012)) }), // B' = 1012 * (1 + I)
    Z: Fp2.create({ c0: Fp.create(BigInt(-2)), c1: Fp.create(BigInt(-1)) }), // Z: -(2 + I)
});
function mapToG1(scalars) {
    const { x, y } = G1_SWU(Fp.create(scalars[0]));
    return isogenyMapG1(x, y);
}
function mapToG2(scalars) {
    const { x, y } = G2_SWU(Fp2.fromBigTuple(scalars));
    return isogenyMapG2(x, y);
}
//# sourceMappingURL=bls12-381.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/ed25519.js":
/*!***************************************************!*\
  !*** ./node_modules/@noble/curves/esm/ed25519.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ED25519_TORSION_SUBGROUP": () => (/* binding */ ED25519_TORSION_SUBGROUP),
/* harmony export */   "ed25519": () => (/* binding */ ed25519),
/* harmony export */   "ed25519ctx": () => (/* binding */ ed25519ctx),
/* harmony export */   "ed25519ph": () => (/* binding */ ed25519ph),
/* harmony export */   "x25519": () => (/* binding */ x25519),
/* harmony export */   "edwardsToMontgomeryPub": () => (/* binding */ edwardsToMontgomeryPub),
/* harmony export */   "edwardsToMontgomery": () => (/* binding */ edwardsToMontgomery),
/* harmony export */   "edwardsToMontgomeryPriv": () => (/* binding */ edwardsToMontgomeryPriv),
/* harmony export */   "ed25519_hasher": () => (/* binding */ ed25519_hasher),
/* harmony export */   "hashToCurve": () => (/* binding */ hashToCurve),
/* harmony export */   "encodeToCurve": () => (/* binding */ encodeToCurve),
/* harmony export */   "RistrettoPoint": () => (/* binding */ RistrettoPoint),
/* harmony export */   "hashToRistretto255": () => (/* binding */ hashToRistretto255),
/* harmony export */   "hash_to_ristretto255": () => (/* binding */ hash_to_ristretto255)
/* harmony export */ });
/* harmony import */ var _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/hashes/sha2.js */ "./node_modules/@noble/hashes/esm/sha2.js");
/* harmony import */ var _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/* harmony import */ var _abstract_curve_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./abstract/curve.js */ "./node_modules/@noble/curves/esm/abstract/curve.js");
/* harmony import */ var _abstract_edwards_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./abstract/edwards.js */ "./node_modules/@noble/curves/esm/abstract/edwards.js");
/* harmony import */ var _abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./abstract/hash-to-curve.js */ "./node_modules/@noble/curves/esm/abstract/hash-to-curve.js");
/* harmony import */ var _abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstract/modular.js */ "./node_modules/@noble/curves/esm/abstract/modular.js");
/* harmony import */ var _abstract_montgomery_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./abstract/montgomery.js */ "./node_modules/@noble/curves/esm/abstract/montgomery.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/curves/esm/utils.js");
/**
 * ed25519 Twisted Edwards curve with following addons:
 * - X25519 ECDH
 * - Ristretto cofactor elimination
 * - Elligator hash-to-group / point indistinguishability
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */








// prettier-ignore
const _0n = BigInt(0), _1n = BigInt(1), _2n = BigInt(2), _3n = BigInt(3);
// prettier-ignore
const _5n = BigInt(5), _8n = BigInt(8);
// 2n**255n - 19n
// Removing Fp.create() will still work, and is 10% faster on sign
//     a: Fp.create(BigInt(-1)),
// d is -121665/121666 a.k.a. Fp.neg(121665 * Fp.inv(121666))
// Finite field 2n**255n - 19n
// Subgroup order 2n**252n + 27742317777372353535851937790883648493n;
const ed25519_CURVE = {
    p: BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed'),
    n: BigInt('0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed'),
    h: _8n,
    a: BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec'),
    d: BigInt('0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3'),
    Gx: BigInt('0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a'),
    Gy: BigInt('0x6666666666666666666666666666666666666666666666666666666666666658'),
};
function ed25519_pow_2_252_3(x) {
    // prettier-ignore
    const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
    const P = ed25519_CURVE.p;
    const x2 = (x * x) % P;
    const b2 = (x2 * x) % P; // x^3, 11
    const b4 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b2, _2n, P) * b2) % P; // x^15, 1111
    const b5 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b4, _1n, P) * x) % P; // x^31
    const b10 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b5, _5n, P) * b5) % P;
    const b20 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b10, _10n, P) * b10) % P;
    const b40 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b20, _20n, P) * b20) % P;
    const b80 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b40, _40n, P) * b40) % P;
    const b160 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b80, _80n, P) * b80) % P;
    const b240 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b160, _80n, P) * b80) % P;
    const b250 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b240, _10n, P) * b10) % P;
    const pow_p_5_8 = ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(b250, _2n, P) * x) % P;
    // ^ To pow to (p+3)/8, multiply it by x.
    return { pow_p_5_8, b2 };
}
function adjustScalarBytes(bytes) {
    // Section 5: For X25519, in order to decode 32 random bytes as an integer scalar,
    // set the three least significant bits of the first byte
    bytes[0] &= 248; // 0b1111_1000
    // and the most significant bit of the last to zero,
    bytes[31] &= 127; // 0b0111_1111
    // set the second most significant bit of the last byte to 1
    bytes[31] |= 64; // 0b0100_0000
    return bytes;
}
// √(-1) aka √(a) aka 2^((p-1)/4)
// Fp.sqrt(Fp.neg(1))
const ED25519_SQRT_M1 = /* @__PURE__ */ BigInt('19681161376707505956807079304988542015446066515923890162744021073123829784752');
// sqrt(u/v)
function uvRatio(u, v) {
    const P = ed25519_CURVE.p;
    const v3 = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(v * v * v, P); // v³
    const v7 = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(v3 * v3 * v, P); // v⁷
    // (p+3)/8 and (p-5)/8
    const pow = ed25519_pow_2_252_3(u * v7).pow_p_5_8;
    let x = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(u * v3 * pow, P); // (uv³)(uv⁷)^(p-5)/8
    const vx2 = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(v * x * x, P); // vx²
    const root1 = x; // First root candidate
    const root2 = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(x * ED25519_SQRT_M1, P); // Second root candidate
    const useRoot1 = vx2 === u; // If vx² = u (mod p), x is a square root
    const useRoot2 = vx2 === (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(-u, P); // If vx² = -u, set x <-- x * 2^((p-1)/4)
    const noRoot = vx2 === (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(-u * ED25519_SQRT_M1, P); // There is no valid root, vx² = -u√(-1)
    if (useRoot1)
        x = root1;
    if (useRoot2 || noRoot)
        x = root2; // We return root2 anyway, for const-time
    if ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(x, P))
        x = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)(-x, P);
    return { isValid: useRoot1 || useRoot2, value: x };
}
/** Weird / bogus points, useful for debugging. */
const ED25519_TORSION_SUBGROUP = [
    '0100000000000000000000000000000000000000000000000000000000000000',
    'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a',
    '0000000000000000000000000000000000000000000000000000000000000080',
    '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05',
    'ecffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7f',
    '26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85',
    '0000000000000000000000000000000000000000000000000000000000000000',
    'c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa',
];
const Fp = /* @__PURE__ */ (() => (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.Field)(ed25519_CURVE.p, undefined, true))();
const ed25519Defaults = /* @__PURE__ */ (() => ({
    ...ed25519_CURVE,
    Fp,
    hash: _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__.sha512,
    adjustScalarBytes,
    // dom2
    // Ratio of u to v. Allows us to combine inversion and square root. Uses algo from RFC8032 5.1.3.
    // Constant-time, u/√v
    uvRatio,
}))();
/**
 * ed25519 curve with EdDSA signatures.
 * @example
 * import { ed25519 } from '@noble/curves/ed25519';
 * const priv = ed25519.utils.randomPrivateKey();
 * const pub = ed25519.getPublicKey(priv);
 * const msg = new TextEncoder().encode('hello');
 * const sig = ed25519.sign(msg, priv);
 * ed25519.verify(sig, msg, pub); // Default mode: follows ZIP215
 * ed25519.verify(sig, msg, pub, { zip215: false }); // RFC8032 / FIPS 186-5
 */
const ed25519 = /* @__PURE__ */ (() => (0,_abstract_edwards_js__WEBPACK_IMPORTED_MODULE_2__.twistedEdwards)(ed25519Defaults))();
function ed25519_domain(data, ctx, phflag) {
    if (ctx.length > 255)
        throw new Error('Context is too big');
    return (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__.concatBytes)((0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__.utf8ToBytes)('SigEd25519 no Ed25519 collisions'), new Uint8Array([phflag ? 1 : 0, ctx.length]), ctx, data);
}
const ed25519ctx = /* @__PURE__ */ (() => (0,_abstract_edwards_js__WEBPACK_IMPORTED_MODULE_2__.twistedEdwards)({
    ...ed25519Defaults,
    domain: ed25519_domain,
}))();
const ed25519ph = /* @__PURE__ */ (() => (0,_abstract_edwards_js__WEBPACK_IMPORTED_MODULE_2__.twistedEdwards)(Object.assign({}, ed25519Defaults, {
    domain: ed25519_domain,
    prehash: _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__.sha512,
})))();
/**
 * ECDH using curve25519 aka x25519.
 * @example
 * import { x25519 } from '@noble/curves/ed25519';
 * const priv = 'a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4';
 * const pub = 'e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c';
 * x25519.getSharedSecret(priv, pub) === x25519.scalarMult(priv, pub); // aliases
 * x25519.getPublicKey(priv) === x25519.scalarMultBase(priv);
 * x25519.getPublicKey(x25519.utils.randomPrivateKey());
 */
const x25519 = /* @__PURE__ */ (() => {
    const P = ed25519_CURVE.p;
    return (0,_abstract_montgomery_js__WEBPACK_IMPORTED_MODULE_4__.montgomery)({
        P,
        type: 'x25519',
        powPminus2: (x) => {
            // x^(p-2) aka x^(2^255-21)
            const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
            return (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.mod)((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.pow2)(pow_p_5_8, _3n, P) * b2, P);
        },
        adjustScalarBytes,
    });
})();
/**
 * Converts ed25519 public key to x25519 public key. Uses formula:
 * * `(u, v) = ((1+y)/(1-y), sqrt(-486664)*u/x)`
 * * `(x, y) = (sqrt(-486664)*u/v, (u-1)/(u+1))`
 * @example
 *   const someonesPub = ed25519.getPublicKey(ed25519.utils.randomPrivateKey());
 *   const aPriv = x25519.utils.randomPrivateKey();
 *   x25519.getSharedSecret(aPriv, edwardsToMontgomeryPub(someonesPub))
 */
function edwardsToMontgomeryPub(edwardsPub) {
    const bpub = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.ensureBytes)('pub', edwardsPub);
    const { y } = ed25519.Point.fromHex(bpub);
    const _1n = BigInt(1);
    return Fp.toBytes(Fp.create((_1n + y) * Fp.inv(_1n - y)));
}
const edwardsToMontgomery = edwardsToMontgomeryPub; // deprecated
/**
 * Converts ed25519 secret key to x25519 secret key.
 * @example
 *   const someonesPub = x25519.getPublicKey(x25519.utils.randomPrivateKey());
 *   const aPriv = ed25519.utils.randomPrivateKey();
 *   x25519.getSharedSecret(edwardsToMontgomeryPriv(aPriv), someonesPub)
 */
function edwardsToMontgomeryPriv(edwardsPriv) {
    const hashed = ed25519Defaults.hash(edwardsPriv.subarray(0, 32));
    return ed25519Defaults.adjustScalarBytes(hashed).subarray(0, 32);
}
// Hash To Curve Elligator2 Map (NOTE: different from ristretto255 elligator)
// NOTE: very important part is usage of FpSqrtEven for ELL2_C1_EDWARDS, since
// SageMath returns different root first and everything falls apart
const ELL2_C1 = /* @__PURE__ */ (() => (Fp.ORDER + _3n) / _8n)(); // 1. c1 = (q + 3) / 8       # Integer arithmetic
const ELL2_C2 = /* @__PURE__ */ (() => Fp.pow(_2n, ELL2_C1))(); // 2. c2 = 2^c1
const ELL2_C3 = /* @__PURE__ */ (() => Fp.sqrt(Fp.neg(Fp.ONE)))(); // 3. c3 = sqrt(-1)
// prettier-ignore
function map_to_curve_elligator2_curve25519(u) {
    const ELL2_C4 = (Fp.ORDER - _5n) / _8n; // 4. c4 = (q - 5) / 8       # Integer arithmetic
    const ELL2_J = BigInt(486662);
    let tv1 = Fp.sqr(u); //  1.  tv1 = u^2
    tv1 = Fp.mul(tv1, _2n); //  2.  tv1 = 2 * tv1
    let xd = Fp.add(tv1, Fp.ONE); //  3.   xd = tv1 + 1         # Nonzero: -1 is square (mod p), tv1 is not
    let x1n = Fp.neg(ELL2_J); //  4.  x1n = -J              # x1 = x1n / xd = -J / (1 + 2 * u^2)
    let tv2 = Fp.sqr(xd); //  5.  tv2 = xd^2
    let gxd = Fp.mul(tv2, xd); //  6.  gxd = tv2 * xd        # gxd = xd^3
    let gx1 = Fp.mul(tv1, ELL2_J); //  7.  gx1 = J * tv1         # x1n + J * xd
    gx1 = Fp.mul(gx1, x1n); //  8.  gx1 = gx1 * x1n       # x1n^2 + J * x1n * xd
    gx1 = Fp.add(gx1, tv2); //  9.  gx1 = gx1 + tv2       # x1n^2 + J * x1n * xd + xd^2
    gx1 = Fp.mul(gx1, x1n); //  10. gx1 = gx1 * x1n       # x1n^3 + J * x1n^2 * xd + x1n * xd^2
    let tv3 = Fp.sqr(gxd); //  11. tv3 = gxd^2
    tv2 = Fp.sqr(tv3); //  12. tv2 = tv3^2           # gxd^4
    tv3 = Fp.mul(tv3, gxd); //  13. tv3 = tv3 * gxd       # gxd^3
    tv3 = Fp.mul(tv3, gx1); //  14. tv3 = tv3 * gx1       # gx1 * gxd^3
    tv2 = Fp.mul(tv2, tv3); //  15. tv2 = tv2 * tv3       # gx1 * gxd^7
    let y11 = Fp.pow(tv2, ELL2_C4); //  16. y11 = tv2^c4        # (gx1 * gxd^7)^((p - 5) / 8)
    y11 = Fp.mul(y11, tv3); //  17. y11 = y11 * tv3       # gx1*gxd^3*(gx1*gxd^7)^((p-5)/8)
    let y12 = Fp.mul(y11, ELL2_C3); //  18. y12 = y11 * c3
    tv2 = Fp.sqr(y11); //  19. tv2 = y11^2
    tv2 = Fp.mul(tv2, gxd); //  20. tv2 = tv2 * gxd
    let e1 = Fp.eql(tv2, gx1); //  21.  e1 = tv2 == gx1
    let y1 = Fp.cmov(y12, y11, e1); //  22.  y1 = CMOV(y12, y11, e1)  # If g(x1) is square, this is its sqrt
    let x2n = Fp.mul(x1n, tv1); //  23. x2n = x1n * tv1       # x2 = x2n / xd = 2 * u^2 * x1n / xd
    let y21 = Fp.mul(y11, u); //  24. y21 = y11 * u
    y21 = Fp.mul(y21, ELL2_C2); //  25. y21 = y21 * c2
    let y22 = Fp.mul(y21, ELL2_C3); //  26. y22 = y21 * c3
    let gx2 = Fp.mul(gx1, tv1); //  27. gx2 = gx1 * tv1       # g(x2) = gx2 / gxd = 2 * u^2 * g(x1)
    tv2 = Fp.sqr(y21); //  28. tv2 = y21^2
    tv2 = Fp.mul(tv2, gxd); //  29. tv2 = tv2 * gxd
    let e2 = Fp.eql(tv2, gx2); //  30.  e2 = tv2 == gx2
    let y2 = Fp.cmov(y22, y21, e2); //  31.  y2 = CMOV(y22, y21, e2)  # If g(x2) is square, this is its sqrt
    tv2 = Fp.sqr(y1); //  32. tv2 = y1^2
    tv2 = Fp.mul(tv2, gxd); //  33. tv2 = tv2 * gxd
    let e3 = Fp.eql(tv2, gx1); //  34.  e3 = tv2 == gx1
    let xn = Fp.cmov(x2n, x1n, e3); //  35.  xn = CMOV(x2n, x1n, e3)  # If e3, x = x1, else x = x2
    let y = Fp.cmov(y2, y1, e3); //  36.   y = CMOV(y2, y1, e3)    # If e3, y = y1, else y = y2
    let e4 = Fp.isOdd(y); //  37.  e4 = sgn0(y) == 1        # Fix sign of y
    y = Fp.cmov(y, Fp.neg(y), e3 !== e4); //  38.   y = CMOV(y, -y, e3 XOR e4)
    return { xMn: xn, xMd: xd, yMn: y, yMd: _1n }; //  39. return (xn, xd, y, 1)
}
const ELL2_C1_EDWARDS = /* @__PURE__ */ (() => (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.FpSqrtEven)(Fp, Fp.neg(BigInt(486664))))(); // sgn0(c1) MUST equal 0
function map_to_curve_elligator2_edwards25519(u) {
    const { xMn, xMd, yMn, yMd } = map_to_curve_elligator2_curve25519(u); //  1.  (xMn, xMd, yMn, yMd) =
    // map_to_curve_elligator2_curve25519(u)
    let xn = Fp.mul(xMn, yMd); //  2.  xn = xMn * yMd
    xn = Fp.mul(xn, ELL2_C1_EDWARDS); //  3.  xn = xn * c1
    let xd = Fp.mul(xMd, yMn); //  4.  xd = xMd * yMn    # xn / xd = c1 * xM / yM
    let yn = Fp.sub(xMn, xMd); //  5.  yn = xMn - xMd
    let yd = Fp.add(xMn, xMd); //  6.  yd = xMn + xMd    # (n / d - 1) / (n / d + 1) = (n - d) / (n + d)
    let tv1 = Fp.mul(xd, yd); //  7. tv1 = xd * yd
    let e = Fp.eql(tv1, Fp.ZERO); //  8.   e = tv1 == 0
    xn = Fp.cmov(xn, Fp.ZERO, e); //  9.  xn = CMOV(xn, 0, e)
    xd = Fp.cmov(xd, Fp.ONE, e); //  10. xd = CMOV(xd, 1, e)
    yn = Fp.cmov(yn, Fp.ONE, e); //  11. yn = CMOV(yn, 1, e)
    yd = Fp.cmov(yd, Fp.ONE, e); //  12. yd = CMOV(yd, 1, e)
    const [xd_inv, yd_inv] = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.FpInvertBatch)(Fp, [xd, yd], true); // batch division
    return { x: Fp.mul(xn, xd_inv), y: Fp.mul(yn, yd_inv) }; //  13. return (xn, xd, yn, yd)
}
const ed25519_hasher = /* @__PURE__ */ (() => (0,_abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__.createHasher)(ed25519.Point, (scalars) => map_to_curve_elligator2_edwards25519(scalars[0]), {
    DST: 'edwards25519_XMD:SHA-512_ELL2_RO_',
    encodeDST: 'edwards25519_XMD:SHA-512_ELL2_NU_',
    p: Fp.ORDER,
    m: 1,
    k: 128,
    expand: 'xmd',
    hash: _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__.sha512,
}))();
const hashToCurve = /* @__PURE__ */ (() => ed25519_hasher.hashToCurve)();
const encodeToCurve = /* @__PURE__ */ (() => ed25519_hasher.encodeToCurve)();
function aristp(other) {
    if (!(other instanceof RistPoint))
        throw new Error('RistrettoPoint expected');
}
// √(-1) aka √(a) aka 2^((p-1)/4)
const SQRT_M1 = ED25519_SQRT_M1;
// √(ad - 1)
const SQRT_AD_MINUS_ONE = /* @__PURE__ */ BigInt('25063068953384623474111414158702152701244531502492656460079210482610430750235');
// 1 / √(a-d)
const INVSQRT_A_MINUS_D = /* @__PURE__ */ BigInt('54469307008909316920995813868745141605393597292927456921205312896311721017578');
// 1-d²
const ONE_MINUS_D_SQ = /* @__PURE__ */ BigInt('1159843021668779879193775521855586647937357759715417654439879720876111806838');
// (d-1)²
const D_MINUS_ONE_SQ = /* @__PURE__ */ BigInt('40440834346308536858101042469323190826248399146238708352240133220865137265952');
// Calculates 1/√(number)
const invertSqrt = (number) => uvRatio(_1n, number);
const MAX_255B = /* @__PURE__ */ BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
const bytes255ToNumberLE = (bytes) => ed25519.CURVE.Fp.create((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.bytesToNumberLE)(bytes) & MAX_255B);
/**
 * Computes Elligator map for Ristretto255.
 * Described in [RFC9380](https://www.rfc-editor.org/rfc/rfc9380#appendix-B) and on
 * the [website](https://ristretto.group/formulas/elligator.html).
 */
function calcElligatorRistrettoMap(r0) {
    const { d } = ed25519.CURVE;
    const P = ed25519.CURVE.Fp.ORDER;
    const mod = ed25519.CURVE.Fp.create;
    const r = mod(SQRT_M1 * r0 * r0); // 1
    const Ns = mod((r + _1n) * ONE_MINUS_D_SQ); // 2
    let c = BigInt(-1); // 3
    const D = mod((c - d * r) * mod(r + d)); // 4
    let { isValid: Ns_D_is_sq, value: s } = uvRatio(Ns, D); // 5
    let s_ = mod(s * r0); // 6
    if (!(0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(s_, P))
        s_ = mod(-s_);
    if (!Ns_D_is_sq)
        s = s_; // 7
    if (!Ns_D_is_sq)
        c = r; // 8
    const Nt = mod(c * (r - _1n) * D_MINUS_ONE_SQ - D); // 9
    const s2 = s * s;
    const W0 = mod((s + s) * D); // 10
    const W1 = mod(Nt * SQRT_AD_MINUS_ONE); // 11
    const W2 = mod(_1n - s2); // 12
    const W3 = mod(_1n + s2); // 13
    return new ed25519.Point(mod(W0 * W3), mod(W2 * W1), mod(W1 * W3), mod(W0 * W2));
}
/**
 * Each ed25519/ExtendedPoint has 8 different equivalent points. This can be
 * a source of bugs for protocols like ring signatures. Ristretto was created to solve this.
 * Ristretto point operates in X:Y:Z:T extended coordinates like ExtendedPoint,
 * but it should work in its own namespace: do not combine those two.
 * See [RFC9496](https://www.rfc-editor.org/rfc/rfc9496).
 */
class RistPoint {
    // Private property to discourage combining ExtendedPoint + RistrettoPoint
    // Always use Ristretto encoding/decoding instead.
    constructor(ep) {
        this.ep = ep;
    }
    static fromAffine(ap) {
        return new RistPoint(ed25519.Point.fromAffine(ap));
    }
    /**
     * Takes uniform output of 64-byte hash function like sha512 and converts it to `RistrettoPoint`.
     * The hash-to-group operation applies Elligator twice and adds the results.
     * **Note:** this is one-way map, there is no conversion from point to hash.
     * Described in [RFC9380](https://www.rfc-editor.org/rfc/rfc9380#appendix-B) and on
     * the [website](https://ristretto.group/formulas/elligator.html).
     * @param hex 64-byte output of a hash function
     */
    static hashToCurve(hex) {
        hex = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.ensureBytes)('ristrettoHash', hex, 64);
        const r1 = bytes255ToNumberLE(hex.slice(0, 32));
        const R1 = calcElligatorRistrettoMap(r1);
        const r2 = bytes255ToNumberLE(hex.slice(32, 64));
        const R2 = calcElligatorRistrettoMap(r2);
        return new RistPoint(R1.add(R2));
    }
    static fromBytes(bytes) {
        (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__.abytes)(bytes);
        return this.fromHex(bytes);
    }
    /**
     * Converts ristretto-encoded string to ristretto point.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-decode).
     * @param hex Ristretto-encoded 32 bytes. Not every 32-byte string is valid ristretto encoding
     */
    static fromHex(hex) {
        hex = (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.ensureBytes)('ristrettoHex', hex, 32);
        const { a, d } = ed25519.CURVE;
        const P = Fp.ORDER;
        const mod = Fp.create;
        const emsg = 'RistrettoPoint.fromHex: the hex is not valid encoding of RistrettoPoint';
        const s = bytes255ToNumberLE(hex);
        // 1. Check that s_bytes is the canonical encoding of a field element, or else abort.
        // 3. Check that s is non-negative, or else abort
        if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.equalBytes)((0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.numberToBytesLE)(s, 32), hex) || (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(s, P))
            throw new Error(emsg);
        const s2 = mod(s * s);
        const u1 = mod(_1n + a * s2); // 4 (a is -1)
        const u2 = mod(_1n - a * s2); // 5
        const u1_2 = mod(u1 * u1);
        const u2_2 = mod(u2 * u2);
        const v = mod(a * d * u1_2 - u2_2); // 6
        const { isValid, value: I } = invertSqrt(mod(v * u2_2)); // 7
        const Dx = mod(I * u2); // 8
        const Dy = mod(I * Dx * v); // 9
        let x = mod((s + s) * Dx); // 10
        if ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(x, P))
            x = mod(-x); // 10
        const y = mod(u1 * Dy); // 11
        const t = mod(x * y); // 12
        if (!isValid || (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(t, P) || y === _0n)
            throw new Error(emsg);
        return new RistPoint(new ed25519.Point(x, y, _1n, t));
    }
    static msm(points, scalars) {
        const Fn = (0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.Field)(ed25519.CURVE.n, ed25519.CURVE.nBitLength);
        return (0,_abstract_curve_js__WEBPACK_IMPORTED_MODULE_7__.pippenger)(RistPoint, Fn, points, scalars);
    }
    /**
     * Encodes ristretto point to Uint8Array.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-encode).
     */
    toBytes() {
        let { ex: x, ey: y, ez: z, et: t } = this.ep;
        const P = Fp.ORDER;
        const mod = Fp.create;
        const u1 = mod(mod(z + y) * mod(z - y)); // 1
        const u2 = mod(x * y); // 2
        // Square root always exists
        const u2sq = mod(u2 * u2);
        const { value: invsqrt } = invertSqrt(mod(u1 * u2sq)); // 3
        const D1 = mod(invsqrt * u1); // 4
        const D2 = mod(invsqrt * u2); // 5
        const zInv = mod(D1 * D2 * t); // 6
        let D; // 7
        if ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(t * zInv, P)) {
            let _x = mod(y * SQRT_M1);
            let _y = mod(x * SQRT_M1);
            x = _x;
            y = _y;
            D = mod(D1 * INVSQRT_A_MINUS_D);
        }
        else {
            D = D2; // 8
        }
        if ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(x * zInv, P))
            y = mod(-y); // 9
        let s = mod((z - y) * D); // 10 (check footer's note, no sqrt(-a))
        if ((0,_abstract_modular_js__WEBPACK_IMPORTED_MODULE_0__.isNegativeLE)(s, P))
            s = mod(-s);
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_5__.numberToBytesLE)(s, 32); // 11
    }
    /** @deprecated use `toBytes` */
    toRawBytes() {
        return this.toBytes();
    }
    toHex() {
        return (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__.bytesToHex)(this.toBytes());
    }
    toString() {
        return this.toHex();
    }
    /**
     * Compares two Ristretto points.
     * Described in [RFC9496](https://www.rfc-editor.org/rfc/rfc9496#name-equals).
     */
    equals(other) {
        aristp(other);
        const { ex: X1, ey: Y1 } = this.ep;
        const { ex: X2, ey: Y2 } = other.ep;
        const mod = Fp.create;
        // (x1 * y2 == y1 * x2) | (y1 * y2 == x1 * x2)
        const one = mod(X1 * Y2) === mod(Y1 * X2);
        const two = mod(Y1 * Y2) === mod(X1 * X2);
        return one || two;
    }
    add(other) {
        aristp(other);
        return new RistPoint(this.ep.add(other.ep));
    }
    subtract(other) {
        aristp(other);
        return new RistPoint(this.ep.subtract(other.ep));
    }
    multiply(scalar) {
        return new RistPoint(this.ep.multiply(scalar));
    }
    multiplyUnsafe(scalar) {
        return new RistPoint(this.ep.multiplyUnsafe(scalar));
    }
    double() {
        return new RistPoint(this.ep.double());
    }
    negate() {
        return new RistPoint(this.ep.negate());
    }
}
/**
 * Wrapper over Edwards Point for ristretto255 from
 * [RFC9496](https://www.rfc-editor.org/rfc/rfc9496).
 */
const RistrettoPoint = /* @__PURE__ */ (() => {
    if (!RistPoint.BASE)
        RistPoint.BASE = new RistPoint(ed25519.Point.BASE);
    if (!RistPoint.ZERO)
        RistPoint.ZERO = new RistPoint(ed25519.Point.ZERO);
    return RistPoint;
})();
/**
 * hash-to-curve for ristretto255.
 * Described in [RFC9380](https://www.rfc-editor.org/rfc/rfc9380#appendix-B).
 */
const hashToRistretto255 = (msg, options) => {
    const d = options.DST;
    const DST = typeof d === 'string' ? (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_3__.utf8ToBytes)(d) : d;
    const uniform_bytes = (0,_abstract_hash_to_curve_js__WEBPACK_IMPORTED_MODULE_6__.expand_message_xmd)(msg, DST, 64, _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__.sha512);
    const P = RistPoint.hashToCurve(uniform_bytes);
    return P;
};
/** @deprecated */
const hash_to_ristretto255 = hashToRistretto255; // legacy
//# sourceMappingURL=ed25519.js.map

/***/ }),

/***/ "./node_modules/@noble/curves/esm/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/@noble/curves/esm/utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "abytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.abytes),
/* harmony export */   "anumber": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.anumber),
/* harmony export */   "bytesToHex": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToHex),
/* harmony export */   "bytesToUtf8": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToUtf8),
/* harmony export */   "concatBytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.concatBytes),
/* harmony export */   "hexToBytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.hexToBytes),
/* harmony export */   "isBytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBytes),
/* harmony export */   "randomBytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.randomBytes),
/* harmony export */   "utf8ToBytes": () => (/* reexport safe */ _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.utf8ToBytes),
/* harmony export */   "abool": () => (/* binding */ abool),
/* harmony export */   "numberToHexUnpadded": () => (/* binding */ numberToHexUnpadded),
/* harmony export */   "hexToNumber": () => (/* binding */ hexToNumber),
/* harmony export */   "bytesToNumberBE": () => (/* binding */ bytesToNumberBE),
/* harmony export */   "bytesToNumberLE": () => (/* binding */ bytesToNumberLE),
/* harmony export */   "numberToBytesBE": () => (/* binding */ numberToBytesBE),
/* harmony export */   "numberToBytesLE": () => (/* binding */ numberToBytesLE),
/* harmony export */   "numberToVarBytesBE": () => (/* binding */ numberToVarBytesBE),
/* harmony export */   "ensureBytes": () => (/* binding */ ensureBytes),
/* harmony export */   "equalBytes": () => (/* binding */ equalBytes),
/* harmony export */   "inRange": () => (/* binding */ inRange),
/* harmony export */   "aInRange": () => (/* binding */ aInRange),
/* harmony export */   "bitLen": () => (/* binding */ bitLen),
/* harmony export */   "bitGet": () => (/* binding */ bitGet),
/* harmony export */   "bitSet": () => (/* binding */ bitSet),
/* harmony export */   "bitMask": () => (/* binding */ bitMask),
/* harmony export */   "createHmacDrbg": () => (/* binding */ createHmacDrbg),
/* harmony export */   "validateObject": () => (/* binding */ validateObject),
/* harmony export */   "isHash": () => (/* binding */ isHash),
/* harmony export */   "_validateObject": () => (/* binding */ _validateObject),
/* harmony export */   "notImplemented": () => (/* binding */ notImplemented),
/* harmony export */   "memoized": () => (/* binding */ memoized)
/* harmony export */ });
/* harmony import */ var _noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/hashes/utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * Hex, bytes and number utilities.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */


const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
function abool(title, value) {
    if (typeof value !== 'boolean')
        throw new Error(title + ' boolean expected, got ' + value);
}
// Used in weierstrass, der
function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? '0' + hex : hex;
}
function hexToNumber(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    return hex === '' ? _0n : BigInt('0x' + hex); // Big Endian
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE(bytes) {
    return hexToNumber((0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToHex)(bytes));
}
function bytesToNumberLE(bytes) {
    (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.abytes)(bytes);
    return hexToNumber((0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.bytesToHex)(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
    return (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.hexToBytes)(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE(n) {
    return (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.hexToBytes)(numberToHexUnpadded(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === 'string') {
        try {
            res = (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.hexToBytes)(hex);
        }
        catch (e) {
            throw new Error(title + ' must be hex string or Uint8Array, cause: ' + e);
        }
    }
    else if ((0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBytes)(hex)) {
        // Uint8Array.from() instead of hash.slice() because node.js Buffer
        // is instance of Uint8Array, and its slice() creates **mutable** copy
        res = Uint8Array.from(hex);
    }
    else {
        throw new Error(title + ' must be hex string or Uint8Array');
    }
    const len = res.length;
    if (typeof expectedLength === 'number' && len !== expectedLength)
        throw new Error(title + ' of length ' + expectedLength + ' expected, got ' + len);
    return res;
}
// Compares 2 u8a-s in kinda constant time
function equalBytes(a, b) {
    if (a.length !== b.length)
        return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
        diff |= a[i] ^ b[i];
    return diff === 0;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
// export const utf8ToBytes: typeof utf8ToBytes_ = utf8ToBytes_;
/**
 * Converts bytes to string using UTF8 encoding.
 * @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
 */
// export const bytesToUtf8: typeof bytesToUtf8_ = bytesToUtf8_;
// Is positive bigint
const isPosBig = (n) => typeof n === 'bigint' && _0n <= n;
function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
 * Asserts min <= n < max. NOTE: It's < max and not <= max.
 * @example
 * aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
 */
function aInRange(title, n, min, max) {
    // Why min <= n < max and not a (min < n < max) OR b (min <= n <= max)?
    // consider P=256n, min=0n, max=P
    // - a for min=0 would require -1:          `inRange('x', x, -1n, P)`
    // - b would commonly require subtraction:  `inRange('x', x, 0n, P - 1n)`
    // - our way is the cleanest:               `inRange('x', x, 0n, P)
    if (!inRange(n, min, max))
        throw new Error('expected valid ' + title + ': ' + min + ' <= n < ' + max + ', got ' + n);
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 * TODO: merge with nLength in modular
 */
function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
        ;
    return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet(n, pos) {
    return (n >> BigInt(pos)) & _1n;
}
/**
 * Sets single bit at position.
 */
function bitSet(n, pos, value) {
    return n | ((value ? _1n : _0n) << BigInt(pos));
}
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask = (n) => (_1n << BigInt(n)) - _1n;
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== 'number' || hashLen < 2)
        throw new Error('hashLen must be a number');
    if (typeof qByteLen !== 'number' || qByteLen < 2)
        throw new Error('qByteLen must be a number');
    if (typeof hmacFn !== 'function')
        throw new Error('hmacFn must be a function');
    // Step B, Step C: set hashLen to 8*ceil(hlen/8)
    const u8n = (len) => new Uint8Array(len); // creates Uint8Array
    const u8of = (byte) => Uint8Array.of(byte); // another shortcut
    let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
    let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
    let i = 0; // Iterations counter, will throw when over 1000
    const reset = () => {
        v.fill(1);
        k.fill(0);
        i = 0;
    };
    const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
    const reseed = (seed = u8n(0)) => {
        // HMAC-DRBG reseed() function. Steps D-G
        k = h(u8of(0x00), seed); // k = hmac(k || v || 0x00 || seed)
        v = h(); // v = hmac(k || v)
        if (seed.length === 0)
            return;
        k = h(u8of(0x01), seed); // k = hmac(k || v || 0x01 || seed)
        v = h(); // v = hmac(k || v)
    };
    const gen = () => {
        // HMAC-DRBG generate() function
        if (i++ >= 1000)
            throw new Error('drbg: tried 1000 values');
        let len = 0;
        const out = [];
        while (len < qByteLen) {
            v = h();
            const sl = v.slice();
            out.push(sl);
            len += v.length;
        }
        return (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.concatBytes)(...out);
    };
    const genUntil = (seed, pred) => {
        reset();
        reseed(seed); // Steps D-G
        let res = undefined; // Step H: grind until k is in [1..n-1]
        while (!(res = pred(gen())))
            reseed();
        reset();
        return res;
    };
    return genUntil;
}
// Validating curves and fields
const validatorFns = {
    bigint: (val) => typeof val === 'bigint',
    function: (val) => typeof val === 'function',
    boolean: (val) => typeof val === 'boolean',
    string: (val) => typeof val === 'string',
    stringOrUint8Array: (val) => typeof val === 'string' || (0,_noble_hashes_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBytes)(val),
    isSafeInteger: (val) => Number.isSafeInteger(val),
    array: (val) => Array.isArray(val),
    field: (val, object) => object.Fp.isValid(val),
    hash: (val) => typeof val === 'function' && Number.isSafeInteger(val.outputLen),
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject(object, validators, optValidators = {}) {
    const checkField = (fieldName, type, isOptional) => {
        const checkVal = validatorFns[type];
        if (typeof checkVal !== 'function')
            throw new Error('invalid validator function');
        const val = object[fieldName];
        if (isOptional && val === undefined)
            return;
        if (!checkVal(val, object)) {
            throw new Error('param ' + String(fieldName) + ' is invalid. Expected ' + type + ', got ' + val);
        }
    };
    for (const [fieldName, type] of Object.entries(validators))
        checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
        checkField(fieldName, type, true);
    return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });
function isHash(val) {
    return typeof val === 'function' && Number.isSafeInteger(val.outputLen);
}
function _validateObject(object, fields, optFields = {}) {
    if (!object || typeof object !== 'object')
        throw new Error('expected valid options object');
    function checkField(fieldName, expectedType, isOpt) {
        const val = object[fieldName];
        if (isOpt && val === undefined)
            return;
        const current = typeof val;
        if (current !== expectedType || val === null)
            throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
    }
    Object.entries(fields).forEach(([k, v]) => checkField(k, v, false));
    Object.entries(optFields).forEach(([k, v]) => checkField(k, v, true));
}
/**
 * throws not implemented error
 */
const notImplemented = () => {
    throw new Error('not implemented');
};
/**
 * Memoizes (caches) computation result.
 * Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
 */
function memoized(fn) {
    const map = new WeakMap();
    return (arg, ...args) => {
        const val = map.get(arg);
        if (val !== undefined)
            return val;
        const computed = fn(arg, ...args);
        map.set(arg, computed);
        return computed;
    };
}
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/_md.js":
/*!***********************************************!*\
  !*** ./node_modules/@noble/hashes/esm/_md.js ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setBigUint64": () => (/* binding */ setBigUint64),
/* harmony export */   "Chi": () => (/* binding */ Chi),
/* harmony export */   "Maj": () => (/* binding */ Maj),
/* harmony export */   "HashMD": () => (/* binding */ HashMD),
/* harmony export */   "SHA256_IV": () => (/* binding */ SHA256_IV),
/* harmony export */   "SHA224_IV": () => (/* binding */ SHA224_IV),
/* harmony export */   "SHA384_IV": () => (/* binding */ SHA384_IV),
/* harmony export */   "SHA512_IV": () => (/* binding */ SHA512_IV)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * Internal Merkle-Damgard hash utils.
 * @module
 */

/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
    return (a & b) ^ (~a & c);
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
    return (a & b) ^ (a & c) ^ (b & c);
}
/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
class HashMD extends _utils_js__WEBPACK_IMPORTED_MODULE_0__.Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createView)(this.buffer);
    }
    update(data) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aexists)(this);
        data = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toBytes)(data);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abytes)(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createView)(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aexists)(this);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aoutput)(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.clean)(this.buffer.subarray(pos));
        // we have less than padOffset left in buffer, so we cannot put length in
        // current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createView)(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
    clone() {
        return this._cloneInto();
    }
}
/**
 * Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
 * Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
 */
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);
/** Initial SHA224 state. Bits 32..64 of frac part of sqrt of primes 23..53 */
const SHA224_IV = /* @__PURE__ */ Uint32Array.from([
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4,
]);
/** Initial SHA384 state. Bits 0..64 of frac part of sqrt of primes 23..53 */
const SHA384_IV = /* @__PURE__ */ Uint32Array.from([
    0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507, 0x9159015a, 0x3070dd17, 0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511, 0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4,
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
const SHA512_IV = /* @__PURE__ */ Uint32Array.from([
    0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179,
]);
//# sourceMappingURL=_md.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/_u64.js":
/*!************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/_u64.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "add3H": () => (/* binding */ add3H),
/* harmony export */   "add3L": () => (/* binding */ add3L),
/* harmony export */   "add4H": () => (/* binding */ add4H),
/* harmony export */   "add4L": () => (/* binding */ add4L),
/* harmony export */   "add5H": () => (/* binding */ add5H),
/* harmony export */   "add5L": () => (/* binding */ add5L),
/* harmony export */   "fromBig": () => (/* binding */ fromBig),
/* harmony export */   "rotlBH": () => (/* binding */ rotlBH),
/* harmony export */   "rotlBL": () => (/* binding */ rotlBL),
/* harmony export */   "rotlSH": () => (/* binding */ rotlSH),
/* harmony export */   "rotlSL": () => (/* binding */ rotlSL),
/* harmony export */   "rotr32H": () => (/* binding */ rotr32H),
/* harmony export */   "rotr32L": () => (/* binding */ rotr32L),
/* harmony export */   "rotrBH": () => (/* binding */ rotrBH),
/* harmony export */   "rotrBL": () => (/* binding */ rotrBL),
/* harmony export */   "rotrSH": () => (/* binding */ rotrSH),
/* harmony export */   "rotrSL": () => (/* binding */ rotrSL),
/* harmony export */   "shrSH": () => (/* binding */ shrSH),
/* harmony export */   "shrSL": () => (/* binding */ shrSL),
/* harmony export */   "split": () => (/* binding */ split),
/* harmony export */   "toBig": () => (/* binding */ toBig),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i = 0; i < len; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h, l) => l;
const rotr32L = (h, _l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore

// prettier-ignore
const u64 = {
    fromBig, split, toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (u64);
//# sourceMappingURL=_u64.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/crypto.js":
/*!**************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/crypto.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "crypto": () => (/* binding */ crypto)
/* harmony export */ });
const crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;
//# sourceMappingURL=crypto.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/hmac.js":
/*!************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/hmac.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HMAC": () => (/* binding */ HMAC),
/* harmony export */   "hmac": () => (/* binding */ hmac)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * HMAC: RFC2104 message authentication code.
 * @module
 */

class HMAC extends _utils_js__WEBPACK_IMPORTED_MODULE_0__.Hash {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.ahash)(hash);
        const key = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.clean)(pad);
    }
    update(buf) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aexists)(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.aexists)(this);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.abytes)(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    clone() {
        return this._cloneInto();
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 * @example
 * import { hmac } from '@noble/hashes/hmac';
 * import { sha256 } from '@noble/hashes/sha2';
 * const mac1 = hmac(sha256, 'key', 'message');
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);
//# sourceMappingURL=hmac.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/sha2.js":
/*!************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/sha2.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SHA256": () => (/* binding */ SHA256),
/* harmony export */   "SHA224": () => (/* binding */ SHA224),
/* harmony export */   "SHA512": () => (/* binding */ SHA512),
/* harmony export */   "SHA384": () => (/* binding */ SHA384),
/* harmony export */   "SHA512_224": () => (/* binding */ SHA512_224),
/* harmony export */   "SHA512_256": () => (/* binding */ SHA512_256),
/* harmony export */   "sha256": () => (/* binding */ sha256),
/* harmony export */   "sha224": () => (/* binding */ sha224),
/* harmony export */   "sha512": () => (/* binding */ sha512),
/* harmony export */   "sha384": () => (/* binding */ sha384),
/* harmony export */   "sha512_256": () => (/* binding */ sha512_256),
/* harmony export */   "sha512_224": () => (/* binding */ sha512_224)
/* harmony export */ });
/* harmony import */ var _md_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_md.js */ "./node_modules/@noble/hashes/esm/_md.js");
/* harmony import */ var _u64_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_u64.js */ "./node_modules/@noble/hashes/esm/_u64.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@noble/hashes/esm/utils.js");
/**
 * SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
 * SHA256 is the fastest hash implementable in JS, even faster than Blake3.
 * Check out [RFC 4634](https://datatracker.ietf.org/doc/html/rfc4634) and
 * [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 */



/**
 * Round constants:
 * First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
 */
// prettier-ignore
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends _md_js__WEBPACK_IMPORTED_MODULE_0__.HashMD {
    constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[0] | 0;
        this.B = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[1] | 0;
        this.C = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[2] | 0;
        this.D = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[3] | 0;
        this.E = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[4] | 0;
        this.F = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[5] | 0;
        this.G = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[6] | 0;
        this.H = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA256_IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(W15, 7) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(W15, 18) ^ (W15 >>> 3);
            const s1 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(W2, 17) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(E, 6) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(E, 11) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(E, 25);
            const T1 = (H + sigma1 + (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(A, 2) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(A, 13) ^ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotr)(A, 22);
            const T2 = (sigma0 + (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Maj)(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(SHA256_W);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(this.buffer);
    }
}
class SHA224 extends SHA256 {
    constructor() {
        super(28);
        this.A = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[0] | 0;
        this.B = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[1] | 0;
        this.C = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[2] | 0;
        this.D = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[3] | 0;
        this.E = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[4] | 0;
        this.F = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[5] | 0;
        this.G = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[6] | 0;
        this.H = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA224_IV[7] | 0;
    }
}
// SHA2-512 is slower than sha256 in js because u64 operations are slow.
// Round contants
// First 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409
// prettier-ignore
const K512 = /* @__PURE__ */ (() => _u64_js__WEBPACK_IMPORTED_MODULE_2__.split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n))))();
const SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
const SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
// Reusable temporary buffers
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
class SHA512 extends _md_js__WEBPACK_IMPORTED_MODULE_0__.HashMD {
    constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[0] | 0;
        this.Al = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[1] | 0;
        this.Bh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[2] | 0;
        this.Bl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[3] | 0;
        this.Ch = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[4] | 0;
        this.Cl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[5] | 0;
        this.Dh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[6] | 0;
        this.Dl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[7] | 0;
        this.Eh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[8] | 0;
        this.El = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[9] | 0;
        this.Fh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[10] | 0;
        this.Fl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[11] | 0;
        this.Gh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[12] | 0;
        this.Gl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[13] | 0;
        this.Hh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[14] | 0;
        this.Hl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA512_IV[15] | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(W15h, W15l, 1) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(W15h, W15l, 8) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.shrSH(W15h, W15l, 7);
            const s0l = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(W15h, W15l, 1) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(W15h, W15l, 8) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(W2h, W2l, 19) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBH(W2h, W2l, 61) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.shrSH(W2h, W2l, 6);
            const s1l = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(W2h, W2l, 19) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBL(W2h, W2l, 61) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(Eh, El, 14) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(Eh, El, 18) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBH(Eh, El, 41);
            const sigma1l = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(Eh, El, 14) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(Eh, El, 18) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSH(Ah, Al, 28) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBH(Ah, Al, 34) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBH(Ah, Al, 39);
            const sigma0l = _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrSL(Ah, Al, 28) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBL(Ah, Al, 34) ^ _u64_js__WEBPACK_IMPORTED_MODULE_2__.rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add3L(T1l, sigma0l, MAJl);
            Ah = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = _u64_js__WEBPACK_IMPORTED_MODULE_2__.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(SHA512_W_H, SHA512_W_L);
    }
    destroy() {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
class SHA384 extends SHA512 {
    constructor() {
        super(48);
        this.Ah = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[0] | 0;
        this.Al = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[1] | 0;
        this.Bh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[2] | 0;
        this.Bl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[3] | 0;
        this.Ch = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[4] | 0;
        this.Cl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[5] | 0;
        this.Dh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[6] | 0;
        this.Dl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[7] | 0;
        this.Eh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[8] | 0;
        this.El = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[9] | 0;
        this.Fh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[10] | 0;
        this.Fl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[11] | 0;
        this.Gh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[12] | 0;
        this.Gl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[13] | 0;
        this.Hh = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[14] | 0;
        this.Hl = _md_js__WEBPACK_IMPORTED_MODULE_0__.SHA384_IV[15] | 0;
    }
}
/**
 * Truncated SHA512/256 and SHA512/224.
 * SHA512_IV is XORed with 0xa5a5a5a5a5a5a5a5, then used as "intermediary" IV of SHA512/t.
 * Then t hashes string to produce result IV.
 * See `test/misc/sha2-gen-iv.js`.
 */
/** SHA512/224 IV */
const T224_IV = /* @__PURE__ */ Uint32Array.from([
    0x8c3d37c8, 0x19544da2, 0x73e19966, 0x89dcd4d6, 0x1dfab7ae, 0x32ff9c82, 0x679dd514, 0x582f9fcf,
    0x0f6d2b69, 0x7bd44da8, 0x77e36f73, 0x04c48942, 0x3f9d85a8, 0x6a1d36c8, 0x1112e6ad, 0x91d692a1,
]);
/** SHA512/256 IV */
const T256_IV = /* @__PURE__ */ Uint32Array.from([
    0x22312194, 0xfc2bf72c, 0x9f555fa3, 0xc84c64c2, 0x2393b86b, 0x6f53b151, 0x96387719, 0x5940eabd,
    0x96283ee2, 0xa88effe3, 0xbe5e1e25, 0x53863992, 0x2b0199fc, 0x2c85b8aa, 0x0eb72ddc, 0x81c52ca2,
]);
class SHA512_224 extends SHA512 {
    constructor() {
        super(28);
        this.Ah = T224_IV[0] | 0;
        this.Al = T224_IV[1] | 0;
        this.Bh = T224_IV[2] | 0;
        this.Bl = T224_IV[3] | 0;
        this.Ch = T224_IV[4] | 0;
        this.Cl = T224_IV[5] | 0;
        this.Dh = T224_IV[6] | 0;
        this.Dl = T224_IV[7] | 0;
        this.Eh = T224_IV[8] | 0;
        this.El = T224_IV[9] | 0;
        this.Fh = T224_IV[10] | 0;
        this.Fl = T224_IV[11] | 0;
        this.Gh = T224_IV[12] | 0;
        this.Gl = T224_IV[13] | 0;
        this.Hh = T224_IV[14] | 0;
        this.Hl = T224_IV[15] | 0;
    }
}
class SHA512_256 extends SHA512 {
    constructor() {
        super(32);
        this.Ah = T256_IV[0] | 0;
        this.Al = T256_IV[1] | 0;
        this.Bh = T256_IV[2] | 0;
        this.Bl = T256_IV[3] | 0;
        this.Ch = T256_IV[4] | 0;
        this.Cl = T256_IV[5] | 0;
        this.Dh = T256_IV[6] | 0;
        this.Dl = T256_IV[7] | 0;
        this.Eh = T256_IV[8] | 0;
        this.El = T256_IV[9] | 0;
        this.Fh = T256_IV[10] | 0;
        this.Fl = T256_IV[11] | 0;
        this.Gh = T256_IV[12] | 0;
        this.Gl = T256_IV[13] | 0;
        this.Hh = T256_IV[14] | 0;
        this.Hl = T256_IV[15] | 0;
    }
}
/**
 * SHA2-256 hash function from RFC 4634.
 *
 * It is the fastest JS hash, even faster than Blake3.
 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 */
const sha256 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA256());
/** SHA2-224 hash function from RFC 4634 */
const sha224 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA224());
/** SHA2-512 hash function from RFC 4634. */
const sha512 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA512());
/** SHA2-384 hash function from RFC 4634. */
const sha384 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA384());
/**
 * SHA2-512/256 "truncated" hash function, with improved resistance to length extension attacks.
 * See the paper on [truncated SHA512](https://eprint.iacr.org/2010/548.pdf).
 */
const sha512_256 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA512_256());
/**
 * SHA2-512/224 "truncated" hash function, with improved resistance to length extension attacks.
 * See the paper on [truncated SHA512](https://eprint.iacr.org/2010/548.pdf).
 */
const sha512_224 = /* @__PURE__ */ (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA512_224());
//# sourceMappingURL=sha2.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/sha256.js":
/*!**************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/sha256.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SHA256": () => (/* binding */ SHA256),
/* harmony export */   "sha256": () => (/* binding */ sha256),
/* harmony export */   "SHA224": () => (/* binding */ SHA224),
/* harmony export */   "sha224": () => (/* binding */ sha224)
/* harmony export */ });
/* harmony import */ var _sha2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sha2.js */ "./node_modules/@noble/hashes/esm/sha2.js");
/**
 * SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
 *
 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 *
 * Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 * @deprecated
 */

/** @deprecated Use import from `noble/hashes/sha2` module */
const SHA256 = _sha2_js__WEBPACK_IMPORTED_MODULE_0__.SHA256;
/** @deprecated Use import from `noble/hashes/sha2` module */
const sha256 = _sha2_js__WEBPACK_IMPORTED_MODULE_0__.sha256;
/** @deprecated Use import from `noble/hashes/sha2` module */
const SHA224 = _sha2_js__WEBPACK_IMPORTED_MODULE_0__.SHA224;
/** @deprecated Use import from `noble/hashes/sha2` module */
const sha224 = _sha2_js__WEBPACK_IMPORTED_MODULE_0__.sha224;
//# sourceMappingURL=sha256.js.map

/***/ }),

/***/ "./node_modules/@noble/hashes/esm/utils.js":
/*!*************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/utils.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBytes": () => (/* binding */ isBytes),
/* harmony export */   "anumber": () => (/* binding */ anumber),
/* harmony export */   "abytes": () => (/* binding */ abytes),
/* harmony export */   "ahash": () => (/* binding */ ahash),
/* harmony export */   "aexists": () => (/* binding */ aexists),
/* harmony export */   "aoutput": () => (/* binding */ aoutput),
/* harmony export */   "u8": () => (/* binding */ u8),
/* harmony export */   "u32": () => (/* binding */ u32),
/* harmony export */   "clean": () => (/* binding */ clean),
/* harmony export */   "createView": () => (/* binding */ createView),
/* harmony export */   "rotr": () => (/* binding */ rotr),
/* harmony export */   "rotl": () => (/* binding */ rotl),
/* harmony export */   "isLE": () => (/* binding */ isLE),
/* harmony export */   "byteSwap": () => (/* binding */ byteSwap),
/* harmony export */   "swap8IfBE": () => (/* binding */ swap8IfBE),
/* harmony export */   "byteSwapIfBE": () => (/* binding */ byteSwapIfBE),
/* harmony export */   "byteSwap32": () => (/* binding */ byteSwap32),
/* harmony export */   "swap32IfBE": () => (/* binding */ swap32IfBE),
/* harmony export */   "bytesToHex": () => (/* binding */ bytesToHex),
/* harmony export */   "hexToBytes": () => (/* binding */ hexToBytes),
/* harmony export */   "nextTick": () => (/* binding */ nextTick),
/* harmony export */   "asyncLoop": () => (/* binding */ asyncLoop),
/* harmony export */   "utf8ToBytes": () => (/* binding */ utf8ToBytes),
/* harmony export */   "bytesToUtf8": () => (/* binding */ bytesToUtf8),
/* harmony export */   "toBytes": () => (/* binding */ toBytes),
/* harmony export */   "kdfInputToBytes": () => (/* binding */ kdfInputToBytes),
/* harmony export */   "concatBytes": () => (/* binding */ concatBytes),
/* harmony export */   "checkOpts": () => (/* binding */ checkOpts),
/* harmony export */   "Hash": () => (/* binding */ Hash),
/* harmony export */   "createHasher": () => (/* binding */ createHasher),
/* harmony export */   "createOptHasher": () => (/* binding */ createOptHasher),
/* harmony export */   "createXOFer": () => (/* binding */ createXOFer),
/* harmony export */   "wrapConstructor": () => (/* binding */ wrapConstructor),
/* harmony export */   "wrapConstructorWithOpts": () => (/* binding */ wrapConstructorWithOpts),
/* harmony export */   "wrapXOFConstructorWithOpts": () => (/* binding */ wrapXOFConstructorWithOpts),
/* harmony export */   "randomBytes": () => (/* binding */ randomBytes)
/* harmony export */ });
/* harmony import */ var _noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/hashes/crypto */ "./node_modules/@noble/hashes/esm/crypto.js");
/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.

/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}
/** Asserts something is positive integer. */
function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error('positive integer expected, got ' + n);
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
    if (!isBytes(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
}
/** Asserts something is hash */
function ahash(h) {
    if (typeof h !== 'function' || typeof h.create !== 'function')
        throw new Error('Hash should be wrapped by utils.createHasher');
    anumber(h.outputLen);
    anumber(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error('digestInto() expects output buffer of length at least ' + min);
    }
}
/** Cast u8 / u16 / u32 to u8. */
function u8(arr) {
    return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
    for (let i = 0; i < arrays.length; i++) {
        arrays[i].fill(0);
    }
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
    return (word << (32 - shift)) | (word >>> shift);
}
/** The rotate left (circular left shift) operation for uint32 */
function rotl(word, shift) {
    return (word << shift) | ((word >>> (32 - shift)) >>> 0);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();
/** The byte swap operation for uint32 */
function byteSwap(word) {
    return (((word << 24) & 0xff000000) |
        ((word << 8) & 0xff0000) |
        ((word >>> 8) & 0xff00) |
        ((word >>> 24) & 0xff));
}
/** Conditionally byte swap if on a big-endian platform */
const swap8IfBE = isLE
    ? (n) => n
    : (n) => byteSwap(n);
/** @deprecated */
const byteSwapIfBE = swap8IfBE;
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
    }
    return arr;
}
const swap32IfBE = isLE
    ? (u) => u
    : byteSwap32;
// Built-in hex conversion https://caniuse.com/mdn-javascript_builtins_uint8array_fromhex
const hasHexBuiltin = /* @__PURE__ */ (() => 
// @ts-ignore
typeof Uint8Array.from([]).toHex === 'function' && typeof Uint8Array.fromHex === 'function')();
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * Convert byte array to hex string. Uses built-in function, when available.
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
    abytes(bytes);
    // @ts-ignore
    if (hasHexBuiltin)
        return bytes.toHex();
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
    }
    return hex;
}
// We use optimized technique to convert hex string to byte array
const asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
        return ch - asciis._0; // '2' => 50-48
    if (ch >= asciis.A && ch <= asciis.F)
        return ch - (asciis.A - 10); // 'B' => 66-(65-10)
    if (ch >= asciis.a && ch <= asciis.f)
        return ch - (asciis.a - 10); // 'b' => 98-(97-10)
    return;
}
/**
 * Convert hex string to byte array. Uses built-in function, when available.
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    // @ts-ignore
    if (hasHexBuiltin)
        return Uint8Array.fromHex(hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
        throw new Error('hex string expected, got unpadded hex of length ' + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
        const n1 = asciiToBase16(hex.charCodeAt(hi));
        const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
        if (n1 === undefined || n2 === undefined) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
        }
        array[ai] = n1 * 16 + n2; // multiply first octet, e.g. 'a3' => 10*16+3 => 160 + 3 => 163
    }
    return array;
}
/**
 * There is no setImmediate in browser and setTimeout is slow.
 * Call of async fn will return Promise, which will be fullfiled only on
 * next scheduler queue processing step and this is exactly what we need.
 */
const nextTick = async () => { };
/** Returns control to thread each 'tick' ms to avoid blocking. */
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await nextTick();
        ts += diff;
    }
}
/**
 * Converts string to bytes using UTF8 encoding.
 * @example utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error('string expected');
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Converts bytes to string using UTF8 encoding.
 * @example bytesToUtf8(Uint8Array.from([97, 98, 99])) // 'abc'
 */
function bytesToUtf8(bytes) {
    return new TextDecoder().decode(bytes);
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    abytes(data);
    return data;
}
/**
 * Helper for KDFs: consumes uint8array or string.
 * When string is passed, does utf8 decoding, using TextDecoder.
 */
function kdfInputToBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    abytes(data);
    return data;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
        const a = arrays[i];
        abytes(a);
        sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const a = arrays[i];
        res.set(a, pad);
        pad += a.length;
    }
    return res;
}
function checkOpts(defaults, opts) {
    if (opts !== undefined && {}.toString.call(opts) !== '[object Object]')
        throw new Error('options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
/** For runtime check if class implements interface */
class Hash {
}
/** Wraps hash function, creating an interface on top of it */
function createHasher(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
function createOptHasher(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
function createXOFer(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
const wrapConstructor = createHasher;
const wrapConstructorWithOpts = createOptHasher;
const wrapXOFConstructorWithOpts = createXOFer;
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
    if (_noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto && typeof _noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto.getRandomValues === 'function') {
        return _noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    // Legacy Node.js compatibility
    if (_noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto && typeof _noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto.randomBytes === 'function') {
        return Uint8Array.from(_noble_hashes_crypto__WEBPACK_IMPORTED_MODULE_0__.crypto.randomBytes(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}
//# sourceMappingURL=utils.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************!*\
  !*** ./src/hello_assets/src/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _declarations_hello__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../declarations/hello */ "./src/declarations/hello/index.js");


document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const name = document.getElementById("name").value.toString();

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  const greeting = await _declarations_hello__WEBPACK_IMPORTED_MODULE_0__.hello.greet(name);

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greeting;

  return false;
});

})();

/******/ })()
;
//# sourceMappingURL=index.js.map