
import { useState } from 'react';

interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const useCEPLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCEP = async (cep: string): Promise<Address | null> => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      };
    } catch (err) {
      setError('Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupCEP, loading, error };
};
