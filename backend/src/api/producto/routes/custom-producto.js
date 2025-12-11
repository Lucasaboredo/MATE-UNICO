export default {
  routes: [
    {
      method: "GET",
      path: "/productos/catalogo",
      handler: "producto.catalogo",
      config: {
        auth: false, // Cambiar a true si querés obligar login
      },
    },
  ],
};
