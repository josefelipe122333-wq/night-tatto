/**
 * ============================================
 * API SERVERLESS: /api/sugerir-tattoo
 * ============================================
 *
 * Recebe o nome de uma região do corpo e retorna
 * uma sugestão de estilo de tatuagem.
 *
 * VARIÁVEL DE AMBIENTE NECESSÁRIA (opcional):
 *   ANTHROPIC_API_KEY - Chave da API da Anthropic (Claude)
 *
 * Se a chave não estiver configurada, o endpoint
 * retorna um fallback com sugestões pré-escritas.
 *
 * Para ativar a geração via IA, configure a variável
 * de ambiente ANTHROPIC_API_KEY no painel da Vercel.
 */

// ============================================
// SUGESTÕES LOCAIS (fallback quando sem API key)
// ============================================
const sugestoesLocais = {
  'pescoço-frente': 'O pescoço frontal é ousado e de alto impacto. Fineline, lettering delicado ou símbolos geométricos pequenos funcionam muito bem. Traços finos envelhecem melhor nessa pele sensível.',
  'ombro-frente-e': 'O ombro é versátil com boa visibilidade. Blackwork, realismo ou elementos orgânicos valorizam a forma arredondada. Ideal para peças de tamanho médio.',
  'ombro-frente-d': 'O ombro é versátil com boa visibilidade. Blackwork, realismo ou elementos orgânicos valorizam a forma arredondada. Ideal para peças de tamanho médio.',
  'peito': 'O peito permite peças grandes e impactantes. Realismo, blackwork geométrico, aquarela ou composições com elementos naturais seguem o contorno do corpo.',
  'costela-lateral': 'A costela é elegante para peças verticais e alongadas. Fineline, mandalas, penas ou elementos com fluidez se adaptam à curvatura natural.',
  'abdômen': 'O abdômen é ideal para composições centrais e simétricas. Geométrico, mandalas ou blackwork com detalhes em negativo criam contraste impressionante.',
  'braço-bíceps': 'O bíceps é clássico para tatuagens. Funciona com qualquer estilo: realismo, lettering, tradicional americano ou blackwork.',
  'braço-bíceps-d': 'O bíceps é clássico para tatuagens. Funciona com qualquer estilo: realismo, lettering, tradicional americano ou blackwork.',
  'antebraço-e': 'O antebraço é uma das regiões mais populares. Com bastante espaço, aceita desde peças pequenas até sleeve parcial. Blackwork, geometric e ornamental ficam excelentes.',
  'antebraço-d': 'O antebraço é uma das regiões mais populares. Com bastante espaço, aceita desde peças pequenas até sleeve parcial. Blackwork, geometric e ornamental ficam excelentes.',
  'mão-e': 'A mão é de alto impacto mas demands atenção. Minimalistas, fineline, símbolos pequenos ou geometric funcionam melhor. Desgasta mais rápido — escolha traços que envelheçam bem.',
  'mão-d': 'A mão é de alto impacto mas demands atenção. Minimalistas, fineline, símbolos pequenos ou geometric funcionam melhor. Desgasta mais rápido — escolha traços que envelheçam bem.',
  'coxa-frente-e': 'A coxa oferece área grande e plana para peças detalhadas. Realismo, aquarela, retratos ou elementos da natureza ficam excelentes.',
  'coxa-frente-d': 'A coxa oferece área grande e plana para peças detalhadas. Realismo, aquarela, retratos ou elementos da natureza ficam excelentes.',
  'canela-e': 'A canela é popular para peças verticais e alongadas. Tribal moderno, blackwork geométrico ou textos seguem a linha do osso. Região mais sensível.',
  'canela-d': 'A canela é popular para peças verticais e alongadas. Tribal moderno, blackwork geométrico ou textos seguem a linha do osso. Região mais sensível.',
  'nuca': 'A nuca é discreta e elegante. Minimalistas, fineline, símbolos pequenos ou textos curtos ficam perfeitos. Ótima para primeira tatuagem.',
  'ombro-posterior-e': 'O ombro posterior é versátil. Blackwork, realismo ou elementos com boa definição de contorno. Funciona para peças compactas ou extensões ao braço.',
  'ombro-posterior-d': 'O ombro posterior é versátil. Blackwork, realismo ou elementos com boa definição de contorno. Funciona para peças compactas ou extensões ao braço.',
  'costas-superior': 'As costas superiores são ideais para peças grandese impactantes. Natureza, composições abstratas ou blackout. Melhor região para muito detalhe.',
  'braço-tríceps-e': 'O tríceps é ótimo para peças verticais e alongadas. Blackwork, geometric ou elementos que seguem a linha do braço. Área relativamente confortável.',
  'braço-tríceps-d': 'O tríceps é ótimo para peças verticais e alongadas. Blackwork, geometric ou elementos que seguem a linha do braço. Área relativamente confortável.',
  'costas-inferior': 'A lombar é elegante e sensível. Fineline, ornamental, mandalas ou composições com simetria acompanham a curvatura natural do corpo.',
  'antebraço-posterior-e': 'O antebraço posterior é ideal para peças visíveis com o braço relaxado. Blackwork, geometric, textos ou elementos com boa definição.',
  'antebraço-posterior-d': 'O antebraço posterior é ideal para peças visíveis com o braço relaxado. Blackwork, geometric, textos ou elementos com boa definição.',
  'coxa-posterior-e': 'A coxa posterior é ampla para peças detalhadas ou composições maiores. Realismo, aquarela ou blackwork com detalhes em negativo.',
  'coxa-posterior-d': 'A coxa posterior é ampla para peças detalhadas ou composições maiores. Realismo, aquarela ou blackwork com detalhes em negativo.',
  'panturrilha-e': 'A panturrilha é ótima para peças verticais com impacto. Tribal moderno, blackwork, geométricos alongados ou ilustrações que acompanham a perna.',
  'panturrilha-d': 'A panturrilha é ótima para peças verticais com impacto. Tribal moderno, blackwork, geométricos alongados ou ilustrações que acompanham a perna.'
};

const nomesRegiao = {
  'pescoço-frente': 'Pescoço (Frente)',
  'ombro-frente-e': 'Ombro Esquerdo',
  'ombro-frente-d': 'Ombro Direito',
  'peito': 'Peito',
  'costela-lateral': 'Costela Lateral',
  'abdômen': 'Abdômen',
  'braço-bíceps': 'Braço - Bíceps (Esquerdo)',
  'braço-bíceps-d': 'Braço - Bíceps (Direito)',
  'antebraço-e': 'Antebraço (Esquerdo)',
  'antebraço-d': 'Antebraço (Direito)',
  'mão-e': 'Mão (Esquerda)',
  'mão-d': 'Mão (Direita)',
  'coxa-frente-e': 'Coxa (Frente - Esquerda)',
  'coxa-frente-d': 'Coxa (Frente - Direita)',
  'canela-e': 'Canela (Esquerda)',
  'canela-d': 'Canela (Direita)',
  'nuca': 'Nuca',
  'ombro-posterior-e': 'Ombro Posterior (Esquerdo)',
  'ombro-posterior-d': 'Ombro Posterior (Direito)',
  'costas-superior': 'Costas Superior',
  'braço-tríceps-e': 'Braço - Tríceps (Esquerdo)',
  'braço-tríceps-d': 'Braço - Tríceps (Direito)',
  'costas-inferior': 'Costas Inferior (Lombar)',
  'antebraço-posterior-e': 'Antebraço Posterior (Esquerdo)',
  'antebraço-posterior-d': 'Antebraço Posterior (Direito)',
  'coxa-posterior-e': 'Coxa Posterior (Esquerda)',
  'coxa-posterior-d': 'Coxa Posterior (Direita)',
  'panturrilha-e': 'Panturrilha (Esquerda)',
  'panturrilha-d': 'Panturrilha (Direita)'
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { regiao } = req.body || {};

  if (!regiao) {
    return res.status(400).json({ error: 'Parâmetro "regiao" é obrigatório' });
  }

  const nome = nomesRegiao[regiao] || regiao.replace(/-/g, ' ');

  /*
  // ============================================
  // TENTATIVA DE CHAMADA À API DA ANTHROPIC (Claude)
  // Descomente e configure ANTHROPIC_API_KEY para ativar.
  // ============================================
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (ANTHROPIC_API_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: `Voce e um consultor de tatuagem especializado. Para a regiao do corpo "${nome}", escreva uma sugestao curta (maximo 2 frases) de estilos de tatuagem que ficariam bem nessa area. Seja direto e pratico. Nao use emojis.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const sugestao = data.content?.[0]?.text || null;
        if (sugestao) {
          return res.status(200).json({ nome, sugestao });
        }
      }
    } catch (err) {
      console.error('Erro na chamada a Anthropic:', err);
    }
  }
  */

  // FALLBACK: sugestões locais
  const sugestao = sugestoesLocais[regiao] ||
    'Consulte um de nossos tatuadores para uma sugestão personalizada de estilo para esta região.';

  return res.status(200).json({ nome, sugestao });
};
