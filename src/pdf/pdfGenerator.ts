import { pdf } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import React from 'react';
import { ResumeDocument } from './ResumeDocument.tsx';
import { PortfolioDocument } from './PortfolioDocument.tsx';
import { ResumeData, PortfolioData } from './types.ts';
import { ContentContextType } from '../content/ContentProvider.tsx';

/**
 * Formats current date as YYYY-MM
 */
export function getCurrentDateSlug(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Triggers a browser download from a Blob
 */
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates and downloads the Formato 1 - Currículo Tradicional (ATS)
 */
export async function downloadResumePdf(content: ContentContextType): Promise<void> {
  const dateSlug = getCurrentDateSlug();
  const fileName = `curriculo-daniel-santos-${dateSlug}.pdf`;
  const siteUrl = window.location.origin;

  const data: ResumeData = {
    profile: content.profile,
    experiences: content.experiences,
    skillCategories: content.skillCategories,
    contact: content.contact,
    siteUrl,
    generatedDate: new Date().toLocaleDateString('pt-BR'),
  };

  const doc = React.createElement(ResumeDocument, { data });
  const blob = await pdf(doc).toBlob();
  downloadBlob(blob, fileName);
}

/**
 * Generates and downloads the Formato 2 - Portfólio Completo
 */
export async function downloadPortfolioPdf(content: ContentContextType): Promise<void> {
  const dateSlug = getCurrentDateSlug();
  const fileName = `portfolio-daniel-santos-${dateSlug}.pdf`;
  const siteUrl = window.location.origin;

  // Generate dynamic QR Code pointing to the live site
  let qrCodeDataUrl: string | undefined;
  try {
    qrCodeDataUrl = await QRCode.toDataURL(siteUrl, {
      width: 120,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.warn('Could not generate QR Code for PDF:', err);
  }

  const data: PortfolioData = {
    profile: content.profile,
    experiences: content.experiences,
    projects: content.projects,
    infrastructureAreas: content.infrastructureAreas,
    skillCategories: content.skillCategories,
    contact: content.contact,
    siteUrl,
    qrCodeDataUrl,
    generatedDate: new Date().toLocaleDateString('pt-BR'),
  };

  const doc = React.createElement(PortfolioDocument, { data });
  const blob = await pdf(doc).toBlob();
  downloadBlob(blob, fileName);
}
