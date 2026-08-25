import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from './types.ts';

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 36,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.35,
    color: '#1f2937', // dark slate
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#2563eb', // royal blue
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  roleHeadline: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 8.5,
    color: '#4b5563',
    marginTop: 2,
  },
  contactItemText: {
    fontSize: 8.5,
    color: '#4b5563',
  },
  contactSeparator: {
    fontSize: 8.5,
    color: '#94a3b8',
    marginHorizontal: 3,
  },
  contactLink: {
    fontSize: 8.5,
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 0.75,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: '#374151',
    textAlign: 'justify',
  },
  expBlock: {
    marginBottom: 8,
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  expRole: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  expCompany: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#4b5563',
  },
  expPeriod: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    textAlign: 'right',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 1,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 8.5,
    color: '#2563eb',
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
    color: '#374151',
  },
  techStackRow: {
    flexDirection: 'row',
    marginTop: 3,
    paddingLeft: 4,
  },
  techLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#4b5563',
  },
  techList: {
    flex: 1,
    fontSize: 7.5,
    color: '#6b7280',
  },
  eduBlock: {
    marginBottom: 5,
  },
  eduDegree: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111827',
  },
  eduInstitution: {
    fontSize: 8.5,
    color: '#4b5563',
  },
  eduPeriod: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'right',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  certName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  certIssuer: {
    fontSize: 8,
    color: '#6b7280',
  },
  certYear: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
  },
  skillCategoryRow: {
    marginBottom: 3,
    flexDirection: 'row',
  },
  skillCategoryTitle: {
    width: 140,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  skillItemsText: {
    flex: 1,
    fontSize: 8,
    color: '#4b5563',
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    fontSize: 7.5,
    color: '#94a3b8',
  },
  footerLink: {
    color: '#2563eb',
    textDecoration: 'none',
  },
});

export const ResumeDocument: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { profile, experiences, skillCategories, contact, siteUrl } = data;
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
      title={`Currículo - ${profile.name}`}
      author={profile.name}
      subject="Currículo Profissional ATS"
      keywords="Analista de Sistemas, Infraestrutura, Suporte de TI, TypeScript, React, SQL, Redes"
    >
      <Page size="A4" style={styles.page}>
        {/* 1. Header (ATS Clean) */}
        <View style={styles.headerContainer}>
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

        {/* 2. Resumo Profissional */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Profissional</Text>
          <Text style={styles.summaryText}>
            {profile.shortSummary || (profile.fullBio && profile.fullBio[0]) || ''}
          </Text>
        </View>

        {/* 3. Experiência Profissional (max 4 bullets per role) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência Profissional</Text>
          {experiences.map((exp) => {
            const displayResponsibilities = (exp.responsibilities || []).slice(0, 4);

            return (
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

                {displayResponsibilities.map((resp, idx) => (
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
            );
          })}
        </View>

        {/* 4. Formação Acadêmica */}
        {profile.education && profile.education.length > 0 && (
          <View style={styles.section} wrap={false}>
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

        {/* 5. Certificações */}
        {profile.certifications && profile.certifications.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Certificações & Cursos Técnicos</Text>
            {profile.certifications.map((cert) => (
              <View key={cert.id || cert.name} style={styles.certRow}>
                <Text style={styles.certName}>
                  {cert.name}{' '}
                  <Text style={styles.certIssuer}>({cert.issuer})</Text>
                </Text>
                <Text style={styles.certYear}>{cert.year}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 6. Competências Técnicas */}
        {skillCategories && skillCategories.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Competências Técnicas</Text>
            {skillCategories.map((cat) => {
              const skillNames = (cat.skills || []).map((s) => s.name).join(', ');
              return (
                <View key={cat.id || cat.title} style={styles.skillCategoryRow}>
                  <Text style={styles.skillCategoryTitle}>{cat.title}:</Text>
                  <Text style={styles.skillItemsText}>{skillNames}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Rodapé Dinâmico */}
        <View style={styles.footer} fixed>
          <Text>
            Portfólio Interativo & Cases Completos:{' '}
            <Link style={styles.footerLink} src={siteUrl}>
              {siteUrl}
            </Link>
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};
