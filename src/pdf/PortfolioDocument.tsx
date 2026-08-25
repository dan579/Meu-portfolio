import React from 'react';
import { Document, Page, Text, View, Image, Link } from '@react-pdf/renderer';
import { PortfolioData } from './types.ts';
import { pdfStyles as styles } from './sharedStyles.ts';

export const PortfolioDocument: React.FC<{ data: PortfolioData }> = ({ data }) => {
  const {
    profile,
    experiences,
    projects,
    infrastructureAreas,
    skillCategories,
    contact,
    siteUrl,
    qrCodeDataUrl,
  } = data;

  const directEmail = profile.email || contact.email || '';

  const contactItems: React.ReactNode[] = [];

  if (profile.location) {
    contactItems.push(
      <Text key="loc" style={styles.contactItemText}>
        {profile.location}
      </Text>
    );
  }

  if (directEmail) {
    contactItems.push(
      <Link key="email" style={styles.contactLink} src={`mailto:${directEmail}`}>
        {directEmail}
      </Link>
    );
  }

  if (profile.linkedinDisplay || profile.linkedin) {
    const lnUrl = profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`;
    const lnLabel = profile.linkedinDisplay || profile.linkedin;
    contactItems.push(
      <Link key="linkedin" style={styles.contactLink} src={lnUrl}>
        {lnLabel}
      </Link>
    );
  }

  if (profile.githubDisplay || profile.github) {
    const ghUrl = profile.github.startsWith('http') ? profile.github : `https://${profile.github}`;
    const ghLabel = profile.githubDisplay || profile.github;
    contactItems.push(
      <Link key="github" style={styles.contactLink} src={ghUrl}>
        {ghLabel}
      </Link>
    );
  }

  return (
    <Document
      title={`Portfólio Técnico - ${profile.name}`}
      author={profile.name}
      subject="Portfólio de Engenharia de Software e Infraestrutura"
      keywords="Portfólio, Daniel Santos, Sistemas, Infraestrutura, Provedor, Supabase, Operis"
    >
      <Page size="A4" style={styles.page}>
        {/* 1. Capa / Header com Foto e Dados de Contato */}
        <View style={styles.heroHeader}>
          <View style={styles.avatarContainer}>
            {profile.photoUrl ? (
              <Image src={profile.photoUrl} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {profile.initials || 'DS'}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.roleHeadline}>
              {profile.currentRole} • Transição para {profile.targetRole}
            </Text>

            <View style={styles.contactRow}>
              {contactItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Text style={styles.contactSeparator}> • </Text>}
                  {item}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        {/* 2. Composição de Atuação Técnica (Apenas texto descritivo) */}
        {profile.workFocus && (
          <View style={styles.compositionContainer}>
            <Text style={styles.compositionDesc}>
              {profile.workFocus.description || profile.shortSummary}
            </Text>
          </View>
        )}

        {/* 3. Trajetória & Perfil Técnico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trajetória & Perfil Técnico</Text>
          {(profile.fullBio || [profile.shortSummary]).map((p, idx) => (
            <Text key={idx} style={styles.bioParagraph}>
              {p}
            </Text>
          ))}
        </View>

        {/* 4. Experiência Profissional (Espaçamento claro entre cargos) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          {experiences.map((exp) => (
            <View key={exp.id || exp.role} style={styles.expBlock} wrap={false}>
              <View style={styles.expHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expCompany}>
                    {exp.company} {exp.location ? `— ${exp.location}` : ''}
                  </Text>
                </View>
                <Text style={styles.expPeriod}>{exp.period}</Text>
              </View>

              {exp.summary ? (
                <Text style={styles.expSummary}>{exp.summary}</Text>
              ) : null}

              {(exp.responsibilities || []).map((resp, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{resp}</Text>
                </View>
              ))}

              {exp.technologies && exp.technologies.length > 0 && (
                <View style={styles.techStackRow}>
                  <Text style={styles.techLabel}>Tecnologias: </Text>
                  <Text style={styles.techList}>
                    {exp.technologies.join(' • ')}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 5. Projetos e Casos Técnicos em Destaque */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projetos & Estudos de Caso em Destaque</Text>
            {projects.map((proj) => {
              const techNames = (proj.technologies || [])
                .map((t: any) => (typeof t === 'string' ? t : t.name))
                .join(' • ');

              return (
                <View key={proj.slug || proj.title} style={styles.projectCard} wrap={false}>
                  <View style={styles.projectHeaderRow}>
                    <Text style={styles.projectTitle}>{proj.title}</Text>
                    {proj.badge && (
                      <Text style={styles.projectBadge}>{proj.badge}</Text>
                    )}
                  </View>

                  <Text style={styles.projectSubtitle}>
                    {proj.category} — {proj.subtitle}
                  </Text>

                  {proj.problem && (
                    <View style={styles.probSolRow}>
                      <Text style={styles.probSolText}>
                        <Text style={styles.probSolLabel}>Problema: </Text>
                        {proj.problem}
                      </Text>
                    </View>
                  )}

                  {proj.solution && (
                    <View style={styles.probSolRow}>
                      <Text style={styles.probSolText}>
                        <Text style={styles.probSolLabel}>Solução: </Text>
                        {proj.solution}
                      </Text>
                    </View>
                  )}

                  {proj.architecture?.highlights && proj.architecture.highlights.length > 0 && (
                    <View style={{ marginTop: 2, marginBottom: 2 }}>
                      <Text style={styles.probSolLabel}>Destaques Arquiteturais:</Text>
                      {proj.architecture.highlights.slice(0, 3).map((h: string, i: number) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {techNames ? (
                    <View style={styles.techStackRow}>
                      <Text style={styles.techLabel}>Tecnologias: </Text>
                      <Text style={styles.techList}>{techNames}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        {/* 6. Infraestrutura & Operações */}
        {infrastructureAreas && infrastructureAreas.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Infraestrutura & Operações</Text>
            {infrastructureAreas.map((area: any) => (
              <View key={area.id || area.areaName} style={styles.infraAreaBlock}>
                <Text style={styles.infraAreaName}>{area.areaName}</Text>
                {(area.items || []).map((item: any) => (
                  <Text key={item.id || item.technology} style={styles.infraItemRow}>
                    • <Text style={styles.infraTechName}>{item.technology}: </Text>
                    {item.purpose || item.appliedContext}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* 7. Competências Técnicas & Contexto Real */}
        {skillCategories && skillCategories.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Competências Técnicas & Contexto Prático</Text>
            {skillCategories.map((cat) => (
              <View key={cat.id || cat.title} style={styles.skillCategoryBox}>
                <Text style={styles.skillCategoryHeading}>{cat.title}</Text>
                {(cat.skills || []).map((s: any) => (
                  <Text key={s.name} style={styles.skillItemInline}>
                    • <Text style={{ fontFamily: 'Helvetica-Bold', color: '#111827' }}>{s.name}: </Text>
                    {s.appliedContext}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* 8. Formação Acadêmica & Certificações */}
        <View style={[styles.section, styles.grid2Col]} wrap={false}>
          {profile.education && profile.education.length > 0 && (
            <View style={styles.colHalf}>
              <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
              {profile.education.map((edu) => (
                <View key={edu.id || edu.field} style={styles.eduBlock}>
                  <View style={styles.expHeaderRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eduDegree}>
                        {edu.degree} — {edu.field}
                      </Text>
                      <Text style={styles.eduInstitution}>{edu.institution}</Text>
                    </View>
                    <Text style={styles.eduPeriod}>
                      {edu.period} {edu.status ? `(${edu.status})` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <View style={styles.colHalf}>
              <Text style={styles.sectionTitle}>Certificações</Text>
              {profile.certifications.map((cert) => (
                <View key={cert.id || cert.name} style={styles.certRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  </View>
                  <Text style={styles.certYear}>{cert.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Rodapé com Link e QR Code */}
        <View style={styles.footer} fixed>
          <View style={styles.footerTextContainer}>
            <Text style={styles.footerTitle}>
              Interactive CV & Portfólio de Daniel Santos
            </Text>
            <Text style={styles.footerSubtext}>
              Acesse a versão interativa com métricas em tempo real:{' '}
              <Link style={styles.footerLink} src={siteUrl}>{siteUrl}</Link>
            </Text>
          </View>

          {qrCodeDataUrl ? (
            <View style={styles.qrContainer}>
              <Image src={qrCodeDataUrl} style={styles.qrImg} />
            </View>
          ) : null}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};

