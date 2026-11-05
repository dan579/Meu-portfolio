import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useProfile,
  useProjects,
  useUILabels,
  useContent,
  useLanguage
} from '../content/ContentProvider.tsx';
import { downloadResumePdf, downloadPortfolioPdf } from '../pdf/pdfGenerator.ts';
import { TechBadge } from '../components/common/TechBadge.tsx';
import {
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  Layers,
  Server,
  Code,
  FileText,
  Loader2,
  Check,
  Download,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Cpu,
  Network
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const content = useContent();
  const profile = useProfile();
  const projects = useProjects();
  const labels = useUILabels();
  const { language } = useLanguage();

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'resume' | 'portfolio' | null>(null);
  const [downloadedFormat, setDownloadedFormat] = useState<'resume' | 'portfolio' | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target as Node)
      ) {
        setIsDownloadMenuOpen(false);
      }
    };

    if (isDownloadMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDownloadMenuOpen]);

  const handleDownloadResume = async () => {
    setIsDownloadMenuOpen(false);
    try {
      setDownloadingFormat('resume');
      await downloadResumePdf(content);
      setDownloadedFormat('resume');
      setTimeout(() => setDownloadedFormat(null), 3000);
    } catch (err) {
      console.error('Erro ao baixar Currículo:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadPortfolio = async () => {
    setIsDownloadMenuOpen(false);
    try {
      setDownloadingFormat('portfolio');
      await downloadPortfolioPdf(content);
      setDownloadedFormat('portfolio');
      setTimeout(() => setDownloadedFormat(null), 3000);
    } catch (err) {
      console.error('Erro ao baixar Portfólio:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="w-full" id="home-page-container">
      {/* 1. Hero / Apresentação Profissional */}
      <section className="bg-white border-b border-slate-200/90 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            {/* Left Content */}
            <div className="max-w-3xl space-y-6">
              {/* Badge Identidade */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0877E8]/10 border border-[#0877E8]/20 text-[#0877E8] text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#00D4E8]" />
                <span>{profile.headline}</span>
              </div>

              {/* Main Heading H1 */}
              <div className="space-y-2">
                <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#061B3A] tracking-tight leading-[1.1]">
                  {profile.name}
                </h1>
                <p className="font-heading font-bold text-lg sm:text-xl text-[#1769AA]">
                  {language === 'pt'
                    ? 'Sustentação de Ambientes Tecnológicos & Desenvolvimento de Sistemas'
                    : 'Technology Infrastructure & Software Systems'}
                </p>
              </div>

              {/* Presentation Bio */}
              <p className="text-base sm:text-lg text-[#253247] leading-relaxed font-normal">
                {profile.shortSummary}
              </p>

              {/* Status and Location row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#64748B] pt-1">
                <span className="inline-flex items-center gap-1.5 text-[#253247]">
                  <MapPin className="w-4 h-4 text-[#0877E8]" />
                  <span>{profile.location}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{profile.availability}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                {/* Conhecer Projetos */}
                <Link
                  to="/projetos"
                  id="hero-projects-btn"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] bg-[#0877E8] hover:bg-[#0766c6] text-white text-sm font-bold transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>{language === 'pt' ? 'Conhecer Projetos' : 'Explore Projects'}</span>
                </Link>

                {/* Download CV Dropdown */}
                <div className="relative" ref={downloadMenuRef}>
                  <button
                    onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                    disabled={downloadingFormat !== null}
                    id="hero-download-cv-btn"
                    aria-expanded={isDownloadMenuOpen}
                    aria-haspopup="true"
                    className="inline-flex items-center justify-between gap-2 px-5 py-3 rounded-[10px] bg-white hover:bg-slate-50 border border-slate-300 text-[#061B3A] text-sm font-semibold transition-all cursor-pointer disabled:opacity-50 hover:border-[#0877E8] shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      {downloadingFormat !== null ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#0877E8]" />
                      ) : downloadedFormat ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Download className="w-4 h-4 text-[#0877E8]" />
                      )}
                      <span>
                        {downloadingFormat !== null
                          ? (language === 'pt' ? 'Gerando PDF...' : 'Generating PDF...')
                          : downloadedFormat === 'resume'
                          ? (language === 'pt' ? 'Currículo Baixado' : 'Resume Downloaded')
                          : downloadedFormat === 'portfolio'
                          ? (language === 'pt' ? 'Portfólio Baixado' : 'Portfolio Downloaded')
                          : (language === 'pt' ? 'Baixar Currículo (PDF)' : 'Download Resume (PDF)')}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isDownloadMenuOpen ? 'rotate-180 text-[#0877E8]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Options */}
                  {isDownloadMenuOpen && (
                    <div
                      id="hero-download-menu"
                      className="absolute left-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                      {/* Option 1: Currículo ATS */}
                      <button
                        type="button"
                        onClick={handleDownloadResume}
                        id="hero-dropdown-resume-btn"
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F3F6FA] border border-transparent hover:border-slate-200 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 border border-[#0877E8]/20 flex items-center justify-center text-[#0877E8] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#061B3A] group-hover:text-[#0877E8] transition-colors">
                              {language === 'pt' ? 'Currículo Tradicional (PDF)' : 'Traditional Resume (PDF)'}
                            </div>
                            <div className="text-[11px] text-[#64748B]">
                              {language === 'pt' ? 'Formato ATS • Enxuto (até 2 págs)' : 'ATS Formatted • Compact'}
                            </div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0877E8] shrink-0" />
                      </button>

                      {/* Option 2: Portfólio Completo */}
                      <button
                        type="button"
                        onClick={handleDownloadPortfolio}
                        id="hero-dropdown-portfolio-btn"
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F3F6FA] border border-transparent hover:border-slate-200 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#00D4E8]/20 border border-[#00D4E8]/30 flex items-center justify-center text-[#0877E8] shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#061B3A] group-hover:text-[#0877E8] transition-colors">
                              {language === 'pt' ? 'Portfólio Completo (PDF)' : 'Full Portfolio (PDF)'}
                            </div>
                            <div className="text-[11px] text-[#64748B]">
                              {language === 'pt' ? 'Com cases, infraestrutura e QR Code' : 'Full case studies & QR Code'}
                            </div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0877E8] shrink-0" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Channels */}
                <div className="flex items-center gap-2">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      id="hero-linkedin-btn"
                      className="p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#061B3A] hover:text-[#0877E8] transition-colors border border-slate-200"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      id="hero-github-btn"
                      className="p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#061B3A] hover:text-[#0877E8] transition-colors border border-slate-200"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    to="/contato"
                    className="p-3 rounded-[10px] bg-slate-100 hover:bg-slate-200 text-[#061B3A] hover:text-[#0877E8] transition-colors border border-slate-200"
                    title="Contato"
                  >
                    <Mail className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Card / Monogram Showcase */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="bg-[#061B3A] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border border-[#1769AA]/40">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D4E8]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <img
                      src="/assets/aistudio/Logo_DS_entrela_ado_em_azul_marinho_e_ciano_135d994c.png"
                      alt="DS Monogram"
                      className="w-12 h-12 object-contain brightness-110"
                    />
                    <span className="text-[11px] font-mono font-bold text-[#00D4E8] bg-white/10 px-2.5 py-1 rounded">
                      DS SISTEMAS
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading font-extrabold text-xl text-white">
                      {language === 'pt' ? 'Atuação Completa' : 'Full Scope'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {language === 'pt'
                        ? 'Da sustentação e redes ao desenvolvimento de soluções completas — conectando a operação aos sistemas.'
                        : 'From infrastructure support to full-stack system development — bridging operations with software.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-[#0877E8]/20 flex items-center justify-center text-[#00D4E8]">
                        <Server className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'pt' ? 'Infraestrutura, Redes & AD' : 'Infrastructure, Networks & AD'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-[#0877E8]/20 flex items-center justify-center text-[#00D4E8]">
                        <Code className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'pt' ? 'Sistemas Web, Mobile & APIs' : 'Web & Mobile Systems, APIs'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-[#0877E8]/20 flex items-center justify-center text-[#00D4E8]">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <span>{language === 'pt' ? 'Automações & Inteligência Aplicada' : 'Automations & Applied AI'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/sobre"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                    >
                      <span>{language === 'pt' ? 'Ver Trajetória Completa' : 'View Full Background'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stack Principal: Infraestrutura & Desenvolvimento */}
      <section className="bg-[#F3F6FA] py-16 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold font-heading uppercase tracking-wider text-[#0877E8]">
                {labels.common.primaryStack}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#061B3A] mt-1">
                {language === 'pt'
                  ? 'Competências e Tecnologias Aplicadas'
                  : 'Core Competencies & Technologies'}
              </h2>
            </div>
            <Link
              to="/infraestrutura"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0877E8] hover:text-[#061B3A] transition-colors"
            >
              <span>{language === 'pt' ? 'Ver catálogo de infraestrutura' : 'Explore infrastructure catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Infraestrutura & Redes */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#061B3A]">
                    {language === 'pt' ? 'Infraestrutura & Redes' : 'Infrastructure & Networking'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {language === 'pt'
                      ? 'Administração de ambientes, conectividade e suporte'
                      : 'Environment administration, connectivity & support'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#253247] leading-relaxed mb-5">
                {language === 'pt'
                  ? 'Vivência diária na resolução de incidentes N1/N2, servidores de rede, virtualização Proxmox, domínio Active Directory, firewall pfSense, roteamento MikroTik e monitoramento contínuo com Zabbix.'
                  : 'Hands-on daily experience with L1/L2 incident resolution, network servers, Proxmox virtualization, Active Directory, pfSense firewalls, MikroTik routing, and Zabbix monitoring.'}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {['Active Directory', 'Windows Server', 'Proxmox VE', 'pfSense', 'MikroTik', 'Zabbix', 'GLPI', 'VLANs / DHCP'].map((tech) => (
                  <TechBadge key={tech} variant="navy" size="xs">
                    {tech}
                  </TechBadge>
                ))}
              </div>
            </div>

            {/* Bloco 2: Desenvolvimento & Bancos */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00D4E8]/20 flex items-center justify-center text-[#0877E8]">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#061B3A]">
                    {language === 'pt' ? 'Desenvolvimento de Sistemas & Bancos' : 'Systems Development & Databases'}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {language === 'pt'
                      ? 'Aplicações web, mobile, automações e bancos de dados'
                      : 'Web & mobile applications, automations & databases'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#253247] leading-relaxed mb-5">
                {language === 'pt'
                  ? 'Construção de sistemas completos orientados a regras de negócio reais, integração de APIs, modelagem relacional em PostgreSQL, interfaces responsivas em React + Tailwind CSS e automações operacionais.'
                  : 'Building end-to-end systems focused on real business rules, API integrations, relational modeling with PostgreSQL, responsive React + Tailwind CSS frontends, and operational automation.'}
              </p>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {['React', 'TypeScript', 'PostgreSQL / SQL', 'Tailwind CSS', 'Git & GitHub', 'Flutter', 'Automações', 'Supabase'].map((tech) => (
                  <TechBadge key={tech} variant="accent" size="xs">
                    {tech}
                  </TechBadge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Projetos em Destaque */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold font-heading uppercase tracking-wider text-[#0877E8]">
                {labels.common.featuredProjects}
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#061B3A] mt-1">
                {language === 'pt' ? 'Cases de Projetos Desenvolvidos' : 'Featured Case Studies'}
              </h2>
            </div>
            <Link
              to="/projetos"
              id="view-all-projects-link"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0877E8] hover:text-[#061B3A] transition-colors"
            >
              <span>{labels.common.viewAllProjects}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <Link
                key={proj.slug}
                to={`/projetos/${proj.slug}`}
                id={`featured-project-card-${proj.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:border-[#0877E8] hover:shadow-lg transition-all duration-200"
              >
                <div>
                  {/* Card Header Top */}
                  <div className="bg-[#F3F6FA] border border-slate-200/80 rounded-xl p-4 mb-4 flex flex-col justify-center items-center text-center min-h-[90px] relative overflow-hidden group-hover:bg-[#0877E8]/5 transition-colors">
                    <span className="font-heading font-extrabold text-sm text-[#061B3A] tracking-tight line-clamp-1">
                      {proj.title}
                    </span>
                    <span className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                      {proj.category}
                    </span>
                    {proj.badge && (
                      <span className="mt-2 text-[10px] font-mono font-bold text-[#0877E8] bg-white border border-[#0877E8]/20 px-2 py-0.5 rounded shadow-xs">
                        {proj.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-heading font-bold text-base text-[#061B3A] group-hover:text-[#0877E8] transition-colors line-clamp-1">
                      {proj.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                        proj.status === 'completed'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-[#0877E8] bg-[#0877E8]/10 border border-[#0877E8]/20'
                      }`}
                    >
                      {proj.statusLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 mb-4">
                    {proj.shortSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0877E8]">
                  <span>{language === 'pt' ? 'Ver Detalhes do Case' : 'View Case Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trajetória Prática na UNIFENAS (Strategic Navy Banner) */}
      <section className="bg-[#061B3A] text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0877E8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#00D4E8]">
                <Briefcase className="w-4 h-4" />
                <span>{language === 'pt' ? 'Experiência Profissional Consolidada' : 'Proven Work Experience'}</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {language === 'pt'
                  ? 'Vivência Real em Suporte, Infraestrutura e Sistemas'
                  : 'Hands-on Experience in Support, Infrastructure & Systems'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'pt'
                  ? 'Atuação direta na Universidade José do Rosário Vellano (UNIFENAS) em sustentação de computadores, atendimento a centenas de usuários corporativos, gestão de ativos e automação.'
                  : 'Direct experience at UNIFENAS providing technical support, network administration, Active Directory management, and process automation.'}
              </p>
            </div>

            <Link
              to="/experiencia"
              id="home-cta-experience-btn"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#0877E8] hover:bg-[#0766c6] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>{language === 'pt' ? 'Ver Linha do Tempo' : 'View Work Timeline'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
