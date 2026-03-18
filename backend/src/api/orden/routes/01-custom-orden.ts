export default {
    routes: [
        {
            method: 'GET',
            path: '/ordens/mis-ordenes',
            handler: 'orden.findMine',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'DELETE',
            path: '/ordens/mis-ordenes/:id',
            handler: 'orden.deleteMine',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};