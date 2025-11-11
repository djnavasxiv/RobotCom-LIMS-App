import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export class PrintingService {
  public static async printComponent(componentId: string, documentTitle: string): Promise<void> {
    const input = document.getElementById(componentId);
    if (!input) {
      throw new Error(`Component with id ${componentId} not found.`);
    }

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    // Instead of saving, we'll send the data to the main process to print
    const pdfData = pdf.output('arraybuffer');

    await window.electronAPI.printPDF(pdfData);
  }
}
