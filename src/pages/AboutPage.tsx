import React from 'react';
import {
  useProfile,
  useLanguage
} from '../content/ContentProvider.tsx';
import {
  User,
  GraduationCap,
  Award,
  Compass,
  CheckCircle,
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const profile = useProfile();
  const { language } = useLanguage();

  return (
    <div className="w-full py-12 sm:py-16" id="about-page-container">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header da Página */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#0877E8] text-xs font-bold font-heading uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>{language === 'pt' ? 'Perfil Profissional' : 'Professional Profile'}</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#061B3A] tracking-tight">
            {language === 'pt' ? `Sobre ${profile.name}` : `About ${profile.name}`}
          </h1>
          <p className="text-sm text-[#64748B] max-w-2xl leading-relaxed">
            {language === 'pt'
              ? 'Histórico profissional, mentalidade técnica, formação acadêmica e escopo de atuação.'
              : 'Professional background, engineering mindset, education, and technical expertise.'}
          </p>
        </div>

        {/* Trajetória Completa (Bio) - Card Branco Elegante */}
        <section className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-[#061B3A]">
              {language === 'pt' ? 'Trajetória & Posicionamento Profissional' : 'Background & Career Positioning'}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#253247] leading-relaxed">
            {profile.fullBio.map((paragraph, index) => (
              <p key={index} className="leading-relaxed font-normal">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Formação Acadêmica & Certificações em Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Educação */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#0877E8]/10 flex items-center justify-center text-[#0877E8]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#061B3A]">
                {language === 'pt' ? 'Formação Acadêmica' : 'Academic Education'}
              </h3>
            </div>

            <div className="space-y-6">
              {profile.education.map((edu) => (
                <div key={edu.id} className="space-y-2 border-l-2 border-[#0877E8] pl-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-[#061B3A]">
                      {edu.institution}
                    </h4>
                    <p className="text-xs text-[#0877E8] font-semibold mt-0.5">
                      {edu.degree} • {edu.field}
                    </p>
                    <span className="text-[11px] text-[#64748B] font-mono block mt-0.5">
                      {edu.period} ({edu.status})
                    </span>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-[#253247] leading-relaxed">
                      {edu.description}
                    </p>
                  )}

                  {edu.highlights && (
                    <ul className="space-y-1 pt-1">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-[#64748B] flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#0877E8] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certificações & Cursos Técnicos */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-[#00D4E8]/20 flex items-center justify-center text-[#0877E8]">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-heading font-bold text-base text-[#061B3A]">
                {language === 'pt' ? 'Certificações & Cursos' : 'Certifications & Courses'}
              </h3>
            </div>

            <div className="space-y-4">
              {profile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl bg-[#F3F6FA] border border-slate-200/80 hover:border-[#0877E8]/40 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-xs text-[#061B3A]">
                      {cert.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      {cert.issuer}
                    </p>
                    {cert.badge && (
                      <span className="inline-block text-[10px] font-mono text-[#0877E8] font-semibold mt-1">
                        {cert.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-[#64748B] bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {cert.year}
                    </span>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0877E8] hover:text-[#061B3A] p-1"
                        title="Ver credencial"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
