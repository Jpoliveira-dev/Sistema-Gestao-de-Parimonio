import Fastify from 'fastify';
import cors from '@fastify/cors';
import {prismaPlugin} from './plugins/prisma.js';
import {authPlugin} from './plugins/auth.js';
import {errorHandler} from "./common/errorHandler.js";
import routes from "./routes/index.js";

export async function buildApp(){
    const app= Fastify({logger:true});
    await app.register(cors, {origin:true});
    await app.register(prismaPlugin);
    await app.register(authPlugin);

    app.setErrorHandler(errorHandler);

    await app.register(routes, {prefix: '/api'});

    app.get('/health', async () =>({ok:true}));

    return app;
}
