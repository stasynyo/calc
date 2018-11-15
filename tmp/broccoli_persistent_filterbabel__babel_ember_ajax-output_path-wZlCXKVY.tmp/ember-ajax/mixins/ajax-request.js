define('ember-ajax/mixins/ajax-request', ['exports', 'ember-ajax/errors', 'ember-ajax/utils/ajax', 'ember-ajax/-private/utils/parse-response-headers', 'ember-ajax/-private/utils/get-header', 'ember-ajax/-private/utils/url-helpers', 'ember-ajax/-private/utils/is-string', 'ember-ajax/-private/promise'], function (exports, _errors, _ajax, _parseResponseHeaders, _getHeader, _urlHelpers, _isString, _promise) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    const { Test } = Ember;
    const JSONContentType = /^application\/(?:vnd\.api\+)?json/i;
    function isJSONContentType(header) {
        if (!(0, _isString.default)(header)) {
            return false;
        }
        return !!header.match(JSONContentType);
    }
    function isJSONStringifyable(method, { contentType, data, headers }) {
        if (method === 'GET') {
            return false;
        }
        if (!isJSONContentType(contentType) && !isJSONContentType((0, _getHeader.default)(headers, 'Content-Type'))) {
            return false;
        }
        if (typeof data !== 'object') {
            return false;
        }
        return true;
    }
    function startsWithSlash(string) {
        return string.charAt(0) === '/';
    }
    function endsWithSlash(string) {
        return string.charAt(string.length - 1) === '/';
    }
    function removeLeadingSlash(string) {
        return string.substring(1);
    }
    function stripSlashes(path) {
        // make sure path starts with `/`
        if (startsWithSlash(path)) {
            path = removeLeadingSlash(path);
        }
        // remove end `/`
        if (endsWithSlash(path)) {
            path = path.slice(0, -1);
        }
        return path;
    }
    let pendingRequestCount = 0;
    if (Ember.testing) {
        Test.registerWaiter(function () {
            return pendingRequestCount === 0;
        });
    }
    /**
     * AjaxRequest Mixin
     */
    exports.default = Ember.Mixin.create({
        /**
         * The default value for the request `contentType`
         *
         * For now, defaults to the same value that jQuery would assign.  In the
         * future, the default value will be for JSON requests.
         * @property {string} contentType
         * @public
         */
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        /**
         * Headers to include on the request
         *
         * Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
         * headers can be set as key/value pairs on the `RESTAdapter`'s `headers`
         * object and Ember Data will send them along with each ajax request.
         *
         * ```javascript
         * // app/services/ajax.js
         * import AjaxService from 'ember-ajax/services/ajax';
         *
         * export default AjaxService.extend({
         *   headers: {
         *     'API_KEY': 'secret key',
         *     'ANOTHER_HEADER': 'Some header value'
         *   }
         * });
         * ```
         *
         * `headers` can also be used as a computed property to support dynamic
         * headers.
         *
         * ```javascript
         * // app/services/ajax.js
         * import Ember from 'ember';
         * import AjaxService from 'ember-ajax/services/ajax';
         *
         * const {
         *   computed,
         *   get,
         *   inject: { service }
         * } = Ember;
         *
         * export default AjaxService.extend({
         *   session: service(),
         *   headers: computed('session.authToken', function() {
         *     return {
         *       'API_KEY': get(this, 'session.authToken'),
         *       'ANOTHER_HEADER': 'Some header value'
         *     };
         *   })
         * });
         * ```
         *
         * In some cases, your dynamic headers may require data from some object
         * outside of Ember's observer system (for example `document.cookie`). You
         * can use the `volatile` function to set the property into a non-cached mode
         * causing the headers to be recomputed with every request.
         *
         * ```javascript
         * // app/services/ajax.js
         * import Ember from 'ember';
         * import AjaxService from 'ember-ajax/services/ajax';
         *
         * const {
         *   computed,
         *   get,
         *   inject: { service }
         * } = Ember;
         *
         * export default AjaxService.extend({
         *   session: service(),
         *   headers: computed('session.authToken', function() {
         *     return {
         *       'API_KEY': get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
         *       'ANOTHER_HEADER': 'Some header value'
         *     };
         *   }).volatile()
         * });
         * ```
         *
         * @property {Headers} headers
         * @public
         */
        headers: undefined,
        /**
         * @property {string} host
         * @public
         */
        host: undefined,
        /**
         * @property {string} namespace
         * @public
         */
        namespace: undefined,
        /**
         * @property {Matcher[]} trustedHosts
         * @public
         */
        trustedHosts: undefined,
        /**
         * Make an AJAX request, ignoring the raw XHR object and dealing only with
         * the response
         */
        request(url, options) {
            const hash = this.options(url, options);
            const internalPromise = this._makeRequest(hash);
            const ajaxPromise = new _promise.default((resolve, reject) => {
                internalPromise.then(({ response }) => {
                    resolve(response);
                }).catch(({ response }) => {
                    reject(response);
                });
            }, `ember-ajax: ${hash.type} ${hash.url} response`);
            ajaxPromise.xhr = internalPromise.xhr;
            return ajaxPromise;
        },
        /**
         * Make an AJAX request, returning the raw XHR object along with the response
         */
        raw(url, options) {
            const hash = this.options(url, options);
            return this._makeRequest(hash);
        },
        /**
         * Shared method to actually make an AJAX request
         */
        _makeRequest(hash) {
            const method = hash.method || hash.type || 'GET';
            const requestData = { method, type: method, url: hash.url };
            if (isJSONStringifyable(method, hash)) {
                hash.data = JSON.stringify(hash.data);
            }
            pendingRequestCount = pendingRequestCount + 1;
            const jqXHR = (0, _ajax.default)(hash.url, hash);
            const promise = new _promise.default((resolve, reject) => {
                jqXHR.done((payload, textStatus, jqXHR) => {
                    const response = this.handleResponse(jqXHR.status, (0, _parseResponseHeaders.default)(jqXHR.getAllResponseHeaders()), payload, requestData);
                    if ((0, _errors.isAjaxError)(response)) {
                        const rejectionParam = {
                            payload,
                            textStatus,
                            jqXHR,
                            response
                        };
                        Ember.run.join(null, reject, rejectionParam);
                    } else {
                        const resolutionParam = {
                            payload,
                            textStatus,
                            jqXHR,
                            response
                        };
                        Ember.run.join(null, resolve, resolutionParam);
                    }
                }).fail((jqXHR, textStatus, errorThrown) => {
                    Ember.runInDebug(function () {
                        const message = `The server returned an empty string for ${requestData.type} ${requestData.url}, which cannot be parsed into a valid JSON. Return either null or {}.`;
                        const validJSONString = !(textStatus === 'parsererror' && jqXHR.responseText === '');
                        (true && Ember.warn(message, validJSONString, {
                            id: 'ds.adapter.returned-empty-string-as-JSON'
                        }));
                    });
                    const payload = this.parseErrorResponse(jqXHR.responseText) || errorThrown;
                    let response;
                    if (textStatus === 'timeout') {
                        response = new _errors.TimeoutError();
                    } else if (textStatus === 'abort') {
                        response = new _errors.AbortError();
                    } else {
                        response = this.handleResponse(jqXHR.status, (0, _parseResponseHeaders.default)(jqXHR.getAllResponseHeaders()), payload, requestData);
                    }
                    const rejectionParam = {
                        payload,
                        textStatus,
                        jqXHR,
                        errorThrown,
                        response
                    };
                    Ember.run.join(null, reject, rejectionParam);
                }).always(() => {
                    pendingRequestCount = pendingRequestCount - 1;
                });
            }, `ember-ajax: ${hash.type} ${hash.url}`);
            promise.xhr = jqXHR;
            return promise;
        },
        /**
         * calls `request()` but forces `options.type` to `POST`
         */
        post(url, options) {
            return this.request(url, this._addTypeToOptionsFor(options, 'POST'));
        },
        /**
         * calls `request()` but forces `options.type` to `PUT`
         */
        put(url, options) {
            return this.request(url, this._addTypeToOptionsFor(options, 'PUT'));
        },
        /**
         * calls `request()` but forces `options.type` to `PATCH`
         */
        patch(url, options) {
            return this.request(url, this._addTypeToOptionsFor(options, 'PATCH'));
        },
        /**
         * calls `request()` but forces `options.type` to `DELETE`
         */
        del(url, options) {
            return this.request(url, this._addTypeToOptionsFor(options, 'DELETE'));
        },
        /**
         * calls `request()` but forces `options.type` to `DELETE`
         *
         * Alias for `del()`
         */
        delete(url, options) {
            return this.del(url, options);
        },
        /**
         * Wrap the `.get` method so that we issue a warning if
         *
         * Since `.get` is both an AJAX pattern _and_ an Ember pattern, we want to try
         * to warn users when they try using `.get` to make a request
         */
        get(url) {
            if (arguments.length > 1 || url.indexOf('/') !== -1) {
                throw new Ember.Error('It seems you tried to use `.get` to make a request! Use the `.request` method instead.');
            }
            return this._super(...arguments);
        },
        /**
         * Manipulates the options hash to include the HTTP method on the type key
         */
        _addTypeToOptionsFor(options, method) {
            options = options || {};
            options.type = method;
            return options;
        },
        /**
         * Get the full "headers" hash, combining the service-defined headers with
         * the ones provided for the request
         */
        _getFullHeadersHash(headers) {
            const classHeaders = Ember.get(this, 'headers');
            return Ember.assign({}, classHeaders, headers);
        },
        /**
         * Created a normalized set of options from the per-request and
         * service-level settings
         */
        options(url, options = {}) {
            options = Ember.assign({}, options);
            options.url = this._buildURL(url, options);
            options.type = options.type || 'GET';
            options.dataType = options.dataType || 'json';
            options.contentType = Ember.isEmpty(options.contentType) ? Ember.get(this, 'contentType') : options.contentType;
            if (this._shouldSendHeaders(options)) {
                options.headers = this._getFullHeadersHash(options.headers);
            } else {
                options.headers = options.headers || {};
            }
            return options;
        },
        /**
         * Build a URL for a request
         *
         * If the provided `url` is deemed to be a complete URL, it will be returned
         * directly.  If it is not complete, then the segment provided will be combined
         * with the `host` and `namespace` options of the request class to create the
         * full URL.
         */
        _buildURL(url, options = {}) {
            if ((0, _urlHelpers.isFullURL)(url)) {
                return url;
            }
            const urlParts = [];
            let host = options.host || Ember.get(this, 'host');
            if (host) {
                host = stripSlashes(host);
            }
            urlParts.push(host);
            let namespace = options.namespace || Ember.get(this, 'namespace');
            if (namespace) {
                namespace = stripSlashes(namespace);
                urlParts.push(namespace);
            }
            // If the URL has already been constructed (presumably, by Ember Data), then we should just leave it alone
            const hasNamespaceRegex = new RegExp(`^(/)?${namespace}/`);
            if (namespace && hasNamespaceRegex.test(url)) {
                return url;
            }
            // *Only* remove a leading slash -- we need to maintain a trailing slash for
            // APIs that differentiate between it being and not being present
            if (startsWithSlash(url)) {
                url = removeLeadingSlash(url);
            }
            urlParts.push(url);
            return urlParts.join('/');
        },
        /**
         * Takes an ajax response, and returns the json payload or an error.
         *
         * By default this hook just returns the json payload passed to it.
         * You might want to override it in two cases:
         *
         * 1. Your API might return useful results in the response headers.
         *    Response headers are passed in as the second argument.
         *
         * 2. Your API might return errors as successful responses with status code
         *    200 and an Errors text or object.
         */
        handleResponse(status, headers, payload, requestData) {
            if (this.isSuccess(status, headers, payload)) {
                return payload;
            }
            // Allow overriding of error payload
            payload = this.normalizeErrorResponse(status, headers, payload);
            return this._createCorrectError(status, headers, payload, requestData);
        },
        _createCorrectError(status, headers, payload, requestData) {
            let error;
            if (this.isUnauthorizedError(status, headers, payload)) {
                error = new _errors.UnauthorizedError(payload);
            } else if (this.isForbiddenError(status, headers, payload)) {
                error = new _errors.ForbiddenError(payload);
            } else if (this.isInvalidError(status, headers, payload)) {
                error = new _errors.InvalidError(payload);
            } else if (this.isBadRequestError(status, headers, payload)) {
                error = new _errors.BadRequestError(payload);
            } else if (this.isNotFoundError(status, headers, payload)) {
                error = new _errors.NotFoundError(payload);
            } else if (this.isGoneError(status, headers, payload)) {
                error = new _errors.GoneError(payload);
            } else if (this.isAbortError(status, headers, payload)) {
                error = new _errors.AbortError();
            } else if (this.isConflictError(status, headers, payload)) {
                error = new _errors.ConflictError(payload);
            } else if (this.isServerError(status, headers, payload)) {
                error = new _errors.ServerError(payload, status);
            } else {
                const detailedMessage = this.generateDetailedMessage(status, headers, payload, requestData);
                error = new _errors.AjaxError(payload, detailedMessage, status);
            }
            return error;
        },
        /**
         * Match the host to a provided array of strings or regexes that can match to a host
         */
        _matchHosts(host, matcher) {
            if (!(0, _isString.default)(host)) {
                return false;
            }
            if (matcher instanceof RegExp) {
                return matcher.test(host);
            } else if (typeof matcher === 'string') {
                return matcher === host;
            } else {
                console.warn('trustedHosts only handles strings or regexes. ', matcher, ' is neither.');
                return false;
            }
        },
        /**
         * Determine whether the headers should be added for this request
         *
         * This hook is used to help prevent sending headers to every host, regardless
         * of the destination, since this could be a security issue if authentication
         * tokens are accidentally leaked to third parties.
         *
         * To avoid that problem, subclasses should utilize the `headers` computed
         * property to prevent authentication from being sent to third parties, or
         * implement this hook for more fine-grain control over when headers are sent.
         *
         * By default, the headers are sent if the host of the request matches the
         * `host` property designated on the class.
         */
        _shouldSendHeaders({ url, host }) {
            url = url || '';
            host = host || Ember.get(this, 'host') || '';
            const trustedHosts = Ember.get(this, 'trustedHosts') || Ember.A();
            const { hostname } = (0, _urlHelpers.parseURL)(url);
            // Add headers on relative URLs
            if (!(0, _urlHelpers.isFullURL)(url)) {
                return true;
            } else if (trustedHosts.find(matcher => this._matchHosts(hostname, matcher))) {
                return true;
            }
            // Add headers on matching host
            return (0, _urlHelpers.haveSameHost)(url, host);
        },
        /**
         * Generates a detailed ("friendly") error message, with plenty
         * of information for debugging (good luck!)
         */
        generateDetailedMessage(status, headers, payload, requestData) {
            let shortenedPayload;
            const payloadContentType = (0, _getHeader.default)(headers, 'Content-Type') || 'Empty Content-Type';
            if (payloadContentType.toLowerCase() === 'text/html' && payload.length > 250) {
                shortenedPayload = '[Omitted Lengthy HTML]';
            } else {
                shortenedPayload = JSON.stringify(payload);
            }
            const requestDescription = `${requestData.type} ${requestData.url}`;
            const payloadDescription = `Payload (${payloadContentType})`;
            return [`Ember AJAX Request ${requestDescription} returned a ${status}`, payloadDescription, shortenedPayload].join('\n');
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a an authorized error.
         */
        isUnauthorizedError(status, _headers, _payload) {
            return (0, _errors.isUnauthorizedError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a forbidden error.
         */
        isForbiddenError(status, _headers, _payload) {
            return (0, _errors.isForbiddenError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a an invalid error.
         */
        isInvalidError(status, _headers, _payload) {
            return (0, _errors.isInvalidError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a bad request error.
         */
        isBadRequestError(status, _headers, _payload) {
            return (0, _errors.isBadRequestError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a "not found" error.
         */
        isNotFoundError(status, _headers, _payload) {
            return (0, _errors.isNotFoundError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a "gone" error.
         */
        isGoneError(status, _headers, _payload) {
            return (0, _errors.isGoneError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is an "abort" error.
         */
        isAbortError(status, _headers, _payload) {
            return (0, _errors.isAbortError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a "conflict" error.
         */
        isConflictError(status, _headers, _payload) {
            return (0, _errors.isConflictError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a server error.
         */
        isServerError(status, _headers, _payload) {
            return (0, _errors.isServerError)(status);
        },
        /**
         * Default `handleResponse` implementation uses this hook to decide if the
         * response is a success.
         */
        isSuccess(status, _headers, _payload) {
            return (0, _errors.isSuccess)(status);
        },
        parseErrorResponse(responseText) {
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return responseText;
            }
        },
        normalizeErrorResponse(_status, _headers, payload) {
            return payload;
        }
    });
});