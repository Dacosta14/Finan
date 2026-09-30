const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ erro: "Você precisa estar logado para fazer isso" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = dados.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ erro: "Sessão expirada, faça login novamente" });
  }
}

function protegerEscrita(req, res, next) {
  const caminhosLivres = ["/usuarios/login", "/usuarios"];

  if (caminhosLivres.includes(req.path) && req.method !== "GET") {
    return next();
  }

  return autenticar(req, res, next);
}

module.exports = { autenticar, protegerEscrita };
