import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Response } from '@/lib/types/survey';

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data to Excel format
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Data') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export multiple sheets to Excel
 */
export function exportMultipleSheetsToExcel(
  sheets: Array<{ name: string; data: any[] }>,
  filename: string
) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export chart element to PNG
 */
export async function exportChartToPNG(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2, // Higher quality
  });

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `${filename}.png`);
    }
  });
}

/**
 * Export multiple charts to PDF
 */
export async function exportChartsToPDF(
  elementIds: string[],
  filename: string,
  title: string
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  // Add title
  pdf.setFontSize(20);
  pdf.text(title, margin, margin);

  // Add timestamp
  pdf.setFontSize(10);
  pdf.text(`Generert: ${new Date().toLocaleDateString('nb-NO')}`, margin, margin + 7);

  let yPosition = margin + 15;

  for (let i = 0; i < elementIds.length; i++) {
    const element = document.getElementById(elementIds[i]);
    if (!element) continue;

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Check if we need a new page
    if (yPosition + imgHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    yPosition += imgHeight + 10;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * Flatten survey responses for Excel export
 */
export function flattenResponses(responses: Response[]): any[] {
  return responses.map((response, index) => {
    const {
      metadata,
      demografi,
      navaerende_bolig,
      flytteplaner,
      okonomi,
      diverse,
      arbeid,
    } = response.data;

    const flatData: any = {
      'Respondent ID': index + 1,
      'Timestamp': metadata?.starttidspunkt || '',
    };

    // Demografi
    flatData['Alder'] = demografi.hva_er_din_alder || '';
    flatData['Kjønn'] = demografi.kjønn || '';
    flatData['Husstand'] = demografi.hvordan_ser_din_husstand_ut || '';
    flatData['Livssituasjon'] = demografi.hva_er_din_livssituasjon || '';
    flatData['Antall barn'] = demografi.hvor_mange_barn_bor_i_din_husstand || '';

    // Nåværende bolig
    flatData['Eier/Leier'] = navaerende_bolig.eier_eller_leier_du_boligen_du_bor_i || '';
    flatData['Boligtype'] = diverse.hva_slags_type_bosted_har_du_nå || '';
    flatData['Fornøydhet'] = navaerende_bolig.hvor_fornøyd_er_du_med_din_nåværende_bosituasjon || '';
    flatData['Bostedsadresse'] = navaerende_bolig.har_du_registrert_bostedsadresse_i_rendalen_kommune_i_dag || '';

    // Flytteplaner
    flatData['Flytteplaner'] = flytteplaner.har_du_planer_om_å_flytte_på_deg || '';
    flatData['Destinasjoner'] = flytteplaner.hvor_kunne_du_tenke_deg_å_bo_hvis_du_skulle_flytte_til_eller_innad_i_rendalen_kommune_flere_svar_mul || '';

    // Økonomi
    flatData['Kjøpekraft'] = okonomi.dersom_du_skulle_kjøpe_bolig_hva_er_din_anslåtte_maksimale_kjøpesumbyggekostnad || '';
    flatData['Leiekraft'] = navaerende_bolig.dersom_du_skulle_leie_bolig_hva_har_du_mulighet_til_å_betale_i_månedsleie || '';
    flatData['Kjenner bostøtte'] = okonomi.bostøtte_er_en_statlig_støtteordning_for_de_med_lave_inntekter_og_høye_boutgifter_hvilken_av_disse_p || '';
    flatData['Kjenner startlån'] = okonomi.startlån_er_en_statlig_låneordning_for_alle_aldre_for_de_som_ikke_får_lån_i_ordinær_bank_hvilken_av_ || '';

    // Diverse
    flatData['Område'] = diverse.hvor_i_rendalen_kommune_bor_du || '';

    // Arbeid
    flatData['Sektor'] = arbeid.hvilken_sektor_jobber_du_i || '';

    return flatData;
  });
}

/**
 * Helper function to download blob
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prepare chart data for Excel export
 */
export function prepareChartDataForExport(
  data: Array<{ name: string; value: number }>,
  totalResponses: number
): any[] {
  return data.map(item => ({
    'Kategori': item.name,
    'Antall': item.value,
    'Andel %': ((item.value / totalResponses) * 100).toFixed(1),
  }));
}
