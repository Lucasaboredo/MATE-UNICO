module.exports = {
  routes: [
    {
      method: "POST",
      path: "/cupones/validar",
      handler: "cupon.validar",
      config: {
        auth: false,
      },
    },
  ],
};
