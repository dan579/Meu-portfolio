import React from 'react';

/**
 * Catálogo centralizado de referências dos arquivos oficiais da marca DS Sistemas e Soluções.
 * Evita duplicação de caminhos no código e padroniza a escolha da versão por tipo de superfície.
 */
export const DS_BRAND_ASSETS = {
  // Versão original: corpo azul-marinho com acento ciano — ideal para fundos brancos e claros
  monogramLightBg: '/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png',

  // Versão oficial para fundos escuros: corpo branco com gradiente azul-ciano — máxima legibilidade sobre azul-marinho, grafite ou preto
  monogramDarkBg: '/assets/aistudio/Monograma_DS_em_Gradiente_Azul-Ciano_25289cf0.png',

  // Logotipo institucional horizontal completo
  fullHorizontal: '/assets/aistudio/Logo_DS_Sistemas_e_Solu__es__1__97642a65.png',

  // Logotipo institucional vertical / stacked
  fullStacked: '/assets/aistudio/Imagem_do_ChatGPT_5_de_nov._de_2026__08_45_13_dc24b8f2.png',
} as const;

export interface BrandLogoProps {
  /**
   * 'light': Superfície clara (branco, cinza claro #F3F6FA). Aplica o monograma com corpo escuro.
   * 'dark': Superfície escura (azul-marinho #061B3A, grafite, preto). Aplica o monograma com corpo branco e gradiente azul-ciano.
   */
  surface?: 'light' | 'dark';
  className?: string;
  alt?: string;
}

/**
 * Componente reutilizável para exibição consistente da marca DS Sistemas e Soluções.
 * Garante contraste absoluto sem aplicação de filtros CSS artificiais.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  surface = 'light',
  className = 'w-10 h-10 object-contain',
  alt = 'DS Sistemas e Soluções',
}) => {
  const src = surface === 'dark' ? DS_BRAND_ASSETS.monogramDarkBg : DS_BRAND_ASSETS.monogramLightBg;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
};
