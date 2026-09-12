/**
 * ============================================
 * API SERVERLESS: /api/sugerir-tatto
 * ============================================
 *
 * Processa as solicitações de agendamento recebidas do formulário
 * da landing page. Cada tatuador (Night, Higor, Edson) possui sua
 * própria fila de solicitações.
 *
 * Fluxo de aprovação:
 *  1. O cliente envia uma solicitação (status "pendente").
 *  2. O tatuador visualiza a fila e aprova (status "confirmado") ou
 *     recusa (status "recusado").
 *
 * Sem um banco de dados configurado (Vercel KV, Supabase, etc.),
 * esta função usa armazenamento em memória apenas enquanto durar a
 * instância da function. Para persistência real entre deploy, é
 * recomendável conectar um banco de dados.
 */

// Tatuadores autorizados e seus WhatsApp
const TATUADORES = {
  Night: { whatsapp: '+5514997377444' },
  Higor: { whatsapp: '+5514996042781' },
  Edson: { whatsapp: '+5514996200643' }
};

// Armazenamento em memória (não persiste entre cold starts)
let filaSolicitacoes = {};

function timeToMinutes(t) {
  if (!t || typeof t !== 'string' || !t.includes(':')) return 0;
  const parts = t.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

// Verifica se um bloco de horário conflita com solicitações pendentes/confirmadas
function isBlocked(artista, data, horario, duracao) {
  const fila = filaSolicitacoes[artista] || [];
  const inicio = timeToMinutes(horario);
  const fim = inicio + (parseInt(duracao, 10) || 1);

  return fila.some(r => {
    if (r.status !== 'pendente' && r.status !== 'confirmado') return false;
    if (r.data !== data) return false;
    const rInicio = timeToMinutes(r.horario);
    const rFim = rInicio + (parseInt(r.duracao, 10) || 1);
    return inicio < rFim && fim > rInicio;
  });
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};

  // ============================================
  // POST /api/sugerir-tatto
  // Criar nova solicitação de agendamento
  // ============================================
  if (req.method === 'POST') {
    const { nome, telefone, inspiracao, inspiracaoGerada, descricao, regioes, artista, data, horario, duracao } = body;

    if (!nome || !telefone || !artista || !data || !horario) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, telefone, artista, data, horario.' });
    }

    if (!TATUADORES[artista]) {
      return res.status(400).json({ error: 'Tatuador inválido. Use Night, Higor ou Edson.' });
    }

    if (!filaSolicitacoes[artista]) filaSolicitacoes[artista] = [];

    // Bloqueio de conflito de horário
    const dur = parseInt(duracao, 10) || 1;
    if (isBlocked(artista, data, horario, dur)) {
      return res.status(409).json({
        error: 'Conflito de horário.',
        message: 'Este horário já está bloqueado para o tatuador. Escolha outro.' 
      });
    }

    const solicitacao = {
      id: 'req-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      nome,
      telefone,
      inspiracao: inspiracao || '',
      inspiracaoGerada: inspiracaoGerada || '',
      descricao: descricao || '',
      regioes: Array.isArray(regioes) ? regioes : [regioes].filter(Boolean),
      artista,
      data,
      horario,
      duracao: dur,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };

    filaSolicitacoes[artista].push(solicitacao);

    return res.status(201).json({
      success: true,
      message: 'Solicitação registrada como pendente. O tatuador será notificado para aprovar.',
      solicitacao
    });
  }

  // ============================================
  // GET /api/sugerir-tatto?artista=Night
  // Visualizar a fila de solicitações de um tatuador
  // ============================================
  if (req.method === 'GET') {
    const artista = body.artista || req.query.artista;

    if (artista) {
      if (!TATUADORES[artista]) {
        return res.status(400).json({ error: 'Tatuador inválido.' });
      }
      return res.status(200).json({ artista, solicitacoes: filaSolicitacoes[artista] || [] });
    }

    return res.status(200).json(filaSolicitacoes);
  }

  // ============================================
  // PATCH /api/sugerir-tatto
  // Aprovar ou recusar uma solicitação
  // Ex.: { artista: "Night", id: "...", acao: "aprovar" | "recusar" }
  // ============================================
  if (req.method === 'PATCH') {
    const { artista, id, acao } = body;

    if (!artista || !id || !acao) {
      return res.status(400).json({ error: 'Campos obrigatórios: artista, id, acao.' });
    }

    if (!['aprovar', 'recusar'].includes(acao)) {
      return res.status(400).json({ error: 'Ação inválida. Use "aprovar" ou "recusar".' });
    }

    const fila = filaSolicitacoes[artista];
    if (!fila) return res.status(404).json({ error: 'Fila não encontrada.' });

    const solicitacao = fila.find(s => s.id === id);
    if (!solicitacao) return res.status(404).json({ error: 'Solicitação não encontrada.' });

    solicitacao.status = acao === 'aprovar' ? 'confirmado' : 'recusado';

    return res.status(200).json({
      success: true,
      message: acao === 'aprovar' ? 'Solicitação aprovada. Horário confirmado.' : 'Solicitação recusada.',
      solicitacao
    });
  }

  return res.status(405).json({ error: 'Método não permitido.' });
};
