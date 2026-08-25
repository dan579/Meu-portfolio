import { StyleSheet } from '@react-pdf/renderer';

/**
 * Shared Design Tokens for PDF Generation (ATS Resume & Complete Portfolio)
 * Enforces unified typography, colors, and layout rhythm across both formats.
 */

export const pdfColors = {
  // Accent color (Strictly reserved for: Header Name, Section Titles, Right-aligned Dates, Contact Links)
  accent: '#1d4ed8', // Royal Blue
  accentDark: '#1e40af',

  // Neutral dark typography (Body, Bullets, Headings, Labels)
  textTitle: '#0f172a', // Darkest slate for names/major headings
  textHeading: '#111827', // Bold job titles, degrees, labels
  textBody: '#1f2937', // Neutral dark body text (NO BLUE)
  textMuted: '#4b5563', // Company names, locations, secondary text
  textSubtle: '#6b7280', // Dates, subtle indicators

  // Borders & Dividers
  borderPrimary: '#2563eb', // Top header bottom border
  borderSection: '#cbd5e1', // Section title underlines
  borderDivider: '#e2e8f0', // Subtle card / list item dividers
  borderSubtle: '#f1f5f9',

  // Backgrounds (Clean, print-friendly)
  bgWhite: '#ffffff',
  bgLight: '#f8fafc',
  bgCard: '#fcfcfd',
};

export const pdfStyles = StyleSheet.create({
  // Page base
  page: {
    paddingTop: 30,
    paddingBottom: 36,
    paddingHorizontal: 34,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    lineHeight: 1.35,
    color: pdfColors.textBody,
    backgroundColor: pdfColors.bgWhite,
  },

  // Header Container (Resume - ATS clean)
  headerContainer: {
    borderBottomWidth: 1.5,
    borderBottomColor: pdfColors.accent,
    paddingBottom: 8,
    marginBottom: 12,
  },

  // Hero Header Container (Portfolio - with Avatar)
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: pdfColors.accent,
    paddingBottom: 10,
    marginBottom: 12,
  },

  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: pdfColors.accent,
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
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },

  // Name (Unified across both documents)
  name: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent,
    letterSpacing: -0.2,
    lineHeight: 1.2,
    marginBottom: 5,
  },

  // Role / Subtitle Headline
  roleHeadline: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
    marginBottom: 4,
  },

  // Contact info row & items
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 8,
    color: pdfColors.textMuted,
    marginTop: 2,
  },
  contactItemText: {
    fontSize: 8,
    color: pdfColors.textMuted,
  },
  contactSeparator: {
    fontSize: 8,
    color: '#94a3b8',
    marginHorizontal: 3,
  },
  contactLink: {
    fontSize: 8,
    color: pdfColors.accent,
    textDecoration: 'none',
  },

  // Section styling (Unified title, uppercase, underline)
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent, // Highlight blue reserved for section titles
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 0.75,
    borderBottomColor: pdfColors.borderSection,
    paddingBottom: 2.5,
    marginBottom: 7,
  },

  // Summary / Bio Paragraphs
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: pdfColors.textBody,
    textAlign: 'justify',
  },
  bioParagraph: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: pdfColors.textBody,
    marginBottom: 4,
    textAlign: 'justify',
  },

  // Experience block & item spacing
  expBlock: {
    marginBottom: 12, // Increased spacing between roles for clear breathing room
    paddingBottom: 4,
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
    color: pdfColors.textHeading,
  },
  expCompany: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: pdfColors.textMuted,
    marginTop: 1,
  },
  expPeriod: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent, // Highlight blue reserved for right-aligned dates
    textAlign: 'right',
  },
  expSummary: {
    fontSize: 8,
    color: pdfColors.textMuted,
    marginBottom: 3,
    fontStyle: 'italic',
  },

  // Bullets (Neutral text, dark bullet dot)
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 1,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 8,
    fontSize: 8,
    color: pdfColors.textMuted, // Neutral dark bullet dot
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
    color: pdfColors.textBody, // Neutral dark body text
  },

  // Tech Stack Row (Neutral label & list)
  techStackRow: {
    flexDirection: 'row',
    marginTop: 3.5,
    paddingLeft: 4,
  },
  techLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading, // Neutral bold text
  },
  techList: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: pdfColors.textBody, // Neutral regular text
  },

  // Focus / Composição de Atuação (Integrated document layout without web card / percentages)
  compositionContainer: {
    borderTopWidth: 0.75,
    borderBottomWidth: 0.75,
    borderColor: pdfColors.borderDivider,
    paddingVertical: 6,
    marginBottom: 10,
  },
  compositionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  compositionPillarTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  compositionDesc: {
    fontSize: 8,
    color: pdfColors.textBody,
    lineHeight: 1.3,
  },

  // Project Cards (Portfolio)
  projectCard: {
    borderBottomWidth: 0.75,
    borderBottomColor: pdfColors.borderDivider,
    paddingBottom: 8,
    marginBottom: 8,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1.5,
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  projectBadge: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent,
  },
  projectSubtitle: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: pdfColors.textMuted,
    marginBottom: 3,
  },
  probSolRow: {
    marginBottom: 2.5,
  },
  probSolLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  probSolText: {
    fontSize: 8,
    color: pdfColors.textBody,
    lineHeight: 1.3,
  },

  // Infrastructure items (Portfolio)
  infraAreaBlock: {
    marginBottom: 6,
  },
  infraAreaName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
    marginBottom: 2,
  },
  infraItemRow: {
    fontSize: 8,
    color: pdfColors.textBody,
    marginBottom: 2,
    paddingLeft: 4,
    lineHeight: 1.3,
  },
  infraTechName: {
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },

  // Education & Certifications
  eduBlock: {
    marginBottom: 6,
  },
  eduDegree: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  eduInstitution: {
    fontSize: 8.5,
    color: pdfColors.textMuted,
  },
  eduPeriod: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent,
    textAlign: 'right',
  },
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3.5,
  },
  certName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  certIssuer: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: pdfColors.textMuted,
  },
  certYear: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.accent,
  },

  // Skills
  skillCategoryRow: {
    marginBottom: 3.5,
    flexDirection: 'row',
  },
  skillCategoryTitle: {
    width: 140,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  skillItemsText: {
    flex: 1,
    fontSize: 8,
    color: pdfColors.textBody,
  },
  skillCategoryBox: {
    marginBottom: 4,
  },
  skillCategoryHeading: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
    marginBottom: 1.5,
  },
  skillItemInline: {
    fontSize: 8,
    color: pdfColors.textBody,
    paddingLeft: 4,
    marginBottom: 2,
    lineHeight: 1.3,
  },

  // 2-column layout helper
  grid2Col: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colHalf: {
    width: '48%',
  },

  // Footer (Standardized across both)
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 34,
    right: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: pdfColors.borderDivider,
    paddingTop: 6,
    fontSize: 7.5,
    color: '#94a3b8',
  },
  footerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  footerTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: pdfColors.textHeading,
  },
  footerSubtext: {
    fontSize: 6.5,
    color: pdfColors.textMuted,
    marginTop: 1,
  },
  footerLink: {
    color: pdfColors.accent,
    textDecoration: 'none',
  },
  qrContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  qrImg: {
    width: 28,
    height: 28,
  },
  pageNumber: {
    fontSize: 7.5,
    color: '#94a3b8',
  },
});
