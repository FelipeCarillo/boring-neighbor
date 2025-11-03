from openai import OpenAI
from typing import Optional

from src.configs.env import settings
from src.helpers.errors import InternalServerException


class OpenAIService:
    """
    Service for OpenAI API integration.
    """
    
    def __init__(self):
        if not settings.openai_api_key:
            raise InternalServerException(detail="OpenAI API key not configured")
        
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    def generate_construction_report(
        self,
        construction_name: str,
        phases_data: dict,
        deviations_data: list[dict],
        total_progress: int,
        average_deviation: Optional[float],
    ) -> str:
        """
        Generate AI-powered construction analysis report.
        """
        prompt = self._build_report_prompt(
            construction_name,
            phases_data,
            deviations_data,
            total_progress,
            average_deviation,
        )
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Você é um especialista em gestão de obras do Metrô de São Paulo. "
                            "Analise os dados fornecidos e gere um relatório técnico detalhado em português brasileiro. "
                            "Seja objetivo, técnico e focado em ações práticas."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                temperature=0.7,
                max_tokens=2000,
            )
            
            return response.choices[0].message.content
        except Exception as e:
            raise InternalServerException(detail=f"OpenAI API error: {str(e)}")
    
    def _build_report_prompt(
        self,
        construction_name: str,
        phases_data: dict,
        deviations_data: list[dict],
        total_progress: int,
        average_deviation: Optional[float],
    ) -> str:
        """
        Build prompt for OpenAI report generation.
        """
        prompt = f"""
Análise de Obra do Metrô de São Paulo

OBRA: {construction_name}
TOTAL DE REGISTROS DE PROGRESSO: {total_progress}
SCORE MÉDIO DE DESVIO: {average_deviation:.2f}/100 (100 = execução perfeita)

FASES DA OBRA:
"""
        
        for phase_name, phase_info in phases_data.items():
            prompt += f"\n{phase_name}:"
            prompt += f"\n  - Status: {phase_info['status']}"
            prompt += f"\n  - Registros: {phase_info['progress_count']}"
            if phase_info['avg_deviation']:
                prompt += f"\n  - Desvio Médio: {phase_info['avg_deviation']:.2f}/100"
        
        prompt += "\n\nDESVIOS IDENTIFICADOS (Score < 70):\n"
        
        critical_deviations = [d for d in deviations_data if d['score'] and d['score'] < 70]
        if critical_deviations:
            for deviation in critical_deviations[:10]:
                prompt += f"\n- Fase: {deviation['phase']}, Score: {deviation['score']:.2f}/100"
                if deviation['notes']:
                    prompt += f", Notas: {deviation['notes']}"
        else:
            prompt += "\nNenhum desvio crítico identificado."
        
        prompt += """

Por favor, gere um relatório técnico incluindo:

1. RESUMO EXECUTIVO
   - Status geral da obra
   - Principais observações

2. ANÁLISE DE DESVIOS
   - Identificação de desvios críticos (score < 70)
   - Possíveis causas
   - Impacto no cronograma

3. ANÁLISE POR FASE
   - Progresso de cada fase
   - Conformidade com o projeto

4. RECOMENDAÇÕES
   - Ações corretivas prioritárias
   - Melhorias de processo
   - Pontos de atenção

5. RISCOS IDENTIFICADOS
   - Riscos técnicos
   - Riscos de cronograma
   - Mitigações sugeridas
"""
        
        return prompt


openai_service = OpenAIService() if settings.openai_api_key else None


