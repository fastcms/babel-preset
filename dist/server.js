#!/usr/bin/env node
"use strict";

exports.__esModule = true;
exports.default = exports.buildServer = void 0;

var _closeWithGrace = _interopRequireDefault(require("close-with-grace"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fastify = _interopRequireDefault(require("fastify"));

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_dotenv.default.config();

const buildServer = async () => {
  const server = (0, _fastify.default)({
    logger: {
      prettyPrint: true
    },
    http2: true,
    https: {
      key: _fs.default.readFileSync(_path.default.resolve(_os.default.homedir(), '.certs', 'localhost+2-key.pem')),
      cert: _fs.default.readFileSync(_path.default.resolve(_os.default.homedir(), '.certs', 'localhost+2.pem'))
    }
  });
  server.register(Promise.resolve().then(() => _interopRequireWildcard(require("./app"))));

  const closeWithGraceCallback = async ({
    signal,
    err,
    manual
  }) => {
    if (err) {
      server.log.error(err);
    }

    await server.close();
  };

  const closeListeners = (0, _closeWithGrace.default)({
    delay: 500
  }, closeWithGraceCallback);
  server.addHook('onReady', async function () {
    server.log.info(server.printRoutes());
  });
  server.addHook('onClose', async (instance, done) => {
    closeListeners.uninstall();
    done();
  });
  return server;
};

exports.buildServer = buildServer;
const currentServer = await buildServer();
var _default = currentServer;
exports.default = _default;