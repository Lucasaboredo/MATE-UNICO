export default {
  routes: [
    {
      method: "POST",
      path: "/pago/preferencia",
      handler: "api::pago.mercadopago.crearPreferencia",
      config: { auth: false },
    },
    {
      method: "POST",
      path: "/pago/webhook",
      handler: "api::pago.mercadopago.webhook",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/pago/exito",
      handler: "api::pago.mercadopago.exito",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/pago/error",
      handler: "api::pago.mercadopago.error",
      config: { auth: false },
    },
    {
      method: "GET",
      path: "/pago/pendiente",
      handler: "api::pago.mercadopago.pendiente",
      config: { auth: false },
    },

    
  ],
};
