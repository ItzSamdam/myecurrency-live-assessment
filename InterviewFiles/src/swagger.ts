import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Interview API',
            description: "Interview API Documentation",
            contact: {
                name: "Samuel Owadayo",
                email: "odevservices@.com",
                url: "https://github.com/ItzSamdam"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:5000/",
                description: "Local server"
            },
            {
                url: "https://myecurrency-live-assessment.onrender.com/",
                description: "Production server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    // looks for configuration in specified directories
    apis: [
        // './src/routes/adminRoutes/*.ts',
        './src/routes/*.ts',
    ],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: any, port: number) {
    // Middleware to authenticate requests to the Swagger Page
    app.use('/api-docs', basicAuth({
        users: { 'webmaster': 'password123!' }, // Replace with your own credentials
        challenge: true, // Force browser to open a prompt
    }), swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Documentation in JSON format
    app.get('/api-docs.json', (req: any, res: { setHeader: (arg0: string, arg1: string) => void; send: (arg0: object) => void; }) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}

export default swaggerDocs;