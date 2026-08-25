import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { PortfolioData } from './types.ts';

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  // Capa / Hero Header Block
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 14,
    backgroundColor: '#e2e8f0',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#60a5fa',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  heroContent: {
    flex: 1,
  },
  heroName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  heroRole: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  heroContactsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 7.5,
    color: '#475569',
  },
  contactItemText: {
    fontSize: 7.5,
    color: '#475569',
  },
  contactSeparator: {
    fontSize: 7.5,
    color: '#94a3b8',
    marginHorizontal: 3,
  },
  contactLink: {
    fontSize: 7.5,
    color: '#2563eb',
    textDecoration: 'none',
  },
  // Composition focus bar
  compositionBox: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 0.75,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  compositionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  compositionLabelLeft: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
  },
  compositionLabelRight: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#047857',
  },
  compositionDesc: {
    fontSize: 7.5,
    color: '#475569',
    lineHeight: 1.25,
  },
  // Section Headers
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 2,
    marginBottom: 6,
  },
  bioParagraph: {
    fontSize: 8,
    lineHeight: 1.35,
    color: '#334155',
    marginBottom: 4,
    textAlign: 'justify',
  },
  // Experiences
  expCard: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  expRole: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  expCompany: {
    fontSize: 8,
    color: '#475569',
  },
  expPeriod: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  expSummary: {
    fontSize: 7.5,
    color: '#475569',
    marginBottom: 3,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 1.5,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 8,
    color: '#2563eb',
  },
  bulletText: {
    flex: 1,
    fontSize: 7.5,
    color: '#334155',
    lineHeight: 1.25,
  },
  // Projects Cards
  projectCard: {
    backgroundColor: '#fafaf9',
    borderColor: '#e2e8f0',
    borderWidth: 0.75,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  projectBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  projectSubtitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    marginBottom: 3,
  },
  probSolRow: {
    marginBottom: 3,
  },
  probSolLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  probSolText: {
    fontSize: 7.5,
    color: '#334155',
    lineHeight: 1.25,
  },
  projectTechList: {
    fontSize: 7,
    color: '#64748b',
    marginTop: 2,
  },
  // Infra & Skills
  infraAreaBlock: {
    marginBottom: 6,
  },
  infraAreaName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  infraItemRow: {
    fontSize: 7.5,
    color: '#334155',
    marginBottom: 2,
    paddingLeft: 4,
  },
  infraTechName: {
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
  },
  skillCategoryBox: {
    marginBottom: 4,
  },
  skillCategoryHeading: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 1,
  },
  skillItemInline: {
    fontSize: 7.5,
    color: '#475569',
    paddingLeft: 4,
    marginBottom: 2,
  },
  // Education & Certs
  grid2Col: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colHalf: {
    width: '48%',
  },
  // Footer with QR Code
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.75,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  footerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  footerTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  footerSubtext: {
    fontSize: 6.5,
    color: '#64748b',
    marginTop: 1,
  },
  qrContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImg: {
    width: 32,
    height: 32,
  },
  pageNumber: {
    fontSize: 7,
    color: '#94a3b8',
    marginLeft: 8,
  },
});

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
        {/* 1. Capa / Header com Foto e Dados */}
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

          <View style={styles.heroContent}>
            <Text style={styles.heroName}>{profile.name}</Text>
            <Text style={styles.heroRole}>
              {profile.currentRole} • Transição para {profile.targetRole}
            </Text>

            <View style={styles.heroContactsRow}>
              {contactItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Text style={styles.contactSeparator}> • </Text>}
                  {item}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>

        {/* 2. Composição de Atuação Técnica (60/40) */}
        {profile.workFocus && (
          <View style={styles.compositionBox}>
            <View style={styles.compositionTitleRow}>
              <Text style={styles.compositionLabelLeft}>
                60% {profile.workFocus.infraLabel || 'Infraestrutura & Redes'}
              </Text>
              <Text style={styles.compositionLabelRight}>
                40% {profile.workFocus.systemsLabel || 'Sistemas & Desenvolvimento'}
              </Text>
            </View>
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

        {/* 4. Experiência Profissional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          {experiences.map((exp) => (
            <View key={exp.id || exp.role} style={styles.expCard} wrap={false}>
              <View style={styles.expHeader}>
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
                <View style={[styles.bulletRow, { marginTop: 3 }]}>
                  <Text style={[styles.bulletText, { fontSize: 7, color: '#64748b' }]}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', color: '#475569' }}>
                      Stack:{' '}
                    </Text>
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
                          <Text style={[styles.bulletPoint, { color: '#059669' }]}>•</Text>
                          <Text style={styles.bulletText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {techNames ? (
                    <Text style={styles.projectTechList}>
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>Tecnologias: </Text>
                      {techNames}
                    </Text>
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
                    • <Text style={{ fontFamily: 'Helvetica-Bold' }}>{s.name}: </Text>
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
                <View key={edu.id || edu.field} style={{ marginBottom: 4 }}>
                  <Text style={styles.expRole}>
                    {edu.degree} — {edu.field}
                  </Text>
                  <Text style={styles.expCompany}>{edu.institution}</Text>
                  <Text style={styles.expPeriod}>
                    {edu.period} {edu.status ? `(${edu.status})` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <View style={styles.colHalf}>
              <Text style={styles.sectionTitle}>Certificações</Text>
              {profile.certifications.map((cert) => (
                <View key={cert.id || cert.name} style={{ marginBottom: 4 }}>
                  <Text style={styles.expRole}>{cert.name}</Text>
                  <Text style={styles.expCompany}>
                    {cert.issuer} • {cert.year}
                  </Text>
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
              Acesse a versão interativa completa com métricas e logs em tempo real:{' '}
              <Link style={styles.contactLink} src={siteUrl}>{siteUrl}</Link>
            </Text>
          </View>

          {qrCodeDataUrl ? (
            <View style={styles.qrContainer}>
              <Image src={qrCodeDataUrl} style={styles.qrImg} />
            </View>
          ) : null}

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
