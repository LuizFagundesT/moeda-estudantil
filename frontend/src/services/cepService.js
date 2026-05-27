function somenteDigitos(valor) {
  return String(valor || "").replace(/\D/g, "");
}

export function formatarCep(valor) {
  const digitos = somenteDigitos(valor).slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export const cepService = {
  async buscarPorCep(cep) {
    const cepLimpo = somenteDigitos(cep);

    if (cepLimpo.length !== 8) {
      throw new Error("Informe um CEP com 8 digitos.");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (!response.ok) {
      throw new Error("Nao foi possivel consultar o CEP.");
    }

    const data = await response.json();
    if (data.erro) {
      throw new Error("CEP nao encontrado.");
    }

    return {
      cep: data.cep || formatarCep(cepLimpo),
      logradouro: data.logradouro || "",
      complemento: data.complemento || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      estado: data.uf || "",
      pais: "Brasil",
    };
  },
};
