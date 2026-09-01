/* ============================================
   NIGHT TATTOO BODY ART — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- HEADER SCROLL ---------- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ---------- MOBILE MENU ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });

  // Fecha o menu ao clicar em um link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });

  /* ---------- BODY DIAGRAM TABS (MOBILE) ---------- */
  const tabs = document.querySelectorAll('.body-tab');
  const panels = document.querySelectorAll('.body-diagram-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => p.classList.remove('active'));
      const targetId = 'panel-' + tab.dataset.tab;
      document.getElementById(targetId).classList.add('active');
    });
  });

  /* ---------- BODY REGIONS INTERACTION ---------- */
  const regions = document.querySelectorAll('.body-region');
  const suggestionPanel = document.getElementById('suggestion-panel');
  const suggestionRegion = document.getElementById('suggestion-region');
  const suggestionText = document.getElementById('suggestion-text');
  const suggestionWhatsApp = document.getElementById('suggestion-whatsapp');
  const closeSuggestion = document.getElementById('close-suggestion');

  /*
   * ============================================
   * SUGESTÕES POR REGIÃO (FALLBACK LOCAL)
   * ============================================
   * Estas sugestões são usadas quando a API de IA não está disponível.
   * Para plugar uma chamada de IA futuramente, substitua a lógica
   * em buscarSugestao() por uma chamada fetch('/api/sugerir-tattoo', ...)
   */
  const sugestoesPorRegiao = {
    // ---- FRENTE ----
    'pescoço-frente': {
      nome: 'Pescoço (Frente)',
      texto: 'O pescoço é uma região ousada e de alto impacto visual. Estilos como fineline, lettering delicado ou pequenos símbolos geométricos funcionam muito bem. Considere que a pele nessa área é sensível — traços finos e minimalistas tendem a envelhecer melhor.'
    },
    'ombro-frente-e': {
      nome: 'Ombro Esquerdo',
      texto: 'O ombro é uma área versátil e com boa visibilidade. Estilos como blackwork, realismo ou elementos orgânicos (flores, animais) valorizam bem a forma arredondada do ombro. É uma ótima região para peças de tamanho médio.'
    },
    'ombro-frente-d': {
      nome: 'Ombro Direito',
      texto: 'O ombro é uma área versátil e com boa visibilidade. Estilos como blackwork, realismo ou elementos orgânicos (flores, animais) valorizam bem a forma arredondada do ombro. É uma ótima região para peças de tamanho médio.'
    },
    'peito': {
      nome: 'Peito',
      texto: 'O peito permite peças grandes e impactantes. Estilos como realismo, blackwork geométrico, aquarela ou composições com elementos naturais ficam excelentes nessa região. O contorno do peito valoriza desenhos que seguem a linha do corpo.'
    },
    'costela-lateral': {
      nome: 'Costela Lateral',
      texto: 'A costela é uma região elegante para peças verticais ealongadas. Estilos como fineline, mandalas verticais, penas ou elementos com fluidez se adaptam bem à curvatura natural das costelas. É uma área sensível — considere traços mais limpos.'
    },
    'abdômen': {
      nome: 'Abdômen',
      texto: 'O abdômen é ideal para composições centrais e simétricas. Estilos geométricos, mandalas, ou peças com simetria axial funcionam muito bem. Para áreas maiores, o blackwork com detalhes em negativo cria um contraste visual impressionante.'
    },
    'braço-bíceps': {
      nome: 'Braço - Bíceps (Esquerdo)',
      texto: 'O bíceps é clássico para tatuagens. Funciona com praticamente qualquer estilo: realismo, lettering, tradicional americano, ou blackwork. A forma arredondada do músculo destora peças com volume e profundidade.'
    },
    'braço-bíceps-d': {
      nome: 'Braço - Bíceps (Direito)',
      texto: 'O bíceps é clássico para tatuagens. Funciona com praticamente qualquer estilo: realismo, lettering, tradicional americano, ou blackwork. A forma arredondada do músculo destora peças com volume e profundidade.'
    },
    'antebraço-e': {
      nome: 'Antebraço (Esquerdo)',
      texto: 'O antebraço é uma das regiões mais populares. Com bastante espaço, aceita desde peças pequenas até composições que cobrem toda a área. Estilos como blackwork, geometric, ornamental ou sleeve parcial ficam especialmente bem.'
    },
    'antebraço-d': {
      nome: 'Antebraço (Direito)',
      texto: 'O antebraço é uma das regiões mais populares. Com bastante espaço, aceita desde peças pequenas até composições que cobrem toda a área. Estilos como blackwork, geometric, ornamental ou sleeve parcial ficam especialmente bem.'
    },
    'mão-e': {
      nome: 'Mão (Esquerda)',
      texto: 'A mão é uma região de alto impacto mas que demands atenção ao estilo. Estilos minimalistas, fineline, pequenos símbolos ou geometric funcionam melhor. Lembre que a tatuagem na mão desgasta mais rápido — escolha traços que envelheçam bem.'
    },
    'mão-d': {
      nome: 'Mão (Direita)',
      texto: 'A mão é uma região de alto impacto mas que demands atenção ao estilo. Estilos minimalistas, fineline, pequenos símbolos ou geometric funcionam melhor. Lembre que a tatuagem na mão desgasta mais rápido — escolha traços que envelheçam bem.'
    },
    'coxa-frente-e': {
      nome: 'Coxa (Frente - Esquerda)',
      texto: 'A coxa oferece uma área grande e plana, ideal para peças detalhadas. Realismo, aquarela, retratos ou composições com elementos da natureza ficam excelentes. Também é ótima para quem quer uma tatuagem que pode ser facilmente coberta.'
    },
    'coxa-frente-d': {
      nome: 'Coxa (Frente - Direita)',
      texto: 'A coxa oferece uma área grande e plana, ideal para peças detalhadas. Realismo, aquarela, retratos ou composições com elementos da natureza ficam excelentes. Também é ótima para quem quer uma tatuagem que pode ser facilmente coberta.'
    },
    'canela-e': {
      nome: 'Canela (Esquerda)',
      texto: 'A canela é popular para peças verticais e alongadas. Estilos como tribal moderno, blackwork geométrico, textos ou elementos que seguem a linha do osso funcionam muito bem. A região é mais sensível para tatuar.'
    },
    'canela-d': {
      nome: 'Canela (Direita)',
      texto: 'A canela é popular para peças verticais e alongadas. Estilos como tribal moderno, blackwork geométrico, textos ou elementos que seguem a linha do osso funcionam muito bem. A região é mais sensível para tatuar.'
    },
    // ---- COSTAS ----
    'nuca': {
      nome: 'Nuca',
      texto: 'A nuca é discreta e elegante. Estilos minimalistas, fineline, pequenos símbolos ou textos curtos ficam perfeitos. É uma ótima escolha para primeira tatuagem, com opção de esconder facilmente.'
    },
    'ombro-posterior-e': {
      nome: 'Ombro Posterior (Esquerdo)',
      texto: 'O ombro posterior é uma tela versátil. Estilos como blackwork, realismo ou elementos com boa definição de contorno valorizam bem essa região. Funciona tanto para peças compactas quanto para extensões que chegam ao braço.'
    },
    'ombro-posterior-d': {
      nome: 'Ombro Posterior (Direito)',
      texto: 'O ombro posterior é uma tela versátil. Estilos como blackwork, realismo ou elementos com boa definição de contorno valorizam bem essa região. Funciona tanto para peças compactas quanto para extensões que chegam ao braço.'
    },
    'costas-superior': {
      nome: 'Costas Superior',
      texto: 'As costas superiores são o cantinho para peças grandese impactantes. Meros, natureza, composições abstratas ou cobertura total (blackout) ficam extraordinários. É uma das melhores regiões para peças com muito detalhe.'
    },
    'braço-tríceps-e': {
      nome: 'Braço - Tríceps (Esquerdo)',
      texto: 'A região do tríceps é ótima para peças verticais ealongadas. Estilos como blackwork, geometric ou elementos que seguem a linha do braço funcionam muito bem. É uma área relativamente confortável para tatuar.'
    },
    'braço-tríceps-d': {
      nome: 'Braço - Tríceps (Direito)',
      texto: 'A região do tríceps é ótima para peças verticais ealongadas. Estilos como blackwork, geometric ou elementos que seguem a linha do braço funcionam muito bem. É uma área relativamente confortável para tatuar.'
    },
    'costas-inferior': {
      nome: 'Costas Inferior (Lombar)',
      texto: 'A lombar é uma região elegante e sensível. Estilos como fineline, ornamental, mandalas ou composições com simetria ficam lindos. A curvatura natural da região destora desenhos que acompanham o movimento do corpo.'
    },
    'antebraço-posterior-e': {
      nome: 'Antebraço Posterior (Esquerdo)',
      texto: 'O antebraço posterior é ideal para peças que ficam visíveis quando o braço está relaxado. Blackwork, geometric, textos ou elementos com boa definição de controno se destacam nessa região.'
    },
    'antebraço-posterior-d': {
      nome: 'Antebraço Posterior (Direito)',
      texto: 'O antebraço posterior é ideal para peças que ficam visíveis quando o braço está relaxado. Blackwork, geometric, textos ou elementos com boa definição de controno se destacam nessa região.'
    },
    'coxa-posterior-e': {
      nome: 'Coxa Posterior (Esquerda)',
      texto: 'A coxa posterior é uma área ampla, perfeita para peças detalhadas ou composições maiores. Realismo, aquarela, ou blackwork com detalhes em negativo criam resultados impressionantes.'
    },
    'coxa-posterior-d': {
      nome: 'Coxa Posterior (Direita)',
      texto: 'A coxa posterior é uma área ampla, perfeita para peças detalhadas ou composições maiores. Realismo, aquarela, ou blackwork com detalhes em negativo criam resultados impressionantes.'
    },
    'panturrilha-e': {
      nome: 'Panturrilha (Esquerda)',
      texto: 'A panturrilha é ótima para peças verticais com impacto. Estilos como tribal moderno, blackwork, elementos geométricos alongados ou ilustrações que acompanham a forma da perna funcionam especialmente bem.'
    },
    'panturrilha-d': {
      nome: 'Panturrilha (Direita)',
      texto: 'A panturrilha é ótima para peças verticais com impacto. Estilos como tribal moderno, blackwork, elementos geométricos alongados ou ilustrações que acompanham a forma da perna funcionam especialmente bem.'
    }
  };

  // Número principal do estúdio (Night)
  const WHATSAPP_STUDIO = '5514997377444';

  /**
   * ============================================
   * FUNÇÃO: buscarSugestao
   * ============================================
   * Primeiro tenta buscar via API serverless (IA).
   * Se falhar, usa o fallback local (sugestoesPorRegiao).
   *
   * PARA PLUGAR UMA API DE IA:
   * Descomente o bloco fetch abaixo e comente o fallback,
   * ou implemente a chamada desejada.
   */
  async function buscarSugestao(regiaoKey) {
    // --- FALLBACK LOCAL (funciona sem API) ---
    const dados = sugestoesPorRegiao[regiaoKey];
    if (dados) return dados;

    // --- CHAMADA À API (descomente quando a API estiver pronta) ---
    /*
    try {
      const res = await fetch('/api/sugerir-tattoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regiao: regiaoKey })
      });
      if (res.ok) {
        const data = await res.json();
        return { nome: data.nome, texto: data.sugestao };
      }
    } catch (err) {
      console.warn('API indisponível, usando fallback local:', err);
    }
    */

    return {
      nome: regiaoKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      texto: 'Consulte um de nossos tatuadores para uma sugestão personalizada de estilo para esta região.'
    };
  }

  // Região selecionada atualmente
  let regiaoAtual = null;

  regions.forEach(region => {
    region.addEventListener('click', async () => {
      const regiaoKey = region.dataset.region;

      // Remove seleção anterior
      regions.forEach(r => r.classList.remove('selected'));

      // Aplica seleção na região clicada
      region.classList.add('selected');
      regiaoAtual = regiaoKey;

      // Busca sugestão (local ou API)
      const sugestao = await buscarSugestao(regiaoKey);

      // Atualiza o painel
      suggestionRegion.textContent = sugestao.nome;
      suggestionText.textContent = sugestao.texto;

      // Monta link do WhatsApp com a região
      const mensagem = encodeURIComponent(
        `Olá! Gostaria de tatuar na região: ${sugestao.nome}. Podemos conversar?`
      );
      suggestionWhatsApp.href = `https://wa.me/${WHATSAPP_STUDIO}?text=${mensagem}`;

      // Mostra o painel
      suggestionPanel.classList.remove('hidden');

      // Scroll suave até o painel
      suggestionPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  // Fecha o painel de sugestão
  closeSuggestion.addEventListener('click', () => {
    suggestionPanel.classList.add('hidden');
    regions.forEach(r => r.classList.remove('selected'));
    regiaoAtual = null;
  });

  /* ---------- SMOOTH SCROLL POLYFIL (âncoras internas) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
