/**
 * ============================================
 * API SERVERLESS: /api/gerar-inspiracao
 * ============================================
 *
 * Gera 3 imagens de inspiração de tatuagem sob demanda via IA
 * com base estrita na parte do corpo e no gênero selecionados.
 */

const ANATOMIA_EN = {
  pescoco: 'neck and throat area',
  ombros: 'deltoid and shoulder area',
  peito: 'chest and pectoral muscle area',
  abdomen: 'abdomen, stomach and rib area',
  costas: 'full back and spine area',
  bracos: 'biceps, upper arm and full sleeve',
  antebracos: 'forearm and wrist area',
  maos: 'hand and fingers',
  coxas: 'quadriceps, thigh and upper leg area',
  canelas: 'shin and lower leg area',
  panturrilhas: 'calf muscle and back of lower leg area'
};

const ESTILOS_IA = [
  'Hyperrealistic black and grey realism with delicate micro-shading',
  'Neo-traditional dark art with bold linework and high contrast',
  'Fine line geometric and botanical ornamental blackwork'
];

function normalizarChave(chave) {
  if (!chave) return 'bracos';
  return String(chave)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.method === 'POST' ? req.body || {} : req.query || {};
    const regiaoRaw = body.regiao || 'bracos';
    const generoRaw = body.genero === 'mulher' ? 'mulher' : 'homem';

    const regiaoKey = normalizarChave(regiaoRaw);
    const parteEn = ANATOMIA_EN[regiaoKey] || 'arm and shoulder area';
    const generoEn = generoRaw === 'mulher' ? 'an athletic woman with feminine silhouette' : 'an athletic man with masculine physique';

    const basePrompt = `High-end professional tattoo design placed on the ${parteEn} of ${generoEn}, intricate details, studio lighting, hyperrealistic, pinterest style, tattoo studio portfolio quality, 8k, sharp focus, award winning body art`;

    const images = ESTILOS_IA.map((estilo, idx) => {
      const fullPrompt = `${estilo}, ${basePrompt}`;
      const seed = Math.floor(Math.random() * 899999) + 100000 + idx;
      // Endpoint de geração de imagem por IA (Flux Model)
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=800&nologo=true&seed=${seed}&model=flux`;
    });

    const pinterestTerm = encodeURIComponent(`tatuagem no ${regiaoRaw} ${generoRaw}`);
    const pinterestUrl = `https://www.pinterest.com/search/pins/?q=${pinterestTerm}`;

    return res.status(200).json({
      success: true,
      regiao: regiaoRaw,
      genero: generoRaw,
      prompt: basePrompt,
      images,
      pinterestUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Falha ao processar prompt de IA: ' + err.message
    });
  }
};
