/* ============================================
   NIGHT TATTOO BODY ART — JavaScript
   Formulário simplificado: escolha de artista,
   nome + ideia, envio direto via WhatsApp.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const TATUADORES = {
    Night: { nome: 'Night', whatsapp: '+5514997377444' },
    Higor: { nome: 'Higor', whatsapp: '+5514996042781' },
    Edson: { nome: 'Edson', whatsapp: '+5514996200643' }
  };

  /* ============================================
   ESTADO
   ============================================ */
  let selectedArtist = null;

  /* ============================================
   1. SELEÇÃO DO TATUADOR (cards clicáveis)
   ============================================ */
  const artistCards = document.querySelectorAll('.artist-option-card');

  artistCards.forEach(card => {
    card.addEventListener('click', () => {
      artistCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedArtist = radio.value;
      }
    });
  });

  /* ============================================
   2. VALIDAÇÃO E ENVIO
   ============================================ */
  const form = document.getElementById('orcamento-form');
  const successBox = document.getElementById('form-success');

  function setError(fieldId, msg) {
    const el = document.getElementById(fieldId);
    if (!el) return;
    el.style.borderColor = msg ? '#e11d1d' : '';
    if (!msg) return;
    let errEl = el.parentElement.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'field-error';
      el.parentElement.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearErrors() {
    setError('nome', '');
    document.querySelectorAll('.field-error').forEach(e => e.remove());
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    if (!selectedArtist) {
      alert('Escolha o tatuador de sua preferência.');
      return;
    }

    const nome = document.getElementById('nome');
    const descricao = document.getElementById('descricao');

    if (!nome.value.trim() || nome.value.trim().length < 3) {
      setError('nome', 'Informe seu nome completo.');
      return;
    }

    const solicitacao = {
      nome: nome.value.trim(),
      descricao: descricao ? descricao.value.trim() : '',
      artista: selectedArtist
    };

    const whatsappUrl = gerarLinkWhatsApp(solicitacao);
    window.open(whatsappUrl, '_blank');

    form.classList.add('hidden');
    if (successBox) {
      successBox.classList.remove('hidden');
      successBox.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  });

  function gerarLinkWhatsApp(solicitacao) {
    const tatuador = TATUADORES[solicitacao.artista] || TATUADORES.Night;
    const numero = tatuador.whatsapp.replace('+', '');

    const linhas = [
      '🔥 *SOLICITAÇÃO DE AGENDAMENTO — NIGHT TATTOO* 🔥',
      '',
      `👤 *Cliente:* ${solicitacao.nome}`,
      `✒️ *Tatuador:* ${solicitacao.artista}`,
      solicitacao.descricao ? `💡 *Ideia da Tattoo:* ${solicitacao.descricao}` : null,
      '',
      '_Enviado pelo site Night Tattoo Body Art_'
    ].filter(Boolean);

    return `https://wa.me/${numero}?text=${encodeURIComponent(linhas.join('\n'))}`;
  }

  /* ============================================
   NOVO AGENDAMENTO
   ============================================ */
  const newRequestBtn = document.getElementById('new-request');
  if (newRequestBtn) {
    newRequestBtn.addEventListener('click', () => {
      form.reset();
      selectedArtist = null;
      artistCards.forEach(c => c.classList.remove('selected'));
      clearErrors();
      form.classList.remove('hidden');
      if (successBox) successBox.classList.add('hidden');
    });
  }
});