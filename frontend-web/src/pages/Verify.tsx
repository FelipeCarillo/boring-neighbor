import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle } from 'lucide-react';

const verifySchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);

  const email = location.state?.email || 'seu@email.com';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulação de verificação - substituir por chamada real da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock: código 123456 é válido
      if (data.code === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError('code', {
          type: 'manual',
          message: 'Código inválido. Tente novamente.',
        });
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Conta Verificada!
          </h2>
          <p className="text-gray-600">
            Sua conta foi verificada com sucesso. Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-[#001489] rounded-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verificar Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite o código enviado para <span className="font-medium">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Código de Verificação
            </label>
            <input
              {...register('code')}
              type="text"
              id="code"
              maxLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#001489] focus:border-[#001489] text-center text-lg font-mono tracking-widest"
              placeholder="000000"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Não recebeu o código?</p>
            <button
              type="button"
              className="text-[#001489] hover:text-[#001489]/80 transition-colors cursor-pointer"
            >
              Reenviar código
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#001489] hover:bg-[#001489]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001489] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verificando...' : 'Verificar Código'}
          </button>

          <div className="text-center">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm text-[#001489] hover:text-[#001489]/80 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para o login
            </Link>
          </div>
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>Código de teste: <span className="font-mono">123456</span></p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
