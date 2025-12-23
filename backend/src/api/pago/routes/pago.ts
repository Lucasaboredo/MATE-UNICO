export default {
  routes: [
    {
      method: "POST",
      path: "/pagos/preferencia",
      handler: "pago.crearPreferencia",
      config: {
        auth: false, // el front necesita acceder
      },
    },
    {
      method: "POST",
      path: "/pagos/webhook",
      handler: "pago.webhook",
      config: {
        auth: false, // Mercado Pago no manda token
      },
    },
  ],
};
